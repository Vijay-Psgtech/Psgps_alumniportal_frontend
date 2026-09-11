import React, { use, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Loader,
  Trash2,
  Pencil,
  FileText,
  Download,
  CheckCircle,
} from "lucide-react";
import { newsLetterAPI, API_BASE } from "../../services/api";
import {
  Overlay,
  ModalHeader,
  DeleteModal,
  FLabel,
  Inp,
  Sel,
  Txt,
} from "../../components/admin/AdminSharedUI";
import usePageTitle from "../../hooks/usePageTitle";

const CATEGORY_OPTIONS = [
  "Newsletters",
  "Alumni Stories",
  "Accolades/Accreditations",
  "Institute Updates",
  "Events",
];

const BLANK_NEWSLETTER = {
  title: "",
  date: "",
  category: "Newsletters",
  description: "",
  author: "",
  tags: "",
  imageUrl: null,
  pdfUrl: null,
};

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getPreviewUrl = (path) => {
  if (!path) return null;
  if (
    path.startsWith("http") ||
    path.startsWith("/") ||
    path.startsWith("data:")
  ) {
    return path;
  }
  return `${API_BASE}/${path}`;
};

const NewsLetterFormModal = ({ initial, onSave, onClose, isLoading }) => {
  const [form, setForm] = useState(() => {
    if (!initial) return BLANK_NEWSLETTER;
    return {
      ...initial,
      date: formatDate(initial.date),
      tags: Array.isArray(initial.tags)
        ? initial.tags.join(", ")
        : initial.tags || "",
      imageUrl: initial.imageUrl || null,
      pdfUrl: initial.pdfUrl || null,
    };
  });

  const [imagePreview, setImagePreview] = useState(() =>
    getPreviewUrl(initial?.imageUrl),
  );
  const [pdfName, setPdfName] = useState(() => {
    if (!initial?.pdfUrl) return "";
    return typeof initial.pdfUrl === "string"
      ? initial.pdfUrl.split("/").pop()
      : "";
  });

  const isEdit = !!initial?._id;

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    set("imageUrl", file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handlePdfChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    set("pdfUrl", file);
    setPdfName(file.name);
  };

  const removeImage = () => {
    set("imageUrl", null);
    setImagePreview(null);
  };

  const valid =
    form.title.trim() && form.date && form.description.trim() && form.category;

  return (
    <Overlay onClose={onClose} wide>
      <ModalHeader
        title={isEdit ? "Edit Newsletter" : "Add New Newsletter"}
        sub={isEdit ? "✏️ EDITING NEWSLETTER" : "📬 CREATE NEWSLETTER"}
        onClose={onClose}
      />
      <div className="px-7 pt-6 pb-7">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <FLabel label="Title" span2>
            <Inp
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Newsletter title"
              disabled={isLoading}
            />
          </FLabel>
          <FLabel label="Category">
            <Sel
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              disabled={isLoading}
            >
              {CATEGORY_OPTIONS.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Sel>
          </FLabel>
          <FLabel label="Publication Date">
            <Inp
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              disabled={isLoading}
            />
          </FLabel>
          <FLabel label="Author">
            <Inp
              value={form.author}
              onChange={(e) => set("author", e.target.value)}
              placeholder="Author name"
              disabled={isLoading}
            />
          </FLabel>
          <FLabel label="Tags (comma-separated)">
            <Inp
              value={form.tags}
              onChange={(e) => set("tags", e.target.value)}
              placeholder="e.g. alumni, update, achievements"
              disabled={isLoading}
            />
          </FLabel>
          <FLabel label="Description" span2>
            <Txt
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Write a short summary or newsletter excerpt"
              disabled={isLoading}
            />
          </FLabel>
          <FLabel label="Cover Image" span2>
            <div className="space-y-3">
              {imagePreview ? (
                <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                  <img
                    src={imagePreview}
                    alt="Newsletter cover"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    disabled={isLoading}
                    className="absolute top-3 right-3 bg-white/90 border border-slate-200 rounded-full p-2 shadow-sm text-slate-600 hover:bg-slate-100"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label className="block w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50/90 px-4 py-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                  <div className="flex flex-col items-center gap-2 text-slate-500">
                    <FileText size={24} />
                    <span className="text-sm font-semibold">
                      Upload cover image
                    </span>
                    <span className="text-xs text-slate-400">
                      JPG, PNG, or WEBP up to 5MB
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isLoading}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </FLabel>
          <FLabel label="PDF File" span2>
            <div className="space-y-3">
              <label className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 cursor-pointer hover:border-blue-400 transition-colors">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      {pdfName || "Select newsletter PDF"}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Upload a PDF version for download.
                    </p>
                  </div>
                  <Download size={18} className="text-slate-500" />
                </div>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfChange}
                  disabled={isLoading}
                  className="hidden"
                />
              </label>
              {typeof form.pdfUrl === "string" && form.pdfUrl && (
                <a
                  href={getPreviewUrl(form.pdfUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
                >
                  <FileText size={14} />
                  View existing PDF
                </a>
              )}
            </div>
          </FLabel>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-5 border-t border-slate-100">
          <button
            type="button"
            onClick={() =>
              valid &&
              onSave({
                ...form,
                tags: form.tags
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean),
              })
            }
            disabled={!valid || isLoading}
            className={`flex-1 py-3 rounded-xl border-none font-['Outfit',sans-serif] text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              valid && !isLoading
                ? "bg-linear-to-br from-blue-600 to-blue-900 text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            } ${isLoading ? "opacity-70" : ""}`}
          >
            <CheckCircle size={16} />
            {isLoading
              ? "Saving..."
              : isEdit
                ? "Save Changes"
                : "Create Newsletter"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className={`px-6 py-3 rounded-xl border border-slate-200 bg-white text-gray-500 font-['Outfit',sans-serif] text-sm font-semibold transition-colors ${
              isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-slate-100"
            }`}
          >
            Cancel
          </button>
        </div>

        {!valid && (
          <p className="mt-3 text-xs text-amber-600">
            Please add title, date, category, and description before saving.
          </p>
        )}
      </div>
    </Overlay>
  );
};

const AdminNewsLetter = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [modal, setModal] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notice, setNotice] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const noticeTimeoutRef = useRef(null);

  const scrollToTop = () => {
    if (noticeTimeoutRef.current?.scrollIntoView) {
      noticeTimeoutRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  usePageTitle("Newsletter Management");

  const categories = ["all", ...CATEGORY_OPTIONS];

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const fetchNewsletters = async () => {
    try {
      setIsFetching(true);
      const response = await newsLetterAPI.getAll();
      const payload = response.data?.data ?? response.data;
      setItems(Array.isArray(payload) ? payload : []);
    } catch (error) {
      console.error("Failed to load newsletters", error);
      setNotice({ type: "error", message: "Failed to load newsletters." });
    } finally {
      setIsFetching(false);
    }
  };

  const saveNewsletter = async (form) => {
    try {
      setIsSaving(true);
      const fd = new FormData();
      
      // ✅ Append form fields
      fd.append("title", form.title);
      fd.append("date", form.date);
      fd.append("category", form.category);
      fd.append("description", form.description);
      fd.append("author", form.author || "");
      
      // ✅ FIXED: Send tags as array (backend will parse it)
      if (Array.isArray(form.tags) && form.tags.length) {
        form.tags.forEach(tag => fd.append("tags", tag));
      }
      
      // ✅ FIXED: Use correct field name "imageUrl" to match backend
      if (form.imageUrl instanceof File) {
        fd.append("imageUrl", form.imageUrl);
      }
      
      // ✅ FIXED: Use correct field name "pdf" to match backend
      if (form.pdfUrl instanceof File) {
        fd.append("pdf", form.pdfUrl);
      }

      // Debug log
      console.log("📤 Sending FormData:");
      for (let [key, value] of fd.entries()) {
        console.log(`  ${key}:`, value instanceof File ? `File(${value.name})` : value);
      }

      if (modal?.data?._id) {
        await newsLetterAPI.update(modal.data._id, fd);
        setNotice({
          type: "success",
          message: "Newsletter updated successfully.",
        });
      } else {
        await newsLetterAPI.create(fd);
        setNotice({
          type: "success",
          message: "Newsletter created successfully.",
        });
      }

      setModal(null);
      await fetchNewsletters();
    } catch (error) {
      console.error("Save newsletter error", error);
      console.error("Full error response:", error.response?.data);
      
      setNotice({
        type: "error",
        message:
          error.response?.data?.message ||
          error.message ||
          "Unable to save newsletter.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await newsLetterAPI.delete(modal.data._id);
      setNotice({ type: "success", message: "Newsletter deleted." });
      setModal(null);
      await fetchNewsletters();
    } catch (error) {
      console.error("Delete newsletter error", error);
      setNotice({
        type: "error",
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to delete newsletter.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredItems = items
    .filter((item) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.author?.toLowerCase().includes(query) ||
        (Array.isArray(item.tags)
          ? item.tags.some((tag) => tag.toLowerCase().includes(query))
          : false);
      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Pagination logic
  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="space-y-6 md:p-26" ref={noticeTimeoutRef}>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm text-slate-500 uppercase tracking-[1px] font-semibold">
            Admin / Newsletter
          </p>
          <h1 className="text-3xl font-['Playfair_Display',serif] font-extrabold text-slate-950">
            Newsletter Management
          </h1>
          <p className="max-w-2xl mt-2 text-sm text-slate-500">
            Create, edit, and publish newsletters, alumni stories, accolades,
            and institute updates.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModal({ type: "add" })}
          className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-br from-blue-600 to-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:brightness-105 transition-all"
        >
          <Plus size={16} /> New Newsletter
        </button>
      </div>

      {notice && (
        <div
          className={`rounded-2xl px-4 py-3 text-sm font-medium ${
            notice.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
              : "bg-red-50 text-red-700 border border-red-100"
          }`}
        >
          {notice.message}
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="relative flex-1 max-w-[420px]">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <Inp
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search newsletters…"
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setCategoryFilter(category)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    categoryFilter === category
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {category === "all" ? "All" : category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {isFetching ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 py-14 text-center text-slate-500">
                <Loader size={24} className="mx-auto mb-3 animate-spin" />
                Loading newsletters...
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center text-slate-500">
                <p className="text-lg font-semibold">No newsletters found</p>
                <p className="mt-2 text-sm text-slate-400">
                  Use the button above to create a new newsletter entry.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {paginatedItems.map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-14 w-14 rounded-3xl bg-slate-100 overflow-hidden flex items-center justify-center">
                          {item.imageUrl ? (
                            <img
                              src={getPreviewUrl(item.imageUrl)}
                              alt={item.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <FileText size={24} className="text-slate-400" />
                          )}
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-slate-900">
                            {item.title}
                          </h2>
                          <p className="text-sm text-slate-500 mt-1">
                            {item.author || "Unknown author"} ·{" "}
                            {new Date(item.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                          {item.category}
                        </span>
                        {item.tags?.length > 0 && (
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                            {item.tags.slice(0, 3).join(", ")}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-slate-600 line-clamp-3">
                      {item.description}
                    </p>

                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      <a
                        href={getPreviewUrl(item.imageUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        <FileText size={14} /> Image
                      </a>
                      <a
                        href={getPreviewUrl(item.pdfUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        <Download size={14} /> PDF
                      </a>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(item.tags) &&
                          item.tags.slice(0, 5).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600"
                            >
                              {tag}
                            </span>
                          ))}
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setModal({ type: "edit", data: item })}
                          className="inline-flex h-10 min-w-[110px] items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                        >
                          <Pencil size={14} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setModal({ type: "delete", data: item })
                          }
                          className="inline-flex h-10 min-w-[110px] items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-700 hover:bg-red-100"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  scrollToTop();
                  setCurrentPage((prev) => Math.max(prev - 1, 1));
                }}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md border border-slate-300 bg-white text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-slate-500">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => {
                  scrollToTop();
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                }}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md border border-slate-300 bg-white text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold text-slate-500 uppercase tracking-[1px] mb-4">
            Summary
          </div>
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-100 bg-slate-50 px-4 py-4">
              <p className="text-sm text-slate-500">Total newsletters</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {items.length}
              </p>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-slate-50 px-4 py-4">
              <p className="text-sm text-slate-500">Selected category</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {categoryFilter === "all" ? "All categories" : categoryFilter}
              </p>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {modal?.type === "add" && (
          <NewsLetterFormModal
            onSave={saveNewsletter}
            onClose={() => setModal(null)}
            isLoading={isSaving}
          />
        )}
        {modal?.type === "edit" && (
          <NewsLetterFormModal
            initial={modal.data}
            onSave={saveNewsletter}
            onClose={() => setModal(null)}
            isLoading={isSaving}
          />
        )}
        {modal?.type === "delete" && (
          <DeleteModal
            label={modal.data.title}
            onConfirm={handleDelete}
            onClose={() => setModal(null)}
            isLoading={isDeleting}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminNewsLetter;