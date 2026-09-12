import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../../components/Icon'
import { C } from '../../design'
import { useClients, useClientStats } from '../../hooks'
import { SkeletonClientRow, SkeletonLine, skeletonStyles } from '../../components/SkeletonLoader'
import { todayISODate, daysAgoISODate, formatRangeLabel } from '../../lib/date-range'
import type { Client, AnalyticsPeriod } from '../../types'

const PERIOD_OPTIONS: { value: AnalyticsPeriod; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: '7d', label: 'This Week' },
  { value: '30d', label: 'This Month' },
  { value: '90d', label: 'Last 3 Months' },
  { value: '6m', label: 'Last 6 Months' },
  { value: 'custom', label: 'Custom Range' },
]

const getPlanDisplayName = (plan: string) => {
  const planMap: Record<string, string> = {
    FREE: 'Free',
    PAYG: 'Pay-as-you-go',
    STARTER: 'Starter',
    SCALE: 'Scale',
    ENTERPRISE: 'Enterprise',
    PRO: 'Pro',
  }
  return planMap[plan] || plan
}

const getStatusDisplayName = (status: string) => {
  const statusMap: Record<string, string> = {
    active: 'Active',
    trial: 'Trial',
    suspended: 'Suspended',
  }
  return statusMap[status] || status
}

const PLAN_COLORS: Record<string, { bg: string; border: string; color: string }> = {
  ENTERPRISE: { bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.25)', color: 'hsl(260,60%,65%)' },
  PRO: { bg: 'rgba(2,147,228,0.12)', border: 'rgba(2,147,228,0.25)', color: '#36A9EA' },
  SCALE: { bg: 'rgba(2,147,228,0.12)', border: 'rgba(2,147,228,0.25)', color: '#36A9EA' },
  STARTER: { bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.25)', color: 'hsl(260,60%,65%)' },
  PAYG: { bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.25)', color: 'hsl(217,92%,65%)' },
  FREE: { bg: 'rgba(100,116,139,0.12)', border: 'rgba(100,116,139,0.25)', color: 'hsl(215,15%,65%)' },
  default: { bg: 'rgba(100,116,139,0.12)', border: 'rgba(100,116,139,0.25)', color: 'hsl(215,15%,65%)' },
}

const STATUS_COLORS: Record<string, { bg: string; border: string; color: string }> = {
  active: { bg: 'rgba(39,174,96,0.12)', border: 'rgba(39,174,96,0.25)', color: 'hsl(152,60%,50%)' },
  suspended: { bg: 'rgba(231,76,60,0.12)', border: 'rgba(231,76,60,0.25)', color: 'hsl(0,62%,60%)' },
  trial: { bg: 'rgba(243,156,18,0.12)', border: 'rgba(243,156,18,0.25)', color: 'hsl(38,92%,55%)' },
  default: { bg: 'rgba(100,116,139,0.12)', border: 'rgba(100,116,139,0.25)', color: 'hsl(215,15%,65%)' },
}

function Badge({ label, colors }: { label: string; colors: Record<string, string> }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 10px',
        borderRadius: 6,
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        fontSize: 12,
        fontWeight: 600,
        color: colors.color,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}

