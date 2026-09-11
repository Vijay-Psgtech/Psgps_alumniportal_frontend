// src/pages/alumni/NotificationInbox.jsx
// ✅ Alumni sees approved notifications + their own submission history

import React, { useState, useEffect } from "react";
import {
  Bell,
  FileText,
  Image,
  ExternalLink,
  Clock,
  Users,
  BookOpen,
  RefreshCw,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { notificationAPI, API_BASE } from "../../services/api";

const STATUS_BADGE = {
  pending: { label: "Pending", color: "#f59e0b", bg: "#fffbeb", icon: Clock },
  approved: { label: "Approved", color: "#16a34a", bg: "#f0fdf4", icon: CheckCircle },
  rejected: { label: "Rejected", color: "#dc2626", bg: "#fef2f2", icon: XCircle },
};

const NotificationCard = ({ notification, isSubmission }) => {
  const [expanded, setExpanded] = useState(false);
  const badge = STATUS_BADGE[notification.status] || STATUS_BADGE.pending;
  const BadgeIcon = badge.icon;
  const isImage = notification.attachment?.mimetype?.startsWith("image/");
  const isPDF = notification.attachment?.mimetype === "application/pdf";
  const fileUrl = notification.attachment?.path
    ? `${API_BASE}/${notification.attachment.path}`
    : null;

  return (
    <div style={{
      background: "#fff",
      border: "1.5px solid #f0f2f8",
      borderRadius: "16px",
      overflow: "hidden",
      transition: "box-shadow 0.25s",
      boxShadow: "0 2px 8px rgba(15,23,42,0.06)",
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 24px rgba(15,23,42,0.12)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(15,23,42,0.06)"}
    >
      <div style={{ padding: "20px 24px" }}>
        {/* Top Row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>
              {notification.title}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, color: "#64748b" }}>
                From: <strong>{notification.senderName}</strong>
              </span>
              <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#cbd5e1" }} />
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#64748b" }}>
                {notification.audienceType === "all" ? (
                  <><Users size={12} /> All Alumni</>
                ) : (
                  <><BookOpen size={12} /> Batch {notification.targetBatch}</>
                )}
              </span>
            </div>
          </div>

          {/* Status / Date */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
            {isSubmission && (
              <div style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "4px 10px", borderRadius: 20,
                background: badge.bg, color: badge.color,
                fontSize: 11, fontWeight: 700,
              }}>
                <BadgeIcon size={11} />
                {badge.label}
              </div>
            )}
            <span style={{ fontSize: 11, color: "#94a3b8" }}>
              {new Date(notification.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit", month: "short", year: "numeric"
              })}
            </span>
          </div>
        </div>

        {/* Message Preview / Expanded */}
        <div style={{
          fontSize: 14, color: "#334155", lineHeight: 1.65,
          display: "-webkit-box", WebkitLineClamp: expanded ? "unset" : 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {notification.message}
        </div>

        {notification.message.length > 120 && (
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#667eea", fontSize: 12, fontWeight: 600, marginTop: 6,
              display: "flex", alignItems: "center", gap: 4, padding: 0,
              fontFamily: "inherit",
            }}
          >
            {expanded ? <><ChevronUp size={14} /> Show less</> : <><ChevronDown size={14} /> Read more</>}
          </button>
        )}

        {/* Rejection note */}
        {isSubmission && notification.status === "rejected" && notification.adminNote && (
          <div style={{
            marginTop: 12, padding: "10px 14px", borderRadius: 10,
            background: "#fef2f2", border: "1px solid #fca5a5",
            fontSize: 12, color: "#dc2626",
          }}>
            <strong>Admin note:</strong> {notification.adminNote}
          </div>
        )}

        {/* Attachment */}
        {notification.attachment && fileUrl && (
          <div style={{ marginTop: 14 }}>
            {isImage ? (
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={fileUrl}
                  alt={notification.attachment.originalName}
                  style={{
                    maxWidth: "100%", maxHeight: 200, borderRadius: 10,
                    objectFit: "cover", border: "1px solid #e2e8f0",
                  }}
                />
              </a>
            ) : isPDF ? (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "10px 16px", borderRadius: 10,
                  background: "#fff7ed", border: "1.5px solid #fed7aa",
                  color: "#ea580c", fontSize: 13, fontWeight: 600,
                  textDecoration: "none", transition: "all 0.2s",
                }}
              >
                <FileText size={16} />
                {notification.attachment.originalName}
                <ExternalLink size={13} />
              </a>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

const NotificationInbox = () => {
  const [tab, setTab] = useState("inbox");       // "inbox" | "sent"
  const [notifications, setNotifications] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const [inboxRes, sentRes] = await Promise.all([
        notificationAPI.getMyNotifications(),
        notificationAPI.getMySubmissions(),
      ]);
      setNotifications(inboxRes.data.notifications || []);
      setSubmissions(sentRes.data.notifications || []);
    } catch (err) {
      console.error("NotificationInbox fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const active = tab === "inbox" ? notifications : submissions;

  return (
    <div style={{ fontFamily: "'Outfit', 'Inter', sans-serif", padding: "0 0 40px" }}>
      {/* Tabs */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { key: "inbox", label: "Inbox", icon: Bell, count: notifications.length },
            { key: "sent", label: "My Submissions", icon: Send, count: submissions.length },
          ].map(({ key, label, icon: Icon, count }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "9px 18px", borderRadius: 12,
                border: tab === key ? "1.5px solid #667eea" : "1.5px solid #e2e8f0",
                background: tab === key
                  ? "linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)"
                  : "#f8fafc",
                color: tab === key ? "#4f46e5" : "#64748b",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                fontFamily: "inherit", transition: "all 0.2s",
              }}
            >
              <Icon size={15} />
              {label}
              <span style={{
                padding: "1px 7px", borderRadius: 20,
                background: tab === key ? "#667eea" : "#e2e8f0",
                color: tab === key ? "#fff" : "#64748b",
                fontSize: 11, fontWeight: 700,
              }}>
                {count}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => fetchAll(true)}
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
      ) : active.length === 0 ? (
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
            {tab === "inbox" ? "No notifications yet" : "You haven't sent any notifications"}
          </div>
          <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 6 }}>
            {tab === "inbox"
              ? "Approved notifications will appear here"
              : "Use the 'Send Notification' button to compose one"}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {active.map((n) => (
            <NotificationCard
              key={n._id}
              notification={n}
              isSubmission={tab === "sent"}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default NotificationInbox;