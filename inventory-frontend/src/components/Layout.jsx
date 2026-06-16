import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { Menu, Store } from 'lucide-react'
import { useWindowSize } from '../hooks/useWindowSize'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isMobile } = useWindowSize()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} />
      )}

      {/* Sidebar */}
      <div style={{
        position: 'fixed', left: 0, top: 0, height: '100vh', zIndex: 50,
        transform: isMobile ? (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
        transition: 'transform 0.3s ease',
      }}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main */}
      <main style={{
        flex: 1,
        marginLeft: isMobile ? 0 : '240px',
        overflowY: 'auto',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Mobile topbar */}
        {isMobile && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '14px 20px', background: 'white',
            borderBottom: '1px solid #f1f5f9',
            position: 'sticky', top: 0, zIndex: 30,
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
          }}>
            <button onClick={() => setSidebarOpen(true)}
              style={{ width: '36px', height: '36px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Menu size={20} color="#1e3a5f" />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Store size={14} color="white" />
              </div>
              <span style={{ fontWeight: 700, fontSize: '16px', color: '#1e3a5f' }}>DukaanFlow</span>
            </div>
          </div>
        )}

        <div style={{ padding: isMobile ? '16px' : '32px', flex: 1 }}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}