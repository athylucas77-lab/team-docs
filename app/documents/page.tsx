'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const ADMIN_EMAIL = 'harlene@example.com'

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

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentFile[]>([])
  const [userEmail, setUserEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
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

    const { data, error } = await supabase.storage
      .from('documents')
      .list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      })

    if (error) {
      setError('Could not load documents: ' + error.message)
    } else {
      setDocuments(data || [])
    }
    setLoading(false)
  }

  const handleDownload = async (fileName: string) => {
    const { data, error } = await supabase.storage
      .from('documents')
      .createSignedUrl(fileName, 3600)

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
              Company Documents
            </h2>
            <p className="text-green-200 text-sm">
              {documents.length} {documents.length === 1 ? 'document' : 'documents'} available
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

        {documents.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-12 text-center border border-green-700/30">
            <div className="text-6xl mb-4">📂</div>
            <p className="text-white text-lg font-medium mb-2">No documents yet</p>
            <p className="text-green-200 text-sm">
              {isAdmin 
                ? 'Upload your first document to get started' 
                : 'Documents will appear here once the admin uploads them'
              }
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="divide-y divide-gray-200">
              {documents.map((doc) => (
                <div
                  key={doc.id || doc.name}
                  className="px-5 py-4 hover:bg-green-50 transition flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="text-3xl">{getFileIcon(doc.name)}</div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate">
                        {doc.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatFileSize(doc.metadata?.size || 0)} • Uploaded {formatDate(doc.created_at)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(doc.name)}
                    className="bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition whitespace-nowrap"
                  >
                    View / Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-xs text-green-300 mt-12">
          © 2026 Operon Middle East — An Edgenta Company
        </p>
      </div>
    </main>
  )
}