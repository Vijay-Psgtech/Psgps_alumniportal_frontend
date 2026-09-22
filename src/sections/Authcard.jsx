import React, { useState } from "react";
import { AlertCircle, Mail, Eye, EyeOff, Facebook, Linkedin } from "lucide-react";

const AuthCard = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
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
      setError("Please enter a password");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setIsLoading(true);
    
    // Simulate signup
    setTimeout(() => {
      setIsLoading(false);
      console.log("Signup attempt:", { email, password });
      // Here you would call your actual signup API
    }, 1500);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        /* Auth Card */
        .auth-card {
          background: white;
          border-radius: 8px;
          padding: 40px 36px;
          width: 100%;
          max-width: 380px;
          box-shadow: 0 10px 30px rgba(31, 41, 55, 0.15);
          animation: slideUp 0.6s ease-out;
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
        .auth-header {
          margin-bottom: 28px;
          text-align: center;
        }

        .auth-title {
          font-family: 'Inter', sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #1F2937;
          margin-bottom: 8px;
        }

        .auth-subtitle {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          color: #6B7280;
          font-weight: 400;
        }

        /* Form */
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: #374151;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .form-input {
          width: 100%;
          padding: 12px 14px 12px 14px;
          border: 2px solid #E5E7EB;
          border-radius: 4px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          color: #1F2937;
          background: white;
          transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
        }

        .form-input::placeholder {
          color: #D1D5DB;
        }

        .form-input:focus {
          border-color: #0052CC;
          box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.1);
        }

        .form-input.error {
          border-color: #EA4335;
          box-shadow: 0 0 0 3px rgba(234, 67, 53, 0.1);
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          cursor: pointer;
          color: #9CA3AF;
          padding: 4px 8px;
          transition: color 0.2s;
          display: flex;
          align-items: center;
        }

        .password-toggle:hover {
          color: #0052CC;
        }

        /* Submit Button */
        .submit-btn {
          padding: 12px 16px;
          background: #0052CC;
          color: white;
          border: none;
          border-radius: 4px;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          cursor: pointer;
          transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
          margin-top: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .submit-btn:hover:not(:disabled) {
          background: #1A73E8;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 82, 204, 0.3);
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
          background: rgba(234, 67, 53, 0.1);
          color: #EA4335;
          padding: 12px 14px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          margin-top: 8px;
          animation: slideUp 0.3s ease;
        }

        .error-message.show {
          display: flex;
        }

        /* Divider */
        .divider {
          text-align: center;
          margin: 20px 0;
          font-size: 12px;
          color: #9CA3AF;
          position: relative;
        }

        .divider::before,
        .divider::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 40%;
          height: 1px;
          background: #E5E7EB;
        }

        .divider::before { left: 0; }
        .divider::after { right: 0; }

        /* Social Methods */
        .social-methods {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .social-btn {
          padding: 12px 16px;
          border: 2px solid #E5E7EB;
          background: white;
          color: #374151;
          border-radius: 4px;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .social-btn:hover {
          border-color: #0052CC;
          color: #0052CC;
          background: #F8F9FA;
          transform: translateY(-2px);
        }

        /* Footer */
        .auth-footer {
          text-align: center;
          margin-top: 16px;
          font-size: 13px;
          color: #6B7280;
        }

        .auth-footer button {
          background: none;
          border: none;
          color: #0052CC;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          padding: 0;
          font-size: 13px;
          transition: color 0.2s;
        }

        .auth-footer button:hover {
          color: #1A73E8;
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
          .auth-card {
            padding: 28px 20px;
          }

          .auth-title {
            font-size: 20px;
          }

          .auth-subtitle {
            font-size: 13px;
          }

          .form-input,
          .submit-btn,
          .social-btn {
            font-size: 12px;
            padding: 11px 12px;
          }
        }
      `}</style>

      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join our alumni network today</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className={`form-input ${error ? 'error' : ''}`}
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
                className={`form-input ${error ? 'error' : ''}`}
                placeholder="Create a strong password"
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

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="form-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className={`form-input ${error ? 'error' : ''}`}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`error-message ${error ? 'show' : ''}`}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="divider">Or continue with</div>

        {/* Social Methods */}
        <div className="social-methods">
          <button className="social-btn" type="button" aria-label="Sign up with Facebook">
            <Facebook size={16} />
            Facebook
          </button>
          <button className="social-btn" type="button" aria-label="Sign up with LinkedIn">
            <Linkedin size={16} />
            LinkedIn
          </button>
          <button className="social-btn" type="button" aria-label="Sign up with Google">
            <Mail size={16} />
            Google
          </button>
        </div>

        {/* Footer */}
        <div className="auth-footer">
          Already have an account?{" "}
          <button onClick={onSwitchToLogin} type="button">
            Sign in
          </button>
        </div>
      </div>
    </>
  );
};

export default AuthCard;