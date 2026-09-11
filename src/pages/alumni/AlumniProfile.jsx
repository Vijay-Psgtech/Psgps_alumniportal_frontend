// src/pages/alumni/AlumniProfile.jsx
// ✅ Complete redesign — all JSON fields covered, tabbed view, full edit mode

import React, { useState, useEffect, useCallback, use } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit,
  Save,
  X,
  LogOut,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  MapPin,
  Briefcase,
  GraduationCap,
  User,
  Phone,
  Link2,
  Building2,
  Hash,
  Mail,
  Globe,
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  FileText,
  Camera,
  CreditCard,
  IdCard,
  Image,
  Layers,
  Calendar,
  BookOpen,
  BadgeCheck,
  ChevronRight,
  ExternalLink,
  MoreHorizontal,
  Eye,
  Building,
  Tag,
  Landmark,
} from "lucide-react";
import { alumniAPI, authAPI, API_BASE } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import ImageModal from "../../components/ImageModal";
import usePageTitle from "../../hooks/usePageTitle";

/* ─── Completion helpers ─── */
const TRACKED_FIELDS = [
  "firstName",
  "lastName",
  "phone",
  "gender",
  "occupation",
  "department",
  "batchYear",
  "rollNumber",
  "degree",
  "programmeType",
  "currentCompany",
  "jobTitle",
  "industry",
  "city",
  "country",
  "social.linkedin",
];
const getCompletion = (data) => {
  if (!data) return 0;
  const filled = TRACKED_FIELDS.filter((f) => {
    if (f.includes(".")) {
      const [parent, child] = f.split(".");
      return !!data[parent]?.[child];
    }
    return !!data[f];
  });
  return Math.round((filled.length / TRACKED_FIELDS.length) * 100);
};

