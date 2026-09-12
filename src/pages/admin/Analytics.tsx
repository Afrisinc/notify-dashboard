import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts'
import { C } from '../../design'
import { useAnalytics } from '../../hooks'
import { SkeletonLine, ChartSkeleton } from '../../components/SkeletonLoader'
import { todayISODate, daysAgoISODate, formatRangeLabel } from '../../lib/date-range'
import type { AnalyticsPeriod } from '../../types'

const PERIOD_OPTIONS: { value: AnalyticsPeriod; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: '7d', label: 'This Week' },
  { value: '30d', label: 'This Month' },
  { value: '90d', label: 'Last 3 Months' },
  { value: '6m', label: 'Last 6 Months' },
  { value: 'custom', label: 'Custom Range' },
]

const SHORT_PERIOD_LABELS: Record<AnalyticsPeriod, string> = {
  today: 'Today',
  '7d': 'Week',
  '30d': 'Month',
  '90d': '3 Months',
  '6m': '6 Months',
  custom: 'Custom',
}

const TREND_LABELS: Record<AnalyticsPeriod, string> = {
  today: "Today's trend",
  '7d': '7-day trend',
  '30d': '30-day trend',
  '90d': '13-week trend',
  '6m': '6-month trend',
  custom: 'Custom range trend',
}

const RATE_PERIOD_LABELS: Record<AnalyticsPeriod, string> = {
  today: 'Today',
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
  '90d': 'Last 3 months',
  '6m': 'Last 6 months',
  custom: 'Custom range',
}

function formatCompactNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toString()
}

const PLAN_LABELS: Record<string, string> = {
  FREE: 'Free',
  PAYG: 'Pay-as-you-go',
  STARTER: 'Starter',
  SCALE: 'Scale',
  ENTERPRISE: 'Enterprise',
  PRO: 'Pro',
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
  if (!active || !payload?.length) return null
  return (
    <div
      style={{
        background: 'hsl(224,18%,10%)',
        border: `1px solid hsl(224,14%,18%)`,
        borderRadius: 8,
        padding: '10px 14px',
      }}
    >
      <p style={{ fontSize: 12, fontWeight: 600, color: 'hsl(210,20%,90%)', marginBottom: 6 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ fontSize: 12, color: p.color, marginBottom: 2 }}>
          {p.name}: <strong>{typeof p.value === 'number' && p.value > 100 ? p.value.toLocaleString() : p.value}</strong>
        </p>
      ))}
    </div>
  )
}

