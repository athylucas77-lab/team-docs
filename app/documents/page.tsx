'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const ADMIN_EMAIL = 'harlene@example.com'

// ─── Icons ───────────────────────────────────────────────────────────────────
const ShieldIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)
const BookIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
)
const ClipboardListIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M9 12h6" /><path d="M9 16h6" />
  </svg>
)
const WorkflowIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="6" height="6" rx="1" /><rect x="15" y="15" width="6" height="6" rx="1" /><path d="M9 6h6a3 3 0 0 1 3 3v6" />
  </svg>
)
const FormIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="8" y1="13" x2="14" y2="13" /><line x1="8" y1="17" x2="12" y2="17" />
  </svg>
)
const ChevronDownIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
)
const TrashIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
  </svg>
)
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
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
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
const XIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)
const FolderPlusIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /><line x1="12" y1="11" x2="12" y2="17" /><line x1="9" y1="14" x2="15" y2="14" />
  </svg>
)
const FolderIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
)

// ─── Constants ────────────────────────────────────────────────────────────────
const TIERS = [
  { id: 'tier-1-policies', shortLabel: 'Policies', label: 'Tier 1 - Policies', Icon: ShieldIcon },
  { id: 'tier-2-ims-manual', shortLabel: 'IMS Manual, Plan, Document List', label: 'Tier 2 - IMS Manual, Plan, Document List', Icon: BookIcon },
  { id: 'tier-3-procedures', shortLabel: 'Procedures', label: 'Tier 3 - Procedures', Icon: ClipboardListIcon },
  { id: 'tier-4-work-instructions', shortLabel: 'Work Instructions, Flowcharts', label: 'Tier 4 - Work Instructions, Flowcharts', Icon: WorkflowIcon },
  { id: 'tier-5-forms', shortLabel: 'Forms', label: 'Tier 5 - Forms', Icon: FormIcon },
]

// ─── Types ────────────────────────────────────────────────────────────────────
interface DocumentFile {
  name: string
  id: string | null
  created_at: string | null
  metadata: { size: number; mimetype: string } | null
  subfolder?: string
}

interface SubFolder {
  name: string
  label: string
  documents: DocumentFile[]
  createdBy: string | null // uuid of the user who created this folder (null = unknown/legacy)
}

interface TierData {
  tierId: string
  tierLabel: string
  shortLabel: string
  Icon: React.ComponentType<{ className?: string }>
  rootDocuments: DocumentFile[]
  subfolders: SubFolder[]
  allDocuments: DocumentFile[]
}

