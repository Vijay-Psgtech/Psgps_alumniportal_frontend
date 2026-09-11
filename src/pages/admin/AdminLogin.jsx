import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, Eye, EyeOff, Lock } from "lucide-react";
import { authAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import usePageTitle from "../../hooks/usePageTitle";

const AdminLogin = () => {
  usePageTitle("Admin Login");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, login: authLogin } = useAuth();

  const resetFields = useCallback(() => {
    setEmail("");
    setPassword("");
    setError("");
  }, []);

  // ✅ Redirect if already logged in as admin
  useEffect(() => {
    if (user?.isAdmin) {
      navigate("/admin/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email || !password) {
        setError("Please enter both email and password");
        setLoading(false);
        return;
      }

      console.log("🔐 Attempting admin login with:", { email });

      const response = await authAPI.login({ email, password });
      
      console.log("🔍 Login response structure:", response.data);

      // ✅ FIX: Extract token from response (try multiple possible locations)
      const token = 
        response.data.token || 
        response.data.accessToken || 
        response.data.data?.token ||
        response.data.jwtToken ||
        null;

      const user = 
        response.data.user || 
        response.data.data?.user ||
        null;

      if (!user) {
        setError("Login failed: No user data received");
        setLoading(false);
        return;
      }

      if (!user.isAdmin) {
        setError("You do not have admin privileges");
        setLoading(false);
        return;
      }

      if (user.isApproved === false) {
        setError("Your account is not approved yet");
        setLoading(false);
        return;
      }

      // ✅ Store token in localStorage if available
      if (token) {
        localStorage.setItem("authToken", token);
        console.log("✅ Auth token stored in localStorage:", token.slice(0, 30) + "...");
      } else {
        console.warn("⚠️ No token in response, relying on cookies");
      }

      console.log("✅ Admin login successful for:", user.email);
      
      // ✅ Pass both user and token to AuthContext
      await authLogin(user, token);
      
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("❌ Login error:", err);

      if (err.response?.status === 400) {
        setError(err.response?.data?.message || "Invalid email or password");
      } else if (err.response?.status === 401) {
        setError(err.response?.data?.message || "Invalid email or password");
      } else if (err.response?.status === 403) {
        setError(
          err.response?.data?.message ||
            "Admin account is inactive or not approved"
        );
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else if (err.message === "Network Error") {
        setError("Cannot connect to server. Is the backend running?");
      } else {
        setError(
          err.response?.data?.message || "Login failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Panel - Branding */}
        <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-center">
          <div className="mb-6">
            <img src="/psgcas.png" alt="PSG CAS Logo" className="h-24 mx-auto" />
          </div>
          <h2 className="text-3xl font-bold text-white">Welcome Admin!</h2>
          <p className="text-indigo-100 mt-4 text-base leading-relaxed">
            Sign in to manage the alumni network and oversee registrations across all departments.
          </p>
          <div className="mt-8 space-y-3 text-sm text-indigo-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-300 rounded-full"></span>
              <span>Dashboard Analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-300 rounded-full"></span>
              <span>Alumni Management</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-300 rounded-full"></span>
              <span>Campaign Management</span>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <Lock className="text-blue-700" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
            <p className="text-gray-500 text-sm mt-2">
              Enter your credentials to access the admin panel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Alert */}
            {error && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg animate-pulse">
                <AlertCircle className="mt-0.5 flex-shrink-0" size={20} />
                <div>
                  <p className="font-semibold text-sm">Login Failed</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100"
                required
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-12 disabled:bg-gray-100"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-3 top-3.5 text-gray-600 hover:text-gray-800 transition disabled:opacity-50"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <Eye size={20} />
                  ) : (
                    <EyeOff size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium transition"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Buttons */}
            <div className="space-y-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    Sign In
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={resetFields}
                disabled={loading}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear Fields
              </button>
            </div>

            {/* Info Text */}
            <div className="text-center text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200 mt-6">
              <p>🔒 Admin credentials are required to access the dashboard.</p>
              <p className="mt-1">This login area is restricted to authorized administrators only.</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;