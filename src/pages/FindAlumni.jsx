// src/pages/FindAlumni.jsx
// ✅ FIXED - Debugged version with proper rendering

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, Users, Zap, MapPin, ArrowRight, LogOut,
  Home, Mail, Building2, Heart
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const FindAlumni = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  console.log("FindAlumni rendered - isAuthenticated:", isAuthenticated, "user:", user);

  const filters = [
    { id: "all", label: "All Alumni", icon: Users },
    { id: "nearby", label: "Near You", icon: MapPin },
    { id: "interests", label: "Your Interests", icon: Zap },
  ];

  const features = [
    {
      id: 1,
      title: "Connect with Batch Mates",
      description: "Find and reconnect with your classmates from PSG Arts",
      icon: "👥",
    },
    {
      id: 2,
      title: "Alumni Near You",
      description: "Discover alumni living in your city or area",
      icon: "📍",
    },
    {
      id: 3,
      title: "Shared Interests",
      description: "Find alumni with similar professional goals and hobbies",
      icon: "⚡",
    },
  ];

  const quickAccessItems = [
    {
      id: "directory",
      title: "Alumni Directory",
      description: "Browse and connect with thousands of alumni",
      icon: Users,
      path: "/alumni/directory",
    },
    {
      id: "map",
      title: "Alumni Map",
      description: "Discover alumni in your city and around the world",
      icon: MapPin,
      path: "/alumni/map",
    },
    {
      id: "donations",
      title: "Make a Donation",
      description: "Support PSG and make a difference",
      icon: Heart,
      path: "/alumni/donations",
    },
  ];

  const handleConnectClick = () => {
    if (isAuthenticated) {
      navigate("/alumni/dashboard");
    } else {
      navigate("/alumni/login");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  // ═══════════════════════════════════════════════════════════════════════
  // LOGGED-IN USER VIEW - Personalized Dashboard
  // ═══════════════════════════════════════════════════════════════════════
  if (isAuthenticated && user) {
    return (
      <>
        <style>{`
          .alumni-hub-wrapper {
            width: 100%;
            min-height: calc(100vh - 70px);
            background: linear-gradient(180deg, #f5f7fa 0%, #ffffff 100%);
            padding: 40px 20px;
            font-family: 'Poppins', 'Inter', sans-serif;
          }

          .alumni-hub-container {
            max-width: 1200px;
            margin: 0 auto;
          }

          .hub-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 50px;
            padding: 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 16px;
            color: white;
            box-shadow: 0 10px 40px rgba(102, 126, 234, 0.2);
          }

          .hub-header-left {
            flex: 1;
          }

          .hub-greeting {
            font-size: 32px;
            font-weight: 800;
            margin-bottom: 12px;
            letter-spacing: -0.5px;
          }

          .hub-user-info {
            display: flex;
            gap: 20px;
            font-size: 14px;
            opacity: 0.95;
            flex-wrap: wrap;
          }

          .info-item {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .info-item svg {
            width: 16px;
            height: 16px;
          }

          .hub-header-right {
            display: flex;
            gap: 12px;
            align-items: center;
          }

          .user-badge {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: 700;
          }

          .logout-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 13px;
            transition: all 0.3s ease;
          }

          .logout-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            border-color: rgba(255, 255, 255, 0.5);
          }

          .quick-access-section {
            margin-bottom: 50px;
          }

          .sectionTitle  {
            font-size: 24px;
            font-weight: 700;
            color: #1e3c72;
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .quick-access-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 24px;
          }

          .quick-card {
            background: white;
            border-radius: 16px;
            padding: 32px 28px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            border: 2px solid transparent;
            position: relative;
            overflow: hidden;
          }

          .quick-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 4px;
            background: linear-gradient(90deg, #667eea, #764ba2);
            transition: left 0.4s ease;
          }

          .quick-card:hover::before {
            left: 0;
          }

          .quick-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 40px rgba(102, 126, 234, 0.15);
          }

          .card-icon-wrapper {
            width: 60px;
            height: 60px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
            color: white;
          }

          .quick-card:nth-child(1) .card-icon-wrapper {
            background: linear-gradient(135deg, #667eea, #764ba2);
          }

          .quick-card:nth-child(2) .card-icon-wrapper {
            background: linear-gradient(135deg, #764ba2, #7e57c2);
          }

          .quick-card:nth-child(3) .card-icon-wrapper {
            background: linear-gradient(135deg, #f43f5e, #ec4899);
          }

          .card-icon-wrapper svg {
            width: 28px;
            height: 28px;
          }

          .quick-card-title {
            font-size: 18px;
            font-weight: 700;
            color: #1e3c72;
            margin-bottom: 8px;
          }

          .quick-card-description {
            font-size: 14px;
            color: #666;
            line-height: 1.5;
            margin-bottom: 16px;
          }

          .card-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: #667eea;
            font-weight: 600;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            transition: all 0.3s ease;
            cursor: pointer;
            border: none;
            background: none;
          }

          .quick-card:hover .card-link {
            gap: 12px;
          }

          @media (max-width: 768px) {
            .alumni-hub-wrapper {
              padding: 20px;
            }

            .hub-header {
              flex-direction: column;
              gap: 20px;
              text-align: center;
            }

            .hub-user-info {
              justify-content: center;
            }

            .hub-header-right {
              justify-content: center;
              width: 100%;
            }

            .hub-greeting {
              font-size: 24px;
            }

            .quick-access-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>

        <div className="alumni-hub-wrapper">
          <div className="alumni-hub-container">
            {/* Welcome Header */}
            <div
              className="hub-header"
              style={{
                animation: "slideIn 0.6s ease-out"
              }}
            >
              <div className="hub-header-left">
                <div className="hub-greeting">
                  Welcome back, {user.firstName}! 👋
                </div>
                <div className="hub-user-info">
                  <div className="info-item">
                    <Mail size={14} />
                    {user.email}
                  </div>
                  {user.department && (
                    <div className="info-item">
                      <Building2 size={14} />
                      {user.department} • {user.batchYear}
                    </div>
                  )}
                  {user.city && (
                    <div className="info-item">
                      <MapPin size={14} />
                      {user.city}, {user.country}
                    </div>
                  )}
                </div>
              </div>
              <div className="hub-header-right">
                <div className="user-badge">
                  {user.firstName?.charAt(0)}
                  {user.lastName?.charAt(0)}
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>

            {/* Quick Access Section */}
            <div className="quick-access-section">
              <h2 className="sectionTitle">
                <Home size={24} />
                Quick Access
              </h2>
              <div className="quick-access-grid">
                {quickAccessItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className="quick-card"
                    onClick={() => handleNavigate(item.path)}
                    style={{
                      animation: `slideIn 0.6s ease-out ${idx * 0.1}s backwards`
                    }}
                  >
                    <div className="card-icon-wrapper">
                      <item.icon size={28} />
                    </div>
                    <div className="quick-card-title">{item.title}</div>
                    <div className="quick-card-description">
                      {item.description}
                    </div>
                    <button className="card-link" onClick={() => handleNavigate(item.path)}>
                      Explore
                      <ArrowRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <style>{`
              @keyframes slideIn {
                from {
                  opacity: 0;
                  transform: translateY(20px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}</style>
          </div>
        </div>
      </>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════
  // NON-LOGGED-IN USER VIEW - Original Landing Page
  // ═══════════════════════════════════════════════════════════════════════
  return (
    <>
      <style>{`
        .find-alumni-wrapper {
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 40px 20px;
          background: #f5f7fa;
          min-height: calc(100vh - 70px);
        }

        .find-alumni-main {
          width: 100%;
          max-width: 900px;
        }

        .find-alumni-header {
          text-align: center;
          margin-bottom: 40px;
          animation: fadeInDown 0.8s ease-out;
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .find-alumni-header-title {
          font-size: 32px;
          font-weight: 800;
          color: #1e3c72;
          margin-bottom: 12px;
          letter-spacing: -1px;
        }

        .find-alumni-header-subtitle {
          font-size: 16px;
          color: #666;
          font-weight: 400;
        }

        .search-container {
          position: relative;
          margin-bottom: 32px;
          animation: slideInSearch 0.6s ease-out 0.1s backwards;
        }

        @keyframes slideInSearch {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          background: white;
          border-radius: 14px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          border: 2px solid transparent;
          transition: all 0.3s ease;
        }

        .search-wrapper:focus-within {
          border-color: #667eea;
          box-shadow: 0 12px 40px rgba(102, 126, 234, 0.15);
        }

        .search-icon {
          position: absolute;
          left: 16px;
          color: #999;
          pointer-events: none;
        }

        .search-input {
          flex: 1;
          padding: 16px 16px 16px 48px;
          border: none;
          outline: none;
          font-size: 15px;
          background: transparent;
        }

        .search-input::placeholder {
          color: #aaa;
        }

        .filter-tabs {
          display: flex;
          gap: 12px;
          margin-bottom: 40px;
          animation: slideInSearch 0.6s ease-out 0.2s backwards;
          flex-wrap: wrap;
        }

        .filter-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          font-size: 13px;
          color: #666;
          transition: all 0.3s ease;
        }

        .filter-tab:hover {
          border-color: #667eea;
          color: #667eea;
        }

        .filter-tab.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-color: #667eea;
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.2);
        }

        .filter-tab svg {
          width: 16px;
          height: 16px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          animation: slideInSearch 0.6s ease-out 0.3s backwards;
        }

        .feature-card {
          background: white;
          border-radius: 16px;
          padding: 32px 28px;
          text-align: center;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
          border: 2px solid transparent;
          position: relative;
          overflow: hidden;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, #667eea, #764ba2);
          transition: left 0.4s ease;
        }

        .feature-card:hover::before {
          left: 0;
        }

        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 16px 40px rgba(102, 126, 234, 0.12);
          border-color: rgba(102, 126, 234, 0.1);
        }

        .feature-icon {
          font-size: 48px;
          margin-bottom: 16px;
          display: inline-block;
          animation: bounce 2s ease-in-out infinite;
        }

        .feature-card:nth-child(2) .feature-icon {
          animation-delay: 0.2s;
        }

        .feature-card:nth-child(3) .feature-icon {
          animation-delay: 0.4s;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .feature-title {
          font-size: 18px;
          font-weight: 700;
          color: #1e3c72;
          margin-bottom: 10px;
        }

        .feature-description {
          font-size: 14px;
          color: #777;
          line-height: 1.6;
        }

        .cta-section {
          text-align: center;
          margin-top: 48px;
          animation: slideInSearch 0.6s ease-out 0.4s backwards;
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 40px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
        }

        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(102, 126, 234, 0.3);
        }

        .cta-button:active {
          transform: translateY(-1px);
        }

        .cta-button svg {
          width: 18px;
          height: 18px;
        }

        @media(max-width: 768px) {
          .find-alumni-header-title {
            font-size: 24px;
          }

          .find-alumni-header-subtitle {
            font-size: 14px;
          }

          .filter-tabs {
            gap: 8px;
          }

          .filter-tab {
            padding: 8px 16px;
            font-size: 12px;
          }

          .features-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .feature-card {
            padding: 24px 20px;
          }

          .cta-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div className="find-alumni-wrapper">
        <div className="find-alumni-main">
          {/* Header */}
          <div className="find-alumni-header">
            <div className="find-alumni-header-title">🔍 Find Fellow CASians</div>
            <div className="find-alumni-header-subtitle">
              Discover and connect with the PSG Alumni Network
            </div>
          </div>

          {/* Search Bar */}
          <div className="search-container">
            <div className="search-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search alumni by name, batch, or profession..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="filter-tabs">
            {filters.map((filter) => {
              const IconComponent = filter.icon;
              return (
                <button
                  key={filter.id}
                  className={`filter-tab ${selectedFilter === filter.id ? 'active' : ''}`}
                  onClick={() => setSelectedFilter(filter.id)}
                >
                  <IconComponent size={16} />
                  {filter.label}
                </button>
              );
            })}
          </div>

          {/* Features Grid */}
          <div className="features-grid">
            {features.map((feature) => (
              <div key={feature.id} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <div className="feature-title">{feature.title}</div>
                <div className="feature-description">{feature.description}</div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="cta-section">
            <button className="cta-button" onClick={handleConnectClick}>
              <ArrowRight size={18} />
              Start Connecting Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FindAlumni;