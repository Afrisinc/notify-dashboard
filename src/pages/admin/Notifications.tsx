import { useState, useEffect } from 'react'
import Icon from '../../components/Icon'
import { C } from '../../design'
import { useNotifications, useNotificationStats } from '../../hooks'
import { SkeletonLine, SkeletonNotificationRow, skeletonStyles } from '../../components/SkeletonLoader'
import { todayISODate, daysAgoISODate, formatRangeLabel } from '../../lib/date-range'
import type { NotificationChannel, NotificationStatus, NotificationPeriod } from '../../types'

const PERIOD_OPTIONS: { value: NotificationPeriod; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: '7d', label: 'This Week' },
  { value: '30d', label: 'This Month' },
  { value: '6m', label: 'Last 6 Months' },
  { value: 'custom', label: 'Custom Range' },
]

const SENT_LABELS: Record<NotificationPeriod, string> = {
  today: 'Sent Today',
  yesterday: 'Sent Yesterday',
  '7d': 'Sent This Week',
  '30d': 'Sent This Month',
  '6m': 'Sent (6 Months)',
  custom: 'Sent (Custom)',
}

const STATUS_COLORS: Record<NotificationStatus, { bg: string; border: string; color: string }> = {
  delivered: {
    bg: 'rgba(39,174,96,0.12)',
    border: 'rgba(39,174,96,0.2)',
    color: 'hsl(152,60%,50%)',
  },
  failed: { bg: 'rgba(231,76,60,0.12)', border: 'rgba(231,76,60,0.2)', color: 'hsl(0,62%,60%)' },
  pending: {
    bg: 'rgba(243,156,18,0.12)',
    border: 'rgba(243,156,18,0.2)',
    color: 'hsl(38,92%,55%)',
  },
}

function StatusBadge({ status }: { status: NotificationStatus }) {
  const s = STATUS_COLORS[status] || STATUS_COLORS.pending
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '3px 9px',
        borderRadius: 9999,
        background: s.bg,
        border: `1px solid ${s.border}`,
        fontSize: 11,
        fontWeight: 600,
        color: s.color,
      }}
    >
      <div style={{ width: 5, height: 5, borderRadius: '50%', background: s.color }} />
      {status}
    </span>
  )
}

const CHANNEL_ICONS: Record<string, string> = { email: 'mail', sms: 'sms', push: 'bell', 'in-app': 'layers' }

