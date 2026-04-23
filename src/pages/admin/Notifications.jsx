import { useState } from 'react'
import Icon from '../../components/Icon'
import { C } from '../../design'

const LOGS = [
  { id: 'nf_001', client: 'Acme Corp', to: 'alice@acme.com', channel: 'email', template: 'welcome-v2', status: 'delivered', time: '2 min ago', latency: '38ms' },
  { id: 'nf_002', client: 'TechStart', to: '+1 555 0123', channel: 'sms', template: 'otp-code', status: 'delivered', time: '5 min ago', latency: '120ms' },
  { id: 'nf_003', client: 'Flowbase', to: 'bob@flowbase.co', channel: 'email', template: 'invoice-paid', status: 'failed', time: '12 min ago', latency: '—' },
  { id: 'nf_004', client: 'Stackr', to: 'user_8821', channel: 'push', template: 'activity-digest', status: 'delivered', time: '20 min ago', latency: '55ms' },
  { id: 'nf_005', client: 'Cloudnova', to: 'ops@cloudnova.io', channel: 'email', template: 'usage-alert', status: 'delivered', time: '32 min ago', latency: '42ms' },
  { id: 'nf_006', client: 'DevTools Co', to: 'dev@devtools.co', channel: 'email', template: 'trial-ending', status: 'pending', time: '45 min ago', latency: '—' },
  { id: 'nf_007', client: 'PingApp', to: 'user_1024', channel: 'push', template: 'new-message', status: 'delivered', time: '1h ago', latency: '61ms' },
  { id: 'nf_008', client: 'Launchpad', to: 'admin@launchpad.dev', channel: 'email', template: 'password-reset', status: 'bounced', time: '1h 20m ago', latency: '—' },
]

const STATUS_COLORS = {
  delivered: { bg: 'rgba(39,174,96,0.12)', border: 'rgba(39,174,96,0.2)', color: 'hsl(152,60%,50%)' },
  failed: { bg: 'rgba(231,76,60,0.12)', border: 'rgba(231,76,60,0.2)', color: 'hsl(0,62%,60%)' },
  pending: { bg: 'rgba(243,156,18,0.12)', border: 'rgba(243,156,18,0.2)', color: 'hsl(38,92%,55%)' },
  bounced: { bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.2)', color: 'hsl(260,60%,65%)' },
}

function StatusBadge({ status }) {
  const s = STATUS_COLORS[status] || STATUS_COLORS.pending
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 9999, background: s.bg, border: `1px solid ${s.border}`, fontSize: 11, fontWeight: 600, color: s.color }}>
      <div style={{ width: 5, height: 5, borderRadius: '50%', background: s.color }} />
      {status}
    </span>
  )
}

const CHANNEL_ICONS = { email: 'mail', sms: 'sms', push: 'bell', 'in-app': 'layers' }

