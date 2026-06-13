import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { C } from '../../design'

const deliveryData = [
  { week: 'W1', delivered: 42000, failed: 320, bounced: 180 },
  { week: 'W2', delivered: 58000, failed: 410, bounced: 210 },
  { week: 'W3', delivered: 51000, failed: 280, bounced: 150 },
  { week: 'W4', delivered: 72000, failed: 520, bounced: 310 },
  { week: 'W5', delivered: 65000, failed: 390, bounced: 240 },
  { week: 'W6', delivered: 84000, failed: 480, bounced: 280 },
  { week: 'W7', delivered: 79000, failed: 360, bounced: 200 },
  { week: 'W8', delivered: 91000, failed: 440, bounced: 260 },
]

const engagementData = [
  { day: 'Mon', opens: 32, clicks: 12, unsubscribes: 0.5 },
  { day: 'Tue', opens: 45, clicks: 18, unsubscribes: 0.8 },
  { day: 'Wed', opens: 38, clicks: 14, unsubscribes: 0.4 },
  { day: 'Thu', opens: 52, clicks: 21, unsubscribes: 0.6 },
  { day: 'Fri', opens: 48, clicks: 19, unsubscribes: 0.7 },
  { day: 'Sat', opens: 28, clicks: 9, unsubscribes: 0.3 },
  { day: 'Sun', opens: 22, clicks: 7, unsubscribes: 0.2 },
]

const topClients = [
  { name: 'Cloudnova', sent: 4500000, plan: 'Enterprise' },
  { name: 'Acme Corp', sent: 1200000, plan: 'Enterprise' },
  { name: 'Stackr', sent: 320000, plan: 'Pro' },
  { name: 'Flowbase', sent: 280000, plan: 'Pro' },
  { name: 'PingApp', sent: 220000, plan: 'Pro' },
]

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
          {p.name}: <strong>{typeof p.value === 'number' && p.value > 100 ? p.value.toLocaleString() : p.value}</strong>
        </p>
      ))}
    </div>
  )
}

function Card({ children, title, subtitle, style }) {
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

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Sent (8wk)', value: '542K', sub: '+18.4% vs prev', up: true },
          { label: 'Avg Delivery Rate', value: '99.1%', sub: '+0.2% vs prev', up: true },
          { label: 'Avg Open Rate', value: '38.4%', sub: '−1.2% vs prev', up: false },
          { label: 'Avg Click Rate', value: '14.8%', sub: '+0.6% vs prev', up: true },
        ].map((k) => (
          <div
            key={k.label}
            style={{
              background: 'hsl(224,18%,8%)',
              border: `1px solid hsl(224,14%,14%)`,
              borderRadius: 12,
              padding: '20px 22px',
            }}
          >
            <p
              style={{
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: 'hsl(210,20%,95%)',
                marginBottom: 4,
              }}
            >
              {k.value}
            </p>
            <p style={{ fontSize: 13, color: 'hsl(215,15%,55%)', marginBottom: 6 }}>{k.label}</p>
            <p style={{ fontSize: 12, color: k.up ? C.success : C.destructive, fontWeight: 600 }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Delivery volume */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: 16, marginBottom: 20 }}>
        <Card title="Delivery Volume" subtitle="8-week trend — delivered vs failed vs bounced">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={deliveryData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(224,14%,14%)" vertical={false} />
              <XAxis
                dataKey="week"
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
              <Bar dataKey="delivered" fill={C.primary} radius={[3, 3, 0, 0]} name="Delivered" />
              <Bar dataKey="failed" fill={C.destructive} radius={[3, 3, 0, 0]} name="Failed" />
              <Bar dataKey="bounced" fill={C.warning} radius={[3, 3, 0, 0]} name="Bounced" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Success Rate" subtitle="Last 8 weeks">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Delivered', pct: 99.1, color: C.primary },
              { label: 'Failed', pct: 0.5, color: C.destructive },
              { label: 'Bounced', pct: 0.4, color: C.warning },
            ].map((r) => (
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
        <Card title="Email Engagement" subtitle="Open rate, click rate & unsubscribes (%) this week">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={engagementData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(224,14%,14%)" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: 'hsl(215,15%,50%)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(215,15%,50%)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="opens" stroke={C.primary} strokeWidth={2} dot={false} name="Opens %" />
              <Line type="monotone" dataKey="clicks" stroke={C.success} strokeWidth={2} dot={false} name="Clicks %" />
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
        </Card>

        <Card title="Top Clients by Volume">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {topClients.map((c, i) => {
              const max = topClients[0].sent
              return (
                <div key={c.name}>
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
                        {c.plan}
                      </span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'hsl(215,15%,60%)' }}>
                      {(c.sent / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div style={{ height: 5, borderRadius: 3, background: 'hsl(224,14%,13%)' }}>
                    <div
                      style={{
                        height: '100%',
                        borderRadius: 3,
                        background: `hsl(${187 + i * 15},70%,48%)`,
                        width: `${(c.sent / max) * 100}%`,
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}
