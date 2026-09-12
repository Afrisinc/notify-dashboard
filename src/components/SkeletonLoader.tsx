/**
 * Reusable Skeleton Loaders
 * Consistent loading states across the application
 */

interface SkeletonLineProps {
  width?: string | number
  height?: number
  marginBottom?: number
  borderRadius?: number
}

export function SkeletonLine({ width = '100%', height = 14, marginBottom = 0, borderRadius = 4 }: SkeletonLineProps) {
  return (
    <div
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: `${height}px`,
        borderRadius: `${borderRadius}px`,
        background: 'linear-gradient(90deg, hsl(224,14%,16%) 25%, hsl(224,14%,20%) 50%, hsl(224,14%,16%) 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-loading 1.5s infinite',
        marginBottom: marginBottom ? `${marginBottom}px` : 0,
      }}
    />
  )
}

interface SkeletonCardProps {
  lines?: number
  title?: boolean
  subtitle?: boolean
}

export function SkeletonCard({ lines = 3, title = false, subtitle = false }: SkeletonCardProps) {
  return (
    <div
      style={{
        background: 'hsl(224,18%,8%)',
        border: '1px solid hsl(224,14%,14%)',
        borderRadius: 12,
        padding: '20px 24px',
        animation: 'skeleton-pulse 2s ease-in-out infinite',
      }}
    >
      {title && (
        <>
          <SkeletonLine width={150} height={18} marginBottom={8} />
          <SkeletonLine width={200} height={12} marginBottom={16} />
        </>
      )}

      {subtitle && <SkeletonLine width={80} height={12} marginBottom={12} />}

      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine
          key={i}
          width={Math.random() > 0.3 ? '100%' : '80%'}
          height={12}
          marginBottom={i < lines - 1 ? 8 : 0}
        />
      ))}
    </div>
  )
}

interface SkeletonClientRowProps {
  showOrganizations?: boolean
}

export function SkeletonClientRow({ showOrganizations = true }: SkeletonClientRowProps) {
  return (
    <div
      style={{
        padding: '16px 20px',
        borderBottom: '1px solid hsl(224,14%,14%)',
        animation: 'skeleton-pulse 2s ease-in-out infinite',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 8, background: 'hsl(224,14%,16%)' }} />
        <div style={{ flex: 1 }}>
          <SkeletonLine width={150} height={14} marginBottom={6} />
          <SkeletonLine width={200} height={12} />
        </div>
        <div style={{ width: 100 }}>
          <SkeletonLine width={80} height={14} marginBottom={6} />
          <SkeletonLine width={100} height={12} />
        </div>
      </div>

      {/* Organizations */}
      {showOrganizations && (
        <div style={{ marginLeft: 56, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <SkeletonLine width={80} height={12} />
              <SkeletonLine width={60} height={12} />
              <SkeletonLine width={40} height={12} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function SkeletonNotificationRow() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.2fr 1.5fr 80px 1fr 90px 70px',
        padding: '13px 20px',
        borderBottom: '1px solid hsl(224,14%,11%)',
        alignItems: 'center',
        animation: 'skeleton-pulse 2s ease-in-out infinite',
      }}
    >
      <SkeletonLine width={60} height={12} />
      <SkeletonLine width={100} height={12} />
      <div>
        <SkeletonLine width={140} height={12} marginBottom={6} />
        <SkeletonLine width={80} height={10} />
      </div>
      <SkeletonLine width={50} height={12} />
      <SkeletonLine width={70} height={18} borderRadius={9999} />
      <SkeletonLine width={40} height={12} />
      <SkeletonLine width={60} height={12} />
    </div>
  )
}

export function SkeletonTemplateCard() {
  return (
    <div
      style={{
        background: 'hsl(224,18%,8%)',
        border: '1px solid hsl(224,14%,14%)',
        borderRadius: 12,
        padding: '20px',
        animation: 'skeleton-pulse 2s ease-in-out infinite',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ width: 38, height: 38, borderRadius: 9, background: 'hsl(224,14%,16%)' }} />
        <SkeletonLine width={50} height={18} borderRadius={9999} />
      </div>
      <SkeletonLine width={120} height={14} marginBottom={8} />
      <SkeletonLine width={80} height={12} marginBottom={14} />
      <SkeletonLine width={70} height={18} borderRadius={9999} marginBottom={14} />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: 12,
          borderTop: '1px solid hsl(224,14%,13%)',
        }}
      >
        <SkeletonLine width={60} height={12} />
        <SkeletonLine width={80} height={12} />
      </div>
    </div>
  )
}

export function ChartSkeleton({ height }: { height: number }) {
  return (
    <div style={{ height, display: 'flex', alignItems: 'flex-end', gap: 12, padding: '0 4px' }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonLine key={i} width="100%" height={Math.random() * (height - 40) + 40} />
      ))}
    </div>
  )
}

export function SkeletonStatCard() {
  return (
    <div
      className="card-padding"
      style={{
        background: 'hsl(224,18%,8%)',
        border: '1px solid hsl(224,14%,14%)',
        borderRadius: 12,
        animation: 'skeleton-pulse 2s ease-in-out infinite',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ width: 38, height: 38, borderRadius: 9, background: 'hsl(224,14%,16%)' }} />
        <SkeletonLine width={50} height={20} borderRadius={9999} />
      </div>
      <SkeletonLine width={70} height={26} marginBottom={8} />
      <SkeletonLine width={110} height={13} marginBottom={6} />
      <SkeletonLine width={90} height={12} />
    </div>
  )
}

export function SkeletonTableHeader() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr 1fr 1fr 0.8fr',
        gap: 16,
        padding: '16px 20px',
        borderBottom: '1px solid hsl(224,14%,14%)',
        background: 'hsl(224,18%,10%)',
      }}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <SkeletonLine key={i} width={`${Math.random() * 60 + 60}%`} height={12} />
      ))}
    </div>
  )
}

export const skeletonStyles = `
  @keyframes skeleton-loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  @keyframes skeleton-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
`
