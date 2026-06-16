import { useState, useEffect } from 'react'
import client from '../api/client'
import toast from 'react-hot-toast'
import { Plus, Search, Pencil, Trash2, Package } from 'lucide-react'
import { useWindowSize } from '../hooks/useWindowSize'

function ConfirmDialog({ onConfirm, onCancel }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)', padding: '16px' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '28px', maxWidth: '360px', width: '100%', textAlign: 'center', boxShadow: '0 25px 60px rgba(0,0,0,0.2)', animation: 'modalIn 0.2s ease' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
          <Trash2 size={22} color="#dc2626" />
        </div>
        <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>Delete Product?</h3>
        <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 22px', lineHeight: 1.6 }}>This action cannot be undone.</p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '11px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', fontWeight: 600, color: '#64748b', background: 'white', cursor: 'pointer' }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex: 1, padding: '11px', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 600, color: 'white', background: 'linear-gradient(135deg, #dc2626, #ef4444)', cursor: 'pointer' }}>Delete</button>
        </div>
      </div>
    </div>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)' }}>
      <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '480px', boxShadow: '0 25px 60px rgba(0,0,0,0.2)', overflow: 'hidden', animation: 'modalIn 0.2s ease', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, #0f2744, #1e3a5f)', position: 'sticky', top: 0, zIndex: 1 }}>
          <h3 style={{ color: 'white', fontSize: '15px', fontWeight: 600, margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ width: '30px', height: '30px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>
  )
}

const empty = { name: '', sku: '', categoryId: '', purchasePrice: '', sellingPrice: '', stockQuantity: '', lowStockThreshold: 10, unit: '' }

