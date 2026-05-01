'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter, useParams } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ⭐ ADMIN EMAIL
const ADMIN_EMAIL = 'harlene@example.com'

export default function NCRDetailPage() {

  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [canEdit, setCanEdit] = useState(false)

  const [ncr, setNCR] = useState<any>(null)

  // =========================
  // INIT
  // =========================
  const init = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const email = (user.email || '').toLowerCase()
    setUserEmail(email)

    const adminAccess = email === ADMIN_EMAIL.toLowerCase()
    setIsAdmin(adminAccess)

    let editorAccess = false
    if (!adminAccess) {
      const { data } = await supabase
        .from('ncr_editors')
        .select('email')
        .ilike('email', email)
        .maybeSingle()

      editorAccess = !!data
    }

    // Load NCR
    const { data: ncrData } = await supabase
      .from('ncrs')
      .select('*')
      .eq('id', id)
      .single()

    if (!ncrData) {
      alert('NCR not found')
      router.push('/ncr')
      return
    }

    const isOwner = ncrData.created_by === email

    // ✅ PERMISSION RULES
    const editAccess =
      adminAccess || (editorAccess && isOwner)

    setCanEdit(editAccess)
    setNCR(ncrData)
    setLoading(false)
  }

  useEffect(() => {
    init()
  }, [])

  // =========================
  // SAVE NCR
  // =========================
  const saveNCR = async () => {

    if (!canEdit) return

    await supabase
      .from('ncrs')
      .update({
        title: ncr.title,
        description: ncr.description
      })
      .eq('id', id)

    alert('NCR updated')
    router.push('/ncr')
  }

  if (loading) return <p>Loading...</p>

  // =========================
  // UI
  // =========================
  return (
    <div style={{ padding: 20, maxWidth: 600 }}>

      <h1>NCR Details</h1>

      <p><b>NCR Number:</b> {ncr.ncr_number}</p>
      <p><b>Created By:</b> {ncr.created_by}</p>

      <hr />

      <label>Title</label>
      <input
        value={ncr.title || ''}
        disabled={!canEdit}
        onChange={e =>
          setNCR({ ...ncr, title: e.target.value })
        }
        style={{ width: '100%', marginBottom: 10 }}
      />

      <label>Description</label>
      <textarea
        value={ncr.description || ''}
        disabled={!canEdit}
        onChange={e =>
          setNCR({ ...ncr, description: e.target.value })
        }
        style={{ width: '100%', height: 120 }}
      />

      <br /><br />

      {/* SAVE */}
      {canEdit && (
        <button onClick={saveNCR}>
          Save Changes
        </button>
      )}

      <button onClick={() => router.push('/ncr')}
        style={{ marginLeft: 10 }}
      >
        Back
      </button>

      {!canEdit && (
        <p style={{ color: 'gray' }}>
          Viewer access: read-only
        </p>
      )}

    </div>
  )
}
