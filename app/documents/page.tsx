'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const ADMIN_EMAIL = 'harlene@example.com'

const ShieldIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)
const BookIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
)
const ClipboardListIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M9 12h6" />
    <path d="M9 16h6" />
  </svg>
)
const WorkflowIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="6" height="6" rx="1" />
    <rect x="15" y="15" width="6" height="6" rx="1" />
    <path d="M9 6h6a3 3 0 0 1 3 3v6" />
  </svg>
)
const FormIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="14" y2="13" />
    <line x1="8" y1="17" x2="12" y2="17" />
  </svg>
)
const ChevronDownIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
)
const TrashIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
  </svg>
)

const FORM_CATEGORIES = [
  { id: 'all', label: 'All Forms', folder: null },
  { id: 'management', label: 'Management', folder: 'management' },
  { id: 'business-development', label: 'Business Development', folder: 'business-development' },
  { id: 'ehs', label: 'Environmental, Health and Safety', folder: 'ehs' },
  { id: 'finance', label: 'Finance', folder: 'finance' },
  { id: 'human-resource', label: 'Human Resource', folder: 'human-resource' },
  { id: 'procurement', label: 'Procurement', folder: 'procurement' },
  { id: 'operations', label: 'Operations', folder: 'operations' },
  { id: 'external-documents', label: 'External Documents', folder: 'external-documents' },
] as const

const TIERS = [
  { id: 'tier-1-policies', shortLabel: 'Policies', label: 'Tier 1 - Policies', Icon: ShieldIcon },
  { id: 'tier-2-ims-manual', shortLabel: 'IMS Manual, Plan, Document List', label: 'Tier 2 - IMS Manual, Plan, Document List', Icon: BookIcon },
  { id: 'tier-3-procedures', shortLabel: 'Procedures', label: 'Tier 3 - Procedures', Icon: ClipboardListIcon },
  { id: 'tier-4-work-instructions', shortLabel: 'Work Instructions, Flowcharts', label: 'Tier 4 - Work Instructions, Flowcharts', Icon: WorkflowIcon },
  { id: 'tier-5-forms', shortLabel: 'Forms', label: 'Tier 5 - Forms', Icon: FormIcon, hasCategories: true },
]

interface DocumentFile {
  name: string
  id: string | null
  created_at: string | null
  updated_at?: string | null
  last_accessed_at?: string | null
  metadata: { size: number; mimetype: string } | null
  category?: string
}

interface TierDocuments {
  tierId: string
  tierLabel: string
  shortLabel: string
  Icon: React.ComponentType<{ className?: string }>
  documents: DocumentFile[]
}

const SearchIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
  </svg>
)
const DownloadIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)
const ChevronRightIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
)
const FileTextIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
  </svg>
)
const LogOutIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)
const PlusIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)
const HomeIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)
const AlertIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

