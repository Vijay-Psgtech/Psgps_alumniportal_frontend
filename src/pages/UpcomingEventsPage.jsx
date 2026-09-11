// frontend/src/pages/UpcomingEventsPage.jsx
// ✅ FIXED: Import corrected from ../Context/ to ../context/ (lowercase)
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Search,
  ChevronRight,
  Sparkles,
  Star,
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

const EventCard = ({ event, idx }) => {
  const dateInfo = formatDate(event.date);
  const catColor = "#8b5a3c";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: idx * 0.07 }}
      style={{
        background: "#ffffff",
        border: event.highlight
          ? `1px solid ${catColor}55`
          : "1px solid rgba(139,90,60,0.09)",
        borderRadius: "20px",
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 2px 16px rgba(139,90,60,0.06)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = `0 12px 40px rgba(139,90,60,0.12), 0 0 0 1px ${catColor}30`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 16px rgba(139,90,60,0.06)";
      }}
    >
      {event.highlight && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: `linear-gradient(90deg, transparent, ${catColor}, transparent)`,
          }}
        />
      )}

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
              background: `${catColor}12`,
              color: catColor,
              border: `1px solid ${catColor}30`,
              borderRadius: "20px",
              padding: "4px 14px",
              fontSize: "11px",
              fontWeight: "700",
              letterSpacing: "1px",
              textTransform: "uppercase",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {event.category}
          </span>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {event.highlight && (
              <Star size={14} fill={catColor} color={catColor} />
            )}
            <span
              style={{
                color: "#9ca3af",
                fontSize: "11px",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              UPCOMING
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
          <div
            style={{
              background: `${catColor}10`,
              border: `1px solid ${catColor}30`,
              borderRadius: "14px",
              padding: "12px 16px",
              textAlign: "center",
              minWidth: "64px",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                fontSize: "28px",
                fontWeight: "800",
                color: catColor,
                fontFamily: "'Playfair Display', serif",
                lineHeight: 1,
              }}
            >
              {dateInfo.day}
            </div>
            <div
              style={{
                fontSize: "11px",
                color: catColor,
                fontWeight: "600",
                letterSpacing: "1px",
                marginTop: "2px",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {dateInfo.month.toUpperCase()}
            </div>
            <div
              style={{
                fontSize: "10px",
                color: "#adb5bd",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {dateInfo.year}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: "#2d1810",
                fontFamily: "'Playfair Display', serif",
                lineHeight: 1.3,
                marginBottom: "8px",
              }}
            >
              {event.title}
            </h3>
            <p
              style={{
                fontSize: "13px",
                color: "#6b7280",
                lineHeight: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
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
          borderTop: "1px solid rgba(139,90,60,0.06)",
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
              gap: "5px",
              color: "#9ca3af",
              fontSize: "12px",
            }}
          >
            <MapPin size={12} />
            {event.venue?.split(",")[0]}
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              color: "#9ca3af",
              fontSize: "12px",
            }}
          >
            <Users size={12} />
            {event.attendees} expected
          </span>
        </div>
        <Link
          to={`/cas-events/${event._id}`}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: `${catColor}09`,
            border: `1px solid ${catColor}25`,
            borderRadius: "10px",
            padding: "10px 16px",
            color: catColor,
            fontSize: "13px",
            fontWeight: "600",
            textDecoration: "none",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateX(3px)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "translateX(0)")
          }
        >
          <span>View Details & Register</span>
          <ChevronRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
};

