import { useEffect, useState } from 'react'
import Icon from '../../components/Icon'
import { C } from '../../design'
import { getUser, isSuperAdmin } from '../../lib/auth'
import {
  usePlatformEmailSettings,
  useUpdatePlatformEmailSettings,
  useMailAliases,
  useAddMailAlias,
  useUpdateMailAlias,
  useDeleteMailAlias,
} from '../../hooks'
import type { MailAlias } from '../../types'

function Section({ title, subtitle, children }) {
  return (
    <div
      style={{
        background: 'hsl(224,18%,8%)',
        border: `1px solid hsl(224,14%,14%)`,
        borderRadius: 12,
        padding: '24px',
        marginBottom: 16,
      }}
    >
      <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid hsl(224,14%,13%)` }}>
        <p style={{ fontWeight: 600, fontSize: 16, color: 'hsl(210,20%,95%)', marginBottom: 4 }}>{title}</p>
        {subtitle && <p style={{ fontSize: 13, color: 'hsl(215,15%,55%)' }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

function Field({ label, hint, children }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '14px 0',
        borderBottom: `1px solid hsl(224,14%,12%)`,
      }}
    >
      <div style={{ maxWidth: 320 }}>
        <p style={{ fontSize: 14, fontWeight: 500, color: 'hsl(210,20%,85%)', marginBottom: 3 }}>{label}</p>
        {hint && <p style={{ fontSize: 12, color: 'hsl(215,15%,50%)', lineHeight: 1.5 }}>{hint}</p>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  )
}

function Toggle({ on, onChange }) {
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        border: 'none',
        cursor: 'pointer',
        background: on ? C.primary : 'hsl(224,14%,18%)',
        position: 'relative',
        transition: 'background 0.2s',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 3,
          left: on ? 22 : 3,
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: '#fff',
          transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }}
      />
    </button>
  )
}

function Input({
  value,
  onChange,
  placeholder,
  type = 'text',
  mono,
}: {
  value: any
  onChange: any
  placeholder?: any
  type?: string
  mono?: any
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      type={type}
      style={{
        background: 'hsl(224,14%,12%)',
        border: `1px solid hsl(224,14%,18%)`,
        borderRadius: 8,
        padding: '9px 14px',
        fontSize: 13,
        width: 260,
        color: 'hsl(210,20%,90%)',
        fontFamily: mono ? 'JetBrains Mono, monospace' : 'Manrope, sans-serif',
        outline: 'none',
        transition: 'border-color 0.15s',
      }}
      onFocus={(e) => (e.target.style.borderColor = 'rgba(2,147,228,0.4)')}
      onBlur={(e) => (e.target.style.borderColor = 'hsl(224,14%,18%)')}
    />
  )
}

function PlatformEmailSettingsTab() {
  const { data, isLoading } = usePlatformEmailSettings()
  const updateSettings = useUpdatePlatformEmailSettings()

  const [fromName, setFromName] = useState('')
  const [fromEmail, setFromEmail] = useState('')
  const [supportEmail, setSupportEmail] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (data) {
      setFromName(data.fromName)
      setFromEmail(data.fromEmail)
      setSupportEmail(data.supportEmail || '')
    }
  }, [data])

  const handleSave = () => {
    setSaved(false)
    updateSettings.mutate(
      { fromName, fromEmail, supportEmail: supportEmail || undefined },
      { onSuccess: () => setSaved(true) }
    )
  }

  return (
    <>
      <Section
        title="Platform default sender"
        subtitle="Used for any app that hasn't configured its own custom sender, and for system emails (password resets, alerts, etc.)"
      >
        {isLoading ? (
          <p style={{ fontSize: 13, color: 'hsl(215,15%,55%)' }}>Loading…</p>
        ) : (
          <>
            <Field label="From name" hint="Displayed as the sender name on outgoing emails">
              <Input value={fromName} onChange={setFromName} placeholder="Afrisinc" />
            </Field>
            <Field label="From email" hint="Used as the sender address when an app has no custom email set up">
              <Input value={fromEmail} onChange={setFromEmail} placeholder="noreply@afrisinc.com" />
            </Field>
            <Field label="Support email" hint="Shown to recipients as a contact address in system emails">
              <Input value={supportEmail} onChange={setSupportEmail} placeholder="support@afrisinc.com" />
            </Field>
          </>
        )}
      </Section>

      {updateSettings.isError && (
        <p style={{ fontSize: 13, color: 'hsl(0,62%,60%)', marginBottom: 12 }}>
          {updateSettings.error instanceof Error ? updateSettings.error.message : 'Failed to save settings'}
        </p>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12 }}>
        {saved && <span style={{ fontSize: 13, color: 'hsl(152,60%,50%)' }}>Saved</span>}
        <button
          onClick={handleSave}
          disabled={!fromName.trim() || !fromEmail.trim() || updateSettings.isPending}
          style={{
            padding: '10px 24px',
            borderRadius: 8,
            background: updateSettings.isPending ? 'hsl(224,14%,18%)' : C.primary,
            border: 'none',
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            cursor: updateSettings.isPending ? 'not-allowed' : 'pointer',
            boxShadow: updateSettings.isPending ? 'none' : '0 2px 10px rgba(2,147,228,0.3)',
          }}
        >
          {updateSettings.isPending ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </>
  )
}

function SmallButton({
  children,
  onClick,
  disabled,
  variant = 'ghost',
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'ghost' | 'danger'
}) {
  const styles = {
    primary: { background: C.primary, border: 'none', color: '#fff' },
    ghost: { background: 'hsl(224,14%,14%)', border: `1px solid hsl(224,14%,20%)`, color: 'hsl(215,15%,70%)' },
    danger: { background: 'rgba(231,76,60,0.1)', border: `1px solid rgba(231,76,60,0.25)`, color: 'hsl(0,62%,60%)' },
  }[disabled ? 'ghost' : variant]

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '7px 13px',
        borderRadius: 7,
        fontSize: 12,
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        whiteSpace: 'nowrap',
        ...styles,
      }}
    >
      {children}
    </button>
  )
}

function AliasRow({ alias }: { alias: MailAlias }) {
  const [editing, setEditing] = useState(false)
  const [destinations, setDestinations] = useState(alias.destinations.join(', '))
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [rowError, setRowError] = useState<string | null>(null)

  const updateAlias = useUpdateMailAlias()
  const deleteAlias = useDeleteMailAlias()

  useEffect(() => {
    if (confirmingDelete) {
      const t = setTimeout(() => setConfirmingDelete(false), 3000)
      return () => clearTimeout(t)
    }
  }, [confirmingDelete])

  const startEdit = () => {
    setRowError(null)
    setDestinations(alias.destinations.join(', '))
    setEditing(true)
  }

  const save = () => {
    const parsed = destinations
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean)

    if (parsed.length === 0) {
      setRowError('At least one destination is required')
      return
    }

    setRowError(null)
    updateAlias.mutate(
      { localPart: alias.localPart, payload: { destinations: parsed } },
      {
        onSuccess: () => setEditing(false),
        onError: (err) => setRowError(err instanceof Error ? err.message : 'Failed to update alias'),
      }
    )
  }

  const remove = () => {
    if (!confirmingDelete) {
      setConfirmingDelete(true)
      return
    }
    setRowError(null)
    deleteAlias.mutate(alias.localPart, {
      onError: (err) => {
        setConfirmingDelete(false)
        setRowError(err instanceof Error ? err.message : 'Failed to delete alias')
      },
    })
  }

  return (
    <div
      style={{
        padding: '14px 16px',
        background: 'hsl(224,14%,10%)',
        borderRadius: 9,
        border: `1px solid hsl(224,14%,15%)`,
        marginBottom: 8,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'rgba(2,147,228,0.1)',
            border: '1px solid rgba(2,147,228,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon name="mail" size={14} color="#36A9EA" />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              fontFamily: 'JetBrains Mono, monospace',
              color: 'hsl(210,20%,90%)',
              marginBottom: 3,
            }}
          >
            {alias.address}
          </p>
          {editing ? (
            <Input
              value={destinations}
              onChange={setDestinations}
              placeholder="team@gmail.com, backup@gmail.com"
              mono
            />
          ) : (
            <p style={{ fontSize: 12, color: 'hsl(215,15%,55%)' }}>
              forwards to{' '}
              <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'hsl(215,15%,65%)' }}>
                {alias.destinations.join(', ')}
              </span>
            </p>
          )}
        </div>

        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          {editing ? (
            <>
              <SmallButton variant="primary" onClick={save} disabled={updateAlias.isPending}>
                {updateAlias.isPending ? 'Saving…' : 'Save'}
              </SmallButton>
              <SmallButton onClick={() => setEditing(false)} disabled={updateAlias.isPending}>
                Cancel
              </SmallButton>
            </>
          ) : (
            <>
              <SmallButton onClick={startEdit}>
                <Icon name="edit" size={12} color="hsl(215,15%,70%)" />
                Edit
              </SmallButton>
              <SmallButton variant="danger" onClick={remove} disabled={deleteAlias.isPending}>
                <Icon name="trash" size={12} color="hsl(0,62%,60%)" />
                {confirmingDelete ? 'Confirm delete?' : deleteAlias.isPending ? 'Deleting…' : 'Delete'}
              </SmallButton>
            </>
          )}
        </div>
      </div>

      {rowError && <p style={{ fontSize: 12, color: 'hsl(0,62%,65%)', marginTop: 10 }}>{rowError}</p>}
    </div>
  )
}

function AddAliasForm({ onDone }: { onDone: () => void }) {
  const [localPart, setLocalPart] = useState('')
  const [destinations, setDestinations] = useState('')
  const addAlias = useAddMailAlias()

  const submit = () => {
    const parsedDestinations = destinations
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean)

    if (!localPart.trim() || parsedDestinations.length === 0) return

    addAlias.mutate({ localPart: localPart.trim(), destinations: parsedDestinations }, { onSuccess: onDone })
  }

  return (
    <div
      style={{ background: 'hsl(224,14%,10%)', border: '1px solid hsl(224,14%,15%)', borderRadius: 10, padding: 18 }}
    >
      <p style={{ fontSize: 13, fontWeight: 600, color: 'hsl(210,20%,88%)', marginBottom: 12 }}>
        Add a forwarding alias
      </p>

      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 12, color: 'hsl(215,15%,55%)', marginBottom: 6 }}>Address</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Input value={localPart} onChange={setLocalPart} placeholder="sales" mono />
            <span
              style={{
                fontSize: 13,
                fontFamily: 'JetBrains Mono, monospace',
                color: 'hsl(215,15%,50%)',
                whiteSpace: 'nowrap',
              }}
            >
              @afrisinc.com
            </span>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 12, color: 'hsl(215,15%,55%)', marginBottom: 6 }}>Forwards to</p>
          <Input value={destinations} onChange={setDestinations} placeholder="team@gmail.com, backup@gmail.com" mono />
        </div>
      </div>

      {addAlias.isError && (
        <div
          style={{
            padding: '10px 12px',
            background: 'rgba(231,76,60,0.08)',
            border: '1px solid rgba(231,76,60,0.2)',
            borderRadius: 8,
            marginBottom: 14,
          }}
        >
          <p style={{ fontSize: 12, color: 'hsl(0,62%,65%)' }}>
            {addAlias.error instanceof Error ? addAlias.error.message : 'Failed to add alias'}
          </p>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <SmallButton
          variant="primary"
          onClick={submit}
          disabled={!localPart.trim() || !destinations.trim() || addAlias.isPending}
        >
          {addAlias.isPending ? 'Adding…' : 'Add alias'}
        </SmallButton>
        <SmallButton onClick={onDone}>Cancel</SmallButton>
      </div>
    </div>
  )
}

function MailAliasesTab() {
  const { data: aliases, isLoading, isError, error } = useMailAliases()
  const [adding, setAdding] = useState(false)

  return (
    <Section
      title="Mail forwarding aliases"
      subtitle="Custom @afrisinc.com addresses that forward to real inboxes (support, sales, etc.). Changes apply directly on the mail server."
    >
      {isLoading && <p style={{ fontSize: 13, color: 'hsl(215,15%,55%)' }}>Loading…</p>}

      {isError && (
        <p style={{ fontSize: 13, color: 'hsl(0,62%,60%)', marginBottom: 16 }}>
          {error instanceof Error ? error.message : 'Failed to load mail aliases'}
        </p>
      )}

      {!isLoading && !isError && (
        <>
          {(aliases || []).length === 0 && !adding && (
            <p style={{ fontSize: 13, color: 'hsl(215,15%,50%)', marginBottom: 16 }}>No aliases yet — add one below.</p>
          )}

          <div style={{ marginBottom: 16 }}>
            {(aliases || []).map((alias) => (
              <AliasRow key={alias.address} alias={alias} />
            ))}
          </div>

          {adding ? (
            <AddAliasForm onDone={() => setAdding(false)} />
          ) : (
            <button
              onClick={() => setAdding(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                borderRadius: 8,
                background: 'rgba(2,147,228,0.1)',
                border: `1px solid rgba(2,147,228,0.2)`,
                color: '#36A9EA',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Icon name="plus" size={15} color="#36A9EA" />
              Add alias
            </button>
          )}
        </>
      )}
    </Section>
  )
}

const KEYS = [
  {
    name: 'Production',
    key: 'nf_live_pk_••••••••••••a4f2',
    created: 'Jan 12 2025',
    last: '2 min ago',
  },
  { name: 'Staging', key: 'nf_test_pk_••••••••••••9d81', created: 'Feb 3 2025', last: '1 day ago' },
]

export default function Settings() {
  const [org, setOrg] = useState('AfriSinc Technologies')
  const [email, setEmail] = useState('admin@notify.io')
  const [webhookUrl, setWebhookUrl] = useState('https://hooks.acme.com/notify')
  const [toggles, setToggles] = useState({
    deliveryAlerts: true,
    bounceAlerts: true,
    weeklyReport: false,
    mfa: true,
    ssoSaml: false,
    ipAllowlist: false,
  })
  const [activeTab, setActiveTab] = useState('general')
  const canManageMailAliases = isSuperAdmin(getUser())

  const toggle = (key) => setToggles((t) => ({ ...t, [key]: !t[key] }))

  const tabs = [
    { id: 'general', label: 'General', icon: 'settings' },
    { id: 'email', label: 'Email', icon: 'mail' },
    ...(canManageMailAliases ? [{ id: 'mail-aliases', label: 'Mail Aliases', icon: 'tag' }] : []),
    { id: 'api', label: 'API Keys', icon: 'key' },
    { id: 'webhooks', label: 'Webhooks', icon: 'webhook' },
    { id: 'notifications', label: 'Alerts', icon: 'bell' },
    { id: 'security', label: 'Security', icon: 'shield' },
  ]

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
          Settings
        </h1>
        <p style={{ fontSize: 14, color: 'hsl(215,15%,55%)' }}>Manage system configuration and integrations</p>
      </div>

      {/* Tab bar */}
      <div
        style={{
          display: 'flex',
          gap: 4,
          marginBottom: 24,
          background: 'hsl(224,14%,10%)',
          padding: 4,
          borderRadius: 10,
          width: 'fit-content',
          border: `1px solid hsl(224,14%,14%)`,
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 7,
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s',
              background: activeTab === t.id ? 'hsl(224,18%,14%)' : 'transparent',
              color: activeTab === t.id ? 'hsl(210,20%,90%)' : 'hsl(215,15%,55%)',
              border: `1px solid ${activeTab === t.id ? 'hsl(224,14%,18%)' : 'transparent'}`,
            }}
          >
            <Icon name={t.icon} size={14} color={activeTab === t.id ? '#36A9EA' : 'hsl(215,15%,55%)'} />
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'general' && (
        <>
          <Section title="Organization" subtitle="Basic information about your organization">
            <Field label="Organization name" hint="Displayed in the admin console and client-facing emails">
              <Input value={org} onChange={setOrg} placeholder="Organization name" />
            </Field>
            <Field label="Admin email" hint="Receives system alerts and billing notifications">
              <Input value={email} onChange={setEmail} placeholder="admin@example.com" />
            </Field>
          </Section>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button
              style={{
                padding: '10px 20px',
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
              style={{
                padding: '10px 24px',
                borderRadius: 8,
                background: C.primary,
                border: 'none',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(2,147,228,0.3)',
              }}
            >
              Save changes
            </button>
          </div>
        </>
      )}

      {activeTab === 'email' && <PlatformEmailSettingsTab />}

      {activeTab === 'mail-aliases' && canManageMailAliases && <MailAliasesTab />}

      {activeTab === 'api' && (
        <Section title="API Keys" subtitle="Manage authentication keys for the Notify API">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {KEYS.map((k) => (
              <div
                key={k.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '16px',
                  background: 'hsl(224,14%,10%)',
                  borderRadius: 9,
                  border: `1px solid hsl(224,14%,15%)`,
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
                  <Icon name="key" size={16} color="#36A9EA" />
                </div>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'hsl(210,20%,90%)',
                      marginBottom: 3,
                    }}
                  >
                    {k.name}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      fontFamily: 'JetBrains Mono',
                      color: 'hsl(215,15%,55%)',
                    }}
                  >
                    {k.key}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 12, color: 'hsl(215,15%,50%)', marginBottom: 2 }}>Created {k.created}</p>
                  <p style={{ fontSize: 11, color: 'hsl(215,15%,40%)' }}>Last used {k.last}</p>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 7,
                      background: 'hsl(224,14%,14%)',
                      border: `1px solid hsl(224,14%,20%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <Icon name="copy" size={13} color="hsl(215,15%,55%)" />
                  </button>
                  <button
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 7,
                      background: 'rgba(231,76,60,0.1)',
                      border: `1px solid rgba(231,76,60,0.2)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <Icon name="trash" size={13} color="hsl(0,62%,60%)" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            style={{
              marginTop: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: 8,
              background: 'rgba(2,147,228,0.1)',
              border: `1px solid rgba(2,147,228,0.2)`,
              color: '#36A9EA',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Icon name="plus" size={15} color="#36A9EA" /> Generate new key
          </button>
        </Section>
      )}

      {activeTab === 'webhooks' && (
        <Section title="Webhooks" subtitle="Configure endpoints to receive real-time delivery events">
          <Field label="Webhook endpoint URL" hint="Receives POST requests for every notification event">
            <Input value={webhookUrl} onChange={setWebhookUrl} placeholder="https://your-server.com/webhook" />
          </Field>
          <Field label="Signing secret" hint="Used to verify webhook payloads">
            <div style={{ display: 'flex', gap: 8 }}>
              <Input value="whsec_••••••••••••••••" onChange={() => {}} mono />
              <button
                style={{
                  padding: '9px 14px',
                  borderRadius: 8,
                  background: 'hsl(224,14%,12%)',
                  border: `1px solid hsl(224,14%,18%)`,
                  color: 'hsl(215,15%,60%)',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Icon name="copy" size={13} color="hsl(215,15%,55%)" /> Copy
              </button>
            </div>
          </Field>
          <div style={{ marginTop: 16 }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: 'hsl(210,20%,85%)', marginBottom: 12 }}>
              Events to receive
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                'message.delivered',
                'message.failed',
                'message.bounced',
                'message.opened',
                'message.clicked',
                'message.unsubscribed',
              ].map((ev) => (
                <label
                  key={ev}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 14px',
                    background: 'hsl(224,14%,10%)',
                    borderRadius: 8,
                    border: `1px solid hsl(224,14%,15%)`,
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    defaultChecked={ev.includes('delivered') || ev.includes('failed')}
                    style={{ accentColor: C.primary, width: 14, height: 14 }}
                  />
                  <span
                    style={{
                      fontSize: 13,
                      fontFamily: 'JetBrains Mono',
                      color: 'hsl(215,15%,65%)',
                    }}
                  >
                    {ev}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </Section>
      )}

      {activeTab === 'notifications' && (
        <Section title="Admin Alerts" subtitle="Configure when and how you receive system alerts">
          {[
            {
              key: 'deliveryAlerts',
              label: 'Delivery failure alerts',
              hint: 'Notify when delivery rate drops below 95%',
            },
            {
              key: 'bounceAlerts',
              label: 'Bounce rate alerts',
              hint: 'Notify when bounce rate exceeds 5%',
            },
            {
              key: 'weeklyReport',
              label: 'Weekly summary report',
              hint: 'Receive a weekly email with platform stats',
            },
          ].map((f) => (
            <Field key={f.key} label={f.label} hint={f.hint}>
              <Toggle on={toggles[f.key]} onChange={() => toggle(f.key)} />
            </Field>
          ))}
        </Section>
      )}

      {activeTab === 'security' && (
        <Section title="Security" subtitle="Protect your admin account and API access">
          {[
            {
              key: 'mfa',
              label: 'Multi-factor authentication',
              hint: 'Require MFA for all admin logins',
            },
            {
              key: 'ssoSaml',
              label: 'SSO / SAML',
              hint: 'Enable single sign-on via SAML 2.0 (Enterprise)',
            },
            {
              key: 'ipAllowlist',
              label: 'IP allowlist',
              hint: 'Restrict API access to specific IP addresses',
            },
          ].map((f) => (
            <Field key={f.key} label={f.label} hint={f.hint}>
              <Toggle on={toggles[f.key]} onChange={() => toggle(f.key)} />
            </Field>
          ))}
          <div
            style={{
              marginTop: 20,
              padding: '14px 16px',
              background: 'rgba(231,76,60,0.06)',
              border: `1px solid rgba(231,76,60,0.15)`,
              borderRadius: 9,
            }}
          >
            <p style={{ fontSize: 14, fontWeight: 600, color: 'hsl(0,62%,60%)', marginBottom: 6 }}>Danger Zone</p>
            <p style={{ fontSize: 13, color: 'hsl(215,15%,55%)', marginBottom: 14 }}>
              These actions are irreversible. Proceed with caution.
            </p>
            <button
              style={{
                padding: '9px 18px',
                borderRadius: 8,
                background: 'transparent',
                border: `1px solid rgba(231,76,60,0.35)`,
                color: 'hsl(0,62%,60%)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Reset all API keys
            </button>
          </div>
        </Section>
      )}
    </div>
  )
}
