import React, { useState, useEffect, useMemo, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Images,
  ArrowLeft,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Tag,
  Search,
  ImageOff,
  SlidersHorizontal,
  Grid3x3,
  LayoutGrid,
  Maximize2,
} from "lucide-react";
import { albumsAPI, API_BASE } from "../services/api";
import usePageTitle from "../hooks/usePageTitle";

/* ─── helpers ─── */

// Normalize Windows backslash paths → forward slashes + prepend base URL
const imgUrl = (path = "") => {
  if (!path) return null;
  if (typeof path === "string" && /^(https?:)?\/\//.test(path)) return path;
  return `${API_BASE}/${path.replace(/\\/g, "/")}`;
};

const normalizeImagePaths = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(Boolean);
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [raw];
    } catch {
      return raw
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }
  return [];
};

// Parse tags — stored as JSON strings like '["Meeting","memorial"]' or plain arrays
const parseTags = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    // might be ["[\"Meeting\",\"memorial\"]"] — one JSON string inside array
    if (
      raw.length === 1 &&
      typeof raw[0] === "string" &&
      raw[0].startsWith("[")
    ) {
      try {
        return JSON.parse(raw[0]);
      } catch {
        return raw;
      }
    }
    return raw.filter(Boolean);
  }
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return [raw];
    }
  }
  return [];
};

// Stagger animation variant factory
const stagger = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, delay, ease: "easeOut" },
  },
});

/* ─── sub-components ─── */

