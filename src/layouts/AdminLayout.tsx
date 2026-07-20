import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import Icon from '../components/Icon'
import { C } from '../design'
import { getUser, logout, displayName, initials } from '@/lib/auth'
import { responsiveStyles, breakpoints } from '../styles/responsive'

interface NavItem {
  to: string
  icon: string
  label: string
}

const navItems: NavItem[] = [
  { to: '/dashboard', icon: 'home', label: 'Dashboard' },
  { to: '/clients', icon: 'users', label: 'Clients' },
  { to: '/notifications', icon: 'bell', label: 'Notifications' },
  { to: '/templates', icon: 'layers', label: 'Templates' },
  { to: '/analytics', icon: 'chart', label: 'Analytics' },
  { to: '/credit-transactions', icon: 'trending-up', label: 'Credits' },
  { to: '/support', icon: 'help', label: 'Support' },
]

const bottomItems: NavItem[] = [{ to: '/settings', icon: 'settings', label: 'Settings' }]

interface SidebarProps {
  collapsed: boolean
  setCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void
  isMobile?: boolean
  onClose?: () => void
}

function Sidebar({ collapsed, setCollapsed, isMobile, onClose }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const user = getUser()

  const handleLogout = () => {
    logout()
  }

  const handleNavClick = () => {
    if (isMobile && onClose) {
      onClose()
    }
  }

  useEffect(() => {
    if (isMobile && onClose) {
      onClose()
    }
  }, [location.pathname])

  const sidebarWidth = isMobile ? 280 : collapsed ? 64 : 240

  return (
    <aside
      style={{
        width: sidebarWidth,
        flexShrink: 0,
        background: 'hsl(224,20%,4%)',
        borderRight: `1px solid hsl(224,14%,12%)`,
        display: 'flex',
        flexDirection: 'column',
        transition: isMobile ? 'none' : 'width 0.2s ease',
        overflow: 'hidden',
        height: '100%',
      }}
    >
      <div
        style={{
          padding: collapsed && !isMobile ? '20px 0' : '20px 16px',
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
            justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
            width: collapsed && !isMobile ? '100%' : 'auto',
            paddingLeft: collapsed && !isMobile ? 0 : 4,
          }}
        >
          <img
            src="/notify-logo.png"
            alt="Notify"
            style={{ width: 28, height: 28, borderRadius: 7, cursor: 'pointer' }}
            onClick={() => {
              navigate('/')
              handleNavClick()
            }}
          />
        </div>
        {(!collapsed || isMobile) && (
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
              <p style={{ fontWeight: 700, fontSize: 15, color: 'hsl(210,20%,95%)', whiteSpace: 'nowrap' }}>Notify</p>
              <p style={{ fontSize: 11, color: 'hsl(215,15%,55%)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                Admin Console
              </p>
            </div>
            {isMobile && onClose && (
              <button
                onClick={onClose}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="x" size={18} color="hsl(215,15%,55%)" />
              </button>
            )}
          </div>
        )}
      </div>

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
            onClick={handleNavClick}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: collapsed && !isMobile ? '10px 0' : '10px 12px',
              borderRadius: 8,
              fontWeight: 500,
              fontSize: 14,
              color: isActive ? 'hsl(210,20%,95%)' : 'hsl(215,15%,55%)',
              background: isActive ? 'rgba(2,147,228,0.12)' : 'transparent',
              border: `1px solid ${isActive ? 'rgba(2,147,228,0.2)' : 'transparent'}`,
              transition: 'all 0.15s',
              textDecoration: 'none',
              justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
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
                {(!collapsed || isMobile) && <span>{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

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
            onClick={handleNavClick}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: collapsed && !isMobile ? '10px 0' : '10px 12px',
              borderRadius: 8,
              fontWeight: 500,
              fontSize: 14,
              color: isActive ? 'hsl(210,20%,95%)' : 'hsl(215,15%,55%)',
              background: isActive ? 'rgba(2,147,228,0.12)' : 'transparent',
              transition: 'all 0.15s',
              textDecoration: 'none',
              justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
            })}
          >
            {({ isActive }) => (
              <>
                <Icon name={item.icon} size={17} color={isActive ? '#36A9EA' : 'hsl(215,15%,55%)'} />
                {(!collapsed || isMobile) && <span>{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}

        {!isMobile && (
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
              {collapsed ? <polyline points="9 18 15 12 9 6" /> : <polyline points="15 18 9 12 15 6" />}
            </svg>
            {!collapsed && <span>Collapse</span>}
          </button>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: collapsed && !isMobile ? '10px 0' : '10px 12px',
            marginTop: 4,
            justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
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
          {(!collapsed || isMobile) && (
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

        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: collapsed && !isMobile ? '10px 0' : '10px 12px',
            borderRadius: 8,
            background: 'transparent',
            color: 'hsl(215,15%,45%)',
            fontSize: 14,
            fontWeight: 500,
            transition: 'all 0.15s',
            width: '100%',
            justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
            border: 'none',
            cursor: 'pointer',
            marginTop: 4,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'hsl(0,62%,50%)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'hsl(215,15%,45%)')}
        >
          <Icon name="logout" size={17} color="currentColor" stroke={1.5} />
          {(!collapsed || isMobile) && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}

function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const [notifOpen, setNotifOpen] = useState(false)

  return (
    <header
      style={{
        height: 64,
        background: 'hsl(224,18%,7%)',
        borderBottom: `1px solid hsl(224,14%,12%)`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: 12,
        flexShrink: 0,
      }}
    >
      <button
        onClick={onMenuClick}
        className="mobile-menu-btn"
        style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          background: 'hsl(224,14%,10%)',
          border: '1px solid hsl(224,14%,16%)',
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <Icon name="menu" size={18} color="hsl(215,15%,60%)" />
      </button>

      <div style={{ flex: 1, maxWidth: 400, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
          <Icon name="search" size={15} color="hsl(215,15%,50%)" />
        </div>
        <input
          placeholder="Search..."
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
        <div
          className="hide-sm"
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
          <span style={{ fontSize: 12, fontWeight: 600, color: 'hsl(152,60%,55%)' }}>Operational</span>
        </div>

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
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setNotifOpen(false)} />
              <div
                style={{
                  position: 'absolute',
                  top: 44,
                  right: 0,
                  width: 'min(320px, calc(100vw - 32px))',
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
                  { icon: 'users', text: 'New client Acme Corp signed up', time: '2m ago', dot: true },
                  { icon: 'bell', text: '1,250 notifications sent', time: '15m ago', dot: true },
                  { icon: 'shield', text: 'API key rotated for TechStart', time: '1h ago', dot: false },
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
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= breakpoints.lg) {
        setMobileOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        background: 'hsl(224,20%,5%)',
      }}
    >
      <style>{responsiveStyles}</style>

      <div className="desktop-sidebar">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <div className={`mobile-sidebar-overlay ${mobileOpen ? 'active' : ''}`} onClick={() => setMobileOpen(false)} />

      <div className={`mobile-sidebar ${mobileOpen ? 'active' : ''}`}>
        <Sidebar collapsed={false} setCollapsed={setCollapsed} isMobile onClose={() => setMobileOpen(false)} />
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minWidth: 0,
        }}
      >
        <Header onMenuClick={() => setMobileOpen(true)} />
        <main className="page-padding" style={{ flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
