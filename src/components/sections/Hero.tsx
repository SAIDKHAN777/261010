import React from "react";
import Image from "next/image";

export function Hero() {
  return (
    <section id="overview" className="relative overflow-hidden scroll-mt-20">
      {/* Anchor alias */}
      <span id="home" className="absolute top-0" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6 py-24 sm:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column (Bio - Col Span: 7): Concise Sara-Style Sans-Serif Intro */}
          <div className="lg:col-span-7">
            {/* Headline: Bold modern sans-serif */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-6 font-sans">
              Hi, I’m Said Khan.
            </h1>

            {/* Body: Concise, high-impact introductory paragraphs */}
            <div className="text-lg sm:text-xl text-zinc-300 leading-relaxed space-y-5 font-normal font-sans">
              <p>
                I’m an AI Engineer, AI Automation Expert, and Full-Stack Developer. I use AI and modern technology to turn ideas into practical, intelligent, and reliable digital solutions.
              </p>
              <p>
                I build AI-powered software, automation systems, full-stack applications, and personal AI agents. What I enjoy most is understanding a real problem, finding a smarter approach, and turning that idea into something people can actually use.
              </p>
              <p>
                Alongside software and AI, I also have experience in Digital Marketing, which gives me a broader perspective on technology, business, and people. I believe great technology isn’t just about making something work; it’s about creating something that genuinely adds value.
              </p>
              <p>
                I’m naturally curious, enjoy solving challenging problems, and love exploring what’s possible with AI. Whether it’s building an intelligent system, automating a complex workflow, or bringing a new software idea to life, I focus on creating solutions that are useful, scalable, and built with purpose.
              </p>
              <p className="text-zinc-200 font-medium">
                If you have an idea, I’d love to help turn it into something real.
              </p>
            </div>
          </div>

          {/* Right Column (Photo - Col Span: 5): Executive portrait with crimson ambient glow */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative z-30 pointer-events-auto w-full max-w-[380px] lg:max-w-[420px] aspect-[4/5] rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(220,38,38,0.25)] overflow-hidden bg-zinc-950">
              <Image
                src="/images/said-khan-crimson.jpg"
                alt="Said Khan — AI Engineer, AI Automation Expert and Full-Stack Developer"
                width={1024}
                height={1024}
                priority
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
