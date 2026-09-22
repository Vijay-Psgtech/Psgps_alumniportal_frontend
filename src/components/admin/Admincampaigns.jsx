import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Settings,
  BarChart3,
  Users,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2,
  Eye,
  Send,
} from "lucide-react";

const AdminCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch campaigns
  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Filter campaigns
  useEffect(() => {
    let filtered = campaigns;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    setFilteredCampaigns(filtered);
  }, [campaigns, searchTerm, statusFilter]);

  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
      // Replace with actual API call
      const response = await fetch("/api/campaigns");
      const data = await response.json();
      setCampaigns(data.data || []);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-50 text-green-700 border-green-200";
      case "Draft":
        return "bg-gray-50 text-gray-700 border-gray-200";
      case "Paused":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Closed":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Active":
        return <CheckCircle size={16} />;
      case "Draft":
        return <FileText size={16} />;
      case "Paused":
        return <AlertCircle size={16} />;
      case "Closed":
        return <Clock size={16} />;
      default:
        return null;
    }
  };

  const calculateDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const daysRemaining = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    return daysRemaining > 0 ? daysRemaining : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm text-slate-500 uppercase tracking-[1px] font-semibold">
            Admin / Campaigns
          </p>
          <h1 className="text-3xl font-['Playfair_Display',serif] font-extrabold text-slate-950">
            Campaign Management
          </h1>
          <p className="max-w-2xl mt-2 text-sm text-slate-500">
            Create and manage campaigns to engage alumni, collect responses, and drive community engagement.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedCampaign(null);
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-br from-blue-600 to-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:brightness-105 transition-all"
        >
          <Plus size={16} /> New Campaign
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total Campaigns", value: campaigns.length, icon: FileText, color: "blue" },
          { label: "Active Campaigns", value: campaigns.filter(c => c.status === "Active").length, icon: CheckCircle, color: "green" },
          { label: "Total Responses", value: campaigns.reduce((sum, c) => sum + (c.totalResponses || 0), 0), icon: Users, color: "purple" },
          { label: "Avg Response Rate", value: "67%", icon: BarChart3, color: "orange" },
        ].map((stat, idx) => (
          <div key={idx} className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full bg-${stat.color}-50`}>
                <stat.icon size={20} className={`text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-400"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {["all", "Active", "Draft", "Closed"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  statusFilter === status
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {status === "all" ? "All Campaigns" : status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12 text-slate-500">Loading campaigns...</div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-16 text-center">
            <p className="text-slate-600 font-semibold">No campaigns found</p>
            <p className="text-sm text-slate-500 mt-1">Create your first campaign to engage your community</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredCampaigns.map((campaign) => (
              <motion.div
                key={campaign._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Campaign Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3">
                      {campaign.coverImage && (
                        <img
                          src={campaign.coverImage}
                          alt={campaign.title}
                          className="w-16 h-16 rounded-xl object-cover shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-slate-900 truncate">
                          {campaign.title}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                          {campaign.description}
                        </p>
                        <div className="flex items-center gap-3 mt-3 flex-wrap">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(campaign.status)}`}>
                            {getStatusIcon(campaign.status)}
                            {campaign.status}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            {campaign.category}
                          </span>
                          <span className="text-xs text-slate-500">
                            {calculateDaysRemaining(campaign.endDate)} days left
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-900">
                        {campaign.totalResponses || 0}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">Responses</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-900">
                        {campaign.views || 0}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">Views</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-900">
                        {Math.round(campaign.submissionRate || 0)}%
                      </p>
                      <p className="text-xs text-slate-500 mt-1">Rate</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => {
                        setSelectedCampaign(campaign);
                        setShowModal(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition"
                    >
                      <Edit size={14} className="inline mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => {
                        // View responses
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-50 text-slate-700 text-xs font-bold hover:bg-slate-100 transition"
                    >
                      <Eye size={14} className="inline mr-1" /> Responses
                    </button>
                    <button className="px-4 py-2 rounded-xl bg-red-50 text-red-700 text-xs font-bold hover:bg-red-100 transition">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-blue-500 to-purple-500 transition-all"
                    style={{ width: `${Math.min((campaign.totalResponses / 50) * 100, 100)}%` }}
                  ></div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Campaign Creation Modal */}
      {showModal && (
        <CampaignModal
          campaign={selectedCampaign}
          onClose={() => setShowModal(false)}
          onSave={() => {
            setShowModal(false);
            fetchCampaigns();
          }}
        />
      )}
    </div>
  );
};

// Campaign Modal Component
const CampaignModal = ({ campaign, onClose, onSave }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {campaign ? "Edit Campaign" : "Create New Campaign"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Campaign form fields will go here */}
          <p className="text-slate-600">Campaign creation form coming soon...</p>
          
          <div className="flex gap-3 justify-end pt-4 border-t">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="px-6 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700"
            >
              Save Campaign
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminCampaigns;