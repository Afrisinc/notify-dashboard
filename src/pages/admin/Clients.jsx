import { useState } from 'react'
import Icon from '../../components/Icon'
import { C } from '../../design'

const CLIENTS = [
  { id: 1, name: 'Acme Corp', plan: 'Enterprise', email: 'ops@acme.com', sent: '1.2M', deliveryRate: '99.4%', templates: 24, status: 'active', joined: 'Jan 2025', channels: ['email', 'sms', 'push'] },
  { id: 2, name: 'TechStart', plan: 'Pro', email: 'dev@techstart.io', sent: '48.2K', deliveryRate: '98.9%', templates: 12, status: 'active', joined: 'Mar 2025', channels: ['email', 'push'] },
  { id: 3, name: 'Flowbase', plan: 'Pro', email: 'team@flowbase.co', sent: '320K', deliveryRate: '99.1%', templates: 8, status: 'active', joined: 'Feb 2025', channels: ['email', 'sms'] },
  { id: 4, name: 'Launchpad', plan: 'Free', email: 'hello@launchpad.dev', sent: '2.8K', deliveryRate: '97.2%', templates: 3, status: 'suspended', joined: 'Apr 2025', channels: ['email'] },
  { id: 5, name: 'Stackr', plan: 'Pro', email: 'admin@stackr.app', sent: '89.4K', deliveryRate: '99.3%', templates: 18, status: 'active', joined: 'Jan 2025', channels: ['email', 'sms', 'push'] },
  { id: 6, name: 'DevTools Co', plan: 'Free', email: 'info@devtools.co', sent: '900', deliveryRate: '95.0%', templates: 2, status: 'active', joined: 'Apr 2025', channels: ['email'] },
  { id: 7, name: 'Cloudnova', plan: 'Enterprise', email: 'ops@cloudnova.io', sent: '4.5M', deliveryRate: '99.8%', templates: 42, status: 'active', joined: 'Dec 2024', channels: ['email', 'sms', 'push'] },
  { id: 8, name: 'PingApp', plan: 'Pro', email: 'support@pingapp.com', sent: '220K', deliveryRate: '98.7%', templates: 15, status: 'trial', joined: 'Apr 2025', channels: ['push'] },
]

const PLAN_COLORS = {
  Enterprise: { bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.25)', color: 'hsl(260,60%,65%)' },
  Pro: { bg: 'rgba(2,147,228,0.12)', border: 'rgba(2,147,228,0.25)', color: '#36A9EA' },
  Free: { bg: 'rgba(100,116,139,0.12)', border: 'rgba(100,116,139,0.25)', color: 'hsl(215,15%,65%)' },
}
const STATUS_COLORS = {
  active: { bg: 'rgba(39,174,96,0.12)', border: 'rgba(39,174,96,0.25)', color: 'hsl(152,60%,50%)' },
  suspended: { bg: 'rgba(231,76,60,0.12)', border: 'rgba(231,76,60,0.25)', color: 'hsl(0,62%,60%)' },
  trial: { bg: 'rgba(243,156,18,0.12)', border: 'rgba(243,156,18,0.25)', color: 'hsl(38,92%,55%)' },
}

function Badge({ label, colors }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 9px', borderRadius: 9999, background: colors.bg, border: `1px solid ${colors.border}`, fontSize: 11, fontWeight: 600, color: colors.color }}>
      {label}
    </span>
  )
}

