// src/pages/alumni/CampaignsPage.jsx
// ✅ Public campaigns discovery page for alumni

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Users,
  ArrowRight,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react";
import { campaignsAPI } from "../../services/api";
import usePageTitle from "../../hooks/usePageTitle";

const CampaignsPage = () => {
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  usePageTitle("Campaigns");

  // ✅ Fetch all campaigns
  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await campaignsAPI.getAll();
      setCampaigns(response.data.campaigns || []);

      console.log("✅ Campaigns loaded:", response.data.campaigns?.length);
    } catch (err) {
      console.error("❌ Error loading campaigns:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load campaigns"
      );
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Filter campaigns
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || campaign.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // ✅ Get unique statuses
  const statuses = ["all", ...new Set(campaigns.map((c) => c.status))];

  // ✅ Get status color
  const getStatusColor = (status) => {
    const colors = {
      Draft: "bg-slate-100 text-slate-700",
      Active: "bg-green-100 text-green-700",
      Closed: "bg-red-100 text-red-700",
      Pending: "bg-yellow-100 text-yellow-700",
      Archived: "bg-slate-100 text-slate-600",
    };
    return colors[status] || "bg-slate-100 text-slate-700";
  };

  // ✅ Get days remaining
  const getDaysRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-black text-slate-900 mb-3">
            Campaigns
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Discover and participate in campaigns from PSG Alumni Network. Share
            your stories, feedback, and insights.
          </p>
        </motion.div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-3.5 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search campaigns by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>

          {/* Filter by Status */}
          <div className="flex flex-wrap gap-2">
            <Filter size={16} className="text-slate-400 self-center" />
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all capitalize ${
                  selectedStatus === status
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {status === "all" ? "All Campaigns" : status}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader size={40} className="text-indigo-600 animate-spin mb-4" />
            <p className="text-slate-600 font-medium">Loading campaigns...</p>
          </div>
        ) : error ? (
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
              Failed to Load Campaigns
            </h2>
            <p className="text-red-700 mb-6">{error}</p>
            <button
              onClick={fetchCampaigns}
              className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="text-center py-20">
            <Calendar size={48} className="text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-600 mb-2">
              {campaigns.length === 0 ? "No Campaigns Yet" : "No Results Found"}
            </h2>
            <p className="text-slate-500 mb-6">
              {campaigns.length === 0
                ? "Check back soon for exciting campaigns!"
                : "Try adjusting your search or filters."}
            </p>
            {campaigns.length > 0 && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedStatus("all");
                }}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Results Info */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-slate-600 font-medium">
                Showing{" "}
                <span className="font-bold text-slate-900">
                  {filteredCampaigns.length}
                </span>{" "}
                campaign{filteredCampaigns.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Campaigns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
              <AnimatePresence>
                {filteredCampaigns.map((campaign, idx) => {
                  const daysLeft = getDaysRemaining(campaign.endDate);
                  const isActive = campaign.status === "Active";

                  return (
                    <motion.div
                      key={campaign._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ y: -4 }}
                      onClick={() => navigate(`/campaign/${campaign._id}`)}
                      className="group bg-white rounded-2xl shadow-md hover:shadow-xl border border-slate-100 overflow-hidden transition-all cursor-pointer"
                    >
                      {/* Header Background */}
                      <div
                        className={`h-3 w-full ${
                          isActive
                            ? "bg-gradient-to-r from-indigo-600 to-violet-600"
                            : "bg-gradient-to-r from-slate-400 to-slate-500"
                        }`}
                      />

                      <div className="p-6 space-y-4">
                        {/* Status Badge */}
                        <div className="flex items-center justify-between">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                              campaign.status
                            )}`}
                          >
                            {isActive && <CheckCircle size={12} />}
                            {campaign.status}
                          </span>
                          {isActive && daysLeft > 0 && (
                            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                              {daysLeft} days left
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <div>
                          <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-1">
                            {campaign.title}
                          </h3>
                          <p className="text-sm text-slate-600 line-clamp-2">
                            {campaign.description}
                          </p>
                        </div>

                        {/* Category & Target */}
                        <div className="flex flex-wrap gap-2">
                          {campaign.category && (
                            <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg">
                              {campaign.category}
                            </span>
                          )}
                          {campaign.targetAudience && (
                            <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                              {campaign.targetAudience}
                            </span>
                          )}
                        </div>

                        {/* Meta Info */}
                        <div className="flex flex-wrap gap-3 text-xs text-slate-500 font-medium pt-2 border-t border-slate-100">
                          <div className="flex items-center gap-1">
                            <Users size={13} />
                            {campaign.totalResponses || 0} response
                            {campaign.totalResponses !== 1 ? "s" : ""}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={13} />
                            {new Date(campaign.startDate).toLocaleDateString()}
                          </div>
                          {campaign.formFields && (
                            <div className="flex items-center gap-1">
                              📋 {campaign.formFields.length} question
                              {campaign.formFields.length !== 1 ? "s" : ""}
                            </div>
                          )}
                        </div>

                        {/* CTA Button */}
                        {isActive ? (
                          <motion.button
                            whileHover={{ x: 4 }}
                            className="w-full flex items-center justify-center gap-2 mt-4 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
                          >
                            Respond Now
                            <ArrowRight size={14} />
                          </motion.button>
                        ) : (
                          <button
                            disabled
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-100 text-slate-400 font-bold text-sm cursor-not-allowed"
                          >
                            Campaign Closed
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CampaignsPage;