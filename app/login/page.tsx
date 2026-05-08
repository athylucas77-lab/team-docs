'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
const supabase = createClient()

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [logoError, setLogoError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [mode, setMode] = useState<'login' | 'set-password'>('login')
  const [successMessage, setSuccessMessage] = useState('')
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Detect invite token in URL hash
  useEffect(() => {
    const hash = window.location.hash
    if (hash && hash.includes('type=invite')) {
      setMode('set-password')
    }
    // Also handle recovery/signup tokens
    if (hash && (hash.includes('type=recovery') || hash.includes('type=signup'))) {
      setMode('set-password')
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccessMessage('Password set successfully! Redirecting…')
      setTimeout(() => router.push('/dashboard'), 2000)
    }
  }

  // Animated particle network background
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let particles: Array<{ x: number; y: number; vx: number; vy: number; radius: number }> = []

    const resizeCanvas = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    const initParticles = () => {
      const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 20000))
      particles = []
      for (let i = 0; i < count; i++) {
        particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, radius: Math.random() * 1.5 + 0.5 })
      }
    }
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(167, 243, 208, 0.6)'; ctx.fill()
      })
      const maxDistance = 140
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x; const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.3
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(110, 231, 183, ${opacity})`; ctx.lineWidth = 0.6; ctx.stroke()
          }
        }
      }
      animationId = requestAnimationFrame(animate)
    }
    resizeCanvas(); initParticles(); animate()
    const onResize = () => { resizeCanvas(); initParticles() }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', onResize) }
  }, [])

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ fontFamily: "'Inter', system-ui, sans-serif", background: 'radial-gradient(ellipse at top right, #0F5A35 0%, #094A2A 50%, #063B22 100%)' }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
        <div className="absolute -top-20 -right-20 w-[600px] h-[600px] rounded-full bg-emerald-300/8 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-emerald-900/30 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md" style={{ zIndex: 2 }}>
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="text-[10px] font-mono text-white/70 uppercase tracking-[0.2em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            ⏤ ISO IMS Portal
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-100 p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-5">
              {!logoError ? (
                <img src="/operon-logo-green.png" alt="Operon Middle East Logo" className="w-20 h-20 object-contain" onError={() => setLogoError(true)} />
              ) : (
                <div className="bg-emerald-700 p-4 rounded-xl">
                  <div className="text-white text-center">
                    <div className="text-xl font-bold tracking-wider">OPERON</div>
                    <div className="text-[8px] text-emerald-200 mt-1">AN EDGENTA COMPANY</div>
                  </div>
                </div>
              )}
            </div>

            {mode === 'set-password' ? (
              <>
                <h1 className="text-2xl font-bold text-emerald-950 tracking-tight">Set your password</h1>
                <p className="text-sm text-emerald-700/70 mt-2">Welcome! Choose a password to activate your account.</p>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-emerald-950 tracking-tight">Welcome back</h1>
                <p className="text-sm text-emerald-700/70 mt-2">Sign in to your Operon Middle East account</p>
              </>
            )}
          </div>

          {/* Set Password Form */}
          {mode === 'set-password' ? (
            <form onSubmit={handleSetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2.5 pr-10 bg-white border border-emerald-200 rounded-lg text-sm text-emerald-950 placeholder:text-emerald-700/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                    placeholder="Choose a strong password"
                    minLength={6}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 hover:text-emerald-900 transition" tabIndex={-1}>
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    )}
                  </button>
                </div>
                <p className="text-xs text-emerald-700/50 mt-1.5">Minimum 6 characters</p>
              </div>

              {successMessage && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm p-3 rounded-lg flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0"><path d="M20 6L9 17l-5-5" /></svg>
                  {successMessage}
                </div>
              )}

              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 text-sm p-3 rounded-lg flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mt-0.5 shrink-0"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                  <span>{error}</span>
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white font-semibold py-3 rounded-lg shadow-sm transition flex items-center justify-center gap-2">
                {loading ? (<><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Setting password…</>) : 'Set Password & Continue'}
              </button>

              <button type="button" onClick={() => setMode('login')} className="w-full text-sm text-emerald-700 hover:text-emerald-900 transition text-center">
                Already have a password? Sign in instead
              </button>
            </form>
          ) : (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">Email Address</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-emerald-200 rounded-lg text-sm text-emerald-950 placeholder:text-emerald-700/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                  placeholder="yourname@operon.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2.5 pr-10 bg-white border border-emerald-200 rounded-lg text-sm text-emerald-950 placeholder:text-emerald-700/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 hover:text-emerald-900 transition" tabIndex={-1}>
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 text-sm p-3 rounded-lg flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mt-0.5 shrink-0"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                  <span>{error}</span>
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white font-semibold py-3 rounded-lg shadow-sm transition flex items-center justify-center gap-2">
                {loading ? (<><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in…</>) : 'Sign In'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-emerald-700 hover:text-emerald-900 hover:underline transition">← Back to Home</Link>
          </div>
        </div>

        <p className="text-xs text-white/60 text-center mt-6">Need help? Contact your IT administrator.</p>
        <p className="text-xs text-white/50 text-center mt-2">© 2026 Operon Middle East — An Edgenta Company</p>
      </div>
    </main>
  )
}