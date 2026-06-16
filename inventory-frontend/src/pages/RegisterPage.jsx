import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import client from "../api/client";
import toast from "react-hot-toast";
import {
  Store,
  Eye,
  EyeOff,
  Lock,
  Mail,
  KeyRound,
  User,
  Phone,
  MapPin,
  ShoppingBag,
} from "lucide-react";
import { useWindowSize } from "../hooks/useWindowSize";

const PRIMARY = "#1e3a5f";
const PRIMARY_DARK = "#0f2744";

export default function RegisterPage() {
  const [step, setStep] = useState("register");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    shopName: "",
    shopAddress: "",
    role: "OWNER",
  });
  const [otp, setOtp] = useState("");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isMobile } = useWindowSize();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await client.post("/api/auth/register", form);
      setVerificationEmail(form.email);
      setStep("verify");
      toast.success(res.data || "OTP has been sent to your email.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await client.post("/api/auth/verify-registration-otp", {
        email: verificationEmail,
        otp,
      });
      toast.success(res.data?.message || "Email verified successfully. Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    paddingLeft: "44px",
    paddingRight: "16px",
    paddingTop: "11px",
    paddingBottom: "11px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "14px",
    color: "#0f172a",
    background: "#f8fafc",
    outline: "none",
    boxSizing: "border-box",
  };

  const fields = [
    {
      key: "name",
      label: "Full Name",
      type: "text",
      placeholder: "Jaymin Solanki",
      icon: User,
    },
    {
      key: "email",
      label: "Email Address",
      type: "email",
      placeholder: "jaymin@gmail.com",
      icon: Mail,
    },
    {
      key: "mobile",
      label: "Mobile Number",
      type: "tel",
      placeholder: "9876543210",
      icon: Phone,
    },
    {
      key: "shopName",
      label: "Shop Name",
      type: "text",
      placeholder: "Jaymin Kirana Store",
      icon: ShoppingBag,
    },
    {
      key: "shopAddress",
      label: "Shop Address",
      type: "text",
      placeholder: "Anand, Gujarat",
      icon: MapPin,
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Left panel — hidden on mobile */}
      {!isMobile && (
        <div
          style={{
            width: "40%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px 48px",
            background: `linear-gradient(135deg, ${PRIMARY_DARK} 0%, ${PRIMARY} 100%)`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-80px",
              right: "-80px",
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              background: "rgba(96,165,250,0.1)",
              filter: "blur(40px)",
            }}
          />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "48px",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "rgba(96,165,250,0.2)",
                  border: "1px solid rgba(96,165,250,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Store size={22} color="#93c5fd" />
              </div>
              <div>
                <p
                  style={{
                    color: "white",
                    fontWeight: 700,
                    fontSize: "18px",
                    margin: 0,
                  }}
                >
                  DukaanFlow
                </p>
                <p style={{ color: "#93c5fd", fontSize: "12px", margin: 0 }}>
                  SaaS Billing System
                </p>
              </div>
            </div>
            <h1
              style={{
                fontSize: "38px",
                fontWeight: 800,
                color: "white",
                lineHeight: 1.2,
                margin: "0 0 16px",
              }}
            >
              Start managing
              <br />
              <span style={{ color: "#60a5fa" }}>your shop today</span>
            </h1>
            <p
              style={{
                color: "#bfdbfe",
                fontSize: "15px",
                lineHeight: 1.7,
                margin: "0 0 32px",
              }}
            >
              Join thousands of shopkeepers who manage their inventory and
              billing digitally.
            </p>
            {[
              "✓ Complete inventory management",
              "✓ Instant PDF invoice generation",
              "✓ Customer & sales tracking",
              "✓ Low stock alerts",
              "✓ Multi-shop support",
            ].map((f) => (
              <p
                key={f}
                style={{
                  color: "#dbeafe",
                  fontSize: "14px",
                  margin: "0 0 10px",
                }}
              >
                {f}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Right panel */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: isMobile ? "24px 20px" : "40px",
          background: "#f8fafc",
          overflowY: "auto",
        }}
      >
        <div style={{ width: "100%", maxWidth: "440px" }}>
          {isMobile && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "28px",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: PRIMARY,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Store size={20} color="white" />
              </div>
              <span
                style={{ fontWeight: 700, fontSize: "20px", color: PRIMARY }}
              >
                DukaanFlow
              </span>
            </div>
          )}

          <div style={{ marginBottom: "20px" }}>
            <h2
              style={{
                fontSize: isMobile ? "22px" : "26px",
                fontWeight: 700,
                color: "#0f172a",
                margin: "0 0 6px",
              }}
            >
              {step === "register" ? "Create your account" : "Verify your email"}
            </h2>
            <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
              {step === "register" ? "Already have an account?" : `OTP sent to ${verificationEmail}`}{" "}
              <Link
                to="/login"
                style={{
                  color: "#2563eb",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                {step === "register" ? "Sign in" : "Back to login"}
              </Link>
            </p>
          </div>

          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: isMobile ? "20px" : "28px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
            }}
          >
            <form onSubmit={step === "register" ? handleSubmit : handleVerifyOtp}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                {step === "register" ? fields.map(({ key, label, type, placeholder, icon: Icon }) => (
                  <div key={key}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#374151",
                        marginBottom: "5px",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {label}
                    </label>
                    <div style={{ position: "relative" }}>
                      <Icon
                        size={15}
                        color="#94a3b8"
                        style={{
                          position: "absolute",
                          left: "14px",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      />
                      <input
                        type={type}
                        placeholder={placeholder}
                        value={form[key]}
                        onChange={(e) =>
                          setForm({ ...form, [key]: e.target.value })
                        }
                        required
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = PRIMARY)}
                        onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                      />
                    </div>
                  </div>
                )) : (
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#374151",
                        marginBottom: "5px",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Verification OTP
                    </label>
                    <div style={{ position: "relative" }}>
                      <KeyRound
                        size={15}
                        color="#94a3b8"
                        style={{
                          position: "absolute",
                          left: "14px",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      />
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]{6}"
                        maxLength={6}
                        placeholder="6 digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        required
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = PRIMARY)}
                        onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                      />
                    </div>
                  </div>
                )}

                {step === "register" && <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#374151",
                      marginBottom: "5px",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <Lock
                      size={15}
                      color="#94a3b8"
                      style={{
                        position: "absolute",
                        left: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min 6 characters"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      required
                      style={{ ...inputStyle, paddingRight: "44px" }}
                      onFocus={(e) => (e.target.style.borderColor = PRIMARY)}
                      onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#94a3b8",
                        display: "flex",
                      }}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "13px",
                    border: "none",
                    borderRadius: "12px",
                    background: loading
                      ? "#94a3b8"
                      : `linear-gradient(135deg, ${PRIMARY_DARK}, #2563eb)`,
                    color: "white",
                    fontSize: "15px",
                    fontWeight: 600,
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    boxShadow: "0 4px 15px rgba(30,58,95,0.3)",
                    marginTop: "4px",
                  }}
                >
                  {loading ? (
                    <>
                      <div
                        style={{
                          width: "18px",
                          height: "18px",
                          border: "2px solid white",
                          borderTopColor: "transparent",
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite",
                        }}
                      />
                      {step === "register" ? "Creating..." : "Verifying..."}
                    </>
                  ) : step === "register" ? (
                    "Create Shop & Register →"
                  ) : (
                    "Verify Email"
                  )}
                </button>
              </div>
            </form>
          </div>

          <p
            style={{
              textAlign: "center",
              color: "#94a3b8",
              fontSize: "12px",
              marginTop: "16px",
            }}
          >
            By registering you agree to our Terms of Service
          </p>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
