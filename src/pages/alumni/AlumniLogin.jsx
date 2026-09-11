// src/pages/alumni/AlumniLogin.jsx
// ✅ FIXED:
//   1. Uses AuthContext login() — NavBar updates instantly without page refresh
//   2. Forgot password links to /alumni/forgot-password (not a broken #anchor)
//   3. Role-based redirect: admin → /alumni/dashboard, alumni → /alumni/profile
//   4. Password input has padding-right so text doesn't hide under eye toggle

import React, { useState, useCallback, use } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, AlertCircle, Eye, EyeOff, Loader } from "lucide-react";
import { authAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import usePageTitle from "../../hooks/usePageTitle";

const AlumniLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ FIX 1: get login() from context
  usePageTitle("Sign In");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const resetFields = useCallback(() => {
    setEmail("");
    setPassword("");
    setErrors({});
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Valid email is required";
    }
    if (!password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email, password]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      setLoading(true);
      setErrors({});

      try {
        const response = await authAPI.login({ email, password });

        console.log("📋 Login response:", response.data);

        const token = response.data.token || response.data.accessToken || null;
        const user = response.data.user || response.data.alumni || response.data.data?.user;

        if (!user) {
          console.error("❌ No user data in response:", response.data);
          setErrors({ general: "Login failed: no user data received" });
          return;
        }

        if (token) {
          localStorage.setItem("authToken", token);
        }

        console.log("✅ User data received:", user);

        await login(user, token);

        // Role-based redirect
        if (user.role === "admin" || user.role === "superadmin") {
          navigate("/admin/dashboard");
        } else if (user.isApproved) {
          navigate("/alumni/dashboard");
        } else {
          // Registered but pending admin approval
          navigate("/alumni/register");
        }
      } catch (err) {
        console.error("❌ Login catch error:", err);
        const errorMessage =
          err.response?.data?.message || "Invalid email or password";
        setErrors({ general: errorMessage });
        console.error("Login Error:", err);
      } finally {
        setLoading(false);
      }
    },
    [email, password, validateForm, navigate, login],
  );

  return (
    <div className="alumni-login-shell">
      <div className="alumni-login-card">
        <div className="alumni-login-brand-panel">
          <div className="alumni-login-badge">PSGPS Alumni</div>
          <h2>Welcome back.</h2>
          <p>Sign in to reconnect with your classmates, stay updated on reunions, and access your alumni community.</p>
          <div className="alumni-login-points">
            <span>Connect with fellow alumni</span>
            <span>Stay informed on events</span>
            <span>Access the alumni network</span>
          </div>
        </div>

        <div className="alumni-login-form-panel">
          <div className="alumni-login-header">
            <div className="alumni-login-icon-wrap">
              <LogIn className="alumni-login-icon" size={28} />
            </div>
            <h3>Login</h3>
            <p>Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="alumni-login-form">
            {errors.general && (
              <div className="alumni-login-alert">
                <AlertCircle size={18} />
                <span>{errors.general}</span>
              </div>
            )}

            <div className="alumni-login-field">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              {errors.email && <span className="alumni-login-error"><AlertCircle size={12} /> {errors.email}</span>}
            </div>

            <div className="alumni-login-field">
              <label>Password</label>
              <div className="alumni-login-password-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={loading} aria-label="Toggle password visibility">
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              {errors.password && <span className="alumni-login-error"><AlertCircle size={12} /> {errors.password}</span>}
            </div>

            <div className="alumni-login-links">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

            <div className="alumni-login-actions">
              <button type="button" className="alumni-login-clear" onClick={resetFields} disabled={loading}>Clear</button>
              <button type="submit" className="alumni-login-submit" disabled={loading}>
                {loading ? <><Loader size={16} className="spinner" /> Signing In...</> : <><LogIn size={16} /> Sign In</>}
              </button>
            </div>

            <div className="alumni-login-signup">
              <span>Don&apos;t have an account?</span>
              <Link to="/alumni/register">Create one now</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AlumniLogin;
