import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Icon from '../../components/Icon'
import { C } from '../../design'
import {
  usePlatformEmailSettings,
  useEmailDomains,
  useAddEmailDomain,
  useEmailDomainRecords,
  useVerifyEmailDomain,
  useDeleteEmailDomain,
  useAddEmailSender,
  useUpdateEmailSender,
  useDeleteEmailSender,
} from '../../hooks'
import type { EmailDomain, EmailDomainStatus } from '../../types'

function Section({
  title,
  subtitle,
  children,
  actions,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
  actions?: React.ReactNode
}) {
  return (
    <div
      style={{
        background: 'hsl(224,18%,8%)',
        border: '1px solid hsl(224,14%,14%)',
        borderRadius: 12,
        padding: '24px',
        marginBottom: 16,
      }}
    >
      <div
        style={{
          marginBottom: 20,
          paddingBottom: 16,
          borderBottom: '1px solid hsl(224,14%,13%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 12,
        }}
      >
        <div>
          <p style={{ fontWeight: 600, fontSize: 16, color: 'hsl(210,20%,95%)', marginBottom: 4 }}>{title}</p>
          {subtitle && <p style={{ fontSize: 13, color: 'hsl(215,15%,55%)' }}>{subtitle}</p>}
        </div>
        {actions}
      </div>
      {children}
    </div>
  )
}

function Input({
  value,
  onChange,
  placeholder,
  mono,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  mono?: boolean
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        background: 'hsl(224,14%,12%)',
        border: '1px solid hsl(224,14%,18%)',
        borderRadius: 8,
        padding: '9px 14px',
        fontSize: 13,
        width: '100%',
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

function PrimaryButton({
  children,
  onClick,
  disabled,
  small,
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  small?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: small ? '7px 14px' : '10px 20px',
        borderRadius: 8,
        background: disabled ? 'hsl(224,14%,18%)' : C.primary,
        border: 'none',
        color: disabled ? 'hsl(215,15%,50%)' : '#fff',
        fontSize: small ? 12 : 14,
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {children}
    </button>
  )
}

function GhostButton({
  children,
  onClick,
  disabled,
  danger,
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '7px 12px',
        borderRadius: 7,
        background: danger ? 'rgba(231,76,60,0.1)' : 'hsl(224,14%,14%)',
        border: `1px solid ${danger ? 'rgba(231,76,60,0.2)' : 'hsl(224,14%,20%)'}`,
        color: disabled ? 'hsl(215,15%,40%)' : danger ? 'hsl(0,62%,60%)' : 'hsl(215,15%,70%)',
        fontSize: 12,
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  )
}

const DOMAIN_STATUS_COLORS: Record<EmailDomainStatus, { bg: string; border: string; color: string }> = {
  verified: { bg: 'rgba(39,174,96,0.12)', border: 'rgba(39,174,96,0.25)', color: 'hsl(152,60%,50%)' },
  pending: { bg: 'rgba(243,156,18,0.12)', border: 'rgba(243,156,18,0.25)', color: 'hsl(38,92%,55%)' },
  suspended: { bg: 'rgba(231,76,60,0.12)', border: 'rgba(231,76,60,0.25)', color: 'hsl(0,62%,60%)' },
}

function StatusBadge({ status }: { status: EmailDomainStatus }) {
  const colors = DOMAIN_STATUS_COLORS[status] || DOMAIN_STATUS_COLORS.pending
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 9px',
        borderRadius: 6,
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        fontSize: 11,
        fontWeight: 600,
        color: colors.color,
        textTransform: 'capitalize',
      }}
    >
      {status}
    </span>
  )
}

function CheckPill({ label, ok }: { label: string; ok: boolean }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '3px 8px',
        borderRadius: 6,
        background: ok ? 'rgba(39,174,96,0.1)' : 'hsl(224,14%,12%)',
        border: `1px solid ${ok ? 'rgba(39,174,96,0.2)' : 'hsl(224,14%,18%)'}`,
        fontSize: 11,
        fontWeight: 600,
        color: ok ? 'hsl(152,60%,50%)' : 'hsl(215,15%,50%)',
      }}
    >
      {ok && <Icon name="check" size={10} color="hsl(152,60%,50%)" />}
      {label}
    </span>
  )
}

