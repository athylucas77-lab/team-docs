'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { listExistingNames } from '../../lib/storage' // ✅ FIXED

export default function UploadPage() {
  const router = useRouter()

  const [files, setFiles] = useState<File[]>([])
  const [tier, setTier] = useState('')
  const [subfolder, setSubfolder] = useState('')
  const [existing, setExisting] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  /* Remember last location */
  useEffect(() => {
    const last = sessionStorage.getItem('last-doc-location')
    if (last) {
      const { tier, folder } = JSON.parse(last)
      setTier(tier)
      setSubfolder(folder)
    }
  }, [])

  useEffect(() => {
    if (tier) {
      const path = subfolder ? `${tier}/${subfolder}` : tier
      listExistingNames(path).then(setExisting)
    }
  }, [tier, subfolder])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)])
  }

  const handleUpload = async () => {
    if (!tier || files.length === 0) {
      setError('Tier and at least one file are required.')
      return
    }

    setUploading(true)
    setError('')

    for (const file of files) {
      if (existing.includes(file.name)) {
        setError(`Duplicate file detected: ${file.name}`)
        setUploading(false)
        return
      }

      const path = subfolder
        ? `${tier}/${subfolder}/${file.name}`
        : `${tier}/${file.name}`

      const { error } = await supabase.storage
        .from('documents')
        .upload(path, file, { upsert: false })

      if (error) {
        setError(error.message)
        setUploading(false)
        return
      }
    }

    sessionStorage.setItem(
      'last-doc-location',
      JSON.stringify({ tier, folder: subfolder })
    )

    router.push('/documents')
  }

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Upload Documents</h1>

      {/* Drag & Drop */}
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed border-emerald-300 rounded-xl p-10 text-center bg-emerald-50 mb-4"
      >
        Drop files here or click to select
        <input
          type="file"
          multiple
          className="hidden"
          onChange={e => setFiles(Array.from(e.target.files || []))}
        />
      </div>

      {files.length > 0 && (
        <ul className="mb-4 text-sm">
          {files.map(f => (
            <li key={f.name}>📄 {f.name}</li>
          ))}
        </ul>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 p-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      <button
        disabled={uploading}
        onClick={handleUpload}
        className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg"
      >
        {uploading ? 'Uploading…' : 'Upload'}
      </button>
    </div>
  )
}