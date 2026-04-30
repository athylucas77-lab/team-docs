'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const ADMIN_EMAIL = 'harlene@example.com'

const TIERS = [
  { id: 'tier-1-policies', label: 'Tier 1 - Policies', icon: '📋', color: 'bg-blue-100 text-blue-800' },
  { id: 'tier-2-ims-manual', label: 'Tier 2 - IMS Manual, Plan, Document List', icon: '📘', color: 'bg-purple-100 text-purple-800' },
  { id: 'tier-3-procedures', label: 'Tier 3 - Procedures', icon: '📑', color: 'bg-amber-100 text-amber-800' },
  { id: 'tier-4-work-instructions', label: 'Tier 4 - Work Instructions, Flowcharts', icon: '📃', color: 'bg-emerald-100 text-emerald-800' },
  { id: 'tier-5-forms', label: 'Tier 5 - Forms', icon: '📝', color: 'bg-rose-100 text-rose-800' },
]

interface DocumentFile {
  name: string
  id: string | null
  created_at: string | null
  updated_at?: string | null
  last_accessed_at?: string | null
  metadata: {
    size: number
    mimetype: string
  } | null
}

interface TierDocuments {
  tierId: string
  tierLabel: string
  tierIcon: string
  tierColor: string
  documents: DocumentFile[]
}

export default function DocumentsPage() {
  const [tieredDocuments, setTieredDocuments] = useState<TierDocuments[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [userEmail, setUserEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedTiers, setExpandedTiers] = useState<Set<string>>(new Set(TIERS.map(t => t.id)))
  const router = useRouter()

  useEffect(() => {
    checkUserAndLoadDocuments()
  }, [])

  const checkUserAndLoadDocuments = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    setUserEmail(user.email || '')
    setIsAdmin(user.email === ADMIN_EMAIL)

    // Load documents from each tier folder
    const tiered: TierDocuments[] = []
    let total = 0

    for (const tier of TIERS) {
      const { data, error: listError } = await supabase.storage
        .from('documents')
        .list(tier.id, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' },
        })

      if (listError) {
        console.error(`Error loading ${tier.label}:`, listError.message)
      }

      const docs = (data || []).filter(d => d.name !== '.emptyFolderPlaceholder')
      tiered.push({
        tierId: tier.id,
        tierLabel: tier.label,
        tierIcon: tier.icon,
        tierColor: tier.color,
        documents: docs,
      })
      total += docs.length
    }

    setTieredDocuments(tiered)
    setTotalCount(total)
    setLoading(false)
  }

  const handleDownload = async (tierId: string, fileName: string) => {
    const filePath = `${tierId}/${fileName}`
    const { data, error } = await supabase.storage
      .from('documents')
      .createSignedUrl(filePath, 3600)

    if (error) {
      alert('Could not download: ' + error.message)
      return
    }

    if (data?.signedUrl) {
      window.open(data.signedUrl, '_blank')
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const toggleTier = (tierId: string) => {
    setExpandedTiers(prev => {
      const next = new Set(prev)
      if (next.has(tierId)) {
        next.delete(tierId)
      } else {
        next.add(tierId)
      }
      return next
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown date'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    if (ext === 'pdf') return '📄'
    if (['doc', 'docx'].includes(ext || '')) return '📝'
    if (['xls', 'xlsx', 'csv'].includes(ext || '')) return '📊'
    if (['ppt', 'pptx'].includes(ext || '')) return '📽️'
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) return '🖼️'
    if (['zip', 'rar'].includes(ext || '')) return '🗜️'
    return '📁'
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">
        <div className="text-white text-lg">Loading documents...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">
      
      <header className="bg-white/10 backdrop-blur-sm border-b border-green-700/50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white">
              ISO IMS Portal
            </h1>
            <p className="text-xs text-green-200">Operon Middle East</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <p className="text-xs text-green-200">
                {isAdmin ? '👑 Admin' : '👁️ Viewer'}
              </p>
              <p className="text-sm text-white font-medium">{userEmail}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
              IMS Document Library
            </h2>
            <p className="text-green-200 text-sm">
              {totalCount} {totalCount === 1 ? 'document' : 'documents'} across {TIERS.length} tiers
              {!isAdmin && ' • View only'}
            </p>
          </div>
          {isAdmin && (
            <Link
              href="/upload"
              className="bg-white hover:bg-green-50 text-green-900 font-semibold px-5 py-2 rounded-lg shadow-md transition flex items-center gap-2"
            >
              <span>+</span> Upload Document
            </Link>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-800 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Tier Sections */}
        <div className="space-y-4">
          {tieredDocuments.map((tier) => {
            const isExpanded = expandedTiers.has(tier.tierId)
            return (
              <div key={tier.tierId} className="bg-white rounded-xl shadow-2xl overflow-hidden">
                
                {/* Tier Header (Clickable) */}
                <button
                  onClick={() => toggleTier(tier.tierId)}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="text-2xl">{tier.tierIcon}</div>
                    <div className="text-left flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-base md:text-lg truncate">
                        {tier.tierLabel}
                      </h3>
                      <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${tier.tierColor}`}>
                        {tier.documents.length} {tier.documents.length === 1 ? 'document' : 'documents'}
                      </span>
                    </div>
                  </div>
                  <div className="text-2xl text-gray-400 ml-2">
                    {isExpanded ? '▼' : '▶'}
                  </div>
                </button>

                {/* Tier Documents (Collapsible) */}
                {isExpanded && (
                  <div className="border-t border-gray-200">
                    {tier.documents.length === 0 ? (
                      <div className="px-5 py-8 text-center text-gray-400 text-sm">
                        No documents in this tier yet
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {tier.documents.map((doc) => (
                          <div
                            key={doc.id || doc.name}
                            className="px-5 py-3 hover:bg-green-50 transition flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="text-2xl">{getFileIcon(doc.name)}</div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {doc.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatFileSize(doc.metadata?.size || 0)} • {formatDate(doc.created_at)}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDownload(tier.tierId, doc.name)}
                              className="bg-green-700 hover:bg-green-800 text-white text-xs md:text-sm font-medium px-3 md:px-4 py-2 rounded-lg transition whitespace-nowrap"
                            >
                              View / Download
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <p className="text-center text-xs text-green-300 mt-12">
          © 2026 Operon Middle East — An Edgenta Company
        </p>
      </div>
    </main>
  )
}