function CopyRow({ label, name, value }: { label: string; name: string; value: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard access denied - nothing more we can do
    }
  }

  return (
    <div style={{ padding: '10px 0', borderBottom: '1px solid hsl(224,14%,12%)' }}>
      <p
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: 'hsl(215,15%,50%)',
          textTransform: 'uppercase',
          marginBottom: 4,
        }}
      >
        {label} — {name}
      </p>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <div
          style={{
            flex: 1,
            minWidth: 0,
            background: 'hsl(224,14%,12%)',
            border: '1px solid hsl(224,14%,18%)',
            borderRadius: 8,
            padding: '8px 12px',
            fontSize: 12,
            fontFamily: 'JetBrains Mono, monospace',
            color: 'hsl(210,20%,85%)',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
          }}
        >
          {value}
        </div>
        <button
          onClick={copy}
          style={{
            flexShrink: 0,
            padding: '8px 12px',
            borderRadius: 8,
            background: 'hsl(224,14%,12%)',
            border: '1px solid hsl(224,14%,18%)',
            color: copied ? 'hsl(152,60%,55%)' : 'hsl(215,15%,60%)',
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Icon name={copied ? 'check' : 'copy'} size={13} color={copied ? 'hsl(152,60%,55%)' : 'hsl(215,15%,55%)'} />
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  )
}

function AddDomainForm({ appId, onDone }: { appId: string; onDone: () => void }) {
  const [domain, setDomain] = useState('')
  const [selector, setSelector] = useState('afrisinc')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [useCloudflare, setUseCloudflare] = useState(false)
  const [cloudflareApiToken, setCloudflareApiToken] = useState('')
  const [result, setResult] = useState<{ cloudflareError?: string } | null>(null)

  const addDomain = useAddEmailDomain(appId)

  const submit = () => {
    if (!domain.trim()) return
    setResult(null)
    addDomain.mutate(
      {
        domain: domain.trim(),
        selector: selector.trim() || undefined,
        cloudflareApiToken: useCloudflare && cloudflareApiToken.trim() ? cloudflareApiToken.trim() : undefined,
      },
      {
        onSuccess: (res) => {
          if (res.cloudflare && !res.cloudflare.success) {
            setResult({ cloudflareError: res.cloudflare.error })
          } else {
            onDone()
          }
        },
      }
    )
  }

  return (
    <div
      style={{
        background: 'hsl(224,14%,10%)',
        border: '1px solid hsl(224,14%,15%)',
        borderRadius: 10,
        padding: 18,
        marginBottom: 16,
      }}
    >
      <p style={{ fontSize: 13, fontWeight: 600, color: 'hsl(210,20%,88%)', marginBottom: 12 }}>Add a sending domain</p>

      <div style={{ marginBottom: 10 }}>
        <p style={{ fontSize: 12, color: 'hsl(215,15%,55%)', marginBottom: 6 }}>Domain</p>
        <Input value={domain} onChange={setDomain} placeholder="mail.acme.com" mono />
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 13,
            color: 'hsl(210,20%,80%)',
            cursor: 'pointer',
          }}
        >
          <input
            type="radio"
            checked={!useCloudflare}
            onChange={() => setUseCloudflare(false)}
            style={{ accentColor: C.primary }}
          />
          I'll add DNS records myself
        </label>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 13,
            color: 'hsl(210,20%,80%)',
            cursor: 'pointer',
          }}
        >
          <input
            type="radio"
            checked={useCloudflare}
            onChange={() => setUseCloudflare(true)}
            style={{ accentColor: C.primary }}
          />
          My domain is on Cloudflare — set it up for me
        </label>
      </div>

      {useCloudflare && (
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 12, color: 'hsl(215,15%,55%)', marginBottom: 6 }}>
            Cloudflare API token (with DNS edit permission for this zone)
          </p>
          <Input
            value={cloudflareApiToken}
            onChange={setCloudflareApiToken}
            placeholder="Paste your Cloudflare API token"
            mono
          />
        </div>
      )}

      <button
        onClick={() => setShowAdvanced((s) => !s)}
        style={{
          background: 'none',
          border: 'none',
          color: '#36A9EA',
          fontSize: 12,
          fontWeight: 500,
          cursor: 'pointer',
          padding: 0,
          marginBottom: showAdvanced ? 10 : 14,
        }}
      >
        {showAdvanced ? 'Hide' : 'Show'} advanced options
      </button>

      {showAdvanced && (
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 12, color: 'hsl(215,15%,55%)', marginBottom: 6 }}>DKIM selector</p>
          <Input value={selector} onChange={setSelector} placeholder="afrisinc" mono />
        </div>
      )}

      {result?.cloudflareError && (
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
            Cloudflare auto-configuration failed: {result.cloudflareError}. The domain was still added — use the manual
            DNS records below instead.
          </p>
        </div>
      )}

      {addDomain.isError && (
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
            {addDomain.error instanceof Error ? addDomain.error.message : 'Failed to add domain'}
          </p>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <PrimaryButton onClick={submit} disabled={!domain.trim() || addDomain.isPending} small>
          {addDomain.isPending ? 'Adding…' : 'Add domain'}
        </PrimaryButton>
        <GhostButton onClick={onDone}>Cancel</GhostButton>
      </div>
    </div>
  )
}

