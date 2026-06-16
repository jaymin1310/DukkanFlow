import { useState, useEffect } from 'react'
import client from '../api/client'
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react'
import { useWindowSize } from '../hooks/useWindowSize'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function ProfitLossPage() {
  const { isMobile } = useWindowSize()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client.get('/api/profit-loss')
      .then(res => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTopColor: '#1e3a5f', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  if (!data) return null

  const isProfit = data.totalProfit >= 0

  const chartData = data.productWiseProfit.slice(0, 8).map(p => ({
    name: p.productName.length > 10 ? p.productName.substring(0, 10) + '...' : p.productName,
    profit: parseFloat(p.profit.toFixed(2)),
    revenue: parseFloat(p.revenue.toFixed(2)),
    cost: parseFloat(p.cost.toFixed(2)),
  }))

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: isMobile ? '20px' : '26px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Profit & Loss Report</h1>
        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Analysis based on all invoices</p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
        {[
          { label: 'Total Revenue', value: `₹${data.totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, icon: DollarSign, bg: '#eff6ff', color: '#2563eb' },
          { label: 'Total Cost', value: `₹${data.totalCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, icon: TrendingDown, bg: '#fef2f2', color: '#dc2626' },
          { label: 'Net Profit', value: `₹${data.totalProfit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, icon: TrendingUp, bg: isProfit ? '#f0fdf4' : '#fef2f2', color: isProfit ? '#16a34a' : '#dc2626' },
          { label: 'Profit Margin', value: `${data.profitMargin.toFixed(1)}%`, icon: BarChart3, bg: '#f5f3ff', color: '#7c3aed' },
        ].map(({ label, value, icon: Icon, bg, color }) => (
          <div key={label} style={{ background: 'white', borderRadius: '16px', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              <Icon size={18} color={color} />
            </div>
            <p style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: 700, color, margin: '0 0 4px' }}>{value}</p>
            <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div style={{ background: 'white', borderRadius: '16px', padding: isMobile ? '16px' : '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>Profit by Product</h3>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 20px' }}>Top products by profit</p>
          <ResponsiveContainer width="100%" height={isMobile ? 200 : 260}>
            <BarChart data={chartData} barSize={isMobile ? 16 : 24}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '12px' }} cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="profit" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.profit >= 0 ? '#1e3a5f' : '#dc2626'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Product Table */}
      <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: 0 }}>Product-wise Analysis</h3>
        </div>
        {data.productWiseProfit.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#94a3b8' }}>
            <BarChart3 size={36} style={{ marginBottom: '10px', opacity: 0.3 }} />
            <p style={{ margin: 0, fontSize: '14px' }}>No sales data yet</p>
          </div>
        ) : isMobile ? (
          <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {data.productWiseProfit.map((p, i) => (
              <div key={i} style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{p.productName}</p>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: p.profit >= 0 ? '#16a34a' : '#dc2626', background: p.profit >= 0 ? '#f0fdf4' : '#fef2f2', padding: '2px 8px', borderRadius: '20px' }}>
                    {p.margin.toFixed(1)}%
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[
                    { label: 'Units', value: p.unitsSold },
                    { label: 'Revenue', value: `₹${p.revenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` },
                    { label: 'Profit', value: `₹${p.profit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, color: p.profit >= 0 ? '#16a34a' : '#dc2626' },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{ background: 'white', borderRadius: '8px', padding: '8px' }}>
                      <p style={{ fontSize: '10px', color: '#94a3b8', margin: '0 0 2px', textTransform: 'uppercase' }}>{label}</p>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: color || '#0f172a', margin: 0 }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Product', 'Units Sold', 'Revenue', 'Cost', 'Profit', 'Margin'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 20px', fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.productWiseProfit.map((p, i) => (
                  <tr key={i}
                    style={{ borderTop: '1px solid #f8fafc', background: i % 2 === 0 ? 'white' : '#fafafa' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f0f7ff'}
                    onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'white' : '#fafafa'}
                  >
                    <td style={{ padding: '14px 20px', fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{p.productName}</td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: '#64748b' }}>{p.unitsSold}</td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: '#0f172a' }}>₹{p.revenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: '#64748b' }}>₹{p.cost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                    <td style={{ padding: '14px 20px', fontSize: '14px', fontWeight: 700, color: p.profit >= 0 ? '#16a34a' : '#dc2626' }}>
                      ₹{p.profit.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ background: p.margin >= 0 ? '#f0fdf4' : '#fef2f2', color: p.margin >= 0 ? '#16a34a' : '#dc2626', fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '20px' }}>
                        {p.margin.toFixed(1)}%
                      </span>
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