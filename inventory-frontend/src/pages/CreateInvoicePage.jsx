import { useState, useEffect } from 'react'
import client from '../api/client'
import toast from 'react-hot-toast'
import { Plus, Trash2, FileText, Download, CheckCircle, Package } from 'lucide-react'
import { useWindowSize } from '../hooks/useWindowSize'
 
const PRIMARY = '#1e3a5f'
const PRIMARY_DARK = '#0f2744'
 
export default function CreateInvoicePage() {
  const { isMobile } = useWindowSize()
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({
    customerId: '',
    items: [{ productId: '', quantity: 1 }],
    discount: 0,
    taxPercent: 0,
    paymentMethod: 'CASH',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [invoice, setInvoice] = useState(null)
  const [downloading, setDownloading] = useState(false)
 
  useEffect(() => {
    client.get('/api/customers?page=0&size=100').then(r => setCustomers(r.data?.content || []))
    client.get('/api/products?page=0&size=100').then(r => setProducts(r.data.content || []))
  }, [])
 
  const getProduct = (id) => products.find(p => p.id === Number(id))
 
  const subtotal = form.items.reduce((sum, item) => {
    const p = getProduct(item.productId)
    return sum + (p ? p.sellingPrice * item.quantity : 0)
  }, 0)
 
  const discountAmt = subtotal * (form.discount / 100)
  const afterDiscount = subtotal - discountAmt
  const taxAmt = afterDiscount * (form.taxPercent / 100)
  const total = afterDiscount + taxAmt
 
  const addItem = () => setForm({ ...form, items: [...form.items, { productId: '', quantity: 1 }] })
  const removeItem = (i) => setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) })
  const updateItem = (i, key, val) => {
    const items = [...form.items]
    items[i] = { ...items[i], [key]: val }
    setForm({ ...form, items })
  }
 
  const handleSubmit = async () => {
    if (!form.customerId) return toast.error('Please select a customer')
    if (form.items.some(i => !i.productId)) return toast.error('Please select all products')
    setLoading(true)
    try {
      const res = await client.post('/api/invoices', {
        ...form,
        customerId: Number(form.customerId),
        discount: Number(form.discount),
        taxPercent: Number(form.taxPercent),
        items: form.items.map(i => ({ productId: Number(i.productId), quantity: Number(i.quantity) }))
      })
      setInvoice(res.data)
      toast.success('Invoice created!')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to create invoice')
    } finally { setLoading(false) }
  }
 
  const handleDownload = async () => {
    setDownloading(true)
    try {
      const res = await client.get(`/api/invoices/${invoice.id}/pdf`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice-${invoice.invoiceNumber}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('PDF downloaded!')
    } catch { toast.error('Failed to download PDF') }
    finally { setDownloading(false) }
  }
 
  const handleNew = () => {
    setInvoice(null)
    setForm({ customerId: '', items: [{ productId: '', quantity: 1 }], discount: 0, taxPercent: 0, paymentMethod: 'CASH', notes: '' })
  }
 
  const inputStyle = {
    width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0',
    borderRadius: '10px', fontSize: '14px', color: '#0f172a',
    background: '#f8fafc', outline: 'none', boxSizing: 'border-box'
  }
 
  const cardStyle = {
    background: 'white', borderRadius: '16px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    marginBottom: '16px', overflow: 'hidden'
  }
 
  const cardHeader = (icon, title, action) => (
    <div style={{ padding: '14px 20px', borderBottom: '1px solid #f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{title}</span>
      </div>
      {action}
    </div>
  )
 
  // Success screen
  if (invoice) {
    return (
      <div style={{ fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: isMobile ? 'auto' : '70vh' }}>
        <div style={{ background: 'white', borderRadius: '24px', padding: isMobile ? '28px 20px' : '48px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '440px', width: '100%' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <CheckCircle size={32} color="#16a34a" />
          </div>
          <h2 style={{ fontSize: isMobile ? '20px' : '22px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Invoice Created!</h2>
          <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 4px' }}>{invoice.invoiceNumber}</p>
          <p style={{ fontSize: isMobile ? '32px' : '40px', fontWeight: 800, color: PRIMARY, margin: '12px 0 24px' }}>
            ₹{Number(invoice.totalAmount).toLocaleString('en-IN')}
          </p>
 
          <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '16px', marginBottom: '24px', textAlign: 'left' }}>
            {[
              { label: 'Customer', value: invoice.customerName },
              { label: 'Payment', value: invoice.paymentMethod },
              { label: 'Items', value: `${invoice.items?.length} items` },
              { label: 'Status', value: invoice.paymentStatus, green: true },
            ].map(({ label, value, green }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '13px', color: '#64748b' }}>{label}</span>
                {green
                  ? <span style={{ background: '#f0fdf4', color: '#16a34a', fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px' }}>{value}</span>
                  : <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{value}</span>
                }
              </div>
            ))}
          </div>
 
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleNew}
              style={{ flex: 1, padding: '12px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', fontWeight: 600, color: '#64748b', background: 'white', cursor: 'pointer' }}>
              New Invoice
            </button>
            <button onClick={handleDownload} disabled={downloading}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '12px', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 600, color: 'white', background: `linear-gradient(135deg, ${PRIMARY_DARK}, ${PRIMARY})`, cursor: downloading ? 'not-allowed' : 'pointer', opacity: downloading ? 0.7 : 1 }}>
              {downloading
                ? <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                : <><Download size={15} /> Download PDF</>
              }
            </button>
          </div>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }
 
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', maxWidth: '760px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: isMobile ? '20px' : '26px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Create Invoice</h1>
        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Fill in the details to generate an invoice</p>
      </div>
 
      {/* Invoice Details */}
      <div style={cardStyle}>
        {cardHeader(<FileText size={15} color="#2563eb" />, 'Invoice Details')}
        <div style={{ padding: isMobile ? '16px' : '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Customer</label>
              <select value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })} style={inputStyle}>
                <option value="">Select customer</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Payment Method</label>
              <select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} style={inputStyle}>
                {['CASH', 'UPI', 'CARD'].map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>
 
      {/* Items */}
      <div style={cardStyle}>
        {cardHeader(
          <Package size={15} color="#16a34a" />,
          'Items',
          <button onClick={addItem} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', color: '#2563eb', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={13} /> Add Item
          </button>
        )}
        <div style={{ padding: isMobile ? '16px' : '20px' }}>
          {!isMobile && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 36px', gap: '10px', marginBottom: '8px' }}>
              {['Product', 'Qty', 'Amount', ''].map(h => (
                <span key={h} style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {form.items.map((item, i) => {
              const p = getProduct(item.productId)
              return (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 100px 100px 36px', gap: '10px', alignItems: 'center', background: isMobile ? '#f8fafc' : 'transparent', borderRadius: isMobile ? '10px' : 0, padding: isMobile ? '12px' : 0 }}>
                  <div>
                    {isMobile && <label style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>Product</label>}
                    <select value={item.productId} onChange={(e) => updateItem(i, 'productId', e.target.value)} style={inputStyle}>
                      <option value="">Select product</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name} — ₹{p.sellingPrice} (Stock: {p.stockQuantity})</option>)}
                    </select>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr', gap: '10px' }}>
                    <div>
                      {isMobile && <label style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>Qty</label>}
                      <input type="number" min="1" value={item.quantity}
                        onChange={(e) => updateItem(i, 'quantity', e.target.value)}
                        style={{ ...inputStyle, textAlign: 'center' }} />
                    </div>
                    {isMobile && (
                      <div>
                        <label style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>Amount</label>
                        <div style={{ padding: '10px 14px', background: 'white', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', fontWeight: 700, color: p ? '#0f172a' : '#94a3b8' }}>
                          {p ? `₹${(p.sellingPrice * item.quantity).toLocaleString('en-IN')}` : '—'}
                        </div>
                      </div>
                    )}
                  </div>
                  {!isMobile && (
                    <div style={{ fontSize: '14px', fontWeight: 700, color: p ? '#0f172a' : '#94a3b8', textAlign: 'right' }}>
                      {p ? `₹${(p.sellingPrice * item.quantity).toLocaleString('en-IN')}` : '—'}
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: isMobile ? 'flex-end' : 'center' }}>
                    {form.items.length > 1 && (
                      <button onClick={() => removeItem(i)}
                        style={{ width: '32px', height: '32px', border: '1px solid #fecaca', borderRadius: '8px', background: '#fef2f2', color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
 
      {/* Pricing & Notes */}
      <div style={cardStyle}>
        {cardHeader(<span style={{ fontSize: '14px', fontWeight: 700, color: '#7c3aed' }}>%</span>, 'Pricing & Notes')}
        <div style={{ padding: isMobile ? '16px' : '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Discount (%)</label>
              <input type="number" min="0" max="100" value={form.discount}
                onChange={(e) => setForm({ ...form, discount: e.target.value })} style={inputStyle}
                onFocus={e => e.target.style.borderColor = PRIMARY}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tax (%)</label>
              <input type="number" min="0" value={form.taxPercent}
                onChange={(e) => setForm({ ...form, taxPercent: e.target.value })} style={inputStyle}
                onFocus={e => e.target.style.borderColor = PRIMARY}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Notes (optional)</label>
            <textarea rows={3} value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Any additional notes..."
              style={{ ...inputStyle, resize: 'none', lineHeight: '1.6' }}
              onFocus={e => e.target.style.borderColor = PRIMARY}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
          </div>
        </div>
      </div>
 
      {/* Order Summary */}
      <div style={{ background: `linear-gradient(135deg, ${PRIMARY_DARK}, ${PRIMARY})`, borderRadius: '16px', padding: isMobile ? '20px' : '28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(96,165,250,0.1)', filter: 'blur(20px)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h3 style={{ color: 'white', fontSize: '15px', fontWeight: 600, margin: '0 0 16px' }}>Order Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {[
              { label: 'Subtotal', value: `₹${subtotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}` },
              { label: `Discount (${form.discount}%)`, value: `— ₹${discountAmt.toLocaleString('en-IN', { maximumFractionDigits: 2 })}` },
              { label: `Tax (${form.taxPercent}%)`, value: `+ ₹${taxAmt.toLocaleString('en-IN', { maximumFractionDigits: 2 })}` },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>{label}</span>
                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px' }}>{value}</span>
              </div>
            ))}
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.15)', margin: '6px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'white', fontSize: '16px', fontWeight: 700 }}>Total</span>
              <span style={{ color: 'white', fontSize: isMobile ? '22px' : '26px', fontWeight: 800 }}>
                ₹{total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
 
          <button onClick={handleSubmit} disabled={loading}
            style={{ width: '100%', padding: '14px', border: 'none', borderRadius: '12px', background: 'white', color: PRIMARY, fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
            {loading
              ? <div style={{ width: '20px', height: '20px', border: `2px solid ${PRIMARY}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              : <><FileText size={18} /> Create Invoice</>
            }
          </button>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}