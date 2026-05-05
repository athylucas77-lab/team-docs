'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

// ── Utility: intersection observer hook ──────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect() } },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, inView }
}

// ── Animated counter ─────────────────────────────────────────────────────────
function AnimatedNumber({ target, suffix = '' }: { target: number | string; suffix?: string }) {
  const { ref, inView } = useInView(0.3)
  const [display, setDisplay] = useState(0)
  const isPercent = typeof target === 'number'

  useEffect(() => {
    if (!inView || !isPercent) return
    const end = target as number
    let start = 0
    const duration = 1800
    const step = 16
    const increment = end / (duration / step)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) { setDisplay(end); clearInterval(timer) }
      else setDisplay(Math.floor(start))
    }, step)
    return () => clearInterval(timer)
  }, [inView, target, isPercent])

  return (
    <div ref={ref}>
      <div
        className="text-4xl md:text-5xl font-bold text-white tracking-tight"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}
      >
        {isPercent ? display : target}{suffix}
      </div>
    </div>
  )
}

// ── Fade-slide-in wrapper ─────────────────────────────────────────────────────
function Reveal({
  children,
  delay = 0,
  direction = 'up',
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'none'
  className?: string
}) {
  const { ref, inView } = useInView()
  const transforms: Record<string, string> = {
    up: 'translateY(32px)',
    left: 'translateX(-32px)',
    right: 'translateX(32px)',
    none: 'none',
  }
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translate(0)' : transforms[direction],
        transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

// ── Staggered children wrapper ────────────────────────────────────────────────
function StaggerGroup({
  children,
  baseDelay = 0,
  stagger = 120,
  className = '',
}: {
  children: React.ReactNode[]
  baseDelay?: number
  stagger?: number
  className?: string
}) {
  const { ref, inView } = useInView()
  return (
    <div ref={ref} className={className}>
      {children.map((child, i) => (
        <div
          key={i}
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(28px)',
            transition: `opacity 0.65s ease ${baseDelay + i * stagger}ms, transform 0.65s ease ${baseDelay + i * stagger}ms`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Home() {
  const [logoError, setLogoError] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [heroVisible, setHeroVisible] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Hero entrance on mount
  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  // Nav scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Particle canvas
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
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(167, 243, 208, 0.6)'
        ctx.fill()
      })
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
            ctx.strokeStyle = `rgba(110, 231, 183, ${opacity})`
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
    const onResize = () => { resizeCanvas(); initParticles() }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', onResize) }
  }, [])

  // Hero line config
  const heroLines = ['Define your', 'management', 'system']
  const heroColors = ['text-white', 'text-emerald-200', 'text-white']

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

      {/* Global keyframe styles */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes pulse-line {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 1; }
        }
        @keyframes scroll-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50%       { transform: translateY(6px); opacity: 0.9; }
        }
        @keyframes badge-glow {
          0%, 100% { box-shadow: 0 0 0px rgba(110,231,183,0); }
          50%       { box-shadow: 0 0 12px rgba(110,231,183,0.25); }
        }
        .module-card:hover .module-icon {
          transform: scale(1.12) rotate(-4deg);
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .module-icon { transition: transform 0.25s ease; }
        .standard-card { transition: transform 0.3s ease, background 0.3s ease, border-color 0.3s ease; }
        .standard-card:hover { transform: translateY(-6px); }
        .nav-link { position: relative; }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0;
          width: 0; height: 1px;
          background: white;
          transition: width 0.25s ease;
        }
        .nav-link:hover::after { width: 100%; }
        .cta-btn {
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.2s ease;
        }
        .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        .stat-label {
          animation: none;
        }
        .eyebrow-line {
          animation: pulse-line 3s ease-in-out infinite;
        }
      `}</style>

      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />

      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
        <div className="absolute -top-20 -right-20 w-[600px] h-[600px] rounded-full bg-emerald-300/8 blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] rounded-full bg-emerald-400/5 blur-3xl" />
      </div>

      {/* ── NAV ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-emerald-950/80 backdrop-blur-lg border-b border-white/10 py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateX(0)' : 'translateX(-20px)',
              transition: 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s',
            }}
          >
            <Link href="/" className="flex items-center gap-2 group">
              {!logoError ? (
                <img src="/operon-logo-white.png" alt="Operon" className="h-8 w-auto object-contain" onError={() => setLogoError(true)} />
              ) : (
                <div className="text-white font-bold text-base">OPERON</div>
              )}
              <span className="text-white font-semibold text-sm tracking-tight">Middle East</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-white/70">
            {['Overview', 'Standards', 'Modules', 'Access'].map((item, i) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="nav-link hover:text-white transition-colors"
                style={{
                  opacity: heroVisible ? 1 : 0,
                  transform: heroVisible ? 'translateY(0)' : 'translateY(-10px)',
                  transition: `opacity 0.5s ease ${0.15 + i * 0.07}s, transform 0.5s ease ${0.15 + i * 0.07}s`,
                }}
              >
                {item}
              </a>
            ))}
          </div>

          <div
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateX(0)' : 'translateX(20px)',
              transition: 'opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s',
            }}
          >
            <Link href="/login" className="cta-btn bg-white text-emerald-900 font-semibold px-5 py-2 rounded-lg text-sm shadow-lg flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="overview" className="relative min-h-screen flex items-center justify-center px-6 pt-20" style={{ zIndex: 2 }}>
        <div className="max-w-6xl mx-auto w-full">

          {/* Eyebrow */}
          <div
            className="flex items-center gap-3 mb-8"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s',
            }}
          >
            <span className="eyebrow-line w-8 h-px bg-emerald-300/40" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-200/80" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Integrated Management System
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Headline — word-by-word stagger */}
            <div>
              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.05] mb-4">
                {heroLines.map((line, lineIdx) => (
                  <span key={lineIdx} className={`block overflow-hidden ${heroColors[lineIdx]}`}>
                    <span
                      style={{
                        display: 'block',
                        opacity: heroVisible ? 1 : 0,
                        transform: heroVisible ? 'translateY(0)' : 'translateY(100%)',
                        transition: `opacity 0.8s ease ${0.5 + lineIdx * 0.15}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${0.5 + lineIdx * 0.15}s`,
                      }}
                    >
                      {line}
                    </span>
                  </span>
                ))}
              </h1>

              <p
                className="text-base md:text-lg text-white/80 leading-relaxed max-w-lg mt-6"
                style={{
                  opacity: heroVisible ? 1 : 0,
                  transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.7s ease 1s, transform 0.7s ease 1s',
                }}
              >
                A unified portal for ISO-certified policies, procedures, forms,
                and quality records — purpose-built for Operon Middle East.
              </p>

              <div
                className="flex flex-wrap items-center gap-4 mt-8"
                style={{
                  opacity: heroVisible ? 1 : 0,
                  transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.7s ease 1.15s, transform 0.7s ease 1.15s',
                }}
              >
                <Link href="/login" className="cta-btn bg-white text-emerald-900 font-semibold px-6 py-3 rounded-lg shadow-xl flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                  Sign In with Outlook
                </Link>
                <a href="#standards" className="text-white/80 hover:text-white text-sm flex items-center gap-2 transition-colors group">
                  Learn more
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Logo — float animation */}
            <div
              className="flex justify-center lg:justify-end"
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? 'scale(1)' : 'scale(0.85)',
                transition: 'opacity 1s ease 0.6s, transform 1s cubic-bezier(0.16,1,0.3,1) 0.6s',
                animation: heroVisible ? 'float 6s ease-in-out infinite 1.6s' : 'none',
              }}
            >
              {!logoError ? (
                <img src="/operon-logo-white.png" alt="Operon Middle East" className="h-48 md:h-64 w-auto object-contain drop-shadow-2xl" />
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
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-white/40"
            style={{ opacity: heroVisible ? 1 : 0, transition: 'opacity 0.7s ease 1.5s' }}
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-emerald-300/60 to-transparent" style={{ animation: 'scroll-bounce 2s ease-in-out infinite' }} />
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="relative py-16 border-y border-white/10 bg-emerald-950/20 backdrop-blur-sm" style={{ zIndex: 2 }}>
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: 3, label: 'ISO Standards', suffix: '' },
            { value: 5, label: 'Document Tiers', suffix: '' },
            { value: 8, label: 'Departments', suffix: '' },
            { value: 100, label: 'Compliance', suffix: '%' },
          ].map(({ value, label, suffix }, i) => {
            const { ref, inView } = useInView(0.3)
            return (
              <div
                key={label}
                ref={ref}
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(24px)',
                  transition: `opacity 0.6s ease ${i * 100}ms, transform 0.6s ease ${i * 100}ms`,
                }}
              >
                <AnimatedNumber target={value} suffix={suffix} />
                <div className="text-xs uppercase tracking-[0.2em] text-emerald-200/70 mt-2 font-mono stat-label" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {label}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── ABOUT IMS ── */}
      <section className="relative py-24 px-6" style={{ zIndex: 2 }}>
        <div className="max-w-5xl mx-auto">
          <Reveal delay={0}>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-emerald-300/40" />
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-200/80" style={{ fontFamily: "'JetBrains Mono', monospace" }}>About IMS</span>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-6 max-w-3xl">
              One unified framework. <span className="text-emerald-200">Every standard.</span>
            </h2>
          </Reveal>
          <Reveal delay={220}>
            <p className="text-lg text-white/80 leading-relaxed max-w-3xl">
              The Integrated Management System (IMS) provides a unified framework governing
              Quality, Environmental, Occupational Health &amp; Safety, and Facility Management
              practices. It ensures standardized processes, regulatory compliance, continual
              improvement, and consistent service excellence across all operations.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── STANDARDS ── */}
      <section id="standards" className="relative py-24 px-6" style={{ zIndex: 2 }}>
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-emerald-300/40" />
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-200/80" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Standards</span>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-12 max-w-3xl">
              Three certifications.<br />
              <span className="text-emerald-200">One commitment to excellence.</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                code: 'ISO 9001:2015',
                title: 'Quality Management',
                desc: 'Ensuring consistent quality in our services and continuous improvement of customer satisfaction across every operation.',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-emerald-200">
                    <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                  </svg>
                ),
              },
              {
                code: 'ISO 14001:2015',
                title: 'Environmental',
                desc: 'Minimizing environmental impact through responsible operations, resource stewardship, and sustainable practices.',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-emerald-200">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6" />
                  </svg>
                ),
              },
              {
                code: 'ISO 45001:2018',
                title: 'Health & Safety',
                desc: 'Protecting the health, safety, and wellbeing of every employee, contractor, and visitor on our sites.',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-emerald-200">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                ),
              },
            ].map(({ code, title, desc, icon }, i) => {
              const { ref, inView } = useInView()
              return (
                <div
                  key={code}
                  ref={ref}
                  className="standard-card group bg-white/[0.04] backdrop-blur-sm border border-white/10 hover:border-white/30 rounded-2xl p-8 hover:bg-white/[0.07]"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? 'translateY(0)' : 'translateY(36px)',
                    transition: `opacity 0.7s ease ${i * 130}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 130}ms`,
                  }}
                >
                  <div className="module-icon w-12 h-12 rounded-xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center mb-6">
                    {icon}
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-300/80 mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{code}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                  <p className="text-sm text-white/70 leading-relaxed">{desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── MODULES ── */}
      <section id="modules" className="relative py-24 px-6" style={{ zIndex: 2 }}>
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-emerald-300/40" />
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-200/80" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Portal Modules</span>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-12 max-w-3xl">
              Everything in <span className="text-emerald-200">one place.</span>
            </h2>
          </Reveal>

          <div className="space-y-4">
            {[
              {
                badge: 'Five tiers',
                title: 'Document Library',
                desc: 'Policies, IMS manuals, procedures, work instructions, and forms — organized in five tiers and categorized by department. Always controlled, always current.',
                icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-emerald-200"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>,
              },
              {
                badge: 'Audit ready',
                title: 'Non-Conformance Reports',
                desc: 'Capture, track, and resolve non-conformances with full audit trails, electronic signatures, severity classification, and corrective action workflows.',
                icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-emerald-200"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
              },
              {
                badge: 'Always current',
                title: 'ISO Certificate Repository',
                desc: 'Quick access to all current accredited ISO certifications. Always know what we\'re certified for and when each renewal is due.',
                icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-emerald-200"><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" /></svg>,
              },
              {
                badge: 'Three tiers',
                title: 'Role-Based Access',
                desc: 'Admin, Editor, and Viewer permissions ensure the right people have the right access. Quality records stay secure, accountable, and properly controlled.',
                icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-emerald-200"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
              },
            ].map(({ badge, title, desc, icon }, i) => {
              const { ref, inView } = useInView()
              return (
                <div
                  key={title}
                  ref={ref}
                  className="module-card bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-2xl p-8 flex flex-col md:flex-row items-start gap-6 hover:bg-white/[0.07] transition-colors"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? 'translateX(0)' : 'translateX(-28px)',
                    transition: `opacity 0.65s ease ${i * 110}ms, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${i * 110}ms`,
                  }}
                >
                  <div className="module-icon w-14 h-14 rounded-xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center shrink-0">
                    {icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-white">{title}</h3>
                      <span
                        className="text-[10px] font-mono px-2 py-0.5 bg-emerald-300/15 text-emerald-200 rounded uppercase tracking-wider"
                        style={{ fontFamily: "'JetBrains Mono', monospace", animation: 'badge-glow 3s ease-in-out infinite' }}
                      >
                        {badge}
                      </span>
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed">{desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── ACCESS / CTA ── */}
      <section id="access" className="relative py-24 px-6" style={{ zIndex: 2 }}>
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-300/15 to-emerald-500/5 rounded-3xl blur-md" />
              <div className="relative bg-white/[0.07] backdrop-blur-md border border-white/15 rounded-3xl p-10 md:p-14 shadow-2xl text-center">
                <Reveal delay={80}>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-emerald-200">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <h3 className="text-[11px] font-semibold text-emerald-100 uppercase tracking-[0.25em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Access Instructions</h3>
                  </div>
                </Reveal>
                <Reveal delay={160}>
                  <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
                    Sign in with your <span className="text-emerald-200">Outlook account</span>
                  </h2>
                </Reveal>
                <Reveal delay={240}>
                  <p className="text-base text-white/80 leading-relaxed max-w-2xl mx-auto mb-8">
                    Once authenticated, you can view and download files based on your assigned permissions. Contact your IT administrator for access support.
                  </p>
                </Reveal>
                <Reveal delay={320}>
                  <Link href="/login" className="cta-btn inline-flex items-center gap-2 bg-white text-emerald-900 font-semibold px-8 py-3.5 rounded-lg shadow-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                    Sign In with Outlook
                  </Link>
                </Reveal>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative py-12 px-6 border-t border-white/10" style={{ zIndex: 2 }}>
        <Reveal>
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              {!logoError && <img src="/operon-logo-white.png" alt="Operon" className="h-7 w-auto object-contain opacity-70" />}
              <p className="text-xs text-white/60">© 2026 Operon Middle East — An Edgenta Company</p>
            </div>
            <p className="text-[10px] font-mono text-white/50 tracking-[0.2em] uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              ISO 9001:2015 · ISO 14001:2015 · ISO 45001:2018
            </p>
          </div>
        </Reveal>
      </footer>
    </main>
  )
}
