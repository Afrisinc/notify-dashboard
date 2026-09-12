import { useState, useEffect } from 'react'
import Icon from '../../components/Icon'
import { C } from '../../design'
import { useTemplates, useTemplateStats } from '../../hooks'
import { SkeletonLine, SkeletonTemplateCard, skeletonStyles } from '../../components/SkeletonLoader'
import type { TemplateChannel, TemplateStatus } from '../../types'

const CHANNEL_COLORS: Record<string, { bg: string; border: string; color: string; icon: string }> = {
  email: {
    bg: 'rgba(2,147,228,0.1)',
    border: 'rgba(2,147,228,0.2)',
    color: '#36A9EA',
    icon: 'mail',
  },
  sms: {
    bg: 'rgba(243,156,18,0.1)',
    border: 'rgba(243,156,18,0.2)',
    color: 'hsl(38,92%,55%)',
    icon: 'sms',
  },
  push: {
    bg: 'rgba(139,92,246,0.1)',
    border: 'rgba(139,92,246,0.2)',
    color: 'hsl(260,60%,65%)',
    icon: 'bell',
  },
  'in-app': {
    bg: 'rgba(139,92,246,0.1)',
    border: 'rgba(139,92,246,0.2)',
    color: 'hsl(260,60%,65%)',
    icon: 'layers',
  },
  whatsapp: {
    bg: 'rgba(39,174,96,0.1)',
    border: 'rgba(39,174,96,0.2)',
    color: 'hsl(152,60%,50%)',
    icon: 'sms',
  },
}

const CHANNEL_TABS: { value: TemplateChannel | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'email', label: 'EMAIL' },
  { value: 'sms', label: 'SMS' },
  { value: 'push', label: 'PUSH' },
]