export default function Notifications() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [channel, setChannel] = useState<NotificationChannel | 'all'>('all')
  const [status, setStatus] = useState<NotificationStatus | 'all'>('all')
  const [period, setPeriod] = useState<NotificationPeriod>('today')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [page, setPage] = useState(1)
  const [showSend, setShowSend] = useState(false)
  const [form, setForm] = useState({ to: '', channel: 'email', template: '', client: '' })

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    setPage(1)
  }, [channel, status, period, customFrom, customTo])

  const handlePeriodChange = (next: NotificationPeriod) => {
    if (next === 'custom' && !customFrom && !customTo) {
      // Seed a sensible default range so custom mode never starts blank
      setCustomFrom(daysAgoISODate(7))
      setCustomTo(todayISODate())
    }
    setPeriod(next)
  }

  const isCustomRangeValid = period !== 'custom' || (!!customFrom && !!customTo && customFrom <= customTo)

  const dateRangeParams = period === 'custom' ? { period, dateFrom: customFrom, dateTo: customTo } : { period }

  const limit = 15
  const offset = (page - 1) * limit

  const {
    data: response,
    isLoading,
    isError,
    error,
    isFetching,
  } = useNotifications(
    {
      limit,
      offset,
      search: debouncedSearch || undefined,
      channel: channel === 'all' ? undefined : channel,
      status: status === 'all' ? undefined : status,
      ...dateRangeParams,
    },
    isCustomRangeValid
  )

  const { data: stats, isLoading: statsLoading } = useNotificationStats(dateRangeParams, isCustomRangeValid)

  const notifications = response?.data || []
  const meta = response?.meta || { total: 0, limit, offset: 0 }
  const totalPages = Math.max(1, Math.ceil(meta.total / limit))
  const rangeLabel = formatRangeLabel(stats?.rangeStart, stats?.rangeEnd)

  const statCards = [
    { icon: 'send', label: SENT_LABELS[period], value: stats?.totalSent, color: C.primary400 },
    { icon: 'check', label: 'Delivered', value: stats?.delivered, color: C.success },
    { icon: 'x', label: 'Failed', value: stats?.failed, color: C.destructive },
    { icon: 'activity', label: 'Pending', value: stats?.pending, color: C.warning },
  ]

  if (isError) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <p style={{ color: 'hsl(0,62%,60%)', fontSize: 14 }}>
          Error loading notifications: {error instanceof Error ? error.message : 'Unknown error'}
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
            Notifications
          </h1>
          <p style={{ fontSize: 14, color: 'hsl(215,15%,55%)' }}>Send notifications and view delivery logs</p>
        </div>
        <button
          onClick={() => setShowSend(true)}
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
          <Icon name="send" size={15} color="#fff" />
          Send Notification
        </button>
      </div>

      {/* Date range - governs both the stat cards and the table below */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'hsl(215,15%,55%)', whiteSpace: 'nowrap' }}>
          Date Range
        </span>
        <select
          value={period}
          onChange={(e) => handlePeriodChange(e.target.value as NotificationPeriod)}
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

      {!isCustomRangeValid ? (
        <div
          style={{
            background: 'hsl(224,18%,8%)',
            border: `1px solid hsl(224,14%,14%)`,
            borderRadius: 12,
            padding: 48,
            textAlign: 'center',
            marginBottom: 24,
          }}
        >
          <Icon name="activity" size={32} color="hsl(215,15%,30%)" />
          <p style={{ color: 'hsl(215,15%,50%)', marginTop: 12, fontSize: 14 }}>
            Choose a valid start and end date to view notifications for a custom range.
          </p>
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
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
                    background: 'hsl(224,14%,12%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon name={s.icon} size={16} color={s.color} />
                </div>
                <div>
                  {statsLoading ? (
                    <SkeletonLine width={50} height={20} marginBottom={4} />
                  ) : (
                    <p
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: 'hsl(210,20%,92%)',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {(s.value ?? 0).toLocaleString()}
                    </p>
                  )}
                  <p style={{ fontSize: 12, color: 'hsl(215,15%,55%)' }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <div style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }}>
                <Icon name="search" size={14} color="hsl(215,15%,50%)" />
              </div>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notifications..."
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
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value as NotificationChannel | 'all')}
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
              <option value="all">All Channels</option>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="push">Push</option>
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as NotificationStatus | 'all')}
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
              <option value="delivered">Delivered</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Log table */}
          <div
            style={{
              background: 'hsl(224,18%,8%)',
              border: `1px solid hsl(224,14%,14%)`,
              borderRadius: 12,
              overflow: 'hidden',
              opacity: isFetching && !isLoading ? 0.7 : 1,
              transition: 'opacity 0.15s',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.2fr 1.5fr 80px 1fr 90px 70px',
                padding: '12px 20px',
                background: 'hsl(224,14%,10%)',
                borderBottom: `1px solid hsl(224,14%,12%)`,
              }}
            >
              {['ID', 'Client', 'To / Template', 'Channel', 'Status', 'Latency', 'Time'].map((h) => (
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

            {isLoading && Array.from({ length: limit }).map((_, i) => <SkeletonNotificationRow key={i} />)}

            {!isLoading &&
              notifications.map((l, i) => (
                <div
                  key={l.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1.2fr 1.5fr 80px 1fr 90px 70px',
                    padding: '13px 20px',
                    borderBottom: i < notifications.length - 1 ? `1px solid hsl(224,14%,11%)` : 'none',
                    alignItems: 'center',
                    transition: 'background 0.15s',
                    cursor: 'default',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'hsl(224,14%,10%)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <span
                    style={{
                      fontFamily: 'JetBrains Mono',
                      fontSize: 11,
                      color: 'hsl(215,15%,55%)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {l.id.slice(0, 8)}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'hsl(210,20%,85%)' }}>{l.client}</span>
                  <div>
                    <p style={{ fontSize: 13, color: 'hsl(210,20%,85%)' }}>{l.to}</p>
                    <p style={{ fontSize: 11, color: 'hsl(215,15%,50%)', fontFamily: 'JetBrains Mono' }}>
                      {l.template}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Icon name={CHANNEL_ICONS[l.channel] || 'bell'} size={13} color="hsl(215,15%,55%)" />
                    <span style={{ fontSize: 12, color: 'hsl(215,15%,60%)', textTransform: 'capitalize' }}>
                      {l.channel}
                    </span>
                  </div>
                  <StatusBadge status={l.status} />
                  <span
                    style={{
                      fontFamily: 'JetBrains Mono',
                      fontSize: 12,
                      color: l.latency === '—' ? 'hsl(215,15%,40%)' : C.success,
                    }}
                  >
                    {l.latency}
                  </span>
                  <span style={{ fontSize: 12, color: 'hsl(215,15%,45%)' }}>{l.time}</span>
                </div>
              ))}

            {!isLoading && notifications.length === 0 && (
              <div style={{ padding: 48, textAlign: 'center' }}>
                <Icon name="bell" size={32} color="hsl(215,15%,30%)" />
                <p style={{ color: 'hsl(215,15%,50%)', marginTop: 12, fontSize: 14 }}>No notifications found</p>
              </div>
            )}
          </div>

          {!isLoading && notifications.length > 0 && (
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
                Showing {Math.min(meta.offset + notifications.length, meta.total)} of {meta.total} notifications
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
        </>
      )}

      {/* Send modal */}
      {showSend && (
        <div
          onClick={() => setShowSend(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'hsl(224,18%,9%)',
              border: `1px solid hsl(224,14%,16%)`,
              borderRadius: 16,
              padding: '28px',
              width: 480,
              boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 24,
              }}
            >
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'hsl(210,20%,95%)' }}>Send Notification</h2>
              <button
                onClick={() => setShowSend(false)}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 7,
                  background: 'hsl(224,14%,14%)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'hsl(215,15%,55%)',
                }}
              >
                <Icon name="x" size={15} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Client', field: 'client', placeholder: 'Select or type client name' },
                {
                  label: 'Recipient',
                  field: 'to',
                  placeholder: 'email@example.com or phone number',
                },
                { label: 'Template', field: 'template', placeholder: 'e.g. welcome-v2' },
              ].map((f) => (
                <div key={f.field}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'hsl(210,20%,80%)',
                      marginBottom: 8,
                    }}
                  >
                    {f.label}
                  </label>
                  <input
                    value={form[f.field as keyof typeof form]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [f.field]: e.target.value }))}
                    placeholder={f.placeholder}
                    style={{
                      width: '100%',
                      background: 'hsl(224,14%,12%)',
                      border: `1px solid hsl(224,14%,18%)`,
                      borderRadius: 8,
                      padding: '10px 14px',
                      fontSize: 13,
                      color: 'hsl(210,20%,90%)',
                      fontFamily: 'Manrope, sans-serif',
                      outline: 'none',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'rgba(2,147,228,0.4)')}
                    onBlur={(e) => (e.target.style.borderColor = 'hsl(224,14%,18%)')}
                  />
                </div>
              ))}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'hsl(210,20%,80%)',
                    marginBottom: 8,
                  }}
                >
                  Channel
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['email', 'sms', 'push'].map((ch) => (
                    <button
                      key={ch}
                      onClick={() => setForm((prev) => ({ ...prev, channel: ch }))}
                      style={{
                        flex: 1,
                        padding: '9px',
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: 'pointer',
                        background: form.channel === ch ? 'rgba(2,147,228,0.15)' : 'hsl(224,14%,12%)',
                        border: `1px solid ${form.channel === ch ? 'rgba(2,147,228,0.4)' : 'hsl(224,14%,18%)'}`,
                        color: form.channel === ch ? '#36A9EA' : 'hsl(215,15%,55%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                      }}
                    >
                      <Icon
                        name={CHANNEL_ICONS[ch]}
                        size={14}
                        color={form.channel === ch ? '#36A9EA' : 'hsl(215,15%,55%)'}
                      />
                      {ch.charAt(0).toUpperCase() + ch.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <p style={{ fontSize: 12, color: 'hsl(215,15%,50%)', marginTop: 16 }}>
              Sending from the admin dashboard isn't wired up to the notify API yet.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button
                onClick={() => setShowSend(false)}
                style={{
                  flex: 1,
                  padding: '11px',
                  borderRadius: 8,
                  background: 'transparent',
                  border: `1px solid hsl(224,14%,20%)`,
                  color: 'hsl(215,15%,60%)',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                disabled
                style={{
                  flex: 2,
                  padding: '11px',
                  borderRadius: 8,
                  background: 'hsl(224,14%,18%)',
                  border: 'none',
                  color: 'hsl(215,15%,55%)',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <Icon name="send" size={15} color="hsl(215,15%,55%)" /> Send Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
