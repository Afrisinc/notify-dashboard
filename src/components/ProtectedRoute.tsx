import { useEffect } from 'react'
import { isAuthenticated, redirectToLogin } from '@/lib/auth'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!isAuthenticated()) {
      redirectToLogin()
    }
  }, [])

  if (!isAuthenticated()) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'hsl(224,20%,4%)',
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: '3px solid rgba(2,147,228,0.2)',
            borderTopColor: '#0293E4',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return <>{children}</>
}
