'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

interface ShareButtonProps {
  pageOrFolder: string
}

export default function ShareButton({ pageOrFolder }: ShareButtonProps) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [permission, setPermission] = useState<'view' | 'edit'>('view')
  const [linkPermission, setLinkPermission] = useState<'view' | 'edit'>('view')
  const [loading, setLoading] = useState(false)
  const [shareLink, setShareLink] = useState('')
  const [message, setMessage] = useState('')

  const supabase = createClient()

  async function inviteByEmail() {
    if (!email) return
    setLoading(true)
    setMessage('')

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()

    if (!profile) {
      setMessage('User not found. Make sure they have an account first.')
      setLoading(false)
      return
    }

    const { error } = await supabase
      .from('page_access')
      .upsert({
        page: pageOrFolder,
        user_id: profile.id,
        permission,
      }, { onConflict: 'page,user_id' })

    if (error) {
      setMessage('Something went wrong. Please try again.')
    } else {
      setMessage(`Access granted to ${email}!`)
      setEmail('')
    }
    setLoading(false)
  }

  async function generateLink() {
    setLoading(true)
    const token = crypto.randomUUID()

    const { error } = await supabase
      .from('page_access')
      .insert({
        page: pageOrFolder,
        user_id: null,
        permission: linkPermission,
        share_token: token,
      })

    if (!error) {
      const link = `${window.location.origin}/share/${token}`
      setShareLink(link)
    }
    setLoading(false)
  }

  async function copyLink() {
    await navigator.clipboard.writeText(shareLink)
    setMessage('Link copied!')
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 14px',
          borderRadius: '8px',
          border: '1px solid var(--color-border-primary)',
          background: 'var(--color-background-secondary)',
          color: 'var(--color-text-primary)',
          cursor: 'pointer',
          fontSize: '14px',
        }}
      >
        Share
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: '44px',
          right: 0,
          width: '320px',
          background: 'var(--color-background-primary)',
          border: '1px solid var(--color-border-secondary)',
          borderRadius: '12px',
          padding: '20px',
          zIndex: 100,
          boxSizing: 'border-box',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>Share access</span>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: '18px' }}>×</button>
          </div>

          {/* Invite by email */}
          <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Invite by email</p>
          <input
            type="email"
            placeholder="name@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: '8px',
              border: '1px solid var(--color-border-secondary)',
              background: 'var(--color-background-secondary)',
              color: 'var(--color-text-primary)',
              fontSize: '13px',
              marginBottom: '8px',
              boxSizing: 'border-box',
            }}
          />

          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <select
              value={permission}
              onChange={e => setPermission(e.target.value as 'view' | 'edit')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                border: '1px solid var(--color-border-secondary)',
                background: 'var(--color-background-secondary)',
                color: 'var(--color-text-primary)',
                fontSize: '13px',
              }}
            >
              <option value="view">Can view</option>
              <option value="edit">Can edit</option>
            </select>
            <button
              onClick={inviteByEmail}
              disabled={loading || !email}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: '#534AB7',
                color: '#fff',
                fontSize: '13px',
                cursor: 'pointer',
                opacity: loading || !email ? 0.6 : 1,
              }}
            >
              Invite
            </button>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-tertiary)', margin: '12px 0' }} />

          {/* Share via link */}
          <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Share via link</p>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <select
              value={linkPermission}
              onChange={e => setLinkPermission(e.target.value as 'view' | 'edit')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                border: '1px solid var(--color-border-secondary)',
                background: 'var(--color-background-secondary)',
                color: 'var(--color-text-primary)',
                fontSize: '13px',
              }}
            >
              <option value="view">Can view</option>
              <option value="edit">Can edit</option>
            </select>
            <button
              onClick={generateLink}
              disabled={loading}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: '#534AB7',
                color: '#fff',
                fontSize: '13px',
                cursor: 'pointer',
                opacity: loading ? 0.6 : 1,
              }}
            >
              Generate
            </button>
          </div>

          {shareLink && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                readOnly
                value={shareLink}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border-secondary)',
                  background: 'var(--color-background-secondary)',
                  color: 'var(--color-text-secondary)',
                  fontSize: '12px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              />
              <button
                onClick={copyLink}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border-secondary)',
                  background: 'var(--color-background-secondary)',
                  color: 'var(--color-text-primary)',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Copy
              </button>
            </div>
          )}

          {message && (
            <p style={{ fontSize: '12px', marginTop: '10px', color: message.includes('granted') || message.includes('copied') ? '#1D9E75' : '#E24B4A' }}>
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  )
}