import { useState, useEffect } from 'react'
import client from '../api/client'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Tag } from 'lucide-react'
import { useWindowSize } from '../hooks/useWindowSize'

function ConfirmDialog({ onConfirm, onCancel }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)', padding: '16px' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '32px', maxWidth: '360px', width: '100%', textAlign: 'center', boxShadow: '0 25px 60px rgba(0,0,0,0.2)', animation: 'modalIn 0.2s ease' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <Trash2 size={24} color="#dc2626" />
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>Delete Category?</h3>
        <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 24px', lineHeight: 1.6 }}>This action cannot be undone.</p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '12px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', fontWeight: 600, color: '#64748b', background: 'white', cursor: 'pointer' }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 600, color: 'white', background: 'linear-gradient(135deg, #dc2626, #ef4444)', cursor: 'pointer' }}>Delete</button>
        </div>
      </div>
      <style>{`@keyframes modalIn{from{opacity:0;transform:scale(0.95) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </div>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)' }}>
      <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '420px', boxShadow: '0 25px 60px rgba(0,0,0,0.2)', overflow: 'hidden', animation: 'modalIn 0.2s ease' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, #0f2744, #1e3a5f)' }}>
          <h3 style={{ color: 'white', fontSize: '15px', fontWeight: 600, margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ width: '30px', height: '30px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>
  )
}

const empty = { name: '', description: '' }

export default function CategoriesPage() {
  const { isMobile } = useWindowSize()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const fetchCategories = async () => {
    try {
      const res = await client.get('/api/categories')
      setCategories(res.data || [])
    } catch { toast.error('Failed to load categories') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchCategories() }, [])

  const openAdd = () => { setEditing(null); setForm(empty); setShowModal(true) }
  const openEdit = (c) => { setEditing(c); setForm({ name: c.name, description: c.description || '' }); setShowModal(true) }

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error('Category name is required')
    setSaving(true)
    try {
      if (editing) {
        await client.put(`/api/categories/${editing.id}`, form)
        toast.success('Category updated!')
      } else {
        await client.post('/api/categories', form)
        toast.success('Category created!')
      }
      setShowModal(false)
      fetchCategories()
    } catch (e) {
      toast.error(e.response?.data?.message || 'Something went wrong')
    } finally { setSaving(false) }
  }

  const handleDelete = (id) => setConfirmDelete(id)
  const confirmDeleteAction = async () => {
    try {
      await client.delete(`/api/categories/${confirmDelete}`)
      toast.success('Category deleted!')
      fetchCategories()
    } catch { toast.error('Failed to delete') }
    finally { setConfirmDelete(null) }
  }

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', color: '#0f172a', background: '#f8fafc', outline: 'none', boxSizing: 'border-box' }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: isMobile ? '20px' : '26px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Categories</h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>{categories.length} total categories</p>
        </div>
        <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', background: 'linear-gradient(135deg, #0f2744, #1e3a5f)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(30,58,95,0.3)', whiteSpace: 'nowrap' }}>
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '250px' }}>
            <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: '#1e3a5f', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : categories.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '250px', color: '#94a3b8' }}>
            <Tag size={40} style={{ marginBottom: '10px', opacity: 0.3 }} />
            <p style={{ fontWeight: 500, margin: '0 0 4px' }}>No categories yet</p>
            <p style={{ fontSize: '13px', margin: '0 0 16px' }}>Create your first category</p>
            <button onClick={openAdd} style={{ padding: '9px 18px', background: 'linear-gradient(135deg, #0f2744, #1e3a5f)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              + Add Category
            </button>
          </div>
        ) : isMobile ? (
          // Mobile card view
          <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {categories.map(c => (
              <div key={c.id} style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: c.description ? '8px' : 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Tag size={14} color="#2563eb" />
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{c.name}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => openEdit(c)} style={{ width: '30px', height: '30px', border: '1px solid #e2e8f0', borderRadius: '7px', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => handleDelete(c.id)} style={{ width: '30px', height: '30px', border: '1px solid #e2e8f0', borderRadius: '7px', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                {c.description && (
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 0 42px', wordBreak: 'break-word', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{c.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          // Desktop table view
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Category', 'Description', 'Created', ''].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 20px', fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((c, i) => (
                <tr key={c.id}
                  style={{ borderTop: '1px solid #f8fafc', background: i % 2 === 0 ? 'white' : '#fafafa' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f0f7ff'}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'white' : '#fafafa'}
                >
                  <td style={{ padding: '14px 20px', minWidth: '140px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Tag size={15} color="#2563eb" />
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{c.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: '#64748b', maxWidth: '300px' }}>
                    <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', wordBreak: 'break-word' }}>
                      {c.description || '—'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: '#64748b', whiteSpace: 'nowrap' }}>
                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => openEdit(c)} style={{ width: '32px', height: '32px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.color = '#2563eb' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#64748b' }}>
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(c.id)} style={{ width: '32px', height: '32px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#dc2626' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#64748b' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <Modal title={editing ? '✏️ Edit Category' : '➕ Add Category'} onClose={() => setShowModal(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category Name</label>
              <input type="text" placeholder="e.g. Electronics, Groceries" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#1e3a5f'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'} autoFocus />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description (optional)</label>
              <textarea placeholder="Brief description..." value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                style={{ ...inputStyle, resize: 'none', lineHeight: '1.6' }}
                onFocus={e => e.target.style.borderColor = '#1e3a5f'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
            </div>
            <div style={{ display: 'flex', gap: '12px', paddingTop: '4px' }}>
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