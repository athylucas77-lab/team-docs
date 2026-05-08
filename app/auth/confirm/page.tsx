'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const supabase = createClient()

export default function AuthConfirmPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [ready, setReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleToken = async () => {
      const hash = window.location.hash
      if (!hash) { router.push('/login'); return }

      const params = new URLSearchParams(hash.substring(1))
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')

      if (!accessToken) {
        router.push('/login')
        return
      }

      // Clear the hash from URL to prevent re-processing
      window.history.replaceState(null, '', window.location.pathname)

      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken || '',
      })

      if (error) {
        setError('Invalid or expired link. Please request a new invite.')
      } else {
        setReady(true)
      }
    }

    handleToken()
  }, [])

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess('Password set! Redirecting to dashboard…')
      setTimeout(() => router.push('/dashboard'), 2000)
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        background: 'radial-gradient(ellipse at top right, #0F5A35 0%, #094A2A 50%, #063B22 100%)',
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-[10px] font-mono text-white/70 uppercase tracking-[0.2em]">
            ⏤ ISO IMS Portal
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-100 p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-5">
              <img src="/operon-logo-green.png" alt="Operon" className="w-20 h-20 object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-emerald-950">Set your password</h1>
            <p className="text-sm text-emerald-700/70 mt-2">
              Welcome! Choose a password to activate your account.
            </p>
          </div>

          {!ready && !error && (
            <div className="flex items-center justify-center gap-3 py-8">
              <div className="w-5 h-5 border-2 border-emerald-300 border-t-emerald-700 rounded-full animate-spin" />
              <span className="text-sm text-emerald-700">Verifying your invite link…</span>
            </div>
          )}

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-sm p-4 rounded-lg text-center">
              {error}
              <button onClick={() => router.push('/login')} className="block mx-auto mt-3 text-emerald-700 hover:underline text-xs">
                Back to login
              </button>
            </div>
          )}

          {ready && !error && (
            <form onSubmit={handleSetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Choose a strong password"
                    minLength={6}
                    className="w-full px-3 py-2.5 pr-10 bg-white border border-emerald-200 rounded-lg text-sm text-emerald-950 placeholder:text-emerald-700/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
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

              <div>
                <label className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  minLength={6}
                  className="w-full px-3 py-2.5 bg-white border border-emerald-200 rounded-lg text-sm text-emerald-950 placeholder:text-emerald-700/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                />
              </div>

              {success && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm p-3 rounded-lg flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0"><path d="M20 6L9 17l-5-5" /></svg>
                  {success}
                </div>
              )}

              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 text-sm p-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white font-semibold py-3 rounded-lg shadow-sm transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Setting password…</>
                ) : 'Set Password & Continue'}
              </button>
            </form>
          )}
        </div>

        <p className="text-xs text-white/50 text-center mt-6">
          © 2026 Operon Middle East — An Edgenta Company
        </p>
      </div>
    </main>
  )
}