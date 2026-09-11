// src/pages/alumni/AlumniDirectory.jsx
// ✅ Batch-first directory — Admin sees all, Alumni sees own batch full / others limited

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  GraduationCap,
  ChevronRight,
  ArrowLeft,
  Search,
  MapPin,
  Briefcase,
  Building2,
  Phone,
  Mail,
  Globe,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Lock,
  CheckCircle,
  Filter,
  X,
  SlidersHorizontal,
  Calendar,
  BookOpen,
  Hash,
  ExternalLink,
  Eye,
  EyeOff,
  LayoutGrid,
  List,
  ChevronDown,
  Layers,
} from "lucide-react";
import { alumniAPI, API_BASE } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import AlumniDetailModal from "./AlumniDetailModal";
import usePageTitle from "../../hooks/usePageTitle";

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
const getInitials = (first = "", last = "") =>
  `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || "?";

const avatarGradients = [
  "from-rose-400 to-orange-400",
  "from-sky-400 to-blue-500",
  "from-emerald-400 to-teal-500",
  "from-violet-400 to-purple-500",
  "from-amber-400 to-orange-500",
  "from-pink-400 to-rose-500",
  "from-cyan-400 to-sky-500",
  "from-indigo-400 to-blue-500",
];
const pickGradient = (str = "") =>
  avatarGradients[str.charCodeAt(0) % avatarGradients.length];

const BATCH_PALETTES = [
  {
    bg: "from-slate-800 to-slate-900",
    accent: "border-amber-400",
    dot: "bg-amber-400",
    text: "text-amber-300",
  },
  {
    bg: "from-blue-800 to-blue-950",
    accent: "border-sky-400",
    dot: "bg-sky-400",
    text: "text-sky-300",
  },
  {
    bg: "from-emerald-800 to-emerald-950",
    accent: "border-emerald-400",
    dot: "bg-emerald-400",
    text: "text-emerald-300",
  },
  {
    bg: "from-violet-800 to-violet-950",
    accent: "border-violet-400",
    dot: "bg-violet-400",
    text: "text-violet-300",
  },
  {
    bg: "from-rose-800 to-rose-950",
    accent: "border-rose-400",
    dot: "bg-rose-400",
    text: "text-rose-300",
  },
  {
    bg: "from-amber-800 to-amber-950",
    accent: "border-amber-400",
    dot: "bg-amber-400",
    text: "text-amber-300",
  },
];

/* ─────────────────────────────────────────
   Privacy — what a non-admin alumni can see
───────────────────────────────────────── */
const canSeeFullDetails = (viewer, subject) => {
  if (!viewer || !subject) return false;
  if (viewer.role === "admin" || viewer.role === "superadmin") return true;
  return String(viewer.batchYear) === String(subject.batchYear);
};

/* ─────────────────────────────────────────
   Sub-components
───────────────────────────────────────── */

// Pill badge
const Pill = ({ children, color = "slate" }) => {
  const map = {
    slate: "bg-slate-100 text-slate-600",
    blue: "bg-blue-50 text-blue-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
    violet: "bg-violet-50 text-violet-700",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${map[color]}`}
    >
      {children}
    </span>
  );
};

// Social icon link
const SocialLink = ({ href, icon: Icon, label }) => {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors group"
    >
      <Icon
        size={13}
        className="text-slate-500 group-hover:text-slate-800 transition-colors"
      />
    </a>
  );
};

// Info chip row inside card
const InfoChip = ({ icon: Icon, value, muted = false }) => {
  if (!value) return null;
  return (
    <div
      className={`flex items-center gap-1.5 ${muted ? "text-slate-400" : "text-slate-600"}`}
    >
      <Icon size={11} className="flex-shrink-0" />
      <span className="text-xs font-medium truncate">{value}</span>
    </div>
  );
};