export default function ProductsPage() {
  const { isMobile } = useWindowSize()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const fetchProducts = async (q = '') => {
    try {
      const res = await client.get(`/api/products?search=${q}&page=0&size=100`)
      setProducts(res.data.content || [])
    } catch { toast.error('Failed to load products') }
    finally { setLoading(false) }
  }

  const fetchCategories = async () => {
    try {
      const res = await client.get('/api/categories')
      setCategories(res.data || [])
    } catch {}
  }

  useEffect(() => { fetchProducts(); fetchCategories() }, [])

  const openAdd = () => { setEditing(null); setForm(empty); setShowModal(true) }
  const openEdit = (p) => {
    setEditing(p)
    setForm({
      name: p.name, sku: p.sku,
      categoryId: categories.find(c => c.name === p.categoryName)?.id || '',
      purchasePrice: p.purchasePrice, sellingPrice: p.sellingPrice,
      stockQuantity: p.stockQuantity, lowStockThreshold: p.lowStockThreshold,
      unit: p.unit || ''
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editing) {
        await client.put(`/api/products/${editing.id}`, form)
        toast.success('Product updated!')
      } else {
        await client.post('/api/products', form)
        toast.success('Product created!')
      }
      setShowModal(false)
      fetchProducts(search)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Something went wrong')
    } finally { setSaving(false) }
  }

  const handleDelete = (id) => setConfirmDelete(id)
  const confirmDeleteAction = async () => {
    try {
      await client.delete(`/api/products/${confirmDelete}`)
      toast.success('Product deleted!')
      fetchProducts(search)
    } catch { toast.error('Failed to delete') }
    finally { setConfirmDelete(null) }
  }

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', color: '#0f172a', background: '#f8fafc', outline: 'none', boxSizing: 'border-box' }

  const ActionButtons = ({ p }) => (
    <div style={{ display: 'flex', gap: '6px' }}>
      <button onClick={() => openEdit(p)} style={{ width: '32px', height: '32px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}
        onMouseEnter={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.color = '#2563eb' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#64748b' }}>
        <Pencil size={14} />
      </button>
      <button onClick={() => handleDelete(p.id)} style={{ width: '32px', height: '32px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}
        onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#dc2626' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#64748b' }}>
        <Trash2 size={14} />
      </button>
    </div>
  )

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: isMobile ? '20px' : '26px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Products</h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>{products.length} total products</p>
        </div>
        <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', background: 'linear-gradient(135deg, #0f2744, #1e3a5f)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(30,58,95,0.3)', whiteSpace: 'nowrap' }}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: '14px', padding: '12px 16px', marginBottom: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input type="text" placeholder="Search by name or SKU..." value={search}
            onChange={(e) => { setSearch(e.target.value); fetchProducts(e.target.value) }}
            style={{ ...inputStyle, paddingLeft: '38px' }}
            onFocus={e => e.target.style.borderColor = '#1e3a5f'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '250px' }}>
            <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: '#1e3a5f', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : products.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '250px', color: '#94a3b8' }}>
            <Package size={40} style={{ marginBottom: '10px', opacity: 0.3 }} />
            <p style={{ fontWeight: 500, margin: '0 0 4px' }}>No products found</p>
            <p style={{ fontSize: '13px', margin: 0 }}>Add your first product</p>
          </div>
        ) : isMobile ? (
          // Mobile card view
          <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {products.map(p => (
              <div key={p.id} style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{p.name}</p>
                    <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>{p.sku}</span>
                  </div>
                  <ActionButtons p={p} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div style={{ background: 'white', borderRadius: '8px', padding: '8px 10px' }}>
                    <p style={{ fontSize: '10px', color: '#94a3b8', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</p>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: '#374151', margin: 0 }}>{p.categoryName}</p>
                  </div>
                  <div style={{ background: 'white', borderRadius: '8px', padding: '8px 10px' }}>
                    <p style={{ fontSize: '10px', color: '#94a3b8', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Selling Price</p>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', margin: 0 }}>₹{p.sellingPrice}</p>
                  </div>
                  <div style={{ background: 'white', borderRadius: '8px', padding: '8px 10px' }}>
                    <p style={{ fontSize: '10px', color: '#94a3b8', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stock</p>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: p.lowStock ? '#dc2626' : '#16a34a', margin: 0 }}>{p.stockQuantity} {p.unit}</p>
                  </div>
                  <div style={{ background: 'white', borderRadius: '8px', padding: '8px 10px' }}>
                    <p style={{ fontSize: '10px', color: '#94a3b8', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</p>
                    <span style={{ background: p.lowStock ? '#fef2f2' : '#f0fdf4', color: p.lowStock ? '#dc2626' : '#16a34a', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '20px' }}>
                      {p.lowStock ? '⚠ Low' : '✓ OK'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Desktop table
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Product', 'SKU', 'Category', 'Purchase', 'Selling', 'Stock', 'Status', ''].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 20px', fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p.id}
                  style={{ borderTop: '1px solid #f8fafc', background: i % 2 === 0 ? 'white' : '#fafafa' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f0f7ff'}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'white' : '#fafafa'}
                >
                  <td style={{ padding: '14px 20px', fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{p.name}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px', fontSize: '12px', color: '#64748b', fontFamily: 'monospace' }}>{p.sku}</span>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: '#64748b' }}>{p.categoryName}</td>
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: '#475569' }}>₹{p.purchasePrice}</td>
                  <td style={{ padding: '14px 20px', fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>₹{p.sellingPrice}</td>
                  <td style={{ padding: '14px 20px', fontSize: '13px', fontWeight: 600, color: p.lowStock ? '#dc2626' : '#16a34a' }}>
                    {p.stockQuantity} <span style={{ fontSize: '11px', fontWeight: 400 }}>{p.unit}</span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ background: p.lowStock ? '#fef2f2' : '#f0fdf4', color: p.lowStock ? '#dc2626' : '#16a34a', fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '20px' }}>
                      {p.lowStock ? '⚠ Low Stock' : '✓ In Stock'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px' }}><ActionButtons p={p} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <Modal title={editing ? '✏️ Edit Product' : '➕ Add Product'} onClose={() => setShowModal(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { label: 'Product Name', key: 'name', type: 'text', placeholder: 'e.g. Rice 1kg' },
              { label: 'SKU', key: 'sku', type: 'text', placeholder: 'e.g. RICE001' },
              { label: 'Purchase Price (₹)', key: 'purchasePrice', type: 'number', placeholder: '0.00' },
              { label: 'Selling Price (₹)', key: 'sellingPrice', type: 'number', placeholder: '0.00' },
              { label: 'Stock Quantity', key: 'stockQuantity', type: 'number', placeholder: '0' },
              { label: 'Low Stock Threshold', key: 'lowStockThreshold', type: 'number', placeholder: '10' },
              { label: 'Unit', key: 'unit', type: 'text', placeholder: 'e.g. kg, piece, litre' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
                <input type={type} placeholder={placeholder} value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#1e3a5f'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</label>
              {categories.length === 0 ? (
                <div style={{ padding: '10px 14px', border: '1.5px solid #fde68a', borderRadius: '10px', background: '#fffbeb' }}>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#92400e' }}>⚠️ No categories — create one first</p>
                </div>
              ) : (
                <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} style={inputStyle}>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              )}
            </div>
            <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '11px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', fontWeight: 600, color: '#64748b', background: 'white', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: '11px', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 600, color: 'white', background: 'linear-gradient(135deg, #0f2744, #1e3a5f)', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {saving ? <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> : editing ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {confirmDelete && <ConfirmDialog onConfirm={confirmDeleteAction} onCancel={() => setConfirmDelete(null)} />}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes modalIn{from{opacity:0;transform:scale(0.95) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </div>
  )
}