function AddSenderForm({ appId, domainId, onDone }: { appId: string; domainId: string; onDone: () => void }) {
  const [localPart, setLocalPart] = useState('')
  const [fromName, setFromName] = useState('')
  const addSender = useAddEmailSender(appId)

  const submit = () => {
    if (!localPart.trim()) return
    addSender.mutate(
      { domainId, payload: { localPart: localPart.trim(), fromName: fromName.trim() || undefined } },
      { onSuccess: onDone }
    )
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '10px 0' }}>
      <div style={{ flex: 1 }}>
        <Input value={localPart} onChange={setLocalPart} placeholder="hello" mono />
      </div>
      <div style={{ flex: 1 }}>
        <Input value={fromName} onChange={setFromName} placeholder="Display name (optional)" />
      </div>
      <PrimaryButton onClick={submit} disabled={!localPart.trim() || addSender.isPending} small>
        {addSender.isPending ? 'Adding…' : 'Add'}
      </PrimaryButton>
      <GhostButton onClick={onDone}>Cancel</GhostButton>
      {addSender.isError && (
        <p style={{ fontSize: 12, color: 'hsl(0,62%,65%)' }}>
          {addSender.error instanceof Error ? addSender.error.message : 'Failed to add sender'}
        </p>
      )}
    </div>
  )
}

