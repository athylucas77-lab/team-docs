'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
const supabase = createClient()
import { listExistingNames } from '../../lib/storage'

const ADMIN_EMAIL = 'harlene.m@operon.co'

const TIERS = [
  { id: 'tier-1-policies', label: 'Tier 1 — Policies' },
  { id: 'tier-2-ims-manual', label: 'Tier 2 — IMS Manual, Plan, Document List' },
  { id: 'tier-3-procedures', label: 'Tier 3 — Procedures' },
  { id: 'tier-4-work-instructions', label: 'Tier 4 — Work Instructions, Flowcharts' },
  { id: 'tier-5-forms', label: 'Tier 5 — Forms', hasCategories: true },
]

const FORM_CATEGORIES = [
  { id: 'management', label: 'Management', folder: 'management' },
  { id: 'business-development', label: 'Business Development', folder: 'business-development' },
  { id: 'ehs', label: 'Environmental, Health and Safety', folder: 'ehs' },
  { id: 'finance', label: 'Finance', folder: 'finance' },
  { id: 'human-resource', label: 'Human Resource', folder: 'human-resource' },
  { id: 'procurement', label: 'Procurement', folder: 'procurement' },
  { id: 'operations', label: 'Operations', folder: 'operations' },
  { id: 'external-documents', label: 'External Documents', folder: 'external-documents' },
]

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
const LogOutIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)
const UploadCloudIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
)
const FileIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
)
const XIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)
const AlertCircleIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)
const InfoIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
)
const CheckIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export default function UploadPage() {
  const router = useRouter()

  const [userEmail, setUserEmail] = useState('')
  const [authChecking, setAuthChecking] = useState(true)
  const [dragActive, setDragActive] = useState(false)

  const [files, setFiles] = useState<File[]>([])
  const [tier, setTier] = useState(TIERS[0].id)
  const [subfolder, setSubfolder] = useState(FORM_CATEGORIES[0].id)
  const [existing, setExisting] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const isFormsTier = tier === 'tier-5-forms'

  /* Auth check + admin guard */
  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    // PATCHED: capture auth errors and clear bad tokens before redirecting
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      await supabase.auth.signOut()
      router.push('/login')
      return
    }

    if (user.email !== ADMIN_EMAIL) {
      router.push('/documents')
      return
    }

    setUserEmail(user.email || '')
    setAuthChecking(false)
  }

  /* Remember last location */
  useEffect(() => {
    if (authChecking) return
    const last = sessionStorage.getItem('last-doc-location')
    if (last) {
      try {
        const parsed = JSON.parse(last)
        if (parsed.tier) setTier(parsed.tier)
        if (parsed.folder) setSubfolder(parsed.folder)
      } catch {
        // ignore corrupt cache
      }
    }
  }, [authChecking])

  /* Load existing filenames whenever tier or subfolder changes */
  useEffect(() => {
    if (authChecking || !tier) return
    const folder = isFormsTier ? subfolder : ''
    const path = folder ? `${tier}/${folder}` : tier
    listExistingNames(path).then(setExisting).catch(() => setExisting([]))
  }, [tier, subfolder, isFormsTier, authChecking])

  const handleFilesAdded = (newFiles: FileList | File[]) => {
    setError('')
    setSuccess(false)
    setFiles(prev => [...prev, ...Array.from(newFiles)])
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    else if (e.type === 'dragleave') setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(e.dataTransfer.files)
    }
  }

  const removeFile = (name: string) => {
    setFiles(prev => prev.filter(f => f.name !== name))
    setError('')
  }

  const handleUpload = async () => {
    if (!tier || files.length === 0) {
      setError('Please choose a tier and add at least one file.')
      return
    }

    setUploading(true)
    setError('')
    setSuccess(false)

    // Pre-check duplicates
    const duplicates = files.filter(f => existing.includes(f.name))
    if (duplicates.length > 0) {
      setError(`Duplicate file${duplicates.length > 1 ? 's' : ''} detected: ${duplicates.map(d => d.name).join(', ')}`)
      setUploading(false)
      return
    }

    for (const file of files) {
      const folder = isFormsTier ? subfolder : ''
      const path = folder ? `${tier}/${folder}/${file.name}` : `${tier}/${file.name}`

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(path, file, { upsert: false })

      if (uploadError) {
        setError(`Upload failed for ${file.name}: ${uploadError.message}`)
        setUploading(false)
        return
      }
    }

    sessionStorage.setItem(
      'last-doc-location',
      JSON.stringify({ tier, folder: isFormsTier ? subfolder : '' })
    )

    setSuccess(true)
    setFiles([])
    setUploading(false)

    // Refresh the existing filename list so user sees their newly-uploaded files reflected
    const folder = isFormsTier ? subfolder : ''
    const refreshPath = folder ? `${tier}/${folder}` : tier
    listExistingNames(refreshPath).then(setExisting).catch(() => {})
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

  if (authChecking) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-emerald-50/40" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-emerald-200 border-t-emerald-700 rounded-full animate-spin" />
          <div className="text-emerald-800 text-sm">Verifying access…</div>
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

            <div className="text-[10px] font-semibold text-emerald-400/80 uppercase tracking-wider px-3 py-2 mt-4">Admin</div>

            <div className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left mb-0.5 bg-emerald-50 text-emerald-950 shadow-sm">
              <div className="w-8 h-8 rounded-md bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <UploadCloudIcon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Upload Documents</span>
            </div>
          </nav>

          <div className="p-3 border-t border-emerald-800/60">
            <div className="flex items-center gap-3 p-2 rounded-lg">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-300 to-emerald-500 flex items-center justify-center text-emerald-950 font-semibold text-sm">
                {userEmail.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate flex items-center gap-1">
                  <span className="text-amber-300">👑</span>
                  Admin
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
              <div className="text-sm text-emerald-950 font-medium">Upload Documents</div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-full text-xs font-medium ring-1 ring-emerald-600/20 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Admin access
              </div>
            </div>
          </header>

          <div className="flex-1 p-8 relative">
            <div className="max-w-3xl">
              <div className="mb-8">
                <div className="text-xs font-mono text-emerald-700/70 mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>UPLOAD</div>
                <h1 className="text-3xl font-bold tracking-tight text-emerald-950 mb-1">Upload Documents</h1>
                <p className="text-sm text-emerald-700/70">Add new documents to the IMS library — multiple files supported.</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 md:p-8">
                {/* Tier */}
                <div className="mb-5">
                  <label htmlFor="tier-select" className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-2">Document Tier</label>
                  <div className="relative">
                    <FolderIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600/60 pointer-events-none" />
                    <select
                      id="tier-select"
                      value={tier}
                      onChange={(e) => setTier(e.target.value)}
                      disabled={uploading}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-emerald-200 rounded-lg text-sm text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition appearance-none cursor-pointer"
                    >
                      {TIERS.map((t) => (
                        <option key={t.id} value={t.id}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Department subfolder for T5 */}
                {isFormsTier && (
                  <div className="mb-5 p-4 bg-emerald-50/60 border border-emerald-200 rounded-lg">
                    <label htmlFor="cat-select" className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-2">Department Category</label>
                    <div className="relative">
                      <FolderIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600/60 pointer-events-none" />
                      <select
                        id="cat-select"
                        value={subfolder}
                        onChange={(e) => setSubfolder(e.target.value)}
                        disabled={uploading}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-emerald-200 rounded-lg text-sm text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition appearance-none cursor-pointer"
                      >
                        {FORM_CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                    <p className="text-xs text-emerald-700/70 mt-1.5">Forms are filed under a department subfolder.</p>
                  </div>
                )}

                {/* Drop zone */}
                <label
                  htmlFor="file-input"
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`block border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition ${
                    dragActive ? 'border-emerald-500 bg-emerald-50' : 'border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/40'
                  }`}
                >
                  <input
                    id="file-input"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => e.target.files && handleFilesAdded(e.target.files)}
                    disabled={uploading}
                  />
                  <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <UploadCloudIcon className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-emerald-950 mb-1">
                    Drop files here or click to browse
                  </p>
                  <p className="text-xs text-emerald-700/60">
                    Multiple files supported • PDF, Word, Excel, PowerPoint, etc.
                  </p>
                </label>

                {/* File list */}
                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                      {files.length} {files.length === 1 ? 'file' : 'files'} ready
                    </div>
                    {files.map((f) => {
                      const isDuplicate = existing.includes(f.name)
                      return (
                        <div
                          key={f.name}
                          className={`flex items-center justify-between border rounded-lg p-3 ${
                            isDuplicate ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${
                              isDuplicate ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                            }`}>
                              <FileIcon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-emerald-950 truncate">{f.name}</p>
                              <p className={`text-xs ${isDuplicate ? 'text-amber-700' : 'text-emerald-700/60'}`}>
                                {formatFileSize(f.size)}
                                {isDuplicate && ' • Already exists in this folder'}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(f.name)}
                            disabled={uploading}
                            className="p-1.5 text-emerald-700 hover:text-rose-600 hover:bg-rose-50 rounded-md transition shrink-0"
                            title="Remove file"
                          >
                            <XIcon className="w-4 h-4" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}

                {error && (
                  <div className="mt-4 bg-rose-50 border border-rose-200 text-rose-800 text-sm p-3 rounded-lg flex items-start gap-2">
                    <AlertCircleIcon className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="mt-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm p-3 rounded-lg flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <CheckIcon className="w-4 h-4 shrink-0" />
                      <span>Documents uploaded successfully!</span>
                    </div>
                    <Link href="/documents" className="font-medium underline shrink-0">View Documents</Link>
                  </div>
                )}

                <button
                  type="button"
                  disabled={!files.length || uploading}
                  onClick={handleUpload}
                  className="mt-6 w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg shadow-sm transition flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Uploading…
                    </>
                  ) : (
                    <>
                      <UploadCloudIcon className="w-4 h-4" />
                      Upload {files.length > 0 ? `${files.length} ${files.length === 1 ? 'File' : 'Files'}` : 'Documents'}
                    </>
                  )}
                </button>

                <div className="mt-6 bg-emerald-50/60 border border-emerald-100 rounded-lg p-4">
                  <div className="flex items-start gap-2 mb-2">
                    <InfoIcon className="w-4 h-4 mt-0.5 text-emerald-700 shrink-0" />
                    <p className="text-xs font-semibold text-emerald-900">Document Tier Guide</p>
                  </div>
                  <ul className="space-y-1 text-xs text-emerald-800/80 ml-6">
                    <li><strong className="text-emerald-900">Tier 1:</strong> High-level Policies (Quality, Environmental, OHS)</li>
                    <li><strong className="text-emerald-900">Tier 2:</strong> IMS Manuals, Plans, Master Document Lists</li>
                    <li><strong className="text-emerald-900">Tier 3:</strong> Detailed Procedures (SOPs)</li>
                    <li><strong className="text-emerald-900">Tier 4:</strong> Work Instructions, Flowcharts</li>
                    <li><strong className="text-emerald-900">Tier 5:</strong> Forms, Checklists, Records — categorized by department</li>
                  </ul>
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
