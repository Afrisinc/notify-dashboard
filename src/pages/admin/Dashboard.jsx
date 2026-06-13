import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts'
import Icon from '../../components/Icon'
import { C } from '../../design'

const weekData = [
  { day: 'Mon', email: 4200, sms: 800, push: 1200 },
  { day: 'Tue', email: 5800, sms: 1100, push: 1600 },
  { day: 'Wed', email: 4900, sms: 920, push: 1400 },
  { day: 'Thu', email: 7200, sms: 1500, push: 2100 },
  { day: 'Fri', email: 6100, sms: 1300, push: 1900 },
  { day: 'Sat', email: 3200, sms: 650, push: 900 },
  { day: 'Sun', email: 2900, sms: 580, push: 750 },
]

const recentActivity = [
  { client: 'Acme Corp', channel: 'email', count: 12400, status: 'delivered', time: '2 min ago' },
  { client: 'TechStart', channel: 'sms', count: 320, status: 'delivered', time: '8 min ago' },
  { client: 'Flowbase', channel: 'push', count: 5600, status: 'delivered', time: '15 min ago' },
  { client: 'Launchpad', channel: 'email', count: 890, status: 'failed', time: '32 min ago' },
  { client: 'Stackr', channel: 'email', count: 2100, status: 'delivered', time: '1h ago' },
  { client: 'DevTools Co', channel: 'sms', count: 140, status: 'pending', time: '1h 20m ago' },
]

const channelBreakdown = [
  { label: 'Email', value: 67, color: C.primary },
  { label: 'SMS', value: 18, color: C.warning },
  { label: 'Push', value: 11, color: C.success },
  { label: 'In-app', value: 4, color: 'hsl(260,60%,55%)' },
]

function StatCard({ icon, label, value, sub, trend, trendUp }) {
  return (
    <div
      style={{
        background: 'hsl(224,18%,8%)',
        border: `1px solid hsl(224,14%,14%)`,
        borderRadius: 12,
        padding: '22px 24px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 9,
            background: 'rgba(2,147,228,0.1)',
            border: '1px solid rgba(2,147,228,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name={icon} size={17} color="#36A9EA" />
        </div>
        {trend && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 8px',
              borderRadius: 9999,
              background: trendUp ? 'rgba(39,174,96,0.1)' : 'rgba(231,76,60,0.1)',
              border: `1px solid ${trendUp ? 'rgba(39,174,96,0.2)' : 'rgba(231,76,60,0.2)'}`,
            }}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke={trendUp ? C.success : C.destructive}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {trendUp ? (
                <>
                  <polyline points="18 15 12 9 6 15" />
                </>
              ) : (
                <>
                  <polyline points="6 9 12 15 18 9" />
                </>
              )}
            </svg>
            <span style={{ fontSize: 11, fontWeight: 600, color: trendUp ? C.success : C.destructive }}>{trend}</span>
          </div>
        )}
      </div>
      <p
        style={{
          fontSize: 26,
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: 'hsl(210,20%,95%)',
          marginBottom: 4,
        }}
      >
        {value}
      </p>
      <p style={{ fontSize: 13, fontWeight: 500, color: 'hsl(215,15%,55%)' }}>{label}</p>
      {sub && <p style={{ fontSize: 12, color: 'hsl(215,15%,45%)', marginTop: 4 }}>{sub}</p>}
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    delivered: {
      bg: 'rgba(39,174,96,0.12)',
      border: 'rgba(39,174,96,0.25)',
      color: 'hsl(152,60%,50%)',
    },
    failed: { bg: 'rgba(231,76,60,0.12)', border: 'rgba(231,76,60,0.25)', color: 'hsl(0,62%,60%)' },
    pending: {
      bg: 'rgba(243,156,18,0.12)',
      border: 'rgba(243,156,18,0.25)',
      color: 'hsl(38,92%,55%)',
    },
  }
  const s = map[status]
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

