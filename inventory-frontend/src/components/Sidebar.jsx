import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, Package, Users, FileText, LogOut, Store, Tag, List, TrendingUp, X, Settings } from 'lucide-react'

const PRIMARY = '#1e3a5f'
const PRIMARY_DARK = '#0f2744'

const navItems = [
  { path: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/app/categories', icon: Tag, label: 'Categories' },
  { path: '/app/products', icon: Package, label: 'Products' },
  { path: '/app/customers', icon: Users, label: 'Customers' },
  { path: '/app/invoices', icon: List, label: 'Invoices' },
  { path: '/app/invoices/create', icon: FileText, label: 'Create Invoice' },
  { path: '/app/profit-loss', icon: TrendingUp, label: 'Profit & Loss' },
  { path: '/app/profile', icon: Settings, label: 'Shop Profile' },
]

export default function Sidebar({ onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div style={{
      height: '100vh', width: '240px',
      background: `linear-gradient(180deg, ${PRIMARY_DARK} 0%, ${PRIMARY} 100%)`,
      display: 'flex', flexDirection: 'column',
      boxShadow: '4px 0 24px rgba(0,0,0,0.15)'
    }}>
      {/* Logo */}
      <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(96,165,250,0.2)', border: '1px solid rgba(96,165,250,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Store size={18} color="#93c5fd" />
          </div>
          <div>
            <p style={{ color: 'white', fontWeight: 700, fontSize: '14px', margin: 0 }}>DukaanFlow</p>
            <p style={{ color: '#93c5fd', fontSize: '10px', margin: 0 }}>Billing System</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', display: 'flex' }}>
            <X size={18} />
          </button>
        )}
      </div>

      {/* User */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ color: 'white', fontSize: '12px', fontWeight: 700 }}>
            {user?.name?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div style={{ overflow: 'hidden' }}>
          <p style={{ color: 'white', fontSize: '13px', fontWeight: 600, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</p>
          <p style={{ color: '#60a5fa', fontSize: '11px', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.shopName}</p>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', fontWeight: 600, letterSpacing: '1px', padding: '8px 10px 4px', margin: 0 }}>MENU</p>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 14px', borderRadius: '10px', textDecoration: 'none',
              fontSize: '14px', fontWeight: 500, transition: 'all 0.2s',
              background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
              color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
              borderLeft: isActive ? '3px solid #60a5fa' : '3px solid transparent',
            })}
          >
            <item.icon size={17} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', border: 'none', background: 'transparent', color: '#f87171', fontSize: '14px', fontWeight: 500, cursor: 'pointer', width: '100%' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </div>
  )
}