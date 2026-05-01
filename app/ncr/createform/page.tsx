'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ADMIN_EMAIL = 'harlene@example.com'

export default function CreateNCRPage() {

  const router = useRouter()

  const [userEmail, setUserEmail] = useState('')
  const [canEdit, setCanEdit] = useState(false)
  const [loading, setLoading] = useState(true)

  const [form, setForm] = useState({
    title: '',
    description: '',
    rootCause: '',
    correctiveAction: ''
  })

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const email = (user.email || '').toLowerCase()
    setUserEmail(email)

    const isAdmin = email === ADMIN_EMAIL.toLowerCase()

    let isEditor = false
    if (!isAdmin) {
      const { data } = await supabase
        .from('ncr_editors')
        .select('email')
        .ilike('email', email)
        .maybeSingle()

      isEditor = !!data
    }

    if (!isAdmin && !isEditor) {
      alert('Viewer access only')
      router.push('/ncr')
      return
    }

    setCanEdit(true)
    setLoading(false)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const submitNCR = async () => {
    const ncrNumber = `NCR-${Date.now()}`

    await supabase.from('ncrs').insert({
      ncr_number: ncrNumber,
      title: form.title,
      description: form.description,
      root_cause: form.rootCause,
      corrective_action: form.correctiveAction,
      created_by: userEmail
    })

    alert('NCR created')
    router.push('/ncr')
  }

  if (loading) return <p>Loading...</p>

  return (
    <div className="max-w-2xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        Create NCR
      </h1>

      <div className="space-y-4">

        <div>
          <label className="block font-medium">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded p-2 h-24"
          />
        </div>

        <div>
          <label className="block font-medium">Root Cause</label>
          <textarea
            name="rootCause"
            value={form.rootCause}
            onChange={handleChange}
            className="w-full border rounded p-2 h-24"
          />
        </div>

        <div>
          <label className="block font-medium">Corrective Action</label>
          <textarea
            name="correctiveAction"
            value={form.correctiveAction}
            onChange={handleChange}
            className="w-full border rounded p-2 h-24"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={submitNCR}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save NCR
          </button>

          <button
            onClick={() => router.push('/ncr')}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  )
}
``