function ClientRow({
  client,
  expanded,
  onToggle,
  isFetching,
}: {
  client: Client
  expanded: boolean
  onToggle: () => void
  isFetching: boolean
}) {
  const navigate = useNavigate()
  const initials = client.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const stats = client.stats.aggregatedStats

  return (
    <div
      style={{
        borderBottom: '1px solid hsl(224,14%,14%)',
        background: expanded ? 'hsl(224,14%,12%)' : 'transparent',
        opacity: isFetching ? 0.6 : 1,
      }}
    >
      <div
        onClick={onToggle}
        style={{
          display: 'grid',
          gridTemplateColumns: '50px 1.5fr 1fr 0.8fr 0.8fr 0.8fr 80px',
          gap: 32,
          padding: '16px 20px',
          alignItems: 'center',
          cursor: 'pointer',
          transition: 'all 0.15s',
          minWidth: 700,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'hsl(224,14%,13%)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = expanded ? 'hsl(224,14%,12%)' : 'transparent')}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ transition: 'transform 0.2s' }}>
            <Icon name={expanded ? 'chevronDown' : 'chevronRight'} size={16} color="hsl(215,15%,55%)" />
          </div>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: `hsl(${(client.id.charCodeAt(0) * 47) % 360},40%,18%)`,
              border: `1px solid hsl(${(client.id.charCodeAt(0) * 47) % 360},30%,25%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span
              style={{ fontSize: 12, fontWeight: 700, color: `hsl(${(client.id.charCodeAt(0) * 47) % 360},60%,65%)` }}
            >
              {initials}
            </span>
          </div>
        </div>

        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'hsl(210,20%,90%)', marginBottom: 2 }}>{client.name}</p>
          <p style={{ fontSize: 12, color: 'hsl(215,15%,55%)' }}>{client.email}</p>
        </div>

        <div>
          <p style={{ fontSize: 12, color: 'hsl(215,15%,55%)', marginBottom: 2 }}>Organizations</p>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'hsl(210,20%,85%)' }}>{client.stats.totalOrganizations}</p>
        </div>

        <div>
          <p style={{ fontSize: 12, color: 'hsl(215,15%,55%)', marginBottom: 2 }}>Sent</p>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'hsl(210,20%,85%)' }}>{stats.sent}</p>
        </div>

        <div>
          <p style={{ fontSize: 12, color: 'hsl(215,15%,55%)', marginBottom: 2 }}>Templates</p>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'hsl(210,20%,85%)' }}>{stats.templates}</p>
        </div>

        <div>
          <p style={{ fontSize: 12, color: 'hsl(215,15%,55%)', marginBottom: 2 }}>Delivery</p>
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: Number.parseFloat(stats.deliveryRate) > 0 ? C.success : 'hsl(215,15%,65%)',
            }}
          >
            {stats.deliveryRate}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
          <button
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: 'hsl(224,14%,13%)',
              border: '1px solid hsl(224,14%,18%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(2,147,228,0.35)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'hsl(224,14%,18%)')}
          >
            <Icon name="eye" size={13} color="hsl(215,15%,55%)" />
          </button>
          <button
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: 'hsl(224,14%,13%)',
              border: '1px solid hsl(224,14%,18%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(2,147,228,0.35)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'hsl(224,14%,18%)')}
          >
            <Icon name="moreH" size={13} color="hsl(215,15%,55%)" />
          </button>
        </div>
      </div>

      {expanded && (
        <div style={{ background: 'hsl(224,14%,10%)' }}>
          {client.organizations.length === 0 ? (
            <div style={{ padding: '12px 20px', marginLeft: 50, color: 'hsl(215,15%,50%)', fontSize: 12 }}>
              No organizations
            </div>
          ) : (
            client.organizations.map((org, idx) => {
              const canViewApps = !!org.organizationId
              return (
                <div
                  key={org.id}
                  onClick={() => {
                    if (canViewApps) {
                      navigate(`/organizations/${org.organizationId}/apps?orgName=${encodeURIComponent(org.name)}`)
                    }
                  }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '50px 1.5fr 1fr 0.8fr 0.8fr 0.8fr 80px',
                    gap: 32,
                    padding: '12px 20px 12px 70px',
                    borderTop: idx === 0 ? '1px solid hsl(224,14%,15%)' : 'none',
                    alignItems: 'center',
                    fontSize: 12,
                    minWidth: 700,
                    cursor: canViewApps ? 'pointer' : 'default',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => canViewApps && (e.currentTarget.style.background = 'hsl(224,14%,13%)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ color: 'hsl(215,15%,55%)' }}>
                    <Icon name="layers" size={14} color="hsl(215,15%,55%)" />
                  </div>

                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'hsl(210,20%,85%)', marginBottom: 2 }}>
                      {org.name}
                    </p>
                    <p style={{ fontSize: 11, color: 'hsl(215,15%,50%)' }}>Role: {org.role}</p>
                  </div>

                  <Badge label={getPlanDisplayName(org.plan)} colors={PLAN_COLORS[org.plan] || PLAN_COLORS.default} />

                  <p style={{ fontSize: 12, fontWeight: 600, color: 'hsl(210,20%,85%)' }}>{org.sent}</p>

                  <p style={{ fontSize: 12, fontWeight: 600, color: 'hsl(210,20%,85%)' }}>{org.templates}</p>

                  <Badge
                    label={getStatusDisplayName(org.status)}
                    colors={STATUS_COLORS[org.status] || STATUS_COLORS.default}
                  />

                  {canViewApps ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                      <span style={{ fontSize: 11, color: '#36A9EA', fontWeight: 600 }}>Apps</span>
                      <span style={{ display: 'inline-flex', transform: 'rotate(-90deg)' }}>
                        <Icon name="chevronDown" size={12} color="#36A9EA" />
                      </span>
                    </div>
                  ) : (
                    <p style={{ fontSize: 11, color: 'hsl(215,15%,50%)', textAlign: 'right' }}>{org.joined}</p>
                  )}
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}

export default function Clients() {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedClients, setExpandedClients] = useState<Set<string>>(new Set())

  // Defaults to the same range as the Analytics page
  const [period, setPeriod] = useState<AnalyticsPeriod>('90d')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')

  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  const handlePeriodChange = (next: AnalyticsPeriod) => {
    if (next === 'custom' && !customFrom && !customTo) {
      setCustomFrom(daysAgoISODate(90))
      setCustomTo(todayISODate())
    }
    setPeriod(next)
  }

  const isCustomRangeValid = period !== 'custom' || (!!customFrom && !!customTo && customFrom <= customTo)

  const statsParams = period === 'custom' ? { period, dateFrom: customFrom, dateTo: customTo } : { period }

  const limit = 10
  const offset = (currentPage - 1) * limit

  const {
    data: response,
    isLoading,
    isError,
    error,
    isFetching,
  } = useClients({
    limit,
    offset,
    search: search || undefined,
  })

  const { data: stats, isLoading: statsLoading } = useClientStats(statsParams, isCustomRangeValid)

  const clients = response?.data || []
  const meta = response?.meta || { total: 0, limit: 10, offset: 0 }
  const totalPages = Math.ceil(meta.total / limit)
  const rangeLabel = formatRangeLabel(stats?.rangeStart, stats?.rangeEnd)

  const toggleClient = (clientId: string) => {
    const newExpanded = new Set(expandedClients)
    if (newExpanded.has(clientId)) {
      newExpanded.delete(clientId)
    } else {
      newExpanded.add(clientId)
    }
    setExpandedClients(newExpanded)
  }

  if (isError) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <p style={{ color: 'hsl(0,62%,60%)', fontSize: 14 }}>
          Error loading clients: {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    )
  }

  return (
    <div>
      <style>{skeletonStyles}</style>

      <div className="responsive-header" style={{ marginBottom: 28 }}>
        <div>
          <h1
            className="page-title"
            style={{ fontWeight: 700, color: 'hsl(210,20%,95%)', letterSpacing: '-0.02em', marginBottom: 4 }}
          >
            Clients
          </h1>
          <p style={{ fontSize: 14, color: 'hsl(215,15%,55%)' }}>{meta.total} clients registered on the platform</p>
        </div>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '9px 18px',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            background: C.primary,
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(2,147,228,0.3)',
            transition: 'all 0.15s',
            whiteSpace: 'nowrap',
          }}
        >
          <Icon name="plus" size={15} color="#fff" />
          Add Client
        </button>
      </div>

      {/* Date range - governs the analytics cards below */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'hsl(215,15%,55%)', whiteSpace: 'nowrap' }}>
          Date Range
        </span>
        <select
          value={period}
          onChange={(e) => handlePeriodChange(e.target.value as AnalyticsPeriod)}
          style={{
            background: 'hsl(224,14%,10%)',
            border: `1px solid hsl(224,14%,16%)`,
            borderRadius: 8,
            padding: '8px 12px',
            fontSize: 13,
            color: 'hsl(210,20%,85%)',
            fontFamily: 'Manrope, sans-serif',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          {PERIOD_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {period === 'custom' && (
          <>
            <input
              type="date"
              value={customFrom}
              max={customTo || undefined}
              onChange={(e) => setCustomFrom(e.target.value)}
              style={{
                background: 'hsl(224,14%,10%)',
                border: `1px solid ${isCustomRangeValid ? 'hsl(224,14%,16%)' : 'rgba(231,76,60,0.5)'}`,
                borderRadius: 8,
                padding: '7px 10px',
                fontSize: 13,
                color: 'hsl(210,20%,85%)',
                fontFamily: 'Manrope, sans-serif',
                outline: 'none',
                colorScheme: 'dark',
              }}
            />
            <span style={{ fontSize: 12, color: 'hsl(215,15%,50%)' }}>to</span>
            <input
              type="date"
              value={customTo}
              min={customFrom || undefined}
              onChange={(e) => setCustomTo(e.target.value)}
              style={{
                background: 'hsl(224,14%,10%)',
                border: `1px solid ${isCustomRangeValid ? 'hsl(224,14%,16%)' : 'rgba(231,76,60,0.5)'}`,
                borderRadius: 8,
                padding: '7px 10px',
                fontSize: 13,
                color: 'hsl(210,20%,85%)',
                fontFamily: 'Manrope, sans-serif',
                outline: 'none',
                colorScheme: 'dark',
              }}
            />
          </>
        )}

        {period === 'custom' && !isCustomRangeValid && (
          <span style={{ fontSize: 12, color: 'hsl(0,62%,60%)' }}>Select a valid start and end date</span>
        )}

        {isCustomRangeValid && rangeLabel && (
          <span style={{ fontSize: 12, color: 'hsl(215,15%,45%)' }}>{rangeLabel}</span>
        )}
      </div>

      {/* Analytics cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Active Clients', value: stats?.activeClients?.toString(), kpi: undefined },
          { label: 'New Clients', value: stats?.newClients.value, kpi: stats?.newClients },
          { label: 'Total Sent', value: stats?.totalSent.value, kpi: stats?.totalSent },
          { label: 'Avg Delivery Rate', value: stats?.avgDeliveryRate.value, kpi: stats?.avgDeliveryRate },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: 'hsl(224,18%,8%)',
              border: `1px solid hsl(224,14%,14%)`,
              borderRadius: 12,
              padding: '18px 20px',
            }}
          >
            {statsLoading || !stats ? (
              <>
                <SkeletonLine width={70} height={24} marginBottom={6} />
                <SkeletonLine width={100} height={13} />
              </>
            ) : (
              <>
                <p
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: 'hsl(210,20%,92%)',
                    letterSpacing: '-0.02em',
                    marginBottom: 4,
                  }}
                >
                  {s.value}
                </p>
                <p style={{ fontSize: 12, color: 'hsl(215,15%,55%)', marginBottom: s.kpi ? 6 : 0 }}>{s.label}</p>
                {s.kpi && (
                  <p style={{ fontSize: 11, color: s.kpi.deltaUp ? C.success : C.destructive, fontWeight: 600 }}>
                    {s.kpi.delta}
                  </p>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <div className="responsive-filters" style={{ marginBottom: 20 }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <div style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }}>
            <Icon name="search" size={14} color="hsl(215,15%,50%)" />
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            style={{
              width: '100%',
              background: 'hsl(224,14%,10%)',
              border: '1px solid hsl(224,14%,16%)',
              borderRadius: 8,
              padding: '8px 12px 8px 34px',
              fontSize: 13,
              color: 'hsl(210,20%,85%)',
              fontFamily: 'Manrope, sans-serif',
              outline: 'none',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(2,147,228,0.4)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'hsl(224,14%,16%)')}
          />
        </div>
      </div>

      <div
        style={{
          background: 'hsl(224,18%,8%)',
          border: '1px solid hsl(224,14%,14%)',
          borderRadius: 12,
          overflow: 'hidden',
          position: 'relative',
          minHeight: 300,
        }}
      >
        <div className="responsive-table-wrapper">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '50px 1.5fr 1fr 0.8fr 0.8fr 0.8fr 80px',
              gap: 32,
              padding: '12px 20px',
              borderBottom: '1px solid hsl(224,14%,12%)',
              background: 'hsl(224,14%,10%)',
              minWidth: 700,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 600, color: 'hsl(215,15%,50%)', textTransform: 'uppercase' }}></div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'hsl(215,15%,50%)', textTransform: 'uppercase' }}>
              Client
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'hsl(215,15%,50%)', textTransform: 'uppercase' }}>
              Organizations
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'hsl(215,15%,50%)', textTransform: 'uppercase' }}>
              Sent
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'hsl(215,15%,50%)', textTransform: 'uppercase' }}>
              Templates
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'hsl(215,15%,50%)', textTransform: 'uppercase' }}>
              Delivery
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'hsl(215,15%,50%)', textTransform: 'uppercase' }}>
              Actions
            </div>
          </div>

          {clients.map((client) => (
            <ClientRow
              key={client.id}
              client={client}
              expanded={expandedClients.has(client.id)}
              onToggle={() => toggleClient(client.id)}
              isFetching={isFetching}
            />
          ))}

          {clients.length === 0 && !isLoading && (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <Icon name="search" size={32} color="hsl(215,15%,35%)" />
              <p style={{ color: 'hsl(215,15%,50%)', marginTop: 12, fontSize: 14 }}>
                {search ? 'No clients match your search' : 'No clients found'}
              </p>
            </div>
          )}

          {isLoading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {Array.from({ length: limit }).map((_, i) => (
                <SkeletonClientRow key={i} showOrganizations={true} />
              ))}
            </div>
          )}
        </div>
      </div>

      {!isLoading && clients.length > 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 16,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <p style={{ fontSize: 13, color: 'hsl(215,15%,50%)' }}>
            Showing {Math.min(meta.offset + clients.length, meta.total)} of {meta.total} clients
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = Math.max(1, currentPage - 2) + i
              return pageNum <= totalPages ? pageNum : null
            })
              .filter(Boolean)
              .map((p) => (
                <button
                  key={p}
                  disabled={isFetching}
                  onClick={() => {
                    setCurrentPage(p)
                    window.scrollTo(0, 0)
                  }}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 7,
                    background: p === currentPage ? 'rgba(2,147,228,0.15)' : 'hsl(224,14%,10%)',
                    border: `1px solid ${p === currentPage ? 'rgba(2,147,228,0.3)' : 'hsl(224,14%,16%)'}`,
                    color: p === currentPage ? '#36A9EA' : 'hsl(215,15%,55%)',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: isFetching ? 'not-allowed' : 'pointer',
                    opacity: isFetching ? 0.5 : 1,
                    transition: 'all 0.15s',
                  }}
                >
                  {p}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