export default function Templates() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [channel, setChannel] = useState<TemplateChannel | 'all'>('all')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    setPage(1)
  }, [channel])

  const limit = 12
  const offset = (page - 1) * limit

  const {
    data: response,
    isLoading,
    isError,
    error,
    isFetching,
  } = useTemplates({
    limit,
    offset,
    search: debouncedSearch || undefined,
    channel: channel === 'all' ? undefined : channel,
  })

  const { data: stats, isLoading: statsLoading } = useTemplateStats()

  const templates = response?.data || []
  const meta = response?.meta || { total: 0, limit, offset: 0 }
  const totalPages = Math.max(1, Math.ceil(meta.total / limit))

  const statCards: { label: string; value: number | undefined; icon: string }[] = [
    { label: 'Total Templates', value: stats?.total, icon: 'layers' },
    { label: 'Active', value: stats?.active, icon: 'check' },
    { label: 'Drafts', value: stats?.drafts, icon: 'edit' },
  ]

  if (isError) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <p style={{ color: 'hsl(0,62%,60%)', fontSize: 14 }}>
          Error loading templates: {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    )
  }

  return (
    <div>
      <style>{skeletonStyles}</style>

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
            Templates
          </h1>
          <p style={{ fontSize: 14, color: 'hsl(215,15%,55%)' }}>Manage notification templates across all channels</p>
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
          }}
        >
          <Icon name="plus" size={15} color="#fff" />
          New Template
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
        {statCards.map((s) => (
          <div
            key={s.label}
            style={{
              background: 'hsl(224,18%,8%)',
              border: `1px solid hsl(224,14%,14%)`,
              borderRadius: 12,
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                background: 'rgba(2,147,228,0.1)',
                border: '1px solid rgba(2,147,228,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon name={s.icon} size={16} color="#36A9EA" />
            </div>
            <div>
              {statsLoading ? (
                <SkeletonLine width={40} height={22} marginBottom={4} />
              ) : (
                <p
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: 'hsl(210,20%,92%)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {s.value ?? 0}
                </p>
              )}
              <p style={{ fontSize: 12, color: 'hsl(215,15%,55%)' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <div style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }}>
            <Icon name="search" size={14} color="hsl(215,15%,50%)" />
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
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
          />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {CHANNEL_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setChannel(tab.value)}
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                background: channel === tab.value ? 'rgba(2,147,228,0.15)' : 'hsl(224,14%,10%)',
                border: `1px solid ${channel === tab.value ? 'rgba(2,147,228,0.3)' : 'hsl(224,14%,16%)'}`,
                color: channel === tab.value ? '#36A9EA' : 'hsl(215,15%,55%)',
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Template grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)',
          gap: 16,
          opacity: isFetching && !isLoading ? 0.7 : 1,
          transition: 'opacity 0.15s',
        }}
      >
        {isLoading && Array.from({ length: limit }).map((_, i) => <SkeletonTemplateCard key={i} />)}

        {!isLoading &&
          templates.map((t) => {
            const ch = CHANNEL_COLORS[t.channel] || CHANNEL_COLORS.email
            return (
              <div
                key={t.id}
                style={{
                  background: 'hsl(224,18%,8%)',
                  border: `1px solid hsl(224,14%,14%)`,
                  borderRadius: 12,
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'hsl(224,18%,10%)'
                  e.currentTarget.style.borderColor = 'rgba(2,147,228,0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'hsl(224,18%,8%)'
                  e.currentTarget.style.borderColor = 'hsl(224,14%,14%)'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 9,
                      background: ch.bg,
                      border: `1px solid ${ch.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon name={ch.icon} size={17} color={ch.color} />
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: 9999,
                      background: t.status === 'active' ? 'rgba(39,174,96,0.12)' : 'rgba(100,116,139,0.12)',
                      border: `1px solid ${t.status === 'active' ? 'rgba(39,174,96,0.2)' : 'rgba(100,116,139,0.2)'}`,
                      color: t.status === 'active' ? 'hsl(152,60%,50%)' : 'hsl(215,15%,55%)',
                    }}
                  >
                    {t.status}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: 'hsl(210,20%,90%)',
                    marginBottom: 4,
                    fontFamily: 'JetBrains Mono',
                  }}
                >
                  {t.name}
                </p>
                <p style={{ fontSize: 12, color: 'hsl(215,15%,55%)', marginBottom: 14 }}>{t.client}</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14, minHeight: 22 }}>
                  {t.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: 11,
                        padding: '2px 8px',
                        borderRadius: 9999,
                        background: 'hsl(224,14%,12%)',
                        border: `1px solid hsl(224,14%,18%)`,
                        color: 'hsl(215,15%,60%)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: 12,
                    borderTop: `1px solid hsl(224,14%,13%)`,
                  }}
                >
                  <span style={{ fontSize: 12, color: 'hsl(215,15%,50%)' }}>{t.uses.toLocaleString()} uses</span>
                  <span style={{ fontSize: 12, color: 'hsl(215,15%,45%)' }}>Updated {t.updated}</span>
                </div>
              </div>
            )
          })}
      </div>

      {!isLoading && templates.length === 0 && (
        <div
          style={{
            background: 'hsl(224,18%,8%)',
            border: `1px solid hsl(224,14%,14%)`,
            borderRadius: 12,
            padding: 48,
            textAlign: 'center',
          }}
        >
          <Icon name="search" size={32} color="hsl(215,15%,35%)" />
          <p style={{ color: 'hsl(215,15%,50%)', marginTop: 12, fontSize: 14 }}>
            {search ? 'No templates match your search' : 'No templates found'}
          </p>
        </div>
      )}

      {!isLoading && templates.length > 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 20,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <p style={{ fontSize: 13, color: 'hsl(215,15%,50%)' }}>
            Showing {Math.min(meta.offset + templates.length, meta.total)} of {meta.total} templates
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = Math.max(1, page - 2) + i
              return pageNum <= totalPages ? pageNum : null
            })
              .filter((p): p is number => p !== null)
              .map((p) => (
                <button
                  key={p}
                  disabled={isFetching}
                  onClick={() => {
                    setPage(p)
                    window.scrollTo(0, 0)
                  }}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 7,
                    background: p === page ? 'rgba(2,147,228,0.15)' : 'hsl(224,14%,10%)',
                    border: `1px solid ${p === page ? 'rgba(2,147,228,0.3)' : 'hsl(224,14%,16%)'}`,
                    color: p === page ? '#36A9EA' : 'hsl(215,15%,55%)',
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
