import { useState } from 'react'
import Icon from '../../components/Icon'
import { C } from '../../design'

const TEMPLATES = [
  {
    id: 1,
    name: 'welcome-v2',
    channel: 'email',
    client: 'Global',
    uses: 8420,
    status: 'active',
    updated: '2 days ago',
    tags: ['onboarding'],
  },
  {
    id: 2,
    name: 'otp-code',
    channel: 'sms',
    client: 'Global',
    uses: 31200,
    status: 'active',
    updated: '5 days ago',
    tags: ['auth'],
  },
  {
    id: 3,
    name: 'invoice-paid',
    channel: 'email',
    client: 'Acme Corp',
    uses: 1840,
    status: 'active',
    updated: '1 week ago',
    tags: ['billing'],
  },
  {
    id: 4,
    name: 'password-reset',
    channel: 'email',
    client: 'Global',
    uses: 5620,
    status: 'active',
    updated: '3 days ago',
    tags: ['auth'],
  },
  {
    id: 5,
    name: 'activity-digest',
    channel: 'push',
    client: 'Stackr',
    uses: 22100,
    status: 'active',
    updated: 'Today',
    tags: ['digest'],
  },
  {
    id: 6,
    name: 'usage-alert',
    channel: 'email',
    client: 'Cloudnova',
    uses: 340,
    status: 'draft',
    updated: 'Yesterday',
    tags: ['alerts'],
  },
  {
    id: 7,
    name: 'trial-ending',
    channel: 'email',
    client: 'Global',
    uses: 920,
    status: 'active',
    updated: '4 days ago',
    tags: ['billing'],
  },
  {
    id: 8,
    name: 'new-message',
    channel: 'push',
    client: 'PingApp',
    uses: 18400,
    status: 'active',
    updated: 'Today',
    tags: ['engagement'],
  },
  {
    id: 9,
    name: 'weekly-report',
    channel: 'email',
    client: 'Flowbase',
    uses: 620,
    status: 'draft',
    updated: 'Yesterday',
    tags: ['digest'],
  },
]

const CHANNEL_COLORS = {
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
}

export default function Templates() {
  const [search, setSearch] = useState('')
  const [channelF, setChannelF] = useState('all')

  const filtered = TEMPLATES.filter(
    (t) =>
      (channelF === 'all' || t.channel === channelF) &&
      (t.name.includes(search.toLowerCase()) || t.client.toLowerCase().includes(search.toLowerCase()))
  )

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
        {[
          { label: 'Total Templates', value: TEMPLATES.length, icon: 'layers' },
          {
            label: 'Active',
            value: TEMPLATES.filter((t) => t.status === 'active').length,
            icon: 'check',
          },
          {
            label: 'Drafts',
            value: TEMPLATES.filter((t) => t.status === 'draft').length,
            icon: 'edit',
          },
        ].map((s) => (
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
              }}
            >
              <Icon name={s.icon} size={16} color="#36A9EA" />
            </div>
            <div>
              <p
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: 'hsl(210,20%,92%)',
                  letterSpacing: '-0.02em',
                }}
              >
                {s.value}
              </p>
              <p style={{ fontSize: 12, color: 'hsl(215,15%,55%)' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div style={{ position: 'relative', flex: 1 }}>
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
        <div style={{ display: 'flex', gap: 6 }}>
          {['all', 'email', 'sms', 'push'].map((ch) => (
            <button
              key={ch}
              onClick={() => setChannelF(ch)}
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                background: channelF === ch ? 'rgba(2,147,228,0.15)' : 'hsl(224,14%,10%)',
                border: `1px solid ${channelF === ch ? 'rgba(2,147,228,0.3)' : 'hsl(224,14%,16%)'}`,
                color: channelF === ch ? '#36A9EA' : 'hsl(215,15%,55%)',
                transition: 'all 0.15s',
                textTransform: ch === 'all' ? 'none' : 'capitalize',
              }}
            >
              {ch === 'all' ? 'All' : ch.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Template grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {filtered.map((t) => {
          const ch = CHANNEL_COLORS[t.channel]
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
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
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
    </div>
  )
}
