import { useState, useEffect } from 'react'
import Icon from '../../components/Icon'
import { C } from '../../design'
import { useClients } from '../../hooks'

// Plan display name mapping from API to UI
const getPlanDisplayName = (apiPlan) => {
  const planMap = {
    FREE: 'Free',
    PAYG: 'Pay-as-you-go',
    STARTER: 'Pro',
    SCALE: 'Scale',
    ENTERPRISE: 'Enterprise',
  }
  return planMap[apiPlan] || apiPlan
}

// Status display name mapping
const getStatusDisplayName = (apiStatus) => {
  const statusMap = {
    active: 'active',
    trialing: 'trial',
    trial: 'trial',
    suspended: 'suspended',
  }
  return statusMap[apiStatus] || apiStatus
}

const PLAN_COLORS = {
  Enterprise: {
    bg: 'rgba(139,92,246,0.12)',
    border: 'rgba(139,92,246,0.25)',
    color: 'hsl(260,60%,65%)',
  },
  Pro: { bg: 'rgba(2,147,228,0.12)', border: 'rgba(2,147,228,0.25)', color: '#36A9EA' },
  Scale: { bg: 'rgba(2,147,228,0.12)', border: 'rgba(2,147,228,0.25)', color: '#36A9EA' },
  Free: {
    bg: 'rgba(100,116,139,0.12)',
    border: 'rgba(100,116,139,0.25)',
    color: 'hsl(215,15%,65%)',
  },
  default: {
    bg: 'rgba(100,116,139,0.12)',
    border: 'rgba(100,116,139,0.25)',
    color: 'hsl(215,15%,65%)',
  },
}
const STATUS_COLORS = {
  active: { bg: 'rgba(39,174,96,0.12)', border: 'rgba(39,174,96,0.25)', color: 'hsl(152,60%,50%)' },
  suspended: {
    bg: 'rgba(231,76,60,0.12)',
    border: 'rgba(231,76,60,0.25)',
    color: 'hsl(0,62%,60%)',
  },
  trial: { bg: 'rgba(243,156,18,0.12)', border: 'rgba(243,156,18,0.25)', color: 'hsl(38,92%,55%)' },
  default: { bg: 'rgba(100,116,139,0.12)', border: 'rgba(100,116,139,0.25)', color: 'hsl(215,15%,65%)' },
}

function Badge({ label, colors }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 9px',
        borderRadius: 9999,
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        fontSize: 11,
        fontWeight: 600,
        color: colors.color,
      }}
    >
      {label}
    </span>
  )
}

