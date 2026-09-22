// src/pages/alumni/ForgotPassword.jsx
// ✅ Forgot Password Flow:
//   Step 1 → Enter registered email
//   Step 2 → Enter OTP sent to email
//   Step 3 → Enter & confirm new password
// Adjust the API endpoints to match your backend

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../../services/api";

const STEPS = { EMAIL: 1, OTP: 2, RESET: 3, DONE: 4 };

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(STEPS.EMAIL);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ─── Step 1: Send OTP ──────────────────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError(""); setInfo(""); setLoading(true);
    try {
      // ✅ Replace with your actual API endpoint
      const res = await authAPI.forgotPassword(email);
      const data = res.data;
      if (!res.statusText) throw new Error(data.message || "Email not found.");
      setInfo(`OTP sent to ${email}. Check your inbox.`);
      setStep(STEPS.OTP);
    } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Invalid email or password";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ─── Step 2: Verify OTP ────────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      // ✅ Replace with your actual API endpoint
      const res = await authAPI.verifyOtp(email, otp);
      const data = res.data;
      if (!res.statusText) throw new Error(data.message || "Invalid or expired OTP.");
      setStep(STEPS.RESET);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ─── Step 3: Reset Password ────────────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      // ✅ Replace with your actual API endpoint
      const res = await authAPI.resetPassword(email, otp, password);
      const data = res.data;
      if (!res.statusText) throw new Error(data.message || "Failed to reset password.");
      setStep(STEPS.DONE);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-16">
      <div className="w-full max-w-md bg-slate-800 border border-yellow-700/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500" />
        <div className="p-8">

            {/* ── Stepper ── */}
            {step !== STEPS.DONE && (
              <div className="flex items-center justify-center gap-3 mb-6">
                {["Email", "Verify", "Reset"].map((label, i) => {
                  const num = i + 1;
                  const isDone = step > num;
                  const isActive = step === num;
                  return (
                    <React.Fragment key={label}>
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${isDone ? 'bg-green-100 text-green-700' : isActive ? 'bg-amber-400 text-slate-900' : 'border border-slate-600 text-slate-400'}`}>
                          {isDone ? '✓' : num}
                        </div>
                        <div className={`text-[10px] tracking-widest uppercase ${isActive ? 'text-amber-300' : 'text-slate-400'}`}>{label}</div>
                      </div>
                      {i < 2 && <div className={`flex-1 h-px ${step > num ? 'bg-amber-400' : 'bg-slate-700'} my-4`} style={{maxWidth: 44}} />}
                    </React.Fragment>
                  );
                })}
              </div>
            )}

            {/* ── Step 1: Enter Email ── */}
            {step === STEPS.EMAIL && (
              <>
                <div className="w-14 h-14 rounded-full bg-yellow-50/10 border border-yellow-400/20 flex items-center justify-center mx-auto mb-4 text-2xl">🔑</div>
                <h3 className="text-xl font-semibold text-slate-100 text-center mb-1">Forgot Password?</h3>
                <p className="text-sm text-slate-400 text-center mb-4">Enter your registered email and we'll send a one-time code to reset your password.</p>
                {error && <div className="bg-red-700/10 border border-red-600/20 text-red-200 rounded-md px-3 py-2 mb-3">⚠ {error}</div>}
                <form onSubmit={handleSendOtp}>
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Email Address</label>
                    <input
                      type="email" required
                      className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-300"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </div>
                  <button type="submit" className="w-full py-3 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-900 font-semibold hover:shadow-md disabled:opacity-60" disabled={loading}>
                    {loading ? "Sending OTP…" : "Send Reset Code →"}
                  </button>
                </form>
                <Link to="/alumni/login" className="block text-center text-sm text-slate-400 mt-4 hover:text-slate-200">← Back to Login</Link>
              </>
            )}

            {/* ── Step 2: Enter OTP ── */}
            {step === STEPS.OTP && (
              <>
                <div className="w-14 h-14 rounded-full bg-yellow-50/10 border border-yellow-400/20 flex items-center justify-center mx-auto mb-4 text-2xl">📧</div>
                <h3 className="text-xl font-semibold text-slate-100 text-center mb-1">Check Your Email</h3>
                <p className="text-sm text-slate-400 text-center mb-4">Enter the 6‑digit code sent to <span className="text-amber-300 font-medium">{email}</span></p>
                {error && <div className="bg-red-700/10 border border-red-600/20 text-red-200 rounded-md px-3 py-2 mb-3">⚠ {error}</div>}
                {info && <div className="bg-green-800/20 border border-green-700/20 text-green-200 rounded-md px-3 py-2 mb-3">✓ {info}</div>}
                <form onSubmit={handleVerifyOtp}>
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-slate-400 uppercase mb-2">One-Time Password (OTP)</label>
                    <input
                      type="text" required
                      className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-500 tracking-widest text-lg text-center"
                      placeholder="123456"
                      value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      maxLength={6}
                      autoComplete="one-time-code"
                    />
                    <div className="text-xs text-slate-400 mt-2">Didn't receive it? <button type="button" className="text-amber-300 hover:text-amber-200 ml-1" onClick={handleSendOtp} disabled={loading}>Resend OTP</button> · Check your spam folder too.</div>
                  </div>
                  <button type="submit" className="w-full py-3 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-900 font-semibold hover:shadow-md disabled:opacity-60" disabled={loading || otp.length < 4}>
                    {loading ? "Verifying…" : "Verify Code →"}
                  </button>
                </form>
                <button className="block text-sm text-slate-400 mt-4 mx-auto hover:text-slate-200" onClick={() => { setStep(STEPS.EMAIL); setError(""); }}>
                  ← Use a different email
                </button>
              </>
            )}

            {/* ── Step 3: New Password ── */}
            {step === STEPS.RESET && (
              <>
                <div className="w-14 h-14 rounded-full bg-yellow-50/10 border border-yellow-400/20 flex items-center justify-center mx-auto mb-4 text-2xl">🔒</div>
                <h3 className="text-xl font-semibold text-slate-100 text-center mb-1">Set New Password</h3>
                <p className="text-sm text-slate-400 text-center mb-4">Choose a strong password with at least 8 characters.</p>
                {error && <div className="bg-red-700/10 border border-red-600/20 text-red-200 rounded-md px-3 py-2 mb-3">⚠ {error}</div>}
                <form onSubmit={handleResetPassword}>
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-slate-400 uppercase mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showPw ? "text" : "password"} required
                        className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-300"
                        placeholder="Min. 8 characters"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        autoComplete="new-password"
                      />
                      <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" onClick={() => setShowPw(p => !p)}>{showPw ? '🙈' : '👁'}</button>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"} required
                        className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-300"
                        placeholder="Re-enter password"
                        value={confirm}
                        onChange={e => setConfirm(e.target.value)}
                        autoComplete="new-password"
                      />
                      <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" onClick={() => setShowConfirm(p => !p)}>{showConfirm ? '🙈' : '👁'}</button>
                    </div>
                    {confirm && password !== confirm && (
                      <div className="text-sm text-red-300 mt-2">Passwords do not match</div>
                    )}
                  </div>
                  <button
                    type="submit" className="w-full py-3 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-900 font-semibold hover:shadow-md disabled:opacity-60"
                    disabled={loading || password.length < 8 || password !== confirm}
                  >
                    {loading ? "Saving…" : "Reset Password →"}
                  </button>
                </form>
              </>
            )}

            {/* ── Step 4: Done ── */}
            {step === STEPS.DONE && (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-green-900/20 border border-green-500/30 mx-auto flex items-center justify-center text-3xl mb-4">✓</div>
                <h3 className="text-xl font-semibold text-slate-100 mb-2">Password Reset!</h3>
                <p className="text-sm text-slate-400 mb-6">Your password has been updated successfully. You can now sign in with your new password.</p>
                <button className="w-full py-3 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-900 font-semibold" onClick={() => navigate("/alumni/login")}>
                  Go to Login →
                </button>
              </div>
            )}

        </div>
      </div>
    </div>
  );
}