// Skeleton placeholder
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-slate-200 rounded-xl ${className}`} />
);

// Fallback when image fails
const ImgWithFallback = ({ src, alt, className, onClick }) => {
  const [err, setErr] = useState(false);
  return err || !src ? (
    <div
      className={`flex flex-col items-center justify-center bg-slate-100 text-slate-400 ${className}`}
    >
      <ImageOff size={28} />
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setErr(true)}
      onClick={onClick}
      loading="lazy"
    />
  );
};

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
const GalleryPage = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeAlbum, setActiveAlbum] = useState(null); // null = grid view
  const [lightboxIdx, setLightboxIdx] = useState(null); // null = closed
  const [search, setSearch] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [gridDense, setGridDense] = useState(false);
  const [imgLoadMap, setImgLoadMap] = useState({}); // track loaded state per img
  usePageTitle("Gallery");

  /* ── fetch ── */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await albumsAPI.getAll();
        const data = Array.isArray(res.data)
          ? res.data
          : (res.data?.data ?? res.data?.albums ?? []);
        setAlbums(data);
      } catch (e) {
        setError("Could not load albums. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const activeImages = useMemo(
    () => normalizeImagePaths(activeAlbum?.images),
    [activeAlbum?.images],
  );

  /* ── keyboard for lightbox ── */
  useEffect(() => {
    if (lightboxIdx === null) return;
    const imgs = activeImages;
    const handler = (e) => {
      if (!imgs.length) return;
      if (e.key === "ArrowRight") setLightboxIdx((i) => (i + 1) % imgs.length);
      if (e.key === "ArrowLeft")
        setLightboxIdx((i) => (i - 1 + imgs.length) % imgs.length);
      if (e.key === "Escape") setLightboxIdx(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIdx, activeImages]);

  /* ── derived ── */
  const years = useMemo(
    () =>
      [...new Set(albums.map((a) => String(a.year)).filter(Boolean))].sort(
        (a, b) => b - a,
      ),
    [albums],
  );

  const filtered = useMemo(
    () =>
      albums.filter((a) => {
        const q = search.toLowerCase();
        const matchQ =
          !q ||
          a.title?.toLowerCase().includes(q) ||
          a.event?.toLowerCase().includes(q);
        const matchY = !filterYear || String(a.year) === filterYear;
        return matchQ && matchY;
      }),
    [albums, search, filterYear],
  );

  const openAlbum = (album) => {
    setActiveAlbum(album);
    window.scrollTo(0, 0);
  };
  const closeAlbum = () => {
    setActiveAlbum(null);
    setLightboxIdx(null);
  };

  const openLightbox = (idx) => setLightboxIdx(idx);
  const closeLightbox = () => setLightboxIdx(null);
  const lbPrev = () =>
    setLightboxIdx(
      (i) => (i - 1 + (activeImages.length || 1)) % (activeImages.length || 1),
    );
  const lbNext = () =>
    setLightboxIdx((i) => (i + 1) % (activeImages.length || 1));

  /* ════ LOADING ════ */
  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-5 sm:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-64" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </div>
      </div>
    );

  /* ════ ERROR ════ */
  if (error)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <ImageOff size={44} className="text-slate-400 mx-auto mb-4" />
          <p className="text-slate-700 font-medium text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-5 py-2 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );

  /* ════ ALBUM DETAIL VIEW ════ */
  if (activeAlbum) {
    const images = activeImages;
    const tags = parseTags(activeAlbum.tags);

    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-16">
        {/* Detail Header */}
        <div className="max-w-7xl mx-auto px-5 sm:px-10 mb-8">
          <motion.div initial="hidden" animate="visible">
            {/* Back */}
            <button
              onClick={closeAlbum}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-bold mb-6 transition-colors group"
            >
              <ArrowLeft
                size={15}
                className="group-hover:-translate-x-0.5 transition-transform text-slate-600"
              />
              All Albums
            </button>

            {/* Title row */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
              <div>
                <p
                  className="text-[10px] font-extrabold uppercase tracking-[0.2em] mb-2"
                  style={{ color: activeAlbum.accent || "#a78bfa" }}
                >
                  {activeAlbum.event}
                </p>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  {activeAlbum.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 mt-3">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <Calendar size={12} /> {activeAlbum.date}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <Images size={12} /> {activeAlbum.photos || images.length}{" "}
                    photos
                  </span>
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border"
                      style={{
                        color: activeAlbum.accent,
                        borderColor: `${activeAlbum.accent}40`,
                        background: `${activeAlbum.accent}12`,
                      }}
                    >
                      <Tag size={9} /> {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dense toggle */}
              <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1">
                <button
                  onClick={() => setGridDense(false)}
                  className={`p-2 rounded-lg transition-all ${!gridDense ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  onClick={() => setGridDense(true)}
                  className={`p-2 rounded-lg transition-all ${gridDense ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <Grid3x3 size={15} />
                </button>
              </div>
            </div>

            {/* Accent line */}
            <div
              className="mt-5 h-px w-full"
              style={{
                background: `linear-gradient(to right, ${activeAlbum.accent}80, transparent)`,
              }}
            />
          </motion.div>
        </div>

        {/* Photo grid */}
        <div className="max-w-7xl mx-auto px-5 sm:px-10">
          {images.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-slate-400">
              <ImageOff size={44} className="mb-3" />
              <p className="text-sm font-medium text-slate-600">
                No photos in this album
              </p>
            </div>
          ) : (
            <motion.div
              className={`grid gap-3 ${
                gridDense
                  ? "grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              }`}
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
            >
              {images.map((imgPath, idx) => (
                <motion.div
                  key={idx}
                  variants={stagger(0)}
                  className="relative group overflow-hidden rounded-xl cursor-pointer bg-slate-100"
                  style={{ aspectRatio: gridDense ? "1" : "4/3" }}
                  onClick={() => openLightbox(idx)}
                >
                  <ImgWithFallback
                    src={imgUrl(imgPath)}
                    alt={`Photo ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Maximize2 size={16} className="text-white" />
                    </div>
                  </div>

                  {/* Index badge */}
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-black/50 backdrop-blur-sm text-[10px] font-bold text-white/60 opacity-0 group-hover:opacity-100 transition-opacity">
                    {idx + 1}/{images.length}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* ── Lightbox ── */}
        <AnimatePresence>
          {lightboxIdx !== null && images[lightboxIdx] && (
            <motion.div
              className="fixed inset-0 z-[2000] bg-slate-900/85 flex items-center justify-center"
              initial="hidden"
              animate="visible"
              onClick={closeLightbox}
            >
              {/* Close */}
              <button
                onClick={closeLightbox}
                className="absolute top-5 right-5 w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all z-10"
              >
                <X size={18} />
              </button>

              {/* Counter */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white/60 text-xs font-bold">
                {lightboxIdx + 1} / {images.length}
              </div>

              {/* Prev */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  lbPrev();
                }}
                className="absolute left-4 sm:left-8 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all z-10"
              >
                <ChevronLeft size={22} />
              </button>

              {/* Image */}
              <motion.div
                key={lightboxIdx}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.25 }}
                className="max-w-5xl max-h-[82vh] w-full mx-16 sm:mx-24 flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={imgUrl(images[lightboxIdx])}
                  alt={`Photo ${lightboxIdx + 1}`}
                  className="max-w-full max-h-[82vh] object-contain rounded-xl shadow-2xl"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </motion.div>

              {/* Next */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  lbNext();
                }}
                className="absolute right-4 sm:right-8 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all z-10"
              >
                <ChevronRight size={22} />
              </button>

              {/* Thumbnail strip */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-black/60 backdrop-blur-md max-w-[90vw] overflow-x-auto">
                {images.map((p, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIdx(i);
                    }}
                    className={`flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden transition-all duration-200 ${i === lightboxIdx ? "ring-2 opacity-100 scale-110" : "opacity-40 hover:opacity-70"}`}
                    style={{ ringColor: activeAlbum.accent }}
                  >
                    <ImgWithFallback
                      src={imgUrl(p)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  /* ════ ALBUM GRID VIEW ════ */
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-5 sm:px-10 mb-10">
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.45 }}
        >
          <p className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-[0.2em] mb-2">
            PSG Alumni
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none">
                Gallery
              </h1>
              <p className="text-slate-600 text-sm font-medium mt-2">
                {filtered.length} album{filtered.length !== 1 ? "s" : ""} ·
                memories captured
              </p>
            </div>

            {/* Search + Filter */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search
                  size={13}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search albums…"
                  className="pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all w-52"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Year filter */}
              {years.length > 0 && (
                <div className="relative">
                  <select
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    className="appearance-none pl-4 pr-8 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-indigo-500 cursor-pointer transition-all"
                  >
                    <option value="">All Years</option>
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                  <SlidersHorizontal
                    size={12}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Accent separator */}
          <div className="mt-6 h-px bg-gradient-to-r from-indigo-500/40 via-slate-300 to-transparent" />
        </motion.div>
      </div>

      {/* Album Grid */}
      <div className="max-w-7xl mx-auto px-5 sm:px-10">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400">
            <Images size={44} className="mb-3 text-slate-400" />
            <p className="text-sm font-medium text-slate-600">
              No albums match your search
            </p>
            {(search || filterYear) && (
              <button
                onClick={() => {
                  setSearch("");
                  setFilterYear("");
                }}
                className="mt-3 text-indigo-600 text-sm font-bold hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          >
            {filtered.map((album, i) => {
              const tags = parseTags(album.tags);
              const cover = imgUrl(album.coverImage);
              const accent = album.accent || "#6366f1";

              return (
                <motion.div
                  key={album.id || i}
                  variants={stagger(0)}
                  whileHover={{ y: -6 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openAlbum(album)}
                  className="group relative overflow-hidden rounded-2xl cursor-pointer border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
                >
                  {/* Cover image */}
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <ImgWithFallback
                      src={cover}
                      alt={album.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-40" />

                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `radial-gradient(ellipse at 50% 110%, ${accent}30, transparent 70%)`,
                      }}
                    />

                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200">
                      <Images size={11} className="text-slate-500" />
                      <span className="text-[11px] font-extrabold text-slate-700">
                        {album.photos ||
                          normalizeImagePaths(album.images).length}
                      </span>
                    </div>

                    <div
                      className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-extrabold"
                      style={{
                        background: `${accent}15`,
                        color: accent,
                        border: `1px solid ${accent}30`,
                      }}
                    >
                      {album.year}
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="px-5 py-4">
                    {/* Event label */}
                    <p
                      className="text-[10px] font-extrabold uppercase tracking-[0.15em] mb-1.5 transition-colors"
                      style={{ color: accent }}
                    >
                      {album.event}
                    </p>

                    {/* Title */}
                    <h2 className="text-base font-extrabold text-slate-900 group-hover:text-slate-800 leading-snug mb-2 line-clamp-1">
                      {album.title}
                    </h2>

                    {/* Meta row */}
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Calendar size={11} /> {album.date}
                      </span>
                      {tags.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          {tags.slice(0, 2).map((t) => (
                            <span
                              key={t}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                              style={{
                                background: `${accent}18`,
                                color: `${accent}cc`,
                              }}
                            >
                              {t}
                            </span>
                          ))}
                          {tags.length > 2 && (
                            <span className="text-[10px] font-semibold text-slate-400">
                              +{tags.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom accent line */}
                  <div
                    className="h-0.5 w-0 group-hover:w-full transition-all duration-500 origin-left"
                    style={{
                      background: `linear-gradient(to right, ${accent}, ${accent}40)`,
                    }}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
