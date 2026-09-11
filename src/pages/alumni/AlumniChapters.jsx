// src/pages/alumni/AlumniChapters.jsx
// ✅ ALUMNI CHAPTERS MODULE
// Blog-style chapters where alumni can create, edit, and manage local/regional chapters

import React, { useState, useEffect, useCallback, useMemo, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  X,
  Edit2,
  Trash2,
  MapPin,
  Users,
  Calendar,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon,
  LogOut,
  ArrowLeft,
  ExternalLink,
  Tag,
  Eye,
  UserPlus,
  UserMinus,
  MoreHorizontal,
  Share2,
  MessageCircle,
  Clock,
  Globe,
} from "lucide-react";
import { alumniAPI, API_BASE } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import usePageTitle from "../../hooks/usePageTitle";

/* ─────────────────────────────────────────
   HELPERS & CONSTANTS
───────────────────────────────────────── */

const CHAPTER_CATEGORIES = [
  { id: "regional", label: "Regional", icon: MapPin },
  { id: "professional", label: "Professional", icon: Tag },
  { id: "interest", label: "Interest-Based", icon: Globe },
  { id: "industry", label: "Industry", icon: Users },
];

const CATEGORY_COLORS = {
  regional: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  professional: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  interest: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
  industry: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
};

const getInitials = (name = "") =>
  name.split(" ").map(n => n[0]).join("").toUpperCase() || "?";

const avatarGradients = [
  "from-rose-400 to-orange-400",
  "from-sky-400 to-blue-500",
  "from-emerald-400 to-teal-500",
  "from-violet-400 to-purple-500",
  "from-amber-400 to-orange-500",
];
const pickGradient = (str = "") =>
  avatarGradients[str.charCodeAt(0) % avatarGradients.length];

/* ─────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────── */

// Category Badge
const CategoryBadge = ({ category }) => {
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.regional;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors.bg} ${colors.text} border ${colors.border}`}
    >
      {CHAPTER_CATEGORIES.find(c => c.id === category)?.label || category}
    </span>
  );
};

// Chapter Card - Grid/List View
const ChapterCard = ({
  chapter,
  user,
  isAuthor,
  isMember,
  index,
  onEdit,
  onDelete,
  onJoin,
  onClick,
  isLoadingChapter, // ✅ NEW: Loading state
}) => {
  const bannerUrl = chapter.bannerImage
    ? `${API_BASE}/uploads/${chapter.bannerImage}`
    : "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
      onClick={onClick}
    >
      {/* Banner Image */}
      <div className="relative h-48 bg-linear-to-br from-slate-200 to-slate-300 overflow-hidden">
        <img
          src={bannerUrl}
          alt={chapter.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Category Badge Overlay */}
        <div className="absolute top-3 right-3">
          <CategoryBadge category={chapter.category} />
        </div>
        {/* Status Badge */}
        {isAuthor && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full">
            <Eye size={12} className="text-indigo-600" />
            <span className="text-xs font-bold text-slate-700">Author</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Title & Location */}
        <div>
          <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
            {chapter.title}
          </h3>
          {chapter.location && (
            <div className="flex items-center gap-1.5 mt-1 text-slate-600">
              <MapPin size={13} className="shrink-0" />
              <span className="text-sm font-medium">{chapter.location}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 line-clamp-2 flex-1">
          {chapter.description || "No description provided"}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100/80">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-slate-600">
              <Users size={14} className="shrink-0" />
              <span className="text-xs font-semibold">{chapter.memberCount || 0}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <Clock size={14} className="shrink-0" />
              <span className="text-xs font-medium">
                {new Date(chapter.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Actions */}
          {isAuthor && (
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors"
                title="Edit chapter"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                title="Delete chapter"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Join Button */}
        {!isAuthor && user && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              onJoin();
            }}
            disabled={isLoadingChapter} // ✅ NEW: Disable while loading
            className={`w-full py-2 rounded-lg font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              isMember
                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {isLoadingChapter ? (
              <div className="flex items-center justify-center gap-1.5">
                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                {isMember ? "Leaving..." : "Joining..."}
              </div>
            ) : isMember ? (
              <div className="flex items-center justify-center gap-1.5">
                <UserMinus size={14} />
                Leave Chapter
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1.5">
                <UserPlus size={14} />
                Join Chapter
              </div>
            )}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

