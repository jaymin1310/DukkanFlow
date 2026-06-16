import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import DashboardPage from './pages/DashboardPage'
import ProductsPage from './pages/ProductsPage'
import CustomersPage from './pages/CustomersPage'
import CreateInvoicePage from './pages/CreateInvoicePage'
import CategoriesPage from './pages/CategoriesPage'
import InvoicesPage from './pages/InvoicesPage'
import ProfitLossPage from './pages/ProfitLossPage'
import ProfilePage from './pages/ProfilePage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{
          duration: 3000,
          style: { background: '#1e293b', color: '#fff', borderRadius: '10px', fontSize: '14px' },
          success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          <Route path="/app" element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="invoices" element={<InvoicesPage />} />
            <Route path="invoices/create" element={<CreateInvoicePage />} />
            <Route path="profit-loss" element={<ProfitLossPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/products" element={<Navigate to="/app/products" replace />} />
          <Route path="/customers" element={<Navigate to="/app/customers" replace />} />
          <Route path="/categories" element={<Navigate to="/app/categories" replace />} />
          <Route path="/invoices/create" element={<Navigate to="/app/invoices/create" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
