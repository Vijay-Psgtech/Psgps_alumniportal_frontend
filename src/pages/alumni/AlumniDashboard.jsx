// src/pages/alumni/AlumniDashboard.jsx
// ✅ Updated with Campaign Response integration

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Map,
  Heart,
  User,
  Bell,
  Send,
  ChevronRight,
  GraduationCap,
  MapPin,
  Sparkles,
  TrendingUp,
  Shield,
  ArrowUpRight,
  BookOpen,
  Award,
  Zap,
  X,
  LogOut,
  Megaphone,
} from "lucide-react";
import SendNotification from "./SendNotification";
import NotificationInbox from "./NotificationInbox";
import { notificationAPI, alumniAPI } from "../../services/api";
import usePageTitle from "../../hooks/usePageTitle";

/* ─── helpers ─── */
const avatarColors = [
  "from-violet-500 to-indigo-600",
  "from-rose-500 to-pink-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
];
const pickColor = (s = "") =>
  avatarColors[s.charCodeAt(0) % avatarColors.length];

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

/* ─── static data ─── */
const QUICK_CARDS = [
  {
    id: "directory",
    icon: Users,
    title: "Alumni Directory",
    desc: "Browse and connect with thousands of alumni worldwide",
    path: "/alumni/directory",
    accent: "from-blue-500 to-indigo-600",
    lightBg: "bg-blue-50",
    iconColor: "text-blue-600",
    cta: "Find connections",
  },
  {
    id: "map",
    icon: Map,
    title: "Alumni Map",
    desc: "Discover fellow alumni in your city and around the globe",
    path: "/alumni/map",
    accent: "from-emerald-500 to-teal-600",
    lightBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    cta: "Explore locations",
  },
  {
    id: "campaigns",
    icon: Megaphone,
    title: "Campaigns",
    desc: "Participate in alumni campaigns and share your stories",
    path: "/campaigns",
    accent: "from-violet-500 to-purple-600",
    lightBg: "bg-violet-50",
    iconColor: "text-violet-600",
    cta: "View campaigns",
  },
  {
    id: "donations",
    icon: Heart,
    title: "Make a Donation",
    desc: "Support PSG and make a difference in students' lives",
    path: "/alumni/donations",
    accent: "from-rose-500 to-pink-600",
    lightBg: "bg-rose-50",
    iconColor: "text-rose-600",
    cta: "Give back today",
  },
  {
    id: "notifications",
    icon: Bell,
    title: "Notifications",
    desc: "View announcements and messages from the alumni community",
    path: null,
    accent: "from-amber-500 to-orange-500",
    lightBg: "bg-amber-50",
    iconColor: "text-amber-600",
    cta: "Stay updated",
  },
];

