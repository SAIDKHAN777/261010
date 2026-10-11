'use client';

import React, { useState } from 'react';

interface ClientLogo {
  id: string;
  name: string;
  src?: string;
}

// Configurable client logos array (supports 4 to 6 logos, monochrome white)
const TRUSTED_LOGOS: ClientLogo[] = [
  { id: '1', name: 'Client 01', src: '/logos/logo-1.svg' },
  { id: '2', name: 'Client 02', src: '/logos/logo-2.svg' },
  { id: '3', name: 'Client 03', src: '/logos/logo-3.svg' },
  { id: '4', name: 'Client 04', src: '/logos/logo-4.svg' },
  { id: '5', name: 'Client 05', src: '/logos/logo-5.svg' },
  { id: '6', name: 'Client 06', src: '/logos/logo-6.svg' },
];

export default function AboutContactSection() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [trustedLogos, setTrustedLogos] = useState<ClientLogo[]>(TRUSTED_LOGOS);

  React.useEffect(() => {
    fetch('/api/clients')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
          const mapped = data.data.slice(0, 6).map((c: any, idx: number) => ({
            id: c.id || String(idx + 1),
            name: c.name || `Partner 0${idx + 1}`,
            src: c.logoUrl || c.imageUrl,
          }));
          setTrustedLogos(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          message,
          timestamp: new Date().toISOString(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error('Submission failed');
      }

      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-center">
      {/* ================================================================
          OVERLAYS AS SPECIFIED:
          1. Horizontal gradient: 88% edges, 35% center over portrait
          2. Bottom fade: 280px tall, from transparent to #07040a
          ================================================================ */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none -z-10 [background:linear-gradient(90deg,rgba(7,4,10,0.88)_0%,rgba(7,4,10,0.35)_38%,rgba(7,4,10,0.35)_62%,rgba(7,4,10,0.88)_100%)]"
      />
      <div
        aria-hidden="true"
        className="fixed bottom-0 left-0 right-0 h-[280px] pointer-events-none -z-10 [background:linear-gradient(to_top,#07040a_0%,transparent_100%)]"
      />

      {/* ================================================================
          MAIN CONTAINER: Expansive 1920px max-width, shifted rightwards
          ================================================================ */}
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:pl-4 lg:pr-3 xl:pl-6 xl:pr-4 2xl:pl-8 2xl:pr-6 py-2 sm:py-3 pb-4 sm:pb-6 relative z-10 flex flex-col justify-center overflow-y-auto max-h-[calc(100vh-7.5rem)] lg:max-h-none lg:overflow-visible no-scrollbar">
        {/* Main Row: Left text expanded 2 inches, Center column expansive (1fr clearance over face/ear), Right form expanded 1 inch */}
        <div className="grid grid-cols-1 min-[981px]:grid-cols-[minmax(340px,460px)_1fr_minmax(420px,490px)] xl:grid-cols-[510px_1fr_510px] 2xl:grid-cols-[540px_1fr_540px] gap-6 lg:gap-8 items-center w-full">
          {/* ------------------------------------------------------------
              COLUMN 1 (LEFT): TEXT BLOCK
              Expanded 2 inches from the left side (~180px wider + larger typography)
              ------------------------------------------------------------ */}
          <div className="flex flex-col justify-center text-left w-full max-w-[460px] xl:max-w-[510px] 2xl:max-w-[540px]">
            {/* Eyebrow */}
            <span className="font-mono text-[13px] sm:text-[14px] tracking-[0.2em] text-[#ff8aa3] uppercase font-semibold mb-2.5 sm:mb-3 block drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {"GET IN TOUCH".split('').map((c, i) => (
                <span key={i} className="kinetic-char inline-block">{c === ' ' ? '\u00A0' : c}</span>
              ))}
            </span>

            {/* H1 - Crisp, Elegant, Roomy Distance between Lines */}
            <h1 className="font-serif font-bold text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] 2xl:text-[52px] leading-tight text-white mb-4 sm:mb-5 drop-shadow-[0_4px_24px_rgba(0,0,0,0.98)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] flex flex-col gap-3 sm:gap-4">
              <span>
                {"Have an idea?".split('').map((c, i) => (
                  <span key={i} className="kinetic-char inline-block">{c === ' ' ? '\u00A0' : c}</span>
                ))}
              </span>
              <span>
                {"Let's build it.".split('').map((c, i) => (
                  <span key={i} className="kinetic-char inline-block">{c === ' ' ? '\u00A0' : c}</span>
                ))}
              </span>
            </h1>

            {/* Paragraph */}
            <p className="font-body text-[16px] sm:text-[17px] text-[#e9d6dc] max-w-[440px] xl:max-w-[460px] leading-relaxed mb-5 sm:mb-6 font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              An AI agent, an automation, or a full web app. Tell me what you need and I&apos;ll reply with a clear plan.
            </p>

            {/* Circular Social & Contact Icon Buttons Row (Matching screenshot) */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-3.5 mb-3.5">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/share/1FbFMb9MZN/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Profile"
                title="Facebook: Said Khan"
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/[0.08] hover:bg-[#1877f2]/20 border border-white/15 hover:border-[#1877f2]/60 text-white/90 hover:text-[#1877f2] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-md hover:shadow-[0_0_20px_rgba(24,119,242,0.4)] group"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/md-said-khan-2b4568431/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                title="LinkedIn: Md Said Khan"
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/[0.08] hover:bg-[#0a66c2]/20 border border-white/15 hover:border-[#0a66c2]/60 text-white/90 hover:text-[#0a66c2] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-md hover:shadow-[0_0_20px_rgba(10,102,194,0.4)] group"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/SAIDKHAN777"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                title="GitHub: SAIDKHAN777"
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/[0.08] hover:bg-white/20 border border-white/15 hover:border-white/60 text-white/90 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-md hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] group"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>

              {/* WhatsApp (from QR code: wa.me/qr/MQLBF2KH3YLNB1) */}
              <a
                href="https://wa.me/qr/MQLBF2KH3YLNB1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Contact"
                title="WhatsApp Direct Chat: Said Khan"
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/[0.08] hover:bg-[#25d366]/20 border border-white/15 hover:border-[#25d366]/60 text-white/90 hover:text-[#25d366] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-md hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] group"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </a>

              {/* Direct Gmail */}
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=saidmd7778@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Direct Gmail Compose"
                title="Direct Gmail: saidmd7778@gmail.com"
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/[0.08] hover:bg-[#ea4335]/20 border border-white/15 hover:border-[#ea4335]/60 text-white/90 hover:text-[#ea4335] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-md hover:shadow-[0_0_20px_rgba(234,67,53,0.4)] group"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.272H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
                </svg>
              </a>
            </div>

            {/* Direct Plaintext Email Link */}
            <div className="flex flex-col gap-1.5 text-left">
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=saidmd7778@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[15px] sm:text-[16px] text-[#ff8aa3] hover:text-white transition-colors w-fit group font-mono py-0.5"
                title="Click to compose directly in Gmail"
              >
                <span className="opacity-75 group-hover:opacity-100 transition-opacity">✉</span>
                <span className="underline underline-offset-4 decoration-[#ff8aa3]/40 group-hover:decoration-white font-sans">
                  saidmd7778@gmail.com
                </span>
              </a>
            </div>
          </div>

          {/* ------------------------------------------------------------
              COLUMN 2 (CENTER): EMPTY - Expansive 1fr clearance over face & ear
              Hidden on <= 980px
              ------------------------------------------------------------ */}
          <div
            aria-hidden="true"
            className="hidden min-[981px]:block w-full h-full pointer-events-none select-none"
          />

          {/* ------------------------------------------------------------
              COLUMN 3 (RIGHT): THE FORM
              Expanded 1 inch from the right side into the dark quadrant
              NO card, NO box, NO border, NO glass/blur.
              ------------------------------------------------------------ */}
          <div className="w-full max-w-[420px] min-[981px]:max-w-[480px] xl:max-w-[510px] 2xl:max-w-[540px] ml-auto justify-self-end py-2 sm:py-3 mt-1 sm:mt-2">
            {/* Title & Subtext - Clear headroom below topbar */}
            <h2 className="font-serif text-[28px] sm:text-[32px] font-bold text-white leading-tight">
              {"Start your project".split('').map((c, i) => (
                <span key={i} className="kinetic-char inline-block">{c === ' ' ? '\u00A0' : c}</span>
              ))}
            </h2>
            <p className="font-body text-[14px] sm:text-[15px] text-[#d9c3ca] mt-1 mb-4 sm:mb-5">
              Takes about a minute.
            </p>

            {status === 'success' ? (
              <div
                aria-live="polite"
                className="py-10 px-6 rounded-[14px] bg-white/[0.04] border border-[#d91f46]/30 text-center"
              >
                <div className="w-14 h-14 rounded-full bg-[#d91f46]/20 border border-[#d91f46]/40 flex items-center justify-center mx-auto mb-4 text-[#ff8aa3] text-2xl">
                  ✓
                </div>
                <p className="font-serif text-[24px] text-white font-bold mb-2">
                  Thanks! I&apos;ll reply within 24 hours.
                </p>
                <p className="font-body text-[15px] text-[#d9c3ca] mb-6">
                  Your project details have been received directly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStatus('idle');
                    setFullName('');
                    setEmail('');
                    setMessage('');
                  }}
                  className="font-body text-[14px] text-[#ff8aa3] hover:text-white underline underline-offset-4 transition-colors cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
                {status === 'error' && (
                  <div
                    aria-live="polite"
                    className="text-sm font-body text-[#ff8aa3] bg-[#d91f46]/10 border border-[#d91f46]/30 rounded-[12px] p-3 text-center"
                  >
                    {errorMessage}
                  </div>
                )}

                {/* Field 1: Full Name */}
                <div>
                  <label
                    htmlFor="contact-fullname"
                    className="block font-body text-[14px] font-medium text-[#f1dfe4] mb-1.5"
                  >
                    Full name
                  </label>
                  <input
                    id="contact-fullname"
                    name="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                    className="w-full bg-white/[0.06] border border-white/[0.18] rounded-[12px] py-[13px] sm:py-[14px] px-[18px] text-white text-[16px] font-body placeholder:text-white/60 focus:border-[#e5254b] focus:ring-[3px] focus:ring-[#e5254b]/25 focus:outline-none transition-all"
                  />
                </div>

                {/* Field 2: Email */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block font-body text-[14px] font-medium text-[#f1dfe4] mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full bg-white/[0.06] border border-white/[0.18] rounded-[12px] py-[13px] sm:py-[14px] px-[18px] text-white text-[16px] font-body placeholder:text-white/60 focus:border-[#e5254b] focus:ring-[3px] focus:ring-[#e5254b]/25 focus:outline-none transition-all"
                  />
                </div>

                {/* Field 3: Tell me about it */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block font-body text-[14px] font-medium text-[#f1dfe4] mb-1.5"
                  >
                    Tell me about it
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="What are you trying to build or fix?"
                    className="w-full bg-white/[0.06] border border-white/[0.18] rounded-[12px] py-[13px] sm:py-[14px] px-[18px] text-white text-[16px] font-body placeholder:text-white/60 focus:border-[#e5254b] focus:ring-[3px] focus:ring-[#e5254b]/25 focus:outline-none transition-all resize-y"
                  />
                </div>

                {/* Submit Button - Enlarged ~2 inches width */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full min-h-[52px] sm:min-h-[54px] bg-[#d91f46] hover:bg-[#ea264e] text-white font-bold text-[17px] rounded-[12px] transition-colors flex items-center justify-center cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_16px_rgba(217,31,70,0.35)] active:scale-[0.99]"
                >
                  {status === 'loading' ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </span>
                  ) : (
                    'Send Message'
                  )}
                </button>

                {/* SLA Subtext */}
                <p className="text-center font-body text-[13px] text-[#d9c3ca] mt-2.5">
                  I usually reply within 24 hours.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* ================================================================
            TRUSTED BY LOGO BAR (below main row, mt-10)
            Logo grid: 3 columns on <=980px, 6 columns on desktop
            ================================================================ */}
        <div className="w-full mt-4 sm:mt-6 pt-3 pb-1 border-t border-white/[0.06]">
          <div className="text-center font-mono text-[13px] tracking-[0.3em] text-[#ff8aa3] uppercase mb-3 select-none font-medium">
            TRUSTED BY
          </div>

          <div className="grid grid-cols-3 min-[981px]:grid-cols-6 gap-3 sm:gap-4 items-center justify-items-center w-full">
            {trustedLogos.map((logo, idx) => (
              <div
                key={logo.id}
                className="h-12 w-full flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-200 select-none group px-2"
                title={logo.name}
              >
                {logo.src && logo.src.startsWith('http') ? (
                  <div className="flex items-center gap-2 max-w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logo.src}
                      alt={logo.name}
                      className="h-7 w-auto max-w-[110px] object-contain filter grayscale contrast-200 brightness-150 opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <span className="font-semibold text-white/90 group-hover:text-white uppercase text-[10px] sm:text-[11px] truncate hidden xl:inline">
                      {logo.name}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 font-mono text-xs sm:text-sm tracking-wider text-white">
                    <svg
                      className="w-5 h-5 text-white fill-current opacity-80 group-hover:opacity-100 transition-opacity"
                      viewBox="0 0 24 24"
                    >
                      {idx % 6 === 0 && (
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      )}
                      {idx % 6 === 1 && (
                        <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" fill="none" stroke="currentColor" strokeWidth="2" />
                      )}
                      {idx % 6 === 2 && (
                        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
                      )}
                      {idx % 6 === 3 && (
                        <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14" stroke="currentColor" strokeWidth="2" />
                      )}
                      {idx % 6 === 4 && (
                        <rect x="4" y="4" width="16" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
                      )}
                      {idx % 6 === 5 && (
                        <polygon points="12 3 20 21 4 21" fill="none" stroke="currentColor" strokeWidth="2" />
                      )}
                    </svg>
                    <span className="font-semibold text-white/90 group-hover:text-white uppercase text-[11px] sm:text-xs truncate max-w-[100px]">
                      {logo.name || `PARTNER 0${idx + 1}`}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