function ChannelTag({ ch }) {
  const icons = { email: 'mail', sms: 'sms', push: 'bell' }
  return (
    <div
      title={ch}
      style={{
        width: 22,
        height: 22,
        borderRadius: 5,
        background: 'hsl(224,14%,14%)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon name={icons[ch] || 'bell'} size={11} color="hsl(215,15%,60%)" />
    </div>
  )
}

// Map UI plan values to API plan values
const getApiPlan = (displayPlan) => {
  if (displayPlan === 'all') return undefined
  const planMap = {
    Free: 'FREE',
    'Pay-as-you-go': 'PAYG',
    Pro: 'STARTER',
    Scale: 'SCALE',
    Enterprise: 'ENTERPRISE',
  }
  return planMap[displayPlan]
}

// Map UI status values to API status values
const getApiStatus = (displayStatus) => {
  if (displayStatus === 'all') return undefined
  const statusMap = {
    active: 'active',
    suspended: 'suspended',
    trial: 'trial',
  }
  return statusMap[displayStatus]
}

export default function Clients() {
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selected, setSelected] = useState(null)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, planFilter, statusFilter])

  const limit = 10
  const offset = (currentPage - 1) * limit
  const apiPlan = getApiPlan(planFilter)
  const apiStatus = getApiStatus(statusFilter)

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
    plan: apiPlan,
    status: apiStatus,
  })

  console.log('Response data:', response)

  const clients = response?.data || []
  const meta = response?.meta || { total: 0, limit: 10, offset: 0 }
  const totalPages = Math.ceil(meta.total / limit)

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
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 28,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: 'hsl(210,20%,95%)',
              letterSpacing: '-0.02em',
              marginBottom: 4,
            }}
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
          }}
        >
          <Icon name="plus" size={15} color="#fff" />
          Add Client
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
          <div style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }}>
            <Icon name="search" size={14} color="hsl(215,15%,50%)" />
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients..."
            style={{
              width: '100%',
              background: 'hsl(224,14%,10%)',
              border: `1px solid hsl(224,14%,16%)`,
              borderRadius: 8,
              padding: '8px 12px 8px 34px',
              fontSize: 13,
              color: 'hsl(210,20%,85%)',
              fontFamily: 'Manrope, sans-serif',
              outline: 'none',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'rgba(2,147,228,0.4)')}
            onBlur={(e) => (e.target.style.borderColor = 'hsl(224,14%,16%)')}
          />
        </div>
        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
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
          <option value="all">All Plans</option>
          <option value="Free">Free</option>
          <option value="Pro">Pro</option>
          <option value="Scale">Scale</option>
          <option value="Enterprise">Enterprise</option>
          <option value="Pay-as-you-go">Pay-as-you-go</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
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
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="trial">Trial</option>
        </select>
      </div>

      {/* Table */}
      <div
        style={{
          background: 'hsl(224,18%,8%)',
          border: `1px solid hsl(224,14%,14%)`,
          borderRadius: 12,
          overflow: 'hidden',
          position: 'relative',
          minHeight: 300,
        }}
      >
        {/* Table header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 0.8fr 0.8fr 1fr 0.8fr 0.8fr 1fr 120px',
            gap: 0,
            padding: '12px 20px',
            borderBottom: `1px solid hsl(224,14%,12%)`,
            background: 'hsl(224,14%,10%)',
          }}
        >
          {['Client', 'Plan', 'Sent', 'Delivery', 'Templates', 'Channels', 'Status', 'Joined', 'Actions'].map((h) => (
            <div
              key={h}
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: 'hsl(215,15%,50%)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              {h}
            </div>
          ))}
        </div>
        {/* Rows */}
        {clients.map((c, i) => {
          const displayPlan = getPlanDisplayName(c.plan)
          const displayStatus = getStatusDisplayName(c.status)
          return (
            <div
              key={c.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 0.8fr 0.8fr 1fr 0.8fr 0.8fr 1fr 120px',
                gap: 0,
                padding: '14px 20px',
                borderBottom: i < clients.length - 1 ? `1px solid hsl(224,14%,11%)` : 'none',
                alignItems: 'center',
                transition: 'background 0.15s',
                cursor: 'pointer',
                opacity: isFetching ? 0.6 : 1,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'hsl(224,14%,10%)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              onClick={() => setSelected(selected === c.id ? null : c.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 9,
                    background: `hsl(${(c.id * 47) % 360},40%,18%)`,
                    border: `1px solid hsl(${(c.id * 47) % 360},30%,25%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: `hsl(${(c.id * 47) % 360},60%,65%)`,
                    }}
                  >
                    {c.name[0]}
                  </span>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'hsl(210,20%,90%)',
                      marginBottom: 2,
                    }}
                  >
                    {c.name}
                  </p>
                  <p style={{ fontSize: 12, color: 'hsl(215,15%,50%)' }}>{c.email}</p>
                </div>
              </div>
              <div>
                <Badge label={displayPlan} colors={PLAN_COLORS[displayPlan] || PLAN_COLORS.default} />
              </div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'hsl(210,20%,85%)' }}>{c.sent}</p>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color:
                    parseFloat(c.deliveryRate) >= 99
                      ? C.success
                      : parseFloat(c.deliveryRate) >= 97
                        ? C.warning
                        : C.destructive,
                }}
              >
                {c.deliveryRate}
              </p>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'hsl(210,20%,85%)' }}>{c.templates}</p>
              <div style={{ display: 'flex', gap: 4 }}>
                {c.channels.map((ch) => (
                  <ChannelTag key={ch} ch={ch} />
                ))}
              </div>
              <div>
                <Badge label={displayStatus} colors={STATUS_COLORS[displayStatus] || STATUS_COLORS.default} />
              </div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'hsl(215,15%,65%)' }}>{c.joined}</p>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  title="View"
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: 'hsl(224,14%,13%)',
                    border: `1px solid hsl(224,14%,18%)`,
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
                  title="Edit"
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: 'hsl(224,14%,13%)',
                    border: `1px solid hsl(224,14%,18%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(2,147,228,0.35)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'hsl(224,14%,18%)')}
                >
                  <Icon name="edit" size={13} color="hsl(215,15%,55%)" />
                </button>
                <button
                  title="More"
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: 'hsl(224,14%,13%)',
                    border: `1px solid hsl(224,14%,18%)`,
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
          )
        })}
        {clients.length === 0 && !isLoading && (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <Icon name="search" size={32} color="hsl(215,15%,35%)" />
            <p style={{ color: 'hsl(215,15%,50%)', marginTop: 12, fontSize: 14 }}>No clients match your filters</p>
          </div>
        )}
        {isLoading && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 12,
              backdropFilter: 'blur(2px)',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  border: '3px solid hsl(215,15%,30%)',
                  borderTopColor: '#36A9EA',
                  margin: '0 auto 12px',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              <p style={{ color: 'hsl(215,15%,50%)', fontSize: 14 }}>Loading clients...</p>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 16,
        }}
      >
        <p style={{ fontSize: 13, color: 'hsl(215,15%,50%)' }}>
          Showing {Math.min(meta.offset + clients.length, meta.total)} of {meta.total} clients
        </p>
        <div style={{ display: 'flex', gap: 6 }}>
          {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
            const pageNum = Math.max(1, currentPage - 1) + i
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
    </div>
  )
}
