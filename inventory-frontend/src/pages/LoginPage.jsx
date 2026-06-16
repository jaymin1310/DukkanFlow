import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import client from '../api/client'
import toast from 'react-hot-toast'
import { Store, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useWindowSize } from '../hooks/useWindowSize'

const PRIMARY = '#1e3a5f'
const PRIMARY_DARK = '#0f2744'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const { isMobile } = useWindowSize()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await client.post('/api/auth/login', form)
      login(res.data)
      toast.success(`Welcome back, ${res.data.name}!`)
      navigate('/app/dashboard')
    } catch {
      toast.error('Invalid email or password')
    } finally { setLoading(false) }
  }

  const inputStyle = {
    width: '100%', paddingLeft: '44px', paddingRight: '16px',
    paddingTop: '12px', paddingBottom: '12px',
    border: '1.5px solid #e2e8f0', borderRadius: '12px',
    fontSize: '14px', color: '#0f172a', background: '#f8fafc',
    outline: 'none', boxSizing: 'border-box'
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Inter, sans-serif' }}>

      {/* Left Panel — hidden on mobile */}
      {!isMobile && (
        <div style={{
          width: '45%', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: '60px 48px',
          background: `linear-gradient(135deg, ${PRIMARY_DARK} 0%, ${PRIMARY} 100%)`,
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(96,165,250,0.1)', filter: 'blur(40px)' }} />
          <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '280px', height: '280px', borderRadius: '50%', background: 'rgba(59,130,246,0.1)', filter: 'blur(40px)' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(96,165,250,0.2)', border: '1px solid rgba(96,165,250,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Store size={22} color="#93c5fd" />
              </div>
              <div>
                <p style={{ color: 'white', fontWeight: 700, fontSize: '18px', margin: 0 }}>DukaanFlow</p>
                <p style={{ color: '#93c5fd', fontSize: '12px', margin: 0 }}>Business Management</p>
              </div>
            </div>
            <h1 style={{ fontSize: '40px', fontWeight: 800, color: 'white', lineHeight: 1.2, margin: '0 0 16px' }}>
              Run your shop<br />
              <span style={{ color: '#60a5fa' }}>like a pro</span>
            </h1>
            <p style={{ color: '#bfdbfe', fontSize: '16px', lineHeight: 1.7, margin: '0 0 36px' }}>
              Complete inventory, billing, and customer management for Indian businesses.
            </p>
            {['✓ Real-time inventory tracking', '✓ Instant PDF invoice generation', '✓ Customer & sales tracking', '✓ Multi-shop support'].map(f => (
              <p key={f} style={{ color: '#dbeafe', fontSize: '14px', margin: '0 0 10px' }}>{f}</p>
            ))}
          </div>
        </div>
      )}

      {/* Right Panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '24px 20px' : '48px', background: '#f8fafc', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>

          {/* Mobile logo */}
          {isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', justifyContent: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Store size={20} color="white" />
              </div>
              <span style={{ fontWeight: 700, fontSize: '20px', color: PRIMARY }}>DukaanFlow</span>
            </div>
          )}

          <div style={{ background: 'white', borderRadius: '20px', padding: isMobile ? '24px' : '36px', boxShadow: '0 20px 60px rgba(0,0,0,0.08)' }}>
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>Welcome back 👋</h2>
              <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="email" placeholder="you@example.com" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} required style={inputStyle}
                    onFocus={e => e.target.style.borderColor = PRIMARY}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                </div>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })} required
                    style={{ ...inputStyle, paddingRight: '44px' }}
                    onFocus={e => e.target.style.borderColor = PRIMARY}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
                <Link to="/forgot-password" style={{ color: '#2563eb', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
                  Forgot password?
                </Link>
              </div>

              <button type="submit" disabled={loading}
                style={{ width: '100%', padding: '13px', border: 'none', borderRadius: '12px', background: loading ? '#94a3b8' : `linear-gradient(135deg, ${PRIMARY_DARK}, #2563eb)`, color: 'white', fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(30,58,95,0.3)' }}>
                {loading ? <><div style={{ width: '18px', height: '18px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Signing in...</> : 'Sign In →'}
              </button>
            </form>
          </div>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748b', marginTop: '20px' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Register your shop</Link>
          </p>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