/* ─── Batch Year Card ─── */
const BatchCard = ({ year, count, palette, isMine, onClick, index }) => (
  <motion.button
    onClick={onClick}
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.06, duration: 0.4, ease: "easeOut" }}
    whileHover={{ y: -4, scale: 1.02 }}
    whileTap={{ scale: 0.97 }}
    className={`relative w-full text-left bg-gradient-to-br ${palette.bg} rounded-2xl p-6 overflow-hidden border-l-4 ${palette.accent} shadow-lg hover:shadow-xl transition-shadow`}
  >
    {/* Decorative rings */}
    <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full border border-white/5" />
    <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full border border-white/8" />

    <div className="relative z-10">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-white/50 text-[10px] font-bold tracking-widest uppercase mb-1">
            Batch Year
          </p>
          <h3 className="text-4xl font-black text-white tracking-tighter leading-none">
            {year}
          </h3>
        </div>
        <div className="flex flex-col items-end gap-2">
          {isMine && (
            <span
              className={`text-[10px] font-extrabold ${palette.text} px-2 py-0.5 rounded-full border ${palette.accent} border-opacity-40`}
            >
              YOUR BATCH
            </span>
          )}
          <div
            className={`w-2.5 h-2.5 rounded-full ${palette.dot} shadow-lg`}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={13} className="text-white/40" />
          <span className="text-white/60 text-xs font-semibold">
            {count != null ? `${count} alumni` : "—"}
          </span>
        </div>
        <div className="flex items-center gap-1 text-white/40 hover:text-white/70 transition-colors">
          <span className="text-xs font-bold">View</span>
          <ChevronRight size={13} />
        </div>
      </div>
    </div>
  </motion.button>
);

