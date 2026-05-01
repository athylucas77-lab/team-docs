'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ⭐ CHANGE THIS TO YOUR ADMIN EMAIL
const ADMIN_EMAIL = 'harlene@example.com'

export default function NCRPage() {

  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [canEdit, setCanEdit] = useState(false)
  const [ncrs, setNCRs] = useState<any[]>([])

  // =========================
  // LOAD NCR LIST
  // =========================
  const loadNCRs = async () => {
    const { data, error } = await supabase
      .from('ncr_register')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setNCRs(data || [])
  }

  // =========================
  // INIT USER ROLE
  // =========================
  const init = async () => {

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const email = (user.email || '').toLowerCase()

    setUserEmail(email)

    // ✅ ADMIN CHECK
    const adminAccess =
      email === ADMIN_EMAIL.toLowerCase()

    setIsAdmin(adminAccess)

    let editorAccess = false

    // ✅ CHECK EDITOR TABLE
    if (!adminAccess) {
      const { data } = await supabase
        .from('ncr_editors')
        .select('email')
        .ilike('email', email)
        .maybeSingle()

      editorAccess = !!data
    }

    setCanEdit(adminAccess || editorAccess)

    await loadNCRs()

    setLoading(false)
  }

  useEffect(() => {
    init()
  }, [])

  // =========================
  // DELETE NCR
  // =========================
  const deleteNCR = async (id: string, owner: string) => {

    if (!isAdmin && owner !== userEmail) {
      alert('You can only delete your own NCR.')
      return
    }

    const confirmDelete = confirm('Delete this NCR?')

    if (!confirmDelete) return

    await supabase
      .from('ncr_register')
      .delete()
      .eq('id', id)

    loadNCRs()
  }

  if (loading) return <p>Loading...</p>

  // =========================
  // UI
  // =========================
  return (
    <div style={{ padding: 20 }}>

      <h1>NCR Register</h1>

      <p>
        Logged in as: <b>{userEmail}</b>
      </p>

      <p>
        Role:
        {isAdmin && ' Admin'}
        {!isAdmin && canEdit && ' Editor'}
        {!canEdit && ' Viewer'}
      </p>

      {/* ✅ NEW NCR BUTTON */}
      {canEdit && (
        <button onClick={() => alert('Create NCR')}>
          + New NCR
        </button>
      )}

      <hr />

      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Owner</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {ncrs.map((ncr) => (
            <tr key={ncr.id}>
              <td>{ncr.title}</td>
              <td>{ncr.owner_email}</td>

              <td>

                {/* EDIT */}
                {canEdit && (
                  <button>Edit</button>
                )}

                {/* DELETE */}
                {(isAdmin ||
                  ncr.owner_email === userEmail) && (
                  <button
                    onClick={() =>
                      deleteNCR(
                        ncr.id,
                        ncr.owner_email
                      )
                    }
                  >
                    Delete
                  </button>
                )}

              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  )
}