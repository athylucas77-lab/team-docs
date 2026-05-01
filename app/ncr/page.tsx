'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

// ⭐ ADMIN EMAIL
const ADMIN_EMAIL = 'harlene@example.com'

export default function NCRFormPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const [canEdit, setCanEdit] = useState(false)

  const [form, setForm] = useState({
    title: '',
    description: '',
    rootCause: '',
    correctiveAction: ''
  })

  // =========================
  // INIT USER ROLE
  // =========================
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
      router.push('/')
      return
    }

    setCanEdit(true)
    setLoading(false)
  }

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // =========================
  // SUBMIT NCR
  // =========================
  const submitNCR = async () => {
    await supabase.from('ncrs').insert({
      ncr_number: `NCR-${Date.now()}`,
      title: form.title,
      description: form.description,
      root_cause: form.rootCause,
      corrective_action: form.correctiveAction,
      created_by: userEmail
    })

    alert('NCR submitted successfully')

    setForm({
      title: '',
      description: '',
      rootCause: '',
      correctiveAction: ''
    })
  }

  if (loading) return <p>Loading...</p>

  // =========================
  // UI (ACTUAL NCR FORM)
  // =========================
  return (
    <div
      style={{
        maxWidth: 700,
        margin: '40px auto',
        padding: 30,
        border: '1px solid #ccc',
        borderRadius: 6
      }}
    >
      <h2>Non‑Conformance Report (NCR)</h2>

      <label>Title</label>
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        style={{ width: '100%', marginBottom: 12 }}
      />

      <label>Description of Non‑Conformance</label>
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        style={{ width: '100%', height: 90, marginBottom: 12 }}
      />

      <label>Root Cause Analysis</label>
      <textarea
        name="rootCause"
        value={form.rootCause}
        onChange={handleChange}
        style={{ width: '100%', height: 90, marginBottom: 12 }}
      />

      <label>Corrective Action Plan</label>
      <textarea
        name="correctiveAction"
        value={form.correctiveAction}
        onChange={handleChange}
        style={{ width: '100%', height: 90 }}
      />

      <br /><br />

      {canEdit && (
        <button onClick={submitNCR}>
          Submit NCR
        </button>
      )}
    </div>
  )
}