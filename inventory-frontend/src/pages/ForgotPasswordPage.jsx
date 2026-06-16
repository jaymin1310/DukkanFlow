import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft, Eye, EyeOff, KeyRound, Lock, Mail, RotateCw, ShieldCheck, Store } from 'lucide-react'
import client from '../api/client'
import { useWindowSize } from '../hooks/useWindowSize'

const PRIMARY = '#1e3a5f'
const PRIMARY_DARK = '#0f2744'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState('email')
  const [form, setForm] = useState({ email: '', otp: '', newPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { isMobile } = useWindowSize()

  const requestOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await client.post('/api/auth/forgot-password', { email: form.email })
      if (res.data?.success === false) {
        toast.error(res.data.message || 'No account found with this email address')
      } else {
        toast.success(res.data?.message || 'Email found. OTP has been sent to your registered email address.')
        setStep('reset')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await client.post('/api/auth/reset-password', form)
      toast.success(res.data?.message || 'Password reset successfully')
      navigate('/login')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid email or OTP')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    paddingLeft: '44px',
    paddingRight: '16px',
    paddingTop: '12px',
    paddingBottom: '12px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '14px',
    color: '#0f172a',
    background: '#f8fafc',
    outline: 'none',
    boxSizing: 'border-box'
  }

  const submitStyle = {
    width: '100%',
    padding: '13px',
    border: 'none',
    borderRadius: '12px',
    background: loading ? '#94a3b8' : `linear-gradient(135deg, ${PRIMARY_DARK}, #2563eb)`,
    color: 'white',
    fontSize: '15px',
    fontWeight: 600,
    cursor: loading ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 4px 15px rgba(30,58,95,0.3)'
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Inter, sans-serif', background: '#f8fafc' }}>
      {!isMobile && (
        <div style={{
          width: '45%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 48px',
          background: `linear-gradient(135deg, ${PRIMARY_DARK} 0%, ${PRIMARY} 100%)`,
          position: 'relative',
          overflow: 'hidden'
        }}>
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
            Recover access<br />
            <span style={{ color: '#60a5fa' }}>securely</span>
          </h1>
          <p style={{ color: '#bfdbfe', fontSize: '16px', lineHeight: 1.7, margin: 0 }}>
            Reset your password with a one-time code sent to your registered email.
          </p>
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '24px 20px' : '48px' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#2563eb', fontSize: '14px', fontWeight: 600, textDecoration: 'none', marginBottom: '18px' }}>
            <ArrowLeft size={16} />
            Back to login
          </Link>

          <div style={{ background: 'white', borderRadius: '20px', padding: isMobile ? '24px' : '36px', boxShadow: '0 20px 60px rgba(0,0,0,0.08)' }}>
            <div style={{ marginBottom: '28px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                {step === 'email' ? <KeyRound size={22} color="#2563eb" /> : <ShieldCheck size={22} color="#2563eb" />}
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>
                {step === 'email' ? 'Forgot password' : 'Set new password'}
              </h2>
              <p style={{ color: '#64748b', fontSize: '14px', margin: 0, lineHeight: 1.6 }}>
                {step === 'email'
                  ? 'Enter your registered email to receive a reset OTP.'
                  : 'Enter the OTP from your email and choose a new password.'}
              </p>
            </div>

            <form onSubmit={step === 'email' ? requestOtp : resetPassword}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    disabled={step === 'reset'}
                    style={{ ...inputStyle, opacity: step === 'reset' ? 0.75 : 1 }}
                    onFocus={e => e.target.style.borderColor = PRIMARY}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
              </div>

              {step === 'reset' && (
                <>
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>OTP</label>
                    <div style={{ position: 'relative' }}>
                      <KeyRound size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]{6}"
                        maxLength={6}
                        placeholder="6 digit OTP"
                        value={form.otp}
                        onChange={(e) => setForm({ ...form, otp: e.target.value.replace(/\D/g, '') })}
                        required
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = PRIMARY}
                        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>New password</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Minimum 6 characters"
                        value={form.newPassword}
                        onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                        required
                        minLength={6}
                        style={{ ...inputStyle, paddingRight: '44px' }}
                        onFocus={e => e.target.style.borderColor = PRIMARY}
                        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              <button type="submit" disabled={loading} style={submitStyle}>
                {loading ? (
                  <>
                    <div style={{ width: '18px', height: '18px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Please wait...
                  </>
                ) : step === 'email' ? (
                  'Send OTP'
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>

            {step === 'reset' && (
              <button
                type="button"
                onClick={requestOtp}
                disabled={loading}
                style={{ marginTop: '14px', width: '100%', border: 'none', background: 'transparent', color: '#2563eb', fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <RotateCw size={15} />
                Resend OTP
              </button>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