export default function Notifications() {
  const [search, setSearch] = useState('')
  const [channel, setChannel] = useState('all')
  const [status, setStatus] = useState('all')
  const [showSend, setShowSend] = useState(false)
  const [form, setForm] = useState({ to: '', channel: 'email', template: '', client: '' })

  const filtered = LOGS.filter(l => {
    const matchSearch = l.client.toLowerCase().includes(search.toLowerCase()) || l.to.toLowerCase().includes(search.toLowerCase()) || l.template.toLowerCase().includes(search.toLowerCase())
    const matchChannel = channel === 'all' || l.channel === channel
    const matchStatus = status === 'all' || l.status === status
    return matchSearch && matchChannel && matchStatus
  })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'hsl(210,20%,95%)', letterSpacing: '-0.02em', marginBottom: 4 }}>Notifications</h1>
          <p style={{ fontSize: 14, color: 'hsl(215,15%,55%)' }}>Send notifications and view delivery logs</p>
        </div>
        <button onClick={() => setShowSend(true)} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px',
          borderRadius: 8, fontSize: 14, fontWeight: 600,
          background: C.primary, color: '#fff', border: 'none', cursor: 'pointer',
          boxShadow: '0 2px 10px rgba(2,147,228,0.3)',
        }}>
          <Icon name="send" size={15} color="#fff" />
          Send Notification
        </button>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { icon: 'send', label: 'Sent Today', value: '12,480', color: C.primary400 },
          { icon: 'check', label: 'Delivered', value: '12,319', color: C.success },
          { icon: 'x', label: 'Failed', value: '98', color: C.destructive },
          { icon: 'activity', label: 'Pending', value: '63', color: C.warning },
        ].map(s => (
          <div key={s.label} style={{ background: 'hsl(224,18%,8%)', border: `1px solid hsl(224,14%,14%)`, borderRadius: 12, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: 'hsl(224,14%,12%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={s.icon} size={16} color={s.color} />
            </div>
            <div>
              <p style={{ fontSize: 20, fontWeight: 700, color: 'hsl(210,20%,92%)', letterSpacing: '-0.02em' }}>{s.value}</p>
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notifications..." style={{
            width: '100%', background: 'hsl(224,14%,10%)', border: `1px solid hsl(224,14%,16%)`,
            borderRadius: 8, padding: '8px 12px 8px 34px', fontSize: 13,
            color: 'hsl(210,20%,85%)', fontFamily: 'Manrope, sans-serif', outline: 'none',
          }} />
        </div>
        {[
          { value: channel, setValue: setChannel, opts: [['all', 'All Channels'], ['email', 'Email'], ['sms', 'SMS'], ['push', 'Push']] },
          { value: status, setValue: setStatus, opts: [['all', 'All Statuses'], ['delivered', 'Delivered'], ['failed', 'Failed'], ['pending', 'Pending'], ['bounced', 'Bounced']] },
        ].map((sel, i) => (
          <select key={i} value={sel.value} onChange={e => sel.setValue(e.target.value)} style={{
            background: 'hsl(224,14%,10%)', border: `1px solid hsl(224,14%,16%)`, borderRadius: 8,
            padding: '8px 12px', fontSize: 13, color: 'hsl(210,20%,85%)', fontFamily: 'Manrope, sans-serif', outline: 'none', cursor: 'pointer',
          }}>
            {sel.opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        ))}
      </div>

      {/* Log table */}
      <div style={{ background: 'hsl(224,18%,8%)', border: `1px solid hsl(224,14%,14%)`, borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1.5fr 80px 1fr 90px 70px', padding: '12px 20px', background: 'hsl(224,14%,10%)', borderBottom: `1px solid hsl(224,14%,12%)` }}>
          {['ID', 'Client', 'To / Template', 'Channel', 'Status', 'Latency', 'Time'].map(h => (
            <div key={h} style={{ fontSize: 11, fontWeight: 600, color: 'hsl(215,15%,50%)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>
        {filtered.map((l, i) => (
          <div key={l.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1.5fr 80px 1fr 90px 70px', padding: '13px 20px', borderBottom: i < filtered.length - 1 ? `1px solid hsl(224,14%,11%)` : 'none', alignItems: 'center', transition: 'background 0.15s', cursor: 'default' }}
            onMouseEnter={e => e.currentTarget.style.background = 'hsl(224,14%,10%)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'hsl(215,15%,55%)' }}>{l.id}</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'hsl(210,20%,85%)' }}>{l.client}</span>
            <div>
              <p style={{ fontSize: 13, color: 'hsl(210,20%,85%)' }}>{l.to}</p>
              <p style={{ fontSize: 11, color: 'hsl(215,15%,50%)', fontFamily: 'JetBrains Mono' }}>{l.template}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Icon name={CHANNEL_ICONS[l.channel] || 'bell'} size={13} color="hsl(215,15%,55%)" />
              <span style={{ fontSize: 12, color: 'hsl(215,15%,60%)', textTransform: 'capitalize' }}>{l.channel}</span>
            </div>
            <StatusBadge status={l.status} />
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: l.latency === '—' ? 'hsl(215,15%,40%)' : C.success }}>{l.latency}</span>
            <span style={{ fontSize: 12, color: 'hsl(215,15%,45%)' }}>{l.time}</span>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <Icon name="bell" size={32} color="hsl(215,15%,30%)" />
            <p style={{ color: 'hsl(215,15%,50%)', marginTop: 12, fontSize: 14 }}>No notifications found</p>
          </div>
        )}
      </div>

      {/* Send modal */}
      {showSend && (
        <div onClick={() => setShowSend(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'hsl(224,18%,9%)', border: `1px solid hsl(224,14%,16%)`, borderRadius: 16, padding: '28px', width: 480, boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'hsl(210,20%,95%)' }}>Send Notification</h2>
              <button onClick={() => setShowSend(false)} style={{ width: 30, height: 30, borderRadius: 7, background: 'hsl(224,14%,14%)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'hsl(215,15%,55%)' }}>
                <Icon name="x" size={15} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Client', field: 'client', placeholder: 'Select or type client name' },
                { label: 'Recipient', field: 'to', placeholder: 'email@example.com or phone number' },
                { label: 'Template', field: 'template', placeholder: 'e.g. welcome-v2' },
              ].map(f => (
                <div key={f.field}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'hsl(210,20%,80%)', marginBottom: 8 }}>{f.label}</label>
                  <input value={form[f.field]} onChange={e => setForm(prev => ({ ...prev, [f.field]: e.target.value }))} placeholder={f.placeholder} style={{
                    width: '100%', background: 'hsl(224,14%,12%)', border: `1px solid hsl(224,14%,18%)`,
                    borderRadius: 8, padding: '10px 14px', fontSize: 13,
                    color: 'hsl(210,20%,90%)', fontFamily: 'Manrope, sans-serif', outline: 'none',
                  }}
                    onFocus={e => e.target.style.borderColor = 'rgba(2,147,228,0.4)'}
                    onBlur={e => e.target.style.borderColor = 'hsl(224,14%,18%)'}
                  />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'hsl(210,20%,80%)', marginBottom: 8 }}>Channel</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['email', 'sms', 'push'].map(ch => (
                    <button key={ch} onClick={() => setForm(prev => ({ ...prev, channel: ch }))} style={{
                      flex: 1, padding: '9px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                      background: form.channel === ch ? 'rgba(2,147,228,0.15)' : 'hsl(224,14%,12%)',
                      border: `1px solid ${form.channel === ch ? 'rgba(2,147,228,0.4)' : 'hsl(224,14%,18%)'}`,
                      color: form.channel === ch ? '#36A9EA' : 'hsl(215,15%,55%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}>
                      <Icon name={CHANNEL_ICONS[ch]} size={14} color={form.channel === ch ? '#36A9EA' : 'hsl(215,15%,55%)'} />
                      {ch.charAt(0).toUpperCase() + ch.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button onClick={() => setShowSend(false)} style={{ flex: 1, padding: '11px', borderRadius: 8, background: 'transparent', border: `1px solid hsl(224,14%,20%)`, color: 'hsl(215,15%,60%)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => setShowSend(false)} style={{ flex: 2, padding: '11px', borderRadius: 8, background: C.primary, border: 'none', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 12px rgba(2,147,228,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Icon name="send" size={15} color="#fff" /> Send Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
