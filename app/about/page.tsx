'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const [logoError, setLogoError] = useState(false)

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        backgroundColor: '#025A34',
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* Decorative color blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-emerald-300/20 blur-3xl" />
      </div>

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />

      {/* Top-right corporate badge */}
      <div
        className="absolute top-6 right-6 hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] text-white/80"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
        Portal Online
      </div>

      {/* Top-left brand mark */}
      <div
        className="absolute top-6 left-6 hidden md:flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-white/70"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        <span className="w-4 h-px bg-white/40" />
        EST. 2026
      </div>

      <div className="relative max-w-3xl mx-auto text-center w-full">

        {/* Eyebrow tag */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="w-8 h-px bg-white/40" />
          <span
            className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/80"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Integrated Management System
          </span>
          <span className="w-8 h-px bg-white/40" />
        </div>

        {/* Logo — clean, no glow */}
        <div className="flex justify-center mb-10">
          {!logoError ? (
            <img
              src="/operon-logo-white.png"
              alt="Operon Middle East"
              className="h-32 md:h-40 w-auto object-contain drop-shadow-2xl"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-10 py-6 rounded-2xl shadow-2xl">
              <div className="text-white text-center">
                <div className="text-3xl md:text-4xl font-bold tracking-wider">OPERON</div>
                <div className="text-[10px] md:text-xs text-white/80 mt-2 tracking-[0.2em]">
                  AN EDGENTA COMPANY
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-3 tracking-tight leading-tight drop-shadow-lg">
          OPERON <span className="text-emerald-100">MIDDLE EAST</span>
        </h1>

        {/* Subtitle divider */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="w-12 h-px bg-white/40" />
          <h2
            className="text-sm md:text-base font-semibold text-white/90 tracking-[0.4em] uppercase"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            ISO IMS Portal
          </h2>
          <span className="w-12 h-px bg-white/40" />
        </div>

        {/* Description */}
        <p className="text-base md:text-lg text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto mt-6 drop-shadow">
          The Integrated Management System (IMS) provides a unified framework governing
          Quality, Environmental, Occupational Health &amp; Safety, and Facility Management
          practices. It ensures standardized processes, regulatory compliance, continual
          improvement, and consistent service excellence across all operations.
        </p>

        {/* Sign-in Instructions — glassmorphism card */}
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-white/5 rounded-2xl blur-md" />
          <div className="relative bg-white/[0.10] backdrop-blur-md border border-white/20 rounded-2xl p-6 md:p-7 shadow-2xl">
            <div className="flex items-center justify-center gap-2 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white/90">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <h3
                className="text-[11px] font-semibold text-white/90 uppercase tracking-[0.25em]"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Access Instructions
              </h3>
            </div>
            <p className="text-white/90 text-sm md:text-[15px] leading-relaxed">
              Please use your <span className="font-semibold text-white">Outlook account</span> to
              sign in and access company documents. Once authenticated, you can view and
              download files based on your assigned permissions.
            </p>
          </div>
        </div>

        {/* Sign In Button */}
        <div className="flex justify-center mb-10">
          <Link
            href="/login"
            className="group relative bg-white hover:bg-emerald-50 text-emerald-900 font-semibold px-10 py-3.5 rounded-lg shadow-xl transition-all hover:shadow-2xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Sign In with Outlook
          </Link>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.08] border border-white/15 rounded-full text-xs text-white/85 backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-emerald-200">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            <span>Document Library</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.08] border border-white/15 rounded-full text-xs text-white/85 backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-emerald-200">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>NCR Reports</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.08] border border-white/15 rounded-full text-xs text-white/85 backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-emerald-200">
              <circle cx="12" cy="8" r="6" />
              <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
            </svg>
            <span>ISO Certificates</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.08] border border-white/15 rounded-full text-xs text-white/85 backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-emerald-200">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Compliance Tracking</span>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/15 pt-6">
          <p className="text-xs text-white/70 mb-1">
            © 2026 Operon Middle East — An Edgenta Company. All rights reserved.
          </p>
          <p
            className="text-[10px] font-mono text-white/50 tracking-[0.2em] uppercase"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            ISO 9001:2015 · ISO 14001:2015 · ISO 45001:2018
          </p>
        </div>

      </div>
    </main>
  )
}
