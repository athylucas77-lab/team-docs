'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const ADMIN_EMAIL = 'harlene@example.com'

const HomeIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)
const FolderIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
)
const AlertIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)
const AwardIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </svg>
)
const CheckCircleIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)
const LogOutIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)
const ArrowRightIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
)
const InfoIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
)
const ShieldIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)
const LeafIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6" />
  </svg>
)
const HeartIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

export default function AboutPage() {
  const [userEmail, setUserEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [isEditor, setIsEditor] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      await supabase.auth.signOut()
      router.push('/login')
      return
    }
    setUserEmail(user.email || '')
    const admin = user.email === ADMIN_EMAIL
    setIsAdmin(admin)

    if (!admin) {
      const { data: editor } = await supabase
        .from('ncr_editors')
        .select('email')
        .eq('email', user.email)
        .maybeSingle()
      setIsEditor(!!editor)
    }
    setLoading(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const roleBadge = isAdmin ? 'Admin' : isEditor ? 'Editor' : 'Viewer'

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-emerald-50/40" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-emerald-200 border-t-emerald-700 rounded-full animate-spin" />
          <div className="text-emerald-800 text-sm">Loading…</div>
        </div>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-emerald-50/40 text-emerald-950" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      <div className="flex min-h-screen">
        <aside className="w-72 bg-emerald-900 text-emerald-50 flex flex-col">
          <Link href="/about" className="p-6 border-b border-emerald-800/60 hover:bg-emerald-800/30 transition-all block">
            <div className="flex items-center gap-3">
              <img src="/operon-logo-green.png" alt="Operon" className="w-9 h-9 rounded-lg object-contain bg-white p-1" />
              <div>
                <div className="font-semibold text-sm leading-tight text-white">ISO IMS Portal</div>
                <div className="text-xs text-emerald-300 leading-tight">Operon Middle East</div>
              </div>
            </div>
          </Link>

          <nav className="flex-1 p-3">
            <div className="text-[10px] font-semibold text-emerald-400/80 uppercase tracking-wider px-3 py-2">Modules</div>

            <Link href="/dashboard" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left mb-0.5 hover:bg-emerald-800/50 text-emerald-100 transition-all">
              <div className="w-8 h-8 rounded-md bg-emerald-800 text-emerald-300 flex items-center justify-center shrink-0">
                <HomeIcon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Home</span>
            </Link>

            <Link href="/documents" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left mb-0.5 hover:bg-emerald-800/50 text-emerald-100 transition-all">
              <div className="w-8 h-8 rounded-md bg-emerald-800 text-emerald-300 flex items-center justify-center shrink-0">
                <FolderIcon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Document Library</span>
            </Link>

            <Link href="/ncr" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left mb-0.5 hover:bg-emerald-800/50 text-emerald-100 transition-all">
              <div className="w-8 h-8 rounded-md bg-emerald-800 text-emerald-300 flex items-center justify-center shrink-0">
                <AlertIcon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Non-Conformance</span>
            </Link>

            <div className="text-[10px] font-semibold text-emerald-400/80 uppercase tracking-wider px-3 py-2 mt-4">Information</div>

            <div className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left mb-0.5 bg-emerald-50 text-emerald-950 shadow-sm">
              <div className="w-8 h-8 rounded-md bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <InfoIcon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">About Portal</span>
            </div>
          </nav>

          <div className="p-3 border-t border-emerald-800/60">
            <div className="flex items-center gap-3 p-2 rounded-lg">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-300 to-emerald-500 flex items-center justify-center text-emerald-950 font-semibold text-sm">
                {userEmail.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate flex items-center gap-1">
                  {isAdmin && <span className="text-amber-300">👑</span>}
                  {roleBadge}
                </div>
                <div className="text-xs text-emerald-300 truncate">{userEmail}</div>
              </div>
              <button type="button" onClick={handleSignOut} className="text-emerald-300 hover:text-white p-1.5 rounded-md hover:bg-emerald-800 transition" title="Sign out">
                <LogOutIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-w-0 relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <img src="/operon-logo-grey.png" alt="" aria-hidden="true" className="w-[700px] max-w-[80%] opacity-[0.05]" />
          </div>

          <header className="bg-white border-b border-emerald-100 px-8 py-4 relative">
            <div className="flex items-center justify-between gap-6">
              <div className="text-sm text-emerald-950 font-medium">About Portal</div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-full text-xs font-medium ring-1 ring-emerald-600/20 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {isAdmin ? 'Admin access' : isEditor ? 'Edit access' : 'Viewer access'}
              </div>
            </div>
          </header>

          <div className="flex-1 p-8 relative max-w-5xl">
            {/* Hero Section */}
            <div className="mb-10">
              <div className="text-xs font-mono text-emerald-700/70 mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>WELCOME TO</div>
              <h1 className="text-4xl font-bold tracking-tight text-emerald-950 mb-3">ISO IMS Portal</h1>
              <p className="text-lg text-emerald-700/80 leading-relaxed max-w-3xl">
                Operon Middle East's Integrated Management System portal — your single source of truth for ISO-certified policies, procedures, forms, and quality records.
              </p>
            </div>

            {/* Mission card */}
            <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-2xl p-8 text-white mb-10 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center shrink-0">
                  <HeartIcon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2">Our Commitment</h2>
                  <p className="text-emerald-50/90 leading-relaxed">
                    Operon Middle East is committed to delivering excellence through rigorous quality management,
                    environmental responsibility, and a steadfast focus on occupational health and safety.
                    This portal is the digital backbone of our Integrated Management System.
                  </p>
                </div>
              </div>
            </div>

            {/* ISO Standards */}
            <div className="mb-10">
              <div className="text-xs font-mono text-emerald-700/70 mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>CERTIFIED STANDARDS</div>
              <h2 className="text-2xl font-bold tracking-tight text-emerald-950 mb-4">ISO Standards We Maintain</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-emerald-100 p-6 hover:border-emerald-300 hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                    <AwardIcon className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-mono text-emerald-600 mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>ISO 9001:2015</div>
                  <h3 className="text-base font-bold text-emerald-950 mb-2">Quality Management</h3>
                  <p className="text-sm text-emerald-700/70 leading-relaxed">
                    Ensuring consistent quality in our services and continuous improvement of customer satisfaction.
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-emerald-100 p-6 hover:border-emerald-300 hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                    <LeafIcon className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-mono text-emerald-600 mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>ISO 14001:2015</div>
                  <h3 className="text-base font-bold text-emerald-950 mb-2">Environmental Management</h3>
                  <p className="text-sm text-emerald-700/70 leading-relaxed">
                    Minimizing environmental impact through responsible operations and sustainability practices.
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-emerald-100 p-6 hover:border-emerald-300 hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                    <ShieldIcon className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-mono text-emerald-600 mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>ISO 45001:2018</div>
                  <h3 className="text-base font-bold text-emerald-950 mb-2">Occupational Health & Safety</h3>
                  <p className="text-sm text-emerald-700/70 leading-relaxed">
                    Protecting the health, safety, and wellbeing of every employee, contractor, and visitor.
                  </p>
                </div>
              </div>
            </div>

            {/* What this portal does */}
            <div className="mb-10">
              <div className="text-xs font-mono text-emerald-700/70 mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>FEATURES</div>
              <h2 className="text-2xl font-bold tracking-tight text-emerald-950 mb-4">What This Portal Does</h2>

              <div className="bg-white rounded-xl border border-emerald-100 divide-y divide-emerald-50">
                <div className="p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <FolderIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-emerald-950 mb-1">Centralized Document Library</h3>
                    <p className="text-sm text-emerald-700/70 leading-relaxed">
                      All controlled documents organized in five tiers — from high-level policies down to departmental forms and checklists. One place, always up to date.
                    </p>
                  </div>
                </div>

                <div className="p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <AlertIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-emerald-950 mb-1">Non-Conformance Reporting</h3>
                    <p className="text-sm text-emerald-700/70 leading-relaxed">
                      Capture, track, and resolve non-conformances. Full audit trail with electronic signatures, severity tracking, and corrective action workflow.
                    </p>
                  </div>
                </div>

                <div className="p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <AwardIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-emerald-950 mb-1">ISO Certificate Repository</h3>
                    <p className="text-sm text-emerald-700/70 leading-relaxed">
                      Quick access to all current accredited ISO certifications. Always know what we're certified for and when each renewal is due.
                    </p>
                  </div>
                </div>

                <div className="p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircleIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-emerald-950 mb-1">Role-Based Access</h3>
                    <p className="text-sm text-emerald-700/70 leading-relaxed">
                      Three permission levels — Admin, Editor, Viewer — ensuring the right people have the right access. Quality records stay secure and accountable.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick navigation */}
            <div className="mb-10">
              <div className="text-xs font-mono text-emerald-700/70 mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>QUICK NAVIGATION</div>
              <h2 className="text-2xl font-bold tracking-tight text-emerald-950 mb-4">Get Started</h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link href="/dashboard" className="bg-white rounded-xl border border-emerald-100 p-5 hover:border-emerald-300 hover:shadow-md transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <HomeIcon className="w-5 h-5" />
                    </div>
                    <ArrowRightIcon className="w-4 h-4 text-emerald-300 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-sm font-bold text-emerald-950 mb-1">Home Dashboard</h3>
                  <p className="text-xs text-emerald-700/70">Overview, stats, and certificates</p>
                </Link>

                <Link href="/documents" className="bg-white rounded-xl border border-emerald-100 p-5 hover:border-emerald-300 hover:shadow-md transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <FolderIcon className="w-5 h-5" />
                    </div>
                    <ArrowRightIcon className="w-4 h-4 text-emerald-300 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-sm font-bold text-emerald-950 mb-1">Documents</h3>
                  <p className="text-xs text-emerald-700/70">Browse all 5 tiers</p>
                </Link>

                <Link href="/ncr" className="bg-white rounded-xl border border-emerald-100 p-5 hover:border-emerald-300 hover:shadow-md transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <AlertIcon className="w-5 h-5" />
                    </div>
                    <ArrowRightIcon className="w-4 h-4 text-emerald-300 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-sm font-bold text-emerald-950 mb-1">NCR Reports</h3>
                  <p className="text-xs text-emerald-700/70">Track non-conformances</p>
                </Link>
              </div>
            </div>

            {/* Company info */}
            <div className="mb-10">
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-6">
                <h3 className="text-sm font-bold text-emerald-950 mb-3">About Operon Middle East</h3>
                <p className="text-sm text-emerald-800/80 leading-relaxed mb-3">
                  Operon Middle East is an Edgenta Company providing integrated facility services across the region.
                  We deliver excellence through certified management systems, skilled personnel, and a deep commitment
                  to quality, safety, and environmental stewardship.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 bg-white border border-emerald-200 rounded-full text-emerald-700">An Edgenta Company</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 bg-white border border-emerald-200 rounded-full text-emerald-700">ISO Certified</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 bg-white border border-emerald-200 rounded-full text-emerald-700">Middle East</span>
                </div>
              </div>
            </div>
          </div>

          <footer className="px-8 py-4 border-t border-emerald-100 bg-white text-xs text-emerald-700/70 flex items-center justify-between relative">
            <div>© 2026 Operon Middle East — An Edgenta Company</div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Operational
              </span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}
