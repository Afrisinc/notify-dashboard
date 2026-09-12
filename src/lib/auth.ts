import { AUTH_UI_URL } from '@/lib/env'

const TOKEN_KEY = 'notify_admin_token'
const USER_KEY = 'notify_admin_user'
const DEFAULT_AUTH_URL = 'https://auth.afrisinc.com/login'

export interface NotifyAdminUser {
  id: string
  email: string
  firstName?: string
  lastName?: string
  role?: string
}

/** Roles allowed into the Notify admin console - mirrors the gateway's and
 *  notify-service's own platform-admin restriction on these endpoints.
 *  These are platform-staff roles (see platform-frontend's `ControlRole` /
 *  `PLATFORM_WIDE_ROLES`), not per-account roles like the account-owner
 *  "OWNER" - this console is for Afrisinc staff managing notify service-wide,
 *  not for a customer administering their own notify account. */
export const PLATFORM_ADMIN_ROLES = ['SUPER_ADMIN', 'OPS_MANAGER']

export function isPlatformAdmin(user: NotifyAdminUser | null): boolean {
  return Boolean(user?.role && PLATFORM_ADMIN_ROLES.includes(user.role.toUpperCase()))
}

/** Stricter than `isPlatformAdmin` - excludes OPS_MANAGER. Use for features
 *  that reach shared infrastructure directly (e.g. mail server aliases),
 *  mirroring the notify-service's own `requireSuperAdmin` on those routes. */
export function isSuperAdmin(user: NotifyAdminUser | null): boolean {
  return user?.role?.toUpperCase() === 'SUPER_ADMIN'
}

export function storeSession(token: string, user: NotifyAdminUser): void {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getUser(): NotifyAdminUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as NotifyAdminUser) : null
  } catch {
    return null
  }
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function redirectToLogin(): void {
  const loginUrl = AUTH_UI_URL || DEFAULT_AUTH_URL
  globalThis.location.replace(loginUrl)
}

export function logout(): void {
  clearSession()
  // Redirect disabled - reload page to show auth required screen
  globalThis.location.reload()
}

/** Decode JWT payload without a library. Returns null if malformed. */
export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payloadB64 = token.split('.')[1]
    const decoded = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token)
  if (!payload) return true
  if (typeof payload.exp !== 'number') return false
  return Date.now() >= payload.exp * 1000
}

export function isAuthenticated(): boolean {
  const token = getToken()
  return Boolean(token) && !isTokenExpired(token!)
}

/** Build a NotifyAdminUser from a decoded JWT payload. */
export function userFromPayload(payload: Record<string, unknown>): NotifyAdminUser | null {
  const id = String(payload.user_id ?? payload.sub ?? payload.id ?? '')
  const email = String(payload.email ?? payload.username ?? '')
  if (!id || !email) return null
  return {
    id,
    email,
    firstName: payload.firstName ? String(payload.firstName) : undefined,
    lastName: payload.lastName ? String(payload.lastName) : undefined,
    role: payload.role ? String(payload.role) : undefined,
  }
}

/** Display name: "John Doe" or "john@example.com" fallback. */
export function displayName(user: NotifyAdminUser): string {
  const full = [user.firstName, user.lastName].filter(Boolean).join(' ')
  return full || user.email
}

/** Initials for avatar: "JD" or first char of email. */
export function initials(user: NotifyAdminUser): string {
  if (user.firstName || user.lastName) {
    return [user.firstName?.[0], user.lastName?.[0]].filter(Boolean).join('').toUpperCase()
  }
  return user.email[0].toUpperCase()
}
