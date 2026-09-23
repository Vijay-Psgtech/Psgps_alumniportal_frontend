// src/pages/alumni/AlumniMap.jsx
// ✅ Redesigned with Tailwind CSS — no custom <style> block

import React, { useState, useEffect, useCallback, useMemo, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { alumniAPI, API_BASE } from "../../services/api";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import {
  X,
  MapPin,
  Mail,
  Linkedin,
  Phone,
  Briefcase,
  GraduationCap,
  Globe,
  Building2,
  CheckCircle,
  AlertCircle,
  Users,
} from "lucide-react";
import ImageModal from "../../components/ImageModal";
import { useAuth } from "../../context/AuthContext";
import usePageTitle from "../../hooks/usePageTitle";

import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

/* ── Fix default Leaflet icon ─────────────────── */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

/* ── Auto-fit map bounds ──────────────────────── */
const FitBounds = ({ alumni }) => {
  const map = useMap();
  useEffect(() => {
    if (!alumni.length) return;
    const bounds = L.latLngBounds(
      alumni
        .filter(
          (a) => a.location?.coordinates?.[1] && a.location?.coordinates?.[0],
        )
        .map((a) => [a.location.coordinates[1], a.location.coordinates[0]]),
    );
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [50, 50] });
  }, [alumni, map]);
  return null;
};

/* ── Stat Pill ────────────────────────────────── */
const StatPill = ({ icon: Icon, value, label, color }) => (
  <div className="flex items-center gap-3 bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-3.5">
    <div
      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}
    >
      <Icon size={16} className="text-white" />
    </div>
    <div>
      <p className="text-xl font-extrabold text-slate-900 leading-none">
        {value}
      </p>
      <p className="text-xs text-slate-400 font-medium mt-0.5">{label}</p>
    </div>
  </div>
);

/* ── Info Row inside modal ─────────────────────── */
const ModalRow = ({
  icon: Icon,
  label,
  children,
  iconColor = "text-indigo-500",
  bgColor = "bg-indigo-50",
}) => (
  <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
    <div
      className={`mt-0.5 w-7 h-7 rounded-lg ${bgColor} flex items-center justify-center flex-shrink-0`}
    >
      <Icon size={13} className={iconColor} />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
        {label}
      </p>
      {children}
    </div>
  </div>
);

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
const AlumniMap = () => {
  const { user } = useAuth();
  const isAdmin =
    user?.role === "admin" || user?.role === "superadmin" || false;

  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mapData, setMapData] = useState({
    alumni: [],
    stats: { totalAlumni: 0, countriesRepresented: 0, citiesRepresented: 0 },
  });
  const [imageModal, setImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  usePageTitle("Alumni World Map");

  useEffect(() => {
    const loadMapData = async () => {
      const params = isAdmin ? { department: user.department } : {};
      try {
        setLoading(true);
        const response = await alumniAPI.getMapData(params);
        const data = response.data?.data || {};
        setMapData({ alumni: data.alumni || [], stats: data.stats || {} });
      } catch {
        setError("Failed to load map data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadMapData();
  }, []);

  const validAlumni = useMemo(
    () =>
      mapData.alumni.filter(
        (a) => a.location?.coordinates?.[1] && a.location?.coordinates?.[0],
      ),
    [mapData.alumni],
  );

  const selectedInitials = selectedAlumni
    ? `${selectedAlumni.firstName?.charAt(0) ?? ""}${selectedAlumni.lastName?.charAt(0) ?? ""}`.toUpperCase()
    : "";

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 flex flex-col items-center justify-center gap-4 pt-20">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-blue-500 animate-spin" />
        <p className="text-slate-400 text-sm font-medium">
          🌍 Loading interactive world map…
        </p>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 flex items-center justify-center p-6 pt-20">
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm px-8 py-10 max-w-sm w-full text-center">
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={22} className="text-red-500" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-2">
            Map Unavailable
          </h3>
          <p className="text-slate-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 pt-24 pb-16 px-4 sm:px-6">
        <div className="container mx-auto px-6">
          {/* ── Page Header ── */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-none mb-4">
              Alumni World Map
            </h1>
            <p className="text-slate-500 text-base max-w-md mx-auto">
              Click on any marker to explore alumni from around the globe
            </p>
          </motion.div>

          {/* ── Stats Row ── */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            <StatPill
              icon={Users}
              value={mapData.stats?.totalAlumni || 0}
              label="Alumni Located"
              color="bg-blue-500"
            />
            <StatPill
              icon={Globe}
              value={mapData.stats?.countriesRepresented || 0}
              label="Countries"
              color="bg-emerald-500"
            />
            <StatPill
              icon={MapPin}
              value={mapData.stats?.citiesRepresented || 0}
              label="Cities"
              color="bg-amber-500"
            />
          </motion.div>

          {/* ── Map + Side Panel Layout ── */}
          <motion.div
            className="flex flex-col lg:flex-row gap-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {/* Map Container */}
            <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-[#667eea] to-[#764ba2]" />
              <div className="p-1">
                <MapContainer
                  center={[20, 0]}
                  zoom={2}
                  style={{
                    height: "620px",
                    width: "100%",
                    borderRadius: "12px",
                  }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <FitBounds alumni={validAlumni} />
                  <MarkerClusterGroup>
                    {validAlumni.map((alumnus) => (
                      <Marker
                        key={alumnus._id}
                        position={[
                          alumnus.location.coordinates[1],
                          alumnus.location.coordinates[0],
                        ]}
                        eventHandlers={{
                          click: () => setSelectedAlumni(alumnus),
                        }}
                      >
                        <Popup>
                          <strong>
                            {alumnus.firstName} {alumnus.lastName}
                          </strong>
                          <br />
                          {alumnus.city}
                          {alumnus.country && `, ${alumnus.country}`}
                        </Popup>
                      </Marker>
                    ))}
                  </MarkerClusterGroup>
                </MapContainer>
              </div>
            </div>

            {/* ── Side Panel (desktop) / Bottom Sheet (mobile) ── */}
            <AnimatePresence>
              {selectedAlumni ? (
                <motion.aside
                  key="panel"
                  initial={{ opacity: 0, x: 32 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 32 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="w-full lg:w-80 xl:w-96 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col"
                >
                  {/* Panel header accent */}
                  <div className="h-1 bg-gradient-to-r from-[#667eea] to-[#764ba2]" />

                  {/* Avatar + name block */}
                  <div className="relative bg-gradient-to-br from-blue-50 to-blue-50 px-6 pt-6 pb-5">
                    <button
                      onClick={() => setSelectedAlumni(null)}
                      className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/80 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-white transition-all"
                    >
                      <X size={15} />
                    </button>

                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-500 flex items-center justify-center text-white text-xl font-extrabold shadow-lg shadow-blue-200 flex-shrink-0 select-none">
                        {selectedAlumni.files?.currentPhoto ? (
                          <img
                            src={`${API_BASE}/uploads/${selectedAlumni.files?.currentPhoto}`}
                            alt="Profile"
                            className="w-full h-full object-cover hover:cursor-pointer"
                            onClick={() => {
                              setSelectedImage(
                                selectedAlumni.files?.currentPhoto,
                              );
                              setImageModal(true);
                            }}
                          />
                        ) : (
                          selectedInitials || "?"
                        )}
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-lg font-extrabold text-slate-900 leading-tight truncate">
                          {selectedAlumni.firstName} {selectedAlumni.lastName}
                        </h2>
                        {selectedAlumni.isApproved && (
                          <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                            <CheckCircle size={9} /> Verified Alumni
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick stat chips */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {selectedAlumni.batchYear && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-blue-100 text-blue-600 shadow-sm">
                          <GraduationCap size={11} /> Class of{" "}
                          {selectedAlumni.batchYear}
                        </span>
                      )}
                      {selectedAlumni.department && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-blue-100 text-blue-600 shadow-sm">
                          {selectedAlumni.department}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info rows */}
                  <div className="flex-1 px-5 py-2 overflow-y-auto">
                    <>
                      {/*Degree & Department  */}
                      <ModalRow
                        icon={GraduationCap}
                        label="Education"
                        iconColor="text-blue-600"
                        bgColor="bg-blue-50"
                      >
                        <p className="text-sm text-slate-700 font-medium">
                          {selectedAlumni.degree || "—"}
                          {selectedAlumni.department
                            ? `, ${selectedAlumni.department}`
                            : ""}
                        </p>
                            

                      </ModalRow>
                      <ModalRow
                        icon={MapPin}
                        label="Location"
                        iconColor="text-emerald-600"
                        bgColor="bg-emerald-50"
                      >
                        <p className="text-sm text-slate-700 font-medium">
                          {selectedAlumni.fullAddress ||
                            `${selectedAlumni.city || ""}${selectedAlumni.country ? `, ${selectedAlumni.country}` : ""}`}
                        </p>
                      </ModalRow>

                      {selectedAlumni.currentCompany && (
                        <ModalRow
                          icon={Building2}
                          label="Company"
                          iconColor="text-amber-600"
                          bgColor="bg-amber-50"
                        >
                          <p className="text-sm text-slate-700 font-medium">
                            {selectedAlumni.currentCompany}
                          </p>
                        </ModalRow>
                      )}

                      {selectedAlumni.jobTitle && (
                        <ModalRow
                          icon={Briefcase}
                          label="Position"
                          iconColor="text-blue-600"
                          bgColor="bg-blue-50"
                        >
                          <p className="text-sm text-slate-700 font-medium">
                            {selectedAlumni.jobTitle}
                          </p>
                        </ModalRow>
                      )}
                    </>
                  </div>
                </motion.aside>
              ) : (
                /* Placeholder panel when nothing is selected */
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hidden lg:flex w-80 xl:w-96 bg-white rounded-2xl border border-dashed border-slate-200 flex-col items-center justify-center text-center p-8 gap-4"
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <MapPin size={24} className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-600 mb-1.5">
                      Select a Marker
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Click any pin on the map to view that alumni's information.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
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

export default AlumniMap;
