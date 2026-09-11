import React, { useState, useRef } from "react";
import {
  Search,
  Clock,
  CheckCircle,
  GraduationCap,
  Building2,
  Mail,
  ExternalLink,
  ChevronRight,
  Users,
  Crown,
  Briefcase,
  Zap,
  Building2Icon,
  MapPin,
  Building,
  Calendar,
  XCircle,
  Linkedin,
  UserCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { a } from "framer-motion/client";

export const AlumniTab = ({ 
  alumniList, 
  setSelectedItem,
  pageData = { totalAlumni: 0, totalPages: 1, currentPage: 1 },
  userRole = "admin",
  userDepartment = "",
  onPageChange = () => {},
  onFilterChange = () => {},
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'pending', 'approved'
  const [deptFilter, setDeptFilter] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const alumniRef = useRef(null);

  // ✅ OPTIMIZED: Derive unique values only from current page data
  const departments = Array.from(
    new Set(alumniList.map((a) => a.department).filter(Boolean)),
  ).sort();
  const batches = Array.from(
    new Set(alumniList.map((a) => a.batchYear).filter(Boolean)),
  ).sort((a, b) => String(b).localeCompare(String(a)));

  // ✅ OPTIMIZED: Remove client-side filtering - all done server-side now
  // The alumniList already contains only the filtered/paginated results from server

  // Handle filter changes - trigger server fetch
  const handleFilterChange = (filters) => {
    alumniRef.current?.scrollIntoView({ behavior: "smooth" });
    onFilterChange(filters);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

const API_BASE = (import.meta.env.VITE_API_URL || "/api").replace("/api", "");


  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col gap-6"
    >
      {/* Rich Search Input & Filters */}
      <div ref={alumniRef} className="flex flex-col gap-4">
        <div className="relative group">
          <div className="absolute -inset-1 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-[22px] blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
          <div className="relative bg-white border border-slate-200 rounded-2xl p-4 flex gap-3 items-center shadow-sm transition-all duration-300 focus-within:shadow-xl focus-within:border-white/50">
            <div className="bg-slate-50 p-2 rounded-xl group-focus-within:bg-blue-50 transition-colors">
              <Search
                size={20}
                className="text-slate-400 group-focus-within:text-blue-500 transition-colors"
              />
            </div>
            <input
              placeholder="Search by name, email, department, or year…"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                // ✅ Debounce search - trigger server fetch
                handleFilterChange({
                  search: e.target.value || undefined,
                  department: deptFilter || undefined,
                  status: statusFilter === "all" ? undefined : statusFilter,
                  batchYear: batchFilter || undefined,
                });
              }}
              className="flex-1 border-none py-1 font-['Outfit',sans-serif] text-[16px] outline-none text-slate-700 bg-transparent placeholder-slate-400"
            />
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg text-[11px] font-bold text-slate-400 font-['Outfit',sans-serif] uppercase tracking-wider">
              {pageData.totalAlumni} Results
            </div>
          </div>
        </div>

        {/* Dept & Batch Filters */}
        <div className="flex items-center gap-3 px-1">
          {/* ✅ For SuperAdmin only: Show department filter */}
          {userRole !== "admin" && (
            <div className="relative">
              <select
                value={deptFilter}
                onChange={(e) => {
                  setDeptFilter(e.target.value);
                  handleFilterChange({
                    department: e.target.value || undefined,
                    status: statusFilter === "all" ? undefined : statusFilter,
                    batchYear: batchFilter || undefined,
                    search: searchTerm || undefined,
                  });
                }}
                className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 cursor-pointer"
              >
                <option value="">All Departments</option>
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="relative">
            <select
              value={batchFilter}
              onChange={(e) => {
                setBatchFilter(e.target.value);
                handleFilterChange({
                  department: deptFilter || undefined,
                  status: statusFilter === "all" ? undefined : statusFilter,
                  batchYear: e.target.value || undefined,
                  search: searchTerm || undefined,
                });
              }}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 cursor-pointer"
            >
              <option value="">All Batches</option>
              {batches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {(deptFilter || batchFilter) && (
            <button
              onClick={() => {
                setDeptFilter("");
                setBatchFilter("");
                handleFilterChange({
                  search: searchTerm || undefined,
                  status: statusFilter === "all" ? undefined : statusFilter,
                });
              }}
              className="ml-2 px-3 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2 px-1">
          {[
            { id: "all", label: "All Alumni", icon: Users },
            { id: "pending", label: "Pending", icon: Clock },
            { id: "approved", label: "Approved", icon: CheckCircle },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => {
                setStatusFilter(btn.id);
                handleFilterChange({
                  department: deptFilter || undefined,
                  status: btn.id === "all" ? undefined : btn.id,
                  batchYear: batchFilter || undefined,
                  search: searchTerm || undefined,
                });
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold font-['Outfit',sans-serif] transition-all duration-300 border ${
                statusFilter === btn.id
                  ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200 scale-[1.02]"
                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <btn.icon
                size={14}
                className={
                  statusFilter === btn.id ? "text-white" : "text-slate-400"
                }
              />
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {alumniList.length > 0 ? (
        <>
          <div  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence>
              {alumniList.map((a, i) => {
              const photo = a.files?.currentPhoto || a.profileImage;
              return (
                <motion.div
                  key={a._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all"
                >
                  {/* Profile Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 shrink-0">
                      {photo ? (
                        <img
                          src={`${API_BASE}/uploads/${photo}`}
                          alt={`${a.firstName} ${a.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                          {a.firstName.charAt(0)}
                          {a.lastName && a.lastName.charAt(0)}
                          
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 truncate">
                        {a.firstName} {a.lastName}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {a.email}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            a.isApproved
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {a.isApproved ? (
                            <CheckCircle size={12} />
                          ) : (
                            <XCircle size={12} />
                          )}
                          {a.isApproved ? "Approved" : "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Building size={14} className="text-gray-400" />
                      <span className="text-gray-600">
                        {a.department}
                      </span>
                      <span className="text-gray-400">•</span>
                      <Calendar size={14} className="text-gray-400" />
                      <span className="text-gray-600">{a.batchYear}</span>
                    </div>

                    {a.currentCompany && (
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase size={14} className="text-gray-400" />
                        <span className="text-gray-600">
                          {a.jobTitle} at {a.currentCompany}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm">
                      <MapPin size={14} className="text-gray-400" />
                      <span className="text-gray-600 truncate">
                        {a.city}, {a.country}
                      </span>
                    </div>

                    {a.linkedin && (
                      <a
                        href={a.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Linkedin size={14} />
                        LinkedIn Profile
                      </a>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {!a.isApproved && (
                      <button
                        onClick={() => setSelectedItem(a)}
                        className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                      onClick={() => setSelectedItem(a)}
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              );
            })}
            </AnimatePresence>
          </div>

          {/* Pagination Controls */}
          {pageData.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8 px-4 flex-wrap">
              <button
                onClick={() => {
                  alumniRef.current?.scrollIntoView({ behavior: "smooth" });
                  onPageChange(Math.max(1, pageData.currentPage - 1));
                }}
                disabled={pageData.currentPage === 1}
                className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                ← Prev
              </button>

              <div className="flex items-center gap-1 flex-wrap justify-center">
                {(() => {
                  const pages = [];
                  const { totalPages, currentPage } = pageData;
                  const range = 2; // pages before/after current

                  // Always add first page
                  pages.push(1);

                  // Add pages around current
                  const start = Math.max(2, currentPage - range);
                  const end = Math.min(totalPages - 1, currentPage + range);

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
                      <span key={`ellipsis-${idx}`} className="text-slate-400 px-1">…</span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => {
                          alumniRef.current?.scrollIntoView({ behavior: "smooth" });
                          onPageChange(page);
                        }}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                          currentPage === page
                            ? "bg-slate-900 text-white"
                            : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  );
                })()}
              </div>

              <button
                onClick={() => {
                  alumniRef.current?.scrollIntoView({ behavior: "smooth" });
                  onPageChange(Math.min(pageData.totalPages, pageData.currentPage + 1));
                }}
                disabled={pageData.currentPage === pageData.totalPages}
                className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next →
              </button>

              <span className="text-xs text-slate-500 font-medium ml-4">
                Page {pageData.currentPage} of {pageData.totalPages} • Total: {pageData.totalAlumni}
              </span>
            </div>
          )}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24 px-6 bg-white border-2 border-dashed border-slate-200 rounded-4xl font-['Outfit',sans-serif] flex flex-col items-center"
        >
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-50 scale-150"></div>
            <div className="relative w-20 h-20 bg-linear-to-br from-slate-50 to-slate-100 border border-white rounded-3xl shadow-sm flex items-center justify-center">
              <Search size={32} className="text-slate-300" />
            </div>
          </div>
          <h4 className="text-xl font-extrabold text-slate-800 mb-2">
            No results found
          </h4>
          <p className="text-slate-500 max-w-[280px] text-[15px] font-medium">
            We couldn't find any alumni matching your filters
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setDeptFilter("");
              setBatchFilter("");
              handleFilterChange({});
            }}
            className="mt-6 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors"
          >
            Clear All Filters
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AlumniTab;
