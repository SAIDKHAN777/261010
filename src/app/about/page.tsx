import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DownloadCvButton } from "@/components/ui/DownloadCvButton";

export const metadata: Metadata = {
  title: "About Said Khan — AI Engineer & Full-Stack Developer",
  description:
    "Detailed biography and background of Said Khan, AI Engineer, AI Automation Expert, Full Stack Developer, and Digital Marketing Expert.",
};

export default function AboutPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-canvas-deep">
      {/* Ultra-Clean Minimal Top Navigation: '← Back to Home' on left, 'Download CV' & 'Consultation' on right */}
      <header className="w-full px-6 sm:px-12 py-5 flex items-center justify-between border-b border-white/10 bg-black/60 backdrop-blur-md sticky top-0 z-50">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors font-sans group"
        >
          <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        {/* Right Corner: Sleek 'Download CV' action button alongside Consultation CTA */}
        <div className="flex items-center gap-3 sm:gap-4">
          <DownloadCvButton />

          <Link href="/#contact" className="inline-flex">
            <Button
              variant="primary"
              size="sm"
              className="rounded-none bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-2.5 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] text-xs sm:text-sm active:scale-[0.98]"
            >
              Consultation
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content: Two-Column Executive Grid */}
      <main className="max-w-7xl mx-auto px-6 py-16 sm:py-24 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column (Col Span: 7): Direct Introduction & Full Biography */}
        <div className="lg:col-span-7">
          {/* Headline: Starts Immediately with 'Hi, I’m Said Khan.' */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-6 font-sans">
            Hi, I’m Said Khan.
          </h1>

          {/* Complete Detailed Article */}
          <div className="text-lg text-zinc-300 space-y-6 font-normal font-sans leading-relaxed">
            <p>
              Hi, I&apos;m Said Khan, an AI Engineer, AI Automation Expert, Full Stack Developer, and Digital Marketing Expert. What drives me most is using technology to make people&apos;s work simpler, faster, and more effective.
            </p>
            <p>
              I work with AI and modern software technology to build meaningful digital solutions: complete software applications, powerful backend systems, thoughtful frontend experiences, AI-powered platforms, automation systems, and personal AI agents. I enjoy bringing ideas to life and turning real challenges into practical solutions.
            </p>
            <p>
              I believe good software is about more than simply making something work. It should begin with understanding people and their needs. That&apos;s why I take time to see the bigger picture before building anything. My goal is to create something that feels natural to use, solves a genuine need, and keeps delivering value over time.
            </p>
            <p>
              Alongside technology, I have strong expertise in Digital Marketing. Building a great product is only part of the journey. Reaching the right people, building meaningful connections with an audience, and creating a strong digital presence matter just as much.
            </p>
            <p>
              I&apos;m naturally curious and love exploring what can be achieved with AI and modern technology. For me, every project is an opportunity to learn, create, and make something worthwhile.
            </p>
            <p className="text-zinc-200 font-medium">
              If you have an idea, a challenge to solve, or something you&apos;ve been wanting to build, I&apos;d be glad to help turn that vision into reality.
            </p>
          </div>

          {/* STRICT PLACEMENT: Branded Social Connect Cards (Directly Below Finished Article) */}
          <div className="mt-10 pt-8 border-t border-white/10">
            <p className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-4 font-sans">
              Follow me elsewhere
            </p>

            {/* STRICT PLACEMENT: Branded Social Connect Cards (Stacked Vertically) */}
            <div className="space-y-2.5">
              {/* 1. Facebook Card */}
              <a
                href="https://www.facebook.com/share/1FbFMb9MZN/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full max-w-md p-3.5 my-2.5 flex items-center gap-4 rounded-none border border-white/10 bg-zinc-900/60 hover:bg-zinc-800 hover:border-red-500/40 hover:shadow-[0_0_20px_rgba(220,38,38,0.15)] transition-all cursor-pointer text-white group"
              >
                <div className="w-8 h-8 rounded-none bg-black/50 border border-white/10 flex items-center justify-center shrink-0">
                  <svg
                    className="w-4 h-4 fill-current text-zinc-300 group-hover:text-white transition-colors"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white group-hover:text-red-400 transition-colors font-sans">
                    Facebook
                  </div>
                  <div className="text-xs text-zinc-400 font-mono truncate">
                    Said Khan
                  </div>
                </div>
              </a>

              {/* 2. LinkedIn Card */}
              <a
                href="https://www.linkedin.com/in/md-said-khan-2b4568431/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full max-w-md p-3.5 my-2.5 flex items-center gap-4 rounded-none border border-white/10 bg-zinc-900/60 hover:bg-zinc-800 hover:border-red-500/40 hover:shadow-[0_0_20px_rgba(220,38,38,0.15)] transition-all cursor-pointer text-white group"
              >
                <div className="w-8 h-8 rounded-none bg-black/50 border border-white/10 flex items-center justify-center shrink-0">
                  <svg
                    className="w-4 h-4 fill-current text-zinc-300 group-hover:text-white transition-colors"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white group-hover:text-red-400 transition-colors font-sans">
                    LinkedIn
                  </div>
                  <div className="text-xs text-zinc-400 font-mono truncate">
                    Md Said Khan
                  </div>
                </div>
              </a>

              {/* 3. GitHub Card */}
              <a
                href="https://github.com/SAIDKHAN777"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full max-w-md p-3.5 my-2.5 flex items-center gap-4 rounded-none border border-white/10 bg-zinc-900/60 hover:bg-zinc-800 hover:border-red-500/40 hover:shadow-[0_0_20px_rgba(220,38,38,0.15)] transition-all cursor-pointer text-white group"
              >
                <div className="w-8 h-8 rounded-none bg-black/50 border border-white/10 flex items-center justify-center shrink-0">
                  <svg
                    className="w-4 h-4 fill-current text-zinc-300 group-hover:text-white transition-colors"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white group-hover:text-red-400 transition-colors font-sans">
                    GitHub
                  </div>
                  <div className="text-xs text-zinc-400 font-mono truncate">
                    @SAIDKHAN777
                  </div>
                </div>
              </a>

              {/* 4. WhatsApp Card */}
              <a
                href="https://wa.me/qr/MQLBF2KH3YLNB1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full max-w-md p-3.5 my-2.5 flex items-center gap-4 rounded-none border border-white/10 bg-zinc-900/60 hover:bg-zinc-800 hover:border-red-500/40 hover:shadow-[0_0_20px_rgba(220,38,38,0.15)] transition-all cursor-pointer text-white group"
              >
                <div className="w-8 h-8 rounded-none bg-black/50 border border-white/10 flex items-center justify-center shrink-0">
                  <svg
                    className="w-4 h-4 fill-current text-zinc-300 group-hover:text-white transition-colors"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.301-.15-1.767-.867-2.04-.966-.274-.101-.473-.15-.673.15-.197.295-.771.966-.944 1.162-.175.197-.349.222-.65.074-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.301-.019-.465.13-.615.136-.135.301-.349.453-.523.15-.174.199-.3.301-.498.098-.201.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.01-.371-.01-.571-.01-.2 0-.523.074-.797.372-.272.301-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white group-hover:text-red-400 transition-colors font-sans">
                    WhatsApp
                  </div>
                  <div className="text-xs text-zinc-400 font-mono truncate">
                    Chat on WhatsApp
                  </div>
                </div>
              </a>

              {/* 5. Gmail Card (DIRECT WEB COMPOSE) */}
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=saidmd7778@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full max-w-md p-3.5 my-2.5 flex items-center gap-4 rounded-none border border-white/10 bg-zinc-900/60 hover:bg-zinc-800 hover:border-red-500/40 hover:shadow-[0_0_20px_rgba(220,38,38,0.15)] transition-all cursor-pointer text-white group"
              >
                <div className="w-8 h-8 rounded-none bg-black/50 border border-white/10 flex items-center justify-center shrink-0">
                  <svg
                    className="w-4 h-4 fill-current text-zinc-300 group-hover:text-white transition-colors"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white group-hover:text-red-400 transition-colors font-sans">
                    Gmail
                  </div>
                  <div className="text-xs text-zinc-400 font-mono truncate">
                    saidmd7778@gmail.com
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column (Col Span: 5): Official Portrait Photography */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative z-30 pointer-events-auto w-full max-w-[380px] lg:max-w-[420px] aspect-[4/5] rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(220,38,38,0.25)] overflow-hidden bg-zinc-950 sticky top-28">
            <Image
              src="/images/said-khan-crimson.jpg"
              alt="Said Khan — AI Engineer, AI Automation Expert, Full Stack Developer, and Digital Marketing Expert"
              width={1024}
              height={1024}
              priority
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>
      </main>

      {/* Clean & Minimal Bottom Footer for About Me (Only Copyright Notice, No Duplicate Social Icons) */}
      <footer className="w-full border-t border-white/10 bg-black">
        <div className="max-w-7xl mx-auto py-8 px-6 flex items-center justify-between">
          <p className="text-sm font-sans text-zinc-400">
            © 2026 Said Khan. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
