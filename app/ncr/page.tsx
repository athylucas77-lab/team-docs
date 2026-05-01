'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const ADMIN_EMAIL = 'harlene@example.com'

export default function NCRFormPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [canEdit, setCanEdit] = useState(false)

  const now = new Date().toISOString().slice(0, 16)

  const [form, setForm] = useState({
    title: '',
    description: '',
    rootCause: '',
    correctiveAction: '',
    dateRaised: now,
    targetCloseDate: '',
    preparedBy: null as string | null,
    preparedSignedAt: null as string | null,
    approvedBy: null as string | null,
    approvedSignedAt: null as string | null
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

    const admin = email === ADMIN_EMAIL.toLowerCase()
    setIsAdmin(admin)

    let editor = false
    if (!admin) {
      const { data } = await supabase
        .from('ncr_editors')
        .select('email')
        .ilike('email', email)
        .maybeSingle()

      editor = !!data
    }

    if (!admin && !editor) {
      alert('Viewer access only')
      router.push('/')
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
    await supabase.from('ncrs').insert({
      ncr_number: `NCR-${Date.now()}`,
      title: form.title,
      description: form.description,
      root_cause: form.rootCause,
      corrective_action: form.correctiveAction,
      date_raised: form.dateRaised,
      target_close_date: form.targetCloseDate,
      created_by: userEmail
    })

    alert('NCR saved')
  }

  const signAsPrepared = () => {
    setForm({
      ...form,
      preparedBy: userEmail,
      preparedSignedAt: new Date().toISOString()
    })
  }

  const signAsApproved = () => {
    setForm({
      ...form,
      approvedBy: userEmail,
      approvedSignedAt: new Date().toISOString()
    })
  }

  if (loading) return <p>Loading...</p>

  return (
    <div style={{ minHeight: '100vh', background: '#f4faf7', padding: 40 }}>
      <div style={card}>
        <h1>Non‑Conformance Report (NCR)</h1>

        {/* Dates */}
        <div style={row}>
          <Field label="Date Raised">
            <input type="datetime-local" value={form.dateRaised} disabled style={inputDisabled} />
          </Field>

          <Field label="Target Close Date">
            <input
              type="datetime-local"
              name="targetCloseDate"
              value={form.targetCloseDate}
              onChange={handleChange}
              style={input}
            />
          </Field>
        </div>

        <Field label="Title">
          <input name="title" value={form.title} onChange={handleChange} style={input} />
        </Field>

        <Field label="Description of Non‑Conformance">
          <textarea name="description" value={form.description} onChange={handleChange} style={textarea} />
        </Field>

        <Field label="Root Cause Analysis">
          <textarea name="rootCause" value={form.rootCause} onChange={handleChange} style={textarea} />
        </Field>

        <Field label="Corrective Action Plan">
          <textarea name="correctiveAction" value={form.correctiveAction} onChange={handleChange} style={textarea} />
        </Field>

        <hr />

        {/* SIGNATURES */}
        <h3>Electronic Signatures</h3>

        <Signature
          title="Prepared By"
          email={form.preparedBy}
          date={form.preparedSignedAt}
          buttonLabel="Sign as Prepared By"
          onSign={signAsPrepared}
          canSign={canEdit && !form.preparedSignedAt}
        />

        <Signature
          title="Approved By"
          email={form.approvedBy}
          date={form.approvedSignedAt}
          buttonLabel="Sign & Approve NCR"
          onSign={signAsApproved}
          canSign={isAdmin && form.preparedSignedAt && !form.approvedSignedAt}
        />

        <button onClick={submitNCR} style={primaryButton}>
          Save NCR
        </button>
      </div>
    </div>
  )
}

/* ---------------- Reusable Components ---------------- */

const Field = ({ label, children }: any) => (
  <div style={{ marginBottom: 20 }}>
    <label style={{ fontWeight: 600 }}>{label}</label>
    {children}
  </div>
)

const Signature = ({ title, email, date, buttonLabel, onSign, canSign }: any) => (
  <div style={{ marginBottom: 16 }}>
    <strong>{title}</strong>
    {email ? (
      <p style={{ color: '#2fa87a' }}>
        ✔ Signed by {email}<br />
        {new Date(date).toLocaleString()}
      </p>
    ) : (
      canSign && <button onClick={onSign} style={secondaryButton}>{buttonLabel}</button>
    )}
  </div>
)

/* ---------------- Styles ---------------- */

const card = {
  maxWidth: 900,
  margin: '0 auto',
  background: '#fff',
  padding: 32,
  borderRadius: 14,
  border: '1px solid #e6f2ec'
}

const row = { display: 'flex', gap: 20 }

const input = {
  width: '100%',
  padding: '12px',
  borderRadius: 8,
  border: '1px solid #d1e7dc'
}

const inputDisabled = { ...input, background: '#f1f5f3' }

const textarea = { ...input, height: 110 }

const primaryButton = {
  marginTop: 24,
  background: '#2fa87a',
  color: '#fff',
  padding: '12px 28px',
  borderRadius: 999,
  border: 'none',
  fontWeight: 600
}

const secondaryButton = {
  background: 'transparent',
  color: '#2fa87a',
  border: '1px solid #2fa87a',
  padding: '8px 14px',
  borderRadius: 8
}