// Chapter Detail Modal
const ChapterDetailModal = ({ 
  chapter, 
  user, 
  isAuthor, 
  isMember, 
  onClose, 
  onEdit, 
  onJoin,
  isLoadingChapter, // ✅ NEW: Loading state
}) => {
  const bannerUrl = chapter.bannerImage
    ? `${API_BASE}/uploads/${chapter.bannerImage}`
    : "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400&fit=crop";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-2000 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header with Banner */}
        <div className="relative h-64 bg-linear-to-br from-slate-200 to-slate-300 overflow-hidden">
          <img
            src={bannerUrl}
            alt={chapter.title}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg bg-white/90 hover:bg-white text-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Title & Category */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">
                  {chapter.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3">
                  <CategoryBadge category={chapter.category} />
                  {chapter.location && (
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <MapPin size={16} />
                      <span className="font-medium">{chapter.location}</span>
                    </div>
                  )}
                </div>
              </div>
              {isAuthor && (
                <button
                  onClick={onEdit}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
              )}
            </div>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">
                Members
              </p>
              <p className="text-2xl font-bold text-slate-800">
                {chapter.memberCount || 0}
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">
                Founded
              </p>
              <p className="text-sm font-bold text-slate-800">
                {new Date(chapter.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">
                Status
              </p>
              <p className="text-sm font-bold text-emerald-700">Active</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">
              About
            </h3>
            <p className="text-slate-700 leading-relaxed">
              {chapter.description}
            </p>
          </div>

          {/* Content */}
          {chapter.content && (
            <div>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">
                Details
              </h3>
              <div
                className="prose prose-sm max-w-none text-slate-700"
                dangerouslySetInnerHTML={{ __html: chapter.content }}
              />
            </div>
          )}

          {/* Founder Info */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <p className="text-xs font-semibold text-indigo-700 uppercase tracking-widest mb-2">
              Founder
            </p>
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${pickGradient(
                  chapter.founderName
                )} flex items-center justify-center text-white font-bold`}
              >
                {getInitials(chapter.founderName)}
              </div>
              <div>
                <p className="font-semibold text-slate-800">
                  {chapter.founderName || "Unknown"}
                </p>
                <p className="text-sm text-slate-600">{chapter.founderEmail}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        {!isAuthor && user && (
          <div className="border-t border-slate-100 p-4 bg-slate-50">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onJoin}
              disabled={isLoadingChapter} // ✅ NEW: Disable while loading
              className={`w-full py-3 rounded-lg font-bold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                isMember
                  ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {isLoadingChapter ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  {isMember ? "Leaving..." : "Joining..."}
                </div>
              ) : isMember ? (
                "Leave This Chapter"
              ) : (
                "Join This Chapter"
              )}
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// Create/Edit Chapter Form Modal
const ChapterFormModal = ({
  chapter,
  onSave,
  onCancel,
  loading,
  error,
}) => {
  const [formData, setFormData] = useState({
    title: chapter?.title || "",
    location: chapter?.location || "",
    description: chapter?.description || "",
    content: chapter?.content || "",
    category: chapter?.category || "regional",
    bannerImage: chapter?.bannerImage || null,
    tags: chapter?.tags?.join(", ") || "",
  });

  const [bannerPreview, setBannerPreview] = useState(
    chapter?.bannerImage
      ? `${API_BASE}/uploads/${chapter.bannerImage}`
      : null
  );

  const handleBannerChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, bannerImage: file }));
      const reader = new FileReader();
      reader.onload = (event) => setBannerPreview(event.target?.result);
      reader.readAsDataURL(file);
    }
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[2000] flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <h2 className="text-xl font-bold text-slate-800">
            {chapter ? "Edit Chapter" : "Create New Chapter"}
          </h2>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={20} className="text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-5">
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-800">Error</p>
                <p className="text-sm text-red-700 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Banner Upload */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Banner Image
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                className="sr-only"
                id="banner-upload"
              />
              <label
                htmlFor="banner-upload"
                className="block relative h-40 border-2 border-dashed border-slate-300 rounded-lg overflow-hidden cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all group"
              >
                {bannerPreview ? (
                  <>
                    <img
                      src={bannerPreview}
                      alt="Banner"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <p className="text-white font-semibold text-sm">
                        Change Image
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-2">
                    <ImageIcon size={32} className="text-slate-300" />
                    <p className="text-sm font-semibold text-slate-600">
                      Click to upload banner
                    </p>
                    <p className="text-xs text-slate-400">PNG, JPG up to 5MB</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Chapter Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Bangalore Tech Alumni Chapter"
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., Bangalore, India"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-800"
            >
              {CHAPTER_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Brief description of your chapter..."
              required
              rows="3"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-800 placeholder:text-slate-400 resize-none"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Full Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Detailed information about your chapter..."
              rows="5"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-800 placeholder:text-slate-400 resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="e.g., networking, tech, startup"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-800 placeholder:text-slate-400"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="border-t border-slate-100 p-4 bg-slate-50 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>Save Chapter</>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */

const AlumniChapters = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // State Management
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const [userChapterIds, setUserChapterIds] = useState([]);
  const [joiningChapterId, setJoiningChapterId] = useState(null); // ✅ NEW: Track which chapter is loading

  usePageTitle("Alumni Chapters");

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/alumni/login");
    }
  }, [user, navigate]);

  // Fetch chapters
  const fetchChapters = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await alumniAPI.getChapters?.();
      setChapters(response?.data?.chapters || []);
      setUserChapterIds(response?.data?.userChapterIds || []);
    } catch (err) {
      console.error("Failed to fetch chapters:", err);
      setError("Failed to load chapters. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChapters();
  }, [fetchChapters]);

  // Filtered chapters
  const filteredChapters = useMemo(() => {
    return chapters.filter((chapter) => {
      const matchesSearch =
        chapter.title.toLowerCase().includes(search.toLowerCase()) ||
        chapter.location?.toLowerCase().includes(search.toLowerCase()) ||
        chapter.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !filterCategory || chapter.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [chapters, search, filterCategory]);

  // Create Chapter
  const handleCreateChapter = useCallback(
    async (formData) => {
      setFormError("");
      setFormLoading(true);

      try {
        const data = new FormData();
        data.append("title", formData.title);
        data.append("location", formData.location);
        data.append("description", formData.description);
        data.append("content", formData.content);
        data.append("category", formData.category);
        data.append("tags", formData.tags);

        if (formData.bannerImage instanceof File) {
          data.append("bannerImage", formData.bannerImage);
        }

        let response;
        if (editingChapter) {
          response = await alumniAPI.updateChapter?.(editingChapter._id, data);
        } else {
          response = await alumniAPI.createChapter?.(data);
        }

        if (response?.data) {
          setSuccess(
            editingChapter ? "Chapter updated successfully!" : "Chapter created successfully!"
          );
          setShowCreateForm(false);
          setEditingChapter(null);
          fetchChapters();

          setTimeout(() => setSuccess(""), 3000);
        }
      } catch (err) {
        setFormError(err.response?.data?.message || "Failed to save chapter");
        console.error("Error saving chapter:", err);
      } finally {
        setFormLoading(false);
      }
    },
    [editingChapter, fetchChapters]
  );

  // Delete Chapter
  const handleDeleteChapter = useCallback(async (chapterId) => {
    if (!window.confirm("Are you sure you want to delete this chapter?")) return;

    try {
      await alumniAPI.deleteChapter?.(chapterId);
      setSuccess("Chapter deleted successfully!");
      fetchChapters();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete chapter");
    }
  }, [fetchChapters]);

  // ✅ FIXED: Join/Leave Chapter with proper error handling
  const handleToggleJoin = useCallback(
    async (chapterId) => {
      try {
        // ✅ Prevent double-clicks
        if (joiningChapterId === chapterId) {
          console.warn("⚠️ Already processing this chapter");
          return;
        }

        setJoiningChapterId(chapterId);
        setError(""); // Clear previous errors

        // ✅ Check current membership status
        const isMember = userChapterIds.includes(chapterId);

        if (isMember) {
          // ✅ User is a member, so leave
          console.log(`📤 Leaving chapter ${chapterId}`);
          await alumniAPI.leaveChapter?.(chapterId);
          setSuccess("Left chapter successfully!");
        } else {
          // ✅ User is not a member, so join
          console.log(`📥 Joining chapter ${chapterId}`);
          await alumniAPI.joinChapter?.(chapterId);
          setSuccess("Joined chapter successfully!");
        }

        // ✅ Refresh chapters list to sync state
        await fetchChapters();

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        console.error("❌ Error updating membership:", err);

        const errorMessage = err.response?.data?.message || err.message;
        const status = err.response?.status;

        // ✅ Handle "Already a member" error gracefully
        if (status === 400 && errorMessage.includes("Already a member")) {
          console.log("📌 User is already a member, updating state...");
          // Just update the state without showing an error
          setUserChapterIds((prev) => {
            if (!prev.includes(chapterId)) {
              return [...prev, chapterId];
            }
            return prev;
          });
          setSuccess("You're already a member of this chapter!");
          setTimeout(() => setSuccess(""), 3000);
        } else {
          // Show error for other cases
          setError(
            errorMessage || "Failed to update membership. Please try again."
          );
        }
      } finally {
        setJoiningChapterId(null); // ✅ Clear loading state
      }
    },
    [userChapterIds, fetchChapters, joiningChapterId] // ✅ Added joiningChapterId
  );

  // Handlers
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const openEditForm = (chapter) => {
    setEditingChapter(chapter);
    setShowCreateForm(true);
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }
        html, body {
          overflow-x: hidden;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 pt-24 pb-16 px-4 sm:px-6">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-slate-200/50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ x: -2 }}
                onClick={() => navigate("/")}
                className="flex items-center gap-1.5 text-slate-600 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft size={18} />
                <span className="text-sm font-semibold">Back</span>
              </motion.button>
              <div className="h-6 w-px bg-slate-200" />
              <h1 className="text-2xl font-bold text-slate-800">Alumni Chapters</h1>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setEditingChapter(null);
                  setShowCreateForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold shadow-md transition-all"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">New Chapter</span>
              </motion.button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold transition-colors text-sm"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Success Message */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg"
              >
                <CheckCircle size={20} className="text-emerald-600 flex-shrink-0" />
                <p className="font-semibold text-emerald-800">{success}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                <p className="font-semibold text-red-800">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search & Filters */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search chapters by name, location, or description…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-slate-800 placeholder:text-slate-400 shadow-sm"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-slate-600">Filter:</span>
              <button
                onClick={() => setFilterCategory("")}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  !filterCategory
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                All Categories
              </button>
              {CHAPTER_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                    filterCategory === cat.id
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <cat.icon size={14} />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <p className="mb-6 text-sm font-semibold text-slate-600">
            Showing {filteredChapters.length} of {chapters.length} chapters
          </p>

          {/* Chapters Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-indigo-500 animate-spin" />
              <p className="text-slate-500 font-medium">Loading chapters…</p>
            </div>
          ) : filteredChapters.length === 0 ? (
            <div className="text-center py-20">
              <Users size={48} className="text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 font-semibold text-lg">
                {search || filterCategory ? "No chapters match your search." : "No chapters yet."}
              </p>
              {!search && !filterCategory && (
                <p className="text-slate-500 mt-2 mb-6">
                  Create the first chapter or wait for others to join!
                </p>
              )}
              {(search || filterCategory) && (
                <button
                  onClick={() => {
                    setSearch("");
                    setFilterCategory("");
                  }}
                  className="mt-4 text-indigo-600 font-bold hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChapters.map((chapter, index) => {
                const isAuthor = chapter.foundedBy === user?._id;
                const isMember = userChapterIds.includes(chapter._id);

                return (
                  <ChapterCard
                    key={chapter._id}
                    chapter={chapter}
                    user={user}
                    isAuthor={isAuthor}
                    isMember={isMember}
                    index={index}
                    isLoadingChapter={joiningChapterId === chapter._id} // ✅ NEW: Pass loading state
                    onEdit={() => openEditForm(chapter)}
                    onDelete={() => handleDeleteChapter(chapter._id)}
                    onJoin={() => handleToggleJoin(chapter._id)}
                    onClick={() => setSelectedChapter(chapter)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showCreateForm && (
          <ChapterFormModal
            chapter={editingChapter}
            onSave={handleCreateChapter}
            onCancel={() => {
              setShowCreateForm(false);
              setEditingChapter(null);
              setFormError("");
            }}
            loading={formLoading}
            error={formError}
          />
        )}

        {selectedChapter && (
          <ChapterDetailModal
            chapter={selectedChapter}
            user={user}
            isAuthor={selectedChapter.foundedBy === user?._id}
            isMember={userChapterIds.includes(selectedChapter._id)}
            isLoadingChapter={joiningChapterId === selectedChapter._id} // ✅ NEW: Pass loading state
            onClose={() => setSelectedChapter(null)}
            onEdit={() => {
              openEditForm(selectedChapter);
              setSelectedChapter(null);
            }}
            onJoin={() => {
              handleToggleJoin(selectedChapter._id);
              setSelectedChapter(null);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AlumniChapters;