function ChannelTag({ ch }) {
  const icons = { email: 'mail', sms: 'sms', push: 'bell' }
  return (
    <div title={ch} style={{ width: 22, height: 22, borderRadius: 5, background: 'hsl(224,14%,14%)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={icons[ch] || 'bell'} size={11} color="hsl(215,15%,60%)" />
    </div>
  )
}

export default function Clients() {
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  const filtered = CLIENTS.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
    const matchPlan = planFilter === 'all' || c.plan === planFilter
    const matchStatus = statusFilter === 'all' || c.status === statusFilter
    return matchSearch && matchPlan && matchStatus
  })

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'hsl(210,20%,95%)', letterSpacing: '-0.02em', marginBottom: 4 }}>Clients</h1>
          <p style={{ fontSize: 14, color: 'hsl(215,15%,55%)' }}>{CLIENTS.length} clients registered on the platform</p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px',
          borderRadius: 8, fontSize: 14, fontWeight: 600,
          background: C.primary, color: '#fff', border: 'none', cursor: 'pointer',
          boxShadow: '0 2px 10px rgba(2,147,228,0.3)', transition: 'all 0.15s',
        }}>
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients..." style={{
            width: '100%', background: 'hsl(224,14%,10%)', border: `1px solid hsl(224,14%,16%)`,
            borderRadius: 8, padding: '8px 12px 8px 34px', fontSize: 13,
            color: 'hsl(210,20%,85%)', fontFamily: 'Manrope, sans-serif', outline: 'none',
          }}
            onFocus={e => e.target.style.borderColor = 'rgba(2,147,228,0.4)'}
            onBlur={e => e.target.style.borderColor = 'hsl(224,14%,16%)'}
          />
        </div>
        <select value={planFilter} onChange={e => setPlanFilter(e.target.value)} style={{
          background: 'hsl(224,14%,10%)', border: `1px solid hsl(224,14%,16%)`, borderRadius: 8,
          padding: '8px 12px', fontSize: 13, color: 'hsl(210,20%,85%)', fontFamily: 'Manrope, sans-serif',
          outline: 'none', cursor: 'pointer',
        }}>
          <option value="all">All Plans</option>
          <option value="Free">Free</option>
          <option value="Pro">Pro</option>
          <option value="Enterprise">Enterprise</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{
          background: 'hsl(224,14%,10%)', border: `1px solid hsl(224,14%,16%)`, borderRadius: 8,
          padding: '8px 12px', fontSize: 13, color: 'hsl(210,20%,85%)', fontFamily: 'Manrope, sans-serif',
          outline: 'none', cursor: 'pointer',
        }}>
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="trial">Trial</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: 'hsl(224,18%,8%)', border: `1px solid hsl(224,14%,14%)`, borderRadius: 12, overflow: 'hidden' }}>
        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 120px', gap: 0, padding: '12px 20px', borderBottom: `1px solid hsl(224,14%,12%)`, background: 'hsl(224,14%,10%)' }}>
          {['Client', 'Plan', 'Sent', 'Delivery', 'Channels', 'Status', 'Actions'].map(h => (
            <div key={h} style={{ fontSize: 11, fontWeight: 600, color: 'hsl(215,15%,50%)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>
        {/* Rows */}
        {filtered.map((c, i) => (
          <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 120px', gap: 0, padding: '14px 20px', borderBottom: i < filtered.length - 1 ? `1px solid hsl(224,14%,11%)` : 'none', alignItems: 'center', transition: 'background 0.15s', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.background = 'hsl(224,14%,10%)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            onClick={() => setSelected(selected === c.id ? null : c.id)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: `hsl(${(c.id * 47) % 360},40%,18%)`, border: `1px solid hsl(${(c.id * 47) % 360},30%,25%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: `hsl(${(c.id * 47) % 360},60%,65%)` }}>{c.name[0]}</span>
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'hsl(210,20%,90%)', marginBottom: 2 }}>{c.name}</p>
                <p style={{ fontSize: 12, color: 'hsl(215,15%,50%)' }}>{c.email}</p>
              </div>
            </div>
            <div><Badge label={c.plan} colors={PLAN_COLORS[c.plan]} /></div>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'hsl(210,20%,85%)' }}>{c.sent}</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: parseFloat(c.deliveryRate) >= 99 ? C.success : parseFloat(c.deliveryRate) >= 97 ? C.warning : C.destructive }}>{c.deliveryRate}</p>
            <div style={{ display: 'flex', gap: 4 }}>{c.channels.map(ch => <ChannelTag key={ch} ch={ch} />)}</div>
            <div><Badge label={c.status} colors={STATUS_COLORS[c.status]} /></div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button title="View" style={{ width: 28, height: 28, borderRadius: 6, background: 'hsl(224,14%,13%)', border: `1px solid hsl(224,14%,18%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(2,147,228,0.35)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'hsl(224,14%,18%)'}
              >
                <Icon name="eye" size={13} color="hsl(215,15%,55%)" />
              </button>
              <button title="Edit" style={{ width: 28, height: 28, borderRadius: 6, background: 'hsl(224,14%,13%)', border: `1px solid hsl(224,14%,18%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(2,147,228,0.35)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'hsl(224,14%,18%)'}
              >
                <Icon name="edit" size={13} color="hsl(215,15%,55%)" />
              </button>
              <button title="More" style={{ width: 28, height: 28, borderRadius: 6, background: 'hsl(224,14%,13%)', border: `1px solid hsl(224,14%,18%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(2,147,228,0.35)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'hsl(224,14%,18%)'}
              >
                <Icon name="moreH" size={13} color="hsl(215,15%,55%)" />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <Icon name="search" size={32} color="hsl(215,15%,35%)" />
            <p style={{ color: 'hsl(215,15%,50%)', marginTop: 12, fontSize: 14 }}>No clients match your search</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
        <p style={{ fontSize: 13, color: 'hsl(215,15%,50%)' }}>Showing {filtered.length} of {CLIENTS.length} clients</p>
        <div style={{ display: 'flex', gap: 6 }}>
          {[1, 2, 3].map(p => (
            <button key={p} style={{ width: 32, height: 32, borderRadius: 7, background: p === 1 ? 'rgba(2,147,228,0.15)' : 'hsl(224,14%,10%)', border: `1px solid ${p === 1 ? 'rgba(2,147,228,0.3)' : 'hsl(224,14%,16%)'}`, color: p === 1 ? '#36A9EA' : 'hsl(215,15%,55%)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{p}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
