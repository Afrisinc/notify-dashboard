import { useState, useEffect } from 'react'
import Icon from '../../components/Icon'
import { C } from '../../design'
import { useClients } from '../../hooks'
import { SkeletonClientRow, SkeletonCard, skeletonStyles } from '../../components/SkeletonLoader'
import type { Client } from '../../types'

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
      {/* Client Header Row */}
      <div
        onClick={onToggle}
        style={{
          display: 'grid',
          gridTemplateColumns: '50px 1.5fr 1fr 0.8fr 0.8fr 0.8fr 80px',
          gap: 16,
          padding: '16px 20px',
          alignItems: 'center',
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'hsl(224,14%,13%)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = expanded ? 'hsl(224,14%,12%)' : 'transparent')}
      >
        {/* Expand Icon + Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Icon
            name={expanded ? 'chevronDown' : 'chevronRight'}
            size={16}
            color="hsl(215,15%,55%)"
            style={{ transition: 'transform 0.2s' }}
          />
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
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

        {/* Client Name & Email */}
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'hsl(210,20%,90%)', marginBottom: 2 }}>{client.name}</p>
          <p style={{ fontSize: 12, color: 'hsl(215,15%,55%)' }}>{client.email}</p>
        </div>

        {/* Total Organizations */}
        <div>
          <p style={{ fontSize: 12, color: 'hsl(215,15%,55%)', marginBottom: 2 }}>Organizations</p>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'hsl(210,20%,85%)' }}>{client.stats.totalOrganizations}</p>
        </div>

        {/* Messages Sent */}
        <div>
          <p style={{ fontSize: 12, color: 'hsl(215,15%,55%)', marginBottom: 2 }}>Sent</p>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'hsl(210,20%,85%)' }}>{stats.sent}</p>
        </div>

        {/* Templates */}
        <div>
          <p style={{ fontSize: 12, color: 'hsl(215,15%,55%)', marginBottom: 2 }}>Templates</p>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'hsl(210,20%,85%)' }}>{stats.templates}</p>
        </div>

        {/* Delivery Rate */}
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

        {/* Actions */}
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

      {/* Organizations Rows (Expanded) */}
      {expanded && (
        <div style={{ background: 'hsl(224,14%,10%)' }}>
          {client.organizations.length === 0 ? (
            <div style={{ padding: '12px 20px', marginLeft: 50, color: 'hsl(215,15%,50%)', fontSize: 12 }}>
              No organizations
            </div>
          ) : (
            client.organizations.map((org, idx) => (
              <div
                key={org.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '50px 1.5fr 1fr 0.8fr 0.8fr 0.8fr 80px',
                  gap: 16,
                  padding: '12px 20px 12px 70px',
                  borderTop: idx === 0 ? '1px solid hsl(224,14%,15%)' : 'none',
                  alignItems: 'center',
                  fontSize: 12,
                }}
              >
                {/* Org Icon */}
                <div style={{ color: 'hsl(215,15%,55%)' }}>
                  <Icon name="layers" size={14} color="hsl(215,15%,55%)" />
                </div>

                {/* Org Name & Role */}
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: 'hsl(210,20%,85%)', marginBottom: 2 }}>
                    {org.name}
                  </p>
                  <p style={{ fontSize: 11, color: 'hsl(215,15%,50%)' }}>Role: {org.role}</p>
                </div>

                {/* Plan */}
                <Badge label={getPlanDisplayName(org.plan)} colors={PLAN_COLORS[org.plan] || PLAN_COLORS.default} />

                {/* Sent */}
                <p style={{ fontSize: 12, fontWeight: 600, color: 'hsl(210,20%,85%)' }}>{org.sent}</p>

                {/* Templates */}
                <p style={{ fontSize: 12, fontWeight: 600, color: 'hsl(210,20%,85%)' }}>{org.templates}</p>

                {/* Status */}
                <Badge
                  label={getStatusDisplayName(org.status)}
                  colors={STATUS_COLORS[org.status] || STATUS_COLORS.default}
                />

                {/* Joined */}
                <p style={{ fontSize: 11, color: 'hsl(215,15%,50%)', textAlign: 'right' }}>{org.joined}</p>
              </div>
            ))
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

  useEffect(() => {
    setCurrentPage(1)
  }, [search])

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

  const clients = response?.data || []
  const meta = response?.meta || { total: 0, limit: 10, offset: 0 }
  const totalPages = Math.ceil(meta.total / limit)

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

      {/* Table */}
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
        {/* Table header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '50px 1.5fr 1fr 0.8fr 0.8fr 0.8fr 80px',
            gap: 16,
            padding: '12px 20px',
            borderBottom: '1px solid hsl(224,14%,12%)',
            background: 'hsl(224,14%,10%)',
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

        {/* Rows */}
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

      {/* Footer */}
      {!isLoading && clients.length > 0 && (
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
