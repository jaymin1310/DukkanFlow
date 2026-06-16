import { useNavigate } from 'react-router-dom'
import { Store, Package, Users, FileText, TrendingUp, Shield, Zap, ArrowRight, BarChart3 } from 'lucide-react'

const PRIMARY = '#1e3a5f'
const PRIMARY_DARK = '#0f2744'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>

      {/* Navbar */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e2e8f0', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Store size={18} color="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: '18px', color: PRIMARY }}>DukaanFlow</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/login')}
            style={{ padding: '8px 16px', border: `1.5px solid ${PRIMARY}`, borderRadius: '10px', background: 'white', color: PRIMARY, fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
            Login
          </button>
          <button onClick={() => navigate('/register')}
            style={{ padding: '8px 16px', border: 'none', borderRadius: '10px', background: PRIMARY, color: 'white', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
            Register Free
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ paddingTop: '120px', paddingBottom: '80px', textAlign: 'center', background: 'linear-gradient(180deg, white 0%, #f8fafc 100%)', padding: '120px 24px 80px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '20px', padding: '6px 16px', marginBottom: '24px' }}>
            <Zap size={14} color="#2563eb" />
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#2563eb' }}>Free for small businesses</span>
          </div>

          <h1 style={{ fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 800, color: '#0f172a', lineHeight: 1.15, margin: '0 0 20px', letterSpacing: '-1px' }}>
            Run your shop<br />
            <span style={{ background: `linear-gradient(135deg, ${PRIMARY}, #2563eb)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>smarter, not harder</span>
          </h1>

          <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: '#64748b', lineHeight: 1.7, margin: '0 0 40px' }}>
            Complete inventory, billing, and customer management built for Indian local businesses.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/register')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '13px 24px', border: 'none', borderRadius: '12px', background: `linear-gradient(135deg, ${PRIMARY_DARK}, #2563eb)`, color: 'white', fontSize: '15px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 24px rgba(30,58,95,0.35)' }}>
              Start for Free <ArrowRight size={18} />
            </button>
            <button onClick={() => navigate('/login')}
              style={{ padding: '13px 24px', border: '1.5px solid #e2e8f0', borderRadius: '12px', background: 'white', color: '#374151', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
              Sign In
            </button>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '16px' }}>No credit card required · Setup in 2 minutes</p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: PRIMARY, padding: '40px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '24px', textAlign: 'center' }}>
          {[
            { value: '500+', label: 'Shops Using' },
            { value: '10,000+', label: 'Invoices Created' },
            { value: '₹50L+', label: 'Revenue Tracked' },
            { value: '99.9%', label: 'Uptime' },
          ].map(s => (
            <div key={s.label}>
              <p style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 800, color: 'white', margin: '0 0 4px' }}>{s.value}</p>
              <p style={{ fontSize: '13px', color: '#93c5fd', margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 24px', background: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, color: '#0f172a', margin: '0 0 12px' }}>Everything your shop needs</h2>
            <p style={{ fontSize: '16px', color: '#64748b', margin: 0 }}>One platform to manage products, customers, billing, and more</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {[
              { icon: Package, title: 'Inventory Management', desc: 'Track products, stock levels, and get low stock alerts automatically.', color: '#2563eb', bg: '#eff6ff' },
              { icon: FileText, title: 'Instant Invoicing', desc: 'Create professional PDF invoices in seconds. Share or download instantly.', color: '#16a34a', bg: '#f0fdf4' },
              { icon: Users, title: 'Customer Tracking', desc: 'Manage customers, track purchase history, and build relationships.', color: '#7c3aed', bg: '#f5f3ff' },
              { icon: BarChart3, title: 'Sales Dashboard', desc: 'Real-time overview of revenue, invoices, and business performance.', color: '#dc2626', bg: '#fef2f2' },
              { icon: Shield, title: 'Secure & Isolated', desc: 'Your data is completely isolated. No other shop can see your data.', color: '#0891b2', bg: '#ecfeff' },
              { icon: TrendingUp, title: 'Multi-Shop Ready', desc: 'Built for multiple businesses. Each shop gets their own workspace.', color: '#d97706', bg: '#fffbeb' },
            ].map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} style={{ background: '#f8fafc', borderRadius: '16px', padding: '24px', border: '1px solid #f1f5f9' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                  <Icon size={20} color={color} />
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>{title}</h3>
                <p style={{ fontSize: '14px', color: '#64748b', margin: 0, lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, color: '#0f172a', margin: '0 0 12px' }}>Get started in minutes</h2>
          <p style={{ fontSize: '16px', color: '#64748b', margin: '0 0 48px' }}>No technical knowledge required</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>
            {[
              { step: '1', title: 'Register your shop', desc: 'Create your account with your shop name and details. Free forever.' },
              { step: '2', title: 'Add your products', desc: 'Add categories and products with prices and stock quantities.' },
              { step: '3', title: 'Start billing', desc: 'Create invoices for customers and download PDF receipts instantly.' },
            ].map(({ step, title, desc }) => (
              <div key={step}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: `linear-gradient(135deg, ${PRIMARY_DARK}, #2563eb)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', boxShadow: '0 8px 20px rgba(30,58,95,0.3)' }}>
                  <span style={{ color: 'white', fontSize: '20px', fontWeight: 800 }}>{step}</span>
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>{title}</h3>
                <p style={{ fontSize: '14px', color: '#64748b', margin: 0, lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', background: `linear-gradient(135deg, ${PRIMARY_DARK}, ${PRIMARY})`, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '240px', height: '240px', borderRadius: '50%', background: 'rgba(96,165,250,0.1)', filter: 'blur(40px)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 700, color: 'white', margin: '0 0 12px' }}>Ready to grow your business?</h2>
          <p style={{ fontSize: '16px', color: '#bfdbfe', margin: '0 0 32px' }}>Join hundreds of shopkeepers managing their business digitally</p>
          <button onClick={() => navigate('/register')}
            style={{ padding: '14px 32px', border: 'none', borderRadius: '12px', background: 'white', color: PRIMARY, fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}>
            Register Your Shop Free →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: PRIMARY_DARK, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Store size={16} color="#60a5fa" />
          <span style={{ color: '#60a5fa', fontWeight: 600, fontSize: '14px' }}>DukaanFlow</span>
        </div>
        <p style={{ color: '#475569', fontSize: '13px', margin: 0 }}>© 2026 DukaanFlow. Built for Indian businesses.</p>
      </footer>
    </div>
  )
}