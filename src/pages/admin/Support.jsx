import { useState } from 'react'
import Icon from '../../components/Icon'
import { C } from '../../design'

const TICKETS = [
  {
    id: 'TKT-001',
    client: 'Acme Corp',
    subject: 'Email delivery delay for EU region',
    priority: 'high',
    status: 'open',
    assignee: 'Admin',
    created: '1h ago',
    messages: 3,
  },
  {
    id: 'TKT-002',
    client: 'TechStart',
    subject: 'API rate limit exceeded error',
    priority: 'critical',
    status: 'in-progress',
    assignee: 'Admin',
    created: '3h ago',
    messages: 7,
  },
  {
    id: 'TKT-003',
    client: 'Flowbase',
    subject: 'Template variable not rendering',
    priority: 'medium',
    status: 'open',
    assignee: null,
    created: '5h ago',
    messages: 1,
  },
  {
    id: 'TKT-004',
    client: 'PingApp',
    subject: 'Push notifications not delivered on iOS',
    priority: 'high',
    status: 'in-progress',
    assignee: 'Admin',
    created: 'Yesterday',
    messages: 12,
  },
  {
    id: 'TKT-005',
    client: 'DevTools Co',
    subject: 'Webhook signature verification failing',
    priority: 'medium',
    status: 'resolved',
    assignee: 'Admin',
    created: '2 days ago',
    messages: 5,
  },
  {
    id: 'TKT-006',
    client: 'Launchpad',
    subject: 'Request to upgrade to Pro plan',
    priority: 'low',
    status: 'open',
    assignee: null,
    created: '2 days ago',
    messages: 2,
  },
  {
    id: 'TKT-007',
    client: 'Stackr',
    subject: 'Custom domain DKIM verification issue',
    priority: 'high',
    status: 'resolved',
    assignee: 'Admin',
    created: '3 days ago',
    messages: 9,
  },
]

const PRIORITY_COLORS = {
  critical: { bg: 'rgba(231,76,60,0.15)', border: 'rgba(231,76,60,0.3)', color: 'hsl(0,62%,62%)' },
  high: { bg: 'rgba(243,156,18,0.12)', border: 'rgba(243,156,18,0.25)', color: 'hsl(38,92%,55%)' },
  medium: { bg: 'rgba(2,147,228,0.1)', border: 'rgba(2,147,228,0.2)', color: '#36A9EA' },
  low: { bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.2)', color: 'hsl(215,15%,60%)' },
}

