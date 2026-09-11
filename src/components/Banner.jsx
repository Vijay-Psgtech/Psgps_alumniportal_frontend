import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowRight, Zap, Users, Globe, Sparkles, AlertCircle, X } from "lucide-react";
import { bannerService } from "../services/bannerService";
import { notificationService} from "../services/Notificationservice";
import { cacheService } from "../services/Cacheservice";
import BannerScrollNotification from "../pages/BannerScrollNotification";

// Particle initialization function - moved outside component to avoid unnecessary recalculation
const initializeParticles = () => {
  return [...Array(20)].map(() => ({
    id: Math.random(),
    left: Math.random() * 100,
    tx: (Math.random() - 0.5) * 200,
    duration: 3 + Math.random() * 4,
    delay: Math.random() * 5,
  }));
};

// Default notification data for testing/fallback
const getDefaultNotifications = () => [
  {
    id: "1",
    type: "success",
    title: "Welcome to PSG Alumni!",
    message: "Join 12K+ alumni members connecting across 35+ countries.",
  },
  {
    id: "2",
    type: "info",
    title: "Upcoming Event",
    message: "Join our networking session next month - early bird registration open!",
  },
  {
    id: "3",
    type: "warning",
    title: "Limited Spots Available",
    message: "Only 50 seats left for the Global Summit 2024. Register now!",
  },
];

const EpicBanner = () => {
  // Initialize particles directly in useState to avoid setState in effect
  const [particles] = useState(initializeParticles());
  const [bannerData, setBannerData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentNotificationIndex, setCurrentNotificationIndex] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const notificationTimerRef = useRef(null);
  const refetchIntervalRef = useRef(null);

  const getDefaultBannerData = useCallback(
    () => ({
      id: "default",
      title: "Connect, Grow & Lead Together",
      description:
        "Join an exclusive global community where PSG Arts alumni collaborate, mentor, and create opportunities for lifelong success.",
      subtitle: "Welcome to Excellence",
      backgroundImage: "https://via.placeholder.com/1600x900",
      features: [
        { icon: "Users", text: "12K+ Alumni Connected" },
        { icon: "Globe", text: "35+ Countries" },
        { icon: "Sparkles", text: "200+ Annual Events" },
      ],
      primaryButtonText: "Join Now",
      secondaryButtonText: "Learn More",
      isActive: true,
      updatedAt: new Date().toISOString(),
    }),
    []
  );

  const fetchBannerData = useCallback(async () => {
    try {
      const cacheKey = "activeBanner";
      const cached = cacheService.get(cacheKey);

      if (cached) {
        setBannerData(cached);
        return;
      }

      const result = await bannerService.getActiveBanner();

      if (result.success && result.data) {
        setBannerData(result.data);
        cacheService.set(cacheKey, result.data);
        setError(null);
      } else {
        const defaultData = getDefaultBannerData();
        setBannerData(defaultData);
        setError(null);
      }
    } catch (err) {
      console.error("Error fetching banner:", err);
      setBannerData(getDefaultBannerData());
      setError("Failed to load banner data");
    }
  }, [getDefaultBannerData]);

  const fetchNotifications = useCallback(async () => {
    try {
      const cacheKey = "activeNotifications";
      const cached = cacheService.get(cacheKey);

      // Use cached data if available
      if (cached && cached.length > 0) {
        console.log("Using cached notifications:", cached);
        setNotifications(cached);
        setCurrentNotificationIndex(0);
        setShowNotification(true);
        return;
      }

      // Try to fetch from API
      const result = await notificationService.getActiveNotifications();

      if (result.success && Array.isArray(result.data) && result.data.length > 0) {
        console.log("Fetched notifications from API:", result.data);
        setNotifications(result.data);
        setCurrentNotificationIndex(0);
        setShowNotification(true);
        cacheService.set(cacheKey, result.data);
      } else {
        // Fallback to default notifications for testing
        console.log("Using default notifications");
        const defaultNotifications = getDefaultNotifications();
        setNotifications(defaultNotifications);
        setCurrentNotificationIndex(0);
        setShowNotification(true);
        cacheService.set(cacheKey, defaultNotifications);
      }
    } catch (err) {
      console.error("Error fetching notifications, using defaults:", err);
      // Use default notifications on error
      const defaultNotifications = getDefaultNotifications();
      setNotifications(defaultNotifications);
      setCurrentNotificationIndex(0);
      setShowNotification(true);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchBannerData(), fetchNotifications()]);
      setLoading(false);
    };

    fetchData();

    refetchIntervalRef.current = setInterval(() => {
      cacheService.clear("activeBanner");
      cacheService.clear("activeNotifications");
      fetchBannerData();
      fetchNotifications();
    }, 30000);

    return () => {
      if (refetchIntervalRef.current) clearInterval(refetchIntervalRef.current);
    };
  }, [fetchBannerData, fetchNotifications]);

  useEffect(() => {
    if (!showNotification || notifications.length === 0) return;

    const notificationDuration = 6000;

    notificationTimerRef.current = setTimeout(() => {
      if (notifications.length > 1) {
        const nextIndex = (currentNotificationIndex + 1) % notifications.length;
        setCurrentNotificationIndex(nextIndex);
      } else {
        setShowNotification(false);
      }
    }, notificationDuration);

    return () => {
      if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
    };
  }, [showNotification, currentNotificationIndex, notifications.length]);

  const getIconComponent = (iconName) => {
    const iconMap = { Users, Globe, Sparkles, Zap };
    return iconMap[iconName] || Sparkles;
  };

  const handleNotificationClose = () => {
    setShowNotification(false);
    if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
  };

  if (loading) {
    return (
      <div style={{ height: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e3c72 100%)", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "60px" }}>
        <div style={{ textAlign: "center", color: "white" }}>
          <div style={{ width: "40px", height: "40px", border: "3px solid rgba(255,255,255,0.3)", borderTop: "3px solid white", borderRadius: "50%", margin: "0 auto 20px", animation: "spin 1s linear infinite" }} />
          <p>Loading banner...</p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  const data = bannerData || getDefaultBannerData();

  return (
    <>
      <style>{`
        html, body {
          overflow-x: hidden;
          scroll-behavior: smooth;
        }

        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        
        .epic-banner { 
          position: relative; 
          min-height: 120vh; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          overflow: visible; 
          margin-top: 60px; 
          padding-bottom: 0;
        }
        
        .banner-bg { 
          position: absolute; 
          inset: 0; 
          background-size: cover; 
          background-position: center; 
          background-attachment: fixed; 
          z-index: 1; 
          background-color: #0f172a; 
          animation: bgZoom 20s ease-out forwards; 
          pointer-events: none;
        }
        
        @keyframes bgZoom { 
          from { transform: scale(1.05); } 
          to { transform: scale(1); } 
        }
        
        .banner-overlay { 
          position: absolute; 
          inset: 0; 
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.7) 0%, rgba(30, 60, 114, 0.6) 50%, rgba(42, 82, 152, 0.5) 100%); 
          z-index: 2; 
          pointer-events: none;
        }
        
        .orb { 
          position: absolute; 
          border-radius: 50%; 
          filter: blur(100px); 
          opacity: 0.4; 
          mix-blend-mode: screen; 
          z-index: 1; 
          pointer-events: none;
        }
        
        .orb-1 { 
          width: 500px; 
          height: 500px; 
          background: radial-gradient(circle, #c83e7d 0%, transparent 70%); 
          top: -150px; 
          left: -150px; 
          animation: orb-move-1 15s ease-in-out infinite; 
        }
        
        .orb-2 { 
          width: 600px; 
          height: 600px; 
          background: radial-gradient(circle, #1e3c72 0%, transparent 70%); 
          bottom: -200px; 
          right: -200px; 
          animation: orb-move-2 18s ease-in-out infinite; 
        }
        
        .orb-3 { 
          width: 400px; 
          height: 400px; 
          background: radial-gradient(circle, #2a9d8f 0%, transparent 70%); 
          top: 50%; 
          left: 50%; 
          animation: orb-move-3 20s ease-in-out infinite; 
          transform: translate(-50%, -50%); 
        }
        
        @keyframes orb-move-1 { 
          0%, 100% { transform: translate(0, 0); } 
          50% { transform: translate(50px, 50px); } 
        }
        
        @keyframes orb-move-2 { 
          0%, 100% { transform: translate(0, 0); } 
          50% { transform: translate(-60px, -60px); } 
        }
        
        @keyframes orb-move-3 { 
          0%, 100% { transform: translate(-50%, -50%) scale(1); } 
          50% { transform: translate(-50%, -50%) scale(1.1); } 
        }
        
        .grid-bg { 
          position: absolute; 
          inset: 0; 
          background-image: linear-gradient(0deg, rgba(42, 82, 152, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(42, 82, 152, 0.1) 1px, transparent 1px); 
          background-size: 50px 50px; 
          animation: grid-move 20s linear infinite; 
          opacity: 0.3; 
          z-index: 1; 
          pointer-events: none;
        }
        
        @keyframes grid-move { 
          0% { transform: translateY(0); } 
          100% { transform: translateY(50px); } 
        }
        
        .particles { 
          position: absolute; 
          inset: 0; 
          overflow: visible; 
          z-index: 1; 
          pointer-events: none;
        }
        
        .particle { 
          position: absolute; 
          width: 2px; 
          height: 2px; 
          background: rgba(255, 255, 255, 0.5); 
          border-radius: 50%; 
          animation: float-particle linear infinite; 
          pointer-events: none;
        }
        
        @keyframes float-particle { 
          0% { opacity: 0; transform: translateY(100vh) translateX(0); } 
          10% { opacity: 1; } 
          90% { opacity: 1; } 
          100% { opacity: 0; transform: translateY(-100vh) translateX(var(--tx)); } 
        }
        
        .content { 
          position: relative; 
          z-index: 3; 
          max-width: 1400px; 
          width: 100%; 
          padding: 0 50px; 
          display: grid; 
          grid-template-columns: 1.3fr 0.7fr; 
          gap: 100px; 
          align-items: center; 
        }
        
        .banner-left { 
          color: white; 
          animation: fadeInUp 0.8s ease-out; 
        }
        
        @keyframes fadeInUp { 
          from { opacity: 0; transform: translateY(40px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        
        .banner-subtitle { 
          display: inline-flex; 
          align-items: center; 
          gap: 8px; 
          padding: 10px 16px; 
          background: rgba(200, 62, 125, 0.15); 
          border: 1px solid rgba(200, 62, 125, 0.3); 
          border-radius: 50px; 
          font-size: 12px; 
          font-weight: 600; 
          color: #ff6b9d; 
          margin-bottom: 24px; 
          backdrop-filter: blur(10px); 
          letter-spacing: 0.5px; 
          text-transform: uppercase; 
        }
        
        .banner-title { 
          font-family: 'Sora', sans-serif; 
          font-size: clamp(48px, 6vw, 84px); 
          font-weight: 800; 
          line-height: 1.05; 
          margin-bottom: 24px; 
          background: linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.7) 100%); 
          -webkit-background-clip: text; 
          -webkit-text-fill-color: transparent; 
          background-clip: text; 
          letter-spacing: -1px; 
        }
        
        .banner-description { 
          font-size: 18px; 
          opacity: 0.85; 
          max-width: 500px; 
          margin-bottom: 40px; 
          line-height: 1.6; 
          font-weight: 400; 
        }
        
        .features-list { 
          display: flex; 
          flex-direction: column; 
          gap: 16px; 
          margin-bottom: 48px; 
        }
        
        .feature-item { 
          display: flex; 
          align-items: center; 
          gap: 14px; 
          padding: 12px 0; 
          animation: fadeInUp 0.8s ease-out backwards; 
          opacity: 1; 
        }
        
        .feature-item:nth-child(1) { animation-delay: 0.2s; }
        .feature-item:nth-child(2) { animation-delay: 0.4s; }
        .feature-item:nth-child(3) { animation-delay: 0.6s; }
        
        .feature-icon { 
          width: 36px; 
          height: 36px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          background: rgba(200, 62, 125, 0.2); 
          border-radius: 10px; 
          color: #ff6b9d; 
          flex-shrink: 0; 
        }
        
        .feature-text { 
          font-size: 14px; 
          font-weight: 600; 
        }
        
        .cta-buttons { 
          display: flex; 
          gap: 16px; 
          flex-wrap: wrap; 
        }
        
        .btn-primary { 
          padding: 16px 40px; 
          border-radius: 14px; 
          border: none; 
          font-weight: 700; 
          cursor: pointer; 
          color: white; 
          background: linear-gradient(135deg, #1e3c72, #2a5298); 
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); 
          display: flex; 
          align-items: center; 
          gap: 10px; 
          font-size: 14px; 
          font-family: 'Sora', sans-serif; 
          box-shadow: 0 8px 24px rgba(30, 60, 114, 0.4); 
          position: relative; 
          overflow: hidden; 
        }
        
        .btn-primary::before { 
          content: ''; 
          position: absolute; 
          top: 0; 
          left: -100%; 
          width: 100%; 
          height: 100%; 
          background: linear-gradient(135deg, #2a5298, #c83e7d); 
          transition: left 0.4s ease; 
          z-index: -1; 
        }
        
        .btn-primary:hover::before { left: 0; }
        .btn-primary:hover { 
          transform: translateY(-4px); 
          box-shadow: 0 12px 36px rgba(30, 60, 114, 0.5); 
        }
        
        .btn-secondary { 
          padding: 16px 32px; 
          border-radius: 14px; 
          background: rgba(255, 255, 255, 0.1); 
          border: 2px solid rgba(255, 255, 255, 0.2); 
          color: white; 
          backdrop-filter: blur(12px); 
          cursor: pointer; 
          font-weight: 700; 
          transition: all 0.3s ease; 
          font-family: 'Sora', sans-serif; 
          font-size: 14px; 
        }
        
        .btn-secondary:hover { 
          background: rgba(255, 255, 255, 0.15); 
          border-color: rgba(255, 255, 255, 0.4); 
          transform: translateY(-4px); 
        }
        
        .error-badge { 
          display: inline-flex; 
          align-items: center; 
          gap: 8px; 
          padding: 12px 16px; 
          background: rgba(239, 68, 68, 0.15); 
          border: 1px solid rgba(239, 68, 68, 0.3); 
          border-radius: 8px; 
          color: #fca5a5; 
          font-size: 13px; 
          margin-bottom: 20px; 
        }
        
        @media (max-width: 1024px) { 
          .content { 
            grid-template-columns: 1fr; 
            gap: 60px; 
            padding: 0 30px; 
          } 
          .banner-title { 
            font-size: 48px; 
          } 
          .banner-left { 
            text-align: center; 
          } 
          .features-list { 
            margin: 0 auto; 
          } 
          .cta-buttons { 
            justify-content: center; 
          }
        }
        
        @media (max-width: 768px) { 
          .epic-banner { 
            min-height: 100vh; 
            margin-top: 50px; 
          } 
          .content { 
            padding: 0 20px; 
          } 
          .banner-title { 
            font-size: 36px; 
          } 
          .banner-description { 
            font-size: 16px; 
          } 
          .orb-1, .orb-2, .orb-3 { 
            filter: blur(80px); 
            opacity: 0.3; 
          } 
          .banner-overlay { 
            background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 60, 114, 0.75) 50%, rgba(42, 82, 152, 0.7) 100%); 
          }
        }
        
        @media (prefers-reduced-motion: reduce) { 
          * { 
            animation: none !important; 
            transition: none !important; 
          } 
        }
      `}</style>

      <div className="epic-banner">
        <div className="banner-bg" style={{ backgroundImage: `url(${data.backgroundImage})` }} />
        <div className="banner-overlay" />
        <div className="grid-bg" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="particles">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="particle"
              style={{
                left: particle.left + "%",
                "--tx": particle.tx + "px",
                animationDuration: particle.duration + "s",
                animationDelay: particle.delay + "s",
              }}
            />
          ))}
        </div>

        <div className="content">
          <div className="banner-left">
            {error && (
              <div className="error-badge">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div className="banner-subtitle">
              <Sparkles size={14} />
              {data.subtitle}
            </div>

            <h1 className="banner-title">{data.title}</h1>

            <p className="banner-description">{data.description}</p>

            <div className="features-list">
              {data.features &&
                data.features.map((feature, idx) => {
                  const Icon = getIconComponent(feature.icon);
                  return (
                    <div key={idx} className="feature-item">
                      <div className="feature-icon">
                        <Icon size={18} />
                      </div>
                      <span className="feature-text">{feature.text}</span>
                    </div>
                  );
                })}
            </div>

            <div className="cta-buttons">
              <button className="btn-primary">
                <Zap size={18} />
                {data.primaryButtonText}
              </button>
              <button className="btn-secondary">{data.secondaryButtonText}</button>
            </div>
          </div>
        </div>

        {/* Scrolling Notification at bottom of banner */}
        {showNotification && notifications.length > 0 && (
          <BannerScrollNotification
            notification={notifications[currentNotificationIndex]}
            onClose={handleNotificationClose}
            total={notifications.length}
            current={currentNotificationIndex + 1}
            autoHideDuration={8000}
          />
        )}
      </div>
    </>
  );
};

export default EpicBanner;