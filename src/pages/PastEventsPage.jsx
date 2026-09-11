// frontend/src/pages/PastEventsPage.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Search,
  ChevronRight,
  Sparkles,
  Award,
} from "lucide-react";
import { Link } from "react-router-dom";
import { eventsAPI } from "../services/api";
import usePageTitle from "../hooks/usePageTitle";


const formatDate = (dateString) => {
  const date = new Date(dateString);
  return {
    day: date.getDate(),
    month: date.toLocaleString("en-US", { month: "short" }),
    year: date.getFullYear(),
    dayName: date.toLocaleString("en-US", { weekday: "long" }),
  };
};

// Professional light theme color palette
const PROFESSIONAL_THEME = {
  primary: "#3B82F6",
  secondary: "#0EA5E9",
  tertiary: "#06B6D4",
  light: "#F0F9FF",
  lightBg: "#F8FAFB",
  dark: "#0F172A",
  text: "#64748B",
  border: "#E2E8F0",
  borderHover: "rgba(59, 130, 246, 0.25)",
};

const EventCard = ({ event, idx }) => {
  const dateInfo = formatDate(event.date);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: idx * 0.07 }}
      style={{
        background: "#FFFFFF",
        border: `1.5px solid ${PROFESSIONAL_THEME.border}`,
        borderRadius: "24px",
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
        transition:
          "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = `0 20px 50px rgba(59, 130, 246, 0.12)`;
        e.currentTarget.style.borderColor = PROFESSIONAL_THEME.primary;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 10px 30px rgba(15, 23, 42, 0.08)";
        e.currentTarget.style.borderColor = PROFESSIONAL_THEME.border;
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: `linear-gradient(90deg, transparent, ${PROFESSIONAL_THEME.secondary}80, transparent)`,
        }}
      />

      <div style={{ padding: "24px 24px 0" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "20px",
          }}
        >
          <span
            style={{
              background: `rgba(59, 130, 246, 0.15)`,
              color: PROFESSIONAL_THEME.primary,
              border: `1px solid rgba(59, 130, 246, 0.25)`,
              borderRadius: "20px",
              padding: "6px 14px",
              fontSize: "11px",
              fontWeight: "700",
              letterSpacing: "0.6px",
              textTransform: "uppercase",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            {event.category}
          </span>
          <span
            style={{
              color: "#94A3B8",
              fontSize: "11px",
              fontFamily: "'Poppins', sans-serif",
              fontWeight: "600",
            }}
          >
            ✓ COMPLETED
          </span>
        </div>

        <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
          <div
            style={{
              background: "rgba(59, 130, 246, 0.08)",
              border: `1px solid ${PROFESSIONAL_THEME.border}`,
              borderRadius: "16px",
              padding: "12px 16px",
              textAlign: "center",
              minWidth: "70px",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                fontSize: "28px",
                fontWeight: "800",
                color: PROFESSIONAL_THEME.primary,
                fontFamily: "'Playfair Display', serif",
                lineHeight: 1,
              }}
            >
              {dateInfo.day}
            </div>
            <div
              style={{
                fontSize: "11px",
                color: PROFESSIONAL_THEME.text,
                fontWeight: "600",
                letterSpacing: "0.5px",
                marginTop: "4px",
                fontFamily: "'Poppins', sans-serif",
                textTransform: "uppercase",
              }}
            >
              {dateInfo.month}
            </div>
            <div
              style={{
                fontSize: "10px",
                color: "#94A3B8",
                fontFamily: "'Poppins', sans-serif",
                marginTop: "2px",
              }}
            >
              {dateInfo.year}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "800",
                color: PROFESSIONAL_THEME.dark,
                fontFamily: "'Playfair Display', serif",
                lineHeight: 1.3,
                marginBottom: "8px",
                letterSpacing: "-0.3px",
              }}
            >
              {event.title}
            </h3>
            <p
              style={{
                fontSize: "13px",
                color: PROFESSIONAL_THEME.text,
                lineHeight: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              {event.description}
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "16px 24px 20px",
          marginTop: "16px",
          borderTop: `1px solid ${PROFESSIONAL_THEME.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginBottom: "16px",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: PROFESSIONAL_THEME.text,
              fontSize: "12px",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            <MapPin size={14} color={PROFESSIONAL_THEME.primary} />
            {event.venue?.split(",")[0]}
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: PROFESSIONAL_THEME.text,
              fontSize: "12px",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            <Users size={14} color={PROFESSIONAL_THEME.primary} />
            {event.attendees} attended
          </span>
        </div>
        <Link
          to={`/cas-events/${event._id}`}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(59, 130, 246, 0.08)",
            border: `1.5px solid ${PROFESSIONAL_THEME.border}`,
            borderRadius: "12px",
            padding: "11px 16px",
            color: PROFESSIONAL_THEME.primary,
            fontSize: "13px",
            fontWeight: "700",
            textDecoration: "none",
            transition: "all 0.3s ease",
            fontFamily: "'Poppins', sans-serif",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(59, 130, 246, 0.15)";
            e.currentTarget.style.borderColor = PROFESSIONAL_THEME.primary;
            e.currentTarget.style.transform = "translateX(3px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(59, 130, 246, 0.08)";
            e.currentTarget.style.borderColor = PROFESSIONAL_THEME.border;
            e.currentTarget.style.transform = "translateX(0)";
          }}
        >
          <span>View Event Summary</span>
          <ChevronRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
};

const PastEventsPage = () => {
  const [pastEvents, setpastEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  usePageTitle("Events");

  // ✅ Fetch Upcoming events from API
  async function fetchPastEvents() {
    try {
      const response = await eventsAPI.getAll({ status: "completed" });
      setpastEvents(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch events:", err);

      setpastEvents([]);
    }
  }

  useEffect(() => {
    fetchPastEvents();
  }, []);

  const filteredEvents = pastEvents.filter((e) => {
    const matchSearch =
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  const totalAttended = pastEvents.reduce(
    (sum, event) => sum + (event.attendees || 0),
    0,
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FFFFFF",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;800;900&family=Poppins:wght@300;400;500;600;700;800&display=swap');
        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 32px;
          margin-bottom: 60px;
        }
        @media(max-width: 768px) {
          .events-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Hero Section */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #F8FAFB 0%, #FFFFFF 50%, #F0F9FF 100%)",
          paddingTop: "100px",
          paddingBottom: "60px",
          position: "relative",
          overflow: "hidden",
          borderBottom: "1px solid #E2E8F0",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "10%",
            right: "5%",
            width: "300px",
            height: "300px",
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-50%",
            left: "10%",
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle, rgba(6, 182, 212, 0.06) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
            filter: "blur(40px)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 24px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#F0F9FF",
              border: "1px solid #BFDBFE",
              borderRadius: "50px",
              padding: "8px 18px",
              marginBottom: "24px",
              width: "fit-content",
            }}
          >
            <Award size={14} color={PROFESSIONAL_THEME.primary} />
            <span
              style={{
                color: PROFESSIONAL_THEME.primary,
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "1px",
                fontFamily: "'Poppins', sans-serif",
                textTransform: "uppercase",
              }}
            >
              Past Events
            </span>
          </div>
          <h1
            style={{
              fontSize: "clamp(36px, 6vw, 64px)",
              fontWeight: "800",
              color: PROFESSIONAL_THEME.dark,
              fontFamily: "'Playfair Display', serif",
              lineHeight: 1.1,
              marginBottom: "20px",
              letterSpacing: "-1px",
            }}
          >
            Celebrating Our
            <br />
            <span
              style={{
                background:
                  "linear-gradient(135deg, #3B82F6, #0EA5E9, #06B6D4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Success Stories
            </span>
          </h1>
          <p
            style={{
              color: PROFESSIONAL_THEME.text,
              fontSize: "16px",
              maxWidth: "520px",
              margin: "0 auto 40px",
              lineHeight: 1.7,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Relive the moments of connection, celebration, and achievement from
            our past events. Explore memories with the CAS community.
          </p>
          <div
            style={{
              display: "inline-flex",
              gap: "0",
              background: "#FFFFFF",
              border: `1.5px solid ${PROFESSIONAL_THEME.border}`,
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
            }}
          >
            {[
              {
                label: "Total Events",
                value: pastEvents.length,
                color: PROFESSIONAL_THEME.primary,
              },
              {
                label: "Total Attendees",
                value: Math.ceil(totalAttended / 100) + "00+",
                color: PROFESSIONAL_THEME.secondary,
              },
              {
                label: "Alumni Base",
                value: "8K+",
                color: PROFESSIONAL_THEME.tertiary,
              },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  padding: "20px 32px",
                  borderRight:
                    i < 2 ? `1px solid ${PROFESSIONAL_THEME.border}` : "none",
                }}
              >
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: "800",
                    color: stat.color,
                    fontFamily: "'Playfair Display', serif",
                    letterSpacing: "-0.5px",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: PROFESSIONAL_THEME.text,
                    fontFamily: "'Poppins', sans-serif",
                    letterSpacing: "0.5px",
                    marginTop: "4px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            display: "flex",
            gap: "16px",
            marginBottom: "40px",
            marginTop: "-30px",
            flexWrap: "wrap",
            alignItems: "center",
            position: "relative",
            zIndex: 10,
          }}
        >
          <div style={{ flex: 1, minWidth: "260px", position: "relative" }}>
            <Search
              size={16}
              color={PROFESSIONAL_THEME.text}
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
            <input
              type="text"
              placeholder="Search events, categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                background: "#FFFFFF",
                border: `2px solid ${PROFESSIONAL_THEME.border}`,
                borderRadius: "14px",
                padding: "13px 16px 13px 44px",
                color: PROFESSIONAL_THEME.dark,
                fontSize: "14px",
                outline: "none",
                fontFamily: "'Poppins', sans-serif",
                boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
                transition: "all 0.3s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = PROFESSIONAL_THEME.primary;
                e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = PROFESSIONAL_THEME.border;
                e.target.style.boxShadow = "0 2px 8px rgba(15, 23, 42, 0.04)";
              }}
            />
          </div>
        </motion.div>

        {/* Section label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "3px",
              height: "24px",
              background: `linear-gradient(180deg, ${PROFESSIONAL_THEME.primary}, ${PROFESSIONAL_THEME.secondary})`,
              borderRadius: "2px",
            }}
          />
          <span
            style={{
              color: PROFESSIONAL_THEME.dark,
              fontWeight: "800",
              fontSize: "18px",
              fontFamily: "'Playfair Display', serif",
              letterSpacing: "-0.3px",
            }}
          >
            Past Events
          </span>
          <span
            style={{
              color: PROFESSIONAL_THEME.text,
              fontSize: "14px",
              fontFamily: "'Poppins', sans-serif",
              fontWeight: "600",
            }}
          >
            ({filteredEvents.length})
          </span>
        </div>

        <AnimatePresence mode="wait">
          {filteredEvents.length > 0 ? (
            <div className="events-grid">
              {filteredEvents.map((event, idx) => (
                <EventCard key={event._id} event={event} idx={idx} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: "center",
                padding: "80px 20px",
                background: "#FFFFFF",
                border: `1.5px solid ${PROFESSIONAL_THEME.border}`,
                borderRadius: "24px",
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>✓</div>
              <h3
                style={{
                  color: PROFESSIONAL_THEME.dark,
                  fontSize: "20px",
                  fontFamily: "'Playfair Display', serif",
                  marginBottom: "8px",
                  fontWeight: "800",
                  letterSpacing: "-0.3px",
                }}
              >
                No events found
              </h3>
              <p
                style={{
                  color: PROFESSIONAL_THEME.text,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Try adjusting your search to find past events.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PastEventsPage;
