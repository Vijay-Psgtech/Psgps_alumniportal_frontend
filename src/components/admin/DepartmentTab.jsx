// frontend/src/components/admin/DepartmentTab.jsx
// ✅ ENHANCED: Advanced filtering, search, flexible segregation with better UX

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  CheckCircle,
  AlertCircle,
  Save,
  Eye,
  EyeOff,
  Loader,
  Search,
  Filter,
  ChevronDown,
  Tag,
  RotateCcw,
} from "lucide-react";
import { departmentAPI } from "../../services/api";

const DepartmentTab = ({ onError, onSuccess }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // ─── FILTER STATES ───
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgrammeTypes, setSelectedProgrammeTypes] = useState([]);
  const [selectedFundingTypes, setSelectedFundingTypes] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    degree: "",
    programmeType: "",
    fundingType: "",
    description: "",
  });

  // ─────────────────────────────────────────────────────────────────
  // FETCH DEPARTMENTS
  // ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await departmentAPI.getAllAdmin();
      console.log("✅ Departments fetched:", response.data);

      if (response.data?.data?.departments) {
        setDepartments(response.data.data.departments);
      } else {
        console.warn("Unexpected response structure:", response.data);
        setDepartments([]);
      }
    } catch (error) {
      console.error("❌ Error fetching departments:", error);
      onError(error.response?.data?.message || "Failed to load departments");
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // FILTERING LOGIC
  // ─────────────────────────────────────────────────────────────────
  const filteredDepartments = useMemo(() => {
    return departments.filter((dept) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        dept.name.toLowerCase().includes(searchLower) ||
        dept.degree.toLowerCase().includes(searchLower);

      // Programme Type filter
      const matchesProgrammeType =
        selectedProgrammeTypes.length === 0 ||
        selectedProgrammeTypes.includes(dept.programmeType);

      // Funding Type filter
      const matchesFundingType =
        selectedFundingTypes.length === 0 ||
        selectedFundingTypes.includes(dept.fundingType);

      // Status filter
      const matchesStatus =
        selectedStatus.length === 0 ||
        selectedStatus.some((status) => {
          if (status === "active") return dept.active === true;
          if (status === "inactive") return dept.active === false;
          return false;
        });

      return (
        matchesSearch &&
        matchesProgrammeType &&
        matchesFundingType &&
        matchesStatus
      );
    });
  }, [
    departments,
    searchQuery,
    selectedProgrammeTypes,
    selectedFundingTypes,
    selectedStatus,
  ]);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDepartments = filteredDepartments.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);

  // ─────────────────────────────────────────────────────────────────
  // TOGGLE FILTER OPTIONS
  // ─────────────────────────────────────────────────────────────────
  const toggleProgrammeType = (type) => {
    setSelectedProgrammeTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const toggleFundingType = (type) => {
    setSelectedFundingTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const toggleStatus = (status) => {
    setSelectedStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    );
  };

  // ─────────────────────────────────────────────────────────────────
  // CLEAR ALL FILTERS
  // ─────────────────────────────────────────────────────────────────
  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedProgrammeTypes([]);
    setSelectedFundingTypes([]);
    setSelectedStatus([]);
  };

  const hasActiveFilters =
    searchQuery ||
    selectedProgrammeTypes.length > 0 ||
    selectedFundingTypes.length > 0 ||
    selectedStatus.length > 0;

  // ─────────────────────────────────────────────────────────────────
  // RESET FORM
  // ─────────────────────────────────────────────────────────────────
  const resetForm = () => {
    setFormData({
      name: "",
      degree: "",
      programmeType: "",
      fundingType: "",
      description: "",
    });
    setFormErrors({});
    setEditingId(null);
  };

  // ─────────────────────────────────────────────────────────────────
  // VALIDATE FORM
  // ─────────────────────────────────────────────────────────────────
  const validateForm = () => {
    const errors = {};

    if (!formData.name || !formData.name.trim()) {
      errors.name = "Department name is required";
    }

    if (!formData.degree || !formData.degree.trim()) {
      errors.degree = "Degree is required";
    }

    if (!formData.programmeType) {
      errors.programmeType = "Programme type (UG/PG) is required";
    }

    if (!formData.fundingType) {
      errors.fundingType = "Funding type (Aided/SF) is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ─────────────────────────────────────────────────────────────────
  // HANDLE SAVE (CREATE OR UPDATE)
  // ─────────────────────────────────────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      onError("Please fix the form errors");
      return;
    }

    try {
      setSubmitting(true);

      if (editingId) {
        // Update existing
        console.log("📝 Updating department:", editingId, formData);
        await departmentAPI.update(editingId, formData);
        onSuccess("✅ Department updated successfully");
      } else {
        // Create new
        console.log("➕ Creating department:", formData);
        await departmentAPI.create(formData);
        onSuccess("✅ Department created successfully");
      }

      await fetchDepartments();
      setShowForm(false);
      resetForm();
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to save department";
      console.error("❌ Save error:", errorMsg);
      onError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // HANDLE EDIT
  // ─────────────────────────────────────────────────────────────────
  const handleEdit = (dept) => {
    console.log("✏️ Editing department:", dept);
    setFormData({
      name: dept.name || "",
      degree: dept.degree || "",
      programmeType: dept.programmeType || "",
      fundingType: dept.fundingType || "",
      description: dept.description || "",
    });
    setEditingId(dept._id);
    setShowForm(true);
    setFormErrors({});
  };

  // ─────────────────────────────────────────────────────────────────
  // HANDLE DELETE
  // ─────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) {
      return;
    }

    try {
      console.log("🗑️ Deleting department:", id);
      await departmentAPI.delete(id);
      onSuccess("✅ Department deleted successfully");
      await fetchDepartments();
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to delete department";
      console.error("❌ Delete error:", errorMsg);
      onError(errorMsg);
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // HANDLE TOGGLE STATUS
  // ─────────────────────────────────────────────────────────────────
  const handleToggleStatus = async (id) => {
    try {
      console.log("🔄 Toggling status for department:", id);
      await departmentAPI.toggleStatus(id);
      onSuccess("✅ Department status updated");
      await fetchDepartments();
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to update status";
      console.error("❌ Toggle error:", errorMsg);
      onError(errorMsg);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="w-10 h-10 border-[3px] border-slate-200 border-t-blue-500 rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-gray-400 font-medium">Loading departments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ─────────────────────────────────────────────────────────────
          HEADER WITH ADD BUTTON
          ───────────────────────────────────────────────────────────── */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-[#0c0e1a]">Departments</h3>
          <p className="text-sm text-slate-500 mt-1">
            Total: {departments.length} | Showing: {filteredDepartments.length}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-linear-to-br from-[#667eea] to-[#764ba2] text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
        >
          <Plus size={16} /> Add Department
        </motion.button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SEARCH & FILTER BAR
          ───────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search
            className="absolute left-3.5 top-3 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by department name or degree..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm
            outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>

        {/* Filter Toggle & Clear Button */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-medium text-sm transition ${
              showFilterPanel || hasActiveFilters
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            <Filter size={16} />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-blue-600 text-white text-xs font-bold">
                {[
                  selectedProgrammeTypes.length,
                  selectedFundingTypes.length,
                  selectedStatus.length,
                ].reduce((a, b) => a + b, 0) + (searchQuery ? 1 : 0)}
              </span>
            )}
          </motion.button>

          {hasActiveFilters && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearAllFilters}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 transition"
            >
              <RotateCcw size={16} />
              Clear All
            </motion.button>
          )}
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilterPanel && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-xl border border-slate-200 p-5 space-y-5"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Programme Type Filter */}
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wide text-slate-600 mb-3">
                    Programme Type
                  </h5>
                  <div className="space-y-2.5">
                    {["UG", "PG"].map((type) => (
                      <label
                        key={type}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={selectedProgrammeTypes.includes(type)}
                          onChange={() => toggleProgrammeType(type)}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                        />
                        <span className="text-sm text-slate-600 group-hover:text-slate-900 transition">
                          {type === "UG" ? "Undergraduate" : "Postgraduate"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Funding Type Filter */}
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wide text-slate-600 mb-3">
                    Funding Type
                  </h5>
                  <div className="space-y-2.5">
                    {["Aided", "SF"].map((type) => (
                      <label
                        key={type}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFundingTypes.includes(type)}
                          onChange={() => toggleFundingType(type)}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                        />
                        <span className="text-sm text-slate-600 group-hover:text-slate-900 transition">
                          {type === "SF" ? "Self-Financing" : type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wide text-slate-600 mb-3">
                    Status
                  </h5>
                  <div className="space-y-2.5">
                    {[
                      { value: "active", label: "Active" },
                      { value: "inactive", label: "Inactive" },
                    ].map(({ value, label }) => (
                      <label
                        key={value}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={selectedStatus.includes(value)}
                          onChange={() => toggleStatus(value)}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                        />
                        <span className="text-sm text-slate-600 group-hover:text-slate-900 transition">
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filter Tags */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap gap-2"
          >
            {searchQuery && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium"
              >
                <span>Search: {searchQuery}</span>
                <button
                  onClick={() => setSearchQuery("")}
                  className="hover:text-slate-900"
                >
                  <X size={14} />
                </button>
              </motion.div>
            )}

            {selectedProgrammeTypes.map((type) => (
              <motion.div
                key={type}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 text-xs font-medium"
              >
                <span>Type: {type}</span>
                <button
                  onClick={() => toggleProgrammeType(type)}
                  className="hover:text-blue-900"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ))}

            {selectedFundingTypes.map((type) => (
              <motion.div
                key={type}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-100 text-purple-700 text-xs font-medium"
              >
                <span>Funding: {type}</span>
                <button
                  onClick={() => toggleFundingType(type)}
                  className="hover:text-purple-900"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ))}

            {selectedStatus.map((status) => (
              <motion.div
                key={status}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-100 text-green-700 text-xs font-medium"
              >
                <span>
                  Status: {status === "active" ? "Active" : "Inactive"}
                </span>
                <button
                  onClick={() => toggleStatus(status)}
                  className="hover:text-green-900"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ADD/EDIT FORM
          ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl border border-slate-200 p-6 mb-6"
          >
            <div className="flex justify-between items-center mb-5">
              <h4 className="text-lg font-bold text-[#0c0e1a]">
                {editingId ? "✏️ Edit Department" : "➕ Add New Department"}
              </h4>
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Name */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2 block">
                  Department Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="e.g., Computer Science & Engineering"
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm
                  ${
                    formErrors.name
                      ? "border-red-400 bg-red-50"
                      : "border-slate-200"
                  }
                  outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition`}
                />
                {formErrors.name && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {formErrors.name}
                  </p>
                )}
              </div>

              {/* Degree */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2 block">
                  Degree *
                </label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, degree: e.target.value }))
                  }
                  placeholder="e.g., Bachelor of Technology"
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm
                  ${
                    formErrors.degree
                      ? "border-red-400 bg-red-50"
                      : "border-slate-200"
                  }
                  outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition`}
                />
                {formErrors.degree && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {formErrors.degree}
                  </p>
                )}
              </div>

              {/* Two Column Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Programme Type */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2 block">
                    Programme Type *
                  </label>
                  <select
                    value={formData.programmeType}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        programmeType: e.target.value,
                      }))
                    }
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-sm appearance-none
                    ${
                      formErrors.programmeType
                        ? "border-red-400 bg-red-50"
                        : "border-slate-200"
                    }
                    outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition`}
                  >
                    <option value="">-- Select --</option>
                    <option value="UG">UG (Undergraduate)</option>
                    <option value="PG">PG (Postgraduate)</option>
                  </select>
                  {formErrors.programmeType && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {formErrors.programmeType}
                    </p>
                  )}
                </div>

                {/* Funding Type */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2 block">
                    Funding Type *
                  </label>
                  <select
                    value={formData.fundingType}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        fundingType: e.target.value,
                      }))
                    }
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-sm appearance-none
                    ${
                      formErrors.fundingType
                        ? "border-red-400 bg-red-50"
                        : "border-slate-200"
                    }
                    outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition`}
                  >
                    <option value="">-- Select --</option>
                    <option value="Aided">Aided</option>
                    <option value="SF">SF (Self-Financing)</option>
                  </select>
                  {formErrors.fundingType && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {formErrors.fundingType}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2 block">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="Add any additional details about this department..."
                  rows="3"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm
                  outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4 justify-end border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-linear-to-br from-[#667eea] to-[#764ba2] text-white font-semibold text-sm hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader size={14} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save size={14} /> {editingId ? "Update" : "Create"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          DEPARTMENTS TABLE
          ───────────────────────────────────────────────────────────── */}
      {filteredDepartments.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-left font-semibold text-slate-600">
                    Department Name
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-600">
                    Degree
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-slate-600">
                    Type
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-slate-600">
                    Funding
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-slate-600">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right font-semibold text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentDepartments.map((dept, idx) => (
                  <motion.tr
                    key={dept._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-slate-100 hover:bg-slate-50/50 transition"
                  >
                    <td className="px-6 py-4 text-slate-700 font-medium">
                      {dept.name}
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">
                      {dept.degree}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block px-3 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-700">
                        {dept.programmeType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block px-3 py-1 rounded-lg text-xs font-semibold bg-purple-100 text-purple-700">
                        {dept.fundingType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(dept._id)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold text-xs transition ${
                          dept.active
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {dept.active ? (
                          <>
                            <Eye size={12} /> Active
                          </>
                        ) : (
                          <>
                            <EyeOff size={12} /> Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEdit(dept)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition"
                          title="Edit department"
                        >
                          <Edit2 size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(dept._id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition"
                          title="Delete department"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-end items-center gap-2 px-4 py-3 bg-slate-50 border-t border-slate-200">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 font-medium text-sm hover:bg-slate-50 transition"
                >
                  Previous
                </button>
                <span className="text-slate-600 font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 font-medium text-sm hover:bg-slate-50 transition"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
          <div className="text-5xl mb-3">{hasActiveFilters ? "🔍" : "📚"}</div>
          <p className="text-slate-600 font-medium text-lg">
            {hasActiveFilters
              ? "No departments match your filters"
              : "No departments yet"}
          </p>
          <p className="text-slate-400 text-sm mt-1">
            {hasActiveFilters
              ? "Try adjusting your filter criteria"
              : 'Click "Add Department" button above to create the first department'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="mt-4 px-4 py-2 rounded-lg border border-slate-300 text-slate-600 font-medium text-sm hover:bg-slate-50 transition"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DepartmentTab;
