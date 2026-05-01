'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const ADMIN_EMAIL = 'harlene@example.com'

interface NCR {
  id: string
  ncr_number: string
  title: string
  description: string | null
  status: 'Open' | 'In Progress' | 'Closed'
  reported_date: string
  created_by: string | null
  created_at: string
  updated_at: string
}

const SearchIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
  </svg>
)
const PlusIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)
const EditIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)
const TrashIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
)
const XIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="18" x2="18" y2="6" />
  </svg>
)
const ChevronRightIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
)
const LogOutIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
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

export default function NCRPage() {
  const [ncrs, setNcrs] = useState<NCR[]>([])
  const [userEmail, setUserEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [canEdit, setCanEdit] = useState(false)
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Open' | 'In Progress' | 'Closed'>('All')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<NCR | null>(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'Open' as 'Open' | 'In Progress' | 'Closed',
    reported_date: new Date().toISOString().split('T')[0],
  })
  const [saving, setSaving] = useState(false)
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
    const admin = user.email === ADMIN_EMAIL
    setIsAdmin(admin)

    if (admin) {
      setCanEdit(true)
    } else {
      const { data: editor } = await supabase
        .from('ncr_editors')
        .select('email')
        .eq('email', user.email)
        .maybeSingle()
      setCanEdit(!!editor)
    }

    await loadNCRs()
    setLoading(false)
  }

  const loadNCRs = async () => {
    const { data, error } = await supabase
      .from('ncrs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading NCRs:', error.message)
      return
    }
    setNcrs(data || [])
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const openCreateModal = () => {
    setEditing(null)
    setForm({
      title: '',
      description: '',
      status: 'Open',
      reported_date: new Date().toISOString().split('T')[0],
    })
    setShowModal(true)
  }

  const openEditModal = (ncr: NCR) => {
    setEditing(ncr)
    setForm({
      title: ncr.title,
      description: ncr.description || '',
      status: ncr.status,
      reported_date: ncr.reported_date,
    })
    setShowModal(true)
  }

  const generateNCRNumber = () => {
    const year = new Date().getFullYear()
    const existingThisYear = ncrs.filter(n => n.ncr_number.startsWith(`NCR-${year}`))
    const next = existingThisYear.length + 1
    return `NCR-${year}-${String(next).padStart(3, '0')}`
  }

  const handleSave = async () => {
    if (!form.title.trim()) {
      alert('Title is required')
      return
    }
    setSaving(true)

    if (editing) {
      const { error } = await supabase
        .from('ncrs')
        .update({
          title: form.title.trim(),
          description: form.description.trim() || null,
          status: form.status,
          reported_date: form.reported_date,
        })
        .eq('id', editing.id)
      if (error) {
        alert('Could not update: ' + error.message)
        setSaving(false)
        return
      }
    } else {
      const { error } = await supabase.from('ncrs').insert({
        ncr_number: generateNCRNumber(),
        title: form.title.trim(),
        description: form.description.trim() || null,
        status: form.status,
        reported_date: form.reported_date,
        created_by: userEmail,
      })
      if (error) {
        alert('Could not create: ' + error.message)
        setSaving(false)
        return
      }
    }

    await loadNCRs()
    setShowModal(false)
    setSaving(false)
  }

  const handleDelete = async (ncr: NCR) => {
    if (!confirm(`Delete ${ncr.ncr_number}? This cannot be undone.`)) return
    const { error } = await supabase.from('ncrs').delete().eq('id', ncr.id)
    if (error) {
      alert('Could not delete: ' + error.message)
      return
    }
    await loadNCRs()
  }

  const filteredNCRs = ncrs.filter(n => {
    const matchesQuery =
      n.title.toLowerCase().includes(query.toLowerCase()) ||
      n.ncr_number.toLowerCase().includes(query.toLowerCase()) ||
      (n.description || '').toLowerCase().includes(query.toLowerCase())
    const matchesStatus = statusFilter === 'All' || n.status === statusFilter
    return matchesQuery && matchesStatus
  })

  const stats = {
    total: ncrs.length,
    open: ncrs.filter(n => n.status === 'Open').length,
    inProgress: ncrs.filter(n => n.status === 'In Progress').length,
    closed: ncrs.filter(n => n.status === 'Closed').length,
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const statusBadge = (status: string) => {
    if (status === 'Open') return 'bg-rose-50 text-rose-700 ring-rose-600/20'
    if (status === 'In Progress') return 'bg-amber-50 text-amber-700 ring-amber-600/20'
    return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
  }

  const statusDot = (status: string) => {
    if (status === 'Open') return 'bg-rose-500'
    if (status === 'In Progress') return 'bg-amber-500'
    return 'bg-emerald-500'
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-emerald-50/40" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-emerald-200 border-t-emerald-700 rounded-full animate-spin" />
          <div className="text-emerald-800 text-sm">Loading NCRs…</div>
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

            <Link href="/documents" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left mb-0.5 hover:bg-emerald-800/50 text-emerald-100 transition-all">
              <div className="w-8 h-8 rounded-md bg-emerald-800 text-emerald-300 flex items-center justify-center shrink-0">
                <FolderIcon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Document Library</span>
            </Link>

            <div className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left mb-0.5 bg-emerald-50 text-emerald-950 shadow-sm">
              <div className="w-8 h-8 rounded-md bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <AlertIcon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Non-Conformance</span>
              <span className="ml-auto text-xs font-medium tabular-nums px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">{stats.total}</span>
            </div>

            {canEdit && (
              <button onClick={openCreateModal} className="mt-4 w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white transition shadow-sm">
                <div className="w-8 h-8 rounded-md bg-emerald-50 text-emerald-900 flex items-center justify-center shrink-0">
                  <PlusIcon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">New NCR</span>
              </button>
            )}
          </nav>

          <div className="p-3 border-t border-emerald-800/60">
            <div className="flex items-center gap-3 p-2 rounded-lg">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-300 to-emerald-500 flex items-center justify-center text-emerald-950 font-semibold text-sm">
                {userEmail.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate flex items-center gap-1">
                  {isAdmin && <span className="text-amber-300">👑</span>}
                  {isAdmin ? 'Admin' : canEdit ? 'NCR Editor' : 'Viewer'}
                </div>
                <div className="text-xs text-emerald-300 truncate">{userEmail}</div>
              </div>
              <button onClick={handleSignOut} className="text-emerald-300 hover:text-white p-1.5 rounded-md hover:bg-emerald-800 transition" title="Sign out">
                <LogOutIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-w-0">
          <header className="bg-white border-b border-emerald-100 px-8 py-4">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-2 text-sm text-emerald-700/70 min-w-0">
                <span className="shrink-0">IMS Portal</span>
                <ChevronRightIcon className="w-4 h-4 shrink-0" />
                <span className="text-emerald-950 font-medium truncate">Non-Conformance Reports</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-full text-xs font-medium ring-1 ring-emerald-600/20 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {canEdit ? 'Edit access' : 'View only access'}
              </div>
            </div>
          </header>

          <div className="flex-1 p-8">
            <div className="mb-8">
              <div className="text-xs font-mono text-emerald-700/70 mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>NCR REGISTER</div>
              <h1 className="text-3xl font-bold tracking-tight text-emerald-950">Non-Conformance Reports</h1>
              <p className="text-sm text-emerald-700/70 mt-1">Track, manage, and resolve non-conformances across the organization.</p>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
              <button onClick={() => setStatusFilter('All')} className={`bg-white rounded-xl border p-5 text-left transition ${statusFilter === 'All' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-emerald-100 hover:border-emerald-300'}`}>
                <div className="text-xs text-emerald-700/70 mb-1">Total</div>
                <div className="text-3xl font-bold text-emerald-950 tabular-nums">{stats.total}</div>
              </button>
              <button onClick={() => setStatusFilter('Open')} className={`bg-white rounded-xl border p-5 text-left transition ${statusFilter === 'Open' ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-emerald-100 hover:border-rose-300'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <div className="text-xs text-emerald-700/70">Open</div>
                </div>
                <div className="text-3xl font-bold text-rose-600 tabular-nums">{stats.open}</div>
              </button>
              <button onClick={() => setStatusFilter('In Progress')} className={`bg-white rounded-xl border p-5 text-left transition ${statusFilter === 'In Progress' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-emerald-100 hover:border-amber-300'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <div className="text-xs text-emerald-700/70">In Progress</div>
                </div>
                <div className="text-3xl font-bold text-amber-600 tabular-nums">{stats.inProgress}</div>
              </button>
              <button onClick={() => setStatusFilter('Closed')} className={`bg-white rounded-xl border p-5 text-left transition ${statusFilter === 'Closed' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-emerald-100 hover:border-emerald-300'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <div className="text-xs text-emerald-700/70">Closed</div>
                </div>
                <div className="text-3xl font-bold text-emerald-700 tabular-nums">{stats.closed}</div>
              </button>
            </div>

            <div className="relative mb-6 max-w-md">
              <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600/60" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search NCRs by number, title, or description…" className="w-full pl-10 pr-4 py-2.5 bg-white border border-emerald-200 rounded-lg text-sm text-emerald-950 placeholder:text-emerald-700/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition" />
            </div>

            {filteredNCRs.length > 0 ? (
              <div className="bg-white rounded-xl border border-emerald-100 overflow-hidden shadow-sm">
                <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-emerald-100 bg-emerald-50/60 text-[10px] font-semibold uppercase tracking-wider text-emerald-800">
                  <div className="col-span-2">NCR Number</div>
                  <div className="col-span-5">Title</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Reported</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>
                {filteredNCRs.map((ncr) => (
                  <div key={ncr.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-emerald-50 last:border-0 hover:bg-emerald-50/40 transition group">
                    <div className="col-span-2 text-xs font-mono text-emerald-800 font-medium" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{ncr.ncr_number}</div>
                    <div className="col-span-5 min-w-0">
                      <div className="text-sm font-medium text-emerald-950 truncate">{ncr.title}</div>
                      {ncr.description && <div className="text-xs text-emerald-700/60 truncate mt-0.5">{ncr.description}</div>}
                    </div>
                    <div className="col-span-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ${statusBadge(ncr.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDot(ncr.status)}`} />
                        {ncr.status}
                      </span>
                    </div>
                    <div className="col-span-2 text-sm text-emerald-800/80">{formatDate(ncr.reported_date)}</div>
                    <div className="col-span-1 flex justify-end gap-1">
                      {canEdit && (
                        <button onClick={() => openEditModal(ncr)} className="p-2 rounded-md hover:bg-emerald-100 transition" title="Edit">
                          <EditIcon className="w-4 h-4 text-emerald-700" />
                        </button>
                      )}
                      {isAdmin && (
                        <button onClick={() => handleDelete(ncr)} className="p-2 rounded-md hover:bg-rose-50 transition opacity-0 group-hover:opacity-100" title="Delete">
                          <TrashIcon className="w-4 h-4 text-rose-600" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-dashed border-emerald-200 p-16 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4 text-emerald-600">
                  <AlertIcon className="w-5 h-5" />
                </div>
                <div className="text-sm font-medium text-emerald-950 mb-1">
                  {query || statusFilter !== 'All' ? 'No NCRs match your filter' : 'No NCRs yet'}
                </div>
                <div className="text-xs text-emerald-700/60">
                  {canEdit && !query && statusFilter === 'All' ? 'Click "New NCR" in the sidebar to create the first one.' : query || statusFilter !== 'All' ? 'Try adjusting your search or filter.' : 'NCRs will appear here once created.'}
                </div>
              </div>
            )}
          </div>

          <footer className="px-8 py-4 border-t border-emerald-100 bg-white text-xs text-emerald-700/70 flex items-center justify-between">
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-emerald-100 flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-emerald-700/70" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{editing ? editing.ncr_number : 'NEW NCR'}</div>
                <h2 className="text-lg font-bold text-emerald-950">{editing ? 'Edit NCR' : 'Create New NCR'}</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-md hover:bg-emerald-50 transition">
                <XIcon className="w-4 h-4 text-emerald-700" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">Title <span className="text-rose-500">*</span></label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Brief description of the non-conformance" className="w-full px-3 py-2.5 bg-white border border-emerald-200 rounded-lg text-sm text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} placeholder="Detailed explanation of the issue, root cause, and any corrective action..." className="w-full px-3 py-2.5 bg-white border border-emerald-200 rounded-lg text-sm text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })} className="w-full px-3 py-2.5 bg-white border border-emerald-200 rounded-lg text-sm text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition">
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">Reported Date</label>
                  <input type="date" value={form.reported_date} onChange={(e) => setForm({ ...form, reported_date: e.target.value })} className="w-full px-3 py-2.5 bg-white border border-emerald-200 rounded-lg text-sm text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition" />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-emerald-100 bg-emerald-50/40 flex items-center justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-100 rounded-lg transition">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm font-medium bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition shadow-sm disabled:opacity-50">
                {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create NCR'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}