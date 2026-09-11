import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  Users,
  FileText,
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
  BarChart3,
  Settings,
  TrendingUp,
  Shield,
  ActivitySquare,
  PieChart,
} from "lucide-react";

import { adminAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import usePageTitle from "../../hooks/usePageTitle";

import  EventsTab  from "../../components/admin/EventsTab";
import  AlbumsTab  from "../../components/admin/AlbumsTab";
import  AlumniTab  from "../../components/admin/AlumniTab";
import  DonationsTab  from "../../components/admin/DonationsTab";
import  DepartmentTab  from "../../components/admin/DepartmentTab";
import { AdminUsersTab } from "../../components/admin/AdminUsersTab"; // ✅ CORRECT: Named import

import  DonationHistory  from "../../components/admin/DonationHistory";
import  CampaignCreator  from "../../components/admin/CampaignCreator";
import  CampaignResponsesManager  from "../../components/admin/CampaignResponsesManager";

// ✅ Helper for ID validation
const isValidCampaignId = (id) => {
  if (!id || typeof id !== "string") return false;
  const mongoIdRegex = /^[a-f\d]{24}$/i;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const numericRegex = /^\d+$/;
  return mongoIdRegex.test(id) || uuidRegex.test(id) || numericRegex.test(id);
};



// ✅ STATS CARD COMPONENT
const StatsCard = ({ icon: Icon, label, value, trend, color = "blue" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white rounded-2xl p-6 shadow-sm border-l-4 border-${color}-500 hover:shadow-md transition-all`}
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-600 text-sm font-medium">{label}</p>
        <h3 className="text-3xl font-bold text-slate-900 mt-2">{value}</h3>
        {trend && (
          <p className={`text-xs mt-2 flex items-center gap-1 ${trend > 0 ? "text-green-600" : "text-red-600"}`}>
            <TrendingUp size={12} /> {Math.abs(trend)}% vs last month
          </p>
        )}
      </div>
      <div className={`w-12 h-12 rounded-xl bg-${color}-100 flex items-center justify-center`}>
        <Icon size={24} className={`text-${color}-600`} />
      </div>
    </div>
  </motion.div>
);

// ✅ SYSTEM HEALTH INDICATOR
const SystemHealth = ({ isSuperAdmin }) => {
  const [health, setHealth] = useState({
    database: "healthy",
    api: "healthy",
    storage: "healthy",
  });

  useEffect(() => {
    // ✅ Simulated health check - replace with real API call
    const checkHealth = async () => {
      try {
        // Replace with actual health check endpoint
        setHealth({
          database: "healthy",
          api: "healthy",
          storage: "healthy",
        });
      } catch (error) {
        console.error("Health check failed:", error);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (!isSuperAdmin) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm"
    >
      <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
        <ActivitySquare size={18} /> System Health
      </h3>
      <div className="space-y-3">
        {Object.entries(health).map(([service, status]) => (
          <div key={service} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <span className="capitalize text-sm font-medium text-slate-700">{service}</span>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${status === "healthy" ? "bg-green-500" : "bg-red-500"} animate-pulse`} />
              <span className="text-xs font-medium text-slate-600 capitalize">{status}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const AdminDashboard = () => {
  const { logout, user, isAuthenticated, authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const hasRedirected = useRef(false); // ✅ FIXED POSITION

  // ✅ STATE MANAGEMENT
  const [activeTab, setActiveTab] = useState("alumni");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [scrollPosition, setScrollPosition] = useState(0);

  const [alumniList, setAlumniList] = useState([]);
  const [donationList, setDonationList] = useState([]);
  const [campaignList, setCampaignList] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);

  const [alumniPageData, setAlumniPageData] = useState({
    totalAlumni: 0,
    totalPages: 1,
    currentPage: 1,
  });

  const [stats, setStats] = useState({
    totalAlumni: 0,
    pendingAlumni: 0,
    totalDonatedAmount: 0,
    completedDonations: 0,
    totalEvents: 0,
    totalAlbums: 0,
    totalCampaigns: 0,
    departments: 0,
    adminUsers: 0,
  });

  // ✅ ROLE DETECTION
  const isSuperAdmin = user?.role === "superadmin";
  const isAdmin = user?.role === "admin";
  const department = user?.department || "";

  // ✅ Check authentication
 useEffect(() => {
  if (authLoading) return;

  if (!isAuthenticated && !hasRedirected.current) {
    hasRedirected.current = true;
    console.warn("⚠️ User not authenticated, redirecting to login");
    navigate("/admin", { replace: true });
  }
}, [authLoading, isAuthenticated, navigate]);

  usePageTitle(
    isSuperAdmin
      ? "Super Admin Dashboard"
      : isAdmin
      ? `${department} Dashboard`
      : "Admin Dashboard"
  );

  const params = useMemo(
    () => (isAdmin && !isSuperAdmin ? { department: user?.department } : {}),
    [isAdmin, user?.department]
  );

  // ✅ ENHANCED SCROLL LISTENER
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ FETCH DASHBOARD DATA
  useEffect(() => {
    if (!isAuthenticated || authLoading) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [statsRes, alumniRes, donationsRes, campaignsRes] = await Promise.all([
          adminAPI.getStats(),
          adminAPI.getAllAlumni({
            ...params,
            page: 1,
            limit: 20,
          }),
          adminAPI.getAllDonations?.() || Promise.resolve({ data: { donations: [] } }),
          fetch("http://localhost:5000/api/campaigns")
            .then((res) => res.json())
            .catch(() => ({ campaigns: [] })),
        ]);

        setStats({
          ...(statsRes.data.stats || {}),
          totalCampaigns: campaignsRes.campaigns?.length || 0,
          departments: statsRes.data.stats?.departments || 0,
          adminUsers: statsRes.data.stats?.adminUsers || 0,
        });

        setAlumniList(alumniRes.data.alumni || []);
        setAlumniPageData({
          totalAlumni: alumniRes.data.totalAlumni || 0,
          totalPages: alumniRes.data.totalPages || 1,
          currentPage: alumniRes.data.currentPage || 1,
        });

        setDonationList(donationsRes.data.donations || []);
        setCampaignList(campaignsRes.campaigns || []);

        // ✅ Handle campaign ID from URL
        const urlParams = new URLSearchParams(location.search);
        const urlCampaignId = urlParams.get("campaignId");

        let finalCampaignId = null;

        if (urlCampaignId && isValidCampaignId(urlCampaignId)) {
          const campaignExists = campaignsRes.campaigns?.some((c) => c._id === urlCampaignId);
          if (campaignExists) {
            finalCampaignId = urlCampaignId;
          }
        }

        if (!finalCampaignId && campaignsRes.campaigns?.length > 0) {
          finalCampaignId = campaignsRes.campaigns[0]._id;
        }

        setSelectedCampaignId(finalCampaignId);
      } catch (err) {
        console.error("❌ Dashboard data fetch error:", err);
        setError(err.response?.data?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [params, location.search, isAuthenticated, authLoading]);

  // ✅ LOGOUT HANDLER
  const handleLogout = useCallback(() => {
    logout();
    navigate("/admin", { replace: true });
  }, [logout, navigate]);

  // ✅ CAMPAIGN HANDLERS
  const handleCampaignCreated = (newCampaign) => {
    setCampaignList((prev) => [newCampaign, ...prev]);
    setSelectedCampaignId(newCampaign._id);
    setSuccess(`Campaign "${newCampaign.title}" created successfully!`);
    setTimeout(() => {
      setActiveTab("campaign-manager");
      setSuccess("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 2000);
  };

  const handleCampaignSelect = (campaignId) => {
    if (isValidCampaignId(campaignId)) {
      setSelectedCampaignId(campaignId);
      window.history.replaceState(null, "", `${location.pathname}?campaignId=${campaignId}`);
    } else {
      setError("Invalid campaign ID selected");
    }
  };

  // ✅ DYNAMIC TABS FOR SUPER ADMIN
  const ALUMNI_TAB_CONFIGS = [
    { key: "alumni", Icon: Users, label: "Alumni", badge: alumniList.length },
    {
      key: "donations",
      Icon: FileText,
      label: "Donations",
      badge: donationList.length,
    },
    {
      key: "donation-history",
      Icon: History,
      label: "Donation History",
      badge: "🧾",
    },
  ];

  const CAMPAIGN_TAB_CONFIGS = [
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
  ];

  const CONTENT_TAB_CONFIGS = [
    {
      key: "events",
      Icon: Calendar,
      label: "Events",
      badge: stats.totalEvents,
    },
    { key: "albums", Icon: Camera, label: "Albums", badge: stats.totalAlbums },
  ];

  const SUPER_ADMIN_TAB_CONFIGS = isSuperAdmin
    ? [
        {
          key: "departments",
          Icon: BookOpen,
          label: "Departments",
          badge: stats.departments,
        },
        { key: "users", Icon: Shield, label: "Admin Users", badge: stats.adminUsers },
        {
          key: "system",
          Icon: Settings,
          label: "System Settings",
          badge: "⚙️",
        },
      ]
    : [];

  const TABS = [
    ...ALUMNI_TAB_CONFIGS,
    ...CAMPAIGN_TAB_CONFIGS,
    ...CONTENT_TAB_CONFIGS,
    ...SUPER_ADMIN_TAB_CONFIGS,
  ];

  // ✅ LOADING STATE
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 pt-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full"
        />
      </div>
    );
  }

  // ✅ Not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen pt-24 pb-20 px-4 sm:px-6">
      <style>{`
        /* ═══════════════════════════════════════════════════════════════ */
        /* DASHBOARD SCROLLING & ANIMATIONS */
        /* ═══════════════════════════════════════════════════════════════ */
        .dashboard-container {
          animation: fadeIn 0.6s ease-in-out;
        }

        .tab-content {
          animation: fadeIn 0.4s ease-in-out;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .sticky-header {
          position: sticky;
          top: 70px;
          z-index: 40;
          background: linear-gradient(135deg, rgba(248,250,252,0.95) 0%, rgba(226,232,240,0.95) 100%);
          backdrop-filter: blur(10px);
          padding: 1rem 0;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid rgba(226,232,240,0.5);
          transition: all 0.3s ease;
        }

        .sticky-header.scrolled {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .sticky-header {
            top: 60px;
          }
        }

        /* Smooth transitions for tab changes */
        [role="tablist"] {
          overflow-x: auto;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }

        [role="tablist"]::-webkit-scrollbar {
          height: 4px;
        }

        [role="tablist"]::-webkit-scrollbar-thumb {
          background: linear-gradient(90deg, #667eea, #764ba2);
          border-radius: 2px;
        }
      `}</style>

      <div className="max-w-[1600px] mx-auto dashboard-container">
        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* HEADER SECTION */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-start mb-8"
        >
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              {isSuperAdmin
                ? "🚀 Super Admin Dashboard"
                : isAdmin
                ? `📊 ${department} Department`
                : "Admin Dashboard"}
            </h1>
            <p className="text-slate-600 mt-2 text-base sm:text-lg">
              {isSuperAdmin
                ? "System-wide administration & oversight"
                : isAdmin
                ? `Manage your ${department} alumni network`
                : "Administration & Management"}
            </p>
          </div>

          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <Link
              to="/admin/notifications"
              className="w-10 h-10 rounded-xl bg-white hover:bg-blue-50 shadow-sm hover:shadow-md transition flex items-center justify-center"
              title="Notifications"
            >
              <Bell size={18} className="text-blue-600" />
            </Link>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:shadow-lg transition"
            >
              <LogOut size={14} /> Logout
            </motion.button>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* ALERTS */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2 shadow-sm"
            >
              <AlertCircle size={16} /> {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-2 shadow-sm"
            >
              <CheckCircle size={16} /> {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* STATS SECTION - Super Admin Only */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {isSuperAdmin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="stats-grid"
          >
            <StatsCard
              icon={Users}
              label="Total Alumni"
              value={stats.totalAlumni}
              trend={12}
              color="blue"
            />
            <StatsCard
              icon={CheckCircle}
              label="Approved Alumni"
              value={stats.totalAlumni - stats.pendingAlumni}
              trend={8}
              color="green"
            />
            <StatsCard
              icon={FileText}
              label="Total Donations"
              value={`₹${(stats.totalDonatedAmount / 100000).toFixed(1)}L`}
              trend={15}
              color="purple"
            />
            <StatsCard
              icon={Calendar}
              label="Total Events"
              value={stats.totalEvents}
              color="orange"
            />
            <StatsCard
              icon={BookOpen}
              label="Departments"
              value={stats.departments}
              color="indigo"
            />
            <StatsCard
              icon={Shield}
              label="Admin Users"
              value={stats.adminUsers}
              color="rose"
            />
          </motion.div>
        )}

        {/* System Health Check */}
        <SystemHealth isSuperAdmin={isSuperAdmin} />

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* STICKY TAB HEADER */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className={`sticky-header ${scrollPosition > 100 ? "scrolled" : ""}`}>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex gap-2 flex-wrap" role="tablist">
              {TABS.map(({ key, Icon, label, badge }) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setActiveTab(key);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  role="tab"
                  aria-selected={activeTab === key}
                  className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition whitespace-nowrap ${
                    activeTab === key
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <Icon size={15} />
                  {label}
                  {badge && (
                    <span className="text-xs ml-1 px-2 py-0.5 rounded-full bg-white bg-opacity-20">
                      {badge}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TAB CONTENT */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="tab-content"
          >
            {activeTab === "alumni" && (
              <AlumniTab alumniList={alumniList} pageData={alumniPageData} />
            )}

            {activeTab === "donations" && (
              <DonationsTab donationList={donationList} />
            )}

            {activeTab === "donation-history" && <DonationHistory />}

            {activeTab === "campaign-creator" && (
              <CampaignCreator onCampaignCreated={handleCampaignCreated} />
            )}

            {activeTab === "campaign-manager" && selectedCampaignId && (
              <div className="space-y-6">
                {campaignList.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-6 shadow-sm"
                  >
                    <h3 className="font-bold text-slate-900 mb-3">
                      Select Campaign
                    </h3>
                    <select
                      value={selectedCampaignId || ""}
                      onChange={(e) => handleCampaignSelect(e.target.value)}
                      className="w-full max-w-md px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                    >
                      {campaignList.map((campaign) => (
                        <option key={campaign._id} value={campaign._id}>
                          {campaign.title} ({campaign.status})
                        </option>
                      ))}
                    </select>
                  </motion.div>
                )}

                <CampaignResponsesManager campaignId={selectedCampaignId} />
              </div>
            )}

            {activeTab === "campaign-manager" && !selectedCampaignId && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl p-12 text-center shadow-sm"
              >
                <AlertCircle size={48} className="mx-auto text-slate-400 mb-4" />
                <p className="text-slate-600 text-lg">
                  No campaigns created yet. Go to "Create Campaign" to get started.
                </p>
              </motion.div>
            )}

            {activeTab === "events" && <EventsTab />}

            {activeTab === "albums" && <AlbumsTab />}

            {activeTab === "departments" && isSuperAdmin && <DepartmentTab />}

            {/* ✅ FIXED: Using named component import */}
            {activeTab === "users" && isSuperAdmin && (
              <AdminUsersTab
                onError={(msg) => setError(msg)}
                onSuccess={(msg) => setSuccess(msg)}
              />
            )}

            {activeTab === "system" && isSuperAdmin && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl p-8 shadow-sm"
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  System Settings
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-slate-50 rounded-xl">
                    <h3 className="font-bold text-slate-900 mb-3">Database</h3>
                    <p className="text-sm text-slate-600">Connected: MongoDB Atlas</p>
                    <p className="text-sm text-slate-600 mt-1">Status: Healthy</p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-xl">
                    <h3 className="font-bold text-slate-900 mb-3">API Server</h3>
                    <p className="text-sm text-slate-600">Running on: Port 5000</p>
                    <p className="text-sm text-slate-600 mt-1">Status: Online</p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;