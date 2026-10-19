"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { SITE_CONFIG } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IncrementalSSEParser } from "@/lib/sse-parser";
import { parseProblemDetails } from "@/lib/problem-details";
import {
  Bot,
  User,
  Send,
  X,
  Trash2,
  StopCircle,
  AlertCircle,
  Calendar,
  Sparkles,
  CornerDownLeft,
} from "lucide-react";

export interface ChatMessageState {
  id: string;
  role: "user" | "model";
  content: string;
}

interface ChatDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function ChatDrawer({ open, onClose }: ChatDrawerProps) {
  const [messages, setMessages] = useState<ChatMessageState[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom of conversation
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (open) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open, messages, scrollToBottom]);

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  const handleStopStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
  };

  const handleClear = () => {
    handleStopStream();
    setMessages([]);
    setErrorMessage(null);
  };

  const handleSendPrompt = async (promptText: string) => {
    const text = promptText.trim();
    if (!text || isStreaming) return;

    if (text.length > 2000) {
      setErrorMessage("Message exceeds 2000 character limit.");
      return;
    }

    setErrorMessage(null);
    setInput("");

    const userMessageId = Math.random().toString(36).slice(2, 9);
    const userMessage: ChatMessageState = {
      id: userMessageId,
      role: "user",
      content: text,
    };

    const newConversation = [...messages, userMessage];
    setMessages(newConversation);

    // Placeholder for model streaming response
    const assistantMessageId = Math.random().toString(36).slice(2, 9);
    const assistantMessage: ChatMessageState = {
      id: assistantMessageId,
      role: "model",
      content: "",
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsStreaming(true);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      // Backend contract requires role: "user" | "model", max 20 messages, total <= 12,000 chars
      const payloadMessages = newConversation.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/v1/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream, application/problem+json",
        },
        body: JSON.stringify({ messages: payloadMessages }),
        signal: abortController.signal,
      });

      // Handle pre-stream errors (RFC 9457 Problem Details)
      if (!res.ok) {
        const problem = await parseProblemDetails(
          res,
          "Failed to establish AI stream"
        );
        const retryNote = problem.retryAfterSeconds
          ? ` (Retry in ${problem.retryAfterSeconds}s)`
          : "";
        setErrorMessage(`${problem.detail}${retryNote}`);

        // Remove empty assistant placeholder on immediate error
        setMessages((prev) => prev.filter((m) => m.id !== assistantMessageId));
        setIsStreaming(false);
        return;
      }

      if (!res.body) {
        throw new Error("No response stream body returned by upstream server");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      const sseParser = new IncrementalSSEParser();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunkText = decoder.decode(value, { stream: true });
        const events = sseParser.feed(chunkText);

        for (const ev of events) {
          if (ev.event === "error") {
            try {
              const errPayload = JSON.parse(ev.data);
              setErrorMessage(
                errPayload.detail || "AI upstream generation interrupted."
              );
            } catch {
              setErrorMessage("AI upstream generation interrupted.");
            }
            break;
          }

          if (ev.data === "[DONE]") {
            // Terminal token reached
            break;
          }

          try {
            const dataObj = JSON.parse(ev.data);
            if (typeof dataObj.text === "string") {
              accumulated += dataObj.text;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessageId
                    ? { ...m, content: accumulated }
                    : m
                )
              );
            }
          } catch {
            // Malformed chunk ignored
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        // Stream aborted intentionally by user
      } else {
        setErrorMessage(
          "Connection to AI stream failed. No automatic retry per zero-drift policy."
        );
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendPrompt(input);
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-title"
      className="fixed inset-0 z-50 flex justify-end"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Surface */}
      <div className="relative z-10 w-full max-w-xl h-full flex flex-col bg-canvas-subtle border-l border-surface-border shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border bg-surface-base">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-surface-elevated border border-accent-cyan/30 flex items-center justify-center text-accent-cyan">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="chat-title"
                  className="text-sm font-semibold text-slate-100"
                >
                  Said Khan AI Persona
                </h2>
                <Badge variant="cyan" className="text-[9px] px-1.5 py-0">
                  GROUNDED
                </Badge>
              </div>
              <p className="text-[11px] font-mono text-telemetry-dim">
                Architectural Invariant & Systems Advisory Assistant
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                title="Clear conversation"
                aria-label="Clear conversation history"
                className="p-1.5 rounded text-slate-400 hover:text-slate-100 hover:bg-surface-elevated transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close AI Persona drawer"
              className="p-1.5 rounded text-slate-400 hover:text-slate-100 hover:bg-surface-elevated transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Conversation Stream Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.length === 0 ? (
            /* Grounded Welcome & Quick Chips */
            <div className="py-6 space-y-6">
              <div className="p-4 rounded-lg bg-surface-base border border-surface-border space-y-2.5">
                <div className="flex items-center gap-2 text-accent-emerald text-xs font-mono font-semibold">
                  <Sparkles className="h-4 w-4" />
                  <span>GROUNDED CONVERSATION RUNTIME</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  Welcome. I am the AI assistant representing Said Khan. I am
                  strictly grounded in Said&apos;s verified architecture projects,
                  engineering philosophies, and system design patterns.
                </p>
                <p className="text-[11px] text-telemetry-dim font-mono">
                  All responses are generated in real time via Gemini 2.0 Flash
                  with zero hallucination invariants.
                </p>
              </div>

              {/* Exactly 3 Grounded Quick Chips (Section 9) */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase text-telemetry-dim block">
                  Recommended Architecture Prompts:
                </span>
                <div className="flex flex-col gap-2">
                  {SITE_CONFIG.quickPrompts.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSendPrompt(item.prompt)}
                      className="text-left p-3 rounded-lg border border-surface-border bg-surface-base/80 hover:bg-surface-elevated hover:border-accent-cyan/40 transition-all duration-150 group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono text-accent-cyan font-medium">
                          {item.label}
                        </span>
                        <CornerDownLeft className="h-3 w-3 text-slate-500 group-hover:text-accent-cyan transition-colors" />
                      </div>
                      <p className="text-xs text-slate-300 line-clamp-2">
                        {item.prompt}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Render Messages */
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  {msg.role === "user" ? (
                    <>
                      <span className="text-[10px] font-mono text-telemetry-dim">
                        VISITOR
                      </span>
                      <User className="h-3 w-3 text-slate-400" />
                    </>
                  ) : (
                    <>
                      <Bot className="h-3 w-3 text-accent-cyan" />
                      <span className="text-[10px] font-mono text-accent-cyan">
                        SAID KHAN AI PERSONA
                      </span>
                    </>
                  )}
                </div>

                <div
                  className={`max-w-[90%] sm:max-w-[85%] rounded-lg px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-accent-emerald text-white font-normal"
                      : "bg-surface-base border border-surface-border text-slate-200"
                  }`}
                >
                  {msg.role === "user" ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : msg.content.length === 0 && isStreaming ? (
                    <div className="flex items-center gap-2 text-slate-400 font-mono text-xs py-1">
                      <span className="inline-block w-2 h-2 rounded-full bg-accent-cyan animate-ping" />
                      <span>Synthesizing architectural reasoning...</span>
                    </div>
                  ) : (
                    <div className="markdown-prose space-y-2 text-xs sm:text-sm">
                      {/* Safe ReactMarkdown rendering without dangerouslySetInnerHTML */}
                      <ReactMarkdown
                        components={{
                          h1: ({ ...props }) => (
                            <h1 className="text-base font-bold text-white mt-2 mb-1" {...props} />
                          ),
                          h2: ({ ...props }) => (
                            <h2 className="text-sm font-semibold text-slate-100 mt-2 mb-1" {...props} />
                          ),
                          h3: ({ ...props }) => (
                            <h3 className="text-xs font-semibold text-accent-cyan mt-1 mb-0.5" {...props} />
                          ),
                          p: ({ ...props }) => <p className="mb-2 leading-relaxed" {...props} />,
                          ul: ({ ...props }) => <ul className="list-disc pl-4 space-y-1 my-1" {...props} />,
                          ol: ({ ...props }) => <ol className="list-decimal pl-4 space-y-1 my-1" {...props} />,
                          li: ({ ...props }) => <li className="text-slate-300" {...props} />,
                          code: ({ className, children, ...props }) => {
                            const isInline = !className;
                            return isInline ? (
                              <code
                                className="px-1.5 py-0.5 rounded bg-surface-elevated font-mono text-accent-cyan text-xs"
                                {...props}
                              >
                                {children}
                              </code>
                            ) : (
                              <pre className="p-3 my-2 rounded-md bg-canvas-deep border border-surface-border overflow-x-auto font-mono text-xs text-slate-200">
                                <code>{children}</code>
                              </pre>
                            );
                          },
                          blockquote: ({ ...props }) => (
                            <blockquote
                              className="border-l-2 border-accent-emerald pl-3 my-2 text-slate-400 italic"
                              {...props}
                            />
                          ),
                          a: ({ href, children, ...props }) => (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-accent-cyan underline hover:text-white"
                              {...props}
                            >
                              {children}
                            </a>
                          ),
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                      {isStreaming && msg.id === messages[messages.length - 1]?.id && (
                        <span className="inline-block w-1.5 h-3.5 bg-accent-cyan animate-pulse ml-0.5 align-middle" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {/* Operational Error Message Banner */}
          {errorMessage && (
            <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <div className="flex-1">
                <p>{errorMessage}</p>
                <div className="mt-2">
                  <a
                    href={SITE_CONFIG.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-accent-cyan hover:underline text-[11px]"
                  >
                    <Calendar className="h-3 w-3" />
                    <span>Schedule Direct Architecture Consultation</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar & Controls */}
        <div className="p-4 border-t border-surface-border bg-surface-base">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt(input);
            }}
            className="space-y-2.5"
          >
            <div className="relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isStreaming
                    ? "Generating AI architecture response..."
                    : "Ask Said Khan's AI persona about system design..."
                }
                disabled={isStreaming}
                rows={2}
                maxLength={2000}
                className="w-full rounded-md border border-surface-border bg-canvas-subtle p-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/30 disabled:opacity-50 resize-none"
              />

              <div className="absolute right-2 bottom-2.5 flex items-center gap-1.5">
                {isStreaming ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleStopStream}
                    className="h-7 px-2 text-xs gap-1 border-rose-500/40 text-rose-300 hover:bg-rose-500/10"
                  >
                    <StopCircle className="h-3.5 w-3.5" />
                    <span>Stop</span>
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={!input.trim()}
                    className="h-7 px-2.5 text-xs gap-1.5"
                  >
                    <span>Send</span>
                    <Send className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-telemetry-dim">
              <span>Shift+Enter for newline // Enter to send</span>
              <span>{input.length}/2000 chars</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