const STATUS_COLORS = {
  open: { bg: 'rgba(243,156,18,0.12)', border: 'rgba(243,156,18,0.2)', color: 'hsl(38,92%,55%)' },
  'in-progress': { bg: 'rgba(2,147,228,0.12)', border: 'rgba(2,147,228,0.2)', color: '#36A9EA' },
  resolved: {
    bg: 'rgba(39,174,96,0.12)',
    border: 'rgba(39,174,96,0.2)',
    color: 'hsl(152,60%,50%)',
  },
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

export default function Support() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [reply, setReply] = useState('')

  const filtered = TICKETS.filter(
    (t) =>
      (statusFilter === 'all' || t.status === statusFilter) &&
      (priorityFilter === 'all' || t.priority === priorityFilter)
  )

  const selectedTicket = TICKETS.find((t) => t.id === selected)

  return (
    <div>
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
            Support
          </h1>
          <p style={{ fontSize: 14, color: 'hsl(215,15%,55%)' }}>Manage client support tickets and issues</p>
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
          New Ticket
        </button>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          {
            label: 'Open',
            value: TICKETS.filter((t) => t.status === 'open').length,
            color: 'hsl(38,92%,55%)',
          },
          {
            label: 'In Progress',
            value: TICKETS.filter((t) => t.status === 'in-progress').length,
            color: '#36A9EA',
          },
          {
            label: 'Resolved',
            value: TICKETS.filter((t) => t.status === 'resolved').length,
            color: 'hsl(152,60%,50%)',
          },
          {
            label: 'Critical',
            value: TICKETS.filter((t) => t.priority === 'critical').length,
            color: 'hsl(0,62%,60%)',
          },
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
            <p
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: s.color,
                letterSpacing: '-0.02em',
                marginBottom: 4,
              }}
            >
              {s.value}
            </p>
            <p style={{ fontSize: 13, color: 'hsl(215,15%,55%)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {['all', 'open', 'in-progress', 'resolved'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            style={{
              padding: '7px 14px',
              borderRadius: 7,
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              background: statusFilter === s ? 'rgba(2,147,228,0.15)' : 'hsl(224,14%,10%)',
              border: `1px solid ${statusFilter === s ? 'rgba(2,147,228,0.3)' : 'hsl(224,14%,16%)'}`,
              color: statusFilter === s ? '#36A9EA' : 'hsl(215,15%,55%)',
              transition: 'all 0.15s',
            }}
          >
            {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        <div
          style={{
            marginLeft: 8,
            borderLeft: `1px solid hsl(224,14%,18%)`,
            paddingLeft: 8,
            display: 'flex',
            gap: 8,
          }}
        >
          {['all', 'critical', 'high', 'medium', 'low'].map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              style={{
                padding: '7px 12px',
                borderRadius: 7,
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                background: priorityFilter === p ? 'rgba(2,147,228,0.1)' : 'transparent',
                border: `1px solid ${priorityFilter === p ? 'rgba(2,147,228,0.25)' : 'hsl(224,14%,16%)'}`,
                color: priorityFilter === p ? '#36A9EA' : 'hsl(215,15%,55%)',
              }}
            >
              {p === 'all' ? 'All priority' : p}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 16 }}>
        {/* Ticket list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelected(selected === t.id ? null : t.id)}
              style={{
                background: selected === t.id ? 'hsl(224,18%,10%)' : 'hsl(224,18%,8%)',
                border: `1px solid ${selected === t.id ? 'rgba(2,147,228,0.3)' : 'hsl(224,14%,14%)'}`,
                borderRadius: 12,
                padding: '16px 18px',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                if (selected !== t.id) {
                  e.currentTarget.style.background = 'hsl(224,14%,10%)'
                  e.currentTarget.style.borderColor = 'rgba(2,147,228,0.15)'
                }
              }}
              onMouseLeave={(e) => {
                if (selected !== t.id) {
                  e.currentTarget.style.background = 'hsl(224,18%,8%)'
                  e.currentTarget.style.borderColor = 'hsl(224,14%,14%)'
                }
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 8,
                }}
              >
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span
                    style={{
                      fontFamily: 'JetBrains Mono',
                      fontSize: 11,
                      color: 'hsl(215,15%,45%)',
                    }}
                  >
                    {t.id}
                  </span>
                  <Badge label={t.priority} colors={PRIORITY_COLORS[t.priority]} />
                  <Badge label={t.status} colors={STATUS_COLORS[t.status]} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="sms" size={13} color="hsl(215,15%,45%)" />
                  <span style={{ fontSize: 12, color: 'hsl(215,15%,45%)' }}>{t.messages}</span>
                </div>
              </div>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'hsl(210,20%,90%)',
                  marginBottom: 6,
                }}
              >
                {t.subject}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 5,
                      background: 'hsl(224,14%,16%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#36A9EA' }}>{t.client[0]}</span>
                  </div>
                  <span style={{ fontSize: 13, color: 'hsl(215,15%,60%)' }}>{t.client}</span>
                </div>
                <span style={{ fontSize: 12, color: 'hsl(215,15%,45%)' }}>{t.created}</span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div
              style={{
                padding: 48,
                textAlign: 'center',
                background: 'hsl(224,18%,8%)',
                borderRadius: 12,
                border: `1px solid hsl(224,14%,14%)`,
              }}
            >
              <Icon name="help" size={32} color="hsl(215,15%,30%)" />
              <p style={{ color: 'hsl(215,15%,50%)', marginTop: 12, fontSize: 14 }}>No tickets match your filter</p>
            </div>
          )}
        </div>

        {/* Ticket detail */}
        {selectedTicket && (
          <div
            style={{
              background: 'hsl(224,18%,8%)',
              border: `1px solid hsl(224,14%,14%)`,
              borderRadius: 12,
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 16,
                paddingBottom: 16,
                borderBottom: `1px solid hsl(224,14%,13%)`,
              }}
            >
              <div>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'hsl(215,15%,45%)' }}>
                  {selectedTicket.id}
                </span>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'hsl(210,20%,92%)', marginTop: 4 }}>
                  {selectedTicket.subject}
                </h3>
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{
                  width: 28,
                  height: 28,
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
                <Icon name="x" size={14} />
              </button>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <select
                defaultValue={selectedTicket.status}
                style={{
                  flex: 1,
                  background: 'hsl(224,14%,12%)',
                  border: `1px solid hsl(224,14%,18%)`,
                  borderRadius: 7,
                  padding: '7px 10px',
                  fontSize: 13,
                  color: 'hsl(210,20%,85%)',
                  fontFamily: 'Manrope, sans-serif',
                  outline: 'none',
                }}
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
              <select
                defaultValue={selectedTicket.priority}
                style={{
                  flex: 1,
                  background: 'hsl(224,14%,12%)',
                  border: `1px solid hsl(224,14%,18%)`,
                  borderRadius: 7,
                  padding: '7px 10px',
                  fontSize: 13,
                  color: 'hsl(210,20%,85%)',
                  fontFamily: 'Manrope, sans-serif',
                  outline: 'none',
                }}
              >
                <option value="low">Low priority</option>
                <option value="medium">Medium priority</option>
                <option value="high">High priority</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            {/* Conversation */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                marginBottom: 16,
                overflowY: 'auto',
                maxHeight: 280,
              }}
            >
              {[
                {
                  from: selectedTicket.client,
                  msg: `Hi, we're experiencing ${selectedTicket.subject.toLowerCase()}. Can you help?`,
                  time: selectedTicket.created,
                  isClient: true,
                },
                {
                  from: 'Admin',
                  msg: "Thanks for reaching out. I'm looking into this issue for you right now.",
                  time: 'Just now',
                  isClient: false,
                },
              ].map((m, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: 10,
                    alignItems: 'flex-start',
                    flexDirection: m.isClient ? 'row' : 'row-reverse',
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 7,
                      background: m.isClient ? 'hsl(224,14%,16%)' : 'rgba(2,147,228,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: m.isClient ? 'hsl(215,15%,60%)' : '#36A9EA',
                      }}
                    >
                      {m.from[0]}
                    </span>
                  </div>
                  <div style={{ maxWidth: '80%' }}>
                    <div
                      style={{
                        display: 'flex',
                        gap: 8,
                        alignItems: 'center',
                        marginBottom: 4,
                        flexDirection: m.isClient ? 'row' : 'row-reverse',
                      }}
                    >
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'hsl(210,20%,80%)' }}>{m.from}</span>
                      <span style={{ fontSize: 11, color: 'hsl(215,15%,45%)' }}>{m.time}</span>
                    </div>
                    <div
                      style={{
                        background: m.isClient ? 'hsl(224,14%,12%)' : 'rgba(2,147,228,0.1)',
                        border: `1px solid ${m.isClient ? 'hsl(224,14%,16%)' : 'rgba(2,147,228,0.2)'}`,
                        borderRadius: 9,
                        padding: '10px 14px',
                        fontSize: 13,
                        color: 'hsl(210,20%,85%)',
                        lineHeight: 1.5,
                      }}
                    >
                      {m.msg}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply */}
            <div style={{ borderTop: `1px solid hsl(224,14%,13%)`, paddingTop: 14 }}>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your reply..."
                rows={3}
                style={{
                  width: '100%',
                  background: 'hsl(224,14%,11%)',
                  border: `1px solid hsl(224,14%,18%)`,
                  borderRadius: 9,
                  padding: '10px 14px',
                  fontSize: 13,
                  color: 'hsl(210,20%,90%)',
                  fontFamily: 'Manrope, sans-serif',
                  outline: 'none',
                  resize: 'none',
                  lineHeight: 1.5,
                  marginBottom: 10,
                }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(2,147,228,0.4)')}
                onBlur={(e) => (e.target.style.borderColor = 'hsl(224,14%,18%)')}
              />
              <button
                onClick={() => setReply('')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '9px 18px',
                  borderRadius: 8,
                  background: C.primary,
                  border: 'none',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Icon name="send" size={14} color="#fff" /> Send Reply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