// ─── Helper ───────────────────────────────────────────────────────────────────
const toLabel = (slug: string) =>
  slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DocumentsPage() {
  const [tieredDocuments, setTieredDocuments] = useState<TierData[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [userEmail, setUserEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [isEditor, setIsEditor] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Navigation
  const [activeTierId, setActiveTierId] = useState(TIERS[0].id)
  const [activeSubfolder, setActiveSubfolder] = useState<string | null>(null)
  const [expandedTiers, setExpandedTiers] = useState<Set<string>>(new Set([TIERS[0].id]))

  // Search
  const [query, setQuery] = useState('')

  // Delete document
  const [deletingDoc, setDeletingDoc] = useState<{ tierId: string; fileName: string; subfolder?: string } | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Delete folder
  const [deletingFolder, setDeletingFolder] = useState<{
    tierId: string
    folderSlug: string
    folderLabel: string
  } | null>(null)
  const [deletingFolderBusy, setDeletingFolderBusy] = useState(false)

  // Create folder
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [creatingFolder, setCreatingFolder] = useState(false)
  const [folderError, setFolderError] = useState('')

  const router = useRouter()

  useEffect(() => { init() }, [])

  // ── Init ──────────────────────────────────────────────────────────────────
  const init = async () => {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      await supabase.auth.signOut()
      router.push('/login')
      return
    }

    setUserEmail(user.email || '')
    setUserId(user.id)

    const admin = user.email === ADMIN_EMAIL
    setIsAdmin(admin)

    if (!admin) {
      const { data: ed } = await supabase
        .from('ncr_editors')
        .select('email')
        .eq('email', user.email)
        .maybeSingle()
      setIsEditor(!!ed)
    }

    await loadDocuments()
  }

  // ── Load documents — dynamically discovers subfolders from Storage ─────────
  const loadDocuments = async () => {
    // Load all folder ownership records in one query
    const { data: ownershipRows } = await supabase
      .from('folder_ownership')
      .select('tier_id, folder_slug, created_by')

    const ownershipMap = new Map<string, string>()
    for (const row of ownershipRows || []) {
      ownershipMap.set(`${row.tier_id}::${row.folder_slug}`, row.created_by)
    }

    const tiered: TierData[] = []
    let total = 0

    for (const tier of TIERS) {
      const { data: rootItems, error: rootErr } = await supabase.storage
        .from('documents')
        .list(tier.id, { limit: 200, sortBy: { column: 'name', order: 'asc' } })

      if (rootErr) console.error(`Error listing ${tier.id}:`, rootErr.message)

      const items = rootItems || []

      const rootFiles = items.filter(
        (i) => i.metadata !== null && i.name !== '.emptyFolderPlaceholder'
      ) as DocumentFile[]

      const folderItems = items.filter(
        (i) => i.id === null && i.name !== '.emptyFolderPlaceholder'
      )

      const subfolders: SubFolder[] = []
      for (const fi of folderItems) {
        const { data: contents } = await supabase.storage
          .from('documents')
          .list(`${tier.id}/${fi.name}`, { limit: 200, sortBy: { column: 'name', order: 'asc' } })

        const files = (contents || [])
          .filter((f) => f.metadata !== null && f.name !== '.emptyFolderPlaceholder')
          .map((f) => ({ ...f, subfolder: fi.name })) as DocumentFile[]

        // Look up who created this folder
        const createdBy = ownershipMap.get(`${tier.id}::${fi.name}`) ?? null

        subfolders.push({
          name: fi.name,
          label: toLabel(fi.name),
          documents: files,
          createdBy,
        })
      }

      const allDocuments = [...rootFiles, ...subfolders.flatMap((sf) => sf.documents)]

      tiered.push({
        tierId: tier.id,
        tierLabel: tier.label,
        shortLabel: tier.shortLabel,
        Icon: tier.Icon,
        rootDocuments: rootFiles,
        subfolders,
        allDocuments,
      })
      total += allDocuments.length
    }

    setTieredDocuments(tiered)
    setTotalCount(total)
    setLoading(false)
  }

  // ── Create folder — Admin can always; Editor can create (ownership recorded) ─
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) { setFolderError('Please enter a folder name.'); return }
    if (!userId) return

    setCreatingFolder(true)
    setFolderError('')

    const slug = newFolderName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s]+/g, '')
      .trim()
      .replace(/\s+/g, '-')

    if (!slug) { setFolderError('Invalid folder name. Use letters and numbers only.'); setCreatingFolder(false); return }

    const current = tieredDocuments.find((t) => t.tierId === activeTierId)
    if (current?.subfolders.some((sf) => sf.name === slug)) {
      setFolderError('A folder with this name already exists.')
      setCreatingFolder(false)
      return
    }

    // Create placeholder file in Storage
    const placeholderPath = `${activeTierId}/${slug}/.emptyFolderPlaceholder`
    const blob = new Blob([''], { type: 'text/plain' })
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(placeholderPath, blob, { upsert: false })

    if (uploadError) {
      setFolderError(
        uploadError.message.toLowerCase().includes('already')
          ? 'A folder with this name already exists.'
          : 'Could not create folder: ' + uploadError.message
      )
      setCreatingFolder(false)
      return
    }

    // ✅ Record ownership in the database so editors can only delete their own folders
    const { error: ownershipError } = await supabase
      .from('folder_ownership')
      .insert({ tier_id: activeTierId, folder_slug: slug, created_by: userId })

