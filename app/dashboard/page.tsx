'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const ADMIN_EMAIL = 'harlene@example.com'

const TIERS = [
  'tier-1-policies',
  'tier-2-ims-manual',
  'tier-3-procedures',
  'tier-4-work-instructions',
  'tier-5-forms',
]

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
const ArrowRightIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
)
const LogOutIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)
const HomeIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [documentCount, setDocumentCount] = useState(0)
  const [ncrStats, setNcrStats] = useState({ total: 0, open: 0, inProgress: 0 })
  const router = useRouter()

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    setUserEmail(user.email || '')
    setIsAdmin(user.email === ADMIN_EMAIL)

    let docTotal = 0
    for (const tierId of TIERS) {
      const { data } = await supabase.storage
        .from('documents')
        .list(tierId, { limit: 100 })
      const docs = (data || []).filter(d => d.name !== '.emptyFolderPlaceholder')
      docTotal += docs.length
    }
    setDocumentCount(docTotal)

    const { data: ncrs } = await supabase.from('ncrs').select('status')
    if (ncrs) {
      setNcrStats({
        total: ncrs.length,
        open: ncrs.filter(n => n.status === 'Open').length,
        inProgress: ncrs.filter(n => n.status === 'In Progress').length,
      })
    }

    setLoading(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const getGreetingName = () => {
    if (!userEmail) return 'there'
    const name = userEmail.split('@')[0]
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-emerald-50/40" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-emerald-200 border-t-emerald-700 rounded-full animate-spin" />
          <div className="text-emerald-800 text-sm">Loading dashboard…</div>
        </div>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-emerald-50/40 text-emerald-950" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      <div className="flex min-h-screen">
        <aside className="w-72 bg-emerald-900 text-emerald-50 flex flex-col">
          <div className="p-6 border-b border-emerald-800/60">
            <div className="flex items-center gap-3">
              <img src="/operon-logo-green.png" alt="Operon" className="w-9 h-9 rounded-lg object-contain bg-white p-1" />
              <div>
                <div className="font-semibold text-sm leading-tight text-white">ISO IMS Portal</div>
                <div className="text-xs text-emerald-300 leading-tight">Operon Middle East</div>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-3">
            <div className="text-[10px] font-semibold text-emerald-400/80 uppercase tracking-wider px-3 py-2">Modules</div>

            <div className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left mb-0.5 bg-emerald-50 text-emerald-950 shadow-sm">
              <div className="w-8 h-8 rounded-md bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <HomeIcon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Home</span>
            </div>

            <Link href="/documents" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left mb-0.5 hover:bg-emerald-800/50 text-emerald-100 transition-all">
              <div className="w-8 h-8 rounded-md bg-emerald-800 text-emerald-300 flex items-center justify-center shrink-0">
                <FolderIcon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Document Library</span>
              <span className="ml-auto text-xs font-medium tabular-nums text-emerald-400/60">{documentCount}</span>
            </Link>

            <Link href="/ncr" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left mb-0.5 hover:bg-emerald-800/50 text-emerald-100 transition-all">
              <div className="w-8 h-8 rounded-md bg-emerald-800 text-emerald-300 flex items-center justify-center shrink-0">
                <AlertIcon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Non-Conformance</span>
              <span className="ml-auto text-xs font-medium tabular-nums text-emerald-400/60">{ncrStats.total}</span>
            </Link>
          </nav>

          <div className="p-3 border-t border-emerald-800/60">
            <div className="flex items-center gap-3 p-2 rounded-lg">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-300 to-emerald-500 flex items-center justify-center text-emerald-950 font-semibold text-sm">
                {userEmail.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate flex items-center gap-1">
                  {isAdmin && <span className="text-amber-300">👑</span>}
                  {isAdmin ? 'Admin' : 'Viewer'}
                </div>
                <div className="text-xs text-emerald-300 truncate">{userEmail}</div>
              </div>
              <button onClick={handleSignOut} className="text-emerald-300 hover:text-white p-1.5 rounded-md hover:bg-emerald-800 transition" title="Sign out">
                <LogOutIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-w-0 relative">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <img src="/operon-logo-grey.png" alt="" aria-hidden="true" className="w-[700px] max-w-[80%] opacity-[0.05]" />
          </div>

          <header className="bg-white border-b border-emerald-100 px-8 py-4 relative">
            <div className="flex items-center justify-between gap-6">
              <div className="text-sm text-emerald-950 font-medium">Home</div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-full text-xs font-medium ring-1 ring-emerald-600/20 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {isAdmin ? 'Admin access' : 'Viewer access'}
              </div>
            </div>
          </header>

          <div className="flex-1 p-8 relative">
            <div className="mb-10">
              <div className="text-xs font-mono text-emerald-700/70 mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>WELCOME BACK</div>
              <h1 className="text-3xl font-bold tracking-tight text-emerald-950">Hello, {getGreetingName()} 👋</h1>
              <p className="text-sm text-emerald-700/70 mt-1">Here's what's happening across your IMS modules today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              <Link href="/documents" className="bg-white rounded-2xl border border-emerald-100 p-8 text-left transition-all hover:border-emerald-300 hover:shadow-lg group block">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <FolderIcon className="w-7 h-7" />
                  </div>
                  <ArrowRightIcon className="w-5 h-5 text-emerald-300 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
                </div>
                <h2 className="text-xl font-bold text-emerald-950 mb-2">Document Library</h2>
                <p className="text-sm text-emerald-700/70 mb-6 leading-relaxed">
                  Access policies, procedures, manuals, work instructions, and forms organized in five tiers.
                </p>
                <div className="flex items-baseline gap-2 pt-4 border-t border-emerald-50">
                  <span className="text-3xl font-bold tabular-nums text-emerald-700">{documentCount}</span>
                  <span className="text-sm text-emerald-700/70">{documentCount === 1 ? 'document' : 'documents'} across 5 tiers</span>
                </div>
              </Link>

              <Link href="/ncr" className="bg-white rounded-2xl border border-emerald-100 p-8 text-left transition-all hover:border-emerald-300 hover:shadow-lg group block">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <AlertIcon className="w-7 h-7" />
                  </div>
                  <ArrowRightIcon className="w-5 h-5 text-emerald-300 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
                </div>
                <h2 className="text-xl font-bold text-emerald-950 mb-2">Non-Conformance Reports</h2>
                <p className="text-sm text-emerald-700/70 mb-6 leading-relaxed">
                  Track, manage, and resolve non-conformances across the organization.
                </p>
                <div className="flex items-baseline gap-4 pt-4 border-t border-emerald-50 flex-wrap">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-bold tabular-nums text-emerald-700">{ncrStats.total}</span>
                    <span className="text-xs text-emerald-700/70">total</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span className="text-emerald-700/70">{ncrStats.open} open</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span className="text-emerald-700/70">{ncrStats.inProgress} in progress</span>
                  </div>
                </div>
              </Link>
            </div>

            <div className="mt-12 max-w-4xl">
              <div className="text-xs font-mono text-emerald-700/70 mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>QUICK INFO</div>
              <div className="bg-white rounded-xl border border-emerald-100 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-xs text-emerald-700/70 mb-1">Your role</div>
                    <div className="text-sm font-semibold text-emerald-950 flex items-center gap-1">
                      {isAdmin && <span className="text-amber-500">👑</span>}
                      {isAdmin ? 'Administrator' : 'Viewer'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-emerald-700/70 mb-1">Account</div>
                    <div className="text-sm font-semibold text-emerald-950 truncate">{userEmail}</div>
                  </div>
                  <div>
                    <div className="text-xs text-emerald-700/70 mb-1">Organization</div>
                    <div className="text-sm font-semibold text-emerald-950">Operon Middle East</div>
                  </div>
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
