'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ⭐ ADMIN EMAIL
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
      .from('ncrs')
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

    const adminAccess =
      email === ADMIN_EMAIL.toLowerCase()

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

    setCanEdit(adminAccess || editorAccess)

    await loadNCRs()
    setLoading(false)
  }

  useEffect(() => {
    init()
  }, [])

  // =========================
  // CREATE NCR
  // =========================
  const createNCR = async () => {

    const title = prompt('Enter NCR Title')

    if (!title) return

    const ncrNumber =
      'NCR-' + new Date().getTime()

    await supabase.from('ncrs').insert({
      ncr_number: ncrNumber,
      title,
      created_by: userEmail
    })

    loadNCRs()
  }

  // =========================
  // DELETE NCR
  // =========================
  const deleteNCR = async (id: string, owner: string) => {

    if (!isAdmin && owner !== userEmail) {
      alert('You can only delete your own NCR.')
      return
    }

    if (!confirm('Delete this NCR?')) return

    await supabase
      .from('ncrs')
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

      {/* NEW NCR */}
      {canEdit && (
        <button onClick={createNCR}>
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
          {ncrs.map((ncr) => {

            const isOwner =
              ncr.created_by === userEmail

            return (
              <tr key={ncr.id}>
                <td>{ncr.title}</td>
                <td>{ncr.created_by}</td>

                <td>

                  {/* EDIT */}
                  {(isAdmin || isOwner) && (
                    <button>Edit</button>
                  )}

                  {/* DELETE */}
                  {(isAdmin || isOwner) && (
                    <button
                      onClick={() =>
                        deleteNCR(
                          ncr.id,
                          ncr.created_by
                        )
                      }
                    >
                      Delete
                    </button>
                  )}

                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

    </div>
  )
}