import { useState, useEffect, useCallback } from 'react'
import Icon from '../../components/Icon'
import type { LoginEvent, SecurityOverviewParams, LoginEventsParams } from '../../types/security.types'
import { securityService } from '../../services/security.service'

const skeletonStyles = `
  @keyframes skeleton-loading {
    0% { background-color: hsl(224,14%,15%); }
    50% { background-color: hsl(224,14%,18%); }
    100% { background-color: hsl(224,14%,15%); }
  }
  .skeleton { animation: skeleton-loading 1s infinite; }
`

interface MetricCardProps {
  readonly label: string
  readonly value: string | number
  readonly icon: string
  readonly color: string
  readonly subtitle?: string
}

function MetricCard({ label, value, icon, color, subtitle }: MetricCardProps) {
  return (
    <div
      style={{
        background: 'hsl(224,18%,8%)',
        border: '1px solid hsl(224,14%,14%)',
        borderRadius: 12,
        padding: 20,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: `${color}20`,
          border: `1px solid ${color}40`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon name={icon} size={18} color={color} />
      </div>
      <div>
        <p style={{ fontSize: 12, color: 'hsl(215,15%,55%)', marginBottom: 4 }}>{label}</p>
        <p style={{ fontWeight: 700, fontSize: 18, color: 'hsl(210,20%,95%)', marginBottom: subtitle ? 4 : 0 }}>
          {value}
        </p>
        {subtitle && <p style={{ fontSize: 11, color: 'hsl(215,15%,50%)' }}>{subtitle}</p>}
      </div>
    </div>
  )
}

interface AlertBannerProps {
  readonly type: 'warning' | 'success' | 'info' | 'error'
  readonly title: string
  readonly message: string
  readonly onRetry?: () => void
}

function AlertBanner({ type, title, message, onRetry }: AlertBannerProps) {
  const colors = {
    warning: {
      bg: 'rgba(243,156,18,0.12)',
      border: 'rgba(243,156,18,0.25)',
      color: 'hsl(38,92%,55%)',
      icon: 'zap',
    },
    success: {
      bg: 'rgba(39,174,96,0.12)',
      border: 'rgba(39,174,96,0.25)',
      color: 'hsl(152,60%,50%)',
      icon: 'check',
    },
    info: {
      bg: 'rgba(2,147,228,0.12)',
      border: 'rgba(2,147,228,0.25)',
      color: '#36A9EA',
      icon: 'shield',
    },
    error: {
      bg: 'rgba(231,76,60,0.12)',
      border: 'rgba(231,76,60,0.25)',
      color: 'hsl(0,62%,60%)',
      icon: 'x',
    },
  }

  const style = colors[type]

  return (
    <div
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        borderRadius: 8,
        padding: 16,
        display: 'flex',
        gap: 12,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}
    >
      <div style={{ display: 'flex', gap: 12, flex: 1 }}>
        <div style={{ flexShrink: 0, marginTop: 2 }}>
          <Icon name={style.icon} size={18} color={style.color} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: style.color, marginBottom: 2 }}>{title}</p>
          <p style={{ fontSize: 12, color: 'hsl(215,15%,60%)' }}>{message}</p>
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: '6px 12px',
            fontSize: 12,
            fontWeight: 600,
            color: style.color,
            background: 'transparent',
            border: `1px solid ${style.color}`,
            borderRadius: 6,
            cursor: 'pointer',
            transition: 'all 0.15s',
            whiteSpace: 'nowrap',
            marginLeft: 12,
            flexShrink: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Retry
        </button>
      )}
    </div>
  )
}

interface TabProps {
  readonly label: string
  readonly active: boolean
  readonly loading?: boolean
  readonly onClick: () => void
}

function Tab({ label, active, loading, onClick }: TabProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        padding: '10px 16px',
        fontSize: 13,
        fontWeight: 600,
        color: active ? '#36A9EA' : 'hsl(215,15%,55%)',
        background: 'transparent',
        border: 'none',
        borderBottom: active ? '2px solid #36A9EA' : '2px solid transparent',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s',
        opacity: loading ? 0.6 : 1,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      {label}
      {loading && <div className="skeleton" style={{ width: 14, height: 14, borderRadius: 2 }} />}
    </button>
  )
}

