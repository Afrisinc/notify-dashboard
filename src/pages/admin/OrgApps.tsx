import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Icon from '../../components/Icon'
import { C } from '../../design'
import { useOrgApps } from '../../hooks'
import { SkeletonLine } from '../../components/SkeletonLoader'
import type { OrgApp } from '../../types'

const STATUS_COLORS: Record<string, { bg: string; border: string; color: string }> = {
  active: { bg: 'rgba(39,174,96,0.12)', border: 'rgba(39,174,96,0.25)', color: 'hsl(152,60%,50%)' },
  suspended: { bg: 'rgba(231,76,60,0.12)', border: 'rgba(231,76,60,0.25)', color: 'hsl(0,62%,60%)' },
  inactive: { bg: 'rgba(100,116,139,0.12)', border: 'rgba(100,116,139,0.25)', color: 'hsl(215,15%,65%)' },
  default: { bg: 'rgba(100,116,139,0.12)', border: 'rgba(100,116,139,0.25)', color: 'hsl(215,15%,65%)' },
}

const ENV_COLORS: Record<string, { bg: string; border: string; color: string }> = {
  production: { bg: 'rgba(2,147,228,0.12)', border: 'rgba(2,147,228,0.25)', color: '#36A9EA' },
  staging: { bg: 'rgba(243,156,18,0.12)', border: 'rgba(243,156,18,0.25)', color: 'hsl(38,92%,55%)' },
  development: { bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.25)', color: 'hsl(260,60%,65%)' },
  default: { bg: 'rgba(100,116,139,0.12)', border: 'rgba(100,116,139,0.25)', color: 'hsl(215,15%,65%)' },
}

function Badge({ label, colors }: { label: string; colors: { bg: string; border: string; color: string } }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 10px',
        borderRadius: 6,
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        fontSize: 12,
        fontWeight: 600,
        color: colors.color,
        whiteSpace: 'nowrap',
        textTransform: 'capitalize',
      }}
    >
      {label}
    </span>
  )
}

function AppRow({ app }: { app: OrgApp }) {
  const navigate = useNavigate()

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1.8fr 1fr 1fr 0.8fr 0.8fr 120px',
        gap: 24,
        padding: '16px 20px',
        alignItems: 'center',
        borderBottom: '1px solid hsl(224,14%,14%)',
        minWidth: 760,
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'hsl(224,14%,10%)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            background: 'rgba(2,147,228,0.1)',
            border: '1px solid rgba(2,147,228,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon name="package" size={15} color="#36A9EA" />
        </div>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'hsl(210,20%,90%)' }}>{app.name}</p>
      </div>

      <Badge label={app.environment} colors={ENV_COLORS[app.environment] || ENV_COLORS.default} />
      <Badge label={app.status} colors={STATUS_COLORS[app.status] || STATUS_COLORS.default} />

      <p style={{ fontSize: 13, fontWeight: 600, color: 'hsl(210,20%,85%)' }}>{app.templateCount}</p>
      <p style={{ fontSize: 13, fontWeight: 600, color: 'hsl(210,20%,85%)' }}>{app.templatesSent}</p>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={() => navigate(`/apps/${app.id}/email`, { state: { appName: app.name } })}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '7px 12px',
            borderRadius: 7,
            background: 'rgba(2,147,228,0.1)',
            border: '1px solid rgba(2,147,228,0.2)',
            color: '#36A9EA',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Icon name="mail" size={13} color="#36A9EA" />
          Email
        </button>
      </div>
    </div>
  )
}

export default function OrgApps() {
  const { orgId } = useParams<{ orgId: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState('')

  const orgName = searchParams.get('orgName') || undefined

  const { data, isLoading, isError, error } = useOrgApps(orgId, search ? { search } : undefined)
  const apps = data?.apps || []

  return (
    <div>
      <button
        onClick={() => navigate('/clients')}
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
        Back to Clients
      </button>

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
          {orgName ? `${orgName} — Apps` : 'Apps'}
        </h1>
        <p style={{ fontSize: 14, color: 'hsl(215,15%,55%)' }}>
          {data ? `${data.total} app${data.total === 1 ? '' : 's'} in this organization` : 'Apps for this organization'}
        </p>
      </div>

      <div style={{ marginBottom: 20, position: 'relative', maxWidth: 320 }}>
        <div style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }}>
          <Icon name="search" size={14} color="hsl(215,15%,50%)" />
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search apps..."
          style={{
            width: '100%',
            background: 'hsl(224,14%,10%)',
            border: '1px solid hsl(224,14%,16%)',
            borderRadius: 8,
            padding: '8px 12px 8px 34px',
            fontSize: 13,
            color: 'hsl(210,20%,85%)',
            fontFamily: 'Manrope, sans-serif',
            outline: 'none',
          }}
        />
      </div>

      {isError && (
        <div style={{ padding: '48px', textAlign: 'center' }}>
          <p style={{ color: 'hsl(0,62%,60%)', fontSize: 14 }}>
            Error loading apps: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      )}

      {!isError && (
        <div
          style={{
            background: 'hsl(224,18%,8%)',
            border: '1px solid hsl(224,14%,14%)',
            borderRadius: 12,
            overflow: 'hidden',
            position: 'relative',
            minHeight: 200,
          }}
        >
          <div className="responsive-table-wrapper">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.8fr 1fr 1fr 0.8fr 0.8fr 120px',
                gap: 24,
                padding: '12px 20px',
                borderBottom: '1px solid hsl(224,14%,12%)',
                background: 'hsl(224,14%,10%)',
                minWidth: 760,
              }}
            >
              {['App', 'Environment', 'Status', 'Templates', 'Sent', 'Actions'].map((label) => (
                <div
                  key={label}
                  style={{ fontSize: 11, fontWeight: 600, color: 'hsl(215,15%,50%)', textTransform: 'uppercase' }}
                >
                  {label}
                </div>
              ))}
            </div>

            {isLoading &&
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{ padding: '16px 20px', borderBottom: '1px solid hsl(224,14%,14%)' }}>
                  <SkeletonLine width="60%" height={14} />
                </div>
              ))}

            {!isLoading && apps.map((app) => <AppRow key={app.id} app={app} />)}

            {!isLoading && apps.length === 0 && (
              <div style={{ padding: '48px', textAlign: 'center' }}>
                <Icon name="package" size={32} color="hsl(215,15%,35%)" />
                <p style={{ color: 'hsl(215,15%,50%)', marginTop: 12, fontSize: 14 }}>
                  {search ? 'No apps match your search' : 'No apps in this organization yet'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