function Card({ children, title, subtitle, style }: { children: any; title: any; subtitle?: any; style?: any }) {
  return (
    <div
      style={{
        background: 'hsl(224,18%,8%)',
        border: `1px solid hsl(224,14%,14%)`,
        borderRadius: 12,
        padding: '20px 24px',
        ...style,
      }}
    >
      {(title || subtitle) && (
        <div style={{ marginBottom: 20 }}>
          {title && (
            <p style={{ fontWeight: 600, fontSize: 15, color: 'hsl(210,20%,95%)', marginBottom: 2 }}>{title}</p>
          )}
          {subtitle && <p style={{ fontSize: 12, color: 'hsl(215,15%,55%)' }}>{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  )
}

export default function Analytics() {
  // Closest match to the page's original fixed "8-week" view among the new presets,
  // since a plain weekly-bucketed trend is still what loads by default.
  const [period, setPeriod] = useState<AnalyticsPeriod>('90d')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')

  const handlePeriodChange = (next: AnalyticsPeriod) => {
    if (next === 'custom' && !customFrom && !customTo) {
      setCustomFrom(daysAgoISODate(90))
      setCustomTo(todayISODate())
    }
    setPeriod(next)
  }

  const isCustomRangeValid = period !== 'custom' || (!!customFrom && !!customTo && customFrom <= customTo)

  const queryParams = period === 'custom' ? { period, dateFrom: customFrom, dateTo: customTo } : { period }

  const { data, isLoading, isError, error } = useAnalytics(queryParams, isCustomRangeValid)

  if (isError) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <p style={{ color: 'hsl(0,62%,60%)', fontSize: 14 }}>
          Error loading analytics: {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    )
  }

  const rangeLabel = formatRangeLabel(data?.rangeStart, data?.rangeEnd)

  const kpiCards = [
    { label: `Total Sent (${SHORT_PERIOD_LABELS[period]})`, kpi: data?.kpis.totalSent },
    { label: 'Avg Delivery Rate', kpi: data?.kpis.avgDeliveryRate },
    { label: 'Avg Open Rate', kpi: data?.kpis.avgOpenRate },
    { label: 'Avg Click Rate', kpi: data?.kpis.avgClickRate },
  ]

  const successRateRows = data
    ? [
        { label: 'Delivered', pct: data.successRate.delivered, color: C.primary },
        { label: 'Failed', pct: data.successRate.failed, color: C.destructive },
        { label: 'Bounced', pct: data.successRate.bounced, color: C.warning },
      ]
    : []

  const topClients = data?.topClients || []
  const maxClientVolume = topClients[0]?.sent || 1

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: 'hsl(210,20%,95%)',
            letterSpacing: '-0.02em',
            marginBottom: 4,
          }}
        >
          Analytics
        </h1>
        <p style={{ fontSize: 14, color: 'hsl(215,15%,55%)' }}>Platform-wide delivery performance and engagement</p>
      </div>

      {/* Date range - governs every chart, KPI, and list on this page */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
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

      {!isCustomRangeValid ? (
        <div
          style={{
            background: 'hsl(224,18%,8%)',
            border: `1px solid hsl(224,14%,14%)`,
            borderRadius: 12,
            padding: 48,
            textAlign: 'center',
          }}
        >
          <p style={{ color: 'hsl(215,15%,50%)', fontSize: 14 }}>
            Choose a valid start and end date to view analytics for a custom range.
          </p>
        </div>
      ) : (
        <>
          {/* KPI row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
            {kpiCards.map((k) => (
              <div
                key={k.label}
                style={{
                  background: 'hsl(224,18%,8%)',
                  border: `1px solid hsl(224,14%,14%)`,
                  borderRadius: 12,
                  padding: '20px 22px',
                }}
              >
                {isLoading || !k.kpi ? (
                  <>
                    <SkeletonLine width={80} height={26} marginBottom={8} />
                    <SkeletonLine width={110} height={13} marginBottom={8} />
                    <SkeletonLine width={90} height={12} />
                  </>
                ) : (
                  <>
                    <p
                      style={{
                        fontSize: 26,
                        fontWeight: 800,
                        letterSpacing: '-0.02em',
                        color: 'hsl(210,20%,95%)',
                        marginBottom: 4,
                      }}
                    >
                      {k.kpi.value}
                    </p>
                    <p style={{ fontSize: 13, color: 'hsl(215,15%,55%)', marginBottom: 6 }}>{k.label}</p>
                    <p style={{ fontSize: 12, color: k.kpi.deltaUp ? C.success : C.destructive, fontWeight: 600 }}>
                      {k.kpi.delta}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Delivery volume */}
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: 16, marginBottom: 20 }}>
            <Card title="Delivery Volume" subtitle={`${TREND_LABELS[period]} — delivered vs failed vs bounced`}>
              {isLoading || !data ? (
                <ChartSkeleton height={220} />
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={data.deliveryVolume} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(224,14%,14%)" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: 'hsl(215,15%,50%)' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: 'hsl(215,15%,50%)' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="delivered" fill={C.primary} radius={[3, 3, 0, 0]} name="Delivered" />
                    <Bar dataKey="failed" fill={C.destructive} radius={[3, 3, 0, 0]} name="Failed" />
                    <Bar dataKey="bounced" fill={C.warning} radius={[3, 3, 0, 0]} name="Bounced" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>
            <Card title="Success Rate" subtitle={RATE_PERIOD_LABELS[period]}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {isLoading || !data
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <div key={i}>
                        <SkeletonLine width="100%" height={13} marginBottom={5} />
                        <SkeletonLine width="100%" height={6} borderRadius={3} />
                      </div>
                    ))
                  : successRateRows.map((r) => (
                      <div key={r.label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                          <span style={{ fontSize: 13, color: 'hsl(210,20%,80%)' }}>{r.label}</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: r.color }}>{r.pct}%</span>
                        </div>
                        <div style={{ height: 6, borderRadius: 3, background: 'hsl(224,14%,14%)' }}>
                          <div
                            style={{
                              height: '100%',
                              borderRadius: 3,
                              background: r.color,
                              width: `${Math.min(r.pct, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
              </div>
            </Card>
          </div>

          {/* Engagement & top clients */}
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16 }}>
            <Card
              title="Email Engagement"
              subtitle={`Open rate, click rate & unsubscribes (%) — ${RATE_PERIOD_LABELS[period].toLowerCase()}`}
            >
              {isLoading || !data ? (
                <ChartSkeleton height={220} />
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={data.emailEngagement} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(224,14%,14%)" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: 'hsl(215,15%,50%)' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis tick={{ fontSize: 11, fill: 'hsl(215,15%,50%)' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="opens"
                      stroke={C.primary}
                      strokeWidth={2}
                      dot={false}
                      name="Opens %"
                    />
                    <Line
                      type="monotone"
                      dataKey="clicks"
                      stroke={C.success}
                      strokeWidth={2}
                      dot={false}
                      name="Clicks %"
                    />
                    <Line
                      type="monotone"
                      dataKey="unsubscribes"
                      stroke={C.destructive}
                      strokeWidth={2}
                      dot={false}
                      name="Unsubs %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </Card>

            <Card title="Top Clients by Volume">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {isLoading || !data ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i}>
                      <SkeletonLine width="100%" height={13} marginBottom={5} />
                      <SkeletonLine width="100%" height={5} borderRadius={3} />
                    </div>
                  ))
                ) : topClients.length === 0 ? (
                  <p style={{ fontSize: 13, color: 'hsl(215,15%,50%)', textAlign: 'center', padding: '20px 0' }}>
                    No notification volume in this range
                  </p>
                ) : (
                  topClients.map((c, i) => (
                    <div key={c.accountId}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span
                            style={{
                              fontFamily: 'JetBrains Mono',
                              fontSize: 11,
                              color: 'hsl(215,15%,45%)',
                              minWidth: 16,
                            }}
                          >
                            #{i + 1}
                          </span>
                          <span style={{ fontSize: 13, fontWeight: 500, color: 'hsl(210,20%,85%)' }}>{c.name}</span>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 600,
                              padding: '2px 6px',
                              borderRadius: 9999,
                              background: 'rgba(2,147,228,0.1)',
                              color: '#36A9EA',
                            }}
                          >
                            {PLAN_LABELS[c.plan] || c.plan}
                          </span>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'hsl(215,15%,60%)' }}>
                          {formatCompactNumber(c.sent)}
                        </span>
                      </div>
                      <div style={{ height: 5, borderRadius: 3, background: 'hsl(224,14%,13%)' }}>
                        <div
                          style={{
                            height: '100%',
                            borderRadius: 3,
                            background: `hsl(${187 + i * 15},70%,48%)`,
                            width: `${(c.sent / maxClientVolume) * 100}%`,
                            transition: 'width 0.5s ease',
                          }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
