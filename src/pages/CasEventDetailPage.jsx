// frontend/src/pages/CasEventDetailPage.jsx — reads from DataContext (live sync with admin)
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Users,
  Clock,
  Calendar,
  Share2,
  BookmarkPlus,
  ChevronRight,
  CheckCircle,
  Award,
  Mic,
  Coffee,
  Star,
} from "lucide-react";
import { eventsAPI, API_BASE } from "../services/api";

const ICON_MAP = { Coffee, Mic, Award, Users, Clock, Star };

const CasEventDetailPage = () => {
  const { id } = useParams();
  const [casEvents, setCasEvents] = useState([]);

  React.useEffect(() => {
    eventsAPI.getById(id).then((res) => setCasEvents([res.data.data]));
  }, [id]);

  const event = casEvents[0];
  const [registered, setRegistered] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const catColor = "#8b5a3c"; // You can map different categories to different colors if needed
  const isUpcoming = event?.status === "upcoming";
  const date = new Date(event?.date);
  const dateFormatted = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const relatedEvents = casEvents
    .filter((e) => e._id !== event?._id && e.status === event?.status)
    .slice(0, 2);

  if (!event)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📅</div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#2d1810",
              marginBottom: "8px",
            }}
          >
            Event not found
          </h2>
          <Link
            to="/cas-events"
            style={{
              color: "#8b5a3c",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            ← Back to Events
          </Link>
        </div>
      </div>
    );

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
        .tab-btn { background: transparent; border: none; cursor: pointer; transition: all 0.2s; }
        .tab-btn:hover { color: #2d1810 !important; }
      `}</style>

      {/* Hero Banner */}
      <div
        style={{
          position: "relative",
          minHeight: "360px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(135deg, ${catColor}10 0%, rgba(168,120,80,0.06) 50%, rgba(254,245,240,0.98) 100%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "10%",
            right: "5%",
            width: "400px",
            height: "400px",
            background: `radial-gradient(circle, ${catColor}08 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "200px",
            background: "linear-gradient(transparent, #fef5f0)",
          }}
        />
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${20 + i * 15}%`,
              left: `${10 + i * 25}%`,
              width: `${60 + i * 40}px`,
              height: `${60 + i * 40}px`,
              border: `1px solid ${catColor}${20 - i * 6}`,
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />
        ))}

        <div
          style={{
            position: "relative",
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "100px 24px 40px",
            width: "100%",
          }}
        >
          <Link
            to="/cas-events"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: "#6b7280",
              fontSize: "13px",
              textDecoration: "none",
              marginBottom: "24px",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#2d1810")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
          >
            <ArrowLeft size={14} /> Back to Events
          </Link>

          <div
            style={{
              display: "flex",
              gap: "16px",
              marginBottom: "20px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                background: `${catColor}12`,
                color: catColor,
                border: `1px solid ${catColor}35`,
                borderRadius: "20px",
                padding: "5px 16px",
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "1.5px",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {event.category?.toUpperCase()}
            </span>
            <span
              style={{
                background: isUpcoming
                  ? "rgba(139,90,60,0.1)"
                  : "rgba(15,27,53,0.06)",
                color: isUpcoming ? "#8b5a3c" : "#9ca3af",
                border: `1px solid ${isUpcoming ? "#8b5a3c35" : "rgba(15,27,53,0.1)"}`,
                borderRadius: "20px",
                padding: "5px 16px",
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "1.5px",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {isUpcoming ? "● UPCOMING" : "✓ COMPLETED"}
            </span>
          </div>
          {/* Image */}
          {event.imageUrl && (
            <img
              src={`${API_BASE}/${event.imageUrl}`}
              alt={event.title}
              style={{
                width: "100%",
                height: "400px",
                objectFit: "cover",
                borderRadius: "12px",
                marginBottom: "32px",
              }}
            />
          )}

          <h1
            style={{
              fontSize: "clamp(24px, 4vw, 48px)",
              fontWeight: "900",
              color: "#2d1810",
              fontFamily: "'Playfair Display', serif",
              lineHeight: 1.15,
              maxWidth: "700px",
              marginBottom: "24px",
            }}
          >
            {event.title}
          </h1>
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            {[
              { Icon: Calendar, label: dateFormatted },
              { Icon: Clock, label: event.time || "TBD" },
              { Icon: MapPin, label: event.venue?.split(",")[0] },
              {
                Icon: Users,
                label: `${event.attendees} ${isUpcoming ? "Expected" : "Attended"}`,
              },
            ].map(({ Icon, label }, i) => (
              <span
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  color: "#6b7280",
                  fontSize: "14px",
                }}
              >
                <Icon size={14} color={catColor} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px 80px" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: "32px",
          }}
        >
          {/* Left */}
          <div>
            {/* Actions */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                marginBottom: "32px",
                flexWrap: "wrap",
              }}
            >
              {isUpcoming && (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setRegistered(!registered)}
                  style={{
                    padding: "13px 32px",
                    borderRadius: "12px",
                    border: "none",
                    cursor: "pointer",
                    background: registered
                      ? "rgba(139,90,60,0.1)"
                      : `linear-gradient(135deg, ${catColor}, ${catColor}bb)`,
                    color: registered ? catColor : "#fff",
                    fontSize: "15px",
                    fontWeight: "700",
                    fontFamily: "'Inter', sans-serif",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.3s",
                    boxShadow: registered ? "none" : `0 4px 20px ${catColor}40`,
                  }}
                >
                  {registered ? (
                    <>
                      <CheckCircle size={16} /> Registered!
                    </>
                  ) : (
                    "Register Now →"
                  )}
                </motion.button>
              )}
              <button
                onClick={() => setSaved(!saved)}
                style={{
                  padding: "12px 20px",
                  borderRadius: "12px",
                  border: `1px solid ${saved ? catColor + "40" : "rgba(139,90,60,0.1)"}`,
                  background: saved ? `${catColor}08` : "#fff",
                  color: saved ? catColor : "#6b7280",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  boxShadow: "0 2px 8px rgba(139,90,60,0.06)",
                }}
              >
                <BookmarkPlus size={14} /> {saved ? "Saved" : "Save"}
              </button>
              <button
                style={{
                  padding: "12px 20px",
                  borderRadius: "12px",
                  border: "1px solid rgba(139,90,60,0.1)",
                  background: "#fff",
                  color: "#6b7280",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  boxShadow: "0 2px 8px rgba(139,90,60,0.06)",
                }}
              >
                <Share2 size={14} /> Share
              </button>
            </div>

            {/* Tabs */}
            <div
              style={{
                display: "flex",
                borderBottom: "1px solid rgba(139,90,60,0.1)",
                marginBottom: "32px",
              }}
            >
              {["details", "schedule", "speakers"].map((tab) => (
                <button
                  key={tab}
                  className="tab-btn"
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "12px 24px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: activeTab === tab ? catColor : "#9ca3af",
                    borderBottom:
                      activeTab === tab
                        ? `2px solid ${catColor}`
                        : "2px solid transparent",
                    marginBottom: "-1px",
                    textTransform: "capitalize",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "details" && (
                <div>
                  <h2
                    style={{
                      fontSize: "22px",
                      fontWeight: "700",
                      color: "#2d1810",
                      fontFamily: "'Playfair Display', serif",
                      marginBottom: "16px",
                    }}
                  >
                    About This Event
                  </h2>
                  {(event.longDescription || event.description || "")
                    .split("\n\n")
                    .map((para, i) => (
                      <p
                        key={i}
                        style={{
                          color: "#6b7280",
                          lineHeight: 1.8,
                          marginBottom: "16px",
                          fontSize: "15px",
                        }}
                      >
                        {para}
                      </p>
                    ))}
                  {event.highlights?.length > 0 && (
                    <div style={{ marginTop: "32px" }}>
                      <h3
                        style={{
                          fontSize: "18px",
                          fontWeight: "700",
                          color: "#2d1810",
                          fontFamily: "'Playfair Display', serif",
                          marginBottom: "16px",
                        }}
                      >
                        Event Highlights
                      </h3>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fill, minmax(200px, 1fr))",
                          gap: "12px",
                        }}
                      >
                        {event.highlights.map((h, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              background: `${catColor}08`,
                              border: `1px solid ${catColor}20`,
                              borderRadius: "10px",
                              padding: "12px 16px",
                            }}
                          >
                            <CheckCircle size={14} color={catColor} />
                            <span
                              style={{
                                color: "#374151",
                                fontSize: "13px",
                                fontWeight: "500",
                              }}
                            >
                              {h}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {event.tags?.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap",
                        marginTop: "32px",
                      }}
                    >
                      {event.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            background: "rgba(139,90,60,0.04)",
                            border: "1px solid rgba(139,90,60,0.08)",
                            borderRadius: "20px",
                            padding: "5px 14px",
                            color: "#9ca3af",
                            fontSize: "12px",
                            fontFamily: "'DM Mono', monospace",
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "schedule" && (
                <div>
                  <h2
                    style={{
                      fontSize: "22px",
                      fontWeight: "700",
                      color: "#2d1810",
                      fontFamily: "'Playfair Display', serif",
                      marginBottom: "24px",
                    }}
                  >
                    Event Schedule
                  </h2>
                  {!event.schedule || event.schedule.length === 0 ? (
                    <p
                      style={{
                        color: "#9ca3af",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Schedule will be announced soon.
                    </p>
                  ) : (
                    <div style={{ position: "relative" }}>
                      <div
                        style={{
                          position: "absolute",
                          left: "19px",
                          top: "24px",
                          bottom: "24px",
                          width: "2px",
                          background: `linear-gradient(${catColor}, ${catColor}30)`,
                          borderRadius: "2px",
                        }}
                      />
                      {event.schedule.map((item, i) => {
                        const Icon = ICON_MAP[item.icon] || Clock;
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            style={{
                              display: "flex",
                              gap: "20px",
                              marginBottom: "24px",
                              position: "relative",
                            }}
                          >
                            <div
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                background: "#fff",
                                border: `2px solid ${catColor}40`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                boxShadow: `0 2px 8px ${catColor}20`,
                              }}
                            >
                              <Icon size={16} color={catColor} />
                            </div>
                            <div style={{ flex: 1, paddingTop: "8px" }}>
                              <div
                                style={{
                                  color: catColor,
                                  fontSize: "12px",
                                  fontFamily: "'DM Mono', monospace",
                                  fontWeight: "600",
                                  marginBottom: "4px",
                                }}
                              >
                                {item.time}
                              </div>
                              <div
                                style={{
                                  color: "#2d1810",
                                  fontSize: "15px",
                                  fontWeight: "600",
                                }}
                              >
                                {item.title}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "speakers" && (
                <div>
                  <h2
                    style={{
                      fontSize: "22px",
                      fontWeight: "700",
                      color: "#2d1810",
                      fontFamily: "'Playfair Display', serif",
                      marginBottom: "24px",
                    }}
                  >
                    Speakers & Guests
                  </h2>
                  {!event.speakers || event.speakers.length === 0 ? (
                    <p style={{ color: "#9ca3af" }}>
                      Speaker information will be announced soon.
                    </p>
                  ) : (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(200px, 1fr))",
                        gap: "16px",
                      }}
                    >
                      {event.speakers.map((s, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          style={{
                            background: "#fff",
                            border: "1px solid rgba(139,90,60,0.08)",
                            borderRadius: "16px",
                            padding: "24px 20px",
                            textAlign: "center",
                            boxShadow: "0 2px 12px rgba(139,90,60,0.06)",
                          }}
                        >
                          <div
                            style={{
                              width: "64px",
                              height: "64px",
                              borderRadius: "50%",
                              background: `linear-gradient(135deg, ${catColor}, ${catColor}88)`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              margin: "0 auto 16px",
                              fontSize: "24px",
                              fontWeight: "800",
                              color: "#fff",
                              fontFamily: "'Playfair Display', serif",
                            }}
                          >
                            {s.avatar}
                          </div>
                          <div
                            style={{
                              color: "#2d1810",
                              fontWeight: "700",
                              fontSize: "15px",
                              marginBottom: "4px",
                            }}
                          >
                            {s.name}
                          </div>
                          <div style={{ color: "#9ca3af", fontSize: "12px" }}>
                            {s.role}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <div
              style={{
                background: "#fff",
                border: "1px solid rgba(139,90,60,0.09)",
                borderRadius: "20px",
                padding: "24px",
                boxShadow: "0 4px 24px rgba(139,90,60,0.07)",
                position: "sticky",
                top: "88px",
              }}
            >
              <div
                style={{
                  borderTop: `3px solid ${catColor}`,
                  margin: "-24px -24px 20px",
                  padding: "16px 24px",
                  background: `${catColor}06`,
                  borderRadius: "20px 20px 0 0",
                }}
              >
                <span
                  style={{
                    color: catColor,
                    fontSize: "11px",
                    fontFamily: "'DM Mono', monospace",
                    fontWeight: "700",
                    letterSpacing: "1.5px",
                  }}
                >
                  EVENT INFO
                </span>
              </div>
              {[
                { label: "DATE & TIME", value: dateFormatted, sub: event.time },
                { label: "VENUE", value: event.venue },
              ].map(({ label, value, sub }, i) => (
                <div
                  key={i}
                  style={{
                    borderBottom: "1px solid rgba(139,90,60,0.07)",
                    paddingBottom: "16px",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      color: "#9ca3af",
                      fontSize: "11px",
                      fontFamily: "'DM Mono', monospace",
                      letterSpacing: "1px",
                      marginBottom: "6px",
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      color: "#2d1810",
                      fontWeight: "600",
                      fontSize: "14px",
                      lineHeight: 1.5,
                    }}
                  >
                    {value}
                  </div>
                  {sub && (
                    <div
                      style={{
                        color: catColor,
                        fontSize: "13px",
                        fontFamily: "'DM Mono', monospace",
                        marginTop: "2px",
                      }}
                    >
                      {sub}
                    </div>
                  )}
                </div>
              ))}
              <div>
                <div
                  style={{
                    color: "#9ca3af",
                    fontSize: "11px",
                    fontFamily: "'DM Mono', monospace",
                    letterSpacing: "1px",
                    marginBottom: "10px",
                  }}
                >
                  ATTENDANCE
                </div>
                <div
                  style={{
                    background: "rgba(139,90,60,0.06)",
                    borderRadius: "10px",
                    overflow: "hidden",
                    height: "6px",
                    marginBottom: "8px",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: "72%",
                      background: `linear-gradient(90deg, ${catColor}, ${catColor}88)`,
                      borderRadius: "10px",
                    }}
                  />
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "#9ca3af", fontSize: "12px" }}>
                    {Math.floor((event.attendees || 0) * 0.72)} spots taken
                  </span>
                  <span
                    style={{
                      color: catColor,
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {event.attendees} total
                  </span>
                </div>
              </div>
              {isUpcoming && (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setRegistered(!registered)}
                  style={{
                    width: "100%",
                    marginTop: "20px",
                    padding: "14px",
                    borderRadius: "12px",
                    border: "none",
                    background: registered
                      ? "rgba(139,90,60,0.1)"
                      : `linear-gradient(135deg, ${catColor}, ${catColor}cc)`,
                    color: registered ? catColor : "#fff",
                    fontSize: "15px",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    boxShadow: registered ? "none" : `0 4px 20px ${catColor}35`,
                  }}
                >
                  {registered ? (
                    <>
                      <CheckCircle size={16} /> You're Registered!
                    </>
                  ) : (
                    "Register Now →"
                  )}
                </motion.button>
              )}
            </div>

            {relatedEvents.length > 0 && (
              <div
                style={{
                  background: "#fff",
                  border: "1px solid rgba(139,90,60,0.08)",
                  borderRadius: "20px",
                  padding: "20px",
                  boxShadow: "0 2px 16px rgba(139,90,60,0.05)",
                }}
              >
                <h3
                  style={{
                    color: "#2d1810",
                    fontWeight: "700",
                    fontSize: "15px",
                    fontFamily: "'Playfair Display', serif",
                    marginBottom: "16px",
                  }}
                >
                  Related Events
                </h3>
                {relatedEvents.map((rel) => (
                  <Link
                    key={rel._id}
                    to={`/cas-events/${rel._id}`}
                    style={{
                      display: "block",
                      padding: "12px 14px",
                      borderRadius: "10px",
                      background: "rgba(139,90,60,0.02)",
                      border: "1px solid rgba(139,90,60,0.07)",
                      marginBottom: "10px",
                      textDecoration: "none",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = `${catColor}35`;
                      e.currentTarget.style.background = `${catColor}05`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(139,90,60,0.07)";
                      e.currentTarget.style.background = "rgba(139,90,60,0.02)";
                    }}
                  >
                    <div
                      style={{
                        color: "#2d1810",
                        fontWeight: "600",
                        fontSize: "13px",
                        marginBottom: "4px",
                      }}
                    >
                      {rel.title}
                    </div>
                    <div
                      style={{
                        color: "#9ca3af",
                        fontSize: "11px",
                        fontFamily: "'DM Mono', monospace",
                      }}
                    >
                      {new Date(rel.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CasEventDetailPage;
