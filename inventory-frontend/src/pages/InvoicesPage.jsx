import { useState, useEffect } from 'react'
import client from '../api/client'
import toast from 'react-hot-toast'
import { FileText, Download, Trash2, Search, Eye } from 'lucide-react'
import { useWindowSize } from '../hooks/useWindowSize'
 
function ConfirmDialog({ onConfirm, onCancel }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)', padding: '16px' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '28px', maxWidth: '360px', width: '100%', textAlign: 'center', boxShadow: '0 25px 60px rgba(0,0,0,0.2)', animation: 'modalIn 0.2s ease' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
          <Trash2 size={22} color="#dc2626" />
        </div>
        <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>Delete Invoice?</h3>
        <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 22px' }}>This action cannot be undone.</p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '11px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', fontWeight: 600, color: '#64748b', background: 'white', cursor: 'pointer' }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex: 1, padding: '11px', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 600, color: 'white', background: 'linear-gradient(135deg, #dc2626, #ef4444)', cursor: 'pointer' }}>Delete</button>
        </div>
      </div>
    </div>
  )
}
 
function InvoiceDetailModal({ invoice, onClose, onDownload, downloading }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)' }}>
      <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '500px', boxShadow: '0 25px 60px rgba(0,0,0,0.2)', overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ padding: '18px 24px', background: 'linear-gradient(135deg, #0f2744, #1e3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0 }}>
          <div>
            <p style={{ color: 'white', fontWeight: 700, fontSize: '15px', margin: 0 }}>{invoice.invoiceNumber}</p>
            <p style={{ color: '#93c5fd', fontSize: '12px', margin: 0 }}>{new Date(invoice.createdAt).toLocaleDateString('en-IN')}</p>
          </div>
          <button onClick={onClose} style={{ width: '30px', height: '30px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            {[
              { label: 'Customer', value: invoice.customerName },
              { label: 'Payment', value: invoice.paymentMethod },
              { label: 'Created By', value: invoice.createdBy },
              { label: 'Status', value: invoice.paymentStatus },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: '#f8fafc', borderRadius: '10px', padding: '12px' }}>
                <p style={{ fontSize: '10px', color: '#94a3b8', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', margin: 0 }}>{value}</p>
              </div>
            ))}
          </div>
          <h4 style={{ fontSize: '12px', fontWeight: 600, color: '#374151', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Items</h4>
          <div style={{ background: '#f8fafc', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}>
            {invoice.items?.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderBottom: i < invoice.items.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', margin: 0 }}>{item.productName}</p>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>₹{item.unitPrice} × {item.quantity}</p>
                </div>
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', margin: 0 }}>₹{Number(item.totalPrice).toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>
          <div style={{ background: '#1e3a5f', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
            {[
              { label: 'Subtotal', value: `₹${Number(invoice.subtotal).toLocaleString('en-IN')}` },
              { label: `Discount (${invoice.discount}%)`, value: `— ₹${(Number(invoice.subtotal) * Number(invoice.discount) / 100).toFixed(2)}` },
              { label: `Tax (${invoice.taxPercent}%)`, value: `+ ₹${(Number(invoice.subtotal) * (1 - Number(invoice.discount) / 100) * Number(invoice.taxPercent) / 100).toFixed(2)}` },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>{label}</span>
                <span style={{ color: 'white', fontSize: '13px' }}>{value}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.15)', marginTop: '6px' }}>
              <span style={{ color: 'white', fontSize: '15px', fontWeight: 700 }}>Total</span>
              <span style={{ color: 'white', fontSize: '18px', fontWeight: 800 }}>₹{Number(invoice.totalAmount).toLocaleString('en-IN')}</span>
            </div>
          </div>
          <button onClick={() => onDownload(invoice)} disabled={downloading}
            style={{ width: '100%', padding: '13px', border: 'none', borderRadius: '12px', background: 'linear-gradient(135deg, #0f2744, #1e3a5f)', color: 'white', fontSize: '14px', fontWeight: 600, cursor: downloading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {downloading ? <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              : <><Download size={16} /> Download PDF</>}
          </button>
        </div>
      </div>
    </div>
  )
}
 
const PERIODS = [
  { label: 'All', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'This Year', value: 'year' },
]
 
export default function InvoicesPage() {
  const { isMobile } = useWindowSize()
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [period, setPeriod] = useState('all')
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [downloading, setDownloading] = useState(false)
 
  const fetchInvoices = async (p = 'all') => {
    setLoading(true)
    try {
      if (p === 'all') {
        const res = await client.get('/api/invoices?page=0&size=100')
        // API returns Page object — extract content array
        setInvoices(res.data?.content || [])
      } else {
        const res = await client.get(`/api/invoices/filter?period=${p}`)
        setInvoices(res.data || [])
      }
    } catch { toast.error('Failed to load invoices') }
    finally { setLoading(false) }
  }
 
  useEffect(() => { fetchInvoices() }, [])
 
  const handlePeriod = (p) => { setPeriod(p); fetchInvoices(p) }
 
  const handleDownload = async (invoice) => {
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
    } catch { toast.error('Failed to download') }
    finally { setDownloading(false) }
  }
 
  const confirmDeleteAction = async () => {
    try {
      await client.delete(`/api/invoices/${confirmDelete}`)
      toast.success('Invoice deleted!')
      fetchInvoices(period)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to delete')
    } finally { setConfirmDelete(null) }
  }
 
  const filtered = invoices.filter(inv =>
    inv.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
    inv.customerName?.toLowerCase().includes(search.toLowerCase())
  )
 
  const totalRevenue = filtered.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0)
  const inputStyle = { width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', color: '#0f172a', background: '#f8fafc', outline: 'none', boxSizing: 'border-box' }
 
  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: isMobile ? '20px' : '26px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Invoices</h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>{filtered.length} invoices · ₹{totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })} total</p>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #0f2744, #1e3a5f)', borderRadius: '12px', padding: '10px 16px' }}>
          <p style={{ color: '#93c5fd', fontSize: '11px', margin: '0 0 2px' }}>Revenue</p>
          <p style={{ color: 'white', fontSize: '16px', fontWeight: 700, margin: 0 }}>₹{totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
        </div>
      </div>
 
      <div style={{ background: 'white', borderRadius: '14px', padding: '14px 16px', marginBottom: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {PERIODS.map(p => (
            <button key={p.value} onClick={() => handlePeriod(p.value)}
              style={{ padding: '6px 14px', borderRadius: '20px', border: period === p.value ? 'none' : '1px solid #e2e8f0', background: period === p.value ? '#1e3a5f' : 'white', color: period === p.value ? 'white' : '#64748b', fontSize: '12px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {p.label}
            </button>
          ))}
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input type="text" placeholder="Search by invoice number or customer..."
            value={search} onChange={(e) => setSearch(e.target.value)}
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
        ) : filtered.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '250px', color: '#94a3b8' }}>
            <FileText size={40} style={{ marginBottom: '10px', opacity: 0.3 }} />
            <p style={{ fontWeight: 500, margin: '0 0 4px' }}>No invoices found</p>
          </div>
        ) : isMobile ? (
          <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filtered.map(inv => (
              <div key={inv.id} style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb', margin: '0 0 2px', fontFamily: 'monospace' }}>{inv.invoiceNumber}</p>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', margin: '0 0 2px' }}>{inv.customerName}</p>
                    <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>{new Date(inv.createdAt).toLocaleDateString('en-IN')} · {inv.paymentMethod}</p>
                  </div>
                  <span style={{ background: '#f0fdf4', color: '#16a34a', fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '20px', flexShrink: 0 }}>{inv.paymentStatus}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>₹{Number(inv.totalAmount).toLocaleString('en-IN')}</p>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[
                      { icon: Eye, action: () => setSelectedInvoice(inv) },
                      { icon: Download, action: () => handleDownload(inv) },
                      { icon: Trash2, action: () => setConfirmDelete(inv.id) },
                    ].map(({ icon: Icon, action }, idx) => (
                      <button key={idx} onClick={action}
                        style={{ width: '32px', height: '32px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                        <Icon size={14} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Invoice No', 'Customer', 'Date', 'Payment', 'Amount', 'Status', ''].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 20px', fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv, i) => (
                <tr key={inv.id}
                  style={{ borderTop: '1px solid #f8fafc', background: i % 2 === 0 ? 'white' : '#fafafa' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f0f7ff'}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'white' : '#fafafa'}
                >
                  <td style={{ padding: '14px 20px', fontSize: '12px', fontFamily: 'monospace', color: '#2563eb', fontWeight: 600 }}>{inv.invoiceNumber}</td>
                  <td style={{ padding: '14px 20px', fontSize: '14px', fontWeight: 500, color: '#0f172a' }}>{inv.customerName}</td>
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: '#64748b' }}>{new Date(inv.createdAt).toLocaleDateString('en-IN')}</td>
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: '#64748b' }}>{inv.paymentMethod}</td>
                  <td style={{ padding: '14px 20px', fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>₹{Number(inv.totalAmount).toLocaleString('en-IN')}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ background: '#f0fdf4', color: '#16a34a', fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '20px' }}>{inv.paymentStatus}</span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => setSelectedInvoice(inv)} style={{ width: '32px', height: '32px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.color = '#2563eb' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#64748b' }}>
                        <Eye size={14} />
                      </button>
                      <button onClick={() => handleDownload(inv)} style={{ width: '32px', height: '32px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#f0fdf4'; e.currentTarget.style.color = '#16a34a' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#64748b' }}>
                        <Download size={14} />
                      </button>
                      <button onClick={() => setConfirmDelete(inv.id)} style={{ width: '32px', height: '32px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}
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
 
      {selectedInvoice && <InvoiceDetailModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} onDownload={handleDownload} downloading={downloading} />}
      {confirmDelete && <ConfirmDialog onConfirm={confirmDeleteAction} onCancel={() => setConfirmDelete(null)} />}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes modalIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}`}</style>
    </div>
  )
}