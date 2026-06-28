import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import { C, container } from '../design'

// ── Code Snippet ────────────────────────────────────────────
function CodeSnippet() {
  const [tab, setTab] = useState('node')
  const snippets = {
    node: [
      { t: 'keyword', v: 'import' },
      { t: 'plain', v: ' { Notify } ' },
      { t: 'keyword', v: 'from' },
      { t: 'string', v: " 'notify-sdk'" },
      { t: 'plain', v: ';' },
      { t: 'newline' },
      { t: 'newline' },
      { t: 'keyword', v: 'const' },
      { t: 'plain', v: ' notify = ' },
      { t: 'keyword', v: 'new' },
      { t: 'plain', v: ' Notify({' },
      { t: 'newline' },
      { t: 'plain', v: '  apiKey: ' },
      { t: 'string', v: '"nf_live_••••••••••••"' },
      { t: 'newline' },
      { t: 'plain', v: '});' },
      { t: 'newline' },
      { t: 'newline' },
      { t: 'comment', v: '// Send across any channel' },
      { t: 'newline' },
      { t: 'keyword', v: 'await' },
      { t: 'plain', v: ' notify.' },
      { t: 'fn', v: 'send' },
      { t: 'plain', v: '({' },
      { t: 'newline' },
      { t: 'plain', v: '  to: ' },
      { t: 'string', v: '"user@example.com"' },
      { t: 'plain', v: ',' },
      { t: 'newline' },
      { t: 'plain', v: '  channel: ' },
      { t: 'string', v: '"email"' },
      { t: 'plain', v: ',' },
      { t: 'newline' },
      { t: 'plain', v: '  template: ' },
      { t: 'string', v: '"welcome-v2"' },
      { t: 'plain', v: ',' },
      { t: 'newline' },
      { t: 'plain', v: '  data: { name: ' },
      { t: 'string', v: '"Alice"' },
      { t: 'plain', v: ' }' },
      { t: 'newline' },
      { t: 'plain', v: '});' },
    ],
    python: [
      { t: 'keyword', v: 'from' },
      { t: 'plain', v: ' notify ' },
      { t: 'keyword', v: 'import' },
      { t: 'plain', v: ' Notify' },
      { t: 'newline' },
      { t: 'newline' },
      { t: 'plain', v: 'notify = Notify(' },
      { t: 'string', v: '"nf_live_••••••••••••"' },
      { t: 'plain', v: ')' },
      { t: 'newline' },
      { t: 'newline' },
      { t: 'comment', v: '# Send across any channel' },
      { t: 'newline' },
      { t: 'plain', v: 'notify.' },
      { t: 'fn', v: 'send' },
      { t: 'plain', v: '(' },
      { t: 'newline' },
      { t: 'plain', v: '  to=' },
      { t: 'string', v: '"user@example.com"' },
      { t: 'plain', v: ',' },
      { t: 'newline' },
      { t: 'plain', v: '  channel=' },
      { t: 'string', v: '"email"' },
      { t: 'plain', v: ',' },
      { t: 'newline' },
      { t: 'plain', v: '  template=' },
      { t: 'string', v: '"welcome-v2"' },
      { t: 'newline' },
      { t: 'plain', v: ')' },
    ],
    curl: [
      { t: 'fn', v: 'curl' },
      { t: 'plain', v: ' -X POST \\' },
      { t: 'newline' },
      { t: 'plain', v: '  https://api.notify.io/v1/' },
      { t: 'fn', v: 'send' },
      { t: 'plain', v: ' \\' },
      { t: 'newline' },
      { t: 'plain', v: '  -H ' },
      { t: 'string', v: '"Authorization: Bearer nf_live_••••"' },
      { t: 'plain', v: ' \\' },
      { t: 'newline' },
      { t: 'plain', v: '  -d ' },
      { t: 'string', v: '\'{"to":"user@example.com",' },
      { t: 'newline' },
      { t: 'string', v: '    "channel":"email",' },
      { t: 'newline' },
      { t: 'string', v: '    "template":"welcome-v2"}\'' },
    ],
  }

  const tokenColors = {
    keyword: '#66BEEE',
    string: 'hsl(38,92%,65%)',
    fn: C.primary400,
    comment: 'hsl(215,15%,45%)',
    plain: C.fg,
  }
  const tokens = snippets[tab]

  let lines = [[]]
  tokens.forEach((t) => {
    if (t.t === 'newline') lines.push([])
    else lines[lines.length - 1].push(t)
  })

  return (
    <div
      style={{
        background: 'hsl(224,20%,6%)',
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        overflow: 'hidden',
        fontFamily: 'JetBrains Mono, monospace',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: `1px solid ${C.border}`,
          background: 'hsl(224,18%,7%)',
        }}
      >
        <div style={{ display: 'flex', gap: 6 }}>
          {['#EC6A5E', '#F4BF4F', '#61C554'].map((c) => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {['node', 'python', 'curl'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: tab === t ? 'rgba(2,147,228,0.15)' : 'transparent',
                border: `1px solid ${tab === t ? 'rgba(2,147,228,0.3)' : 'transparent'}`,
                color: tab === t ? C.primary400 : C.fgMuted,
                fontSize: 11,
                fontWeight: 600,
                padding: '3px 10px',
                borderRadius: 5,
                fontFamily: 'Manrope, sans-serif',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div style={{ padding: '16px 20px', fontSize: 13, lineHeight: 1.8, overflow: 'hidden' }}>
        {lines.map((line, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              minHeight: '1.8em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            <span
              style={{
                color: 'hsl(215,15%,30%)',
                marginRight: 20,
                userSelect: 'none',
                minWidth: 16,
                textAlign: 'right',
                fontSize: 11,
                flexShrink: 0,
              }}
            >
              {i + 1}
            </span>
            <span style={{ whiteSpace: 'nowrap' }}>
              {line.map((tk, j) => (
                <span key={j} style={{ color: tokenColors[tk.t] }}>
                  {tk.v}
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>
      <div
        style={{
          padding: '10px 16px',
          borderTop: `1px solid ${C.border}`,
          background: 'hsl(224,18%,7%)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.success }} />
        <span style={{ fontSize: 12, color: C.success, fontFamily: 'JetBrains Mono', fontWeight: 500 }}>
          200 OK — message queued
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: C.fgMuted }}>~38ms</span>
      </div>
    </div>
  )
}

// ── Nav ─────────────────────────────────────────────────────
function Nav({ onDashboard }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? 'rgba(10,12,20,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? `1px solid ${C.border}` : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        style={{
          ...container,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/notify-logo.png" alt="Notify" style={{ width: 30, height: 30, borderRadius: 8 }} />
          <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em' }}>Notify</span>
        </div>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {['Features', 'Pricing', 'Docs', 'Blog'].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              style={{ fontSize: 14, fontWeight: 500, color: C.fgMuted, transition: 'color 0.15s' }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = C.fg)}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = C.fgMuted)}
            >
              {link}
            </a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            onClick={onDashboard}
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: C.fgMuted,
              padding: '8px 16px',
              background: 'transparent',
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = C.fg)}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = C.fgMuted)}
          >
            Sign in
          </button>
          <button
            onClick={onDashboard}
            style={{
              background: C.primary,
              color: '#fff',
              fontWeight: 600,
              fontSize: 14,
              padding: '9px 20px',
              borderRadius: 8,
              boxShadow: '0 4px 14px rgba(2,147,228,0.3)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = C.primary400
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(2,147,228,0.45)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = C.primary
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(2,147,228,0.3)'
            }}
          >
            Start for free
          </button>
        </div>
      </div>
    </nav>
  )
}

// ── Hero ─────────────────────────────────────────────────────
function Hero({ onDashboard }) {
  return (
    <section id="hero" style={{ paddingTop: 140, paddingBottom: 100, position: 'relative', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          top: -100,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 800,
          height: 600,
          background: 'radial-gradient(ellipse at center, rgba(2,147,228,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 200,
          right: -200,
          width: 500,
          height: 500,
          background: 'radial-gradient(ellipse at center, rgba(2,147,228,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div style={{ ...container, padding: '0 24px' }}>
        <div className="hero-grid">
          <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 14px',
                background: 'rgba(2,147,228,0.1)',
                border: '1px solid rgba(2,147,228,0.25)',
                borderRadius: 9999,
                width: 'fit-content',
              }}
            >
              <Icon name="zap" size={12} color={C.primary400} stroke={2} />
              <span style={{ fontSize: 12, fontWeight: 600, color: C.primary400 }}>SOC 2 Type II certified</span>
            </div>
            <div
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: 'clamp(1.7rem, 3vw, 2.8rem)',
                fontWeight: 700,
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
              }}
            >
              <div style={{ color: 'hsl(210,20%,95%)' }}>Send notifications,</div>
              <div style={{ color: C.primary400 }}>not headaches</div>
            </div>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: C.fgMuted, maxWidth: 440 }}>
              One API to send Email, SMS, Push, and in-app notifications at scale. Built for developers, loved by teams.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                onClick={onDashboard}
                style={{
                  background: C.primary,
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 15,
                  padding: '13px 28px',
                  borderRadius: 9,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 20px rgba(2,147,228,0.35)',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = C.primary400
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(2,147,228,0.5)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = C.primary
                  e.currentTarget.style.transform = ''
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(2,147,228,0.35)'
                }}
              >
                Create free account <Icon name="arrow" size={16} color="#fff" stroke={2.5} />
              </button>
              <button
                style={{
                  background: 'transparent',
                  color: C.fg,
                  fontWeight: 600,
                  fontSize: 15,
                  padding: '13px 24px',
                  borderRadius: 9,
                  border: `1px solid ${C.border}`,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(2,147,228,0.4)'
                  e.currentTarget.style.color = C.primary400
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = C.border
                  e.currentTarget.style.color = C.fg
                }}
              >
                View docs
              </button>
            </div>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {['10,000+ developers', '99.9% uptime SLA', 'Free up to 3K/mo'].map((t) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="check" size={13} color={C.success} stroke={2.5} />
                  <span style={{ fontSize: 13, color: C.fgMuted }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ minWidth: 0 }}>
            <CodeSnippet />
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Channel Strip ────────────────────────────────────────────
function ChannelStrip() {
  const channels = [
    { icon: 'mail', label: 'Email', desc: 'Transactional & marketing' },
    { icon: 'sms', label: 'SMS', desc: 'Instant text delivery' },
    { icon: 'bell', label: 'Push', desc: 'Mobile & web notifications' },
    { icon: 'layers', label: 'In-app', desc: 'Contextual UI alerts' },
  ]
  return (
    <div
      style={{
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
        padding: '32px 0',
        background: 'hsl(224,18%,7%)',
      }}
    >
      <div
        style={{
          ...container,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 24,
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: C.fgMuted,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          One API for every channel
        </span>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          {channels.map((ch) => (
            <div key={ch.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 9,
                  background: 'rgba(2,147,228,0.1)',
                  border: '1px solid rgba(2,147,228,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name={ch.icon} size={16} color={C.primary400} />
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{ch.label}</p>
                <p style={{ fontSize: 12, color: C.fgMuted }}>{ch.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Features ─────────────────────────────────────────────────
function FeatureCard({ icon, title, desc }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? 'hsl(224,18%,10%)' : C.card,
        border: `1px solid ${hov ? 'rgba(2,147,228,0.25)' : C.border}`,
        borderRadius: 12,
        padding: '28px 24px',
        transition: 'all 0.2s ease',
        boxShadow: hov ? '0 8px 24px rgba(2,147,228,0.08)' : 'none',
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: 'rgba(2,147,228,0.1)',
          border: '1px solid rgba(2,147,228,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}
      >
        <Icon name={icon} size={20} color={C.primary400} />
      </div>
      <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, letterSpacing: '-0.01em' }}>{title}</h3>
      <p style={{ fontSize: 14, lineHeight: 1.7, color: C.fgMuted }}>{desc}</p>
    </div>
  )
}

function Features() {
  const features = [
    {
      icon: 'code',
      title: 'Simple unified API',
      desc: 'One integration, every channel. Switch providers without changing a single line of code.',
    },
    {
      icon: 'layers',
      title: 'Template engine',
      desc: 'Rich drag-and-drop email editor with dynamic variables, layouts, and version history.',
    },
    {
      icon: 'chart',
      title: 'Delivery analytics',
      desc: 'Track opens, clicks, bounces, and conversions in real time across all channels.',
    },
    {
      icon: 'globe',
      title: 'Custom domains',
      desc: 'Full DKIM/SPF setup from your dashboard. Send from your own domain in minutes.',
    },
    {
      icon: 'shield',
      title: 'SOC 2 certified',
      desc: 'Enterprise-grade security with end-to-end encryption and GDPR compliance built in.',
    },
    {
      icon: 'users',
      title: 'Team management',
      desc: 'Invite members with granular RBAC. Manage multiple orgs from a single account.',
    },
    {
      icon: 'key',
      title: 'OAuth integrations',
      desc: 'Connect your existing stack — Slack, HubSpot, Segment, and more in one click.',
    },
    {
      icon: 'cpu',
      title: 'Webhooks & events',
      desc: 'Subscribe to any delivery event and build automations on top of notification data.',
    },
  ]
  return (
    <section id="features" style={{ padding: '100px 0' }}>
      <div style={container}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 12px',
              background: 'rgba(2,147,228,0.08)',
              border: '1px solid rgba(2,147,228,0.2)',
              borderRadius: 9999,
              marginBottom: 16,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: C.primary400,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Features
            </span>
          </div>
          <h2
            style={{
              fontFamily: 'Manrope',
              fontWeight: 700,
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              letterSpacing: '-0.02em',
              marginBottom: 14,
            }}
          >
            Everything you need to ship faster
          </h2>
          <p
            style={{
              fontSize: 17,
              color: C.fgMuted,
              maxWidth: 520,
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            From first API call to millions of messages — Notify handles the infrastructure so you can focus on your
            product.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ── How It Works ─────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      n: '01',
      title: 'Create your app',
      desc: 'Sign up and create an app in the dashboard. Get your API key instantly — no credit card required.',
    },
    {
      n: '02',
      title: 'Build your template',
      desc: 'Design email, SMS, or push templates using our visual editor or bring your own HTML.',
    },
    {
      n: '03',
      title: 'Send at scale',
      desc: 'Call our API, set up automations, or trigger from webhooks. We handle delivery, retry logic, and reporting.',
    },
  ]
  return (
    <section
      id="how-it-works"
      style={{
        padding: '100px 0',
        background: 'hsl(224,18%,7%)',
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <div style={container}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 12px',
              background: 'rgba(2,147,228,0.08)',
              border: '1px solid rgba(2,147,228,0.2)',
              borderRadius: 9999,
              marginBottom: 16,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: C.primary400,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              How it works
            </span>
          </div>
          <h2
            style={{
              fontFamily: 'Manrope',
              fontWeight: 700,
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              letterSpacing: '-0.02em',
            }}
          >
            Up and running in minutes
          </h2>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3,1fr)',
            gap: 0,
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 28,
              left: '16.5%',
              right: '16.5%',
              height: 1,
              background: `linear-gradient(to right, ${C.border}, rgba(2,147,228,0.3), ${C.border})`,
            }}
          />
          {steps.map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '0 32px' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  margin: '0 auto 24px',
                  background: i === 1 ? C.primary : 'hsl(224,18%,11%)',
                  border: `2px solid ${i === 1 ? C.primary : C.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  zIndex: 1,
                  boxShadow: i === 1 ? '0 0 24px rgba(2,147,228,0.3)' : 'none',
                }}
              >
                <span
                  style={{
                    fontFamily: 'JetBrains Mono',
                    fontSize: 15,
                    fontWeight: 600,
                    color: i === 1 ? '#fff' : C.fgMuted,
                  }}
                >
                  {s.n}
                </span>
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 10 }}>{s.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: C.fgMuted }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Pricing ───────────────────────────────────────────────────
function PricingCard({
  plan,
  price,
  sub,
  features,
  cta,
  highlight,
  onDashboard,
}: {
  plan: any
  price: any
  sub?: any
  features: any
  cta: any
  highlight: any
  onDashboard: any
}) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: highlight ? 'linear-gradient(160deg, hsl(224,18%,10%) 0%, hsl(224,18%,8%) 100%)' : C.card,
        border: `1px solid ${highlight ? 'rgba(2,147,228,0.4)' : hov ? 'rgba(2,147,228,0.2)' : C.border}`,
        borderRadius: 16,
        padding: '36px 32px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: highlight ? '0 0 40px rgba(2,147,228,0.1)' : 'none',
        transition: 'all 0.2s ease',
      }}
    >
      {highlight && (
        <div
          style={{
            position: 'absolute',
            top: -1,
            left: '50%',
            transform: 'translateX(-50%)',
            background: C.primary,
            color: '#fff',
            fontSize: 11,
            fontWeight: 700,
            padding: '4px 14px',
            borderRadius: '0 0 8px 8px',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          Most popular
        </div>
      )}
      <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{plan}</p>
      <div style={{ marginBottom: 6 }}>
        <span style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em' }}>{price}</span>
        {sub && <span style={{ fontSize: 14, color: C.fgMuted, marginLeft: 4 }}>{sub}</span>}
      </div>
      <p style={{ fontSize: 13, color: C.fgMuted, marginBottom: 28, lineHeight: 1.5 }}>
        {plan === 'Free' && 'Perfect for side projects and exploration.'}
        {plan === 'Pro' && 'For growing teams shipping at scale.'}
        {plan === 'Enterprise' && 'Custom volume, SLAs, and dedicated support.'}
      </p>
      <button
        onClick={onDashboard}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: 9,
          fontWeight: 700,
          fontSize: 15,
          background: highlight ? C.primary : 'transparent',
          color: highlight ? '#fff' : C.fg,
          border: `1px solid ${highlight ? C.primary : C.border}`,
          boxShadow: highlight ? '0 4px 14px rgba(2,147,228,0.3)' : 'none',
          transition: 'all 0.15s',
          marginBottom: 28,
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          if (!highlight) {
            e.currentTarget.style.borderColor = 'rgba(2,147,228,0.4)'
            e.currentTarget.style.color = C.primary400
          } else {
            e.currentTarget.style.background = C.primary400
          }
        }}
        onMouseLeave={(e) => {
          if (!highlight) {
            e.currentTarget.style.borderColor = C.border
            e.currentTarget.style.color = C.fg
          } else {
            e.currentTarget.style.background = C.primary
          }
        }}
      >
        {cta}
      </button>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {features.map((f) => (
          <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0, marginTop: 2 }}>
              <Icon name="check" size={14} color={C.success} stroke={2.5} />
            </div>
            <span style={{ fontSize: 14, color: C.fgMuted, lineHeight: 1.5 }}>{f}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Pricing({ onDashboard }) {
  const plans = [
    {
      plan: 'Free',
      price: '$0',
      highlight: false,
      cta: 'Start for free',
      features: ['3,000 emails / mo', '100 SMS / mo', '1 app', '2 team members', 'Community support'],
    },
    {
      plan: 'Pro',
      price: '$49',
      sub: '/ month',
      highlight: true,
      cta: 'Get started',
      features: [
        '50,000 emails / mo',
        '2,000 SMS / mo',
        'Unlimited apps',
        'Unlimited team members',
        'Custom domain (DKIM/SPF)',
        'Priority support',
        'Analytics & webhooks',
      ],
    },
    {
      plan: 'Enterprise',
      price: 'Custom',
      highlight: false,
      cta: 'Contact sales',
      features: [
        'Unlimited volume',
        'Dedicated IP',
        'SLA guarantee',
        'SSO / SAML',
        'Custom onboarding',
        'Dedicated account manager',
      ],
    },
  ]
  return (
    <section id="pricing" style={{ padding: '100px 0' }}>
      <div style={container}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 12px',
              background: 'rgba(2,147,228,0.08)',
              border: '1px solid rgba(2,147,228,0.2)',
              borderRadius: 9999,
              marginBottom: 16,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: C.primary400,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Pricing
            </span>
          </div>
          <h2
            style={{
              fontFamily: 'Manrope',
              fontWeight: 700,
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              letterSpacing: '-0.02em',
              marginBottom: 14,
            }}
          >
            Simple, transparent pricing
          </h2>
          <p style={{ fontSize: 17, color: C.fgMuted }}>Start for free. Scale as you grow. No surprise fees.</p>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3,1fr)',
            gap: 20,
            maxWidth: 900,
            margin: '0 auto',
          }}
        >
          {plans.map((p) => (
            <PricingCard key={p.plan} {...p} onDashboard={onDashboard} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Social Proof ──────────────────────────────────────────────
function SocialProof() {
  const stats = [
    { value: '10K+', label: 'Developers' },
    { value: '2B+', label: 'Messages delivered' },
    { value: '99.9%', label: 'Uptime SLA' },
    { value: '<40ms', label: 'Median latency' },
  ]
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'CTO, Flowbase',
      quote:
        'Notify replaced three separate vendors for us. One integration, way less ops overhead. The template editor alone saved us weeks.',
    },
    {
      name: 'Marcus Webb',
      role: 'Founder, Launchpad',
      quote:
        "We were up and running in an afternoon. The API is clean, docs are solid, and delivery rates are the best we've seen.",
    },
    {
      name: 'Priya Nair',
      role: 'Lead Engineer, Stackr',
      quote:
        'SOC 2 certification was a requirement for our enterprise customers. Notify had it ready, made procurement a non-issue.',
    },
  ]
  return (
    <section
      style={{
        padding: '100px 0',
        background: 'hsl(224,18%,7%)',
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <div style={container}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4,1fr)',
            gap: 0,
            marginBottom: 80,
            borderRadius: 14,
            overflow: 'hidden',
            border: `1px solid ${C.border}`,
          }}
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              style={{
                padding: '36px 32px',
                textAlign: 'center',
                borderRight: i < 3 ? `1px solid ${C.border}` : 'none',
                background: C.card,
              }}
            >
              <p
                style={{
                  fontFamily: 'Manrope',
                  fontSize: 'clamp(2rem, 3vw, 2.8rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  marginBottom: 6,
                  background: 'linear-gradient(135deg, #fff 0%, hsl(215,15%,70%) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {s.value}
              </p>
              <p style={{ fontSize: 14, color: C.fgMuted, fontWeight: 500 }}>{s.label}</p>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {testimonials.map((t, i) => (
            <div
              key={i}
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 14,
                padding: '28px 24px',
              }}
            >
              <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                {[...Array(5)].map((_, j) => (
                  <svg key={j} width="14" height="14" viewBox="0 0 24 24" fill={C.warning} stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.75,
                  color: 'hsl(210,15%,78%)',
                  marginBottom: 20,
                  fontStyle: 'italic',
                }}
              >
                "{t.quote}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: `hsl(${200 + i * 30},40%,20%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.primary300 }}>{t.name[0]}</span>
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</p>
                  <p style={{ fontSize: 12, color: C.fgMuted }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CTA Band ─────────────────────────────────────────────────
function CTABand({ onDashboard }) {
  return (
    <section style={{ padding: '100px 0' }}>
      <div style={{ ...container, textAlign: 'center' }}>
        <div
          style={{
            position: 'relative',
            background: 'linear-gradient(135deg, hsl(224,18%,10%) 0%, hsl(224,18%,8%) 100%)',
            border: '1px solid rgba(2,147,228,0.2)',
            borderRadius: 24,
            padding: '72px 48px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)',
              width: 600,
              height: 400,
              background: 'radial-gradient(ellipse, rgba(2,147,228,0.08) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <h2
            style={{
              fontFamily: 'Playfair Display, serif',
              fontWeight: 700,
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              letterSpacing: '-0.02em',
              marginBottom: 16,
              position: 'relative',
            }}
          >
            Start building today
          </h2>
          <p
            style={{
              fontSize: 18,
              color: C.fgMuted,
              marginBottom: 36,
              maxWidth: 480,
              margin: '0 auto 36px',
              lineHeight: 1.7,
              position: 'relative',
            }}
          >
            Free forever for small projects. No credit card. No lock-in.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', position: 'relative' }}>
            <button
              onClick={onDashboard}
              style={{
                background: C.primary,
                color: '#fff',
                fontWeight: 700,
                fontSize: 15,
                padding: '14px 32px',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 24px rgba(2,147,228,0.4)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = C.primary400
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = C.primary
                e.currentTarget.style.transform = ''
              }}
            >
              Create free account <Icon name="arrow" size={16} color="#fff" stroke={2.5} />
            </button>
            <button
              style={{
                background: 'transparent',
                color: C.fg,
                fontWeight: 600,
                fontSize: 15,
                padding: '14px 28px',
                borderRadius: 10,
                border: `1px solid ${C.border}`,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(2,147,228,0.4)'
                e.currentTarget.style.color = C.primary400
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.border
                e.currentTarget.style.color = C.fg
              }}
            >
              View pricing
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────
function Footer() {
  const cols = [
    { title: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
    { title: 'Developers', links: ['Documentation', 'API Reference', 'SDKs', 'Status'] },
    { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
    { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Security', 'GDPR'] },
  ]
  return (
    <footer
      style={{
        borderTop: `1px solid ${C.border}`,
        padding: '64px 0 40px',
        background: 'hsl(224,20%,4%)',
      }}
    >
      <div style={container}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
            gap: 40,
            marginBottom: 56,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <img src="/notify-logo.png" alt="Notify" style={{ width: 28, height: 28, borderRadius: 7 }} />
              <span style={{ fontWeight: 700, fontSize: 16 }}>Notify</span>
            </div>
            <p style={{ fontSize: 14, color: C.fgMuted, lineHeight: 1.7, maxWidth: 240 }}>
              The notification infrastructure for modern teams. Built by AfriSinc Technologies.
            </p>
            <div style={{ display: 'flex', gap: 6, marginTop: 20 }}>
              {['SOC 2', 'GDPR'].map((b) => (
                <span
                  key={b}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '3px 8px',
                    background: 'rgba(2,147,228,0.08)',
                    border: '1px solid rgba(2,147,228,0.2)',
                    borderRadius: 5,
                    color: C.primary400,
                    letterSpacing: '0.04em',
                  }}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <p
                style={{
                  fontWeight: 600,
                  fontSize: 13,
                  marginBottom: 14,
                  color: C.fg,
                  letterSpacing: '0.02em',
                }}
              >
                {col.title}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map((l) => (
                  <a
                    key={l}
                    href="#"
                    style={{ fontSize: 14, color: C.fgMuted, transition: 'color 0.15s' }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = C.fg)}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.color = C.fgMuted)}
                  >
                    {l}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            borderTop: `1px solid ${C.border}`,
            paddingTop: 28,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 13, color: C.fgMuted }}>© 2026 AfriSinc Technologies. All rights reserved.</span>
          <span style={{ fontSize: 13, color: C.fgMuted }}>Made with care for developers worldwide.</span>
        </div>
      </div>
    </footer>
  )
}

// ── Landing Page ──────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate()
  const handleDashboard = () => navigate('/admin/dashboard')

  return (
    <div style={{ background: C.bg, color: C.fg, minHeight: '100vh' }}>
      <Nav onDashboard={handleDashboard} />
      <Hero onDashboard={handleDashboard} />
      <ChannelStrip />
      <Features />
      <HowItWorks />
      <Pricing onDashboard={handleDashboard} />
      <SocialProof />
      <CTABand onDashboard={handleDashboard} />
      <Footer />
    </div>
  )
}
