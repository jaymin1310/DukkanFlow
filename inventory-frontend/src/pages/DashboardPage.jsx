import { useState, useEffect } from 'react'
import client from '../api/client'
import { Package, Users, FileText, AlertTriangle, TrendingUp, ShoppingCart } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAuth } from '../context/AuthContext'
import { useWindowSize } from '../hooks/useWindowSize'
 
function StatCard({ icon: Icon, label, value, iconBg, iconColor }) {
  return (
    <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={18} color={iconColor} />
        </div>
      </div>
      <p style={{ fontSize: '26px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{value}</p>
      <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>{label}</p>
    </div>
  )
}
 
export default function DashboardPage() {
  const { user } = useAuth()
  const { isMobile } = useWindowSize()
  const [summary, setSummary] = useState({ totalProducts: 0, totalCustomers: 0, totalInvoices: 0, lowStockCount: 0, totalRevenue: 0 })
  const [invoices, setInvoices] = useState([])
  const [lowStock, setLowStock] = useState([])
  const [salesData, setSalesData] = useState([])
  const [loading, setLoading] = useState(true)
 
  useEffect(() => {
    Promise.all([
      client.get('/api/dashboard/summary'),
      client.get('/api/invoices?page=0&size=100'),
      client.get('/api/products/low-stock'),
    ]).then(([s, i, l]) => {
      setSummary(s.data)
      // invoices now returns Page object — extract content array
      const invoiceList = i.data?.content || []
      setInvoices(invoiceList)
      setLowStock(l.data || [])
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
      setSalesData(months.map((month, idx) => ({
        month,
        sales: invoiceList.filter(inv => new Date(inv.createdAt).getMonth() === idx)
          .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0)
      })))
    }).finally(() => setLoading(false))
  }, [])
 
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#1e3a5f', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
 
  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: isMobile ? '22px' : '26px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Dashboard</h1>
        <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Welcome back, <strong>{user?.name}</strong>!</p>
      </div>
 
      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <StatCard icon={Package} label="Total Products" value={summary.totalProducts} iconBg="#eff6ff" iconColor="#2563eb" />
        <StatCard icon={Users} label="Customers" value={summary.totalCustomers} iconBg="#f5f3ff" iconColor="#7c3aed" />
        <StatCard icon={FileText} label="Invoices" value={summary.totalInvoices} iconBg="#f0fdf4" iconColor="#16a34a" />
        <StatCard icon={AlertTriangle} label="Low Stock" value={summary.lowStockCount} iconBg="#fef2f2" iconColor="#dc2626" />
      </div>
 
      {/* Revenue + Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '260px 1fr', gap: '16px', marginBottom: '20px' }}>
        <div style={{ background: 'linear-gradient(135deg, #0f2744, #1e3a5f)', borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(96,165,250,0.15)', filter: 'blur(20px)' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(96,165,250,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              <TrendingUp size={18} color="#93c5fd" />
            </div>
            <p style={{ color: '#93c5fd', fontSize: '13px', margin: '0 0 6px' }}>Total Revenue</p>
            <p style={{ color: 'white', fontSize: isMobile ? '24px' : '30px', fontWeight: 700, margin: '0 0 16px' }}>
              ₹{Number(summary.totalRevenue).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </p>
            <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingCart size={13} color="#60a5fa" />
              <span style={{ color: '#93c5fd', fontSize: '12px' }}>{summary.totalInvoices} invoices</span>
            </div>
          </div>
        </div>
 
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>Sales Overview</h3>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 16px' }}>Monthly — {new Date().getFullYear()}</p>
          {salesData.every(d => d.sales === 0) ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '150px', color: '#94a3b8' }}>
              <FileText size={32} style={{ marginBottom: '8px', opacity: 0.3 }} />
              <p style={{ margin: 0, fontSize: '13px' }}>No sales yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={salesData} barSize={isMobile ? 14 : 20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '12px' }} cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="sales" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
 
      {/* Low Stock */}
      {lowStock.length > 0 && (
        <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', overflow: 'hidden', marginBottom: '20px' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} color="#dc2626" />
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', margin: 0 }}>Low Stock Alerts</h3>
            <span style={{ marginLeft: 'auto', background: '#fef2f2', color: '#dc2626', fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '20px' }}>{lowStock.length} items</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '400px' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Product', 'SKU', 'Stock', 'Status'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 20px', fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lowStock.map((p, i) => (
                  <tr key={p.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 20px', fontSize: '13px', fontWeight: 500, color: '#0f172a' }}>{p.name}</td>
                    <td style={{ padding: '12px 20px', fontSize: '12px', color: '#64748b', fontFamily: 'monospace' }}>{p.sku}</td>
                    <td style={{ padding: '12px 20px', fontSize: '13px', fontWeight: 600, color: '#dc2626' }}>{p.stockQuantity}</td>
                    <td style={{ padding: '12px 20px' }}>
                      <span style={{ background: '#fef2f2', color: '#dc2626', fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '20px' }}>Low Stock</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
 
      {/* Recent Invoices */}
      <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', margin: 0 }}>Recent Invoices</h3>
          <span style={{ color: '#2563eb', fontSize: '12px', fontWeight: 500 }}>{invoices.length} total</span>
        </div>
        {invoices.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '160px', color: '#94a3b8' }}>
            <FileText size={32} style={{ marginBottom: '8px', opacity: 0.3 }} />
            <p style={{ margin: 0, fontSize: '13px' }}>No invoices yet</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '480px' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Invoice No', 'Customer', 'Amount', 'Payment', 'Status'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 20px', fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.slice(0, 5).map((inv, i) => (
                  <tr key={inv.id} style={{ borderTop: '1px solid #f1f5f9', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                    <td style={{ padding: '12px 20px', fontSize: '12px', fontFamily: 'monospace', color: '#2563eb', fontWeight: 600 }}>{inv.invoiceNumber}</td>
                    <td style={{ padding: '12px 20px', fontSize: '13px', fontWeight: 500, color: '#0f172a' }}>{inv.customerName}</td>
                    <td style={{ padding: '12px 20px', fontSize: '13px', fontWeight: 600 }}>₹{Number(inv.totalAmount).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '12px 20px', fontSize: '12px', color: '#64748b' }}>{inv.paymentMethod}</td>
                    <td style={{ padding: '12px 20px' }}>
                      <span style={{ background: '#f0fdf4', color: '#16a34a', fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '20px' }}>{inv.paymentStatus}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}