/* ─── Alumni Card — Full Details ─── */
const AlumniCardFull = ({ alumni, apiBase, index }) => {
  const [flipped, setFlipped] = useState(false);
  const gradient = pickGradient(alumni.firstName);
  const photo = alumni.files?.currentPhoto || alumni.profileImage;
  const photoUrl = photo ? `${apiBase}/uploads/${photo}` : null;
  const social = alumni.social || {};
  const hasSocial = Object.values(social).some(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Header band */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${gradient}`} />

      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Top: avatar + name */}
        <div className="flex items-start gap-3">
          <div
            className={`relative flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-lg font-black shadow-md overflow-hidden`}
          >
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={alumni.firstName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              getInitials(alumni.firstName, alumni.lastName)
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="text-sm font-extrabold text-slate-900 truncate">
                {alumni.firstName} {alumni.lastName}
              </h4>
              {alumni.isApproved && (
                <CheckCircle
                  size={13}
                  className="text-emerald-500 flex-shrink-0"
                />
              )}
            </div>
            <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
              {alumni.email}
            </p>
            <div className="flex flex-wrap gap-1 mt-1.5">
              <Pill color="blue">
                <GraduationCap size={9} /> {alumni.department}
              </Pill>
              {alumni.programmeType && (
                <Pill color="violet">
                  <Layers size={9} /> {alumni.programmeType}
                </Pill>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-50" />

        {/* Info chips */}
        <div className="grid grid-cols-1 gap-1.5">
          <InfoChip
            icon={Calendar}
            value={alumni.batchYear ? `Batch of ${alumni.batchYear}` : null}
          />
          <InfoChip icon={BookOpen} value={alumni.degree} />
          <InfoChip icon={Hash} value={alumni.rollNumber} />
          {alumni.jobTitle && alumni.currentCompany && (
            <InfoChip
              icon={Briefcase}
              value={`${alumni.jobTitle} @ ${alumni.currentCompany}`}
            />
          )}
          {!alumni.jobTitle && alumni.occupation && (
            <InfoChip icon={Briefcase} value={alumni.occupation} />
          )}
          <InfoChip icon={Building2} value={alumni.industry} />
          {(alumni.city || alumni.country) && (
            <InfoChip
              icon={MapPin}
              value={[alumni.city, alumni.country].filter(Boolean).join(", ")}
            />
          )}
          <InfoChip icon={Phone} value={alumni.phone} />
        </div>

        {/* Social links */}
        {hasSocial && (
          <>
            <div className="border-t border-slate-50" />
            <div className="flex items-center gap-1.5 flex-wrap">
              <SocialLink
                href={social.linkedin}
                icon={Linkedin}
                label="LinkedIn"
              />
              <SocialLink
                href={social.twitter}
                icon={Twitter}
                label="Twitter"
              />
              <SocialLink
                href={social.instagram}
                icon={Instagram}
                label="Instagram"
              />
              <SocialLink
                href={social.facebook}
                icon={Facebook}
                label="Facebook"
              />
              <SocialLink href={social.website} icon={Globe} label="Website" />
            </div>
          </>
        )}

        {/* Alumni ID footer */}
        <div className="mt-auto pt-2 border-t border-slate-50 flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-300">
            {alumni.alumniId}
          </span>
          {alumni.isApproved ? (
            <Pill color="emerald">
              <CheckCircle size={9} /> Verified
            </Pill>
          ) : (
            <Pill color="amber">Pending</Pill>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Alumni Card — Limited Details (other batch) ─── */
const AlumniCardLimited = ({ alumni, index }) => {
  const gradient = pickGradient(alumni.firstName);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col"
    >
      <div className={`h-1 w-full bg-gradient-to-r ${gradient} opacity-40`} />
      <div className="p-4 flex items-center gap-3">
        {/* Blurred avatar placeholder */}
        <div
          className={`flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} opacity-30 flex items-center justify-center`}
        >
          <EyeOff size={15} className="text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-bold text-slate-800 truncate">
            {alumni.firstName} {alumni.lastName}
          </h4>
          <div className="flex flex-wrap gap-1 mt-1">
            {alumni.department && (
              <Pill>
                <GraduationCap size={9} /> {alumni.department}
              </Pill>
            )}
            {alumni.batchYear && (
              <Pill color="amber">
                <Calendar size={9} /> {alumni.batchYear}
              </Pill>
            )}
          </div>
        </div>
        <div
          className="flex-shrink-0 w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center"
          title="Limited view"
        >
          <Lock size={12} className="text-slate-300" />
        </div>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
const AlumniDirectory = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin" || false;
  const alumniRef = useRef(null);
  usePageTitle("Alumni Directory");
  // ── State ──
  const [view, setView] = useState("batches"); // "batches" | "alumni"
  const [batches, setBatches] = useState([]);
  const [batchCounts, setBatchCounts] = useState({});
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [alumniList, setAlumniList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [batchLoading, setBatchLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterOccupation, setFilterOccupation] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [gridMode, setGridMode] = useState("grid"); // "grid" | "list"
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    totalAlumni: 0,
    batchStats: 0,
    departmentStats: 0,
  });
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const itemsPerPage = 20;
  // ✅ Memoize params to prevent unnecessary object recreation
  const params = useMemo(
    () => (isAdmin ? { department: user.department } : {}),
    [isAdmin, user.department],
  );

  // ── Load batches ──
  useEffect(() => {
    (async () => {
      try {
        setBatchLoading(true);
        const res = await alumniAPI.getBatches(params); // GET /api/alumni/batches
        const data = res.data;
        const rawYears = Array.isArray(data.batches)
          ? data.batches
          : Array.isArray(data)
            ? data
            : [];
        const years = Array.from(
          new Set(rawYears.map((year) => String(year).trim())),
        );

        setBatches(years);

        const countsArray = data.batchesWithCounts;
        if (Array.isArray(countsArray)) {
          setBatchCounts(
            countsArray.reduce((map, item) => {
              const key = String(item._id);
              map[key] = item.count;
              return map;
            }, {}),
          );
        } else if (countsArray && typeof countsArray === "object") {
          setBatchCounts(countsArray);
        }
      } catch (e) {
        setError("Could not load batches. Please try again.");
      } finally {
        setBatchLoading(false);
      }
    })();
  }, []);

  // -- Load Stats (total, by batch, by department) ──
  useEffect(() => {
    (async () => {
      try {
        const res = await alumniAPI.getStats(params); // GET /api/alumni/stats
        const data = res.data.data;
        setStats({
          totalAlumni: data.totalAlumni || 0,
          batchStats: data.batchStats || 0,
          departmentStats: data.departmentStats || 0,
        });
      } catch (e) {
        // Ignore stats loading errors — not critical
      }
    })();
  }, []);

  // ── Load alumni for a batch ──
  const loadBatch = useCallback(
    async (
      year,
      pageNum = 1,
      searchStr = "",
      occFilter = "",
      deptFilter = "",
    ) => {
      try {
        setLoading(true);
        setError("");

        const res = await alumniAPI.getByBatch({
          batchYear: year === "Unknown" ? "null" : year,
          page: pageNum,
          limit: itemsPerPage,
          search: searchStr || undefined,
          occupation: occFilter || undefined,
          department: deptFilter || undefined,
          ...params,
        }); // GET /api/alumni/batch-wise?batchYear=year&page=1&limit=20&search=...

        const data = res.data;
        setAlumniList(data.alumni || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.page || 1);
        setSelectedBatch(year);
        setView("alumni");
      } catch (e) {
        setError("Failed to load alumni for this batch.");
      } finally {
        setLoading(false);
      }
    },
    [itemsPerPage, params],
  );

  // ── Handle filter/search changes (debounced) ──
  useEffect(() => {
    if (!selectedBatch) return;

    const timer = setTimeout(() => {
      loadBatch(selectedBatch, 1, search, filterOccupation, filterDept);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [search, filterOccupation, filterDept, selectedBatch]); // ✅ Removed loadBatch from dependencies to prevent infinite loop

  // ── Filtered alumni list (backend handles filtering now) ──
  const filtered = useMemo(() => {
    return alumniList; // Backend already filters, pagination handles the rest
  }, [alumniList]);

  // ── Unique filter options ──
  const occupations = useMemo(
    () => [...new Set(alumniList.map((a) => a.occupation).filter(Boolean))],
    [alumniList],
  );
  const departments = useMemo(
    () => [...new Set(alumniList.map((a) => a.department).filter(Boolean))],
    [alumniList],
  );

  // ── Split: full vs limited ──
  const { fullCards, limitedCards } = useMemo(() => {
    const fullCards = filtered.filter((a) => canSeeFullDetails(user, a));
    const limitedCards = filtered.filter((a) => !canSeeFullDetails(user, a));
    return { fullCards, limitedCards };
  }, [filtered, user]);

  /* Display info - use total from pagination for accuracy */
  return (
    <>
      <div ref={alumniRef} className="min-h-screen bg-[#f4f5f9] pt-24 pb-16 px-4 sm:px-6">
        <div  className="container mx-auto px-6">
          {/* ── Page Header ── */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            {view === "alumni" && (
              <button
                onClick={() => {
                  setView("batches");
                  setSelectedBatch(null);
                  setAlumniList([]);
                }}
                className="flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-800 mb-4 transition-colors group"
              >
                <ArrowLeft
                  size={15}
                  className="group-hover:-translate-x-0.5 transition-transform"
                />
                All Batches
              </button>
            )}

            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-extrabold text-indigo-400 uppercase tracking-widest mb-1">
                  Alumni Portal
                </p>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">
                  {view === "batches"
                    ? `Alumni Directory - ${isAdmin ? `Department ${user?.department || "N/A"}` : `Batch ${user?.batchYear || "Years"}`}`
                    : `Batch of ${selectedBatch}`}
                </h1>

                {/* Stats */}
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1.5">
                    <Users size={13} className="text-slate-400" />
                    <span className="text-sm text-slate-400 font-medium">
                      {stats.totalAlumni} total alumni
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <GraduationCap size={13} className="text-slate-400" />
                    <span className="text-sm text-slate-400 font-medium">
                      {stats.batchStats} total batches
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Building2 size={13} className="text-slate-400" />
                    <span className="text-sm text-slate-400 font-medium">
                      {stats.departmentStats} total departments
                    </span>
                  </div>
                </div>

                {view === "alumni" && !loading && (
                  <p className="text-sm text-slate-400 font-medium mt-1">
                    {total} alumni found
                    {!isAdmin && (
                      <span className="ml-2 text-indigo-400">
                        · {fullCards.length} full profile
                        {fullCards.length !== 1 ? "s" : ""} visible
                      </span>
                    )}
                  </p>
                )}
              </div>

              {view === "alumni" && !loading && (
                <div className="flex items-center gap-2">
                  {/* Grid / List toggle */}
                  <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                    <button
                      onClick={() => setGridMode("grid")}
                      className={`p-1.5 rounded-lg transition-all ${gridMode === "grid" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                    >
                      <LayoutGrid size={14} />
                    </button>
                    <button
                      onClick={() => setGridMode("list")}
                      className={`p-1.5 rounded-lg transition-all ${gridMode === "list" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                    >
                      <List size={14} />
                    </button>
                  </div>
                  {/* Filter toggle */}
                  <button
                    onClick={() => setShowFilters((p) => !p)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-sm font-bold transition-all shadow-sm ${showFilters ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300"}`}
                  >
                    <SlidersHorizontal size={14} />
                    Filters
                    {(filterOccupation || filterDept) && (
                      <span className="w-4 h-4 rounded-full bg-amber-400 text-white text-[9px] font-black flex items-center justify-center">
                        {[filterOccupation, filterDept].filter(Boolean).length}
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* ── Error Banner ── */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="flex items-center gap-3 px-5 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium mb-5"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {error}
                <button onClick={() => setError("")} className="ml-auto">
                  <X size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ══════════════ BATCH VIEW ══════════════ */}
          <AnimatePresence mode="wait">
            {view === "batches" && (
              <motion.div
                key="batches"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {batchLoading ? (
                  <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-indigo-500 animate-spin" />
                    <p className="text-slate-400 text-sm font-medium">
                      Loading batches…
                    </p>
                  </div>
                ) : batches.length === 0 ? (
                  <div className="text-center py-24">
                    <GraduationCap
                      size={40}
                      className="text-slate-200 mx-auto mb-4"
                    />
                    <p className="text-slate-400 font-medium">
                      No batches found.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Info banner for alumni */}
                    {!isAdmin && (
                      <motion.div
                        className="flex items-start gap-3 px-5 py-3.5 rounded-2xl bg-indigo-50 border border-indigo-100 mb-6"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Eye
                          size={16}
                          className="text-indigo-400 flex-shrink-0 mt-0.5"
                        />
                        <div>
                          <p className="text-sm font-bold text-indigo-800">
                            Visibility Notice
                          </p>
                          <p className="text-xs text-indigo-500 mt-0.5">
                            Full details are visible for{" "}
                            <strong>Batch {user?.batchYear}</strong> members.
                            Other batches show name, department, and batch year
                            only.
                          </p>
                        </div>
                      </motion.div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {batches.map((year, i) => (
                        <BatchCard
                          key={i}
                          year={year}
                          count={
                            batchCounts[String(year)] ??
                            batchCounts[year] ??
                            null
                          }
                          palette={BATCH_PALETTES[i % BATCH_PALETTES.length]}
                          isMine={
                            !isAdmin && String(user?.batchYear) === String(year)
                          }
                          onClick={() => {
                            alumniRef.current.scrollIntoView({
                              behavior: "smooth",
                            });
                            loadBatch(year)}}
                          index={i}
                        />
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* ══════════════ ALUMNI VIEW ══════════════ */}
            {view === "alumni" && (
              <motion.div
                key="alumni"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Search + Filters */}
                <div className="flex flex-col gap-3 mb-5">
                  {/* Search bar */}
                  <div className="relative">
                    <Search
                      size={15}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      type="text"
                      placeholder="Search by name, email or roll number…"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 shadow-sm transition-all"
                    />
                    {search && (
                      <button
                        onClick={() => setSearch("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                      >
                        <X size={11} className="text-slate-500" />
                      </button>
                    )}
                  </div>

                  {/* Filter dropdowns */}
                  <AnimatePresence>
                    {showFilters && (
                      <motion.div
                        className="flex flex-wrap gap-3"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        {/* Occupation filter */}
                        <div className="relative">
                          <select
                            value={filterOccupation}
                            onChange={(e) =>
                              setFilterOccupation(e.target.value)
                            }
                            className="appearance-none pl-3.5 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm cursor-pointer"
                          >
                            <option value="">All Occupations</option>
                            {occupations.map((o) => (
                              <option key={o}>{o}</option>
                            ))}
                          </select>
                          <ChevronDown
                            size={12}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                          />
                        </div>
                        {/* Department filter */}
                        <div className="relative">
                          <select
                            value={filterDept}
                            onChange={(e) => setFilterDept(e.target.value)}
                            className="appearance-none pl-3.5 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm cursor-pointer"
                          >
                            <option value="">All Departments</option>
                            {departments.map((d) => (
                              <option key={d}>{d}</option>
                            ))}
                          </select>
                          <ChevronDown
                            size={12}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                          />
                        </div>
                        {/* Clear filters */}
                        {(filterOccupation || filterDept) && (
                          <button
                            onClick={() => {
                              setFilterOccupation("");
                              setFilterDept("");
                            }}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-bold hover:bg-red-100 transition-colors"
                          >
                            <X size={12} /> Clear
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Loading */}
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-28 gap-4">
                    <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-indigo-500 animate-spin" />
                    <p className="text-slate-400 text-sm font-medium">
                      Loading alumni…
                    </p>
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="text-center py-24">
                    <Users size={40} className="text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-medium text-sm">
                      No alumni match your search.
                    </p>
                    {(search || filterOccupation || filterDept) && (
                      <button
                        onClick={() => {
                          setSearch("");
                          setFilterOccupation("");
                          setFilterDept("");
                        }}
                        className="mt-3 text-indigo-500 text-sm font-bold hover:underline"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    {/* ── Full-detail section ── */}
                    {fullCards.length > 0 && (
                      <section className="mb-8">
                        {!isAdmin && (
                          <div className="flex items-center gap-2 mb-4">
                            <Eye size={13} className="text-emerald-500" />
                            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">
                              Your Batch — Full Details
                            </span>
                            <span className="text-[10px] font-bold text-slate-300">
                              ({fullCards.length})
                            </span>
                          </div>
                        )}
                        {gridMode === "grid" ? (
                          <div
                            className={`grid gap-4 ${
                              gridMode === "grid"
                                ? "grid-cols-1 sm:grid-cols-3 lg:grid-cols-5"
                                : "grid-cols-1"
                            }`}
                          >
                            {fullCards.map((alumni, i) => (
                              <div
                                key={alumni._id}
                                onClick={() => setSelectedAlumni(alumni)}
                                className="cursor-pointer"
                              >
                                <AlumniCardFull
                                  alumni={alumni}
                                  apiBase={API_BASE}
                                  index={i}
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="overflow-auto bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <table className="min-w-full table-fixed">
                              <thead className="bg-slate-50">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                                    Name
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                                    Department
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                                    Programme
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                                    Batch
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                                    Email
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                                    Phone
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                                    Job
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                                    Status
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-slate-100">
                                {fullCards.map((alumni, i) => (
                                  <tr
                                    key={alumni._id}
                                    onClick={() => setSelectedAlumni(alumni)}
                                    className="hover:bg-slate-50 cursor-pointer"
                                  >
                                    <td className="px-4 py-3 align-middle">
                                      <div className="flex items-center gap-3">
                                        <div
                                          className={`w-9 h-9 rounded-md bg-gradient-to-br ${pickGradient(alumni.firstName)} flex items-center justify-center text-white font-bold`}
                                        >
                                          {getInitials(
                                            alumni.firstName,
                                            alumni.lastName,
                                          )}
                                        </div>
                                        <div className="min-w-0">
                                          <div className="text-sm font-bold text-slate-900 truncate">
                                            {alumni.firstName} {alumni.lastName}
                                          </div>
                                          <div className="text-xs text-slate-400 truncate">
                                            {alumni.email}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-700 align-middle">
                                      {alumni.department || "—"}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-700 align-middle">
                                      {alumni.programmeType || "—"}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-700 align-middle">
                                      {alumni.batchYear || "—"}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-700 align-middle truncate">
                                      {alumni.email}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-700 align-middle">
                                      {alumni.phone || "—"}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-700 align-middle truncate">
                                      {alumni.jobTitle
                                        ? `${alumni.jobTitle}${alumni.currentCompany ? " @ " + alumni.currentCompany : ""}`
                                        : alumni.occupation || "—"}
                                    </td>
                                    <td className="px-4 py-3 align-middle">
                                      {alumni.isApproved ? (
                                        <Pill color="emerald">
                                          <CheckCircle size={12} /> Verified
                                        </Pill>
                                      ) : (
                                        <Pill color="amber">Pending</Pill>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </section>
                    )}

                    {/* ── Pagination Controls (between full & limited) ── */}
                    {totalPages > 1 && fullCards.length > 0 && (
                      <div className="flex items-center justify-center gap-2 my-8 px-4 flex-wrap">
                        <button
                          onClick={() => {
                            alumniRef.current.scrollIntoView({
                              behavior: "smooth",
                            });
                            loadBatch(
                              selectedBatch,
                              Math.max(1, currentPage - 1),
                              search,
                              filterOccupation,
                              filterDept,
                            );
                          }}
                          disabled={currentPage === 1}
                          className="px-3 py-2 rounded-lg border border-indigo-300 text-indigo-600 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          ← Prev
                        </button>

                        <div className="flex items-center gap-1 flex-wrap justify-center">
                          {(() => {
                            const pages = [];

                            const range = 2; // pages before/after current

                            // Always add first page
                            pages.push(1);

                            // Add pages around current
                            const start = Math.max(2, currentPage - range);
                            const end = Math.min(
                              totalPages - 1,
                              currentPage + range,
                            );

                            // Add ellipsis if needed
                            if (start > 2) pages.push("...");

                            // Add range
                            for (let i = start; i <= end; i++) pages.push(i);

                            // Add ellipsis if needed
                            if (end < totalPages - 1) pages.push("...");

                            // Always add last page (if more than 1 page)
                            if (totalPages > 1) pages.push(totalPages);

                            return pages.map((page, idx) =>
                              page === "..." ? (
                                <span
                                  key={`ellipsis-${idx}`}
                                  className="text-slate-400 px-1"
                                >
                                  …
                                </span>
                              ) : (
                                <button
                                  key={page}
                                  onClick={() => {
                                    alumniRef.current.scrollIntoView({
                                      behavior: "smooth",
                                    });
                                    loadBatch(
                                      selectedBatch,
                                      page,
                                      search,
                                      filterOccupation,
                                      filterDept,
                                    );
                                  }}
                                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                                    currentPage === page
                                      ? "bg-indigo-600 text-white shadow-md"
                                      : "border border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                                  }`}
                                >
                                  {page}
                                </button>
                              ),
                            );
                          })()}
                        </div>

                        <button
                          onClick={() => {
                            alumniRef.current.scrollIntoView({
                              behavior: "smooth",
                            });
                            loadBatch(
                              selectedBatch,
                              Math.min(totalPages, currentPage + 1),
                              search,
                              filterOccupation,
                              filterDept,
                            );
                          }}
                          disabled={currentPage === totalPages}
                          className="px-3 py-2 rounded-lg border border-indigo-300 text-indigo-600 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          Next →
                        </button>

                        <span className="text-xs text-slate-500 font-medium ml-4">
                          Page {currentPage} of {totalPages} • Total: {total}{" "}
                          alumni
                        </span>
                      </div>
                    )}

                    {/* ── Limited-detail section ── */}
                    {limitedCards.length > 0 && (
                      <section>
                        <div className="flex items-center gap-2 mb-4">
                          <Lock size={13} className="text-slate-400" />
                          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                            Other Batches — Limited View
                          </span>
                          <span className="text-[10px] font-bold text-slate-300">
                            ({limitedCards.length})
                          </span>
                        </div>
                        {gridMode === "grid" ? (
                          <div
                            className={`grid gap-3 ${
                              gridMode === "grid"
                                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                                : "grid-cols-1"
                            }`}
                          >
                            {limitedCards.map((alumni, i) => (
                              <div key={alumni._id} className="cursor-pointer">
                                <AlumniCardLimited alumni={alumni} index={i} />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="overflow-auto bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <table className="min-w-full table-fixed">
                              <thead className="bg-slate-50">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                                    Name
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                                    Department
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                                    Batch
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                                    Location
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                                    View
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-slate-100">
                                {limitedCards.map((alumni, i) => (
                                  <tr
                                    key={alumni._id}
                                    className="hover:bg-slate-50 cursor-pointer"
                                  >
                                    <td className="px-4 py-3 align-middle">
                                      <div className="flex items-center gap-3">
                                        <div
                                          className={`w-9 h-9 rounded-md bg-gradient-to-br ${pickGradient(alumni.firstName)} flex items-center justify-center text-white font-bold opacity-60`}
                                        >
                                          {getInitials(
                                            alumni.firstName,
                                            alumni.lastName,
                                          )}
                                        </div>
                                        <div className="min-w-0">
                                          <div className="text-sm font-bold text-slate-800 truncate">
                                            {alumni.firstName} {alumni.lastName}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-700 align-middle">
                                      {alumni.department || "—"}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-700 align-middle">
                                      {alumni.batchYear || "—"}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-700 align-middle">
                                      {[alumni.city, alumni.country]
                                        .filter(Boolean)
                                        .join(", ") || "—"}
                                    </td>
                                    <td className="px-4 py-3 align-middle">
                                      <div
                                        className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center"
                                        title="Limited view"
                                      >
                                        <Lock
                                          size={14}
                                          className="text-slate-400"
                                        />
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </section>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Alumni Detail Modal ── */}
      <AnimatePresence>
        {selectedAlumni && (
          <AlumniDetailModal
            alumni={selectedAlumni}
            isOpen={!!selectedAlumni}
            onClose={() => setSelectedAlumni(null)}
            apiBase={API_BASE}
            viewer={user}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AlumniDirectory;
