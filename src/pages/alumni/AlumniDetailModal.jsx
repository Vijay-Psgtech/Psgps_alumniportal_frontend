import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle,
  Linkedin,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  BookOpen,
  GraduationCap,
  Hash,
  ExternalLink,
} from "lucide-react";

const getInitials = (first = "", last = "") =>
  `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || "?";

const canSeeFullDetails = (viewer, subject) => {
  if (!viewer || !subject) return false;
  if (viewer.role === "admin" || viewer.role === "superadmin") return true;
  return String(viewer.batchYear) === String(subject.batchYear);
};

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 26 }}>
    <h3
      style={{
        fontSize: 13,
        fontWeight: 700,
        color: "#64748b",
        marginBottom: 12,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      }}
    >
      {title}
    </h3>

    <div
      style={{
        background: "#f8fafc",
        borderRadius: 12,
        border: "1px solid #f1f5f9",
        padding: 16,
      }}
    >
      {children}
    </div>
  </div>
);

const InfoRow = ({ icon: Icon, label, value }) => {
  if (!value) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 12,
      }}
    >
      <Icon size={16} color="#64748b" />

      <div>
        <div
          style={{
            fontSize: 11,
            color: "#94a3b8",
            fontWeight: 600,
          }}
        >
          {label}
        </div>

        <div
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "#0f172a",
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
};

const SocialBtn = ({ href, icon: Icon }) => {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        width: 36,
        height: 36,
        borderRadius: 8,
        border: "1px solid #e2e8f0",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon size={16} color="#475569" />
    </a>
  );
};

const AlumniDetailModal = ({ alumni, isOpen, onClose, apiBase, viewer }) => {
  if (!isOpen || !alumni) return null;

  const full = canSeeFullDetails(viewer, alumni);

  const photo = alumni.files?.currentPhoto || alumni.profileImage;

  const photoUrl = photo ? `${apiBase}/uploads/${photo}` : null;

  const jobLine = alumni.jobTitle
    ? `${alumni.jobTitle}${
        alumni.currentCompany ? " · " + alumni.currentCompany : ""
      }`
    : alumni.occupation;

  const location = [alumni.city, alumni.country].filter(Boolean).join(", ");

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[2000] flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div
          onClick={onClose}
          style={{
            position: "absolute inset-0 z-[2000]",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(4px)",
          }}
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.97 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.97 }}
          style={{
            width: "100%",
            maxWidth: 700,
            background: "#fff",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: 24,
              borderBottom: "1px solid #f1f5f9",
              display: "flex",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 12,
                background: "#f1f5f9",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
              }}
            >
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                getInitials(alumni.firstName, alumni.lastName)
              )}
            </div>

            <div style={{ flex: 1 }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                {alumni.firstName} {alumni.lastName}
              </h2>

              <div
                style={{
                  fontSize: 14,
                  color: "#64748b",
                  marginTop: 4,
                }}
              >
                {alumni.department} • {alumni.batchYear}
              </div>

              {jobLine && (
                <div
                  style={{
                    fontSize: 14,
                    marginTop: 6,
                    color: "#334155",
                  }}
                >
                  {jobLine}
                </div>
              )}
            </div>

            <button onClick={onClose}>
              <X />
            </button>
          </div>

          {/* Body */}
          <div
            style={{
              padding: 24,
              maxHeight: "70vh",
              overflowY: "auto",
            }}
          >
            <Section title="Basic Information">
              <InfoRow
                icon={GraduationCap}
                label="Degree"
                value={alumni.degree}
              />

              <InfoRow
                icon={Hash}
                label="Roll Number"
                value={alumni.rollNumber}
              />

              <InfoRow icon={MapPin} label="Location" value={location} />
            </Section>

            <Section title="Professional Information">
              <InfoRow icon={Briefcase} label="Current Role" value={jobLine} />

              <InfoRow
                icon={Briefcase}
                label="Company"
                value={alumni.currentCompany}
              />
            </Section>

            {full && (
              <Section title="Contact Information">
                <InfoRow icon={Mail} label="Email" value={alumni.email} />

                <InfoRow icon={Phone} label="Phone" value={alumni.phone} />
              </Section>
            )}

            <Section title="Social Profiles">
              <div
                style={{
                  display: "flex",
                  gap: 10,
                }}
              >
                <SocialBtn href={alumni.social?.linkedin} icon={Linkedin} />

                <SocialBtn href={alumni.social?.twitter} icon={Twitter} />

                <SocialBtn href={alumni.social?.instagram} icon={Instagram} />
              </div>
            </Section>
          </div>

          {/* Footer */}
          <div
            style={{
              padding: 16,
              borderTop: "1px solid #f1f5f9",
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
            }}
          >
            

            <button
              onClick={onClose}
              style={{
                background: "#0f172a",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: 8,
                border: "none",
              }}
            >
              Done
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AlumniDetailModal;
