import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { decodeJwtPayload, userFromPayload, storeSession } from '@/lib/auth'

/**
 * SsoCallbackPage — /sso/callback
 *
 * Receives the JWT forwarded by the platform after the user selects Notify:
 *   platform /select-product → click Notify
 *   → window.location = baseUrl + "/sso/callback?token=JWT"
 *   → decode JWT → store token + user → navigate to /admin/dashboard
 */
export default function SsoCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      setError('No token provided. Redirecting…')
      setTimeout(() => navigate('/', { replace: true }), 2000)
      return
    }

    const payload = decodeJwtPayload(token)

    if (!payload) {
      setError('Invalid token. Redirecting…')
      setTimeout(() => navigate('/', { replace: true }), 2000)
      return
    }

    const user = userFromPayload(payload)

    if (!user) {
      setError('Incomplete token payload. Redirecting…')
      setTimeout(() => navigate('/', { replace: true }), 2000)
      return
    }

    storeSession(token, user)
    navigate('/admin/dashboard', { replace: true })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
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
        <div style={{ textAlign: 'center', gap: 12, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
            <span style={{ color: 'hsl(0,62%,60%)', fontSize: 22, fontWeight: 700 }}>!</span>
          </div>
          <p style={{ fontSize: 14, color: 'hsl(215,15%,55%)' }}>{error}</p>
        </div>
      </div>
    )
  }

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
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: '3px solid rgba(2,147,228,0.2)',
            borderTopColor: '#0293E4',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <p style={{ fontSize: 14, color: 'hsl(215,15%,55%)' }}>Signing you in…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  )
}
