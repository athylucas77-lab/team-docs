'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [logoError, setLogoError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center bg-emerald-50/40 px-4 py-12 relative overflow-hidden"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {/* Full background image with green tone overlay */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <img
          src="/operon-logo-designer-01.png"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
        />
        {/* Overlay to shift teal → vivid green to match reference */}
        <div className="absolute inset-0" style={{ backgroundColor: '#006B2B', mixBlendMode: 'hue', opacity: 0.6 }} />
      </div>

      {/* Decorative color blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-emerald-300/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Brand badge above card */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div
            className="text-[10px] font-mono text-white/70 uppercase tracking-[0.2em]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            ⏤ ISO IMS Portal
          </div>
        </div>

        {/* Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-100 p-8 md:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-5">
              {!logoError ? (
                <img
                  src="/operon-logo-green.png"
                  alt="Operon Middle East Logo"
                  className="w-20 h-20 object-contain"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="bg-emerald-700 p-4 rounded-xl">
                  <div className="text-white text-center">
                    <div className="text-xl font-bold tracking-wider">OPERON</div>
                    <div className="text-[8px] text-emerald-200 mt-1">AN EDGENTA COMPANY</div>
                  </div>
                </div>
              )}
            </div>
            <h1 className="text-2xl font-bold text-emerald-950 tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-emerald-700/70 mt-2">
              Sign in to your Operon Middle East account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
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
              <label htmlFor="password" className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">
                Password
              </label>
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
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 hover:text-emerald-900 transition"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    // Eye-off icon
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    // Eye icon
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-sm p-3 rounded-lg flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mt-0.5 shrink-0">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white font-semibold py-3 rounded-lg shadow-sm transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer link */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-emerald-700 hover:text-emerald-900 hover:underline transition">
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Outside card footer */}
        <p className="text-xs text-white/60 text-center mt-6">
          Need help? Contact your IT administrator.
        </p>
        <p className="text-xs text-white/50 text-center mt-2">
          © 2026 Operon Middle East — An Edgenta Company
        </p>
      </div>
    </main>
  )
}
