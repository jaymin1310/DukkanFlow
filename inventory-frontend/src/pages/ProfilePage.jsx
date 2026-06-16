import { useState, useEffect } from 'react'
import client from '../api/client'
import toast from 'react-hot-toast'
import { Store, User, Phone, MapPin, Mail, Edit3, Save, X } from 'lucide-react'
import { useWindowSize } from '../hooks/useWindowSize'
import { useAuth } from '../context/AuthContext'

const PRIMARY = '#1e3a5f'
const PRIMARY_DARK = '#0f2744'

export default function ProfilePage() {
  const { isMobile } = useWindowSize()
  const { user, login } = useAuth()
  const [shop, setShop] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', mobile: '', address: '' })

  const fetchShop = async () => {
    try {
      const res = await client.get('/api/shop/profile')
      setShop(res.data)
      setForm({ name: res.data.name, mobile: res.data.mobile || '', address: res.data.address || '' })
    } catch { toast.error('Failed to load profile') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchShop() }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await client.put('/api/shop/profile', form)
      setShop(res.data)
      // Update localStorage shopName
      localStorage.setItem('shopName', res.data.name)
      login({ ...user, shopName: res.data.name })
      setEditing(false)
      toast.success('Profile updated!')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update')
    } finally { setSaving(false) }
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0',
    borderRadius: '10px', fontSize: '14px', color: '#0f172a',
    background: '#f8fafc', outline: 'none', boxSizing: 'border-box'
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTopColor: PRIMARY, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', maxWidth: '700px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: isMobile ? '20px' : '26px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Shop Profile</h1>
        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Manage your shop information</p>
      </div>

      {/* Shop Banner */}
      <div style={{ background: `linear-gradient(135deg, ${PRIMARY_DARK}, ${PRIMARY})`, borderRadius: '20px', padding: isMobile ? '24px 20px' : '32px', marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(96,165,250,0.1)', filter: 'blur(30px)' }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ width: isMobile ? '60px' : '80px', height: isMobile ? '60px' : '80px', borderRadius: '20px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Store size={isMobile ? 28 : 36} color="white" />
          </div>
          <div>
            <h2 style={{ color: 'white', fontSize: isMobile ? '20px' : '26px', fontWeight: 800, margin: '0 0 4px' }}>{shop?.name}</h2>
            <p style={{ color: '#93c5fd', fontSize: '13px', margin: '0 0 2px' }}>{shop?.email}</p>
            <p style={{ color: '#bfdbfe', fontSize: '12px', margin: 0 }}>
              Member since {shop?.createdAt ? new Date(shop.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' }) : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Owner Info */}
      <div style={{ background: 'white', borderRadius: '16px', padding: isMobile ? '20px' : '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <User size={16} color="#64748b" />
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#374151', margin: 0 }}>Owner Information</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
          {[
            { label: 'Owner Name', value: shop?.ownerName, icon: User },
            { label: 'Email Address', value: shop?.email, icon: Mail },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Icon size={14} color="#94a3b8" />
                <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{label}</p>
              </div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', margin: 0 }}>{value || '—'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Shop Details - Editable */}
      <div style={{ background: 'white', borderRadius: '16px', padding: isMobile ? '20px' : '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Store size={16} color="#64748b" />
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#374151', margin: 0 }}>Shop Details</h3>
          </div>
          {!editing ? (
            <button onClick={() => setEditing(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', color: '#2563eb', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              <Edit3 size={14} /> Edit
            </button>
          ) : (
            <button onClick={() => { setEditing(false); setForm({ name: shop.name, mobile: shop.mobile || '', address: shop.address || '' }) }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', color: '#64748b', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              <X size={14} /> Cancel
            </button>
          )}
        </div>

        {editing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { label: 'Shop Name', key: 'name', placeholder: 'e.g. Yug Kirana Store', icon: Store },
              { label: 'Mobile Number', key: 'mobile', placeholder: 'e.g. 9876543210', icon: Phone },
              { label: 'Shop Address', key: 'address', placeholder: 'e.g. Anand, Gujarat', icon: MapPin },
            ].map(({ label, key, placeholder, icon: Icon }) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
                <div style={{ position: 'relative' }}>
                  <Icon size={15} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text" placeholder={placeholder} value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    style={{ ...inputStyle, paddingLeft: '40px' }}
                    onFocus={e => e.target.style.borderColor = PRIMARY}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
              </div>
            ))}
            <button onClick={handleSave} disabled={saving}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', border: 'none', borderRadius: '12px', background: `linear-gradient(135deg, ${PRIMARY_DARK}, ${PRIMARY})`, color: 'white', fontSize: '14px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
              {saving ? <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> : <><Save size={16} /> Save Changes</>}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Shop Name', value: shop?.name, icon: Store },
              { label: 'Mobile Number', value: shop?.mobile, icon: Phone },
              { label: 'Address', value: shop?.address, icon: MapPin },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px', background: '#f8fafc', borderRadius: '12px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={15} color="#2563eb" />
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{label}</p>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', margin: 0 }}>{value || '—'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}