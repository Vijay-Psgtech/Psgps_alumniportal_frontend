// src/pages/admin/AdminNotifications.jsx
// ✅ Admin can view, approve, reject, and delete alumni-submitted notifications

import React, { useState, useEffect, useCallback } from "react";
import {
  Bell,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  FileText,
  Image,
  Users,
  BookOpen,
  Clock,
  RefreshCw,
  X,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Search,
} from "lucide-react";
import { notificationAPI, API_BASE } from "../../services/api";

/* ── Status config ─────────────────────────────────────────────── */
const STATUS = {
  pending: { label: "Pending Review", color: "#d97706", bg: "#fffbeb", border: "#fde68a", icon: Clock },
  approved: { label: "Approved", color: "#16a34a", bg: "#f0fdf4", border: "#86efac", icon: CheckCircle },
  rejected: { label: "Rejected", color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", icon: XCircle },
};

/* ── Reject Reason Modal ──────────────────────────────────────── */
const RejectModal = ({ notification, onConfirm, onCancel }) => {
  const [reason, setReason] = useState("");

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(10,12,28,0.6)",
      backdropFilter: "blur(8px)",
      zIndex: 2000,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }}>
      <div style={{
        background: "#fff", borderRadius: 20, padding: 32,
        maxWidth: 460, width: "100%",
        boxShadow: "0 30px 80px rgba(10,12,28,0.3)",
        animation: "popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        fontFamily: "'Outfit','Inter',sans-serif",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14,
            background: "#fef2f2", display: "flex",
            alignItems: "center", justifyContent: "center", color: "#dc2626",
          }}>
            <XCircle size={22} />
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#0f172a" }}>Reject Notification</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
              "{notification.title}"
            </div>
          </div>
        </div>

        <label style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.9px", color: "#64748b", marginBottom: 8 }}>
          Reason (optional)
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Let the sender know why this was rejected..."
          style={{
            width: "100%", padding: "12px 14px",
            border: "1.5px solid #e2e8f0", borderRadius: 12,
            fontFamily: "inherit", fontSize: 14, color: "#0f172a",
            background: "#f8fafc", outline: "none",
            resize: "vertical", minHeight: 100,
            boxSizing: "border-box",
          }}
          onFocus={(e) => { e.target.style.borderColor = "#dc2626"; e.target.style.boxShadow = "0 0 0 3px rgba(220,38,38,0.1)"; }}
          onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
        />

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
          <button
            onClick={onCancel}
            style={{
              padding: "10px 22px", border: "1.5px solid #e2e8f0",
              borderRadius: 12, background: "#f8fafc",
              color: "#64748b", fontSize: 14, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason)}
            style={{
              padding: "10px 22px", border: "none",
              borderRadius: 12, background: "#dc2626",
              color: "white", fontSize: 14, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: 7,
            }}
          >
            <XCircle size={15} />
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Single Notification Card ─────────────────────────────────── */
const AdminNotifCard = ({ notification, onApprove, onReject, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const s = STATUS[notification.status] || STATUS.pending;
  const SIcon = s.icon;
  const fileUrl = notification.attachment?.path ? `${API_BASE}/${notification.attachment.path}` : null;
  const isImage = notification.attachment?.mimetype?.startsWith("image/");
  const isPDF = notification.attachment?.mimetype === "application/pdf";

  const doAction = async (type, fn) => {
    setActionLoading(type);
    try { await fn(); } finally { setActionLoading(null); }
  };

  return (
    <div style={{
      background: "#fff",
      border: `1.5px solid ${notification.status === "pending" ? "#e0e7ff" : s.border}`,
      borderRadius: 16,
      overflow: "hidden",
      transition: "box-shadow 0.25s",
      boxShadow: "0 2px 8px rgba(15,23,42,0.06)",
      fontFamily: "'Outfit','Inter',sans-serif",
    }}>
      {/* Status strip */}
      <div style={{
        height: 4,
        background: notification.status === "pending"
          ? "linear-gradient(90deg, #667eea, #764ba2)"
          : notification.status === "approved"
          ? "linear-gradient(90deg, #22c55e, #16a34a)"
          : "linear-gradient(90deg, #ef4444, #dc2626)",
      }} />

      <div style={{ padding: "20px 24px" }}>
        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
              {notification.title}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "#64748b" }}>
                From: <strong style={{ color: "#334155" }}>{notification.senderName}</strong>
                {notification.senderEmail && (
                  <span style={{ color: "#94a3b8" }}> · {notification.senderEmail}</span>
                )}
              </span>
              <span style={{
                display: "flex", alignItems: "center", gap: 4,
                padding: "3px 10px", borderRadius: 20,
                background: notification.audienceType === "all" ? "#eff6ff" : "#faf5ff",
                color: notification.audienceType === "all" ? "#3b82f6" : "#9333ea",
                fontSize: 11, fontWeight: 700,
              }}>
                {notification.audienceType === "all"
                  ? <><Users size={11} /> All Alumni</>
                  : <><BookOpen size={11} /> Batch: {notification.targetBatch}</>
                }
              </span>
              <span style={{ fontSize: 11, color: "#94a3b8" }}>
                {new Date(notification.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                })}
              </span>
            </div>
          </div>

          {/* Status badge */}
          <div style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "5px 12px", borderRadius: 20,
            background: s.bg, color: s.color,
            fontSize: 11, fontWeight: 700, flexShrink: 0,
            border: `1px solid ${s.border}`,
          }}>
            <SIcon size={12} />
            {s.label}
          </div>
        </div>

        {/* Message */}
        <div style={{
          marginTop: 14, fontSize: 14, color: "#475569",
          lineHeight: 1.65, background: "#f8fafc",
          borderRadius: 10, padding: "14px 16px",
          display: "-webkit-box", WebkitLineClamp: expanded ? "unset" : 3,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {notification.message}
        </div>

        {notification.message.length > 200 && (
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#667eea", fontSize: 12, fontWeight: 600,
              marginTop: 6, display: "flex", alignItems: "center",
              gap: 4, padding: 0, fontFamily: "inherit",
            }}
          >
            {expanded ? <><ChevronUp size={13} /> Show less</> : <><ChevronDown size={13} /> Read more</>}
          </button>
        )}

        {/* Rejection note */}
        {notification.status === "rejected" && notification.adminNote && (
          <div style={{
            marginTop: 12, padding: "10px 14px",
            background: "#fef2f2", border: "1px solid #fca5a5",
            borderRadius: 10, fontSize: 12, color: "#dc2626",
          }}>
            <strong>Rejection reason:</strong> {notification.adminNote}
          </div>
        )}

        {/* Attachment preview */}
        {notification.attachment && fileUrl && (
          <div style={{ marginTop: 14 }}>
            {isImage ? (
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={fileUrl}
                  alt={notification.attachment.originalName}
                  style={{
                    maxWidth: "100%", maxHeight: 160, borderRadius: 10,
                    objectFit: "cover", border: "1px solid #e2e8f0",
                    cursor: "pointer",
                  }}
                />
              </a>
            ) : isPDF ? (
              <a href={fileUrl} target="_blank" rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "9px 14px", borderRadius: 10,
                  background: "#fff7ed", border: "1.5px solid #fed7aa",
                  color: "#ea580c", fontSize: 13, fontWeight: 600,
                  textDecoration: "none",
                }}>
                <FileText size={15} />
                {notification.attachment.originalName}
                <ExternalLink size={12} />
              </a>
            ) : null}
          </div>
        )}

        {/* Action Buttons — only for pending */}
        {notification.status === "pending" && (
          <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
            <button
              disabled={actionLoading !== null}
              onClick={() => doAction("approve", () => onApprove(notification._id))}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "10px 20px", borderRadius: 12, border: "none",
                background: actionLoading === "approve"
                  ? "#dcfce7" : "linear-gradient(135deg, #22c55e, #16a34a)",
                color: actionLoading === "approve" ? "#16a34a" : "white",
                fontSize: 13, fontWeight: 700, cursor: "pointer",
                fontFamily: "inherit", transition: "all 0.2s",
                boxShadow: "0 4px 12px rgba(22,163,74,0.25)",
              }}
            >
              <CheckCircle size={14} />
              {actionLoading === "approve" ? "Approving…" : "Approve"}
            </button>

            <button
              disabled={actionLoading !== null}
              onClick={() => doAction("reject", () => onReject(notification))}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "10px 20px", borderRadius: 12,
                border: "1.5px solid #fca5a5",
                background: "#fef2f2", color: "#dc2626",
                fontSize: 13, fontWeight: 700, cursor: "pointer",
                fontFamily: "inherit", transition: "all 0.2s",
              }}
            >
              <XCircle size={14} />
              {actionLoading === "reject" ? "Rejecting…" : "Reject"}
            </button>

            <button
              disabled={actionLoading !== null}
              onClick={() => doAction("delete", () => onDelete(notification._id))}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "10px 16px", borderRadius: 12,
                border: "1.5px solid #e2e8f0",
                background: "#f8fafc", color: "#64748b",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                fontFamily: "inherit", marginLeft: "auto",
              }}
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        )}

        {/* For approved/rejected: only delete */}
        {notification.status !== "pending" && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
            <button
              onClick={() => onDelete(notification._id)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 14px", borderRadius: 10,
                border: "1.5px solid #e2e8f0",
                background: "#f8fafc", color: "#94a3b8",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <Trash2 size={13} />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Main Component ───────────────────────────────────────────── */
const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [search, setSearch] = useState("");
  const [rejectTarget, setRejectTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchNotifications = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await notificationAPI.adminGetAll(statusFilter || undefined);
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error("AdminNotifications fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const handleApprove = async (id) => {
    await notificationAPI.adminApprove(id);
    showToast("Notification approved and published!");
    fetchNotifications(true);
  };

  const handleReject = async (reason) => {
    await notificationAPI.adminReject(rejectTarget._id, reason);
    setRejectTarget(null);
    showToast("Notification rejected.", "error");
    fetchNotifications(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notification permanently?")) return;
    await notificationAPI.adminDelete(id);
    showToast("Notification deleted.");
    fetchNotifications(true);
  };

  const counts = {
    all: notifications.length,
    pending: notifications.filter((n) => n.status === "pending").length,
    approved: notifications.filter((n) => n.status === "approved").length,
    rejected: notifications.filter((n) => n.status === "rejected").length,
  };

  const filtered = notifications.filter((n) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.senderName.toLowerCase().includes(q) ||
      n.message.toLowerCase().includes(q)
    );
  });

  const TABS = [
    { key: "pending", label: "Pending", color: "#d97706" },
    { key: "approved", label: "Approved", color: "#16a34a" },
    { key: "rejected", label: "Rejected", color: "#dc2626" },
    { key: "", label: "All", color: "#64748b" },
  ];

  return (
    <div style={{ fontFamily: "'Outfit','Inter',sans-serif", padding: "100px 50px" }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 3000,
          padding: "14px 20px", borderRadius: 14,
          background: toast.type === "error" ? "#dc2626" : "#16a34a",
          color: "white", fontSize: 14, fontWeight: 600,
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          animation: "popIn 0.3s ease",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          {toast.type === "error" ? <XCircle size={16} /> : <CheckCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Reject Modal */}
      {rejectTarget && (
        <RejectModal
          notification={rejectTarget}
          onConfirm={handleReject}
          onCancel={() => setRejectTarget(null)}
        />
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14,
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            display: "flex", alignItems: "center", justifyContent: "center", color: "white",
          }}>
            <Bell size={20} />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}>Alumni Notifications</div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>Review and approve submitted notifications</div>
          </div>
        </div>

        <button
          onClick={() => fetchNotifications(true)}
          disabled={refreshing}
          style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "9px 16px", borderRadius: 12,
            border: "1.5px solid #e2e8f0", background: "#f8fafc",
            color: "#64748b", fontSize: 13, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          <RefreshCw size={14} style={{ animation: refreshing ? "spin 1s linear infinite" : "none" }} />
          Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {TABS.map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => setStatusFilter(key)}
            style={{
              padding: "8px 16px", borderRadius: 10,
              border: statusFilter === key ? `1.5px solid ${color}` : "1.5px solid #e2e8f0",
              background: statusFilter === key ? `${color}15` : "#f8fafc",
              color: statusFilter === key ? color : "#64748b",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              fontFamily: "inherit", transition: "all 0.2s",
            }}
          >
            {label}
            {key !== "" && (
              <span style={{
                marginLeft: 7, padding: "1px 7px", borderRadius: 20,
                background: statusFilter === key ? color : "#e2e8f0",
                color: statusFilter === key ? "#fff" : "#64748b",
                fontSize: 11, fontWeight: 700,
              }}>
                {key === "pending" ? counts.pending : key === "approved" ? counts.approved : counts.rejected}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "12px 16px", borderRadius: 12,
        border: "1.5px solid #e2e8f0", background: "#fff",
        marginBottom: 24, boxShadow: "0 1px 4px rgba(15,23,42,0.04)",
      }}>
        <Search size={16} style={{ color: "#94a3b8", flexShrink: 0 }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, sender, or message…"
          style={{
            flex: 1, border: "none", outline: "none",
            fontSize: 14, color: "#0f172a", fontFamily: "inherit",
            background: "transparent",
          }}
        />
        {search && (
          <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0 }}>
            <X size={15} />
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
          <div style={{
            width: 40, height: 40, border: "3px solid #e2e8f0",
            borderTopColor: "#667eea", borderRadius: "50%",
            animation: "spin 0.8s linear infinite", margin: "0 auto 16px",
          }} />
          Loading notifications…
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{
            width: 60, height: 60, borderRadius: 20,
            background: "linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1))",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px", color: "#667eea",
          }}>
            <Bell size={28} />
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, color: "#475569" }}>
            No {statusFilter || ""} notifications found
          </div>
          <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 6 }}>
            {statusFilter === "pending" ? "All caught up! No pending notifications." : "Try a different filter."}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {filtered.map((n) => (
            <AdminNotifCard
              key={n._id}
              notification={n}
              onApprove={handleApprove}
              onReject={(notif) => setRejectTarget(notif)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes popIn {
          from { transform: scale(0.92); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AdminNotifications;