/* ─── Sub-components ─── */
const Badge = ({ children, color = "indigo" }) => {
  const map = {
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    slate: "bg-slate-100 text-slate-600 border-slate-200",
    violet: "bg-violet-50 text-violet-700 border-violet-100",
    rose: "bg-rose-50 text-rose-700 border-rose-100",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${map[color]}`}
    >
      {children}
    </span>
  );
};

const InfoRow = ({ icon: Icon, label, value, href, mono = false }) => (
  <div className="flex items-start gap-3 py-3 border-b border-slate-100/80 last:border-0 group">
    <div className="mt-0.5 flex-shrink-0 w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-indigo-50 flex items-center justify-center transition-colors">
      <Icon
        size={13}
        className="text-slate-400 group-hover:text-indigo-500 transition-colors"
      />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
        {label}
      </p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
        >
          View Profile <ExternalLink size={11} />
        </a>
      ) : (
        <p
          className={`text-sm leading-relaxed break-words ${
            value
              ? `text-slate-800 font-medium ${mono ? "font-mono" : ""}`
              : "text-slate-300 italic font-normal"
          }`}
        >
          {value || "Not provided"}
        </p>
      )}
    </div>
  </div>
);

const SectionCard = ({
  title,
  icon: Icon,
  iconBg = "bg-indigo-100",
  iconColor = "text-indigo-600",
  children,
  action,
}) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white">
      <div className="flex items-center gap-2.5">
        <div
          className={`w-6 h-6 rounded-md ${iconBg} flex items-center justify-center flex-shrink-0`}
        >
          <Icon size={13} className={iconColor} />
        </div>
        <h3 className="text-xs font-extrabold text-slate-700 tracking-widest uppercase">
          {title}
        </h3>
      </div>
      {action}
    </div>
    <div className="px-5 py-1">{children}</div>
  </div>
);

const FormField = ({ label, required, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
      {label}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const EditSection = ({ title, icon: Icon, iconBg, iconColor, children }) => (
  <section>
    <div
      className={`flex items-center gap-2 mb-4 pb-3 border-b-2 border-dashed border-slate-100`}
    >
      <div
        className={`w-7 h-7 rounded-lg ${iconBg || "bg-indigo-100"} flex items-center justify-center`}
      >
        <Icon size={14} className={iconColor || "text-indigo-600"} />
      </div>
      <h3 className="text-xs font-extrabold text-slate-600 tracking-widest uppercase">
        {title}
      </h3>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
  </section>
);

const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-800 text-sm " +
  "placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 " +
  "focus:bg-white transition-all duration-200";

const selectCls = inputCls + " cursor-pointer appearance-none";

const TAB_LIST = [
  "Overview",
  "Academic",
  "Professional",
  "Social & Links",
  "Documents",
];

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
const AlumniProfile = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [activeTab, setActiveTab] = useState("Overview");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [editData, setEditData] = useState({});
  const [locationQuery, setLocationQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDocFiles, setSelectedDocFiles] = useState({});
  const [imageModal, setImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  usePageTitle(`Profile - ${profileData?.firstName ?? "Alumni"}`);

  /* ── normalise location ── */
  const normalizeAlumni = (alumni) => {
    if (!alumni) return alumni;
    let locString = "";
    let coords = [];
    if (alumni.location) {
      if (typeof alumni.location === "object") {
        coords = Array.isArray(alumni.location.coordinates)
          ? alumni.location.coordinates
          : alumni.coordinates || [];
        locString =
          alumni.location.display_name ||
          (alumni.city && alumni.country
            ? `${alumni.city}, ${alumni.country}`
            : alumni.city || alumni.country || "");
      } else {
        locString = alumni.location;
        coords = alumni.coordinates || [];
      }
    } else {
      locString =
        alumni.city && alumni.country
          ? `${alumni.city}, ${alumni.country}`
          : alumni.city || alumni.country || "";
      coords = alumni.coordinates || [];
    }
    return { ...alumni, location: locString, coordinates: coords };
  };

  /* ── location autocomplete ── */
  useEffect(() => {
    const t = setTimeout(() => {
      if (locationQuery.length > 2) {
        fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${locationQuery}`,
        )
          .then((r) => r.json())
          .then((d) => setSuggestions(d));
      }
    }, 300);
    return () => clearTimeout(t);
  }, [locationQuery]);

  const handleSelect = (place) => {
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);
    const city =
      place.address?.city ||
      place.address?.state_district ||
      place.address?.town ||
      place.address?.village ||
      "";
    const country = place.address?.country || "";
    setEditData((prev) => ({
      ...prev,
      city: city || place.display_name,
      country: country || place.display_name.split(",").slice(-1)[0].trim(),
      fullAddress: place.display_name,
      coordinates: [lon, lat],
    }));
    setLocationQuery(place.display_name);
    setSuggestions([]);
  };

  const extractAlumni = (data) =>
    data?.alumni ?? data?.user ?? data?.data ?? data ?? null;

  /* ── load profile ── */
  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await authAPI.getProfile();
      const alumni = extractAlumni(response.data);
      if (!alumni) {
        setError("Profile data not found. Please contact support.");
        return;
      }
      const normalized = normalizeAlumni(alumni);
      setProfileData(normalized);
      setEditData(normalized);
      setLocationQuery(normalized.location || "");
    } catch (err) {
      if (err.response?.status === 401) navigate("/alumni/login");
      else
        setError(
          err.response?.data?.message ||
            "Failed to load profile. Please try again.",
        );
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  /* ── handlers ── */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === "location") {
      setLocationQuery(value);
      setEditData((prev) => ({ ...prev, location: value, coordinates: [] }));
    } else if (name.startsWith("social.")) {
      const key = name.split(".")[1];
      setEditData((prev) => ({
        ...prev,
        social: { ...(prev.social || {}), [key]: value },
      }));
    } else if (name.startsWith("officeAddress.")) {
      const key = name.split(".")[1];
      setEditData((prev) => ({
        ...prev,
        officeAddress: { ...(prev.officeAddress || {}), [key]: value },
      }));
    } else {
      setEditData((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const handleSaveProfile = useCallback(async () => {
    if (locationQuery && !editData.coordinates?.length) {
      setError("Please select a location from the suggestions.");
      return;
    }
    try {
      setError("");
      setSuccess("");
      const payload = { ...editData, location: locationQuery };
      const formData = new FormData();
      const flatten = (obj, prefix = "") => {
        Object.keys(obj).forEach((key) => {
          const val = obj[key];
          const fullKey = prefix ? `${prefix}.${key}` : key;
          if (key === "coordinates" && Array.isArray(val)) {
            val.forEach((c) => formData.append(key, c));
          } else if (
            val !== null &&
            val !== undefined &&
            typeof val === "object" &&
            !Array.isArray(val)
          ) {
            flatten(val, fullKey);
          } else if (val !== null && val !== undefined) {
            formData.append(fullKey, val);
          }
        });
      };
      flatten(payload);
      if (selectedFile) formData.append("profileImage", selectedFile);

      // Append each document file under its own field key (e.g. "studentPhoto", "idCard", …)
      Object.entries(selectedDocFiles).forEach(([key, file]) => {
        if (file) formData.append(key, file);
      });
      const response = await alumniAPI.updateProfile(profileData._id, formData);
      const updated = normalizeAlumni(extractAlumni(response.data) || {});
      setProfileData(updated || payload);
      setIsEditing(false);
      setSelectedFile(null);
      setSelectedDocFiles({});
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save profile");
    }
  }, [
    profileData?._id,
    editData,
    locationQuery,
    selectedFile,
    selectedDocFiles,
  ]);

  const handleCancel = useCallback(() => {
    setEditData(profileData);
    setLocationQuery(profileData?.location || "");
    setIsEditing(false);
    setSelectedFile(null);
    setSelectedDocFiles({});
    setError("");
  }, [profileData]);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/");
  }, [logout, navigate]);

  /* ═══ LOADING ═══ */
  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-indigo-500 animate-spin" />
        <p className="text-slate-400 text-sm font-medium tracking-wide">
          Loading your profile…
        </p>
      </div>
    );

  /* ═══ ERROR ═══ */
  if (!profileData)
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-xl border border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
            <AlertCircle size={26} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Couldn't Load Profile
          </h2>
          <p className="text-slate-500 text-sm mb-7 leading-relaxed">
            {error || "Something went wrong."}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={loadProfile}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-all"
            >
              <RefreshCw size={14} /> Try Again
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </div>
    );

  const initials =
    `${profileData.firstName?.charAt(0) ?? ""}${profileData.lastName?.charAt(0) ?? ""}`.toUpperCase();
  const completion = getCompletion(profileData);
  const social = profileData.social || {};
  const officeAddress = profileData.officeAddress || {};
  const files = profileData.files || {};
  const editSocial = editData.social || {};
  const editOfficeAddress = editData.officeAddress || {};

  const fileItems = [
    { key: "studentPhoto", label: "Student Photo", icon: Camera },
    { key: "currentPhoto", label: "Current Photo", icon: Camera },
    { key: "idCard", label: "ID Card", icon: IdCard },
    { key: "businessCard", label: "Business Card", icon: CreditCard },
    { key: "entrepreneurPoster", label: "Entrepreneur Poster", icon: Image },
  ];

  /* ═══ MAIN UI ═══ */
  return (
    <>
      <div className="min-h-screen bg-[#f6f7fb] pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* ── Top Bar ── */}
          <motion.div
            className="flex flex-wrap items-center justify-between gap-4 mb-6"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div>
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">
                Alumni Portal
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                My Profile
              </h1>
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              {!isEditing && (
                <motion.button
                  onClick={() => setIsEditing(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors"
                >
                  <Edit size={14} /> Edit Profile
                </motion.button>
              )}
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 bg-white text-red-500 text-sm font-bold hover:bg-red-50 transition-colors"
              >
                <LogOut size={14} /> Logout
              </motion.button>
            </div>
          </motion.div>

          {/* ── Alerts ── */}
          <AnimatePresence>
            {error && (
              <motion.div
                key="error"
                className="flex items-center gap-3 px-5 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium mb-4"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <AlertCircle size={16} className="flex-shrink-0" /> {error}
                <button
                  onClick={() => setError("")}
                  className="ml-auto text-red-400 hover:text-red-600"
                >
                  <X size={14} />
                </button>
              </motion.div>
            )}
            {success && (
              <motion.div
                key="success"
                className="flex items-center gap-3 px-5 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium mb-4"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <CheckCircle size={16} className="flex-shrink-0" /> {success}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Hero Card ── */}
          <motion.div
            className="relative bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
          >
            {/* Accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600" />

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 px-6 sm:px-8 pt-6 pb-7">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl font-extrabold shadow-lg shadow-indigo-200 select-none overflow-hidden">
                  {profileData.files?.currentPhoto ? (
                    <img
                      src={`${API_BASE}/uploads/${profileData.files?.currentPhoto}`}
                      alt="Profile"
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => {
                        setSelectedImage(profileData.files?.currentPhoto);
                        setImageModal(true);
                      }}
                    />
                  ) : (
                    initials || "?"
                  )}
                </div>
                {profileData.isApproved && (
                  <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-sm">
                    <CheckCircle size={11} className="text-white" />
                  </div>
                )}
              </div>

              {/* Name & Meta */}
              <div className="flex-1 text-center sm:text-left min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    {profileData.firstName} {profileData.lastName}
                  </h2>
                  {profileData.gender && (
                    <span className="text-xs text-slate-400 font-medium">
                      ({profileData.gender})
                    </span>
                  )}
                </div>

                <p className="text-slate-500 text-sm flex items-center justify-center sm:justify-start gap-1.5 mb-3">
                  <Mail size={12} className="text-slate-400" />{" "}
                  {profileData.email}
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  {profileData.isApproved && (
                    <Badge color="emerald">
                      <CheckCircle size={10} /> Verified Alumni
                    </Badge>
                  )}
                  {profileData.alumniId && (
                    <Badge color="slate">
                      <Hash size={10} /> {profileData.alumniId}
                    </Badge>
                  )}
                  {profileData.department && (
                    <Badge color="indigo">
                      <GraduationCap size={10} /> {profileData.department}
                    </Badge>
                  )}
                  {profileData.programmeType && (
                    <Badge color="violet">
                      <Layers size={10} /> {profileData.programmeType}
                    </Badge>
                  )}

                  {profileData.jobTitle && profileData.currentCompany && (
                    <Badge color="amber">
                      <Briefcase size={10} /> {profileData.jobTitle} @{" "}
                      {profileData.currentCompany}
                    </Badge>
                  )}
                  {profileData.occupation && !profileData.jobTitle && (
                    <Badge color="amber">
                      <Briefcase size={10} /> {profileData.occupation}
                    </Badge>
                  )}
                  {profileData.city && (
                    <Badge color="rose">
                      <MapPin size={10} /> {profileData.city}
                      {profileData.country ? `, ${profileData.country}` : ""}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Completion Meter */}
              <div className="flex-shrink-0 text-center hidden md:flex flex-col items-center gap-1">
                <div className="relative w-14 h-14">
                  <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                    <circle
                      cx="28"
                      cy="28"
                      r="22"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="5"
                    />
                    <circle
                      cx="28"
                      cy="28"
                      r="22"
                      fill="none"
                      stroke="url(#prog)"
                      strokeWidth="5"
                      strokeDasharray={`${2 * Math.PI * 22}`}
                      strokeDashoffset={`${2 * Math.PI * 22 * (1 - completion / 100)}`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient
                        id="prog"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a78bfa" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-extrabold text-slate-700">
                    {completion}%
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">
                  Complete
                </p>
              </div>
            </div>
          </motion.div>

          {/* ═══════════ EDIT MODE ═══════════ */}
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="edit"
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-7">
                  <h3 className="text-base font-extrabold text-slate-800">
                    Edit Profile
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">
                    Fields marked <span className="text-red-400">*</span> are
                    recommended
                  </span>
                </div>

                <div className="flex flex-col gap-8">
                  {/* ── Personal ── */}
                  <EditSection
                    title="Personal Information"
                    icon={User}
                    iconBg="bg-indigo-100"
                    iconColor="text-indigo-600"
                  >
                    <FormField label="First Name" required>
                      <input
                        type="text"
                        name="firstName"
                        className={inputCls}
                        value={editData.firstName || ""}
                        onChange={handleChange}
                        placeholder="First name"
                      />
                    </FormField>
                    <FormField label="Last Name" required>
                      <input
                        type="text"
                        name="lastName"
                        className={inputCls}
                        value={editData.lastName || ""}
                        onChange={handleChange}
                        placeholder="Last name"
                      />
                    </FormField>
                    <FormField label="Phone Number" required>
                      <input
                        type="tel"
                        name="phone"
                        className={inputCls}
                        value={editData.phone || ""}
                        onChange={handleChange}
                        placeholder="e.g. 9876543210"
                      />
                    </FormField>
                    <FormField label="Gender">
                      <select
                        name="gender"
                        className={selectCls}
                        value={editData.gender || ""}
                        onChange={handleChange}
                      >
                        <option value="">Select gender</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Non-binary</option>
                        <option>Prefer not to say</option>
                      </select>
                    </FormField>
                    <FormField label="Occupation Status">
                      <select
                        name="occupation"
                        className={selectCls}
                        value={editData.occupation || ""}
                        onChange={handleChange}
                      >
                        <option value="">Select status</option>
                        <option>Employed</option>
                        <option>Self-Employed</option>
                        <option>Entrepreneur</option>
                        <option>Freelancer</option>
                        <option>Higher Studies</option>
                        <option>Unemployed</option>
                      </select>
                    </FormField>
                    <FormField label="Roll Number">
                      <input
                        type="text"
                        name="rollNumber"
                        className={inputCls}
                        value={editData.rollNumber || ""}
                        onChange={handleChange}
                        placeholder="e.g. 12CA012"
                      />
                    </FormField>
                    {/* <FormField label="Profile Photo">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all"
                      />
                    </FormField> */}
                  </EditSection>

                  {/* ── Academic ── */}
                  <EditSection
                    title="Academic Information"
                    icon={GraduationCap}
                    iconBg="bg-violet-100"
                    iconColor="text-violet-600"
                  >
                    <FormField label="Department" required>
                      <input
                        type="text"
                        name="department"
                        className={inputCls}
                        value={editData.department || ""}
                        onChange={handleChange}
                        placeholder="e.g. B.Com"
                        disabled
                      />
                    </FormField>
                    <FormField label="Programme Type">
                      <select
                        name="programmeType"
                        className={selectCls}
                        value={editData.programmeType || ""}
                        onChange={handleChange}
                        disabled
                      >
                        <option value="">Select type</option>
                        <option value="UG">UG</option>
                        <option value="PG">PG</option>
                        <option value="PhD">PhD</option>
                        <option value="Diploma">Diploma</option>
                      </select>
                    </FormField>
                    <FormField label="Degree">
                      <input
                        type="text"
                        name="degree"
                        className={inputCls}
                        value={editData.degree || ""}
                        onChange={handleChange}
                        placeholder="e.g. Bcom CA"
                        disabled
                      />
                    </FormField>

                    <FormField label="Study Start Year">
                      <input
                        type="number"
                        name="studyStartYear"
                        className={inputCls}
                        value={editData.studyStartYear || ""}
                        onChange={handleChange}
                        placeholder="e.g. 2012"
                        min="1980"
                        max="2099"
                        disabled
                      />
                    </FormField>
                    <FormField label="Study End Year">
                      <input
                        type="number"
                        name="studyEndYear"
                        className={inputCls}
                        value={editData.studyEndYear || ""}
                        onChange={handleChange}
                        placeholder="e.g. 2015"
                        min="1980"
                        max="2099"
                        disabled
                      />
                    </FormField>
                    <FormField label="Batch Year" required>
                      <input
                        type="number"
                        name="batchYear"
                        className={inputCls}
                        value={editData.batchYear || ""}
                        onChange={handleChange}
                        placeholder="e.g. 2015"
                        disabled
                      />
                    </FormField>
                  </EditSection>

                  {/* ── Professional ── */}
                  <EditSection
                    title="Professional Information"
                    icon={Briefcase}
                    iconBg="bg-amber-100"
                    iconColor="text-amber-600"
                  >
                    <FormField label="Current Company">
                      <input
                        type="text"
                        name="currentCompany"
                        className={inputCls}
                        value={editData.currentCompany || ""}
                        onChange={handleChange}
                        placeholder="e.g. Google"
                      />
                    </FormField>
                    <FormField label="Job Title">
                      <input
                        type="text"
                        name="jobTitle"
                        className={inputCls}
                        value={editData.jobTitle || ""}
                        onChange={handleChange}
                        placeholder="e.g. Software Engineer"
                      />
                    </FormField>
                    <FormField label="Industry">
                      <input
                        type="text"
                        name="industry"
                        className={inputCls}
                        value={editData.industry || ""}
                        onChange={handleChange}
                        placeholder="e.g. Information Technology"
                      />
                    </FormField>
                    <FormField label="Office Contact">
                      <input
                        type="tel"
                        name="officeContact"
                        className={inputCls}
                        value={editData.officeContact || ""}
                        onChange={handleChange}
                        placeholder="Office phone number"
                      />
                    </FormField>
                  </EditSection>

                  {/* ── Office Address ── */}
                  <EditSection
                    title="Office Address"
                    icon={Building}
                    iconBg="bg-sky-100"
                    iconColor="text-sky-600"
                  >
                    <FormField label="Address Line 1">
                      <input
                        type="text"
                        name="officeAddress.line1"
                        className={inputCls}
                        value={editOfficeAddress.line1 || ""}
                        onChange={handleChange}
                        placeholder="Building / Street"
                      />
                    </FormField>
                    <FormField label="Address Line 2">
                      <input
                        type="text"
                        name="officeAddress.line2"
                        className={inputCls}
                        value={editOfficeAddress.line2 || ""}
                        onChange={handleChange}
                        placeholder="Area / Locality"
                      />
                    </FormField>
                    <FormField label="City">
                      <input
                        type="text"
                        name="officeAddress.city"
                        className={inputCls}
                        value={editOfficeAddress.city || ""}
                        onChange={handleChange}
                        placeholder="City"
                      />
                    </FormField>
                    <FormField label="State">
                      <input
                        type="text"
                        name="officeAddress.state"
                        className={inputCls}
                        value={editOfficeAddress.state || ""}
                        onChange={handleChange}
                        placeholder="State"
                      />
                    </FormField>
                    <FormField label="Pincode">
                      <input
                        type="text"
                        name="officeAddress.pincode"
                        className={inputCls}
                        value={editOfficeAddress.pincode || ""}
                        onChange={handleChange}
                        placeholder="e.g. 641001"
                      />
                    </FormField>
                    <FormField label="Country">
                      <input
                        type="text"
                        name="officeAddress.country"
                        className={inputCls}
                        value={editOfficeAddress.country || ""}
                        onChange={handleChange}
                        placeholder="e.g. India"
                      />
                    </FormField>
                  </EditSection>

                  {/* ── Location ── */}
                  <EditSection
                    title="Current Location"
                    icon={MapPin}
                    iconBg="bg-emerald-100"
                    iconColor="text-emerald-600"
                  >
                    <div className="sm:col-span-2 relative">
                      <FormField label="Search Location" required>
                        <input
                          type="text"
                          name="location"
                          className={inputCls}
                          value={locationQuery}
                          onChange={handleChange}
                          placeholder="Start typing your city…"
                        />
                      </FormField>
                      {suggestions.length > 0 && (
                        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-20 max-h-52 overflow-y-auto">
                          {suggestions.map((place) => (
                            <button
                              key={place.place_id}
                              type="button"
                              onClick={() => handleSelect(place)}
                              className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 border-b border-slate-50 last:border-0 transition-colors font-medium"
                            >
                              📍 {place.display_name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {editData.city && (
                      <>
                        <FormField label="City (auto-filled)">
                          <input
                            type="text"
                            name="city"
                            className={inputCls}
                            value={editData.city || ""}
                            onChange={handleChange}
                          />
                        </FormField>
                        <FormField label="Country (auto-filled)">
                          <input
                            type="text"
                            name="country"
                            className={inputCls}
                            value={editData.country || ""}
                            onChange={handleChange}
                          />
                        </FormField>
                      </>
                    )}
                  </EditSection>

                  {/* ── Social ── */}
                  <EditSection
                    title="Social Links"
                    icon={Link2}
                    iconBg="bg-pink-100"
                    iconColor="text-pink-600"
                  >
                    {[
                      {
                        name: "social.linkedin",
                        label: "LinkedIn URL",
                        placeholder: "https://linkedin.com/in/username",
                      },
                      {
                        name: "social.twitter",
                        label: "Twitter / X URL",
                        placeholder: "https://twitter.com/username",
                      },
                      {
                        name: "social.instagram",
                        label: "Instagram URL",
                        placeholder: "https://instagram.com/username",
                      },
                      {
                        name: "social.facebook",
                        label: "Facebook URL",
                        placeholder: "https://facebook.com/username",
                      },
                      {
                        name: "social.website",
                        label: "Personal Website",
                        placeholder: "https://yoursite.com",
                      },
                    ].map(({ name, label, placeholder }) => (
                      <FormField key={name} label={label}>
                        <input
                          type="url"
                          name={name}
                          className={inputCls}
                          value={editSocial[name.split(".")[1]] || ""}
                          onChange={handleChange}
                          placeholder={placeholder}
                        />
                      </FormField>
                    ))}
                  </EditSection>

                  {/* ── Documents ── */}
                  <section>
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-dashed border-slate-100">
                      <div className="w-7 h-7 rounded-lg bg-teal-100 flex items-center justify-center">
                        <FileText size={14} className="text-teal-600" />
                      </div>
                      <h3 className="text-xs font-extrabold text-slate-600 tracking-widest uppercase">
                        Documents & Photos
                      </h3>
                      <span className="ml-auto text-[10px] text-slate-400 font-medium">
                        JPG, PNG accepted
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        {
                          key: "studentPhoto",
                          label: "Student Photo",
                          icon: Camera,
                          hint: "Your college-time photo",
                        },
                        {
                          key: "currentPhoto",
                          label: "Current Photo",
                          icon: Camera,
                          hint: "Recent photo of yourself",
                        },
                        {
                          key: "idCard",
                          label: "ID Card",
                          icon: IdCard,
                          hint: "College or govt ID card",
                        },
                        {
                          key: "businessCard",
                          label: "Business Card",
                          icon: CreditCard,
                          hint: "Professional business card",
                        },
                        {
                          key: "entrepreneurPoster",
                          label: "Entrepreneur Poster",
                          icon: Image,
                          hint: "Business / startup poster",
                        },
                      ].map(({ key, label, icon: FIcon, hint }) => {
                        const existing = files[key];
                        const staged = selectedDocFiles[key];
                        const previewUrl = staged
                          ? URL.createObjectURL(staged)
                          : existing
                            ? `${API_BASE}/uploads/${existing}`
                            : null;
                        return (
                          <div key={key} className="flex flex-col gap-2">
                            {/* Preview box */}
                            <div className="relative w-full h-36 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden group">
                              {previewUrl ? (
                                <>
                                  <img
                                    src={previewUrl}
                                    alt={label}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                    }}
                                  />
                                  {/* replace overlay */}
                                  <label
                                    htmlFor={`doc-${key}`}
                                    className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                                  >
                                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 text-xs font-bold text-slate-700">
                                      <Camera size={12} /> Replace
                                    </span>
                                  </label>
                                  {/* staged badge */}
                                  {staged && (
                                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-extrabold tracking-wide">
                                      NEW
                                    </span>
                                  )}
                                  {/* clear staged */}
                                  {staged && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setSelectedDocFiles((p) => {
                                          const n = { ...p };
                                          delete n[key];
                                          return n;
                                        })
                                      }
                                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                                    >
                                      <X size={11} />
                                    </button>
                                  )}
                                </>
                              ) : (
                                <label
                                  htmlFor={`doc-${key}`}
                                  className="w-full h-full flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-100 transition-colors"
                                >
                                  <div className="w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center">
                                    <FIcon
                                      size={18}
                                      className="text-slate-400"
                                    />
                                  </div>
                                  <span className="text-[11px] text-slate-400 font-semibold">
                                    Click to upload
                                  </span>
                                </label>
                              )}
                              <input
                                id={`doc-${key}`}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const f = e.target.files[0];
                                  if (f)
                                    setSelectedDocFiles((p) => ({
                                      ...p,
                                      [key]: f,
                                    }));
                                  e.target.value = "";
                                }}
                              />
                            </div>
                            {/* Label row */}
                            <div className="flex items-center justify-between px-0.5">
                              <div>
                                <p className="text-xs font-bold text-slate-700">
                                  {label}
                                </p>
                                <p className="text-[10px] text-slate-400">
                                  {hint}
                                </p>
                              </div>
                              <span
                                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                  staged
                                    ? "bg-amber-100 text-amber-600"
                                    : existing
                                      ? "bg-emerald-100 text-emerald-600"
                                      : "bg-slate-100 text-slate-400"
                                }`}
                              >
                                {staged
                                  ? "Pending"
                                  : existing
                                    ? "Uploaded"
                                    : "Empty"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* ── Actions ── */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 text-white text-sm font-extrabold hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-200"
                    >
                      <Save size={15} /> Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-sm font-bold hover:bg-slate-100 active:scale-[0.98] transition-all"
                    >
                      <X size={15} /> Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* ═══════════ VIEW MODE ═══════════ */
              <motion.div
                key="view"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Tab Nav */}
                <div className="flex items-center gap-1 bg-white border border-slate-100 rounded-2xl p-1 mb-5 overflow-x-auto shadow-sm">
                  {TAB_LIST.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-extrabold tracking-wide transition-all ${
                        activeTab === tab
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                          : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* ── Tab Content ── */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* ─── OVERVIEW TAB ─── */}
                    {activeTab === "Overview" && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <SectionCard title="Personal Details" icon={User}>
                          <InfoRow
                            icon={Mail}
                            label="Email Address"
                            value={profileData.email}
                          />
                          <InfoRow
                            icon={Phone}
                            label="Phone"
                            value={profileData.phone}
                          />
                          <InfoRow
                            icon={User}
                            label="Gender"
                            value={profileData.gender}
                          />
                          <InfoRow
                            icon={Briefcase}
                            label="Occupation Status"
                            value={profileData.occupation}
                          />
                          <InfoRow
                            icon={Hash}
                            label="Alumni ID"
                            value={profileData.alumniId}
                            mono
                          />
                        </SectionCard>

                        <SectionCard
                          title="Current Location"
                          icon={MapPin}
                          iconBg="bg-emerald-100"
                          iconColor="text-emerald-600"
                        >
                          <InfoRow
                            icon={MapPin}
                            label="City"
                            value={profileData.city}
                          />
                          <InfoRow
                            icon={Globe}
                            label="Country"
                            value={profileData.country}
                          />
                          <InfoRow
                            icon={MapPin}
                            label="Full Address"
                            value={
                              profileData.fullAddress || profileData.location
                            }
                          />
                          {profileData.coordinates?.length === 2 && (
                            <InfoRow
                              icon={MapPin}
                              label="Coordinates"
                              value={`${profileData.coordinates[1].toFixed(5)}, ${profileData.coordinates[0].toFixed(5)}`}
                              mono
                            />
                          )}
                        </SectionCard>
                      </div>
                    )}

                    {/* ─── ACADEMIC TAB ─── */}
                    {activeTab === "Academic" && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <SectionCard
                          title="Academic Information"
                          icon={GraduationCap}
                          iconBg="bg-violet-100"
                          iconColor="text-violet-600"
                        >
                          <InfoRow
                            icon={BookOpen}
                            label="Department"
                            value={profileData.department}
                          />
                          <InfoRow
                            icon={Layers}
                            label="Programme Type"
                            value={profileData.programmeType}
                          />
                          <InfoRow
                            icon={GraduationCap}
                            label="Degree"
                            value={profileData.degree}
                          />
                          <InfoRow
                            icon={Hash}
                            label="Roll Number"
                            value={profileData.rollNumber}
                            mono
                          />
                        </SectionCard>

                        <SectionCard
                          title="Study Period"
                          icon={Calendar}
                          iconBg="bg-sky-100"
                          iconColor="text-sky-600"
                        >
                          <InfoRow
                            icon={Calendar}
                            label="Study Start Year"
                            value={profileData.studyStartYear}
                          />
                          <InfoRow
                            icon={Calendar}
                            label="Study End Year"
                            value={profileData.studyEndYear}
                          />
                          <InfoRow
                            icon={Hash}
                            label="Batch Year"
                            value={profileData.batchYear}
                          />
                        </SectionCard>
                      </div>
                    )}

                    {/* ─── PROFESSIONAL TAB ─── */}
                    {activeTab === "Professional" && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <SectionCard
                          title="Current Role"
                          icon={Briefcase}
                          iconBg="bg-amber-100"
                          iconColor="text-amber-600"
                        >
                          <InfoRow
                            icon={Building2}
                            label="Company"
                            value={profileData.currentCompany}
                          />
                          <InfoRow
                            icon={Briefcase}
                            label="Job Title"
                            value={profileData.jobTitle}
                          />
                          <InfoRow
                            icon={Tag}
                            label="Industry"
                            value={profileData.industry}
                          />
                          <InfoRow
                            icon={Phone}
                            label="Office Contact"
                            value={profileData.officeContact}
                          />
                        </SectionCard>

                        <SectionCard
                          title="Office Address"
                          icon={Building}
                          iconBg="bg-sky-100"
                          iconColor="text-sky-600"
                        >
                          {officeAddress.line1 || officeAddress.city ? (
                            <>
                              <InfoRow
                                icon={MapPin}
                                label="Address Line 1"
                                value={officeAddress.line1}
                              />
                              <InfoRow
                                icon={MapPin}
                                label="Address Line 2"
                                value={officeAddress.line2}
                              />
                              <InfoRow
                                icon={MapPin}
                                label="City"
                                value={officeAddress.city}
                              />
                              <InfoRow
                                icon={MapPin}
                                label="State"
                                value={officeAddress.state}
                              />
                              <InfoRow
                                icon={Hash}
                                label="Pincode"
                                value={officeAddress.pincode}
                                mono
                              />
                              <InfoRow
                                icon={Globe}
                                label="Country"
                                value={officeAddress.country}
                              />
                            </>
                          ) : (
                            <p className="py-6 text-center text-sm text-slate-300 italic">
                              No office address provided
                            </p>
                          )}
                        </SectionCard>
                      </div>
                    )}

                    {/* ─── SOCIAL TAB ─── */}
                    {activeTab === "Social & Links" && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <SectionCard
                          title="Social Profiles"
                          icon={Link2}
                          iconBg="bg-pink-100"
                          iconColor="text-pink-600"
                        >
                          <InfoRow
                            icon={Linkedin}
                            label="LinkedIn"
                            value={social.linkedin ? "View" : null}
                            href={social.linkedin || undefined}
                          />
                          <InfoRow
                            icon={Twitter}
                            label="Twitter / X"
                            value={social.twitter ? "View" : null}
                            href={social.twitter || undefined}
                          />
                          <InfoRow
                            icon={Instagram}
                            label="Instagram"
                            value={social.instagram ? "View" : null}
                            href={social.instagram || undefined}
                          />
                          <InfoRow
                            icon={Facebook}
                            label="Facebook"
                            value={social.facebook ? "View" : null}
                            href={social.facebook || undefined}
                          />
                          <InfoRow
                            icon={Globe}
                            label="Website"
                            value={social.website ? "Visit Site" : null}
                            href={social.website || undefined}
                          />
                        </SectionCard>

                        <SectionCard
                          title="Quick Connect"
                          icon={BadgeCheck}
                          iconBg="bg-indigo-100"
                          iconColor="text-indigo-600"
                        >
                          <div className="py-3 space-y-3">
                            {[
                              {
                                key: "linkedin",
                                label: "LinkedIn",
                                icon: Linkedin,
                                color: "bg-blue-600",
                              },
                              {
                                key: "twitter",
                                label: "Twitter",
                                icon: Twitter,
                                color: "bg-sky-500",
                              },
                              {
                                key: "instagram",
                                label: "Instagram",
                                icon: Instagram,
                                color: "bg-pink-500",
                              },
                              {
                                key: "facebook",
                                label: "Facebook",
                                icon: Facebook,
                                color: "bg-indigo-600",
                              },
                              {
                                key: "website",
                                label: "Website",
                                icon: Globe,
                                color: "bg-emerald-600",
                              },
                            ]
                              .filter(({ key }) => social[key])
                              .map(({ key, label, icon: Icon, color }) => (
                                <a
                                  key={key}
                                  href={social[key]}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-white text-sm font-semibold ${color} hover:opacity-90 transition-opacity`}
                                >
                                  <Icon size={15} /> {label}{" "}
                                  <ChevronRight size={14} className="ml-auto" />
                                </a>
                              ))}
                            {!Object.values(social).some(Boolean) && (
                              <p className="text-center text-sm text-slate-300 italic py-4">
                                No social links added yet
                              </p>
                            )}
                          </div>
                        </SectionCard>
                      </div>
                    )}

                    {/* ─── DOCUMENTS TAB ─── */}
                    {activeTab === "Documents" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {fileItems.map(({ key, label, icon: FIcon }) => {
                          const fileName = files[key];
                          return (
                            <div
                              key={key}
                              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                            >
                              <div className="h-32 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center relative">
                                {fileName ? (
                                  <img
                                    src={`${API_BASE}/uploads/${fileName}`}
                                    alt={label}
                                    className="w-full h-full object-cover cursor-pointer"
                                    onClick={() => {
                                      setSelectedImage(`uploads/${fileName}`);
                                      setImageModal(true);
                                    }}
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                      e.target.nextSibling.style.display =
                                        "flex";
                                    }}
                                  />
                                ) : null}
                                <div
                                  className={`${fileName ? "hidden" : "flex"} flex-col items-center gap-2 text-slate-300`}
                                >
                                  <FIcon size={28} />
                                  <span className="text-xs font-medium">
                                    Not uploaded
                                  </span>
                                </div>
                                {fileName && (
                                  <button
                                    onClick={() => {
                                      setSelectedImage(`uploads/${fileName}`);
                                      setImageModal(true);
                                    }}
                                    className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors"
                                  >
                                    <Eye size={12} className="text-white" />
                                  </button>
                                )}
                              </div>
                              <div className="px-4 py-3 flex items-center justify-between">
                                <div>
                                  <p className="text-xs font-bold text-slate-700">
                                    {label}
                                  </p>
                                  <p
                                    className={`text-[10px] font-medium mt-0.5 ${fileName ? "text-emerald-500" : "text-slate-300"}`}
                                  >
                                    {fileName ? "Uploaded" : "Not available"}
                                  </p>
                                </div>
                                <div
                                  className={`w-2 h-2 rounded-full ${fileName ? "bg-emerald-400" : "bg-slate-200"}`}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <ImageModal
        image={selectedImage}
        isOpen={imageModal}
        onClose={() => setImageModal(false)}
      />
    </>
  );
};

export default AlumniProfile;
