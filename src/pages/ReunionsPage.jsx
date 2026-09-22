// frontend/src/pages/ReunionsPage.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Users, Search, ChevronRight, Sparkles, Heart } from "lucide-react";
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

// Blue color palette
const BLUE_THEME = {
  primary: "#0052CC",
  secondary: "#1A73E8",
  tertiary: "#4A90E2",
  light: "#E8F0FE",
  dark: "#1F2937",
  border: "rgba(0, 82, 204, 0.1)",
  borderHover: "rgba(0, 82, 204, 0.25)",
};

const EventCard = ({ event, idx }) => {
  const dateInfo = formatDate(event.date);
  const isUpcoming = event.status === "upcoming";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: idx * 0.07 }}
      style={{
        background: "#ffffff",
        border: event.highlight ? `1px solid ${BLUE_THEME.secondary}40` : `1px solid ${BLUE_THEME.border}`,
        borderRadius: "20px",
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 2px 16px rgba(0, 82, 204, 0.05)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = `0 12px 40px rgba(0, 82, 204, 0.1), 0 0 0 1px ${BLUE_THEME.secondary}25`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 16px rgba(0, 82, 204, 0.05)";
      }}
    >
      {event.highlight && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: `linear-gradient(90deg, transparent, ${BLUE_THEME.secondary}, transparent)`,
          }}
        />
      )}

      {event.highlight && (
        <div
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: `${BLUE_THEME.secondary}15`,
            border: `1px solid ${BLUE_THEME.secondary}40`,
            borderRadius: "20px",
            padding: "4px 12px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "11px",
            fontWeight: "700",
            color: BLUE_THEME.secondary,
            fontFamily: "'DM Mono', monospace",
            zIndex: 2,
          }}
        >
          <Heart size={12} fill={BLUE_THEME.secondary} />
          FEATURED
        </div>
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
              background: `${BLUE_THEME.primary}12`,
              color: BLUE_THEME.primary,
              border: `1px solid ${BLUE_THEME.primary}30`,
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
            {!isUpcoming && (
              <span style={{ color: "#9ca3af", fontSize: "11px", fontFamily: "'DM Mono', monospace" }}>
                ✓ COMPLETED
              </span>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
          <div
            style={{
              background: isUpcoming ? `${BLUE_THEME.primary}10` : "rgba(0, 82, 204, 0.06)",
              border: `1px solid ${isUpcoming ? BLUE_THEME.primary + "30" : BLUE_THEME.border}`,
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
                color: isUpcoming ? BLUE_THEME.primary : "#9ca3af",
                fontFamily: "'Playfair Display', serif",
                lineHeight: 1,
              }}
            >
              {dateInfo.day}
            </div>
            <div
              style={{
                fontSize: "11px",
                color: isUpcoming ? BLUE_THEME.primary : "#9ca3af",
                fontWeight: "600",
                letterSpacing: "1px",
                marginTop: "2px",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {dateInfo.month.toUpperCase()}
            </div>
            <div style={{ fontSize: "10px", color: "#adb5bd", fontFamily: "'DM Mono', monospace" }}>
              {dateInfo.year}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: BLUE_THEME.dark,
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

      <div style={{ padding: "16px 24px 20px", marginTop: "16px", borderTop: `1px solid ${BLUE_THEME.border}` }}>
        <div style={{ display: "flex", gap: "16px", marginBottom: "16px", flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "5px", color: "#9ca3af", fontSize: "12px" }}>
            <MapPin size={12} />
            {event.venue?.split(",")[0]}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "5px", color: "#9ca3af", fontSize: "12px" }}>
            <Users size={12} />
            {event.attendees} {isUpcoming ? "expected" : "attended"}
          </span>
        </div>
        <Link
          to={`/cas-events/${event._id}`}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: isUpcoming ? `${BLUE_THEME.primary}09` : "rgba(0, 82, 204, 0.03)",
            border: `1px solid ${isUpcoming ? BLUE_THEME.primary + "25" : BLUE_THEME.border}`,
            borderRadius: "10px",
            padding: "10px 16px",
            color: isUpcoming ? BLUE_THEME.primary : "#9ca3af",
            fontSize: "13px",
            fontWeight: "600",
            textDecoration: "none",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateX(3px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateX(0)")}
        >
          <span>{isUpcoming ? "View Details & Register" : "View Event Summary"}</span>
          <ChevronRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
};

const ReunionsPage = () => {
  const [reunionEvents, setReunionEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  usePageTitle("Events");

  // Fetch only reunion events (by category)
  useEffect(() => {
    const fetchReunionEvents = async() =>{
      try{
        const res = await eventsAPI.getAll({ category: "Reunion" });
        setReunionEvents(res.data.data || []);
      }catch(error){
        console.error("Failed to fetch events:", error);
      }
    } 
    fetchReunionEvents();
  },[])


  const filteredEvents = reunionEvents.filter((e) => {
    const matchSearch =
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  const upcomingReunions = reunionEvents.filter((e) => e.status === "upcoming");
  const completedReunions = reunionEvents.filter((e) => e.status === "completed");

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;800;900&family=Inter:wght@300;400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');
        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 28px;
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
          background: "linear-gradient(135deg, #E8F0FE 0%, #F0F7FF 100%)",
          paddingTop: "100px",
          paddingBottom: "60px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "10%",
            right: "5%",
            width: "300px",
            height: "300px",
            background: "radial-gradient(circle, rgba(74, 144, 226, 0.1) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-50%",
            left: "10%",
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(0, 82, 204, 0.08) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(0, 82, 204, 0.1)",
              border: "1px solid rgba(0, 82, 204, 0.25)",
              borderRadius: "30px",
              padding: "6px 18px",
              marginBottom: "24px",
              width: "fit-content",
            }}
          >
            <Heart size={14} color={BLUE_THEME.primary} />
            <span
              style={{
                color: BLUE_THEME.primary,
                fontSize: "12px",
                fontWeight: "600",
                letterSpacing: "2px",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              ALUMNI REUNIONS
            </span>
          </div>
          <h1
            style={{
              fontSize: "clamp(36px, 6vw, 64px)",
              fontWeight: "900",
              color: BLUE_THEME.dark,
              fontFamily: "'Playfair Display', serif",
              lineHeight: 1.1,
              marginBottom: "20px",
            }}
          >
            Reconnect & Celebrate<br />
            <span
              style={{
                background: "linear-gradient(135deg, #0052CC, #1A73E8, #4A90E2)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              With Your Batch
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
            Relive college memories and strengthen bonds with your batch mates. Experience the joy of reunion with your CAS family.
          </p>
          <div
            style={{
              display: "inline-flex",
              gap: "0",
              background: "#ffffff",
              border: `1px solid ${BLUE_THEME.border}`,
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0, 82, 204, 0.07)",
            }}
          >
            {[
              { label: "Total Reunions", value: reunionEvents.length, color: BLUE_THEME.primary },
              { label: "Upcoming", value: upcomingReunions.length, color: BLUE_THEME.secondary },
              { label: "Completed", value: completedReunions.length, color: BLUE_THEME.tertiary },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  padding: "16px 28px",
                  borderRight: i < 2 ? `1px solid ${BLUE_THEME.border}` : "none",
                }}
              >
                <div style={{ fontSize: "26px", fontWeight: "800", color: stat.color, fontFamily: "'Playfair Display', serif" }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: "12px", color: "#9ca3af", fontFamily: "'DM Mono', monospace", letterSpacing: "1px" }}>
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
          style={{ display: "flex", gap: "16px", marginBottom: "40px", marginTop: "-30px", flexWrap: "wrap", alignItems: "center", position: "relative", zIndex: 10 }}
        >
          <div style={{ flex: 1, minWidth: "260px", position: "relative" }}>
            <Search size={16} color="#9ca3af" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              placeholder="Search reunions by batch or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                background: "#ffffff",
                border: `1px solid ${BLUE_THEME.border}`,
                borderRadius: "12px",
                padding: "13px 16px 13px 44px",
                color: BLUE_THEME.dark,
                fontSize: "14px",
                outline: "none",
                fontFamily: "'Inter', sans-serif",
                boxShadow: "0 2px 8px rgba(0, 82, 204, 0.04)",
              }}
              onFocus={(e) => (e.target.style.borderColor = BLUE_THEME.borderHover)}
              onBlur={(e) => (e.target.style.borderColor = BLUE_THEME.border)}
            />
          </div>
        </motion.div>

        {/* Section label */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <div
            style={{
              width: "3px",
              height: "24px",
              background: `linear-gradient(${BLUE_THEME.primary}, ${BLUE_THEME.secondary})`,
              borderRadius: "2px",
            }}
          />
          <span style={{ color: BLUE_THEME.dark, fontWeight: "700", fontSize: "18px", fontFamily: "'Playfair Display', serif" }}>
            Alumni Reunions
          </span>
          <span style={{ color: "#9ca3af", fontSize: "14px", fontFamily: "'DM Mono', monospace" }}>
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
                border: `1px solid ${BLUE_THEME.border}`,
                borderRadius: "20px",
                boxShadow: "0 2px 16px rgba(0, 82, 204, 0.05)",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>💙</div>
              <h3
                style={{
                  color: BLUE_THEME.dark,
                  fontSize: "20px",
                  fontFamily: "'Playfair Display', serif",
                  marginBottom: "8px",
                }}
              >
                No reunions found
              </h3>
              <p style={{ color: "#9ca3af" }}>Try adjusting your search or check back later for new reunion events.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ReunionsPage;