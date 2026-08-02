import { useMemo, useState } from 'react'

interface RelativeTimeProps {
  readonly timestamp: string
  readonly showTooltip?: boolean
}

function getRelativeTime(timestamp: string): { label: string; fullDate: string; fullTime: string } {
  const date = new Date(timestamp)
  const now = new Date()

  // Get dates at start of day for comparison
  const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const nowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const diffTime = nowStart.getTime() - dateStart.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  // Format full date for tooltip
  const fullDate = date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })

  // Format full time for tooltip
  const fullTime = date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  // Determine label
  let label: string

  if (diffDays === 0) {
    label = 'Today'
  } else if (diffDays === 1) {
    label = 'Yesterday'
  } else if (diffDays < 7) {
    label = `${diffDays}d ago`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    label = weeks === 1 ? 'This week' : `${weeks}w ago`
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    label = months === 1 ? 'Last month' : `${months}m ago`
  } else {
    const years = Math.floor(diffDays / 365)
    label = `${years}y ago`
  }

  return { label, fullDate, fullTime }
}

export default function RelativeTime({ timestamp, showTooltip = true }: RelativeTimeProps) {
  const [showCustomTooltip, setShowCustomTooltip] = useState(false)
  const { label, fullDate, fullTime } = useMemo(() => getRelativeTime(timestamp), [timestamp])

  if (!showTooltip) {
    return <span style={{ fontSize: 11, color: 'hsl(215,15%,55%)' }}>{label}</span>
  }

  return (
    <span
      style={{
        fontSize: 11,
        color: 'hsl(215,15%,55%)',
        cursor: 'help',
        position: 'relative',
        borderBottom: '1px dotted hsl(215,15%,55%)',
      }}
      onMouseEnter={() => setShowCustomTooltip(true)}
      onMouseLeave={() => setShowCustomTooltip(false)}
    >
      {label}
      {showCustomTooltip && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: 8,
            background: 'hsl(224,18%,8%)',
            border: '1px solid hsl(224,14%,14%)',
            borderRadius: 6,
            padding: '8px 12px',
            fontSize: 11,
            color: 'hsl(210,20%,90%)',
            whiteSpace: 'nowrap',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            pointerEvents: 'none',
            animation: 'fadeIn 0.2s ease-in-out',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{fullDate}</div>
          <div style={{ color: 'hsl(215,15%,70%)', fontSize: 10 }}>{fullTime}</div>
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderTop: '4px solid hsl(224,14%,14%)',
            }}
          />
        </div>
      )}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </span>
  )
}