const PROFILE_CHECKS = [
  { label: "Personal Info", key: (u) => !!(u?.phone && u?.gender) },
  {
    label: "Academic Details",
    key: (u) => !!(u?.department && u?.graduationYear),
  },
  { label: "Professional", key: (u) => !!(u?.currentCompany || u?.occupation) },
  {
    label: "Social Links",
    key: (u) => !!(u?.social?.linkedin || u?.social?.website),
  },
];

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
const AlumniDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState([]);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  usePageTitle(`Dashboard - ${user?.firstName ?? "Alumni"}`);

  const initials =
    `${user?.firstName?.charAt(0) ?? ""}${user?.lastName?.charAt(0) ?? ""}`.toUpperCase();
  const avatarGrad = pickColor(user?.firstName ?? "");

  /* --- Stats ---- */
  const STATS = [
    {
      label: "Alumni Network",
      value: stats.totalAlumni ? stats.totalAlumni + " +" : 0,
      icon: GraduationCap,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Departments",
      value: stats.departmentStats,
      icon: BookOpen,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Cities Covered",
      value: stats.topCities ? stats.topCities + " + " : 0,
      icon: MapPin,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
    {
      label: "Batch Years",
      value: stats.batchStats,
      icon: Award,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  useEffect(() => {
    alumniAPI
      .getStats()
      .then((r) => setStats(r.data.data))
      .catch(() => setStats([]));
  }, []);

  /* --- Notification Count ---- */
  const refreshCount = () =>
    notificationAPI
      .getMyNotifications()
      .then((r) => setUnreadCount(r.data.count || 0))
      .catch(() => {});

  useEffect(() => {
    refreshCount();
  }, []);

  const handleCardClick = (card) => {
    if (card.id === "notifications") setShowNotifications(true);
    else if (card.path) navigate(card.path);
  };

  const completedCount = PROFILE_CHECKS.filter((c) => c.key(user)).length;
  const completionPct = Math.round(
    (completedCount / PROFILE_CHECKS.length) * 100,
  );

  /* ─── render ─── */
  return (
    <div className="min-h-screen bg-[#f4f5f9] pt-24 pb-16">
      {/* ══════════════ TOP BAR ══════════════ */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/70 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left */}
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest hidden sm:block">
              PSG Alumni Network
            </p>
            <h1 className="text-lg font-black text-slate-900 leading-none">
              Dashboard
            </h1>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Send Notification */}
            <motion.button
              onClick={() => setShowSendModal(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-lg shadow-indigo-200 transition-colors"
            >
              <Send size={13} />
              <span className="hidden sm:inline">Send Notification</span>
            </motion.button>

            {/* Bell */}
            <button
              onClick={() => setShowNotifications(true)}
              className="relative w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <Bell size={16} className="text-slate-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
              )}
            </button>

            {/* Avatar */}
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold text-slate-800 leading-none">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                  Alumni Member
                </p>
              </div>
              <div
                className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarGrad} flex items-center justify-center text-white text-sm font-black shadow-md flex-shrink-0 cursor-pointer`}
                onClick={() => navigate("/alumni/profile")}
              >
                {initials || "?"}
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-red-50 hover:border-red-200 hover:text-red-500 text-xs font-bold transition-all"
            >
              <LogOut size={13} /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════ CONTENT ══════════════ */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-8 space-y-7">
        {/* ── Welcome Hero ── */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden bg-slate-900 shadow-2xl shadow-slate-900/15"
        >
          {/* BG decorations */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-indigo-600/25 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-violet-600/20 blur-2xl" />
            <div className="absolute top-0 right-0 opacity-[0.04]">
              <GraduationCap size={220} />
            </div>
            <svg
              className="absolute inset-0 w-full h-full opacity-[0.04]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="dotgrid"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="1.5" cy="1.5" r="1.5" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dotgrid)" />
            </svg>
          </div>

          <div className="relative z-10 px-7 sm:px-10 py-9 sm:py-11 flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">
                  {getGreeting()}
                </span>
                {user?.isApproved && (
                  <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Shield size={9} /> Verified
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight mb-2">
                Welcome back, {user?.firstName}! 👋
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
                You're connected to the PSG Alumni Network. Explore the
                directory, find fellow alumni, donate to the institution, and
                stay connected with your batch.
              </p>

              {/* Meta pills */}
              <div className="flex flex-wrap gap-2 mt-4">
                {user?.department && (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 bg-white/8 border border-white/10 px-3 py-1 rounded-full">
                    <BookOpen size={10} className="text-indigo-400" />{" "}
                    {user.department}
                  </span>
                )}
                {user?.batchYear && (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 bg-white/8 border border-white/10 px-3 py-1 rounded-full">
                    <Award size={10} className="text-amber-400" /> Batch of{" "}
                    {user.batchYear}
                  </span>
                )}
                {user?.city && (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 bg-white/8 border border-white/10 px-3 py-1 rounded-full">
                    <MapPin size={10} className="text-rose-400" /> {user.city}
                  </span>
                )}
                {user?.occupation && (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 bg-white/8 border border-white/10 px-3 py-1 rounded-full">
                    <Award size={10} className="text-emerald-400" />{" "}
                    {user.occupation}
                  </span>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-row sm:flex-col gap-2.5 flex-shrink-0">
              <motion.button
                onClick={() => navigate("/alumni/profile")}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-xl shadow-indigo-900/40 transition-colors"
              >
                <User size={14} /> My Profile
              </motion.button>
              <motion.button
                onClick={() => navigate("/alumni/directory")}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-sm font-bold transition-colors"
              >
                <Users size={14} /> Explore
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.38 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}
                >
                  <s.icon size={17} className={s.color} />
                </div>
                <TrendingUp size={12} className="text-slate-200 mt-1" />
              </div>
              <p className="text-2xl font-black text-slate-900 leading-none">
                {s.value}
              </p>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ── Compose Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.38 }}
          className="bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <Zap size={19} className="text-indigo-500" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Notify Your Network
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Send announcements to your batch or all alumni — admin
                  approved before publishing.
                </p>
              </div>
            </div>
            <motion.button
              onClick={() => setShowSendModal(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-lg shadow-indigo-200 transition-colors"
            >
              <Send size={13} /> Compose
            </motion.button>
          </div>
          <div className="h-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600" />
        </motion.div>

        {/* ── Quick Access Cards ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                Quick Access
              </p>
              <h2 className="text-base font-extrabold text-slate-900 mt-0.5">
                Explore Features
              </h2>
            </div>
            <Sparkles size={15} className="text-slate-300" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
            {QUICK_CARDS.map((card, i) => (
              <motion.button
                key={card.id}
                onClick={() => handleCardClick(card)}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 + i * 0.07, duration: 0.36 }}
                whileHover={{ y: -5, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 p-6 text-left overflow-hidden"
              >
                <div
                  className={`absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r ${card.accent} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
                />
                <div
                  className={`absolute -right-7 -bottom-7 w-28 h-28 rounded-full bg-gradient-to-br ${card.accent} opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-300`}
                />

                <div className="relative z-10">
                  <div
                    className={`w-11 h-11 rounded-xl ${card.lightBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <card.icon size={20} className={card.iconColor} />
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900 mb-1.5">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed mb-4">
                    {card.desc}
                  </p>
                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-extrabold ${card.iconColor}`}
                  >
                    {card.cta}
                    <ArrowUpRight
                      size={11}
                      className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    />
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* ── Bottom Row ── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.38 }}
        >
          {/* Profile completion */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  Profile Status
                </p>
                <h3 className="text-sm font-extrabold text-slate-900 mt-0.5">
                  Your Profile
                </h3>
              </div>
              <button
                onClick={() => navigate("/alumni/profile")}
                className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Edit <ArrowUpRight size={11} />
              </button>
            </div>

            {/* Progress bar */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-500">
                  Completion
                </span>
                <span className="text-xs font-extrabold text-slate-900">
                  {completionPct}%
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPct}%` }}
                  transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>

            <div className="space-y-2.5">
              {PROFILE_CHECKS.map(({ label, key }) => {
                const done = key(user);
                return (
                  <div
                    key={label}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${done ? "bg-emerald-500" : "bg-slate-200"}`}
                      />
                      <span className="text-xs font-semibold text-slate-600">
                        {label}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${done ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`}
                    >
                      {done ? "Complete" : "Pending"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick links */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="mb-5">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                More
              </p>
              <h3 className="text-sm font-extrabold text-slate-900 mt-0.5">
                Quick Links
              </h3>
            </div>
            <div className="space-y-1.5">
              {[
                {
                  label: "View Alumni Directory",
                  icon: Users,
                  path: "/alumni/directory",
                  color: "text-blue-500",
                  bg: "bg-blue-50",
                },
                {
                  label: "Explore Alumni Map",
                  icon: Map,
                  path: "/alumni/map",
                  color: "text-emerald-500",
                  bg: "bg-emerald-50",
                },
                {
                  label: "View All Campaigns",
                  icon: Megaphone,
                  path: "/campaigns",
                  color: "text-violet-500",
                  bg: "bg-violet-50",
                },
                {
                  label: "Make a Donation",
                  icon: Heart,
                  path: "/alumni/donations",
                  color: "text-rose-500",
                  bg: "bg-rose-50",
                },
                {
                  label: "Update My Profile",
                  icon: User,
                  path: "/alumni/profile",
                  color: "text-purple-500",
                  bg: "bg-purple-50",
                },
              ].map(({ label, icon: Icon, path, color, bg }) => (
                <button
                  key={label}
                  onClick={() => navigate(path)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group text-left"
                >
                  <div
                    className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon size={13} className={color} />
                  </div>
                  <span className="flex-1 text-xs font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                    {label}
                  </span>
                  <ChevronRight
                    size={13}
                    className="text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all"
                  />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ═══════ SEND NOTIFICATION MODAL ═══════ */}
      <AnimatePresence>
        {showSendModal && (
          <SendNotification
            onClose={() => setShowSendModal(false)}
            onSuccess={() => {
              setShowSendModal(false);
              refreshCount();
            }}
          />
        )}
      </AnimatePresence>

      {/* ═══════ NOTIFICATION INBOX PANEL ═══════ */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[2000] flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNotifications(false)}
          >
            <motion.div
              className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <Bell size={15} className="text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <p className="text-[10px] text-slate-400 font-medium">
                        {unreadCount} unread
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="w-8 h-8 rounded-xl border border-slate-200 bg-slate-50 hover:bg-red-50 hover:border-red-200 flex items-center justify-center transition-colors group"
                >
                  <X
                    size={14}
                    className="text-slate-500 group-hover:text-red-500 transition-colors"
                  />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <NotificationInbox />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AlumniDashboard;