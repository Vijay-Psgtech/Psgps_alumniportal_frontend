// src/pages/alumni/SendNotification.jsx
// ✅ Alumni can compose & submit a notification (pending admin approval)

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  Paperclip,
  Users,
  BookOpen,
  AlertCircle,
  CheckCircle,
  FileText,
  Image,
  ChevronDown,
  Bell,
} from "lucide-react";
import { notificationAPI, alumniAPI } from "../../services/api";

const SendNotification = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: "",
    message: "",
    audienceType: "all",
    targetBatch: "",
  });
  const [attachment, setAttachment] = useState(null);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    alumniAPI.getBatches().then((res) => {
      setBatches(res.data.batches || []);
    }).catch(() => {});
  }, []);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowed.includes(file.type)) {
      setError("Only JPG, PNG, WEBP images or PDF files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be under 5 MB.");
      return;
    }
    setError("");
    setAttachment(file);
  };

  const removeAttachment = () => {
    setAttachment(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim() || !form.message.trim()) {
      setError("Title and message are required.");
      return;
    }
    if (form.audienceType === "batch" && !form.targetBatch) {
      setError("Please select a batch.");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("message", form.message);
    formData.append("audienceType", form.audienceType);
    if (form.audienceType === "batch") {
      formData.append("targetBatch", form.targetBatch);
    }
    if (attachment) formData.append("attachment", attachment);

    try {
      setLoading(true);
      await notificationAPI.submit(formData);
      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        onClose?.();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send notification.");
    } finally {
      setLoading(false);
    }
  };

  const isImage = attachment && attachment.type.startsWith("image/");
  const isPDF = attachment && attachment.type === "application/pdf";

  return (
    <>
      <style>{`
        .sn-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(10, 12, 28, 0.65);
          backdrop-filter: blur(8px);
          z-index: 1100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: sn-fade 0.25s ease;
        }

        @keyframes sn-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .sn-modal {
          background: #fff;
          border-radius: 24px;
          width: 100%;
          max-width: 580px;
          max-height: 92vh;
          overflow-y: auto;
          box-shadow: 0 40px 100px rgba(10, 12, 28, 0.35);
          animation: sn-rise 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          font-family: 'Outfit', 'Inter', sans-serif;
        }

        @keyframes sn-rise {
          from { transform: translateY(40px) scale(0.96); opacity: 0; }
          to   { transform: translateY(0) scale(1); opacity: 1; }
        }

        .sn-header {
          padding: 28px 32px 24px;
          border-bottom: 1px solid #f0f2f8;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          position: sticky;
          top: 0;
          background: #fff;
          border-radius: 24px 24px 0 0;
          z-index: 10;
        }

        .sn-header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .sn-icon-box {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .sn-header-title {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.3px;
        }

        .sn-header-sub {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 2px;
        }

        .sn-close {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          color: #64748b;
          flex-shrink: 0;
        }

        .sn-close:hover {
          background: #fee2e2;
          border-color: #fca5a5;
          color: #dc2626;
        }

        .sn-body {
          padding: 28px 32px 32px;
        }

        /* Field */
        .sn-field {
          margin-bottom: 22px;
        }

        .sn-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.9px;
          color: #64748b;
          margin-bottom: 8px;
        }

        .sn-input,
        .sn-textarea,
        .sn-select {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          font-family: 'Outfit', 'Inter', sans-serif;
          font-size: 14px;
          color: #0f172a;
          background: #f8fafc;
          transition: all 0.25s;
          outline: none;
          box-sizing: border-box;
        }

        .sn-input:focus,
        .sn-textarea:focus,
        .sn-select:focus {
          border-color: #667eea;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.12);
        }

        .sn-textarea {
          resize: vertical;
          min-height: 120px;
          line-height: 1.6;
        }

        .sn-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 42px;
          cursor: pointer;
        }

        /* Audience Tabs */
        .sn-audience-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 22px;
        }

        .sn-tab {
          flex: 1;
          padding: 12px 16px;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
          background: #f8fafc;
          transition: all 0.25s;
        }

        .sn-tab:hover {
          border-color: #c7d2fe;
          color: #667eea;
        }

        .sn-tab.active {
          border-color: #667eea;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
          color: #4f46e5;
        }

        .sn-tab-radio {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid currentColor;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sn-tab.active .sn-tab-radio::after {
          content: '';
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #667eea;
        }

        /* Attachment Zone */
        .sn-attachment-zone {
          border: 2px dashed #e2e8f0;
          border-radius: 14px;
          padding: 22px;
          text-align: center;
          cursor: pointer;
          transition: all 0.25s;
          background: #f8fafc;
        }

        .sn-attachment-zone:hover {
          border-color: #a5b4fc;
          background: rgba(102, 126, 234, 0.03);
        }

        .sn-attachment-zone input { display: none; }

        .sn-attach-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(118, 75, 162, 0.12) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
          color: #667eea;
        }

        .sn-attach-text {
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 4px;
        }

        .sn-attach-hint {
          font-size: 11px;
          color: #94a3b8;
        }

        /* Attachment Preview */
        .sn-attachment-preview {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          background: #f0fdf4;
          border: 1.5px solid #86efac;
          border-radius: 12px;
          margin-top: 10px;
        }

        .sn-attachment-preview-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #dcfce7;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #16a34a;
          flex-shrink: 0;
        }

        .sn-attachment-name {
          flex: 1;
          font-size: 13px;
          font-weight: 600;
          color: #166534;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sn-attachment-size {
          font-size: 11px;
          color: #4ade80;
          margin-top: 2px;
        }

        .sn-attach-remove {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          border: none;
          background: #fef2f2;
          color: #dc2626;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.2s;
        }

        .sn-attach-remove:hover { background: #fee2e2; }

        /* Alerts */
        .sn-error {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 14px 16px;
          background: #fef2f2;
          border: 1px solid #fca5a5;
          border-radius: 12px;
          color: #dc2626;
          font-size: 13px;
          margin-bottom: 20px;
        }

        .sn-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 40px 20px;
          gap: 16px;
        }

        .sn-success-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          animation: sn-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes sn-pop {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }

        .sn-success-title {
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
        }

        .sn-success-text {
          font-size: 14px;
          color: #64748b;
          max-width: 320px;
        }

        /* Footer */
        .sn-footer {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          padding-top: 8px;
        }

        .sn-btn-cancel {
          padding: 11px 22px;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          color: #64748b;
          background: #f8fafc;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Outfit', 'Inter', sans-serif;
        }

        .sn-btn-cancel:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .sn-btn-submit {
          padding: 11px 28px;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          color: white;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.25s;
          font-family: 'Outfit', 'Inter', sans-serif;
          box-shadow: 0 4px 14px rgba(102, 126, 234, 0.35);
        }

        .sn-btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(102, 126, 234, 0.45);
        }

        .sn-btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .sn-divider {
          height: 1px;
          background: #f0f2f8;
          margin: 24px 0;
        }
      `}</style>

      <div className="sn-backdrop" onClick={onClose}>
        <div className="sn-modal" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="sn-header">
            <div className="sn-header-left">
              <div className="sn-icon-box">
                <Bell size={20} />
              </div>
              <div>
                <div className="sn-header-title">Send Notification</div>
                <div className="sn-header-sub">Will be reviewed by admin before publishing</div>
              </div>
            </div>
            <button className="sn-close" onClick={onClose}>
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="sn-body">
            {success ? (
              <div className="sn-success">
                <div className="sn-success-icon">
                  <CheckCircle size={32} />
                </div>
                <div className="sn-success-title">Notification Submitted!</div>
                <div className="sn-success-text">
                  Your notification is pending admin approval. Once approved it will be visible to the selected audience.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="sn-error">
                    <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span>{error}</span>
                  </div>
                )}

                {/* Title */}
                <div className="sn-field">
                  <label className="sn-label">Notification Title *</label>
                  <input
                    className="sn-input"
                    placeholder="e.g. Annual Alumni Meet 2025"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    maxLength={120}
                    required
                  />
                </div>

                {/* Message */}
                <div className="sn-field">
                  <label className="sn-label">Message *</label>
                  <textarea
                    className="sn-textarea"
                    placeholder="Write your message here..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                  />
                </div>

                <div className="sn-divider" />

                {/* Audience */}
                <div className="sn-field">
                  <label className="sn-label">Send To</label>
                  <div className="sn-audience-tabs">
                    <div
                      className={`sn-tab ${form.audienceType === "all" ? "active" : ""}`}
                      onClick={() => setForm({ ...form, audienceType: "all", targetBatch: "" })}
                    >
                      <div className="sn-tab-radio" />
                      <Users size={16} />
                      All Alumni
                    </div>
                    <div
                      className={`sn-tab ${form.audienceType === "batch" ? "active" : ""}`}
                      onClick={() => setForm({ ...form, audienceType: "batch" })}
                    >
                      <div className="sn-tab-radio" />
                      <BookOpen size={16} />
                      Specific Batch
                    </div>
                  </div>

                  {form.audienceType === "batch" && (
                    <select
                      className="sn-select"
                      value={form.targetBatch}
                      onChange={(e) => setForm({ ...form, targetBatch: e.target.value })}
                      required
                    >
                      <option value="">— Select a batch —</option>
                      {batches.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="sn-divider" />

                {/* Attachment */}
                <div className="sn-field">
                  <label className="sn-label">Attachment (Optional)</label>

                  {!attachment ? (
                    <label className="sn-attachment-zone">
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,application/pdf"
                        onChange={handleFile}
                      />
                      <div className="sn-attach-icon">
                        <Paperclip size={20} />
                      </div>
                      <div className="sn-attach-text">Click to attach a file</div>
                      <div className="sn-attach-hint">JPG, PNG, WEBP or PDF · Max 5 MB</div>
                    </label>
                  ) : (
                    <div className="sn-attachment-preview">
                      <div className="sn-attachment-preview-icon">
                        {isImage ? <Image size={18} /> : <FileText size={18} />}
                      </div>
                      <div style={{ flex: 1, overflow: "hidden" }}>
                        <div className="sn-attachment-name">{attachment.name}</div>
                        <div className="sn-attachment-size">
                          {(attachment.size / 1024).toFixed(1)} KB
                        </div>
                      </div>
                      <button
                        type="button"
                        className="sn-attach-remove"
                        onClick={removeAttachment}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="sn-footer">
                  <button type="button" className="sn-btn-cancel" onClick={onClose}>
                    Cancel
                  </button>
                  <button type="submit" className="sn-btn-submit" disabled={loading}>
                    <Send size={16} />
                    {loading ? "Submitting…" : "Submit for Approval"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SendNotification;