'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const ADMIN_EMAIL = 'harlene@example.com'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [authChecking, setAuthChecking] = useState(true)
  const [dragActive, setDragActive] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
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

  const handleFileSelect = (selectedFile: File | null) => {
    setError('')
    setSuccess(false)
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }

    setUploading(true)
    setError('')
    setSuccess(false)

    const timestamp = Date.now()
    const safeFileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(safeFileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      setError('Upload failed: ' + uploadError.message)
      setUploading(false)
    } else {
      setSuccess(true)
      setFile(null)
      setUploading(false)
      const fileInput = document.getElementById('file-input') as HTMLInputElement
      if (fileInput) fileInput.value = ''
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (authChecking) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">
        <div className="text-white text-lg">Verifying access...</div>
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
              <p className="text-xs text-green-200">👑 Admin</p>
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

      <div className="max-w-3xl mx-auto px-4 py-8">
        
        <div className="mb-6">
          <Link 
            href="/documents"
            className="text-green-200 hover:text-white text-sm inline-flex items-center gap-1 mb-3"
          >
            ← Back to Documents
          </Link>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
            Upload Document
          </h2>
          <p className="text-green-200 text-sm">
            Add a new document to the team library
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          
          <label
            htmlFor="file-input"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`
              block border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition
              ${dragActive 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
              }
            `}
          >
            <input
              id="file-input"
              type="file"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
              disabled={uploading}
            />
            
            <div className="text-5xl mb-3">📤</div>
            <p className="text-lg font-medium text-gray-900 mb-1">
              {file ? file.name : 'Drop file here or click to browse'}
            </p>
            <p className="text-sm text-gray-500">
              {file 
                ? formatFileSize(file.size)
                : 'PDF, Word, Excel, PowerPoint, or any document'
              }
            </p>
          </label>

          {file && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">📎</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setFile(null)
                  const fileInput = document.getElementById('file-input') as HTMLInputElement
                  if (fileInput) fileInput.value = ''
                }}
                disabled={uploading}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Remove
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg">
              ❌ {error}
            </div>
          )}

          {success && (
            <div className="mt-4 bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-lg">
              ✅ Document uploaded successfully! 
              <Link href="/documents" className="ml-2 font-medium underline">
                View Documents
              </Link>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="mt-6 w-full bg-green-700 hover:bg-green-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg shadow-md transition"
          >
            {uploading ? '⏳ Uploading...' : '📤 Upload Document'}
          </button>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <p className="font-semibold mb-1">📋 Upload Guidelines:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Maximum file size: 50 MB (Supabase free tier limit)</li>
              <li>Supported: PDF, Word, Excel, PowerPoint, images, ZIP</li>
              <li>Files are securely stored and encrypted</li>
              <li>Admin-only access to upload</li>
            </ul>
          </div>

        </div>

        <p className="text-center text-xs text-green-300 mt-12">
          © 2026 Operon Middle East — An Edgenta Company
        </p>
      </div>
    </main>
  )
}