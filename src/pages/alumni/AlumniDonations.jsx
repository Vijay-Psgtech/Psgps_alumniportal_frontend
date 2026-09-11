// src/pages/alumni/AlumniDonations.jsx
// ✅ ALUMNI DONATIONS PAGE
// Make donations & view history

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Heart, LogOut, ChevronLeft, Check, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { donationAPI } from "../../services/api";
import usePageTitle from "../../hooks/usePageTitle";

const AlumniDonations = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  usePageTitle("Make a Donation");
  

  const [donationAmount, setDonationAmount] = useState("");
  const [purpose, setPurpose] = useState("general");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [donations, setDonations] = useState([]);
  const [loadingDonations, setLoadingDonations] = useState(true);

  const donationPurposes = [
    { id: "general", label: "General Fund", description: "Support PSG overall" },
    { id: "scholarship", label: "Scholarship", description: "Student scholarships" },
    { id: "infrastructure", label: "Infrastructure", description: "Building improvements" },
    { id: "research", label: "Research", description: "Research initiatives" },
  ];

  const donationTiers = [
    { amount: 1000, label: "Friend", emoji: "💚" },
    { amount: 5000, label: "Supporter", emoji: "💙" },
    { amount: 10000, label: "Patron", emoji: "💜" },
    { amount: 50000, label: "Benefactor", emoji: "🌟" },
  ];

  useEffect(() => {
    loadDonationHistory();
  }, []);

  const loadDonationHistory = async () => {
    try {
      const response = await donationAPI.getMyDonations();
      setDonations(response.data?.data || []);
    } catch (err) {
      console.error("Failed to load donations:", err);
    } finally {
      setLoadingDonations(false);
    }
  };

  const handleDonation = async (e) => {
    e.preventDefault();
    
    if (!donationAmount || Number(donationAmount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await donationAPI.createDonation({
        amount: Number(donationAmount),
        purpose,
        anonymousDonation: false,
      });

      if (response.data) {
        setSuccess(true);
        setDonationAmount("");
        setPurpose("general");
        
        // Reload donations
        setTimeout(() => {
          loadDonationHistory();
          setSuccess(false);
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Donation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const totalDonated = donations.reduce((sum, d) => sum + (d.amount || 0), 0);

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .alumni-donations-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
          font-family: 'Poppins', 'Inter', sans-serif;
        }

        .donations-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 60px 30px;
          margin-top: 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 8px 32px rgba(102, 126, 234, 0.2);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .back-btn {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: none;
          border-radius: 10px;
          padding: 10px 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .back-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateX(-3px);
        }

        .header-title {
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: rgba(255, 255, 255, 0.15);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .logout-btn:hover {
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .donations-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 50px 20px;
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 40px;
        }

        /* Form Section */
        .donation-form-section {
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(102, 126, 234, 0.08);
        }

        .section-title {
          font-size: 24px;
          font-weight: 700;
          color: #1e3c72;
          margin-bottom: 32px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 16px;
          border-bottom: 3px solid #667eea;
        }

        .form-group {
          margin-bottom: 32px;
        }

        .form-label {
          display: block;
          margin-bottom: 12px;
          font-weight: 700;
          color: #1e3c72;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .amount-input {
          width: 100%;
          padding: 16px 18px;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          font-size: 16px;
          font-family: inherit;
          transition: all 0.3s ease;
          background: #fafbfc;
        }

        .amount-input:focus {
          outline: none;
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
          transform: translateY(-2px);
        }

        .amount-input::placeholder {
          color: #bbb;
        }

        /* Donation Tiers */
        .donation-tiers {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 8px;
        }

        .tier-btn {
          padding: 20px 12px;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
          font-weight: 600;
          font-size: 12px;
          color: #1e3c72;
        }

        .tier-btn:hover:not(:disabled) {
          border-color: #667eea;
          background: #f8f9ff;
          transform: translateY(-4px);
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.15);
        }

        .tier-btn.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-color: transparent;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
          transform: translateY(-4px);
        }

        .tier-emoji {
          font-size: 24px;
          display: block;
          margin-bottom: 8px;
        }

        /* Purpose Select */
        .purpose-select {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .purpose-option {
          padding: 18px 16px;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }

        .purpose-option:hover:not(:disabled) {
          border-color: #667eea;
          background: #f8f9ff;
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.12);
        }

        .purpose-option.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-color: transparent;
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.25);
          transform: translateY(-3px);
        }

        .purpose-label {
          font-weight: 700;
          font-size: 13px;
          margin-bottom: 6px;
          color: inherit;
        }

        .purpose-desc {
          font-size: 11px;
          opacity: 0.75;
          font-weight: 500;
        }

        /* Error/Success Messages */
        .alert {
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          font-weight: 500;
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .alert-error {
          background: #fff5f5;
          border: 2px solid #fecccc;
          color: #c33;
        }

        .alert-success {
          background: #f0fdf4;
          border: 2px solid #86efac;
          color: #16a34a;
        }

        /* Submit Button */
        .donate-btn {
          width: 100%;
          padding: 18px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.2);
        }

        .donate-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(102, 126, 234, 0.35);
        }

        .donate-btn:active:not(:disabled) {
          transform: translateY(-1px);
        }

        .donate-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Sidebar - Stats */
        .donation-stats {
          background: white;
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(102, 126, 234, 0.08);
          height: fit-content;
          position: sticky;
          top: 30px;
        }

        .stat-box {
          text-align: center;
          padding: 28px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .stat-box:last-child {
          border-bottom: none;
        }

        .stat-value {
          font-size: 36px;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 10px;
        }

        .stat-label {
          font-size: 11px;
          color: #999;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 1px;
        }

        /* Donation History */
        .history-section {
          margin-top: 48px;
          padding-top: 32px;
          border-top: 2px solid #f0f0f0;
        }

        .history-title {
          font-size: 18px;
          font-weight: 700;
          color: #1e3c72;
          margin-bottom: 24px;
        }

        .donation-item {
          padding: 18px;
          background: linear-gradient(135deg, #f8f9ff 0%, #fafbfc 100%);
          border-radius: 12px;
          margin-bottom: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid #e8e8f0;
          transition: all 0.3s ease;
        }

        .donation-item:hover {
          transform: translateX(4px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
        }

        .donation-info {
          flex: 1;
        }

        .donation-purpose {
          font-weight: 700;
          color: #1e3c72;
          margin-bottom: 6px;
          font-size: 14px;
        }

        .donation-date {
          font-size: 12px;
          color: #999;
        }

        .donation-sum {
          text-align: right;
        }

        .donation-amount {
          font-size: 18px;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .empty-history {
          text-align: center;
          padding: 40px 20px;
          background: linear-gradient(135deg, #f8f9ff 0%, #fafbfc 100%);
          border-radius: 12px;
          color: #999;
          font-size: 14px;
          border: 1px dashed #ddd;
        }

        @media (max-width: 1024px) {
          .donations-container {
            grid-template-columns: 1fr;
            gap: 30px;
            padding: 40px 20px;
          }

          .donation-stats {
            position: static;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
          }

          .stat-box {
            padding: 20px 0;
            border-bottom: none;
            border-right: 1px solid #f0f0f0;
          }

          .stat-box:last-child {
            border-right: none;
          }

          .donation-tiers {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (max-width: 768px) {
          .donations-header {
            flex-direction: column;
            gap: 20px;
            align-items: flex-start;
            padding: 40px 20px;
          }

          .header-left {
            gap: 15px;
            width: 100%;
          }

          .header-title {
            font-size: 22px;
          }

          .logout-btn {
            width: 100%;
            justify-content: center;
          }

          .donations-container {
            padding: 30px 15px;
          }

          .donation-form-section {
            padding: 24px;
          }

          .donation-tiers {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }

          .tier-btn {
            padding: 14px 8px;
            font-size: 11px;
          }

          .tier-emoji {
            font-size: 18px;
            margin-bottom: 4px;
          }

          .purpose-select {
            grid-template-columns: 1fr;
          }

          .donation-stats {
            grid-template-columns: 1fr;
          }

          .stat-box {
            border-right: none;
            border-bottom: 1px solid #f0f0f0;
          }

          .stat-box:last-child {
            border-bottom: none;
          }

          .stat-value {
            font-size: 28px;
          }

          .section-title {
            font-size: 20px;
            margin-bottom: 24px;
          }

          .form-group {
            margin-bottom: 24px;
          }
        }

        @media (max-width: 480px) {
          .donations-header {
            padding: 30px 16px;
          }

          .header-title {
            font-size: 20px;
          }

          .back-btn {
            padding: 8px 12px;
            font-size: 12px;
          }

          .logout-btn {
            padding: 10px 16px;
            font-size: 12px;
          }

          .donation-form-section {
            padding: 20px;
          }

          .amount-input {
            font-size: 15px;
            padding: 14px 16px;
          }

          .donate-btn {
            padding: 16px;
            font-size: 14px;
          }

          .purpose-label {
            font-size: 12px;
          }

          .purpose-desc {
            font-size: 10px;
          }
        }
      `}</style>

      <div className="alumni-donations-wrapper">
        {/* Header */}
        <div className="donations-header">
          <div className="header-left">
            <button className="back-btn" onClick={() => navigate("/")}>
              <ChevronLeft size={16} />
              Back
            </button>
            <div className="header-title">❤️ Support PSG</div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {/* Content */}
        <div className="donations-container">
          {/* Form Section */}
          <div className="donation-form-section">
            <div className="section-title">
              <Heart size={24} />
              Make a Donation
            </div>

            {error && (
              <div className="alert alert-error">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success">
                <Check size={18} />
                Thank you for your generous donation!
              </div>
            )}

            <form onSubmit={handleDonation}>
              {/* Amount Input */}
              <div className="form-group">
                <label className="form-label">💰 Donation Amount</label>
                <input
                  type="number"
                  className="amount-input"
                  placeholder="Enter amount in ₹"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              {/* Donation Tiers */}
              <div className="form-group">
                <label className="form-label">Quick Select</label>
                <div className="donation-tiers">
                  {donationTiers.map((tier) => (
                    <button
                      key={tier.amount}
                      type="button"
                      className={`tier-btn ${donationAmount === String(tier.amount) ? "active" : ""}`}
                      onClick={() => setDonationAmount(String(tier.amount))}
                      disabled={loading}
                    >
                      <span className="tier-emoji">{tier.emoji}</span>
                      ₹{tier.amount.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Purpose */}
              <div className="form-group">
                <label className="form-label">🎯 Donation Purpose</label>
                <div className="purpose-select">
                  {donationPurposes.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className={`purpose-option ${purpose === p.id ? "active" : ""}`}
                      onClick={() => setPurpose(p.id)}
                      disabled={loading}
                    >
                      <div className="purpose-label">{p.label}</div>
                      <div className="purpose-desc">{p.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button type="submit" className="donate-btn" disabled={loading || !donationAmount}>
                <Heart size={18} />
                {loading ? "Processing..." : "Donate Now"}
              </button>
            </form>

            {/* Donation History */}
            {donations.length > 0 && (
              <div className="history-section">
                <div className="history-title">📋 Your Donations</div>
                {donations.map((donation, idx) => (
                  <motion.div
                    key={idx}
                    className="donation-item"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <div className="donation-info">
                      <div className="donation-purpose">
                        {donationPurposes.find(p => p.id === donation.purpose)?.label || "Donation"}
                      </div>
                      <div className="donation-date">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="donation-sum">
                      <div className="donation-amount">₹{donation.amount.toLocaleString()}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {donations.length === 0 && !loadingDonations && (
              <div className="history-section">
                <div className="history-title">📋 Your Donations</div>
                <div className="empty-history">
                  No donations yet. Make your first donation above!
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Stats */}
          <div className="donation-stats">
            <div className="stat-box">
              <div className="stat-value">{donations.length}</div>
              <div className="stat-label">Total Donations</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">₹{totalDonated.toLocaleString()}</div>
              <div className="stat-label">Total Amount</div>
            </div>
            <div className="stat-box">
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>🙏</div>
              <div className="stat-label">Thank You!</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlumniDonations;