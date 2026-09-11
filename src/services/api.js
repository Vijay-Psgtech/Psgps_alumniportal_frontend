import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";
console.log("📡 API Base URL:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
  withCredentials: true,
});

// ═══════════════════════════════════════════════════════════════════════
// REQUEST INTERCEPTOR — Add Authorization token to every request
// ═══════════════════════════════════════════════════════════════════════
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ Token attached to request");
    } else {
      console.log("⚠️ No token found in localStorage");
    }
    
    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// ═══════════════════════════════════════════════════════════════════════
// RESPONSE INTERCEPTOR — Handle 401/403 globally
// ═══════════════════════════════════════════════════════════════════════
api.interceptors.response.use(
  (response) => {
    console.log("✅ API Success:", response.config.url);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";
    const message = error.response?.data?.message || error.message;

    console.error("❌ API Error:", { status, url, message });

    if (status === 401) {
      // Token expired/invalid — dispatch logout event
      console.warn("⚠️ 401 Unauthorized - clearing token");
      localStorage.removeItem("authToken");
      window.dispatchEvent(new CustomEvent("auth:logout", { detail: { url } }));
    }

    if (status === 403) {
      console.warn("⚠️ 403 Forbidden");
      window.dispatchEvent(new CustomEvent("auth:forbidden"));
    }

    return Promise.reject(error);
  }
);

// ──────────────── API_BASE ──────────────────────── //
export const API_BASE = "http://localhost:5000";

// ──────────────── Auth API ──────────────────────── //
export const authAPI = {
  register: (data) =>
    api.post("/auth/register", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  login: (data) => {
    console.log("📤 Logging in...");
    return api.post("/auth/login", data);
  },
  getProfile: () => {
    console.log("📡 Fetching profile...");
    return api.get("/auth/profile");
  },
  changePassword: (currentPassword, newPassword) =>
    api.put("/auth/change-password", { currentPassword, newPassword }),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  verifyOtp: (email, otp) => api.post("/auth/verify-otp", { email, otp }),
  resetPassword: (email, otp, newPassword) =>
    api.post("/auth/reset-password", { email, otp, newPassword }),
};

// ────────────────────────────────────────────────────────────────────────────
// ✅ DEPARTMENTS API - DYNAMIC DEPARTMENTS MANAGEMENT
// ────────────────────────────────────────────────────────────────────────────
export const departmentAPI = {
  // Get all active departments (PUBLIC)
  getAll: () => {
    console.log("📡 Fetching all active departments...");
    return api.get("/departments");
  },
 
  // Get departments by programme type and funding type (PUBLIC)
  getByType: (programmeType, fundingType) => {
    console.log(`📡 Fetching departments (${programmeType}, ${fundingType})...`);
    return api.get(`/departments/${programmeType}/${fundingType}`);
  },
 
  // Get all departments including inactive (ADMIN ONLY)
  getAllAdmin: () => {
    console.log("📡 Fetching all departments (admin)...");
    return api.get("/departments/admin/all");
  },
 
  // Create new department (ADMIN ONLY)
  create: (data) => {
    console.log("📤 Creating department:", data);
    return api.post("/departments", data).then((response) => {
      console.log("✅ Department created:", response.data);
      return response;
    }).catch((error) => {
      console.error("❌ Department creation failed:", error.response?.data || error.message);
      throw error;
    });
  },
 
  // Update department (ADMIN ONLY)
  update: (id, data) => {
    console.log(`📤 Updating department ${id}:`, data);
    return api.put(`/departments/${id}`, data).then((response) => {
      console.log("✅ Department updated:", response.data);
      return response;
    }).catch((error) => {
      console.error("❌ Department update failed:", error.response?.data || error.message);
      throw error;
    });
  },
 
  // Delete department (ADMIN ONLY)
  delete: (id) => {
    console.log(`📤 Deleting department ${id}...`);
    return api.delete(`/departments/${id}`).then((response) => {
      console.log("✅ Department deleted:", response.data);
      return response;
    }).catch((error) => {
      console.error("❌ Department deletion failed:", error.response?.data || error.message);
      throw error;
    });
  },
 
  // Toggle department active/inactive status (ADMIN ONLY)
  toggleStatus: (id) => {
    console.log(`📤 Toggling status for department ${id}...`);
    return api.patch(`/departments/${id}/toggle`).then((response) => {
      console.log("✅ Department status toggled:", response.data);
      return response;
    }).catch((error) => {
      console.error("❌ Status toggle failed:", error.response?.data || error.message);
      throw error;
    });
  },
};

// ────────────────────────────────────────────────────────────────────────────
// ✅ CAMPAIGNS API - CAMPAIGN MANAGEMENT & RESPONSES
// ────────────────────────────────────────────────────────────────────────────
export const campaignsAPI = {
  // Get all campaigns
  getAll: (params) => {
    console.log("📡 Fetching all campaigns...");
    return api.get("/campaigns", { params }).catch((error) => {
      console.error("❌ Failed to fetch campaigns:", error.message);
      throw error;
    });
  },
 
  // Get single campaign by ID
  getById: (id) => {
    console.log(`📡 Fetching campaign ${id}...`);
    return api.get(`/campaigns/${id}`).catch((error) => {
      console.error(`❌ Failed to fetch campaign ${id}:`, error.message);
      throw error;
    });
  },
 
  // Create new campaign
  create: (data) => {
    console.log("📤 Creating campaign...", data.title);
    return api
      .post("/campaigns", data)
      .then((response) => {
        console.log("✅ Campaign created:", response.data.campaignId);
        return response;
      })
      .catch((error) => {
        console.error("❌ Campaign creation failed:", error.message);
        throw error;
      });
  },
 
  // Update campaign
  update: (id, data) => {
    console.log(`📤 Updating campaign ${id}...`);
    return api
      .put(`/campaigns/${id}`, data)
      .then((response) => {
        console.log("✅ Campaign updated:", id);
        return response;
      })
      .catch((error) => {
        console.error(`❌ Campaign update failed:`, error.message);
        throw error;
      });
  },
 
  // Delete campaign
  delete: (id) => {
    console.log(`📤 Deleting campaign ${id}...`);
    return api
      .delete(`/campaigns/${id}`)
      .then((response) => {
        console.log("✅ Campaign deleted:", id);
        return response;
      })
      .catch((error) => {
        console.error(`❌ Campaign deletion failed:`, error.message);
        throw error;
      });
  },
 
  // ── CAMPAIGN RESPONSES ──
 
  // Submit response to campaign
  submitResponse: (campaignId, data) => {
    console.log(`📤 Submitting response to campaign ${campaignId}...`);
    return api
      .post(`/campaigns/${campaignId}/respond`, data)
      .then((response) => {
        console.log("✅ Response submitted successfully");
        return response;
      })
      .catch((error) => {
        console.error("❌ Failed to submit response:", error.message);
        throw error;
      });
  },
 
  // Get all responses for a campaign
  getResponses: (campaignId, params = {}) => {
    console.log(`📡 Fetching responses for campaign ${campaignId}...`, params);
    return api
      .get(`/campaigns/${campaignId}/responses`, { params })
      .then((response) => {
        console.log(
          `✅ Fetched ${response.data.count || 0} responses from campaign`
        );
        return response;
      })
      .catch((error) => {
        console.error(
          `❌ Failed to fetch responses for campaign ${campaignId}:`,
          error.message
        );
        throw error;
      });
  },
 
  // Get single response
  getResponse: (responseId) => {
    console.log(`📡 Fetching response ${responseId}...`);
    return api.get(`/campaigns/response/${responseId}`).catch((error) => {
      console.error(`❌ Failed to fetch response:`, error.message);
      throw error;
    });
  },
 
  // Update response status
  updateResponseStatus: (responseId, data) => {
    console.log(`📤 Updating response ${responseId} status...`);
    return api
      .put(`/campaigns/response/${responseId}/status`, data)
      .then((response) => {
        console.log("✅ Response status updated");
        return response;
      })
      .catch((error) => {
        console.error("❌ Failed to update response status:", error.message);
        throw error;
      });
  },
 
  // Publish response as story
  publishResponse: (responseId, title) => {
    console.log(`📤 Publishing response ${responseId} as story...`);
    return api
      .post(`/campaigns/response/${responseId}/publish`, { title })
      .then((response) => {
        console.log("✅ Response published successfully");
        return response;
      })
      .catch((error) => {
        console.error("❌ Failed to publish response:", error.message);
        throw error;
      });
  },
 
  // Delete response
  deleteResponse: (responseId) => {
    console.log(`📤 Deleting response ${responseId}...`);
    return api
      .delete(`/campaigns/response/${responseId}`)
      .then((response) => {
        console.log("✅ Response deleted successfully");
        return response;
      })
      .catch((error) => {
        console.error("❌ Failed to delete response:", error.message);
        throw error;
      });
  },
 
  // Export responses as CSV
  exportResponses: (campaignId, params = {}) => {
    console.log(`📥 Exporting responses for campaign ${campaignId}...`);
    return api
      .get(`/campaigns/${campaignId}/responses/export`, {
        params,
        responseType: "blob",
      })
      .catch((error) => {
        console.error("❌ Failed to export responses:", error.message);
        throw error;
      });
  },
 
  // Get campaign analytics
  getAnalytics: (campaignId) => {
    console.log(`📊 Fetching analytics for campaign ${campaignId}...`);
    return api
      .get(`/campaigns/${campaignId}/analytics`)
      .then((response) => {
        console.log("✅ Analytics fetched successfully");
        return response;
      })
      .catch((error) => {
        console.error("❌ Failed to fetch analytics:", error.message);
        throw error;
      });
  },
};

// ── ALUMNI ───────────────────────────────────────────────────────
export const alumniAPI = {
  getAllAlumni: (params) => api.get("/alumni", { params }),
  getAlumniById: (id) => api.get(`/alumni/${id}`),
  updateProfile: (id, data) =>
    api.put(`/alumni/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  getStats: (params) => api.get("/alumni/stats", { params }),
  getMapData: (params) => api.get("/alumni/map/data", { params }),
  getBatches: (params) => api.get("/alumni/batches", { params }),
  getByBatch: (params) => api.get("/alumni/batch-wise", { params }),
  // ✅ ALUMNI CHAPTERS API
  getChapters: (params) => api.get("/alumni/chapters", { params }),
  getChapter: (id) => api.get(`/alumni/chapters/${id}`),
  createChapter: (data) =>
    api.post("/alumni/chapters", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  updateChapter: (id, data) =>
    api.put(`/alumni/chapters/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  deleteChapter: (id) => api.delete(`/alumni/chapters/${id}`),
  joinChapter: (id) => api.post(`/alumni/chapters/${id}/join`),
  leaveChapter: (id) => api.delete(`/alumni/chapters/${id}/leave`),
  getChapterMembers: (id) => api.get(`/alumni/chapters/${id}/members`),
  // Search chapters by category
  getChaptersByCategory: (category, params) =>
    api.get(`/alumni/chapters/category/${category}`, { params }),

  // Get user's chapters (chapters I've joined)
  getMyChapters: () => api.get("/alumni/chapters/my-chapters"),
};

// ── ADMIN ────────────────────────────────────────────────────────
export const adminAPI = {
  // Dashboard stats
  getStats: () => {
    console.log("📊 Fetching admin stats...");
    return api.get("/admin/dashboard/stats");
  },
  getAllAlumni: (params) => {
    console.log("📡 Fetching all alumni...");
    return api.get("/admin/dashboard/alumni/all", { params });
  },
  // Alumni approval & management
  getPendingAlumni: () => api.get("/admin/pending"),
  approveAlumni: (id) => {
    console.log(`📤 Approving alumni ${id}...`);
    return api.put(`/admin/approve/${id}`);
  },
  rejectAlumni: (id) => {
    console.log(`📤 Rejecting alumni ${id}...`);
    return api.put(`/admin/reject/${id}`);
  },
  makeAlumniAdmin: (id) => {
    console.log(`📤 Making alumni ${id} admin...`);
    return api.put(`/admin/make-admin/${id}`);
  },

  // Donations
  getAllDonations: () => {
    console.log("📡 Fetching all donations...");
    return api.get("/admin/dashboard/donations/all");
  },
};

// ── Events API ────────────────────────────────────────────────────────
export const eventsAPI = {
  getAll: (params) => {
    console.log("📡 Fetching events...");
    return api.get("/events", { params });
  },
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => {
    console.log("📤 Creating event...");
    return api.post("/events", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  update: (id, data) => {
    console.log(`📤 Updating event ${id}...`);
    return api.put(`/events/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  delete: (id) => {
    console.log(`📤 Deleting event ${id}...`);
    return api.delete(`/events/${id}`);
  },
};

// ── Albums API ────────────────────────────────────────────────────────
export const albumsAPI = {
  getAll: () => {
    console.log("📡 Fetching albums...");
    return api.get("/albums");
  },
  getByYear: (year) => api.post(`/albums/${year}`),
  create: (data) => {
    console.log("📤 Creating album...");
    return api.post("/albums", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  update: (id, data) => {
    console.log(`📤 Updating album ${id}...`);
    return api.put(`/albums/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  delete: (id) => {
    console.log(`📤 Deleting album ${id}...`);
    return api.delete(`/albums/${id}`);
  },
};

// ── NewsLetter API ────────────────────────────────────────────────────────
export const newsLetterAPI = {
  getAll: () => {
    console.log("📡 Fetching newsletters...");
    return api.get("/newsletters");
  },
  getById: (id) => api.get(`/newsletters/${id}`),
  create: (data) => {
    console.log("📤 Creating newsletter...");
    return api.post("/newsletters", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  update: (id, data) => {
    console.log(`📤 Updating newsletter ${id}...`);
    return api.put(`/newsletters/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  delete: (id) => {
    console.log(`📤 Deleting newsletter ${id}...`);
    return api.delete(`/newsletters/${id}`);
  },
};

// ── Donation API ────────────────────────────────────────────────────────
export const donationAPI = {
  // 🔓 PUBLIC - Create new donation
  create: (data) => {
    console.log("📤 Creating donation...");
    return api.post("/donations", data);
  },
 
  // 🔓 PUBLIC - Verify Razorpay payment
  verifyRazorPay: (data) => {
    console.log("📤 Verifying Razorpay payment...");
    return api.post("/donations/verify-razorpay", data);
  },
 
  // 🔓 PUBLIC - Get donation history with filters (anyone can view)
  getHistory: (params) => {
    console.log("📡 Fetching donation history...", params);
    return api.get("/donations/history", { params });
  },
 
  // 🔓 PUBLIC - Get donation stats
  getStats: (params) => {
    console.log("📡 Fetching donation stats...");
    return api.get("/donations/stats", { params });
  },
 
  // 🔐 ADMIN - Get all donations
  getAll: () => {
    console.log("📡 Fetching all donations (admin)...");
    return api.get("/donations");
  },
 
  // 🔐 ADMIN - Get specific donation by ID
  getById: (id) => {
    console.log(`📡 Fetching donation ${id}...`);
    return api.get(`/donations/${id}`);
  },
 
  // 🔐 ADMIN - Update donation (notes, status, flags)
  update: (id, data) => {
    console.log(`📤 Updating donation ${id}...`);
    return api.put(`/donations/${id}`, data);
  },
 
  // 🔐 ADMIN - Update donation status
  updateStatus: (id, status) => {
    console.log(`📤 Updating donation ${id} status to ${status}...`);
    return api.put(`/donations/${id}/status`, { status });
  },
 
  // 🔐 ADMIN - Flag/Unflag donation
  flagDonation: (id, data) => {
    console.log(`📤 Updating flag status for donation ${id}...`);
    return api.put(`/donations/${id}/flag`, data);
  },
 
  // 🔐 ADMIN - Delete donation
  delete: (id) => {
    console.log(`📤 Deleting donation ${id}...`);
    return api.delete(`/donations/${id}`);
  },
};

// ── Admin Reports API ────────────────────────────────────────────────────────
export const adminReportsAPI = {
  fetchAlumniDataByYear: () => {
    console.log("📊 Fetching alumni data by year...");
    return api.get("/reports/alumni-data-by-year");
  },
  fetchEventsDataByMonth: () => {
    console.log("📊 Fetching events data by month...");
    return api.get("/reports/events-data-by-month");
  },
  fetchAlumniDataByDepartment: () => {
    console.log("📊 Fetching alumni data by department...");
    return api.get("/reports/alumni-data-by-department");
  },
};

// ── ✅ Notification API ───────────────────────────────────────────────
export const notificationAPI = {
  // Alumni: submit a new notification (with optional file attachment)
  submit: (data) =>
    api.post("/notifications", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Alumni: get approved notifications visible to me
  getMyNotifications: () => {
    console.log("📡 Fetching my notifications...");
    return api.get("/notifications");
  },

  // Alumni: see my own submitted notifications (all statuses)
  getMySubmissions: () => {
    console.log("📡 Fetching my submissions...");
    return api.get("/notifications/mine");
  },

  // Admin: get all notifications, optionally filter by status
  adminGetAll: (status) =>
    api.get("/notifications/admin/all", { params: status ? { status } : {} }),

  // Admin: approve
  adminApprove: (id, adminNote = "") =>
    api.put(`/notifications/admin/${id}/approve`, { adminNote }),

  // Admin: reject with reason
  adminReject: (id, reason) =>
    api.put(`/notifications/admin/${id}/reject`, { reason }),

  // Admin: delete
  adminDelete: (id) => {
    console.log(`📤 Deleting notification ${id}...`);
    return api.delete(`/notifications/admin/${id}`);
  },
};

// ──────── ADMIN USERS API ──────────────────────────────────────────────────────
export const adminUsersAPI = {
  getAll: () => {
    console.log("📡 Fetching all admin users...");
    return api.get("/users");
  },
  create: (data) => {
    console.log("📤 Creating admin user...");
    return api.post("/users", data);
  },
  updateUser: (id, data) => {
    console.log(`📤 Updating user ${id}...`);
    return api.put(`/users/${id}`, data);
  },
  deleteUser: (id) => {
    console.log(`📤 Deleting user ${id}...`);
    return api.delete(`/users/${id}`);
  },
};

export default api;