export default function DocumentsPage() {
  const [tieredDocuments, setTieredDocuments] = useState<TierDocuments[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [userEmail, setUserEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [isEditor, setIsEditor] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTierId, setActiveTierId] = useState<string>(TIERS[0].id)
  const [activeFormCategory, setActiveFormCategory] = useState<string>('all')
  const [formsExpanded, setFormsExpanded] = useState(false)
  const [query, setQuery] = useState('')
  const [deletingDoc, setDeletingDoc] = useState<{ tierId: string; fileName: string; category?: string } | null>(null)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  useEffect(() => { checkUserAndLoadDocuments() }, [])

  useEffect(() => {
    if (activeTierId === 'tier-5-forms') setFormsExpanded(true)
  }, [activeTierId])

  const checkUserAndLoadDocuments = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
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

    await loadDocuments()
  }

  const loadDocuments = async () => {
    const tiered: TierDocuments[] = []
    let total = 0
    for (const tier of TIERS) {
      if (tier.id === 'tier-5-forms') {
        const allFormDocs: DocumentFile[] = []
        for (const cat of FORM_CATEGORIES) {
          if (!cat.folder) continue
          const path = `${tier.id}/${cat.folder}`
          const { data, error: listError } = await supabase.storage.from('documents').list(path, { limit: 100, offset: 0, sortBy: { column: 'created_at', order: 'desc' } })
          if (listError) console.error(`Error loading ${path}:`, listError.message)
          const docs = (data || []).filter(d => d.name !== '.emptyFolderPlaceholder').map(d => ({ ...d, category: cat.id }))
          allFormDocs.push(...docs)
        }
        tiered.push({ tierId: tier.id, tierLabel: tier.label, shortLabel: tier.shortLabel, Icon: tier.Icon, documents: allFormDocs })
        total += allFormDocs.length
      } else {
        const { data, error: listError } = await supabase.storage.from('documents').list(tier.id, { limit: 100, offset: 0, sortBy: { column: 'created_at', order: 'desc' } })
        if (listError) console.error(`Error loading ${tier.label}:`, listError.message)
        const docs = (data || []).filter(d => d.name !== '.emptyFolderPlaceholder')
        tiered.push({ tierId: tier.id, tierLabel: tier.label, shortLabel: tier.shortLabel, Icon: tier.Icon, documents: docs })
        total += docs.length
      }
    }
    setTieredDocuments(tiered)
    setTotalCount(total)
    setLoading(false)
  }

  const buildFilePath = (tierId: string, fileName: string, category?: string) => {
    if (category && tierId === 'tier-5-forms') {
      const cat = FORM_CATEGORIES.find(c => c.id === category)
      return `${tierId}/${cat?.folder}/${fileName}`
    }
    return `${tierId}/${fileName}`
  }

  const handleDownload = async (tierId: string, fileName: string, category?: string) => {
    const filePath = buildFilePath(tierId, fileName, category)
    const { data, error } = await supabase.storage.from('documents').createSignedUrl(filePath, 3600)
    if (error) { alert('Could not download: ' + error.message); return }
    if (data?.signedUrl) window.open(data.signedUrl, '_blank')
  }

  const handleDelete = async () => {
    if (!deletingDoc || !isAdmin) return
    setDeleting(true)
    const filePath = buildFilePath(deletingDoc.tierId, deletingDoc.fileName, deletingDoc.category)
    const { error: deleteError } = await supabase.storage.from('documents').remove([filePath])
    if (deleteError) {
      alert('Could not delete: ' + deleteError.message)
      setDeleting(false)
      return
    }
    setDeletingDoc(null)
    setDeleting(false)
    await loadDocuments()
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown'
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const getFileTypeLabel = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    if (ext === 'pdf') return 'PDF Document'
    if (['doc', 'docx'].includes(ext || '')) return 'Word Document'
    if (['xls', 'xlsx', 'csv'].includes(ext || '')) return 'Spreadsheet'
    if (['ppt', 'pptx'].includes(ext || '')) return 'Presentation'
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) return 'Image'
    if (['zip', 'rar'].includes(ext || '')) return 'Archive'
    return 'Document'
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-emerald-50/40" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-emerald-200 border-t-emerald-700 rounded-full animate-spin" />
          <div className="text-emerald-800 text-sm">Loading documents…</div>
        </div>
      </main>
    )
  }

  const current = tieredDocuments.find(t => t.tierId === activeTierId)
  const isFormsTier = activeTierId === 'tier-5-forms'

  let visibleDocs = current?.documents || []
  if (isFormsTier && activeFormCategory !== 'all') {
    visibleDocs = visibleDocs.filter(d => d.category === activeFormCategory)
  }
  const filteredDocs = visibleDocs.filter(d => d.name.toLowerCase().includes(query.toLowerCase()))
  const currentIndex = TIERS.findIndex(t => t.id === activeTierId) + 1

  const formCategoryCounts: Record<string, number> = {}
  if (current && isFormsTier) {
    formCategoryCounts['all'] = current.documents.length
    for (const cat of FORM_CATEGORIES) {
      if (cat.id === 'all') continue
      formCategoryCounts[cat.id] = current.documents.filter(d => d.category === cat.id).length
    }
  }

  const activeCategoryLabel = isFormsTier && activeFormCategory !== 'all'
    ? FORM_CATEGORIES.find(c => c.id === activeFormCategory)?.label
    : null

  const accessLabel = isAdmin ? 'Full access' : isEditor ? 'View & download' : 'View only access'
  const roleBadge = isAdmin ? 'Admin' : isEditor ? 'Editor' : 'Viewer'

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

          <nav className="flex-1 p-3 overflow-y-auto">
            <Link href="/dashboard" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left mb-2 hover:bg-emerald-800/50 text-emerald-100 transition-all">
              <div className="w-8 h-8 rounded-md bg-emerald-800 text-emerald-300 flex items-center justify-center shrink-0">
                <HomeIcon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Home</span>
            </Link>

            <Link href="/ncr" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left mb-3 hover:bg-emerald-800/50 text-emerald-100 transition-all">
              <div className="w-8 h-8 rounded-md bg-emerald-800 text-emerald-300 flex items-center justify-center shrink-0">
                <AlertIcon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Non-Conformance</span>
            </Link>

            <div className="text-[10px] font-semibold text-emerald-400/80 uppercase tracking-wider px-3 py-2">Document Tiers</div>
            {tieredDocuments.map((tier, idx) => {
              const active = activeTierId === tier.tierId
              const TierIcon = tier.Icon
              const tierMeta = TIERS[idx]
              const isFormsRow = tierMeta.id === 'tier-5-forms'

              if (isFormsRow) {
                // NOTE: Outer element is a <div> with role="button" instead of a <button>
                // because it contains a nested <button> for the chevron toggle.
                // Nested <button> elements cause hydration errors in HTML.
                return (
                  <div key={tier.tierId} className="mb-0.5">
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setActiveTierId(tier.tierId)
                        setActiveFormCategory('all')
                        setFormsExpanded(true)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          setActiveTierId(tier.tierId)
                          setActiveFormCategory('all')
                          setFormsExpanded(true)
                        }
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${active ? 'bg-emerald-50 text-emerald-950 shadow-sm' : 'hover:bg-emerald-800/50 text-emerald-100'}`}
                    >
                      <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${active ? 'bg-emerald-600 text-white' : 'bg-emerald-800 text-emerald-300'}`}>
                        <TierIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono ${active ? 'text-emerald-700' : 'text-emerald-400/80'}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>T{idx + 1}</span>
                          <span className="text-sm font-medium truncate">{tier.shortLabel}</span>
                        </div>
                      </div>
                      <span className={`text-xs font-medium tabular-nums px-1.5 py-0.5 rounded ${active ? 'bg-emerald-100 text-emerald-800' : tier.documents.length > 0 ? 'bg-emerald-700/50 text-emerald-100' : 'text-emerald-400/60'}`}>{tier.documents.length}</span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setFormsExpanded(!formsExpanded) }}
                        className={`p-0.5 rounded transition ${active ? 'text-emerald-600 hover:text-emerald-900' : 'text-emerald-400 hover:text-white'}`}
                        title={formsExpanded ? 'Collapse' : 'Expand'}
                        aria-label={formsExpanded ? 'Collapse Forms categories' : 'Expand Forms categories'}
                      >
                        <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform ${formsExpanded ? '' : '-rotate-90'}`} />
                      </button>
                    </div>

                    {formsExpanded && (
                      <div className="ml-4 mt-1 mb-1 pl-3 border-l border-emerald-800/60 space-y-0.5">
                        {FORM_CATEGORIES.map((cat) => {
                          const catActive = active && activeFormCategory === cat.id
                          const count = formCategoryCounts[cat.id] || 0
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => {
                                setActiveTierId('tier-5-forms')
                                setActiveFormCategory(cat.id)
                              }}
                              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-left transition-all text-xs ${catActive ? 'bg-emerald-800/80 text-white font-medium' : 'text-emerald-300 hover:bg-emerald-800/40 hover:text-white'}`}
                            >
                              <span className="flex-1 truncate">{cat.label}</span>
                              <span className={`tabular-nums text-[10px] ${catActive ? 'text-emerald-100' : 'text-emerald-400/70'}`}>{count}</span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <button key={tier.tierId} type="button" onClick={() => setActiveTierId(tier.tierId)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left mb-0.5 transition-all ${active ? 'bg-emerald-50 text-emerald-950 shadow-sm' : 'hover:bg-emerald-800/50 text-emerald-100'}`}>
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${active ? 'bg-emerald-600 text-white' : 'bg-emerald-800 text-emerald-300'}`}>
                    <TierIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono ${active ? 'text-emerald-700' : 'text-emerald-400/80'}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>T{idx + 1}</span>
                      <span className="text-sm font-medium truncate">{tier.shortLabel}</span>
                    </div>
                  </div>
                  <span className={`text-xs font-medium tabular-nums px-1.5 py-0.5 rounded ${active ? 'bg-emerald-100 text-emerald-800' : tier.documents.length > 0 ? 'bg-emerald-700/50 text-emerald-100' : 'text-emerald-400/60'}`}>{tier.documents.length}</span>
                </button>
              )
            })}

            {isAdmin && (
              <Link href="/upload" className="mt-4 flex items-center gap-3 px-3 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white transition shadow-sm">
                <div className="w-8 h-8 rounded-md bg-emerald-50 text-emerald-900 flex items-center justify-center shrink-0">
                  <PlusIcon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Upload Document</span>
              </Link>
            )}
          </nav>

          <div className="p-3 border-t border-emerald-800/60">
            <div className="flex items-center gap-3 p-2 rounded-lg">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-300 to-emerald-500 flex items-center justify-center text-emerald-950 font-semibold text-sm">{userEmail.charAt(0).toUpperCase() || 'U'}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate flex items-center gap-1">
                  {isAdmin && <span className="text-amber-300">👑</span>}
                  {roleBadge}
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
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <img src="/operon-logo-grey.png" alt="" aria-hidden="true" className="w-[700px] max-w-[80%] opacity-[0.05]" />
          </div>

          <header className="bg-white border-b border-emerald-100 px-8 py-4 relative">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-2 text-sm text-emerald-700/70 min-w-0">
                <Link href="/dashboard" className="shrink-0 hover:text-emerald-950 transition">Home</Link>
                <ChevronRightIcon className="w-4 h-4 shrink-0" />
                <span className="text-emerald-950 font-medium truncate">
                  Document Library — {current?.tierLabel}
                  {activeCategoryLabel && <span className="text-emerald-700/70"> / {activeCategoryLabel}</span>}
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-full text-xs font-medium ring-1 ring-emerald-600/20 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {accessLabel}
              </div>
            </div>
          </header>

          <div className="flex-1 p-8 relative">
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-lg mb-6 text-sm">{error}</div>
            )}

            <div className="mb-8">
              <div className="flex items-end justify-between gap-4 mb-3">
                <div className="min-w-0">
                  <div className="text-xs font-mono text-emerald-700/70 mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>TIER {String(currentIndex).padStart(2, '0')} / 05</div>
                  <h1 className="text-3xl font-bold tracking-tight text-emerald-950">
                    {current?.shortLabel}
                    {activeCategoryLabel && <span className="text-emerald-700/70 font-medium"> · {activeCategoryLabel}</span>}
                  </h1>
                  <p className="text-sm text-emerald-700/70 mt-1">{totalCount} {totalCount === 1 ? 'document' : 'documents'} total across {TIERS.length} tiers</p>
                </div>
                <div className="flex items-baseline gap-2 shrink-0">
                  <span className="text-4xl font-bold tabular-nums text-emerald-700">{visibleDocs.length}</span>
                  <span className="text-sm text-emerald-700/70">{visibleDocs.length === 1 ? 'document' : 'documents'}</span>
                </div>
              </div>
              <div className="flex gap-1.5">
                {tieredDocuments.map((t) => (
                  <div key={t.tierId} className={`h-1 flex-1 rounded-full transition-all ${t.tierId === activeTierId ? 'bg-emerald-600' : t.documents.length > 0 ? 'bg-emerald-300' : 'bg-emerald-100'}`} />
                ))}
              </div>
            </div>

            {isFormsTier && (
              <div className="mb-6">
                <div className="text-[10px] font-semibold text-emerald-700/70 uppercase tracking-wider mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Filter by Department</div>
                <div className="flex flex-wrap gap-2">
                  {FORM_CATEGORIES.map((cat) => {
                    const catActive = activeFormCategory === cat.id
                    const count = formCategoryCounts[cat.id] || 0
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setActiveFormCategory(cat.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${catActive ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm' : 'bg-white text-emerald-800 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50'}`}
                      >
                        <span>{cat.label}</span>
                        <span className={`tabular-nums text-[10px] px-1.5 py-0.5 rounded-full ${catActive ? 'bg-emerald-800 text-emerald-100' : 'bg-emerald-100 text-emerald-700'}`}>{count}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="relative mb-6 max-w-md">
              <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600/60" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={isFormsTier ? 'Search forms…' : 'Search this tier…'} className="w-full pl-10 pr-4 py-2.5 bg-white border border-emerald-200 rounded-lg text-sm text-emerald-950 placeholder:text-emerald-700/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition" />
            </div>

            {filteredDocs.length > 0 ? (
              <div className="bg-white rounded-xl border border-emerald-100 overflow-hidden shadow-sm">
                <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-emerald-100 bg-emerald-50/60 text-[10px] font-semibold uppercase tracking-wider text-emerald-800">
                  <div className={isFormsTier && activeFormCategory === 'all' ? 'col-span-5' : 'col-span-6'}>Document</div>
                  {isFormsTier && activeFormCategory === 'all' && <div className="col-span-2">Department</div>}
                  <div className="col-span-2">Size</div>
                  <div className={isFormsTier && activeFormCategory === 'all' ? 'col-span-2' : 'col-span-3'}>Updated</div>
                  <div className="col-span-1 text-right">{isAdmin ? 'Actions' : 'Action'}</div>
                </div>
                {filteredDocs.map((doc) => {
                  const docCategory = FORM_CATEGORIES.find(c => c.id === doc.category)
                  return (
                    <div key={`${doc.category || ''}-${doc.id || doc.name}`} className="grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-emerald-50 last:border-0 hover:bg-emerald-50/40 transition group">
                      <div className={`${isFormsTier && activeFormCategory === 'all' ? 'col-span-5' : 'col-span-6'} flex items-center gap-3 min-w-0`}>
                        <div className="w-9 h-9 rounded-md bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-700">
                          <FileTextIcon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-emerald-950 truncate">{doc.name}</div>
                          <div className="text-xs text-emerald-700/60">{getFileTypeLabel(doc.name)}</div>
                        </div>
                      </div>
                      {isFormsTier && activeFormCategory === 'all' && (
                        <div className="col-span-2">
                          {docCategory && (
                            <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 truncate max-w-full">
                              {docCategory.label}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="col-span-2 text-sm text-emerald-800/80 tabular-nums">{formatFileSize(doc.metadata?.size || 0)}</div>
                      <div className={`${isFormsTier && activeFormCategory === 'all' ? 'col-span-2' : 'col-span-3'} text-sm text-emerald-800/80`}>{formatDate(doc.created_at)}</div>
                      <div className="col-span-1 flex justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleDownload(current!.tierId, doc.name, doc.category)}
                          className="p-2 rounded-md bg-emerald-700 hover:bg-emerald-800 transition shadow-sm text-white"
                          title="View / Download"
                        >
                          <DownloadIcon className="w-4 h-4" />
                        </button>
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => setDeletingDoc({ tierId: current!.tierId, fileName: doc.name, category: doc.category })}
                            className="p-2 rounded-md bg-white border border-emerald-200 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 text-emerald-700 transition"
                            title="Delete document"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : query ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-dashed border-emerald-200 p-16 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4 text-emerald-600">
                  <SearchIcon className="w-5 h-5" />
                </div>
                <div className="text-sm font-medium text-emerald-950 mb-1">No documents match "{query}"</div>
                <div className="text-xs text-emerald-700/60">Try a different search term or clear the search.</div>
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-dashed border-emerald-200 p-16 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4 text-emerald-600">
                  <FileTextIcon className="w-5 h-5" />
                </div>
                <div className="text-sm font-medium text-emerald-950 mb-1">
                  {isFormsTier && activeCategoryLabel
                    ? `No forms in ${activeCategoryLabel} yet`
                    : 'No documents in this tier yet'}
                </div>
                <div className="text-xs text-emerald-700/60">{isAdmin ? 'Use the Upload Document button in the sidebar to add files.' : 'Documents will appear here once published by an administrator.'}</div>
              </div>
            )}
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

      {deletingDoc && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-emerald-100">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-11 h-11 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <TrashIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-emerald-950 mb-1">Delete document?</h3>
                <p className="text-sm text-emerald-700/80">
                  This will permanently delete <span className="font-medium text-emerald-950">{deletingDoc.fileName}</span>. This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <button
                type="button"
                onClick={() => setDeletingDoc(null)}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-50 rounded-lg transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting…
                  </>
                ) : (
                  <>
                    <TrashIcon className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
