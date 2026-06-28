import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import { C } from '../design'
import { getUser, clearSession, displayName, initials } from '@/lib/auth'

interface NavItem {
  to: string
  icon: string
  label: string
}

const navItems: NavItem[] = [
  { to: '/admin/dashboard', icon: 'home', label: 'Dashboard' },
  { to: '/admin/clients', icon: 'users', label: 'Clients' },
  { to: '/admin/notifications', icon: 'bell', label: 'Notifications' },
  { to: '/admin/templates', icon: 'layers', label: 'Templates' },
  { to: '/admin/analytics', icon: 'chart', label: 'Analytics' },
  { to: '/admin/support', icon: 'help', label: 'Support' },
]

const bottomItems: NavItem[] = [{ to: '/admin/settings', icon: 'settings', label: 'Settings' }]

interface SidebarProps {
  collapsed: boolean
  setCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void
}

function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const navigate = useNavigate()
  const user = getUser()

  const handleLogout = () => {
    clearSession()
    navigate('/', { replace: true })
  }

  return (
    <aside
      style={{
        width: collapsed ? 64 : 240,
        flexShrink: 0,
        background: 'hsl(224,20%,4%)',
        borderRight: `1px solid hsl(224,14%,12%)`,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s ease',
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: collapsed ? '20px 0' : '20px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          borderBottom: `1px solid hsl(224,14%,12%)`,
          height: 64,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            width: collapsed ? '100%' : 'auto',
            paddingLeft: collapsed ? 0 : 4,
          }}
        >
          <img
            src="/notify-logo.png"
            alt="Notify"
            style={{ width: 28, height: 28, borderRadius: 7, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          />
        </div>
        {!collapsed && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flex: 1,
              minWidth: 0,
            }}
          >
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  fontWeight: 700,
                  fontSize: 15,
                  color: 'hsl(210,20%,95%)',
                  whiteSpace: 'nowrap',
                }}
              >
                Notify
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: 'hsl(215,15%,55%)',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                }}
              >
                Admin Console
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav
        style={{
          flex: 1,
          padding: '12px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          overflowY: 'auto',
        }}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: collapsed ? '10px 0' : '10px 12px',
              borderRadius: 8,
              fontWeight: 500,
              fontSize: 14,
              color: isActive ? 'hsl(210,20%,95%)' : 'hsl(215,15%,55%)',
              background: isActive ? 'rgba(2,147,228,0.12)' : 'transparent',
              border: `1px solid ${isActive ? 'rgba(2,147,228,0.2)' : 'transparent'}`,
              transition: 'all 0.15s',
              textDecoration: 'none',
              justifyContent: collapsed ? 'center' : 'flex-start',
              position: 'relative',
            })}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 3,
                      height: 16,
                      background: '#0293E4',
                      borderRadius: '0 2px 2px 0',
                    }}
                  />
                )}
                <Icon
                  name={item.icon}
                  size={17}
                  color={isActive ? '#36A9EA' : 'hsl(215,15%,55%)'}
                  stroke={isActive ? 2 : 1.5}
                />
                {!collapsed && <span>{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div
        style={{
          padding: '8px 8px 16px',
          borderTop: `1px solid hsl(224,14%,12%)`,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {bottomItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: collapsed ? '10px 0' : '10px 12px',
              borderRadius: 8,
              fontWeight: 500,
              fontSize: 14,
              color: isActive ? 'hsl(210,20%,95%)' : 'hsl(215,15%,55%)',
              background: isActive ? 'rgba(2,147,228,0.12)' : 'transparent',
              transition: 'all 0.15s',
              textDecoration: 'none',
              justifyContent: collapsed ? 'center' : 'flex-start',
            })}
          >
            {({ isActive }) => (
              <>
                <Icon name={item.icon} size={17} color={isActive ? '#36A9EA' : 'hsl(215,15%,55%)'} />
                {!collapsed && <span>{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: collapsed ? '10px 0' : '10px 12px',
            borderRadius: 8,
            background: 'transparent',
            color: 'hsl(215,15%,45%)',
            fontSize: 14,
            fontWeight: 500,
            transition: 'all 0.15s',
            width: '100%',
            justifyContent: collapsed ? 'center' : 'flex-start',
            border: 'none',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'hsl(210,20%,95%)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'hsl(215,15%,45%)')}
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {collapsed ? (
              <>
                <polyline points="9 18 15 12 9 6" />
              </>
            ) : (
              <>
                <polyline points="15 18 9 12 15 6" />
              </>
            )}
          </svg>
          {!collapsed && <span>Collapse</span>}
        </button>

        {/* User */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: collapsed ? '10px 0' : '10px 12px',
            marginTop: 4,
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: 'rgba(2,147,228,0.15)',
              border: '1px solid rgba(2,147,228,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: '#36A9EA' }}>{user ? initials(user) : 'A'}</span>
          </div>
          {!collapsed && (
            <div style={{ minWidth: 0, flex: 1 }}>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'hsl(210,20%,90%)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user ? displayName(user) : 'Admin'}
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: 'hsl(215,15%,50%)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user?.email ?? 'admin@notify.io'}
              </p>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: collapsed ? '10px 0' : '10px 12px',
            borderRadius: 8,
            background: 'transparent',
            color: 'hsl(215,15%,45%)',
            fontSize: 14,
            fontWeight: 500,
            transition: 'all 0.15s',
            width: '100%',
            justifyContent: collapsed ? 'center' : 'flex-start',
            border: 'none',
            cursor: 'pointer',
            marginTop: 4,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'hsl(0,62%,50%)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'hsl(215,15%,45%)')}
        >
          <Icon name="logout" size={17} color="currentColor" stroke={1.5} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}

function Header() {
  const [notifOpen, setNotifOpen] = useState(false)

  return (
    <header
      style={{
        height: 64,
        background: 'hsl(224,18%,7%)',
        borderBottom: `1px solid hsl(224,14%,12%)`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 28px',
        gap: 16,
        flexShrink: 0,
      }}
    >
      {/* Search */}
      <div style={{ flex: 1, maxWidth: 400, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
          <Icon name="search" size={15} color="hsl(215,15%,50%)" />
        </div>
        <input
          placeholder="Search clients, notifications..."
          style={{
            width: '100%',
            background: 'hsl(224,14%,10%)',
            border: `1px solid hsl(224,14%,16%)`,
            borderRadius: 8,
            padding: '8px 12px 8px 36px',
            fontSize: 13,
            color: 'hsl(210,20%,85%)',
            fontFamily: 'Manrope, sans-serif',
            outline: 'none',
            transition: 'border-color 0.15s',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(2,147,228,0.4)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'hsl(224,14%,16%)')}
        />
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Status indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 12px',
            background: 'rgba(39,174,96,0.1)',
            border: '1px solid rgba(39,174,96,0.2)',
            borderRadius: 9999,
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'hsl(152,60%,45%)' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'hsl(152,60%,55%)' }}>All systems operational</span>
        </div>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setNotifOpen((o) => !o)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'hsl(224,14%,10%)',
              border: `1px solid hsl(224,14%,16%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'hsl(215,15%,60%)',
              cursor: 'pointer',
              transition: 'all 0.15s',
              position: 'relative',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(2,147,228,0.3)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'hsl(224,14%,16%)')}
          >
            <Icon name="bell" size={16} />
            <div
              style={{
                position: 'absolute',
                top: 7,
                right: 7,
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#0293E4',
                border: '1.5px solid hsl(224,18%,7%)',
              }}
            />
          </button>
          {notifOpen && (
            <div
              style={{
                position: 'absolute',
                top: 44,
                right: 0,
                width: 320,
                background: 'hsl(224,18%,9%)',
                border: `1px solid hsl(224,14%,16%)`,
                borderRadius: 12,
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                zIndex: 50,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '14px 16px',
                  borderBottom: `1px solid hsl(224,14%,14%)`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontWeight: 600, fontSize: 14 }}>Notifications</span>
                <button
                  style={{
                    fontSize: 12,
                    color: '#36A9EA',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Mark all read
                </button>
              </div>
              {[
                {
                  icon: 'users',
                  text: 'New client Acme Corp signed up',
                  time: '2m ago',
                  dot: true,
                },
                {
                  icon: 'bell',
                  text: '1,250 notifications sent successfully',
                  time: '15m ago',
                  dot: true,
                },
                {
                  icon: 'shield',
                  text: 'API key rotated for TechStart',
                  time: '1h ago',
                  dot: false,
                },
              ].map((n, i) => (
                <div
                  key={i}
                  style={{
                    padding: '12px 16px',
                    display: 'flex',
                    gap: 12,
                    alignItems: 'flex-start',
                    borderBottom: i < 2 ? `1px solid hsl(224,14%,12%)` : 'none',
                    background: n.dot ? 'rgba(2,147,228,0.03)' : 'transparent',
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: 'rgba(2,147,228,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon name={n.icon} size={14} color="#36A9EA" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, color: 'hsl(210,20%,90%)', lineHeight: 1.4 }}>{n.text}</p>
                    <p style={{ fontSize: 11, color: 'hsl(215,15%,50%)', marginTop: 3 }}>{n.time}</p>
                  </div>
                  {n.dot && (
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: '#0293E4',
                        flexShrink: 0,
                        marginTop: 4,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        background: 'hsl(224,20%,5%)',
      }}
    >
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minWidth: 0,
        }}
      >
        <Header />
        <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