if (ownershipError) {
  console.error('Full ownership error:', JSON.stringify(ownershipError))
  alert('Ownership error: ' + JSON.stringify(ownershipError))
}

    setNewFolderName('')
    setShowCreateFolder(false)
    setCreatingFolder(false)

    setExpandedTiers((prev) => new Set(prev).add(activeTierId))
    setActiveSubfolder(slug)

    await loadDocuments()
  }

  // ── Delete folder ─────────────────────────────────────────────────────────
  const handleDeleteFolder = async () => {
    if (!deletingFolder) return

    const { tierId, folderSlug } = deletingFolder
    const folder = tieredDocuments
      .find((t) => t.tierId === tierId)
      ?.subfolders.find((s) => s.name === folderSlug)

    if (!folder) return

    // ✅ Permission check:
    //    - Admins can always delete
    //    - Editors can only delete folders they personally created
    if (!isAdmin) {
      if (folder.createdBy !== userId) {
        alert('You can only delete folders you created.')
        setDeletingFolder(null)
        return
      }
    }

    setDeletingFolderBusy(true)

    // Remove all files inside the folder from Storage
    const filesToRemove = [
      `${tierId}/${folderSlug}/.emptyFolderPlaceholder`,
      ...folder.documents.map((d) => `${tierId}/${folderSlug}/${d.name}`),
    ]

    const { error: removeError } = await supabase.storage
      .from('documents')
      .remove(filesToRemove)

    if (removeError) {
      alert('Could not delete folder contents: ' + removeError.message)
      setDeletingFolderBusy(false)
      return
    }

    // ✅ Remove ownership record
    await supabase
      .from('folder_ownership')
      .delete()
      .eq('tier_id', tierId)
      .eq('folder_slug', folderSlug)

    setDeletingFolder(null)
    setDeletingFolderBusy(false)
    setActiveSubfolder(null)
    await loadDocuments()
  }

  // ── File actions ──────────────────────────────────────────────────────────
  const buildPath = (tierId: string, fileName: string, subfolder?: string) =>
    subfolder ? `${tierId}/${subfolder}/${fileName}` : `${tierId}/${fileName}`

  const handleDownload = async (tierId: string, fileName: string, subfolder?: string) => {
    const { data, error } = await supabase.storage
      .from('documents')
      .createSignedUrl(buildPath(tierId, fileName, subfolder), 3600)
    if (error) { alert('Could not open: ' + error.message); return }
    if (data?.signedUrl) window.open(data.signedUrl, '_blank')
  }

  const handleDelete = async () => {
    if (!deletingDoc || !isAdmin) return
    setDeleting(true)
    const { error } = await supabase.storage
      .from('documents')
      .remove([buildPath(deletingDoc.tierId, deletingDoc.fileName, deletingDoc.subfolder)])
    if (error) { alert('Could not delete: ' + error.message); setDeleting(false); return }
    setDeletingDoc(null)
    setDeleting(false)
    await loadDocuments()
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  // ── Formatters ────────────────────────────────────────────────────────────
  const formatSize = (b: number) =>
    b < 1024 ? b + ' B' : b < 1_048_576 ? (b / 1024).toFixed(1) + ' KB' : (b / 1_048_576).toFixed(1) + ' MB'

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'

  const getTypeLabel = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase()
    if (ext === 'pdf') return 'PDF'
    if (['doc', 'docx'].includes(ext || '')) return 'Word'
    if (['xls', 'xlsx', 'csv'].includes(ext || '')) return 'Spreadsheet'
    if (['ppt', 'pptx'].includes(ext || '')) return 'Presentation'
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return 'Image'
    return 'Document'
  }

  // ── Loading state ─────────────────────────────────────────────────────────
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

  // ── Derived state ─────────────────────────────────────────────────────────
  const current = tieredDocuments.find((t) => t.tierId === activeTierId)
  const canManageFolders = isAdmin || isEditor

  let visibleDocs: DocumentFile[] = []
  if (current) {
    if (activeSubfolder === null) visibleDocs = current.allDocuments
    else if (activeSubfolder === '__root__') visibleDocs = current.rootDocuments
    else visibleDocs = current.subfolders.find((s) => s.name === activeSubfolder)?.documents || []
  }

  const hasSearch = query.trim().length > 0
  const filteredDocs = hasSearch
    ? visibleDocs.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()))
    : visibleDocs

  const showFolderCol = activeSubfolder === null && (current?.subfolders.length ?? 0) > 0

  const currentIndex = TIERS.findIndex((t) => t.id === activeTierId) + 1
  const accessLabel = isAdmin ? 'Full access' : isEditor ? 'Edit access' : 'View only'
  const roleBadge = isAdmin ? 'Admin' : isEditor ? 'Editor' : 'Viewer'

  const activeSubfolderLabel =
    activeSubfolder === null
      ? null
      : activeSubfolder === '__root__'
      ? 'Root Files'
      : current?.subfolders.find((s) => s.name === activeSubfolder)?.label

  // ✅ Can the current user delete the active subfolder?
  //    Admins: always yes. Editors: only if they created it.
  const activeSubfolderData = activeSubfolder && activeSubfolder !== '__root__'
    ? current?.subfolders.find((s) => s.name === activeSubfolder)
    : null

  const canDeleteActiveFolder =
    !!activeSubfolderData && (
      isAdmin ||
      (isEditor && activeSubfolderData.createdBy === userId)
    )

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-emerald-50/40 text-emerald-950" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      <div className="flex min-h-screen">

        {/* ── Sidebar ─────────────────────────────────────────────────────── */}
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

          <nav className="flex-1 p-3 overflow-y-auto">
            {/* Home */}
            <Link href="/dashboard" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left mb-1 hover:bg-emerald-800/50 text-emerald-100 transition-all">
              <div className="w-8 h-8 rounded-md bg-emerald-800 text-emerald-300 flex items-center justify-center shrink-0">
                <HomeIcon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Home</span>
            </Link>

            {/* NCR */}
            <Link href="/ncr" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left mb-3 hover:bg-emerald-800/50 text-emerald-100 transition-all">
              <div className="w-8 h-8 rounded-md bg-emerald-800 text-emerald-300 flex items-center justify-center shrink-0">
                <AlertIcon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Non-Conformance</span>
            </Link>

            <div className="text-[10px] font-semibold text-emerald-400/80 uppercase tracking-wider px-3 py-2">
              Document Tiers
            </div>

            {/* Tier list */}
            {tieredDocuments.map((tier, idx) => {
              const isActive = activeTierId === tier.tierId
              const isExpanded = expandedTiers.has(tier.tierId)
              const TierIcon = tier.Icon
              const hasSubfolders = tier.subfolders.length > 0
              const hasRoot = tier.rootDocuments.length > 0

              return (
                <div key={tier.tierId} className="mb-0.5">
                  {/* Tier row */}
                  <button
                    onClick={() => {
                      setActiveTierId(tier.tierId)
                      setActiveSubfolder(null)
                      setQuery('')
                      setExpandedTiers((prev) => {
                        const next = new Set(prev)
                        if (isActive) {
                          if (isExpanded) next.delete(tier.tierId)
                          else next.add(tier.tierId)
                        } else {
                          next.add(tier.tierId)
                        }
                        return next
                      })
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-950 shadow-sm'
                        : 'hover:bg-emerald-800/50 text-emerald-100'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${isActive ? 'bg-emerald-600 text-white' : 'bg-emerald-800 text-emerald-300'}`}>
                      <TierIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-mono shrink-0 ${isActive ? 'text-emerald-700' : 'text-emerald-400/80'}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                          T{idx + 1}
                        </span>
                        <span className="text-sm font-medium truncate">{tier.shortLabel}</span>
                      </div>
                    </div>
                    <span className={`text-xs font-medium tabular-nums px-1.5 py-0.5 rounded shrink-0 ${isActive ? 'bg-emerald-100 text-emerald-800' : tier.allDocuments.length > 0 ? 'bg-emerald-700/50 text-emerald-100' : 'text-emerald-400/60'}`}>
                      {tier.allDocuments.length}
                    </span>
                    {(hasSubfolders || canManageFolders) && (
                      <ChevronDownIcon className={`w-3.5 h-3.5 shrink-0 transition-transform ${isActive ? 'text-emerald-600' : 'text-emerald-400/60'} ${isExpanded && isActive ? '' : '-rotate-90'}`} />
                    )}
                  </button>

                  {/* Expanded: subfolders + new folder */}
                  {isActive && isExpanded && (
                    <div className="ml-4 mt-1 mb-2 pl-3 border-l border-emerald-800/60 space-y-0.5">

                      {/* All Documents */}
                      <button
                        onClick={() => setActiveSubfolder(null)}
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-left text-xs transition-all ${
                          activeSubfolder === null
                            ? 'bg-emerald-800/80 text-white font-medium'
                            : 'text-emerald-300 hover:bg-emerald-800/40 hover:text-white'
                        }`}
                      >
                        <span className="flex-1">All Documents</span>
                        <span className="tabular-nums text-[10px] text-emerald-400/70">{tier.allDocuments.length}</span>
                      </button>

                      {/* Root files */}
                      {hasSubfolders && hasRoot && (
                        <button
                          onClick={() => setActiveSubfolder('__root__')}
                          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-left text-xs transition-all ${
                            activeSubfolder === '__root__'
                              ? 'bg-emerald-800/80 text-white font-medium'
                              : 'text-emerald-300 hover:bg-emerald-800/40 hover:text-white'
                          }`}
                        >
                          <FolderIcon className="w-3 h-3 shrink-0" />
                          <span className="flex-1">Root Files</span>
                          <span className="tabular-nums text-[10px] text-emerald-400/70">{tier.rootDocuments.length}</span>
                        </button>
                      )}

                      {/* Dynamic subfolders */}
                      {tier.subfolders.map((sf) => {
                        const canDeleteThisFolder =
                          isAdmin || (isEditor && sf.createdBy === userId)
                        return (
                          <div key={sf.name} className="flex items-center gap-1">
                            <button
                              onClick={() => setActiveSubfolder(sf.name)}
                              className={`flex-1 flex items-center gap-2 px-2.5 py-1.5 rounded-md text-left text-xs transition-all ${
                                activeSubfolder === sf.name
                                  ? 'bg-emerald-800/80 text-white font-medium'
                                  : 'text-emerald-300 hover:bg-emerald-800/40 hover:text-white'
                              }`}
                            >
                              <FolderIcon className="w-3 h-3 shrink-0 opacity-60" />
                              <span className="flex-1 truncate">{sf.label}</span>
                              <span className="tabular-nums text-[10px] text-emerald-400/70">{sf.documents.length}</span>
                            </button>
                            {canDeleteThisFolder && (
                              <button
                                onClick={() => setDeletingFolder({
                                  tierId: tier.tierId,
                                  folderSlug: sf.name,
                                  folderLabel: sf.label,
                                })}
                                className="p-1 rounded text-emerald-500 hover:text-rose-400 hover:bg-emerald-800/60 transition shrink-0"
                                title="Delete folder"
                              >
                                <TrashIcon className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        )
                      })}

                      {/* New Folder button — Admin + Editor */}
                      {canManageFolders && (
                        <button
                          onClick={() => { setShowCreateFolder(true); setFolderError(''); setNewFolderName('') }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-left text-xs text-emerald-400 hover:text-emerald-100 hover:bg-emerald-800/40 transition-all border border-dashed border-emerald-800 hover:border-emerald-700 mt-1.5"
                        >
                          <PlusIcon className="w-3 h-3 shrink-0" />
                          <span>New Folder</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}

            {/* Upload — Admin only */}
            {isAdmin && (
              <Link
                href="/upload"
                className="mt-4 flex items-center gap-3 px-3 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white transition shadow-sm"
              >
                <div className="w-8 h-8 rounded-md bg-emerald-50 text-emerald-900 flex items-center justify-center shrink-0">
                  <PlusIcon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Upload Document</span>
              </Link>
            )}
          </nav>

          {/* User footer */}
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
              <button
                onClick={handleSignOut}
                className="text-emerald-300 hover:text-white p-1.5 rounded-md hover:bg-emerald-800 transition"
                title="Sign out"
              >
                <LogOutIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* ── Main ────────────────────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col min-w-0 relative">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <img src="/operon-logo-grey.png" alt="" aria-hidden="true" className="w-[700px] max-w-[80%] opacity-[0.05]" />
          </div>

          {/* Header */}
          <header className="bg-white border-b border-emerald-100 px-8 py-4 relative">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-2 text-sm text-emerald-700/70 min-w-0">
                <Link href="/dashboard" className="shrink-0 hover:text-emerald-950 transition">Home</Link>
                <ChevronRightIcon className="w-4 h-4 shrink-0" />
                <span className="text-emerald-950 font-medium truncate">
                  Document Library — {current?.tierLabel}
                  {activeSubfolderLabel && (
                    <span className="text-emerald-700/70"> / {activeSubfolderLabel}</span>
                  )}
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

            {/* Title row */}
            <div className="mb-8">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="min-w-0">
                  <div
                    className="text-xs font-mono text-emerald-700/70 mb-1"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    TIER {String(currentIndex).padStart(2, '0')} / 05
                  </div>

                  <h1 className="text-3xl font-bold tracking-tight text-emerald-950">
                    {current?.shortLabel}
                    {activeSubfolderLabel && (
                      <span className="text-emerald-700/70 font-medium text-2xl">
                        {' '}· {activeSubfolderLabel}
                      </span>
                    )}
                  </h1>

                  <p className="text-sm text-emerald-700/70 mt-1">
                    {totalCount}{' '}
                    {totalCount === 1 ? 'document' : 'documents'} total across{' '}
                    {TIERS.length} tiers
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {/* ✅ Delete Folder button — only shown if current user has permission */}
                  {canDeleteActiveFolder && (
                    <button
                      type="button"
                      onClick={() => {
                        if (!activeSubfolderData) return
                        setDeletingFolder({
                          tierId: current!.tierId,
                          folderSlug: activeSubfolderData.name,
                          folderLabel: activeSubfolderData.label,
                        })
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-white border border-rose-200 hover:bg-rose-50 hover:border-rose-400 text-rose-700 text-sm font-medium rounded-lg transition shadow-sm"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Delete Folder
                    </button>
                  )}

                  {/* New Folder — Admin + Editor */}
                  {canManageFolders && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateFolder(true)
                        setFolderError('')
                        setNewFolderName('')
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-white border border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 text-emerald-800 text-sm font-medium rounded-lg transition shadow-sm"
                    >
                      <FolderPlusIcon className="w-4 h-4" />
                      New Folder
                    </button>
                  )}

                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold tabular-nums text-emerald-700">
                      {visibleDocs.length}
                    </span>
                    <span className="text-sm text-emerald-700/70">
                      {visibleDocs.length === 1 ? 'doc' : 'docs'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tier progress bar */}
              <div className="flex gap-1.5">
                {tieredDocuments.map((t) => (
                  <div
                    key={t.tierId}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      t.tierId === activeTierId
                        ? 'bg-emerald-600'
                        : t.allDocuments.length > 0
                        ? 'bg-emerald-300'
                        : 'bg-emerald-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* ── Document table ── */}
            {filteredDocs.length > 0 ? (
              <div className="bg-white rounded-xl border border-emerald-100 overflow-hidden shadow-sm">
                <div className={`grid gap-4 px-6 py-3 border-b border-emerald-100 bg-emerald-50/60 text-[10px] font-semibold uppercase tracking-wider text-emerald-800 grid-cols-12`}>
                  <div className={showFolderCol ? 'col-span-4' : 'col-span-6'}>Document</div>
                  {showFolderCol && <div className="col-span-2">Folder</div>}
                  <div className="col-span-2">Size</div>
                  <div className="col-span-3">Uploaded</div>
                  <div className="col-span-1 text-right">{isAdmin ? 'Actions' : 'Action'}</div>
                </div>

                {filteredDocs.map((doc) => {
                  const sfLabel = doc.subfolder
                    ? current?.subfolders.find((s) => s.name === doc.subfolder)?.label || toLabel(doc.subfolder)
                    : null

                  return (
                    <div
                      key={`${doc.subfolder || 'root'}-${doc.id || doc.name}`}
                      className="grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-emerald-50 last:border-0 hover:bg-emerald-50/40 transition group"
                    >
                      <div className={`${showFolderCol ? 'col-span-4' : 'col-span-6'} flex items-center gap-3 min-w-0`}>
                        <div className="w-9 h-9 rounded-md bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-700">
                          <FileTextIcon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-emerald-950 truncate">{doc.name}</div>
                          <div className="text-xs text-emerald-700/60">{getTypeLabel(doc.name)}</div>
                        </div>
                      </div>

                      {showFolderCol && (
                        <div className="col-span-2">
                          {sfLabel ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 truncate max-w-full">
                              <FolderIcon className="w-2.5 h-2.5 shrink-0" />
                              {sfLabel}
                            </span>
                          ) : (
                            <span className="text-[10px] text-emerald-400/60 italic">Root</span>
                          )}
                        </div>
                      )}

                      <div className="col-span-2 text-sm text-emerald-800/80 tabular-nums">
                        {formatSize(doc.metadata?.size || 0)}
                      </div>

                      <div className="col-span-3 text-sm text-emerald-800/80">
                        {formatDate(doc.created_at)}
                      </div>

                      <div className="col-span-1 flex justify-end gap-1.5">
                        <button
                          onClick={() => handleDownload(current!.tierId, doc.name, doc.subfolder)}
                          className="p-2 rounded-md bg-emerald-700 hover:bg-emerald-800 transition shadow-sm text-white"
                          title="View / Download"
                        >
                          <DownloadIcon className="w-4 h-4" />
                        </button>
                        {/* ✅ Delete document — Admin only */}
                        {isAdmin && (
                          <button
                            onClick={() => setDeletingDoc({ tierId: current!.tierId, fileName: doc.name, subfolder: doc.subfolder })}
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
            ) : hasSearch ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-dashed border-rose-200 p-16 text-center">
                <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4 text-rose-400">
                  <SearchIcon className="w-5 h-5" />
                </div>
                <div className="text-sm font-semibold text-emerald-950 mb-1">
                  No documents found for &ldquo;{query}&rdquo;
                </div>
                <div className="text-xs text-emerald-700/60 mb-4">
                  The document you're looking for is not available in this{' '}
                  {activeSubfolderLabel ? `folder (${activeSubfolderLabel})` : 'tier'}.
                  Try searching in a different tier or folder.
                </div>
                <button
                  onClick={() => setQuery('')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium rounded-lg transition shadow-sm"
                >
                  <XIcon className="w-3.5 h-3.5" />
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-dashed border-emerald-200 p-16 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4 text-emerald-600">
                  <FileTextIcon className="w-5 h-5" />
                </div>
                <div className="text-sm font-semibold text-emerald-950 mb-1">
                  {activeSubfolderLabel
                    ? `No documents in "${activeSubfolderLabel}" yet`
                    : 'No documents in this tier yet'}
                </div>
                <div className="text-xs text-emerald-700/60">
                  {canManageFolders
                    ? 'Upload documents using the sidebar button, or create a new folder to organise them.'
                    : 'Documents will appear here once published by an administrator.'}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
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

      {/* ── Create Folder Modal — Admin + Editor ─────────────────────────────── */}
      {showCreateFolder && canManageFolders && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-emerald-100">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-emerald-950">New Folder</h3>
                <p className="text-sm text-emerald-700/70 mt-0.5">
                  Create a folder inside <span className="font-medium text-emerald-800">{current?.shortLabel}</span>
                </p>
              </div>
              <button
                onClick={() => setShowCreateFolder(false)}
                disabled={creatingFolder}
                className="p-1.5 rounded-md text-emerald-700 hover:bg-emerald-50 transition disabled:opacity-50"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">
                Folder Name <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => { setNewFolderName(e.target.value); setFolderError('') }}
                onKeyDown={(e) => { if (e.key === 'Enter' && !creatingFolder) handleCreateFolder() }}
                disabled={creatingFolder}
                placeholder="e.g. Quality Control, External Documents…"
                autoFocus
                className="w-full px-3 py-2.5 bg-white border border-emerald-200 rounded-lg text-sm text-emerald-950 placeholder:text-emerald-700/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
              />
              <p className="text-[11px] text-emerald-700/50 mt-1.5">
                Letters, numbers and spaces only. Will be saved as a lowercase slug.
              </p>
              {newFolderName && (
                <p className="text-[11px] text-emerald-600 mt-1">
                  Slug preview:{' '}
                  <span className="font-mono bg-emerald-50 px-1 py-0.5 rounded">
                    {newFolderName.toLowerCase().replace(/[^a-z0-9\s]+/g, '').trim().replace(/\s+/g, '-') || '…'}
                  </span>
                </p>
              )}
            </div>

            {folderError && (
              <div className="mt-3 bg-rose-50 border border-rose-200 text-rose-800 text-sm p-3 rounded-lg">
                {folderError}
              </div>
            )}

            <div className="flex gap-2 justify-end mt-6 pt-4 border-t border-emerald-100">
              <button
                onClick={() => setShowCreateFolder(false)}
                disabled={creatingFolder}
                className="px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-50 rounded-lg transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                disabled={creatingFolder || !newFolderName.trim()}
                className="px-4 py-2 text-sm font-medium bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {creatingFolder ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating…
                  </>
                ) : (
                  <>
                    <FolderPlusIcon className="w-4 h-4" />
                    Create Folder
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Folder Confirmation Modal ─────────────────────────────────── */}
      {deletingFolder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-emerald-100">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-11 h-11 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <TrashIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-emerald-950 mb-1">Delete folder?</h3>
                <p className="text-sm text-emerald-700/80">
                  This will permanently delete the folder{' '}
                  <span className="font-medium text-emerald-950">{deletingFolder.folderLabel}</span>{' '}
                  and all documents inside it. This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <button
                onClick={() => setDeletingFolder(null)}
                disabled={deletingFolderBusy}
                className="px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-50 rounded-lg transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteFolder}
                disabled={deletingFolderBusy}
                className="px-4 py-2 text-sm font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                {deletingFolderBusy ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting…
                  </>
                ) : (
                  <>
                    <TrashIcon className="w-4 h-4" />
                    Delete Folder
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Document Confirmation Modal — Admin only ───────────────────── */}
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
                  This will permanently delete{' '}
                  <span className="font-medium text-emerald-950">{deletingDoc.fileName}</span>.
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <button
                onClick={() => setDeletingDoc(null)}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-50 rounded-lg transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
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
