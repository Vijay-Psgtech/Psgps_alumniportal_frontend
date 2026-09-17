import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, Eye, EyeOff, Lock } from "lucide-react";
import { authAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import usePageTitle from "../../hooks/usePageTitle";
import psgpslogo from  "../../assets/ALUMNI LOGO.jpg";

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

  // ✅ Redirect if already logged in as admin (cookie-based session)
  useEffect(() => {
    if (user?.isAdmin) {
      navigate("/admin/dashboard");
    }
  }, [user]);

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

      // Server sets HttpOnly cookie automatically — no token in response body
      const user = response.data.user;

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

      if (!user.isApproved) {
        setError("Your account is not approved yet");
        setLoading(false);
        return;
      }

      console.log("✅ Admin login successful");
      await authLogin(user); // seed AuthContext state; cookie already set by server
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
            "Admin account is inactive or not approved",
        );
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else if (err.message === "Network Error") {
        setError("Cannot connect to server. Is the backend running?");
      } else {
        setError(
          err.response?.data?.message || "Login failed. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Left Panel - Branding */}
        <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-white shadow-2xl p-8 text-center">
          <img src={psgpslogo} alt="Logo" className="h-20 mb-6" />
          <h2 className="text-2xl font-bold text-blue-800">Welcome Admin!</h2>
          <p className="text-sm font-semibold text-gray-600 mt-4">
            Sign in to manage the alumni network and oversee registrations.
          </p>
        </div>
        {/* Right Panel - Login Form */}
        <div className="w-full md:w-1/2 p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-blue-100 p-3 rounded-full mb-2">
              <Lock className="text-blue-700" size={32} />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Admin Login</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center bg-red-100 text-red-700 p-3 rounded">
                <AlertCircle className="mr-2" size={20} />
                <span>{error}</span>
              </div>
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error.email && (
              <p className="text-red-500 text-sm">{error.email}</p>
            )}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              />
              <span
                className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </span>
            </div>
            {error.password && (
              <p className="text-red-500 text-sm">{error.password}</p>
            )}

            {/* Submit */}
            <div className="flex justify-between items-center text-sm">
              <button type="button" className="text-blue-600 hover:underline">
                <Link to="/forgot-password">Forgot Password?</Link>
              </button>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={resetFields}
                className="text-blue-600 hover:underline font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-lg shadow"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </div>
            <div className="text-center text-sm text-gray-600 mt-6">
              Admin credentials are required to access the dashboard.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;