function DomainCard({ appId, domain }: { appId: string; domain: EmailDomain }) {
  const [showRecords, setShowRecords] = useState(domain.status !== 'verified')
  const [addingSender, setAddingSender] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const records = useEmailDomainRecords(appId, showRecords ? domain.id : undefined)
  const verifyDomain = useVerifyEmailDomain(appId)
  const deleteDomain = useDeleteEmailDomain(appId)
  const updateSender = useUpdateEmailSender(appId)
  const deleteSender = useDeleteEmailSender(appId)

  const handleSetDefault = (senderId: string) => {
    setActionError(null)
    updateSender.mutate(
      { senderId, payload: { isDefault: true } },
      { onError: (err) => setActionError(err instanceof Error ? err.message : 'Failed to set default sender') }
    )
  }

  const handleDeleteSender = (senderId: string) => {
    setActionError(null)
    deleteSender.mutate(senderId, {
      onError: (err) => setActionError(err instanceof Error ? err.message : 'Failed to remove sender'),
    })
  }

  return (
    <Section
      title={domain.domain}
      actions={
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <StatusBadge status={domain.status} />
          <GhostButton onClick={() => verifyDomain.mutate(domain.id)} disabled={verifyDomain.isPending}>
            {verifyDomain.isPending ? 'Verifying…' : 'Verify now'}
          </GhostButton>
          <GhostButton danger onClick={() => deleteDomain.mutate(domain.id)} disabled={deleteDomain.isPending}>
            <Icon name="trash" size={12} color="hsl(0,62%,60%)" />
            Remove
          </GhostButton>
        </div>
      }
    >
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <CheckPill label="SPF" ok={domain.spfVerified} />
        <CheckPill label="DKIM" ok={domain.dkimVerified} />
        <CheckPill label="DMARC" ok={domain.dmarcVerified} />
        {domain.cloudflareConnected && <CheckPill label="Cloudflare connected" ok />}
      </div>

      {domain.status !== 'verified' && (
        <div style={{ marginBottom: 16 }}>
          <button
            onClick={() => setShowRecords((s) => !s)}
            style={{
              background: 'none',
              border: 'none',
              color: '#36A9EA',
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              padding: 0,
              marginBottom: 8,
            }}
          >
            {showRecords ? 'Hide' : 'Show'} DNS records to add manually
          </button>

          {showRecords && (
            <div>
              {records.isLoading && <p style={{ fontSize: 12, color: 'hsl(215,15%,55%)' }}>Loading DNS records…</p>}
              {records.data && (
                <>
                  <CopyRow label="SPF (TXT)" name={records.data.spf.name} value={records.data.spf.value} />
                  <CopyRow label="DKIM (TXT)" name={records.data.dkim.name} value={records.data.dkim.value} />
                  <CopyRow label="DMARC (TXT)" name={records.data.dmarc.name} value={records.data.dmarc.value} />
                  <p style={{ fontSize: 11, color: 'hsl(215,15%,50%)', marginTop: 8 }}>
                    Add these records at your DNS provider, then click "Verify now" above — DNS changes can take a few
                    minutes to propagate.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {verifyDomain.isError && (
        <p style={{ fontSize: 12, color: 'hsl(0,62%,65%)', marginBottom: 12 }}>
          {verifyDomain.error instanceof Error ? verifyDomain.error.message : 'Verification failed'}
        </p>
      )}
      {deleteDomain.isError && (
        <p style={{ fontSize: 12, color: 'hsl(0,62%,65%)', marginBottom: 12 }}>
          {deleteDomain.error instanceof Error ? deleteDomain.error.message : 'Failed to remove domain'}
        </p>
      )}
      {actionError && <p style={{ fontSize: 12, color: 'hsl(0,62%,65%)', marginBottom: 12 }}>{actionError}</p>}

      <p style={{ fontSize: 13, fontWeight: 600, color: 'hsl(210,20%,85%)', marginBottom: 10 }}>Senders</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
        {domain.senders.length === 0 && (
          <p style={{ fontSize: 12, color: 'hsl(215,15%,50%)' }}>No senders yet — add one below.</p>
        )}
        {domain.senders.map((sender) => (
          <div
            key={sender.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '12px 14px',
              background: 'hsl(224,14%,10%)',
              borderRadius: 9,
              border: `1px solid ${sender.isDefault ? 'rgba(2,147,228,0.3)' : 'hsl(224,14%,15%)'}`,
            }}
          >
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
              <p style={{ fontSize: 13, fontWeight: 600, color: 'hsl(210,20%,90%)' }}>
                {sender.fromName ? `${sender.fromName} ` : ''}
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 400, color: 'hsl(215,15%,60%)' }}>
                  {sender.localPart}@{domain.domain}
                </span>
              </p>
              {sender.isDefault && <p style={{ fontSize: 11, color: '#36A9EA', marginTop: 2 }}>Default sender</p>}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {!sender.isDefault && (
                <GhostButton
                  onClick={() => handleSetDefault(sender.id)}
                  disabled={domain.status !== 'verified' || updateSender.isPending}
                >
                  {domain.status !== 'verified' ? 'Verify domain first' : 'Set as default'}
                </GhostButton>
              )}
              {!sender.isDefault && (
                <GhostButton danger onClick={() => handleDeleteSender(sender.id)} disabled={deleteSender.isPending}>
                  <Icon name="trash" size={12} color="hsl(0,62%,60%)" />
                </GhostButton>
              )}
            </div>
          </div>
        ))}
      </div>

      {addingSender ? (
        <AddSenderForm appId={appId} domainId={domain.id} onDone={() => setAddingSender(false)} />
      ) : (
        <GhostButton onClick={() => setAddingSender(true)}>
          <Icon name="plus" size={12} color="hsl(215,15%,70%)" />
          Add sender
        </GhostButton>
      )}
    </Section>
  )
}

export default function AppEmailIdentities() {
  const { appId } = useParams<{ appId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const appName = (location.state as { appName?: string } | null)?.appName

  const [addingDomain, setAddingDomain] = useState(false)

  const { data: domains, isLoading, isError, error } = useEmailDomains(appId)
  const { data: platformDefaults } = usePlatformEmailSettings()

  const activeSender = (domains || [])
    .flatMap((d) => d.senders.map((s) => ({ sender: s, domain: d })))
    .find((entry) => entry.sender.isDefault)

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'transparent',
          border: 'none',
          color: 'hsl(215,15%,55%)',
          fontSize: 13,
          fontWeight: 500,
          cursor: 'pointer',
          marginBottom: 16,
          padding: 0,
        }}
      >
        <span style={{ display: 'inline-flex', transform: 'rotate(180deg)' }}>
          <Icon name="arrow" size={14} color="hsl(215,15%,55%)" />
        </span>
        Back
      </button>

      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: 'hsl(210,20%,95%)',
            letterSpacing: '-0.02em',
            marginBottom: 4,
          }}
        >
          {appName ? `${appName} — Email` : 'Email Identities'}
        </h1>
        <p style={{ fontSize: 14, color: 'hsl(215,15%,55%)' }}>
          Manage sending domains and sender addresses for this app.
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 18px',
          background: 'rgba(2,147,228,0.06)',
          border: '1px solid rgba(2,147,228,0.15)',
          borderRadius: 10,
          marginBottom: 24,
        }}
      >
        <Icon name="send" size={16} color="#36A9EA" />
        {activeSender ? (
          <p style={{ fontSize: 13, color: 'hsl(210,20%,88%)' }}>
            Sending as <strong>{activeSender.sender.fromName || activeSender.sender.localPart}</strong>{' '}
            <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'hsl(215,15%,65%)' }}>
              {activeSender.sender.localPart}@{activeSender.domain.domain}
            </span>
          </p>
        ) : platformDefaults ? (
          <p style={{ fontSize: 13, color: 'hsl(210,20%,88%)' }}>
            Using the platform default sender —{' '}
            <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'hsl(215,15%,65%)' }}>
              {platformDefaults.fromName} &lt;{platformDefaults.fromEmail}&gt;
            </span>
            . Verify a domain and add a sender below to send from your own address.
          </p>
        ) : (
          <p style={{ fontSize: 13, color: 'hsl(210,20%,88%)' }}>Using the platform default sender.</p>
        )}
      </div>

      {isError && (
        <div style={{ padding: '32px', textAlign: 'center' }}>
          <p style={{ color: 'hsl(0,62%,60%)', fontSize: 14 }}>
            Error loading email domains: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      )}

      {isLoading && <p style={{ fontSize: 13, color: 'hsl(215,15%,55%)' }}>Loading…</p>}

      {!isLoading && !isError && (
        <>
          {(domains || []).map((domain) => (
            <DomainCard key={domain.id} appId={appId as string} domain={domain} />
          ))}

          {addingDomain ? (
            <AddDomainForm appId={appId as string} onDone={() => setAddingDomain(false)} />
          ) : (
            <button
              onClick={() => setAddingDomain(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                borderRadius: 8,
                background: 'rgba(2,147,228,0.1)',
                border: '1px solid rgba(2,147,228,0.2)',
                color: '#36A9EA',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Icon name="plus" size={15} color="#36A9EA" />
              Add a sending domain
            </button>
          )}
        </>
      )}
    </div>
  )
}
