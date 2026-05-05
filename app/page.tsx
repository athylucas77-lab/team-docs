'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

export default function Home() {
  const [logoError, setLogoError] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Detect scroll for nav style change
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Animated particle network background
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let particles: Array<{ x: number; y: number; vx: number; vy: number; radius: number }> = []

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const initParticles = () => {
      // Particle density based on screen size
      const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 20000))
      particles = []
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.5 + 0.5,
        })
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update + draw particles
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        // Draw the particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(167, 243, 208, 0.6)' // emerald-200ish
        ctx.fill()
      })

      // Draw lines between nearby particles
      const maxDistance = 140
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.3
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(110, 231, 183, ${opacity})` // emerald-300 with dynamic opacity
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    resizeCanvas()
    initParticles()
    animate()

    const onResize = () => {
      resizeCanvas()
      initParticles()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <main
      className="min-h-screen relative"
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        background: 'radial-gradient(ellipse at top right, #0F5A35 0%, #094A2A 50%, #063B22 100%)',
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* Animated particle network canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* Soft ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
        <div className="absolute -top-20 -right-20 w-[600px] h-[600px] rounded-full bg-emerald-300/8 blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] rounded-full bg-emerald-400/5 blur-3xl" />
      </div>

      {/* ──────── STICKY NAVIGATION ──────── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-emerald-950/80 backdrop-blur-lg border-b border-white/10 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            {!logoError ? (
              <img
                src="/operon-logo-white.png"
                alt="Operon"
                className="h-8 w-auto object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="text-white font-bold text-base">OPERON</div>
            )}
            <span className="text-white font-semibold text-sm tracking-tight">
              Middle East
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm text-white/70">
            <a href="#overview" className="hover:text-white transition">Overview</a>
            <a href="#standards" className="hover:text-white transition">Standards</a>
            <a href="#modules" className="hover:text-white transition">Modules</a>
            <a href="#access" className="hover:text-white transition">Access</a>
          </div>

          <Link
            href="/login"
            className="bg-white hover:bg-emerald-50 text-emerald-900 font-semibold px-5 py-2 rounded-lg text-sm shadow-lg transition flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Sign In
          </Link>
        </div>
      </nav>

      {/* ──────── HERO SECTION ──────── */}
      <section id="overview" className="relative min-h-screen flex items-center justify-center px-6 pt-20" style={{ zIndex: 2 }}>
        <div className="max-w-6xl mx-auto w-full">

          {/* Eyebrow tag */}
          <div className="flex items-center gap-3 mb-8">
            <span className="w-8 h-px bg-emerald-300/40" />
            <span
              className="text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-200/80"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Integrated Management System
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side — Headline */}
            <div>
              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.05] mb-4">
                Define your<br />
                <span className="text-emerald-200">management</span><br />
                system
              </h1>
              <p className="text-base md:text-lg text-white/80 leading-relaxed max-w-lg mt-6">
                A unified portal for ISO-certified policies, procedures, forms,
                and quality records — purpose-built for Operon Middle East.
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-8">
                <Link
                  href="/login"
                  className="bg-white hover:bg-emerald-50 text-emerald-900 font-semibold px-6 py-3 rounded-lg shadow-xl transition-all hover:shadow-2xl hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                  Sign In with Outlook
                </Link>
                <a
                  href="#standards"
                  className="text-white/80 hover:text-white text-sm flex items-center gap-2 transition"
                >
                  Learn more
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Right side — Logo */}
            <div className="flex justify-center lg:justify-end">
              {!logoError ? (
                <img
                  src="/operon-logo-white.png"
                  alt="Operon Middle East"
                  className="h-48 md:h-64 w-auto object-contain drop-shadow-2xl"
                />
              ) : (
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-12 py-8 rounded-2xl shadow-2xl">
                  <div className="text-white text-center">
                    <div className="text-4xl md:text-5xl font-bold tracking-wider">OPERON</div>
                    <div className="text-xs text-white/80 mt-2 tracking-[0.2em]">AN EDGENTA COMPANY</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-white/40">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Scroll
            </span>
            <div className="w-px h-12 bg-gradient-to-b from-emerald-300/60 to-transparent animate-pulse" />
          </div>
        </div>
      </section>

      {/* ──────── STATS BAR ──────── */}
      <section className="relative py-16 border-y border-white/10 bg-emerald-950/20 backdrop-blur-sm" style={{ zIndex: 2 }}>
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl md:text-5xl font-bold text-white tracking-tight">3</div>
            <div className="text-xs uppercase tracking-[0.2em] text-emerald-200/70 mt-2 font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              ISO Standards
            </div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold text-white tracking-tight">5</div>
            <div className="text-xs uppercase tracking-[0.2em] text-emerald-200/70 mt-2 font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Document Tiers
            </div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold text-white tracking-tight">8</div>
            <div className="text-xs uppercase tracking-[0.2em] text-emerald-200/70 mt-2 font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Departments
            </div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold text-white tracking-tight">100%</div>
            <div className="text-xs uppercase tracking-[0.2em] text-emerald-200/70 mt-2 font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Compliance
            </div>
          </div>
        </div>
      </section>

      {/* ──────── ABOUT IMS ──────── */}
      <section className="relative py-24 px-6" style={{ zIndex: 2 }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-px bg-emerald-300/40" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-200/80" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              About IMS
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-6 max-w-3xl">
            One unified framework. <span className="text-emerald-200">Every standard.</span>
          </h2>
          <p className="text-lg text-white/80 leading-relaxed max-w-3xl">
            The Integrated Management System (IMS) provides a unified framework governing
            Quality, Environmental, Occupational Health &amp; Safety, and Facility Management
            practices. It ensures standardized processes, regulatory compliance, continual
            improvement, and consistent service excellence across all operations.
          </p>
        </div>
      </section>

      {/* ──────── STANDARDS ──────── */}
      <section id="standards" className="relative py-24 px-6" style={{ zIndex: 2 }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-emerald-300/40" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-200/80" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Standards
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-12 max-w-3xl">
            Three certifications.<br />
            <span className="text-emerald-200">One commitment to excellence.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ISO 9001 */}
            <div className="group bg-white/[0.04] backdrop-blur-sm border border-white/10 hover:border-white/30 rounded-2xl p-8 transition-all hover:bg-white/[0.07]">
              <div className="w-12 h-12 rounded-xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-emerald-200">
                  <circle cx="12" cy="8" r="6" />
                  <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                </svg>
              </div>
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-300/80 mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                ISO 9001:2015
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Quality Management</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Ensuring consistent quality in our services and continuous improvement
                of customer satisfaction across every operation.
              </p>
            </div>

            {/* ISO 14001 */}
            <div className="group bg-white/[0.04] backdrop-blur-sm border border-white/10 hover:border-white/30 rounded-2xl p-8 transition-all hover:bg-white/[0.07]">
              <div className="w-12 h-12 rounded-xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-emerald-200">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                  <path d="M2 21c0-3 1.85-5.36 5.08-6" />
                </svg>
              </div>
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-300/80 mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                ISO 14001:2015
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Environmental</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Minimizing environmental impact through responsible operations,
                resource stewardship, and sustainable practices.
              </p>
            </div>

            {/* ISO 45001 */}
            <div className="group bg-white/[0.04] backdrop-blur-sm border border-white/10 hover:border-white/30 rounded-2xl p-8 transition-all hover:bg-white/[0.07]">
              <div className="w-12 h-12 rounded-xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-emerald-200">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-300/80 mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                ISO 45001:2018
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Health &amp; Safety</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Protecting the health, safety, and wellbeing of every employee,
                contractor, and visitor on our sites.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ──────── MODULES ──────── */}
      <section id="modules" className="relative py-24 px-6" style={{ zIndex: 2 }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-emerald-300/40" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-200/80" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Portal Modules
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-12 max-w-3xl">
            Everything in <span className="text-emerald-200">one place.</span>
          </h2>

          <div className="space-y-4">
            {/* Module 1 */}
            <div className="bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-2xl p-8 flex flex-col md:flex-row items-start gap-6 hover:bg-white/[0.07] transition-all">
              <div className="w-14 h-14 rounded-xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-emerald-200">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-white">Document Library</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-300/15 text-emerald-200 rounded uppercase tracking-wider" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    Five tiers
                  </span>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">
                  Policies, IMS manuals, procedures, work instructions, and forms — organized
                  in five tiers and categorized by department. Always controlled, always current.
                </p>
              </div>
            </div>

            {/* Module 2 */}
            <div className="bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-2xl p-8 flex flex-col md:flex-row items-start gap-6 hover:bg-white/[0.07] transition-all">
              <div className="w-14 h-14 rounded-xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-emerald-200">
                  <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-white">Non-Conformance Reports</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-300/15 text-emerald-200 rounded uppercase tracking-wider" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    Audit ready
                  </span>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">
                  Capture, track, and resolve non-conformances with full audit trails, electronic
                  signatures, severity classification, and corrective action workflows.
                </p>
              </div>
            </div>

            {/* Module 3 */}
            <div className="bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-2xl p-8 flex flex-col md:flex-row items-start gap-6 hover:bg-white/[0.07] transition-all">
              <div className="w-14 h-14 rounded-xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-emerald-200">
                  <circle cx="12" cy="8" r="6" />
                  <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-white">ISO Certificate Repository</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-300/15 text-emerald-200 rounded uppercase tracking-wider" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    Always current
                  </span>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">
                  Quick access to all current accredited ISO certifications. Always know what
                  we're certified for and when each renewal is due.
                </p>
              </div>
            </div>

            {/* Module 4 */}
            <div className="bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-2xl p-8 flex flex-col md:flex-row items-start gap-6 hover:bg-white/[0.07] transition-all">
              <div className="w-14 h-14 rounded-xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-emerald-200">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-white">Role-Based Access</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-300/15 text-emerald-200 rounded uppercase tracking-wider" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    Three tiers
                  </span>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">
                  Admin, Editor, and Viewer permissions ensure the right people have the right
                  access. Quality records stay secure, accountable, and properly controlled.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────── ACCESS / CTA ──────── */}
      <section id="access" className="relative py-24 px-6" style={{ zIndex: 2 }}>
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-300/15 to-emerald-500/5 rounded-3xl blur-md" />
            <div className="relative bg-white/[0.07] backdrop-blur-md border border-white/15 rounded-3xl p-10 md:p-14 shadow-2xl text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-emerald-200">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <h3 className="text-[11px] font-semibold text-emerald-100 uppercase tracking-[0.25em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  Access Instructions
                </h3>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
                Sign in with your <span className="text-emerald-200">Outlook account</span>
              </h2>
              <p className="text-base text-white/80 leading-relaxed max-w-2xl mx-auto mb-8">
                Once authenticated, you can view and download files based on your assigned
                permissions. Contact your IT administrator for access support.
              </p>

              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-white hover:bg-emerald-50 text-emerald-900 font-semibold px-8 py-3.5 rounded-lg shadow-xl transition-all hover:shadow-2xl hover:-translate-y-0.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                Sign In with Outlook
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ──────── FOOTER ──────── */}
      <footer className="relative py-12 px-6 border-t border-white/10" style={{ zIndex: 2 }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              {!logoError && (
                <img
                  src="/operon-logo-white.png"
                  alt="Operon"
                  className="h-7 w-auto object-contain opacity-70"
                />
              )}
              <p className="text-xs text-white/60">
                © 2026 Operon Middle East — An Edgenta Company
              </p>
            </div>

            <p
              className="text-[10px] font-mono text-white/50 tracking-[0.2em] uppercase"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              ISO 9001:2015 · ISO 14001:2015 · ISO 45001:2018
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