const UpcomingEventsPage = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  usePageTitle("Events");

  // ✅ Fetch events on mount
  // ✅ Fetch Upcoming events from API
  async function fetchUpcomingEvents() {
    try {
      const response = await eventsAPI.getAll({ status: "upcoming" });
      setUpcomingEvents(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch events:", err);

      setUpcomingEvents([]);
    }
  }

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  const filteredEvents = upcomingEvents.filter((e) => {
    const q = searchTerm.toLowerCase();
    return (
      e.title.toLowerCase().includes(q) || e.category.toLowerCase().includes(q)
    );
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(160deg, #fef5f0 0%, #f5ede5 50%, #fef5f0 100%)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;800;900&family=Inter:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .events-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 24px; }
        @media (max-width: 640px) { .events-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* Hero */}
      <div
        style={{
          position: "relative",
          padding: "100px 40px 60px",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-60px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "300px",
            background:
              "radial-gradient(ellipse, rgba(139,90,60,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "30px",
            right: "10%",
            width: "180px",
            height: "180px",
            background:
              "radial-gradient(circle, rgba(168,120,80,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(139,90,60,0.1)",
              border: "1px solid rgba(139,90,60,0.25)",
              borderRadius: "30px",
              padding: "6px 18px",
              marginBottom: "24px",
            }}
          >
            <Sparkles size={14} color="#8b5a3c" />
            <span
              style={{
                color: "#8b5a3c",
                fontSize: "12px",
                fontWeight: "600",
                letterSpacing: "2px",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              UPCOMING EVENTS
            </span>
          </div>
          <h1
            style={{
              fontSize: "clamp(36px, 6vw, 64px)",
              fontWeight: "900",
              color: "#2d1810",
              fontFamily: "'Playfair Display', serif",
              lineHeight: 1.1,
              marginBottom: "20px",
            }}
          >
            Mark Your Calendar
            <br />
            <span
              style={{
                background:
                  "linear-gradient(135deg, #8b5a3c, #c89968, #a87850)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Don't Miss Out
            </span>
          </h1>
          <p
            style={{
              color: "#6b7280",
              fontSize: "18px",
              maxWidth: "520px",
              margin: "0 auto 40px",
              lineHeight: 1.6,
            }}
          >
            Upcoming CAS alumni events featuring networking opportunities,
            celebrations, and career development sessions.
          </p>
          <div
            style={{
              display: "inline-flex",
              gap: "0",
              background: "#ffffff",
              border: "1px solid rgba(139,90,60,0.1)",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(139,90,60,0.07)",
            }}
          >
            {[
              {
                label: "Total Events",
                value: upcomingEvents.length,
                color: "#8b5a3c",
              },
              {
                label: "This Month",
                value: upcomingEvents.filter((e) => {
                  const eventDate = new Date(e.date);
                  const today = new Date();
                  return (
                    eventDate.getMonth() === today.getMonth() &&
                    eventDate.getFullYear() === today.getFullYear()
                  );
                }).length,
                color: "#a87850",
              },
              { label: "Registrations Open", value: "Now", color: "#c89968" },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  padding: "16px 28px",
                  borderRight:
                    i < 2 ? "1px solid rgba(139,90,60,0.08)" : "none",
                }}
              >
                <div
                  style={{
                    fontSize: "26px",
                    fontWeight: "800",
                    color: stat.color,
                    fontFamily: "'Playfair Display', serif",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#9ca3af",
                    fontFamily: "'DM Mono', monospace",
                    letterSpacing: "1px",
                  }}
                >
                  {stat.label.toUpperCase()}
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
          style={{ marginBottom: "40px" }}
        >
          <div style={{ position: "relative" }}>
            <Search
              size={16}
              color="#9ca3af"
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
            <input
              type="text"
              placeholder="Search events by name or category…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                background: "#ffffff",
                border: "1px solid rgba(139,90,60,0.1)",
                borderRadius: "12px",
                padding: "13px 16px 13px 44px",
                color: "#2d1810",
                fontSize: "14px",
                outline: "none",
                fontFamily: "'Inter', sans-serif",
                boxShadow: "0 2px 8px rgba(139,90,60,0.04)",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(139,90,60,0.5)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(139,90,60,0.1)")
              }
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
              background: "linear-gradient(#8b5a3c,#a87850)",
              borderRadius: "2px",
            }}
          />
          <span
            style={{
              color: "#2d1810",
              fontWeight: "700",
              fontSize: "18px",
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Upcoming Events
          </span>
          <span
            style={{
              color: "#9ca3af",
              fontSize: "14px",
              fontFamily: "'DM Mono', monospace",
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
                background: "#ffffff",
                border: "1px solid rgba(139,90,60,0.08)",
                borderRadius: "20px",
                boxShadow: "0 2px 16px rgba(139,90,60,0.05)",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📅</div>
              <h3
                style={{
                  color: "#2d1810",
                  fontSize: "20px",
                  fontFamily: "'Playfair Display', serif",
                  marginBottom: "8px",
                }}
              >
                No events found
              </h3>
              <p style={{ color: "#9ca3af" }}>
                Try adjusting your search or check back later for upcoming
                events.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UpcomingEventsPage;
