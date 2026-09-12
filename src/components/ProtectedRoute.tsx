import { useEffect } from 'react'
import { isAuthenticated, getUser, isPlatformAdmin, redirectToLogin, logout, displayName } from '@/lib/auth'
import { C } from '../design'

function CenteredMessage({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: C.bg,
      }}
    >
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        {children}
      </div>
    </div>
  )
}

function AccessDenied() {
  const user = getUser()

  return (
    <CenteredMessage>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: 'rgba(220,53,69,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ color: C.destructive, fontSize: 22, fontWeight: 700 }}>!</span>
      </div>
      <div>
        <p style={{ fontSize: 15, fontWeight: 600, color: C.fg }}>Access denied</p>
        <p style={{ fontSize: 13, color: C.fgMuted, marginTop: 4 }}>
          {user ? `${displayName(user)} does not have` : 'Your account does not have'} permission to view the Notify
          admin console.
        </p>
      </div>
      <button
        onClick={logout}
        style={{
          padding: '8px 16px',
          borderRadius: 8,
          background: 'transparent',
          border: `1px solid ${C.border}`,
          color: C.fgMuted,
          fontSize: 13,
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        Sign out
      </button>
    </CenteredMessage>
  )
}

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const authenticated = isAuthenticated()
  const user = getUser()

  useEffect(() => {
    if (!authenticated) {
      redirectToLogin()
    }
  }, [authenticated])

  if (!authenticated) {
    return <CenteredMessage>{null}</CenteredMessage>
  }

  if (!isPlatformAdmin(user)) {
    return <AccessDenied />
  }

  return <>{children}</>
}
