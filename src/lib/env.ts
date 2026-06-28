export function getEnv(key: string): string {
  if (typeof window !== 'undefined' && window.__ENV__) {
    const value = window.__ENV__[key]
    if (value && !value.startsWith('__')) {
      return value
    }
  }
  return import.meta.env[key] || ''
}

export const API_BASE_URL = getEnv('VITE_API_BASE_URL')
export const AUTH_UI_URL = getEnv('VITE_AUTH_UI_URL')
