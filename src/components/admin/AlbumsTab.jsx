import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Camera,
  Image,
  Pencil,
  Trash2,
  Loader,
} from "lucide-react";

import { albumsAPI } from "../../services/api";
import { DeleteModal } from "./AdminSharedUI";
import { AlbumFormModal } from "./AlbumFormModal";

const DEFAULT_ALBUMS_DATA = {};
const BASE_URL = "http://localhost:5000";

const normalizeAlbumsData = (payload) => {
  if (!payload) return DEFAULT_ALBUMS_DATA;

  if (Array.isArray(payload)) {
    return payload.reduce((acc, album) => {
      const year = String(
        album.year ??
          (album.date
            ? new Date(album.date).getFullYear()
            : "unknown")
      );

      const photos =
        parseInt(album.photos, 10) ||
        (Array.isArray(album.images)
          ? album.images.length
          : 0) ||
        0;

      if (!acc[year]) {
        acc[year] = {
          coverColor: album.coverColor || "#667eea",
          totalPhotos: 0,
          albums: [],
        };
      }

      acc[year].albums.push(album);
      acc[year].totalPhotos += photos;

      return acc;
    }, {});
  }

  return payload;
};

export const AlbumsTab = ({ onError, onSuccess }) => {
  const [albumsData, setAlbumsData] =
    useState(DEFAULT_ALBUMS_DATA);

  const [selectedYear, setSelectedYear] =
    useState("");

  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [newYear, setNewYear] = useState("");
  const [showAddYear, setShowAddYear] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] =
    useState(true);

  const years = Object.keys(albumsData).sort(
    (a, b) => b - a
  );

  const activeYear =
    selectedYear && albumsData[selectedYear]
      ? selectedYear
      : years[0] || "";

  const yearData = albumsData[activeYear];

  const filtered = (yearData?.albums || []).filter(
    (a) =>
      a.title
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      (Array.isArray(a.tags) ? a.tags : []).some((t) =>
        t.toLowerCase().includes(search.toLowerCase())
      )
  );

  const fetchAlbums = useCallback(async () => {
    try {
      setIsFetching(true);

      const response = await albumsAPI.getAll();

      console.log(
        "ALBUM API RESPONSE:",
        response.data
      );

      const payload =
        response.data?.data ??
        response.data ??
        [];

      const processedPayload = payload.map(
        (album) => {
          let coverImage =
            album.coverImage || "";

          if (
            coverImage.startsWith(
              "uploads/uploads"
            )
          ) {
            coverImage = coverImage.replace(
              "uploads/uploads",
              "uploads"
            );
          }

          coverImage = coverImage.replace(
            /\\/g,
            "/"
          );

          const images = Array.isArray(album.images)
            ? album.images.map((img) =>
                img
                  .replace(/\\/g, "/")
                  .replace(
                    "uploads/uploads",
                    "uploads"
                  )
              )
            : [];

          return {
            ...album,
            coverImage,
            images,
          };
        }
      );

      console.log(
        "PROCESSED ALBUMS:",
        processedPayload
      );

      const normalized =
        normalizeAlbumsData(processedPayload);

      setAlbumsData(normalized);

      if (
        !selectedYear &&
        Object.keys(normalized).length
      ) {
        setSelectedYear(
          Object.keys(normalized).sort(
            (a, b) => b - a
          )[0]
        );
      }
    } catch (err) {
      console.error(
        "Failed to fetch albums:",
        err
      );

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to load albums";

      onError(errorMessage);
    } finally {
      setIsFetching(false);
    }
  }, [selectedYear, onError]);

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  useEffect(() => {
    if (!selectedYear && years.length) {
      setSelectedYear(years[0]);
    } else if (
      selectedYear &&
      !albumsData[selectedYear] &&
      years.length
    ) {
      setSelectedYear(years[0]);
    }
  }, [albumsData, years, selectedYear]);

  const buildImageUrl = (album) => {
    const imagePath =
      album.coverImage ||
      album.images?.[0] ||
      "";

    if (!imagePath) {
      return "https://via.placeholder.com/600x400?text=No+Image";
    }

    return `${BASE_URL}/${imagePath}`;
  };

  const buildFormData = (form) => {
    const fd = new FormData();

    Object.entries(form).forEach(
      ([key, value]) => {
        if (
          value === undefined ||
          value === null
        )
          return;

        if (
          key === "tags" &&
          Array.isArray(value)
        ) {
          fd.append(
            "tags",
            JSON.stringify(value)
          );
        } else if (
          key === "images" &&
          Array.isArray(value)
        ) {
          value.forEach((file) => {
            if (file instanceof File) {
              fd.append("images", file);
            }
          });
        } else {
          fd.append(key, String(value));
        }
      }
    );

    if (activeYear) {
      fd.append("year", activeYear);
    }

    return fd;
  };

  const handleSaveAlbum = async (form) => {
    try {
      setIsLoading(true);

      const fd = buildFormData(form);

      if (modal.data?.id) {
        await albumsAPI.update(
          modal.data.id,
          fd
        );

        onSuccess(
          `✓ Album "${form.title}" updated successfully!`
        );
      } else {
        await albumsAPI.create(fd);

        onSuccess(
          `✓ Album "${form.title}" created successfully!`
        );
      }

      setModal(null);

      await fetchAlbums();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to save album";

      onError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAlbum = async (
    id,
    title
  ) => {
    try {
      setIsLoading(true);

      await albumsAPI.delete(id);

      onSuccess(
        `✓ Album "${title}" deleted successfully!`
      );

      setModal(null);

      await fetchAlbums();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Failed to delete album";

      onError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddYear = () => {
    const y = parseInt(newYear, 10);

    if (
      !y ||
      y < 1980 ||
      y > 2100 ||
      albumsData[y]
    )
      return;

    setAlbumsData((prev) => ({
      ...prev,

      [String(y)]: {
        coverColor: "#667eea",
        totalPhotos: 0,
        albums: [],
      },
    }));

    setSelectedYear(String(y));
    setNewYear("");
    setShowAddYear(false);
  };

  return (
    <div className="relative">
      {isFetching && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 rounded-2xl flex items-center justify-center">
          <Loader
            size={32}
            className="text-blue-500 animate-spin"
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 mb-4.5">
        <span className="text-[10px] text-gray-400 font-bold tracking-[1.5px] font-['Outfit',sans-serif] mr-1">
          YEAR:
        </span>

        {years.map((y) => {
          const yd = albumsData[y];
          const isSel = selectedYear === y;

          return (
            <button
              key={y}
              onClick={() => {
                setSelectedYear(y);
                setSearch("");
              }}
              className={`px-4 py-1.5 rounded-xl border-2 font-['Playfair_Display',serif] text-[15px] font-bold transition-all shadow-sm ${
                isSel
                  ? "shadow-md scale-105"
                  : "bg-white border-transparent text-gray-500 hover:border-slate-200"
              }`}
              style={
                isSel
                  ? {
                      borderColor: `${yd.coverColor}50`,
                      backgroundColor: `${yd.coverColor}10`,
                      color: yd.coverColor,
                    }
                  : {}
              }
            >
              {y}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="p-16 text-center bg-white border border-slate-200 rounded-3xl text-gray-400 shadow-sm flex flex-col items-center justify-center">
          <Camera
            size={40}
            className="opacity-30 mb-3"
          />

          <div className="font-semibold text-lg">
            No albums found
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((album, i) => (
            <motion.div
              key={album._id || album.id}
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: i * 0.04,
              }}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="relative h-52 bg-slate-100 overflow-hidden">
                <img
                  src={buildImageUrl(album)}
                  alt={album.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    console.log(
                      "FAILED IMAGE:",
                      e.target.src
                    );

                    e.target.src =
                      "https://via.placeholder.com/600x400?text=No+Image";
                  }}
                />

                <div
                  className="absolute inset-x-0 top-0 h-2"
                  style={{
                    background: `linear-gradient(90deg, ${
                      album.accent ||
                      "#667eea"
                    }, ${
                      album.accent ||
                      "#667eea"
                    }88)`,
                  }}
                />
              </div>

              <div className="p-5 flex flex-col">
                <div className="flex gap-1.5 flex-wrap mb-3">
                  {(Array.isArray(album.tags)
                    ? album.tags
                    : []
                  )
                    .slice(0, 3)
                    .map((t) => (
                      <span
                        key={t}
                        className="rounded border px-2 py-0.5 text-[9px] font-bold tracking-wider"
                        style={{
                          background: `${
                            album.accent ||
                            "#667eea"
                          }10`,
                          color:
                            album.accent ||
                            "#667eea",
                          borderColor: `${
                            album.accent ||
                            "#667eea"
                          }25`,
                        }}
                      >
                        {t.toUpperCase()}
                      </span>
                    ))}
                </div>

                <h3 className="text-[16px] font-extrabold text-[#0c0e1a] mb-2">
                  {album.title}
                </h3>

                <p className="text-gray-500 text-[12px] mb-4">
                  {album.event}
                </p>

                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <span className="flex items-center gap-1.5 text-gray-500 text-[11px] font-bold">
                    <Image size={12} />

                    {album.photos || 0} photos
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setModal({
                          type: "edit",
                          data: album,
                        })
                      }
                      className="w-8 h-8 border rounded-xl flex items-center justify-center hover:bg-blue-50"
                    >
                      <Pencil size={13} />
                    </button>

                    <button
                      onClick={() =>
                        setModal({
                          type: "delete",
                          data: album,
                        })
                      }
                      className="w-8 h-8 border rounded-xl flex items-center justify-center hover:bg-red-50"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal?.type === "add" && (
          <AlbumFormModal
            year={selectedYear}
            onSave={handleSaveAlbum}
            onClose={() => setModal(null)}
            isLoading={isLoading}
          />
        )}

        {modal?.type === "edit" && (
          <AlbumFormModal
            initial={modal.data}
            year={selectedYear}
            onSave={handleSaveAlbum}
            onClose={() => setModal(null)}
            isLoading={isLoading}
          />
        )}

        {modal?.type === "delete" && (
          <DeleteModal
            label={modal.data.title}
            onConfirm={() =>
              handleDeleteAlbum(
                modal.data.id,
                modal.data.title
              )
            }
            onClose={() => setModal(null)}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AlbumsTab;