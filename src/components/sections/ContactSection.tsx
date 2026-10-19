"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { parseProblemDetails } from "@/lib/problem-details";
import { Send, ShieldAlert, CheckCircle2 } from "lucide-react";

export function ContactSection() {
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    website: "", // Invisible honeypot trap
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError(null);

    // Client-side quick validation matching backend Zod schema
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) {
      errors.name = "Full name is required";
    } else if (formData.name.length > 100) {
      errors.name = "Name cannot exceed 100 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Work email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "A valid work email is required";
    } else if (formData.email.length > 254) {
      errors.email = "Email cannot exceed 254 characters";
    }

    if (!formData.message.trim() || formData.message.length < 10) {
      errors.message = "Architecture requirements must be at least 10 characters";
    } else if (formData.message.length > 2000) {
      errors.message = "Requirements cannot exceed 2000 characters";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/v1/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 202) {
        setSubmitted(true);
        addToast({
          type: "success",
          title: "Inquiry Dispatched Successfully",
          detail:
            "Your technical brief has been received and queued for Said Khan's review.",
        });
        setFormData({ name: "", email: "", message: "", website: "" });
      } else {
        const problem = await parseProblemDetails(
          response,
          "Failed to submit message"
        );

        if (problem.errors && problem.errors.length > 0) {
          const mappedErrors: Record<string, string> = {};
          for (const err of problem.errors) {
            mappedErrors[err.field] = err.message;
          }
          setFieldErrors(mappedErrors);
        }

        const retryMsg = problem.retryAfterSeconds
          ? ` (Retry available in ${problem.retryAfterSeconds}s)`
          : "";
        setGeneralError(`${problem.detail}${retryMsg}`);

        addToast({
          type: "error",
          title: problem.title,
          detail: `${problem.detail}${retryMsg}`,
        });
      }
    } catch {
      const networkMsg =
        "Network connection interrupted. Please verify connectivity and try again.";
      setGeneralError(networkMsg);
      addToast({
        type: "error",
        title: "Communication Failure",
        detail: networkMsg,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="border-t border-white/10 py-28 sm:py-36">
      {/* Centered Technical Inquiry Form Container: max-w-2xl mx-auto px-6 */}
      <div className="max-w-2xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-6 text-center font-sans">
            Technical Inquiry & Consultation
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-normal font-sans">
            Direct inquiry channel for AI solutions, full-stack systems engineering, and workflow automation.
          </p>
        </div>

        {/* Form Card: Sharp Rectangular Box Container */}
        <Card className="rounded-none border border-white/10 bg-zinc-950 p-8 shadow-2xl hover:border-red-500/30 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] transition-all">
          {submitted ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-100 font-sans">
                Message Queued & Dispatched
              </h3>
              <p className="text-sm text-zinc-300 max-w-md mx-auto leading-relaxed font-sans">
                Your technical brief has been received and stored in PostgreSQL.
                Said Khan will review and reply within 24 business hours.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSubmitted(false)}
                className="mt-4 rounded-none border border-white/10 hover:border-red-500/30"
              >
                Send Additional Brief
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {generalError && (
                <div className="p-3.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-start gap-2.5">
                  <ShieldAlert className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                  <span>{generalError}</span>
                </div>
              )}

              {/* Honeypot anti-spam field: Hidden visually and from screen readers */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website-field">Leave blank</label>
                <input
                  id="website-field"
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-mono uppercase text-zinc-300 mb-1.5"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="contact-name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    error={fieldErrors.name}
                    disabled={submitting}
                    className="rounded-none border border-white/10 bg-zinc-900/80 focus:border-red-500 focus:ring-0 text-white"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-mono uppercase text-zinc-300 mb-1.5"
                  >
                    Work Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="engineer@enterprise.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    error={fieldErrors.email}
                    disabled={submitting}
                    className="rounded-none border border-white/10 bg-zinc-900/80 focus:border-red-500 focus:ring-0 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-mono uppercase text-zinc-300 mb-1.5"
                >
                  Architecture Requirements{" "}
                  <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="contact-message"
                  placeholder="Outline system requirements, AI automation scope, or technical inquiries..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  error={fieldErrors.message}
                  disabled={submitting}
                  className="rounded-none border border-white/10 bg-zinc-900/80 focus:border-red-500 focus:ring-0 text-white"
                  rows={5}
                  required
                />
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={submitting}
                  className="rounded-none bg-red-600 hover:bg-red-500 text-white font-semibold w-full py-3.5 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] gap-2 flex items-center justify-center active:scale-[0.98]"
                >
                  <Send className="h-4 w-4" />
                  <span>Dispatch Technical Brief</span>
                </Button>
                <div className="text-center">
                  <span className="text-[11px] font-mono text-telemetry-dim">
                    Rate limit: 3 requests / hr per IP hash
                  </span>
                </div>
              </div>
            </form>
          )}
        </Card>
      </div>
    </section>
  );
}
