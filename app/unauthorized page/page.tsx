import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      gap: '12px',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: '#fef2f2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '8px',
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#e24b4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
      <h1 style={{ fontSize: '22px', fontWeight: 500, color: '#064e3b', margin: 0 }}>
        Access denied
      </h1>
      <p style={{ color: '#6b7280', fontSize: '14px', margin: 0, textAlign: 'center' }}>
        You don't have permission to view this page.
      </p>
      <Link href="/dashboard" style={{
        marginTop: '8px',
        color: '#059669',
        fontSize: '14px',
        textDecoration: 'none',
        padding: '8px 16px',
        border: '1px solid #d1fae5',
        borderRadius: '8px',
        background: '#f0fdf4',
      }}>
        Go back home
      </Link>
    </div>
  )
}