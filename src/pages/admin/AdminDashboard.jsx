import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  Users,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Calendar,
  Camera,
  Bell,
  BookOpen,
  History,
  Megaphone,
  ClipboardList,
  Plus,
  Clock3,
  IndianRupee,
  BadgeCheck,
  Building,
} from "lucide-react";
import { adminAPI, API_BASE, campaignsAPI } from "../../services/api";
import {
  formatINR,
  formatNumber,
  formatCurrency,
} from "../../utils/formatters";
import { useAuth } from "../../context/AuthContext";
import usePageTitle from "../../hooks/usePageTitle";

// Import Refactored Components
import { EventsTab } from "../../components/admin/EventsTab";
import { AlbumsTab } from "../../components/admin/AlbumsTab";
import { AlumniTab } from "../../components/admin/AlumniTab";

import { AdminUsersTab } from "../../components/admin/AdminUsersTab";
// import NotificationManager from "../../pages/Notificationmanager";

import DonationHistory from "../../components/admin/DonationHistory";
import CampaignCreator from "../../components/admin/Campaigncreator";
import CampaignResponsesManager from "../../components/admin/Campaignresponsesmanager";

// ✅ Helper function to validate MongoDB ObjectId or UUID format
const isValidCampaignId = (id) => {
  if (!id || typeof id !== "string") return false;

  // MongoDB ObjectId: 24 hex characters
  const mongoIdRegex = /^[a-f\d]{24}$/i;

  // UUID v4 format
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  // Allow numeric IDs as well
  const numericRegex = /^\d+$/;

  return mongoIdRegex.test(id) || uuidRegex.test(id) || numericRegex.test(id);
};

const AdminDashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("alumni");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [alumniList, setAlumniList] = useState([]);
  const [campaignList, setCampaignList] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);

  const [alumniPageData, setAlumniPageData] = useState({
    totalAlumni: 0,
    totalPages: 1,
    currentPage: 1,
  });
  const [alumniFilters, setAlumniFilters] = useState({});
  const [stats, setStats] = useState({
    totalAlumni: 0,
    pendingAlumni: 0,
    totalDonatedAmount: 0,
    completedDonations: 0,
    totalEvents: 0,
    totalAlbums: 0,
    totalCampaigns: 0,
    totalMembershipFees: 0,
    completedMembership: 0,

  });
  const [selectedItem, setSelectedItem] = useState(null);

  const stream = user.stream || "";
  const isAdmin = user.role === "admin";
  usePageTitle(isAdmin ? `${stream} Dashboard` : "Admin Dashboard");
  // ✅ Memoize params to prevent unnecessary object recreation
  const params = useMemo(
    () => (isAdmin ? { stream: user.stream } : {}),
    [isAdmin, user.stream],
  );

  const iv = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: "easeOut" },
    },
  };
  const cv = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  // ✅ Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [statsRes, alumniRes, campaignsRes] =
          await Promise.all([
            adminAPI.getStats(),
            adminAPI.getAllAlumni({
              ...params,
              page: 1,
              limit: 20,
            }),

            campaignsAPI.getAll(),
          ]);

        setStats({
          ...(statsRes.data.stats || {}),
          totalCampaigns: campaignsRes.campaigns?.length || 0,
        });
        setAlumniList(alumniRes.data.alumni || []);

        setAlumniPageData({
          totalAlumni: alumniRes.data.totalAlumni || 0,
          totalPages: alumniRes.data.totalPages || 1,
          currentPage: alumniRes.data.currentPage || 1,
        });


        setCampaignList(campaignsRes.campaigns || []);

        // ✅ Get campaign ID from URL with validation
        const urlParams = new URLSearchParams(location.search);
        const urlCampaignId = urlParams.get("campaignId");

        let finalCampaignId = null;

        // ✅ VALIDATE URL campaign ID before using it
        if (urlCampaignId && isValidCampaignId(urlCampaignId)) {
          // Check if the campaign actually exists in our list
          const campaignExists = campaignsRes.campaigns?.some(
            (c) => c._id === urlCampaignId,
          );
          if (campaignExists) {
            finalCampaignId = urlCampaignId;
            console.log(`✅ Using campaign from URL: ${urlCampaignId}`);
          } else {
            console.warn(
              `⚠️ Campaign ${urlCampaignId} not found in list, using first campaign`,
            );
          }
        } else if (urlCampaignId) {
          // Invalid format detected
          console.warn(
            `❌ Invalid campaign ID format in URL: "${urlCampaignId}". Expected valid MongoDB ObjectId, UUID, or numeric ID.`,
          );
          // Don't use it, fall back to first campaign
        }

        // ✅ If no valid campaign ID from URL, use first campaign
        if (!finalCampaignId && campaignsRes.campaigns?.length > 0) {
          finalCampaignId = campaignsRes.campaigns[0]._id;
          console.log(`📌 Using first campaign: ${finalCampaignId}`);
        }

        setSelectedCampaignId(finalCampaignId);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [params, location.search]);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/admin");
  }, [logout, navigate]);

  const handleApprove = async (id) => {
    try {
      await adminAPI.approveAlumni(id);
      setSuccess("Alumni approved!");
      setSelectedItem(null);
      // ✅ OPTIMIZED: Refetch with current page and limit
      // ✅ For Admin: Always include their stream
      // ✅ For SuperAdmin: Don't force stream
      const r = await adminAPI.getAllAlumni({
        ...(user.role === "admin" ? { stream: user.stream } : {}),
        ...alumniFilters,
        page: alumniPageData.currentPage,
        limit: 20,
      });
      setAlumniList(r.data.alumni || []);
      setAlumniPageData({
        totalAlumni: r.data.totalAlumni || 0,
        totalPages: r.data.totalPages || 1,
        currentPage: r.data.currentPage || 1,
      });
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setError(e.response?.data?.message || "Failed");
      setTimeout(() => setError(""), 3000);
    }
  };

  // ✅ Handle campaign creation
  const handleCampaignCreated = (newCampaign) => {
    setCampaignList((prev) => [newCampaign, ...prev]);
    setSelectedCampaignId(newCampaign._id);
    setSuccess(`Campaign "${newCampaign.title}" created successfully!`);
    setTimeout(() => {
      setActiveTab("campaign-manager");
      setSuccess("");
    }, 2000);
  };

  // ✅ Handle campaign selection with validation
  const handleCampaignSelect = (campaignId) => {
    if (isValidCampaignId(campaignId)) {
      setSelectedCampaignId(campaignId);
      // Update URL
      window.history.replaceState(
        null,
        "",
        `${location.pathname}?campaignId=${campaignId}`,
      );
    } else {
      console.error(`❌ Invalid campaign ID: ${campaignId}`);
      setError("Invalid campaign ID selected");
    }
  };

  const TABS = [
    {
      key: "alumni",
      Icon: Users,
      label: "Alumni",
      badge: formatNumber(alumniPageData.totalAlumni),
    },
    {
      key: "donation-history",
      Icon: History,
      label: "Donation History",
      badge: "🧾",
    },

    {
      key: "events",
      Icon: Calendar,
      label: "Events",
      badge: stats.totalEvents,
    },
    { key: "albums", Icon: Camera, label: "Albums", badge: stats.totalAlbums },
    // ✅ NEW: Notifications tab for Super Admin only
    ...(user?.role !== "admin"
      ? [
        {
          key: "campaign-creator",
          Icon: Plus,
          label: "Create Campaign",
          badge: "📋",
        },
        {
          key: "campaign-manager",
          Icon: Megaphone,
          label: "Campaign Manager",
          badge: stats.totalCampaigns,
        },
        { key: "users", Icon: Users, label: "Admin Users", badge: "👤" },
      ]
      : []),
  ];

  const STAT_CARDS =
    user.role === "admin"
      ? [
        {
          icon: <Users className="w-6 h-6 text-blue-600" />,
          val: formatNumber(stats.totalAlumni),
          label: "Total Alumni",
        },
        {
          icon: <Building className="w-6 h-6 text-green-600" />,
          val: formatNumber(alumniPageData.totalAlumni || 0),
          label: `${user.stream} Alumni`,
        },
        {
          icon: <IndianRupee className="w-6 h-6 text-purple-600" />,
          val: formatCurrency(stats.totalDonatedAmount),
          label: "Donation Funds",
        },
        {
          icon: <Calendar className="w-6 h-6 text-teal-600" />,
          val: formatNumber(stats.totalEvents),
          label: "Total Events",
        },
      ]
      : [
        {
          icon: <Users className="w-6 h-6 text-blue-600" />,
          val: formatNumber(stats.totalAlumni),
          label: "Total Alumni",
        },
        {
          icon: <Clock3 className="w-6 h-6 text-yellow-600" />,
          val: formatNumber(stats.pendingAlumni),
          label: "Pending Approval",
        },
        {
          icon: <IndianRupee className="w-6 h-6 text-purple-600" />,
          val: formatCurrency(stats.totalDonatedAmount),
          label: "Donation Funds",
        },
        {
          icon: <Calendar className="w-6 h-6 text-teal-600" />,
          val: formatNumber(stats.totalEvents),
          label: "Total Events",
        },
      ];

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f5ee] font-['Outfit',sans-serif]">
        <div className="text-center">
          <div className="w-10 h-10 border-[3px] border-slate-200 border-t-blue-500 rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-gray-400 font-medium">Loading dashboard…</p>
        </div>
      </div>
    );

  return (
    <div className="bg-slate-100 min-h-screen pt-26 pb-16 px-4 sm:px-6 relative overflow-x-hidden font-['Outfit',sans-serif]">
      {/* Background glowing orb */}
      <div className="absolute -top-44 -right-44 w-[480px] h-[480px] bg-[radial-gradient(circle,rgba(201,168,76,.07)_0%,transparent_70%)] pointer-events-none rounded-full" />

      <div className="max-w-[1400px] mx-auto relative">
        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-9 flex-wrap gap-4"
          variants={iv}
          initial="hidden"
          animate="visible"
        >
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-slate-900">
              {user.role === "admin"
                ? `Admin Dashboard`
                : `Super Admin Dashboard`}
            </h1>
            <p className="text-slate-600 mt-2">
              {user.role === "admin"
                ? `${user.stream || "Stream"} • Manage your alumni network`
                : `System Administration & Oversight`}
            </p>
          </div>
          <div className="inline-flex items-center gap-4">
            <Link
              to="/admin/notifications"
              className="relative w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <Bell size={18} className="text-gray-900" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
            </Link>
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-700 border-none rounded-xl font-['Outfit',sans-serif] text-[13px] font-bold cursor-pointer uppercase tracking-wider hover:bg-red-100 transition-colors shadow-sm"
            >
              <LogOut size={14} strokeWidth={2.5} /> Logout
            </motion.button>
          </div>
        </motion.div>

        {/* Status Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="px-4 py-3 rounded-xl mb-5 text-sm flex items-center gap-2.5 font-['Outfit',sans-serif] font-medium bg-red-50 border border-red-200 text-red-800 shadow-sm"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <AlertCircle size={16} className="shrink-0" />
              <span className="flex-1">{error}</span>
              <button
                onClick={() => setError("")}
                className="bg-transparent border-none cursor-pointer text-red-500 hover:text-red-700"
              >
                <X size={14} />
              </button>
            </motion.div>
          )}
          {success && (
            <motion.div
              className="px-4 py-3 rounded-xl mb-5 text-sm flex items-center gap-2.5 font-['Outfit',sans-serif] font-medium bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-sm"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <CheckCircle size={16} className="shrink-0" />
              {success}
            </motion.div>
          )}
        </AnimatePresence>
        {/* Stat Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-8 sm:mb-10"
          variants={cv}
          initial="hidden"
          animate="visible"
        >
          {STAT_CARDS.map(({ icon, val, label }) => (
            <motion.div
              key={label}
              variants={iv}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              className="
                relative overflow-hidden
                min-h-24

                bg-white
                border border-slate-200/80
                rounded-2xl

                px-4 py-4

                shadow-sm
                hover:shadow-md

                transition-all duration-300
              "
            >
              {/* Left Accent */}
              <div className="absolute left-0 top-0 h-full w-1 bg-linear-to-b from-[#0d2d52] to-[#143d69]" />

              <div className="flex items-center gap-4 h-full">
                {/* Icon */}
                <div
                  className="
                    h-12 w-12
                    rounded-xl

                    bg-slate-50
                    border border-slate-100

                    flex items-center justify-center
                    shrink-0
                  "
                >
                  {icon}
                </div>

                {/* Content */}
                <div className="min-w-0">
                  <h3
                    className="
                      text-2xl sm:text-[28px]
                      font-bold
                      text-slate-800

                      tracking-tight
                      leading-none
                    "
                  >
                    {val}
                  </h3>

                  <p
                    className="
                      mt-1.5
                      text-sm
                      font-medium
                      text-slate-500
                    "
                  >
                    {label}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        {/* Tabs Panel */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
          <div className="flex gap-2 flex-wrap">
            {TABS.map(({ key, Icon, label, badge }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition ${activeTab === key
                    ? "bg-[#0d2d52] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
              >
                <Icon size={15} />
                {label}
                {badge && (
                  <span className="text-xs ml-1 px-2 py-0.5 rounded-full bg-white text-black bg-opacity-20">
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "events" && (
            <motion.div
              key="events"
              variants={iv}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
            >
              <EventsTab onError={setError} onSuccess={setSuccess} />
            </motion.div>
          )}
          {activeTab === "albums" && (
            <motion.div
              key="albums"
              variants={iv}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
            >
              <AlbumsTab onError={setError} onSuccess={setSuccess} />
            </motion.div>
          )}
          {activeTab === "alumni" && (
            <motion.div
              key="alumni"
              variants={iv}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
            >
              <AlumniTab
                alumniList={alumniList}
                setSelectedItem={setSelectedItem}
                pageData={alumniPageData}
                onPageChange={async (page) => {
                  try {
                    // ✅ Preserve active filters when changing pages
                    const queryParams = {
                      ...alumniFilters,
                      page,
                      limit: 20,
                    };

                    if (user.role === "admin") {
                      queryParams.stream = user.stream;
                    }

                    const res = await adminAPI.getAllAlumni(queryParams);
                    setAlumniList(res.data.alumni || []);
                    setAlumniPageData({
                      totalAlumni: res.data.totalAlumni || 0,
                      totalPages: res.data.totalPages || 1,
                      currentPage: res.data.currentPage || 1,
                    });
                  } catch (err) {
                    console.error("Failed to fetch page:", err);
                    setError("Failed to load alumni page");
                  }
                }}
                onFilterChange={async (filters) => {
                  try {
                    // ✅ For Admin: Merge their stream with other filters (override any stream selection)
                    // ✅ For SuperAdmin: Use filters as-is
                    const queryParams = {
                      ...filters,
                      page: 1,
                      limit: 20,
                    };

                    if (user.role === "admin") {
                      queryParams.stream = user.stream;
                    }

                    setAlumniFilters(filters);
                    const res = await adminAPI.getAllAlumni(queryParams);
                    setAlumniList(res.data.alumni || []);
                    setAlumniPageData({
                      totalAlumni: res.data.totalAlumni || 0,
                      totalPages: res.data.totalPages || 1,
                      currentPage: res.data.currentPage || 1,
                    });
                  } catch (err) {
                    console.error("Failed to apply filters:", err);
                    setError("Failed to apply filters");
                  }
                }}
                userRole={user.role}
              />
            </motion.div>
          )}
          
          {activeTab === "donation-history" && (
            <motion.div
              key="donation-history"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <DonationHistory onError={setError} onSuccess={setSuccess} />
            </motion.div>
          )}
          {activeTab === "campaign-creator" && (
            <CampaignCreator onCampaignCreated={handleCampaignCreated} />
          )}
          {activeTab === "campaign-manager" && selectedCampaignId && (
            <div className="space-y-6">
              {/* Campaign Selector */}
              {campaignList.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-3">
                    Select Campaign
                  </h3>
                  <select
                    value={selectedCampaignId || ""}
                    onChange={(e) => handleCampaignSelect(e.target.value)}
                    className="w-full max-w-md px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-400"
                  >
                    {campaignList.map((campaign) => (
                      <option key={campaign._id} value={campaign._id}>
                        {campaign.title} ({campaign.status})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Responses Manager */}
              <CampaignResponsesManager campaignId={selectedCampaignId} />
            </div>
          )}
          {activeTab === "campaign-manager" && !selectedCampaignId && (
            <div className="bg-white rounded-2xl p-12 text-center">
              <AlertCircle size={48} className="mx-auto text-slate-400 mb-4" />
              <p className="text-slate-600 text-lg">
                No campaigns created yet. Go to "Create Campaign" to get
                started.
              </p>
            </div>
          )}
          
          {activeTab === "users" && (
            <motion.div
              key="users"
              variants={iv}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
            >
              <AdminUsersTab onError={setError} onSuccess={setSuccess} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Detail Modal for Alumni */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-2000 flex items-center justify-center p-4"
              onClick={() => setSelectedItem(null)}
            >
              {/* Backdrop */}
              <div
                onClick={() => setSelectedItem(null)}
                style={{
                  position: "absolute inset-0 z-[2000]",
                  inset: 0,
                  background: "rgba(0,0,0,0.45)",
                  backdropFilter: "blur(4px)",
                }}
              />
              {/* Modal */}
              <motion.div
                initial={{ scale: 0.92, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.92, y: 10 }}
                className="bg-white rounded-[28px] w-full max-w-[680px] max-h-[90vh] overflow-y-auto p-6 sm:p-7 relative shadow-[0_24px_60px_rgba(0,0,0,0.2)]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-5 right-5 bg-slate-50 hover:bg-slate-100 text-gray-500 transition border w-9 h-9 rounded-xl flex items-center justify-center"
                >
                  <X size={16} />
                </button>

                {/* Alumni View */}
                {selectedItem.firstName && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
                      {/* Profile Column */}
                      <div className="md:col-span-1 bg-slate-50 rounded-2xl p-5 border border-slate-100">
                        <div className="flex flex-col items-center text-center">
                          <div className="w-28 h-28 rounded-full overflow-hidden bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-2xl mb-4 ring-4 ring-white shadow-md">
                            {selectedItem?.currentPhoto ? (
                              <img
                                src={`${API_BASE}/uploads/${selectedItem?.currentPhoto}`}
                                alt={`${selectedItem.firstName} ${selectedItem.lastName}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              `${selectedItem.firstName?.[0] || ""}${selectedItem.lastName?.[0] || ""}`
                            )}
                          </div>

                          <h2 className="text-lg md:text-xl font-semibold text-slate-900">
                            {selectedItem.firstName} {selectedItem.lastName}
                          </h2>
                          <p className="text-sm text-slate-500 mt-1">
                            {selectedItem.stream || "Stream N/A"}
                          </p>
                          <p className="text-sm text-slate-500 mt-2">{selectedItem.batchYear || "Year N/A"}</p>
                        </div>
                      </div>

                      {/* Details Column */}
                      <div className="md:col-span-2 space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                            <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">Contact</p>
                            <div className="mt-3 space-y-1 text-sm text-slate-800">
                              <p className="truncate">{selectedItem.email || "-"}</p>
                              <p>{selectedItem.phone || "-"}</p>
                            </div>
                          </div>

                          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                            <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">Academic</p>
                            <div className="mt-3 space-y-1 text-sm text-slate-800">
                              <p className="truncate">Stream: {selectedItem.stream || "-"}</p>
                            </div>
                          </div>

                          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                            <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">Work</p>
                            <div className="mt-3 space-y-1 text-sm text-slate-800">
                              <p className="truncate">{selectedItem.company || "-"}</p>
                              <p className="truncate">{selectedItem.occupation || "-"}</p>
                            </div>
                          </div>

                          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                            <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">Location</p>
                            <div className="mt-3 space-y-1 text-sm text-slate-800">
                              <p className="truncate">{selectedItem.city || "-"}</p>
                              <p className="truncate">{selectedItem.country || "-"}</p>
                            </div>
                          </div>

                          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm sm:col-span-2">
                            <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">Other</p>
                            <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-800">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">
                                Batch: {selectedItem.batchYear || "-"}
                              </span>
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">
                                Status: {selectedItem.isApproved ? "Approved" : "Pending"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                          {!selectedItem.isApproved && (
                            <button
                              onClick={() => handleApprove(selectedItem._id)}
                              className="flex-1 px-4 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition"
                            >
                              Approve Alumni
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedItem(null)}
                            className="px-4 py-3 rounded-xl border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 transition"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;