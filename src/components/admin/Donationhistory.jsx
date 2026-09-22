import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  Loader,
  TrendingUp,
  X,
  Shield,
  Flag,
  MessageCircle,
  Save,
  Edit2,
  Trash2,
  RefreshCw,
  Calendar,
  DollarSign,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Tag,
  Lock,
  Unlock,
  CheckSquare,
  Copy,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { donationAPI } from "../../services/api";

// ═════════════════════════════════════════════════════════════════════════
// ENHANCED DONATION HISTORY WITH REAL DATA INTEGRATION
// ═════════════════════════════════════════════════════════════════════════

export const DonationHistory = ({ isSuperAdmin = false }) => {
  // ═════════════════════════════════════════════════════════════════════════
  // STATE MANAGEMENT
  // ═════════════════════════════════════════════════════════════════════════

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingNote, setEditingNote] = useState(false);
  const [adminNote, setAdminNote] = useState("");

  // Multi-select for bulk actions
  const [selectedDonations, setSelectedDonations] = useState(new Set());

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    currency: "all",
    paymentMethod: "all",
    donorType: "all",
    verificationStatus: "all",
    adminFlagged: false,
    adminReviewed: false,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Advanced filters
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [amountRange, setAmountRange] = useState({
    min: "",
    max: "",
  });
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    failed: 0,
    flagged: 0,
    totalAmount: 0,
    averageAmount: 0,
  });

  // ═════════════════════════════════════════════════════════════════════════
  // FETCH DONATION HISTORY - REAL API CALL
  // ═════════════════════════════════════════════════════════════════════════

  const fetchDonationHistory = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page,
        limit: pagination.limit,
        ...(filters.status !== "all" && { status: filters.status }),
        ...(filters.currency !== "all" && { currency: filters.currency }),
        ...(filters.paymentMethod !== "all" && { paymentMethod: filters.paymentMethod }),
        ...(filters.donorType !== "all" && { donorType: filters.donorType }),
        ...(filters.verificationStatus !== "all" && { verificationStatus: filters.verificationStatus }),
        ...(filters.adminFlagged && { adminFlagged: true }),
        ...(filters.adminReviewed && { adminReviewed: true }),
        ...(filters.sortBy && { sortBy: filters.sortBy }),
        ...(filters.sortOrder && { sortOrder: filters.sortOrder }),
        ...(searchTerm && { search: searchTerm }),
        ...(dateRange.startDate && { startDate: dateRange.startDate }),
        ...(dateRange.endDate && { endDate: dateRange.endDate }),
        ...(amountRange.min && { minAmount: amountRange.min }),
        ...(amountRange.max && { maxAmount: amountRange.max }),
      };

      // 🔥 REAL API CALL - Fetching actual data from backend
      const response = await donationAPI.getHistory(params);

      if (response.data.success) {
        setDonations(response.data.donations || []);
        setPagination(response.data.pagination || { page, limit: 10, total: 0, pages: 0 });
        setStats(response.data.stats || {
          total: 0,
          completed: 0,
          pending: 0,
          failed: 0,
          flagged: 0,
          totalAmount: 0,
          averageAmount: 0,
        });
        console.log("✅ Donations fetched successfully:", response.data);
      } else {
        setError(response.data.message || "Failed to fetch donations");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch donation history";
      setError(errorMsg);
      console.error("❌ Error fetching donations:", errorMsg);
      setDonations([]);
      setStats({
        total: 0,
        completed: 0,
        pending: 0,
        failed: 0,
        flagged: 0,
        totalAmount: 0,
        averageAmount: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // ═════════════════════════════════════════════════════════════════════════
  // FETCH STATS
  // ═════════════════════════════════════════════════════════════════════════

  const fetchStats = async () => {
    try {
      const response = await donationAPI.getStats();
      const data = response.data;

      if (data.success) {
        setStats(data.stats);
        console.log("✅ Stats fetched:", data.stats);
      }
    } catch (err) {
      console.error("❌ Error fetching stats:", err);
    }
  };

  // ═════════════════════════════════════════════════════════════════════════
  // EFFECTS
  // ═════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    fetchDonationHistory(1);
    fetchStats();
  }, [filters, searchTerm, dateRange, amountRange, pagination.limit]);

  // ═════════════════════════════════════════════════════════════════════════
  // ADMIN ACTIONS
  // ═════════════════════════════════════════════════════════════════════════

  const handleSaveAdminNote = async () => {
    if (!selectedDonation) return;

    try {
      setLoading(true);

      // 🔥 REAL API CALL - Update admin note
      const response = await donationAPI.update(selectedDonation._id, { adminNote });
      const data = response.data;

      if (data.success) {
        const updatedDonation = data.donation;
        setSelectedDonation(updatedDonation);
        setEditingNote(false);
        setSuccess("Admin note saved successfully");

        // Update in list
        setDonations((prev) =>
          prev.map((d) => (d._id === updatedDonation._id ? updatedDonation : d))
        );

        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError("Failed to save admin note");
      console.error("❌ Error saving note:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFlagDonation = async (donationId, flag = true) => {
    try {
      setLoading(true);

      // 🔥 REAL API CALL - Update flag status
      const response = await donationAPI.flagDonation(donationId, {
        adminFlagged: flag,
        flaggedReason: flag ? adminNote : "",
      });
      const data = response.data;

      if (data.success) {
        const updatedDonation = data.donation;
        setSelectedDonation(updatedDonation);
        setSuccess(`Donation ${flag ? "flagged" : "unflagged"} successfully`);

        setDonations((prev) =>
          prev.map((d) => (d._id === updatedDonation._id ? updatedDonation : d))
        );

        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError("Failed to update flag status");
      console.error("❌ Error updating flag:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDonation = async (donationId) => {
    if (!window.confirm("Are you sure you want to delete this donation?")) return;

    try {
      setLoading(true);

      // 🔥 REAL API CALL - Delete donation
      const response = await donationAPI.delete(donationId);
      const data = response.data;

      if (data.success) {
        setDonations((prev) => prev.filter((d) => d._id !== donationId));
        setShowDetailModal(false);
        setSuccess("Donation deleted successfully");
        setTimeout(() => setSuccess(null), 3000);
        fetchDonationHistory(pagination.page);
      }
    } catch (err) {
      setError("Failed to delete donation");
      console.error("❌ Error deleting donation:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsCompleted = async (donationId) => {
    try {
      setLoading(true);

      // 🔥 REAL API CALL - Update status to completed
      const response = await donationAPI.updateStatus(donationId, "completed");
      const data = response.data;

      if (data.success) {
        const updatedDonation = data.donation;
        setSelectedDonation(updatedDonation);
        setSuccess("Donation marked as completed");

        setDonations((prev) =>
          prev.map((d) => (d._id === updatedDonation._id ? updatedDonation : d))
        );

        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError("Failed to update status");
      console.error("❌ Error updating status:", err);
    } finally {
      setLoading(false);
    }
  };

  // ═════════════════════════════════════════════════════════════════════════
  // HELPER FUNCTIONS
  // ═════════════════════════════════════════════════════════════════════════

  const getStatusStyles = (status) => {
    const styles = {
      completed: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        icon: <CheckCircle size={14} />,
      },
      pending: {
        bg: "bg-yellow-50",
        text: "text-yellow-700",
        border: "border-yellow-200",
        icon: <Clock size={14} />,
      },
      failed: {
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
        icon: <AlertCircle size={14} />,
      },
      cancelled: {
        bg: "bg-gray-50",
        text: "text-gray-700",
        border: "border-gray-200",
        icon: <X size={14} />,
      },
    };
    return styles[status] || styles.pending;
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      fetchDonationHistory(newPage);
    }
  };

  const handleExportCSV = () => {
    if (donations.length === 0) {
      setError("No donations to export");
      return;
    }

    const headers = ["Donor Name", "Email", "Amount", "Currency", "Status", "Date"];
    const rows = donations.map((d) => [
      d.donorName,
      d.donorEmail || "N/A",
      d.amount,
      d.currency,
      d.status,
      new Date(d.createdAt).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "donations.csv";
    a.click();

    setSuccess("Donations exported successfully");
    setTimeout(() => setSuccess(null), 3000);
  };

  const toggleSelectDonation = (donationId) => {
    setSelectedDonations((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(donationId)) {
        newSet.delete(donationId);
      } else {
        newSet.add(donationId);
      }
      return newSet;
    });
  };

  // ═════════════════════════════════════════════════════════════════════════
  // RENDER - DETAIL MODAL
  // ═════════════════════════════════════════════════════════════════════════

  const DetailModal = ({ donation, onClose }) => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-linear-to-r from-emerald-600 to-emerald-700 px-6 py-4 flex items-center justify-between border-b border-emerald-500/30">
            <div>
              <h2 className="text-xl font-bold text-white">Donation Details</h2>
              <p className="text-emerald-100 text-sm">ID: {donation._id}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-emerald-500/30 rounded-lg transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Donor Information */}
            <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <User size={18} className="text-blue-600" />
                Donor Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Name</p>
                  <p className="font-semibold text-gray-900">{donation.donorName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Email</p>
                  <p className="font-semibold text-gray-900">{donation.donorEmail || "N/A"}</p>
                </div>
                {donation.donorPhone && (
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">Phone</p>
                    <p className="font-semibold text-gray-900">{donation.donorPhone}</p>
                  </div>
                )}
                {donation.donorCity && (
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">Location</p>
                    <p className="font-semibold text-gray-900">{donation.donorCity}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Donation Details */}
            <div className="bg-linear-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <DollarSign size={18} className="text-emerald-600" />
                Donation Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Amount</p>
                  <p className="font-bold text-2xl text-emerald-600">
                    {donation.currency === "INR" ? "₹" : "$"}
                    {donation.amount?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Currency</p>
                  <p className="font-semibold text-gray-900">{donation.currency}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Payment Method</p>
                  <p className="font-semibold text-gray-900">{donation.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Payment Gateway</p>
                  <p className="font-semibold text-gray-900">{donation.paymentGateway || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Status & Transaction */}
            <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
              <h3 className="font-bold text-gray-900 mb-3">Status & Transaction</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Status</p>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                        getStatusStyles(donation.status).bg
                      } ${getStatusStyles(donation.status).text} border ${
                        getStatusStyles(donation.status).border
                      }`}
                    >
                      {getStatusStyles(donation.status).icon}
                      {donation.status}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Transaction ID</p>
                  <p className="font-semibold text-gray-900 text-sm break-all">
                    {donation.transactionId || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Message */}
            {donation.message && (
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <MessageCircle size={18} className="text-blue-600" />
                  Message
                </h3>
                <p className="text-gray-700 italic">{donation.message}</p>
              </div>
            )}

            {/* Admin Note Section */}
            {isSuperAdmin && (
              <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Shield size={18} className="text-orange-600" />
                    Admin Note
                  </h3>
                  {!editingNote && (
                    <button
                      onClick={() => {
                        setEditingNote(true);
                        setAdminNote(donation.adminNote || "");
                      }}
                      className="p-1.5 hover:bg-orange-200 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} className="text-orange-600" />
                    </button>
                  )}
                </div>
                {editingNote ? (
                  <div className="space-y-3">
                    <textarea
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="Add admin notes here..."
                      className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                      rows="4"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveAdminNote}
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <Save size={16} />
                        Save Note
                      </button>
                      <button
                        onClick={() => setEditingNote(false)}
                        className="flex-1 px-4 py-2 border border-orange-300 hover:bg-orange-100 text-gray-700 font-semibold rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700">{donation.adminNote || "No notes added yet"}</p>
                )}
              </div>
            )}

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-gray-500 font-semibold">Created</p>
                <p className="text-gray-700">
                  {new Date(donation.createdAt).toLocaleString()}
                </p>
              </div>
              {donation.completedAt && (
                <div>
                  <p className="text-gray-500 font-semibold">Completed</p>
                  <p className="text-gray-700">
                    {new Date(donation.completedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {isSuperAdmin && (
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                {donation.status !== "completed" && (
                  <button
                    onClick={() => handleMarkAsCompleted(donation._id)}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={16} />
                    Mark Completed
                  </button>
                )}
                <button
                  onClick={() => handleFlagDonation(donation._id, !donation.adminFlagged)}
                  disabled={loading}
                  className={`flex-1 px-4 py-2 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${
                    donation.adminFlagged
                      ? "bg-red-100 hover:bg-red-200 text-red-700"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                >
                  <Flag size={16} />
                  {donation.adminFlagged ? "Unflag" : "Flag"}
                </button>
                <button
                  onClick={() => handleDeleteDonation(donation._id)}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // ═════════════════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ═════════════════════════════════════════════════════════════════════════

  return (
    <motion.div className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header Section */}
      <div className="bg-linear-to-r from-emerald-600 to-emerald-700 px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Donation History</h1>
            <p className="text-emerald-100">Manage and track all donations</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              fetchDonationHistory(1);
              fetchStats();
            }}
            disabled={loading}
            className="p-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-emerald-400/20">
            <p className="text-emerald-100 text-sm font-semibold mb-1">Total Donations</p>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-emerald-400/20">
            <p className="text-emerald-100 text-sm font-semibold mb-1">Completed</p>
            <p className="text-3xl font-bold text-white">{stats.completed}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-emerald-400/20">
            <p className="text-emerald-100 text-sm font-semibold mb-1">Total Amount</p>
            <p className="text-2xl font-bold text-white">₹{stats.totalAmount?.toLocaleString()}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-emerald-400/20">
            <p className="text-emerald-100 text-sm font-semibold mb-1">Avg Amount</p>
            <p className="text-2xl font-bold text-white">₹{stats.averageAmount?.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-3"
          >
            <AlertCircle size={20} />
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-3"
          >
            <CheckCircle size={20} />
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters & Search */}
      <div className="px-6 py-4 border-b border-gray-200 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by donor name, email, or transaction ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        {/* Quick Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={filters.currency}
            onChange={(e) => setFilters({ ...filters, currency: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Currency</option>
            <option value="INR">₹ INR</option>
            <option value="USD">$ USD</option>
          </select>

          <select
            value={filters.paymentMethod}
            onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Methods</option>
            <option value="UPI">UPI</option>
            <option value="Net Banking">Net Banking</option>
            <option value="Card">Card</option>
            <option value="Cheque">Cheque</option>
            <option value="Wire Transfer">Wire Transfer</option>
          </select>

          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Filter size={18} />
            Advanced
          </button>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showAdvancedFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-gray-200"
            >
              <input
                type="number"
                placeholder="Min Amount"
                value={amountRange.min}
                onChange={(e) => setAmountRange({ ...amountRange, min: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="number"
                placeholder="Max Amount"
                value={amountRange.max}
                onChange={(e) => setAmountRange({ ...amountRange, max: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Export Button */}
      <div className="px-6 py-3 flex gap-2">
        <button
          onClick={handleExportCSV}
          disabled={donations.length === 0 || loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="px-6 py-12 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <Loader size={24} className="animate-spin text-emerald-600" />
            <p className="text-gray-600 font-semibold">Loading donations...</p>
          </div>
        </div>
      )}

      {/* Donations List */}
      {!loading && donations.length > 0 && (
        <>
          <div className="divide-y divide-gray-200">
            {donations.map((donation, index) => (
              <motion.div
                key={donation._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-gray-900">{donation.donorName}</h3>
                      {donation.isAnonymous && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-semibold">
                          Anonymous
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500 font-semibold">Amount</p>
                        <p className="font-bold text-emerald-600">
                          {donation.currency === "INR" ? "₹" : "$"}
                          {donation.amount?.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold">Method</p>
                        <p className="font-semibold text-gray-700">{donation.paymentMethod}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold">Status</p>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                            getStatusStyles(donation.status).bg
                          } ${getStatusStyles(donation.status).text} border ${
                            getStatusStyles(donation.status).border
                          }`}
                        >
                          {getStatusStyles(donation.status).icon}
                          {donation.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold">Date</p>
                        <p className="text-gray-700">
                          {new Date(donation.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {donation.adminFlagged && isSuperAdmin && (
                      <div className="flex items-center gap-2 mb-2 p-2 bg-red-50 rounded border border-red-100">
                        <Flag size={14} className="text-red-600" />
                        <p className="text-xs text-red-700 font-semibold">
                          {donation.flaggedReason || "Flagged by admin"}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedDonation(donation);
                        setAdminNote(donation.adminNote || "");
                        setShowDetailModal(true);
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Eye size={16} />
                      View
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between flex-wrap gap-4">
            <div className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold">
                {(pagination.page - 1) * pagination.limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{" "}
              of <span className="font-semibold">{pagination.total}</span> donations
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1 || loading}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Previous
              </button>

              {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                .slice(
                  Math.max(0, pagination.page - 3),
                  Math.min(pagination.pages, pagination.page + 2)
                )
                .map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                      pagination.page === page
                        ? "bg-emerald-600 text-white"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages || loading}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        </>
      )}

      {/* Empty State */}
      {!loading && donations.length === 0 && (
        <div className="px-6 py-20 text-center">
          <Filter size={32} className="mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-semibold text-gray-500 mb-1">No donations found</p>
          <p className="text-sm text-gray-400">Try adjusting your filters or search criteria</p>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedDonation && (
          <DetailModal
            donation={selectedDonation}
            onClose={() => {
              setShowDetailModal(false);
              setEditingNote(false);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DonationHistory;