function ChannelBadge({ channel }) {
  const icons = { email: 'mail', sms: 'sms', push: 'bell', 'in-app': 'layers' }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <Icon name={icons[channel] || 'bell'} size={13} color="hsl(215,15%,55%)" />
      <span style={{ fontSize: 13, color: 'hsl(215,15%,65%)', textTransform: 'capitalize' }}>{channel}</span>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
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
          {p.name}: <strong>{p.value.toLocaleString()}</strong>
        </p>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const [period, setPeriod] = useState('7d')

  return (
    <div>
      {/* Page header */}
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
            Dashboard
          </h1>
          <p style={{ fontSize: 14, color: 'hsl(215,15%,55%)' }}>Overview of your notification platform</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['24h', '7d', '30d', '90d'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                padding: '7px 14px',
                borderRadius: 7,
                fontSize: 13,
                fontWeight: 500,
                background: period === p ? 'rgba(2,147,228,0.15)' : 'hsl(224,14%,10%)',
                color: period === p ? '#36A9EA' : 'hsl(215,15%,55%)',
                border: `1px solid ${period === p ? 'rgba(2,147,228,0.3)' : 'hsl(224,14%,16%)'}`,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {p}
            </button>
          ))}
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding: '7px 16px',
              borderRadius: 7,
              fontSize: 13,
              fontWeight: 600,
              background: C.primary,
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(2,147,228,0.3)',
            }}
          >
            <Icon name="download" size={14} color="#fff" />
            Export
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard icon="send" label="Messages Sent" value="48.2K" sub="This week" trend="12.4%" trendUp />
        <StatCard icon="check" label="Delivery Rate" value="99.1%" sub="Last 7 days" trend="0.3%" trendUp />
        <StatCard icon="users" label="Active Clients" value="142" sub="Total onboarded" trend="8" trendUp />
        <StatCard icon="layers" label="Templates" value="38" sub="Across all clients" />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* Area chart */}
        <div
          style={{
            background: 'hsl(224,18%,8%)',
            border: `1px solid hsl(224,14%,14%)`,
            borderRadius: 12,
            padding: '20px 24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <div>
              <p
                style={{
                  fontWeight: 600,
                  fontSize: 15,
                  color: 'hsl(210,20%,95%)',
                  marginBottom: 2,
                }}
              >
                Notification Volume
              </p>
              <p style={{ fontSize: 12, color: 'hsl(215,15%,55%)' }}>Messages sent per day by channel</p>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              {[
                { label: 'Email', color: C.primary },
                { label: 'SMS', color: C.warning },
                { label: 'Push', color: C.success },
              ].map((l) => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color }} />
                  <span style={{ fontSize: 12, color: 'hsl(215,15%,55%)' }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weekData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="emailGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.primary} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={C.primary} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="smsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.warning} stopOpacity={0.12} />
                  <stop offset="95%" stopColor={C.warning} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="pushGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.success} stopOpacity={0.12} />
                  <stop offset="95%" stopColor={C.success} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(224,14%,14%)" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: 'hsl(215,15%,50%)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'hsl(215,15%,50%)' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="email"
                stroke={C.primary}
                strokeWidth={2}
                fill="url(#emailGrad)"
                name="Email"
              />
              <Area type="monotone" dataKey="sms" stroke={C.warning} strokeWidth={2} fill="url(#smsGrad)" name="SMS" />
              <Area
                type="monotone"
                dataKey="push"
                stroke={C.success}
                strokeWidth={2}
                fill="url(#pushGrad)"
                name="Push"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Channel breakdown */}
        <div
          style={{
            background: 'hsl(224,18%,8%)',
            border: `1px solid hsl(224,14%,14%)`,
            borderRadius: 12,
            padding: '20px 24px',
          }}
        >
          <p style={{ fontWeight: 600, fontSize: 15, color: 'hsl(210,20%,95%)', marginBottom: 2 }}>Channel Mix</p>
          <p style={{ fontSize: 12, color: 'hsl(215,15%,55%)', marginBottom: 20 }}>Distribution by channel type</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {channelBreakdown.map((ch) => (
              <div key={ch.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'hsl(210,20%,80%)' }}>{ch.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: ch.color }}>{ch.value}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: 'hsl(224,14%,14%)' }}>
                  <div
                    style={{
                      height: '100%',
                      borderRadius: 3,
                      background: ch.color,
                      width: `${ch.value}%`,
                      transition: 'width 0.6s ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 24,
              padding: '14px 16px',
              background: 'hsl(224,14%,10%)',
              borderRadius: 8,
              border: `1px solid hsl(224,14%,14%)`,
            }}
          >
            <p style={{ fontSize: 12, color: 'hsl(215,15%,55%)', marginBottom: 4 }}>Peak send time</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: 'hsl(210,20%,90%)' }}>Thu 10–11 AM UTC</p>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Recent activity */}
        <div
          style={{
            background: 'hsl(224,18%,8%)',
            border: `1px solid hsl(224,14%,14%)`,
            borderRadius: 12,
            padding: '20px 24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <p style={{ fontWeight: 600, fontSize: 15, color: 'hsl(210,20%,95%)' }}>Recent Sends</p>
            <button
              style={{
                fontSize: 12,
                color: '#36A9EA',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              View all
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {recentActivity.map((a, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '11px 0',
                  borderBottom: i < recentActivity.length - 1 ? `1px solid hsl(224,14%,12%)` : 'none',
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: 'hsl(224,14%,12%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#36A9EA' }}>{a.client[0]}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'hsl(210,20%,90%)',
                      marginBottom: 2,
                    }}
                  >
                    {a.client}
                  </p>
                  <ChannelBadge channel={a.channel} />
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'hsl(210,20%,85%)',
                      marginBottom: 2,
                    }}
                  >
                    {a.count.toLocaleString()}
                  </p>
                  <StatusBadge status={a.status} />
                </div>
                <p
                  style={{
                    fontSize: 11,
                    color: 'hsl(215,15%,45%)',
                    flexShrink: 0,
                    minWidth: 60,
                    textAlign: 'right',
                  }}
                >
                  {a.time}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions + system health */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Quick actions */}
          <div
            style={{
              background: 'hsl(224,18%,8%)',
              border: `1px solid hsl(224,14%,14%)`,
              borderRadius: 12,
              padding: '20px 24px',
            }}
          >
            <p style={{ fontWeight: 600, fontSize: 15, color: 'hsl(210,20%,95%)', marginBottom: 14 }}>Quick Actions</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { icon: 'send', label: 'Send Notification', primary: true },
                { icon: 'plus', label: 'Add Client', primary: false },
                { icon: 'layers', label: 'New Template', primary: false },
                { icon: 'api', label: 'API Keys', primary: false },
              ].map((a) => (
                <button
                  key={a.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 14px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: a.primary ? 'rgba(2,147,228,0.15)' : 'hsl(224,14%,10%)',
                    border: `1px solid ${a.primary ? 'rgba(2,147,228,0.3)' : 'hsl(224,14%,16%)'}`,
                    color: a.primary ? '#36A9EA' : 'hsl(210,20%,80%)',
                    transition: 'all 0.15s',
                  }}
                >
                  <Icon name={a.icon} size={15} color={a.primary ? '#36A9EA' : 'hsl(215,15%,60%)'} />
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* System health */}
          <div
            style={{
              background: 'hsl(224,18%,8%)',
              border: `1px solid hsl(224,14%,14%)`,
              borderRadius: 12,
              padding: '20px 24px',
              flex: 1,
            }}
          >
            <p style={{ fontWeight: 600, fontSize: 15, color: 'hsl(210,20%,95%)', marginBottom: 14 }}>System Health</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Email Gateway', status: 'Operational', ok: true },
                { label: 'SMS Provider', status: 'Operational', ok: true },
                { label: 'Push Service', status: 'Operational', ok: true },
                { label: 'API Endpoint', status: 'Degraded', ok: false },
                { label: 'Webhook Queue', status: 'Operational', ok: true },
              ].map((h) => (
                <div
                  key={h.label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    background: 'hsl(224,14%,10%)',
                    borderRadius: 7,
                    border: `1px solid hsl(224,14%,14%)`,
                  }}
                >
                  <span style={{ fontSize: 13, color: 'hsl(210,20%,80%)' }}>{h.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: h.ok ? 'hsl(152,60%,45%)' : 'hsl(38,92%,55%)',
                      }}
                    />
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: h.ok ? 'hsl(152,60%,50%)' : 'hsl(38,92%,55%)',
                      }}
                    >
                      {h.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