interface OverviewTabProps {
  readonly loading: boolean
  readonly onRetry: () => void
}

function OverviewTab({ loading, onRetry }: OverviewTabProps) {
  const [overviewData, setOverviewData] = useState<any>(null)
  const [error, setError] = useState('')

  const fetchData = useCallback(async () => {
    try {
      setError('')
      const params: SecurityOverviewParams = {
        range: '24h',
        limit: 5,
      }
      const response = await securityService.getOverview(params)

      // Validate response
      if (
        typeof response.failedLogins24h !== 'number' ||
        typeof response.tokenIssuanceCount !== 'number' ||
        !Array.isArray(response.topIPs)
      ) {
        throw new TypeError('Invalid response format from server')
      }

      setOverviewData(response)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load security overview'
      setError(errorMsg)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleRetry = useCallback(() => {
    fetchData()
  }, [fetchData])

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <AlertBanner type="error" title="Failed to Load" message={error} onRetry={handleRetry} />
      </div>
    )
  }

  if (loading || !overviewData) {
    return (
      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, padding: 24 }}
      >
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton" style={{ height: 120, borderRadius: 12 }} />
        ))}
      </div>
    )
  }

  return (
    <div style={{ padding: 24 }}>
      {overviewData.suspiciousActivity && (
        <AlertBanner
          type="warning"
          title="⚠️ Suspicious Activity Detected"
          message="Multiple failed login attempts detected from various IPs. Review the login events below for details."
        />
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 16,
          marginTop: overviewData.suspiciousActivity ? 20 : 0,
        }}
      >
        <MetricCard
          label="Failed Logins (24h)"
          value={overviewData.failedLogins24h}
          icon="x"
          color="hsl(0,62%,60%)"
          subtitle="Last 24 hours"
        />
        <MetricCard
          label="Tokens Issued"
          value={overviewData.tokenIssuanceCount}
          icon="send"
          color="#36A9EA"
          subtitle="Total active tokens"
        />
        <MetricCard
          label="Top Suspicious IP"
          value={overviewData.topIPs[0]?.ip || 'N/A'}
          icon="shield"
          color="hsl(38,92%,55%)"
          subtitle={overviewData.topIPs[0]?.attempts ? `${overviewData.topIPs[0].attempts} attempts` : 'No activity'}
        />
      </div>

      {overviewData.topIPs.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'hsl(210,20%,95%)', marginBottom: 16 }}>
            Top Suspicious IPs
          </h3>
          <div
            style={{
              background: 'hsl(224,18%,8%)',
              border: '1px solid hsl(224,14%,14%)',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 16,
                padding: '12px 20px',
                borderBottom: '1px solid hsl(224,14%,12%)',
                background: 'hsl(224,14%,10%)',
                minWidth: 0,
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: 'hsl(215,15%,50%)', textTransform: 'uppercase' }}>
                IP Address
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'hsl(215,15%,50%)', textTransform: 'uppercase' }}>
                Failed Attempts
              </div>
            </div>
            {overviewData.topIPs.map((ip: any, idx: number) => (
              <div
                key={`${ip.ip}-${idx}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 16,
                  padding: '12px 20px',
                  borderBottom: idx < overviewData.topIPs.length - 1 ? '1px solid hsl(224,14%,12%)' : 'none',
                  alignItems: 'center',
                  minWidth: 0,
                }}
              >
                <p
                  style={{
                    fontSize: 12,
                    color: 'hsl(210,20%,85%)',
                    fontFamily: 'monospace',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {ip.ip}
                </p>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'hsl(0,62%,60%)' }}>{ip.attempts}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface StatusBadgeProps {
  readonly status: 'success' | 'failed'
}

function StatusBadge({ status }: StatusBadgeProps) {
  const isSuccess = status === 'success'
  const backgroundColor = isSuccess ? 'rgba(39,174,96,0.12)' : 'rgba(231,76,60,0.12)'
  const borderColor = isSuccess ? '1px solid rgba(39,174,96,0.25)' : '1px solid rgba(231,76,60,0.25)'
  const textColor = isSuccess ? 'hsl(152,60%,50%)' : 'hsl(0,62%,60%)'
  const iconName = isSuccess ? 'check' : 'x'
  const label = isSuccess ? 'Success' : 'Failed'

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: 6,
        background: backgroundColor,
        border: borderColor,
        fontSize: 11,
        fontWeight: 600,
        color: textColor,
      }}
    >
      <Icon name={iconName} size={12} />
      {label}
    </span>
  )
}

interface EventsContentProps {
  readonly loading: boolean
  readonly events: LoginEvent[]
  readonly debouncedSearch: string
}

function EventsContent({ loading, events, debouncedSearch }: EventsContentProps) {
  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <div className="skeleton" style={{ height: 200, borderRadius: 8 }} />
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <Icon name="search" size={32} color="hsl(215,15%,35%)" />
        <p style={{ color: 'hsl(215,15%,50%)', marginTop: 12, fontSize: 14 }}>
          {debouncedSearch ? 'No events match your search' : 'No login events found'}
        </p>
      </div>
    )
  }

  return (
    <>
      {events.map((event) => (
        <EventRow key={event.id} event={event} />
      ))}
    </>
  )
}

interface EventRowProps {
  readonly event: LoginEvent
}

function EventRow({ event }: EventRowProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '120px 1.5fr 1.2fr 1fr 120px 100px 100px',
        gap: 16,
        padding: '12px 20px',
        borderBottom: '1px solid hsl(224,14%,12%)',
        alignItems: 'center',
        minWidth: 900,
      }}
    >
      <div>
        <StatusBadge status={event.status} />
      </div>
      <p
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: 'hsl(210,20%,85%)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {event.name || '—'}
      </p>
      <p
        style={{
          fontSize: 12,
          color: 'hsl(215,15%,55%)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {event.email}
      </p>
      <p
        style={{
          fontSize: 11,
          color: 'hsl(215,15%,55%)',
          fontFamily: 'monospace',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {event.ip}
      </p>
      <p
        style={{
          fontSize: 11,
          color: 'hsl(215,15%,55%)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {event.phone || '—'}
      </p>
      <p style={{ fontSize: 11, color: 'hsl(215,15%,55%)', whiteSpace: 'nowrap' }}>
        {new Date(event.createdAt).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </p>
      <p
        style={{
          fontSize: 11,
          color: event.reason ? 'hsl(0,62%,60%)' : 'hsl(215,15%,50%)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {event.reason || '—'}
      </p>
    </div>
  )
}

function LoginEventsTab() {
  const [events, setEvents] = useState<LoginEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 })
  const [error, setError] = useState('')

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  const fetchEvents = useCallback(async () => {
    if (loading) return

    setLoading(true)
    try {
      setError('')
      const params: LoginEventsParams = {
        page,
        limit: 10,
        search: debouncedSearch || undefined,
        sortBy: 'desc',
      }
      const response = await securityService.getLoginEvents(params)

      // Validate response
      if (!Array.isArray(response.data) || !response.pagination) {
        throw new TypeError('Invalid response format from server')
      }

      setEvents(response.data)
      setPagination(response.pagination)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load login events'
      setError(errorMsg)
      setEvents([])
    } finally {
      setLoading(false)
    }
  }, [page, debouncedSearch, loading])

  useEffect(() => {
    fetchEvents()
  }, [page, debouncedSearch])

  const handleRetry = useCallback(() => {
    fetchEvents()
  }, [fetchEvents])

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ position: 'relative', maxWidth: 400 }}>
          <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
            <Icon name="search" size={14} color="hsl(215,15%,50%)" />
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, or IP..."
            aria-label="Search login events"
            style={{
              width: '100%',
              background: 'hsl(224,14%,10%)',
              border: '1px solid hsl(224,14%,16%)',
              borderRadius: 8,
              padding: '10px 12px 10px 40px',
              fontSize: 13,
              color: 'hsl(210,20%,85%)',
              fontFamily: 'Manrope, sans-serif',
              outline: 'none',
              transition: 'border-color 0.15s',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(2,147,228,0.4)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'hsl(224,14%,16%)')}
          />
        </div>
      </div>

      {error && (
        <div style={{ marginBottom: 20 }}>
          <AlertBanner type="error" title="Failed to Load Events" message={error} onRetry={handleRetry} />
        </div>
      )}

      <div
        style={{
          background: 'hsl(224,18%,8%)',
          border: '1px solid hsl(224,14%,14%)',
          borderRadius: 12,
          overflow: 'hidden',
          minHeight: 300,
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '120px 1.5fr 1.2fr 1fr 120px 100px 100px',
              gap: 16,
              padding: '12px 20px',
              borderBottom: '1px solid hsl(224,14%,12%)',
              background: 'hsl(224,14%,10%)',
              minWidth: 900,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 600, color: 'hsl(215,15%,50%)', textTransform: 'uppercase' }}>
              Status
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'hsl(215,15%,50%)', textTransform: 'uppercase' }}>
              User
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'hsl(215,15%,50%)', textTransform: 'uppercase' }}>
              Email
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'hsl(215,15%,50%)', textTransform: 'uppercase' }}>
              IP Address
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'hsl(215,15%,50%)', textTransform: 'uppercase' }}>
              Phone
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'hsl(215,15%,50%)', textTransform: 'uppercase' }}>
              Time
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'hsl(215,15%,50%)', textTransform: 'uppercase' }}>
              Reason
            </div>
          </div>

          <EventsContent loading={loading} events={events} debouncedSearch={debouncedSearch} />
        </div>
      </div>

      {!loading && pagination.pages > 1 && (
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 16 }}>
          {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
            const pageNum = Math.max(1, pagination.page - 2) + i
            return pageNum <= pagination.pages ? pageNum : null
          })
            .filter(Boolean)
            .map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                disabled={loading}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 7,
                  background: p === pagination.page ? 'rgba(2,147,228,0.15)' : 'hsl(224,14%,10%)',
                  border: `1px solid ${p === pagination.page ? 'rgba(2,147,228,0.3)' : 'hsl(224,14%,16%)'}`,
                  color: p === pagination.page ? '#36A9EA' : 'hsl(215,15%,55%)',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1,
                  transition: 'all 0.15s',
                }}
              >
                {p}
              </button>
            ))}
        </div>
      )}
    </div>
  )
}

export default function Security() {
  const [activeTab, setActiveTab] = useState<'overview' | 'events'>('overview')
  const [overviewLoading, setOverviewLoading] = useState(false)

  const handleTabChange = (tab: 'overview' | 'events') => {
    setActiveTab(tab)
    if (tab === 'overview') {
      setOverviewLoading(true)
      setTimeout(() => setOverviewLoading(false), 500)
    }
  }

  return (
    <div>
      <style>{skeletonStyles}</style>

      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: 'hsl(210,20%,95%)',
            letterSpacing: '-0.02em',
            marginBottom: 8,
          }}
        >
          Security & Access
        </h1>
        <p style={{ fontSize: 14, color: 'hsl(215,15%,55%)' }}>
          Monitor login activity, detect suspicious behavior, and manage security events
        </p>
      </div>

      <div
        style={{
          background: 'hsl(224,18%,8%)',
          border: '1px solid hsl(224,14%,14%)',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid hsl(224,14%,12%)',
            background: 'hsl(224,14%,10%)',
            overflowX: 'auto',
          }}
        >
          <Tab
            label="Overview"
            active={activeTab === 'overview'}
            loading={overviewLoading}
            onClick={() => handleTabChange('overview')}
          />
          <Tab label="Login Events" active={activeTab === 'events'} onClick={() => handleTabChange('events')} />
        </div>

        {activeTab === 'overview' && (
          <OverviewTab loading={overviewLoading} onRetry={() => handleTabChange('overview')} />
        )}
        {activeTab === 'events' && <LoginEventsTab />}
      </div>
    </div>
  )
}
