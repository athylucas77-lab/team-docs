'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const ADMIN_EMAIL = 'harlene@example.com'
const CERT_BUCKET = 'ISO IMS Certificates'

const TIERS = [
  'tier-1-policies',
  'tier-2-ims-manual',
  'tier-3-procedures',
  'tier-4-work-instructions',
  'tier-5-forms',
]

const FORM_FOLDERS = [
  'management',
  'business-development',
  'ehs',
  'finance',
  'human-resource',
  'procurement',
  'operations',
  'external-documents',
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
const AwardIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </svg>
)
const DownloadIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)
const EyeIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
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
const PlusIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)
const XIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)
const ImageIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
)
const FileIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
)

interface Certificate {
  id: string
  name: string
  description: string | null
  pdf_path: string
  preview_path: string | null
  created_at: string
}

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [isEditor, setIsEditor] = useState(false)
  const [loading, setLoading] = useState(true)
  const [documentCount, setDocumentCount] = useState(0)
  const [ncrStats, setNcrStats] = useState({ total: 0, open: 0, inProgress: 0 })
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({})

  const [showUpload, setShowUpload] = useState(false)
  const [certName, setCertName] = useState('')
  const [certDesc, setCertDesc] = useState('')
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [previewFile, setPreviewFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const [deletingCert, setDeletingCert] = useState<Certificate | null>(null)
  const [deleting, setDeleting] = useState(false)

const router = useRouter()
const loadingCanvasRef = useRef<HTMLCanvasElement>(null)

useEffect(() => {
  init()
}, [])

// Animated particle network for loading screen
useEffect(() => {
  if (!loading) return
  const canvas = loadingCanvasRef.current
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

  return () => {
    cancelAnimationFrame(animationId)
    window.removeEventListener('resize', onResize)
  }
}, [loading])

  const init = async () => {
    // PATCHED: capture auth errors and clear bad tokens before redirecting
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

    let docTotal = 0
    for (const tierId of TIERS) {
      if (tierId === 'tier-5-forms') {
        for (const folder of FORM_FOLDERS) {
          const { data } = await supabase.storage
            .from('documents')
            .list(`${tierId}/${folder}`, { limit: 100 })
          const docs = (data || []).filter(d => d.name !== '.emptyFolderPlaceholder')
          docTotal += docs.length
        }
      } else {
        const { data } = await supabase.storage
          .from('documents')
          .list(tierId, { limit: 100 })
        const docs = (data || []).filter(d => d.name !== '.emptyFolderPlaceholder')
        docTotal += docs.length
      }
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

    await loadCertificates()
    setLoading(false)
  }

  const loadCertificates = async () => {
    const { data, error: certError } = await supabase
      .from('certificates')
      .select('*')
      .order('created_at', { ascending: true })

    if (certError) {
      console.error('Error loading certificates:', certError.message)
      return
    }
    const certs = (data as Certificate[]) || []
    setCertificates(certs)

    const urls: Record<string, string> = {}
    for (const cert of certs) {
      if (cert.preview_path) {
        const { data: signed } = await supabase.storage
          .from(CERT_BUCKET)
          .createSignedUrl(cert.preview_path, 3600)
        if (signed?.signedUrl) urls[cert.id] = signed.signedUrl
      }
    }
    setPreviewUrls(urls)
  }

  const handleViewCert = async (cert: Certificate) => {
    const { data, error } = await supabase.storage
      .from(CERT_BUCKET)
      .createSignedUrl(cert.pdf_path, 3600)
    if (error) { alert('Could not open: ' + error.message); return }
    if (data?.signedUrl) window.open(data.signedUrl, '_blank')
  }

  const handleDownloadCert = async (cert: Certificate) => {
    const { data, error } = await supabase.storage
      .from(CERT_BUCKET)
      .createSignedUrl(cert.pdf_path, 3600, { download: `${cert.name}.pdf` })
    if (error) { alert('Could not download: ' + error.message); return }
    if (data?.signedUrl) window.open(data.signedUrl, '_blank')
  }

  const handleUploadCert = async () => {
    if (!certName.trim()) { setUploadError('Please enter a certificate name'); return }
    if (!pdfFile) { setUploadError('Please select the certificate PDF'); return }

    setUploading(true)
    setUploadError('')

    const slug = certName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const timestamp = Date.now()
    const pdfPath = `${slug}-${timestamp}.pdf`

    const { error: pdfError } = await supabase.storage
      .from(CERT_BUCKET)
      .upload(pdfPath, pdfFile, { cacheControl: '3600', upsert: false })

    if (pdfError) {
      setUploadError('PDF upload failed: ' + pdfError.message)
      setUploading(false)
      return
    }

    let previewPath: string | null = null
    if (previewFile) {
      const ext = previewFile.name.split('.').pop()?.toLowerCase() || 'png'
      previewPath = `previews/${slug}-${timestamp}.${ext}`
      const { error: prevError } = await supabase.storage
        .from(CERT_BUCKET)
        .upload(previewPath, previewFile, { cacheControl: '3600', upsert: false })

      if (prevError) {
        await supabase.storage.from(CERT_BUCKET).remove([pdfPath])
        setUploadError('Preview upload failed: ' + prevError.message)
        setUploading(false)
        return
      }
    }

    const { error: insertError } = await supabase
      .from('certificates')
      .insert({
        name: certName.trim(),
        description: certDesc.trim() || null,
        pdf_path: pdfPath,
        preview_path: previewPath,
      })

    if (insertError) {
      const toRemove = [pdfPath]
      if (previewPath) toRemove.push(previewPath)
      await supabase.storage.from(CERT_BUCKET).remove(toRemove)
      setUploadError('Database insert failed: ' + insertError.message)
      setUploading(false)
      return
    }

    setCertName('')
    setCertDesc('')
    setPdfFile(null)
    setPreviewFile(null)
    setShowUpload(false)
    setUploading(false)
    await loadCertificates()
  }

  const handleDeleteCert = async () => {
    if (!deletingCert || !isAdmin) return
    setDeleting(true)

    const toRemove = [deletingCert.pdf_path]
    if (deletingCert.preview_path) toRemove.push(deletingCert.preview_path)
    const { error: removeError } = await supabase.storage
      .from(CERT_BUCKET)
      .remove(toRemove)
    if (removeError) console.error('Storage cleanup error:', removeError.message)

    const { error: dbError } = await supabase
      .from('certificates')
      .delete()
      .eq('id', deletingCert.id)

    if (dbError) {
      alert('Could not delete: ' + dbError.message)
      setDeleting(false)
      return
    }

    setDeletingCert(null)
    setDeleting(false)
    await loadCertificates()
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

  const roleLabel = isAdmin ? 'Administrator' : isEditor ? 'Editor' : 'Viewer'
  const accessLabel = isAdmin ? 'Admin access' : isEditor ? 'Edit access' : 'Viewer access'
  const roleDescription = isAdmin
    ? 'You have full access — upload documents, edit and delete NCRs.'
    : isEditor
    ? 'You can view and download documents, and create or edit NCRs.'
    : 'You can view and download documents, and view NCR reports.'

if (loading) {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        background: 'radial-gradient(ellipse at top right, #0F5A35 0%, #094A2A 50%, #063B22 100%)',
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Animated particle network */}
      <canvas ref={loadingCanvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />

      {/* Soft glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
        <div className="absolute -top-20 -right-20 w-[600px] h-[600px] rounded-full bg-emerald-300/8 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-emerald-900/30 blur-3xl" />
      </div>

      {/* Loading content */}
      <div className="relative flex flex-col items-center gap-8" style={{ zIndex: 2 }}>
        {/* Logo with animated rings */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Outer pulsing ring */}
          <div className="absolute inset-0 rounded-full border-2 border-emerald-300/30 animate-ping" style={{ animationDuration: '2s' }} />
          {/* Middle pulsing ring */}
          <div className="absolute inset-2 rounded-full border-2 border-emerald-300/40 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.4s' }} />
          {/* Spinning gradient ring */}
          <div className="absolute inset-4 rounded-full border-4 border-transparent border-t-emerald-200 border-r-emerald-300 animate-spin" style={{ animationDuration: '1.5s' }} />
          {/* Logo in center */}
          <img
            src="/operon-logo-white.png"
            alt="Operon"
            className="w-16 h-16 object-contain relative drop-shadow-2xl"
          />
        </div>

        {/* Brand text */}
        <div className="text-center">
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-200/80 mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            ⏤ Operon Middle East ⏤
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            ISO IMS Portal
          </h1>
        </div>

        {/* Loading bar */}
        <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 via-emerald-200 to-emerald-400 rounded-full"
            style={{
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s linear infinite',
            }}
          />
        </div>

        {/* Loading text with animated dots */}
        <div className="flex items-center gap-2 text-sm text-white/80">
          <span>Loading your dashboard</span>
          <span className="flex gap-1">
            <span className="w-1 h-1 rounded-full bg-emerald-300 animate-bounce" style={{ animationDelay: '0s' }} />
            <span className="w-1 h-1 rounded-full bg-emerald-300 animate-bounce" style={{ animationDelay: '0.15s' }} />
            <span className="w-1 h-1 rounded-full bg-emerald-300 animate-bounce" style={{ animationDelay: '0.3s' }} />
          </span>
        </div>
      </div>

      {/* Shimmer keyframe */}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
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
                  {isAdmin ? 'Admin' : isEditor ? 'Editor' : 'Viewer'}
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
              <div className="text-sm text-emerald-950 font-medium">Home</div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-full text-xs font-medium ring-1 ring-emerald-600/20 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {accessLabel}
              </div>
            </div>
          </header>

          <div className="flex-1 p-8 relative">
            <div className="mb-10">
              <div className="text-xs font-mono text-emerald-700/70 mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>WELCOME BACK</div>
              <h1 className="text-3xl font-bold tracking-tight text-emerald-950">Hello, {getGreetingName()} 👋</h1>
              <p className="text-sm text-emerald-700/70 mt-1">{roleDescription}</p>
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

            <div className="mt-12 max-w-6xl">
              <div className="flex items-end justify-between gap-4 mb-4">
                <div>
                  <div className="text-xs font-mono text-emerald-700/70 mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>CERTIFICATIONS</div>
                  <h2 className="text-xl font-bold tracking-tight text-emerald-950">ISO IMS Certificates</h2>
                  <p className="text-sm text-emerald-700/70 mt-1">Operon Middle East's accredited management system certifications.</p>
                </div>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setShowUpload(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium rounded-lg shadow-sm transition shrink-0"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add Certificate
                  </button>
                )}
              </div>

              {certificates.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {certificates.map((cert) => (
                    <div key={cert.id} className="bg-white rounded-2xl border border-emerald-100 overflow-hidden hover:border-emerald-300 hover:shadow-lg transition-all group">
                      <div className="aspect-[4/5] bg-emerald-50 border-b border-emerald-100 relative overflow-hidden">
                        {previewUrls[cert.id] ? (
                          <img
                            src={previewUrls[cert.id]}
                            alt={cert.name}
                            className="w-full h-full object-contain p-4"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-emerald-400">
                            <AwardIcon className="w-16 h-16 mb-2" />
                            <span className="text-xs font-medium">No preview</span>
                          </div>
                        )}
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => setDeletingCert(cert)}
                            className="absolute top-2 right-2 p-1.5 rounded-md bg-white/90 backdrop-blur-sm border border-emerald-200 text-emerald-700 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 transition shadow-sm opacity-0 group-hover:opacity-100"
                            title="Delete certificate"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="p-5">
                        <div className="flex items-start gap-2 mb-2">
                          <div className="w-8 h-8 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                            <AwardIcon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-bold text-emerald-950 leading-tight">{cert.name}</h3>
                            {cert.description && (
                              <p className="text-xs text-emerald-700/70 mt-0.5 leading-snug">{cert.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button
                            type="button"
                            onClick={() => handleViewCert(cert)}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-medium rounded-lg transition border border-emerald-100"
                          >
                            <EyeIcon className="w-3.5 h-3.5" />
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownloadCert(cert)}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium rounded-lg transition shadow-sm"
                          >
                            <DownloadIcon className="w-3.5 h-3.5" />
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-dashed border-emerald-200 p-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4 text-emerald-600">
                    <AwardIcon className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-medium text-emerald-950 mb-1">No certificates yet</div>
                  <div className="text-xs text-emerald-700/60">
                    {isAdmin ? 'Click "Add Certificate" to upload your first ISO certification.' : 'ISO certificates will appear here once published by an administrator.'}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-12 max-w-4xl">
              <div className="text-xs font-mono text-emerald-700/70 mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>QUICK INFO</div>
              <div className="bg-white rounded-xl border border-emerald-100 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-xs text-emerald-700/70 mb-1">Your role</div>
                    <div className="text-sm font-semibold text-emerald-950 flex items-center gap-1">
                      {isAdmin && <span className="text-amber-500">👑</span>}
                      {roleLabel}
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

      {showUpload && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-emerald-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-emerald-950">Add ISO Certificate</h3>
                <p className="text-sm text-emerald-700/70">Upload a new accredited certification</p>
              </div>
              <button
                type="button"
                onClick={() => { setShowUpload(false); setUploadError('') }}
                disabled={uploading}
                className="p-1.5 rounded-md text-emerald-700 hover:bg-emerald-50 transition disabled:opacity-50"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="cert-name" className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">
                  Certificate Name <span className="text-rose-600">*</span>
                </label>
                <input
                  id="cert-name"
                  type="text"
                  value={certName}
                  onChange={(e) => setCertName(e.target.value)}
                  disabled={uploading}
                  placeholder="e.g. ISO 9001:2015 — Quality Management"
                  className="w-full px-3 py-2.5 bg-white border border-emerald-200 rounded-lg text-sm text-emerald-950 placeholder:text-emerald-700/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label htmlFor="cert-desc" className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">
                  Short Description
                </label>
                <input
                  id="cert-desc"
                  type="text"
                  value={certDesc}
                  onChange={(e) => setCertDesc(e.target.value)}
                  disabled={uploading}
                  placeholder="e.g. Certified by Bureau Veritas"
                  className="w-full px-3 py-2.5 bg-white border border-emerald-200 rounded-lg text-sm text-emerald-950 placeholder:text-emerald-700/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">
                  Certificate PDF <span className="text-rose-600">*</span>
                </label>
                <label htmlFor="pdf-input" className="block border-2 border-dashed border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/40 rounded-lg p-4 cursor-pointer transition">
                  <input
                    id="pdf-input"
                    type="file"
                    accept="application/pdf,.pdf"
                    className="hidden"
                    onChange={(e) => { setPdfFile(e.target.files?.[0] || null); setUploadError('') }}
                    disabled={uploading}
                  />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <FileIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-emerald-950 truncate">
                        {pdfFile ? pdfFile.name : 'Click to choose PDF'}
                      </div>
                      <div className="text-xs text-emerald-700/60">
                        {pdfFile ? `${(pdfFile.size / 1024 / 1024).toFixed(2)} MB` : 'PDF file required'}
                      </div>
                    </div>
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">
                  Preview Image <span className="text-emerald-700/60 normal-case font-normal">(optional)</span>
                </label>
                <label htmlFor="preview-input" className="block border-2 border-dashed border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/40 rounded-lg p-4 cursor-pointer transition">
                  <input
                    id="preview-input"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"
                    className="hidden"
                    onChange={(e) => { setPreviewFile(e.target.files?.[0] || null); setUploadError('') }}
                    disabled={uploading}
                  />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-emerald-950 truncate">
                        {previewFile ? previewFile.name : 'Click to choose preview image'}
                      </div>
                      <div className="text-xs text-emerald-700/60">
                        {previewFile ? `${(previewFile.size / 1024).toFixed(0)} KB` : 'PNG, JPG, or WEBP'}
                      </div>
                    </div>
                  </div>
                </label>
              </div>

              {uploadError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 text-sm p-3 rounded-lg">
                  {uploadError}
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end mt-6 pt-4 border-t border-emerald-100">
              <button
                type="button"
                onClick={() => { setShowUpload(false); setUploadError('') }}
                disabled={uploading}
                className="px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-50 rounded-lg transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUploadCert}
                disabled={uploading || !certName.trim() || !pdfFile}
                className="px-4 py-2 text-sm font-medium bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Uploading…
                  </>
                ) : (
                  <>
                    <PlusIcon className="w-4 h-4" />
                    Add Certificate
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {deletingCert && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-emerald-100">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-11 h-11 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <TrashIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-emerald-950 mb-1">Delete certificate?</h3>
                <p className="text-sm text-emerald-700/80">
                  This will permanently delete <span className="font-medium text-emerald-950">{deletingCert.name}</span> and its preview. This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <button
                type="button"
                onClick={() => setDeletingCert(null)}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-50 rounded-lg transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCert}
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
