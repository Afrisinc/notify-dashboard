export function todayISODate(): string {
  return new Date().toISOString().slice(0, 10)
}

export function daysAgoISODate(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
}

export function formatRangeLabel(startISO?: string, endISO?: string): string {
  if (!startISO || !endISO) return ''
  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  return `${fmt(new Date(startISO))} – ${fmt(new Date(endISO))}`
}
