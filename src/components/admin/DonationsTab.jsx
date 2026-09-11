import React, { useState } from "react";
import {
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Flag,
  Shield,
  MessageCircle,
  X,
  Copy,
  Edit2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ═════════════════════════════════════════════════════════════════════════
// ENHANCED DONATIONS TAB WITH SUPER ADMIN FEATURES
// ═════════════════════════════════════════════════════════════════════════

export const DonationsTab = ({
  donationList = [],
  setSelectedItem = () => {},
  isSuperAdmin = false,
  onFlagDonation = () => {},
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [selectedForBulk, setSelectedForBulk] = useState(new Set());
  const [quickViewDonation, setQuickViewDonation] = useState(null);

  // Advanced search filters
  const [advancedFilters, setAdvancedFilters] = useState({
    minAmount: "",
    maxAmount: "",
    flaggedOnly: false,
    verifiedOnly: false,
    dateFrom: "",
    dateTo: "",
  });

  // ═════════════════════════════════════════════════════════════════════════
  // FILTERING LOGIC
  // ═════════════════════════════════════════════════════════════════════════

  const filtered = donationList.filter((d) => {
    // Basic search
    const searchMatch =
      (d.paymentMethod || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(d.amount).includes(searchTerm) ||
      (d.status || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.donorName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.donorEmail || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.donorPhone || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.transactionId || "").toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const statusMatch =
      filterStatus === "all" || d.status === filterStatus;

    // Advanced filters
    const minAmountMatch =
      !advancedFilters.minAmount ||
      d.amount >= parseFloat(advancedFilters.minAmount);
    const maxAmountMatch =
      !advancedFilters.maxAmount ||
      d.amount <= parseFloat(advancedFilters.maxAmount);

    const flaggedMatch =
      !advancedFilters.flaggedOnly || d.adminFlagged;
    const verifiedMatch =
      !advancedFilters.verifiedOnly ||
      d.verificationStatus === "verified";

    // Date filters
    let dateFromMatch = true;
    let dateToMatch = true;

    if (advancedFilters.dateFrom) {
      const fromDate = new Date(advancedFilters.dateFrom);
      dateFromMatch = new Date(d.createdAt) >= fromDate;
    }

    if (advancedFilters.dateTo) {
      const toDate = new Date(advancedFilters.dateTo);
      dateToMatch = new Date(d.createdAt) <= toDate;
    }

    return (
      searchMatch &&
      statusMatch &&
      minAmountMatch &&
      maxAmountMatch &&
      flaggedMatch &&
      verifiedMatch &&
      dateFromMatch &&
      dateToMatch
    );
  });

  // ═════════════════════════════════════════════════════════════════════════
  // UTILITY FUNCTIONS
  // ═════════════════════════════════════════════════════════════════════════

  const getStatusStyles = (status) => {
    const styles = {
      completed: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-100",
        icon: <CheckCircle size={12} />,
      },
      pending: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-100",
        icon: <Clock size={12} />,
      },
      failed: {
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-100",
        icon: <AlertCircle size={12} />,
      },
      cancelled: {
        bg: "bg-gray-50",
        text: "text-gray-700",
        border: "border-gray-100",
        icon: <AlertCircle size={12} />,
      },
    };
    return styles[status] || styles.pending;
  };

  const getVerificationBadge = (verification) => {
    const styles = {
      verified: {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-100",
        label: "Verified",
      },
      flagged: {
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-100",
        label: "Flagged",
      },
      unverified: {
        bg: "bg-gray-50",
        text: "text-gray-700",
        border: "border-gray-100",
        label: "Unverified",
      },
    };
    return styles[verification] || styles.unverified;
  };

  const toggleSelectDonation = (donationId) => {
    const newSelected = new Set(selectedForBulk);
    if (newSelected.has(donationId)) {
      newSelected.delete(donationId);
    } else {
      newSelected.add(donationId);
    }
    setSelectedForBulk(newSelected);
  };

  const formatCurrency = (amount, currency = "INR") => {
    return `${currency === "INR" ? "₹" : "$"}${amount}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  // ═════════════════════════════════════════════════════════════════════════
  // RENDER: QUICK VIEW MODAL
  // ═════════════════════════════════════════════════════════════════════════

  const QuickViewModal = ({ donation, onClose }) => {
    if (!donation) return null;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-40"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl shadow-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {donation.donorName}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {donation.donorEmail || "Anonymous"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick Details */}
            <div className="space-y-3 mb-4 pb-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Amount</span>
                <span className="font-bold text-emerald-600 text-lg">
                  {formatCurrency(donation.amount, donation.currency)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Payment Method</span>
                <span className="font-semibold text-gray-900">
                  {donation.paymentMethod}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    getStatusStyles(donation.status).bg
                  } ${getStatusStyles(donation.status).text} border ${
                    getStatusStyles(donation.status).border
                  }`}
                >
                  {getStatusStyles(donation.status).icon}
                  {donation.status}
                </span>
              </div>

              {isSuperAdmin && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Verification</span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${
                      getVerificationBadge(
                        donation.verificationStatus || "unverified"
                      ).bg
                    } ${
                      getVerificationBadge(
                        donation.verificationStatus || "unverified"
                      ).text
                    } ${
                      getVerificationBadge(
                        donation.verificationStatus || "unverified"
                      ).border
                    }`}
                  >
                    {getVerificationBadge(
                      donation.verificationStatus || "unverified"
                    ).label}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Date</span>
                <span className="text-sm text-gray-900">
                  {new Date(donation.createdAt).toLocaleDateString("en-IN")}
                </span>
              </div>

              {donation.transactionId && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Transaction ID</span>
                  <button
                    onClick={() => copyToClipboard(donation.transactionId)}
                    className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    {donation.transactionId.substring(0, 8)}...
                    <Copy size={12} />
                  </button>
                </div>
              )}
            </div>

            {/* Admin Info */}
            {isSuperAdmin && (
              <div className="space-y-2 mb-4 pb-4 border-b border-slate-200">
                {donation.adminNote && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                    <p className="text-xs font-semibold text-blue-700 mb-1 flex items-center gap-1">
                      <MessageCircle size={12} />
                      Admin Notes
                    </p>
                    <p className="text-xs text-blue-600">
                      {donation.adminNote}
                    </p>
                  </div>
                )}

                {donation.adminFlagged && (
                  <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex items-start gap-2">
                    <Flag size={14} className="text-red-700 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-red-700">
                        Flagged for Review
                      </p>
                      {donation.flaggedReason && (
                        <p className="text-xs text-red-600 mt-1">
                          {donation.flaggedReason}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Message */}
            {donation.message && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                <p className="text-xs font-semibold text-gray-700 mb-1">
                  Donor Message
                </p>
                <p className="text-xs text-gray-600">{donation.message}</p>
              </div>
            )}

            {/* Action Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedItem(donation);
                onClose();
              }}
              className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Eye size={16} />
              View Full Details
            </motion.button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  // ═════════════════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ═════════════════════════════════════════════════════════════════════════

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col gap-4.5"
    >
      {/* Header with Super Admin Badge */}
      {isSuperAdmin && (
        <div className="bg-linear-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
            <Shield size={20} className="text-emerald-700" />
          </div>
          <div>
            <p className="text-sm font-bold text-emerald-900">
              Super Admin Mode Active
            </p>
            <p className="text-xs text-emerald-700">
              You have full access to all donation records and admin controls
            </p>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-2.5 items-center shadow-sm transition-shadow focus-within:shadow-md focus-within:border-emerald-200 mb-2">
        <Filter size={18} className="text-gray-400 ml-1 shrink-0" />
        <input
          placeholder="Search by donor name, email, phone, amount, transaction ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border-none py-1 font-['Outfit',sans-serif] text-[15px] outline-none text-gray-700 bg-transparent placeholder-gray-400"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Quick Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-medium text-gray-700"
        >
          <option value="all">All Status</option>
          <option value="completed">✓ Completed</option>
          <option value="pending">⏳ Pending</option>
          <option value="failed">✗ Failed</option>
          <option value="cancelled">↪ Cancelled</option>
        </select>

        {/* Advanced Filter Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
          className={`px-3 py-2 text-sm rounded-lg font-medium transition-all flex items-center gap-2 ${
            showAdvancedSearch
              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
              : "border border-slate-200 text-gray-700 bg-white hover:bg-slate-50"
          }`}
        >
          <Filter size={16} />
          Advanced
        </motion.button>

        {/* Results Count */}
        <div className="text-sm text-gray-600 font-medium ml-auto">
          {filtered.length} of {donationList.length} donations
        </div>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showAdvancedSearch && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-linear-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-4 space-y-4"
          >
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Advanced Filters
            </p>

            {/* Amount Range */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                  Min Amount
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={advancedFilters.minAmount}
                  onChange={(e) =>
                    setAdvancedFilters((prev) => ({
                      ...prev,
                      minAmount: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                  Max Amount
                </label>
                <input
                  type="number"
                  placeholder="∞"
                  value={advancedFilters.maxAmount}
                  onChange={(e) =>
                    setAdvancedFilters((prev) => ({
                      ...prev,
                      maxAmount: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                  From Date
                </label>
                <input
                  type="date"
                  value={advancedFilters.dateFrom}
                  onChange={(e) =>
                    setAdvancedFilters((prev) => ({
                      ...prev,
                      dateFrom: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                  To Date
                </label>
                <input
                  type="date"
                  value={advancedFilters.dateTo}
                  onChange={(e) =>
                    setAdvancedFilters((prev) => ({
                      ...prev,
                      dateTo: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
            </div>

            {/* Admin Filters */}
            {isSuperAdmin && (
              <div className="space-y-3 pt-3 border-t border-slate-300">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={advancedFilters.flaggedOnly}
                    onChange={(e) =>
                      setAdvancedFilters((prev) => ({
                        ...prev,
                        flaggedOnly: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Flag size={14} className="text-red-600" />
                    Show Only Flagged Donations
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={advancedFilters.verifiedOnly}
                    onChange={(e) =>
                      setAdvancedFilters((prev) => ({
                        ...prev,
                        verifiedOnly: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <CheckCircle size={14} className="text-blue-600" />
                    Show Only Verified Donations
                  </span>
                </label>
              </div>
            )}

            {/* Reset Button */}
            <div className="pt-3 border-t border-slate-300">
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  setAdvancedFilters({
                    minAmount: "",
                    maxAmount: "",
                    flaggedOnly: false,
                    verifiedOnly: false,
                    dateFrom: "",
                    dateTo: "",
                  });
                }}
                className="w-full px-3 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all"
              >
                Reset Filters
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {isSuperAdmin && selectedForBulk.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center justify-between text-sm"
          >
            <span className="font-semibold text-emerald-900">
              {selectedForBulk.size} selected
            </span>
            <button
              onClick={() => setSelectedForBulk(new Set())}
              className="px-3 py-1 text-emerald-700 hover:bg-emerald-100 rounded transition-all"
            >
              Clear
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Donations List */}
      {filtered.length > 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          {filtered.map((d, i) => (
            <motion.div
              key={d._id || i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center p-4 sm:p-5 cursor-pointer transition-all hover:bg-slate-50 ${
                selectedForBulk.has(d._id) ? "bg-emerald-50" : ""
              } ${i < filtered.length - 1 ? "border-b border-slate-100" : ""}`}
            >
              {/* Selection Checkbox */}
              {isSuperAdmin && (
                <input
                  type="checkbox"
                  checked={selectedForBulk.has(d._id)}
                  onChange={() => toggleSelectDonation(d._id)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-4 h-4 rounded mr-4 cursor-pointer shrink-0"
                />
              )}

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl mr-4 shrink-0 shadow-sm border border-emerald-100/50">
                💰
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Donor Name */}
                <div className="font-bold text-[16px] text-[#0c0e1a] font-['Outfit',sans-serif] leading-tight mb-0.5 flex items-center gap-2">
                  {d.donorName || "Anonymous Donor"}
                  {isSuperAdmin && d.adminFlagged && (
                    <Flag size={14} className="text-red-600" />
                  )}
                </div>

                {/* Details Row */}
                <div className="text-[13px] text-gray-500 font-medium flex items-center flex-wrap gap-2 mb-1">
                  <span className="font-bold text-emerald-600">
                    {formatCurrency(d.amount, d.currency)}
                  </span>
                  <span className="mx-0.5 text-gray-300">•</span>
                  <span>
                    {new Date(d.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="mx-0.5 text-gray-300">•</span>
                  <span>{d.paymentMethod}</span>
                </div>

                {/* Email (optional) */}
                {d.donorEmail && !d.isAnonymous && (
                  <div className="text-[12px] text-gray-400">
                    {d.donorEmail}
                  </div>
                )}

                {/* Admin Badge */}
                {isSuperAdmin && d.adminReviewed && (
                  <div className="text-[11px] text-blue-600 font-semibold mt-1 flex items-center gap-1">
                    <CheckCircle size={11} />
                    Reviewed
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide ml-3 whitespace-nowrap ${
                  getStatusStyles(d.status).bg
                } ${getStatusStyles(d.status).text} border ${
                  getStatusStyles(d.status).border
                }`}
              >
                {getStatusStyles(d.status).icon}
                {d.status}
              </span>

              {/* Verification Badge (Super Admin) */}
              {isSuperAdmin && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1.5 rounded-full text-[10px] font-bold uppercase ml-2 whitespace-nowrap border sm:inline-flex ${
                    getVerificationBadge(d.verificationStatus || "unverified")
                      .bg
                  } ${
                    getVerificationBadge(d.verificationStatus || "unverified")
                      .text
                  } ${
                    getVerificationBadge(d.verificationStatus || "unverified")
                      .border
                  }`}
                >
                  {getVerificationBadge(
                    d.verificationStatus || "unverified"
                  ).label}
                </span>
              )}

              {/* Quick View Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="ml-3 text-gray-400 hover:text-emerald-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setQuickViewDonation(d);
                }}
              >
                <Eye size={18} />
              </motion.button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-4 text-gray-400 bg-white border border-slate-200 rounded-2xl font-['Outfit',sans-serif] shadow-sm flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-4">
            <Filter size={24} className="text-gray-300" />
          </div>
          <div className="text-lg font-semibold text-gray-500 mb-1">
            No donation records found
          </div>
          <div className="text-sm">
            {searchTerm || Object.values(advancedFilters).some(Boolean)
              ? "We couldn't find any donations matching your search criteria."
              : "No donations available yet."}
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {/* {quickViewDonation && (
        <QuickViewModal
          donation={quickViewDonation}
          onClose={() => setQuickViewDonation(null)}
        />
      )} */}
    </motion.div>
  );
};

export default DonationsTab;