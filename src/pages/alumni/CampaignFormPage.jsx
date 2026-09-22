// src/pages/alumni/CampaignFormPage.jsx
// ✅ Public campaign form for alumni to respond to campaigns

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Send, AlertCircle, CheckCircle, Loader } from "lucide-react";
import { campaignsAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import usePageTitle from "../../hooks/usePageTitle";

const CampaignFormPage = () => {
  const { id: campaignId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({});

  usePageTitle("Campaign Response Form");

  // ✅ Fetch campaign details
  useEffect(() => {
    if (campaignId) {
      fetchCampaign();
    }
  }, [campaignId]);

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await campaignsAPI.getById(campaignId);
      setCampaign(response.data.data);

      // Initialize form data with empty fields
      const initialData = {};
      if (response.data.data.formFields) {
        response.data.data.formFields.forEach((field) => {
          initialData[field.label] = "";
        });
      }
      setFormData(initialData);

      console.log("✅ Campaign loaded:", response.data.data.title);
    } catch (err) {
      console.error("❌ Error loading campaign:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load campaign"
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle form input changes
  const handleInputChange = (fieldLabel, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldLabel]: value,
    }));
  };

  // ✅ Handle checkbox groups (multiple selections)
  const handleCheckboxChange = (fieldLabel, option, checked) => {
    setFormData((prev) => {
      const current = Array.isArray(prev[fieldLabel]) ? prev[fieldLabel] : [];
      if (checked) {
        return { ...prev, [fieldLabel]: [...current, option] };
      } else {
        return { ...prev, [fieldLabel]: current.filter((o) => o !== option) };
      }
    });
  };

  // ✅ Submit form response
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!campaignId) {
      setError("Campaign ID is missing");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const responsePayload = {
        respondentId: user?._id || null,
        respondentName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
        respondentEmail: user?.email || "",
        respondentBatch: user?.batchYear || "N/A",
        respondentDepartment: user?.department || "N/A",
        responseData: formData,
        uploadedFiles: [],
      };

      console.log("📤 Submitting response:", responsePayload);

      const response = await campaignsAPI.submitResponse(
        campaignId,
        responsePayload
      );

      console.log("✅ Response submitted:", response.data);

      setSuccess("✅ Your response has been submitted successfully!");
      setFormData({});

      setTimeout(() => {
        navigate("/alumni/dashboard");
      }, 2000);
    } catch (err) {
      console.error("❌ Error submitting response:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to submit response. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Render form field based on type
  const renderFormField = (field) => {
    const value = formData[field.label] || "";

    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            name={field.label}
            value={value}
            onChange={(e) => handleInputChange(field.label, e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            required={field.required}
          />
        );

      case "textarea":
        return (
          <textarea
            name={field.label}
            value={value}
            onChange={(e) => handleInputChange(field.label, e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            rows={4}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
            required={field.required}
          />
        );

      case "email":
        return (
          <input
            type="email"
            name={field.label}
            value={value}
            onChange={(e) => handleInputChange(field.label, e.target.value)}
            placeholder={field.placeholder || "Enter email address"}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            required={field.required}
          />
        );

      case "phone":
        return (
          <input
            type="tel"
            name={field.label}
            value={value}
            onChange={(e) => handleInputChange(field.label, e.target.value)}
            placeholder={field.placeholder || "Enter phone number"}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            required={field.required}
          />
        );

      case "number":
        return (
          <input
            type="number"
            name={field.label}
            value={value}
            onChange={(e) => handleInputChange(field.label, e.target.value)}
            placeholder={field.placeholder || "Enter a number"}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            required={field.required}
          />
        );

      case "date":
        return (
          <input
            type="date"
            name={field.label}
            value={value}
            onChange={(e) => handleInputChange(field.label, e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            required={field.required}
          />
        );

      case "select":
        return (
          <select
            name={field.label}
            value={value}
            onChange={(e) => handleInputChange(field.label, e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            required={field.required}
          >
            <option value="">-- Select an option --</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-2.5 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={
                    Array.isArray(value) ? value.includes(opt) : false
                  }
                  onChange={(e) =>
                    handleCheckboxChange(field.label, opt, e.target.checked)
                  }
                  className="w-4 h-4 accent-indigo-600 rounded"
                />
                <span className="text-sm text-slate-600">{opt}</span>
              </label>
            ))}
          </div>
        );

      case "radio":
        return (
          <div className="space-y-2">
            {field.options?.map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-2.5 cursor-pointer"
              >
                <input
                  type="radio"
                  name={field.label}
                  value={opt}
                  checked={value === opt}
                  onChange={(e) => handleInputChange(field.label, e.target.value)}
                  className="w-4 h-4 accent-indigo-600"
                />
                <span className="text-sm text-slate-600">{opt}</span>
              </label>
            ))}
          </div>
        );

      default:
        return (
          <input
            type="text"
            name={field.label}
            value={value}
            onChange={(e) => handleInputChange(field.label, e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            required={field.required}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold mb-6 transition-colors"
        >
          <ChevronLeft size={18} /> Back
        </motion.button>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader size={40} className="text-indigo-600 animate-spin mb-4" />
            <p className="text-slate-600 font-medium">Loading campaign...</p>
          </div>
        ) : error && !campaign ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center"
          >
            <AlertCircle
              size={48}
              className="text-red-500 mx-auto mb-4"
            />
            <h2 className="text-xl font-bold text-red-900 mb-2">
              Campaign Not Found
            </h2>
            <p className="text-red-700 mb-6">{error}</p>
            <button
              onClick={() => navigate("/alumni/dashboard")}
              className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors"
            >
              Return to Dashboard
            </button>
          </motion.div>
        ) : campaign ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden"
          >
            {/* Campaign Header */}
            <div className="bg-linear-to-r from-indigo-600 to-violet-600 px-8 py-10 text-white">
              <h1 className="text-3xl font-black mb-2">{campaign.title}</h1>
              <p className="text-indigo-100 text-base leading-relaxed max-w-2xl">
                {campaign.description}
              </p>

              {campaign.targetAudience && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
                    Target: {campaign.targetAudience}
                  </span>
                  {campaign.status && (
                    <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
                      Status: {campaign.status}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Form Content */}
            <div className="px-8 py-10">
              {/* Success Message */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700"
                  >
                    <CheckCircle size={20} />
                    <span className="font-semibold">{success}</span>
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
                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700"
                  >
                    <AlertCircle size={20} />
                    <span className="font-semibold">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {!success && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {campaign.formFields && campaign.formFields.length > 0 ? (
                    <>
                      {/* Respondent Info Section */}
                      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                        <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest">
                          Your Information
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-2">
                              Name
                            </label>
                            <input
                              type="text"
                              value={`${user?.firstName || ""} ${
                                user?.lastName || ""
                              }`.trim()}
                              disabled
                              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-600 cursor-not-allowed"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-2">
                              Email
                            </label>
                            <input
                              type="email"
                              value={user?.email || ""}
                              disabled
                              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-600 cursor-not-allowed"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Form Fields */}
                      <div className="space-y-6">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
                          Response Details
                        </h3>
                        {campaign.formFields.map((field, idx) => (
                          <motion.div
                            key={`${field.label}-${idx}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <label className="block text-sm font-bold text-slate-900 mb-3">
                              {field.label}
                              {field.required && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </label>
                            {renderFormField(field)}
                          </motion.div>
                        ))}
                      </div>

                      {/* Submit Button */}
                      <div className="flex gap-3 pt-4 border-t border-slate-200">
                        <button
                          type="button"
                          onClick={() => navigate(-1)}
                          disabled={submitting}
                          className="flex-1 px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 disabled:opacity-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <motion.button
                          type="submit"
                          disabled={submitting}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-200"
                        >
                          {submitting ? (
                            <>
                              <Loader size={16} className="animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send size={16} />
                              Submit Response
                            </>
                          )}
                        </motion.button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-slate-600 font-medium">
                        No form fields available for this campaign.
                      </p>
                    </div>
                  )}
                </form>
              )}
            </div>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
};

export default CampaignFormPage;