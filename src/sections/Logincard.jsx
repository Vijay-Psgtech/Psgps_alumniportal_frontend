import React, { useState } from "react";
import { AlertCircle, Mail, Eye, EyeOff, Apple, Chrome } from "lucide-react";
import { authAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginCard = ({ onSwitchToSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError("");
    setIsLoading(true);
    try {
      const response = await authAPI.login({ email, password });

      console.log("📋 Login response:", response.data);

      // Fallback: check both 'user' and 'alumni' keys for backwards compatibility
      const user = response.data.user || response.data.alumni;

      if (!user) {
        console.error("❌ No user data in response:", response.data);
        setError({ general: "Login failed: no user data received" });
        setIsLoading(false);
        return;
      }

      console.log("✅ User data received:", user);

      await login(user);

      // Role-based redirect
      if (user.role === "admin" || user.role === "superadmin") {
        navigate("/admin/dashboard");
      } else if (user.isApproved) {
        navigate("/alumni/dashboard");
      } else {
        // Registered but pending admin approval
        navigate("/alumni/register");
      }
    } catch (error) {
      console.error("❌ Login catch error:", error);
      const errorMessage =
        error.response?.data?.message || "Invalid email or password";
      // Keep error as a string so it can be rendered safely in JSX
      setError(errorMessage);
      console.error("Login Error:", error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Poppins:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');

        /* Login Card - Professional Light Theme */
        .login-card {
          background: linear-gradient(135deg, #FFFFFF 0%, #F8FAFB 100%);
          border-radius: 24px;
          padding: 48px 44px;
          width: 100%;
          max-width: 440px;
          box-shadow: 0 10px 40px rgba(15, 23, 42, 0.08), 0 2px 8px rgba(15, 23, 42, 0.04);
          animation: slideUp 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 1px solid rgba(51, 65, 85, 0.08);
          position: relative;
          overflow: hidden;
        }

        /* Subtle background pattern */
        .login-card::before {
          content: '';
          position: absolute;
          top: 0;
          right: -40%;
          width: 60%;
          height: 100%;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(14, 165, 233, 0.03) 100%);
          pointer-events: none;
          border-radius: 24px;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Header */
        .login-header {
          margin-bottom: 36px;
          text-align: center;
          position: relative;
          z-index: 2;
        }

        .login-title {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
          line-height: 1.2;
        }

        .login-subtitle {
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          color: #64748B;
          font-weight: 400;
          letter-spacing: 0.3px;
        }

        /* Form */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
          position: relative;
          z-index: 2;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .form-label {
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }

        .form-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .form-input {
          width: 100%;
          padding: 13px 16px;
          border: 2px solid #E2E8F0;
          border-radius: 12px;
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          color: #0F172A;
          background: #FFFFFF;
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
        }

        .form-input::placeholder {
          color: #CBD5E1;
          font-weight: 400;
        }

        .form-input:focus {
          border-color: #3B82F6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          background: #F8FAFC;
        }

        .form-input.error {
          border-color: #EF4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .password-toggle {
          position: absolute;
          right: 14px;
          background: none;
          border: none;
          cursor: pointer;
          color: #94A3B8;
          padding: 4px 8px;
          transition: all 0.3s;
          display: flex;
          align-items: center;
        }

        .password-toggle:hover {
          color: #3B82F6;
        }

        /* Forgot Password */
        .forgot-password {
          text-align: right;
          margin-top: -8px;
        }

        .forgot-password-link {
          font-size: 12px;
          color: #3B82F6;
          text-decoration: none;
          font-weight: 600;
          font-family: 'Poppins', sans-serif;
          transition: all 0.3s;
        }

        .forgot-password-link:hover {
          color: #1E40AF;
          text-decoration: underline;
        }

        /* Submit Button */
        .submit-btn {
          padding: 14px 16px;
          background: linear-gradient(135deg, #3B82F6 0%, #0EA5E9 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          cursor: pointer;
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
          margin-top: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.25);
          position: relative;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(59, 130, 246, 0.35);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Error Message */
        .error-message {
          display: none;
          align-items: center;
          gap: 8px;
          background: #FEE2E2;
          color: #991B1B;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid #FECACA;
          font-size: 12px;
          font-weight: 600;
          margin-top: 8px;
          animation: slideUp 0.3s ease;
          font-family: 'Poppins', sans-serif;
        }

        .error-message.show {
          display: flex;
        }

        /* Divider */
        .divider {
          text-align: center;
          margin: 28px 0;
          font-size: 12px;
          color: #94A3B8;
          position: relative;
          font-family: 'Poppins', sans-serif;
          font-weight: 500;
        }

        .divider::before,
        .divider::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 40%;
          height: 1px;
          background: #E2E8F0;
        }

        .divider::before { left: 0; }
        .divider::after { right: 0; }

        /* Social Methods */
        .social-methods {
          display: flex;
          flex-direction: column;
          gap: 12px;
          position: relative;
          z-index: 2;
        }

        .social-btn {
          padding: 12px 16px;
          border: 2px solid #E2E8F0;
          background: #FFFFFF;
          color: #334155;
          border-radius: 12px;
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .social-btn:hover {
          border-color: #3B82F6;
          color: #3B82F6;
          background: #F0F9FF;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.12);
        }

        /* Footer */
        .login-footer {
          text-align: center;
          margin-top: 24px;
          font-size: 13px;
          color: #64748B;
          position: relative;
          z-index: 2;
          font-family: 'Poppins', sans-serif;
        }

        .login-footer button {
          background: none;
          border: none;
          color: #3B82F6;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          padding: 0;
          font-size: 13px;
          transition: all 0.3s;
          font-family: 'Poppins', sans-serif;
        }

        .login-footer button:hover {
          color: #1E40AF;
          text-decoration: underline;
        }

        /* Loading Spinner */
        .loading-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Responsive Design */
        @media(max-width: 640px) {
          .login-card {
            padding: 36px 24px;
          }

          .login-title {
            font-size: 26px;
          }

          .login-subtitle {
            font-size: 13px;
          }

          .form-input,
          .submit-btn,
          .social-btn {
            font-size: 12px;
            padding: 12px 12px;
          }
        }
      `}</style>

      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Access your alumni portal</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className={`form-input ${error && !password ? "error" : ""}`}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="form-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className={`form-input ${error && password ? "error" : ""}`}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="forgot-password">
            <a href="/forgot-password" className="forgot-password-link">
              Forgot Password?
            </a>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`error-message ${error ? "show" : ""}`}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="divider">Or continue with</div>

        {/* Social Methods */}
        <div className="social-methods">
          <button
            className="social-btn"
            type="button"
            aria-label="Sign in with Apple"
          >
            <Apple size={16} />
            Apple
          </button>
          <button
            className="social-btn"
            type="button"
            aria-label="Sign in with Google"
          >
            <Chrome size={16} />
            Google
          </button>
          <button
            className="social-btn"
            type="button"
            aria-label="Sign in with Microsoft"
          >
            <Mail size={16} />
            Microsoft
          </button>
        </div>

        {/* Footer */}
        <div className="login-footer">
          Don't have an account?{" "}
          <button onClick={onSwitchToSignup} type="button">
            Sign up
          </button>
        </div>
      </div>
    </>
  );
};

export default LoginCard;
