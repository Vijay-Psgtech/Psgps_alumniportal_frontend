// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { ArrowRight, Zap, Users, Globe, Sparkles, AlertCircle, X } from "lucide-react";
// import { bannerService } from "../services/bannerService";
// import { notificationService } from "../services/Notificationservice";
// import { cacheService } from "../services/Cacheservice";
// import BannerScrollNotification from "../pages/BannerScrollNotification";

// // Particle initialization function - moved outside component to avoid unnecessary recalculation
// const initializeParticles = () => {
//   return [...Array(20)].map(() => ({
//     id: Math.random(),
//     left: Math.random() * 100,
//     tx: (Math.random() - 0.5) * 200,
//     duration: 3 + Math.random() * 4,
//     delay: Math.random() * 5,
//   }));
// };

// // Default notification data for testing/fallback
// const getDefaultNotifications = () => [
//   {
//     id: "1",
//     type: "success",
//     title: "Welcome to PSG Alumni!",
//     message: "Join 12K+ alumni members connecting across 35+ countries.",
//   },
//   {
//     id: "2",
//     type: "info",
//     title: "Upcoming Event",
//     message: "Join our networking session next month - early bird registration open!",
//   },
//   {
//     id: "3",
//     type: "warning",
//     title: "Limited Spots Available",
//     message: "Only 50 seats left for the Global Summit 2024. Register now!",
//   },
// ];

// const EpicBanner = () => {
//   // Initialize particles directly in useState to avoid setState in effect
//   const [particles] = useState(initializeParticles());
//   const [bannerData, setBannerData] = useState(null);
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentNotificationIndex, setCurrentNotificationIndex] = useState(0);
//   const [showNotification, setShowNotification] = useState(false);
//   const notificationTimerRef = useRef(null);
//   const refetchIntervalRef = useRef(null);

//   const getDefaultBannerData = useCallback(
//     () => ({
//       id: "default",
//       title: "Together We Thrive",
//       description:
//         "Join an exclusive global community where PSGPS alumni collaborate, mentor, and create opportunities for lifelong success.",
//       subtitle: "Welcome to Excellence",
//       backgroundImage: "https://via.placeholder.com/1600x900",
//       features: [
//         { icon: "Users", text: "900+ Alumni Connected" },
//         { icon: "Globe", text: "15+ Countries" },
//         { icon: "Sparkles", text: "5+ Annual Events" },
//       ],
//       primaryButtonText: "Join Now",
//       secondaryButtonText: "Learn More",
//       isActive: true,
//       updatedAt: new Date().toISOString(),
//     }),
//     []
//   );

//   const fetchBannerData = useCallback(async () => {
//     try {
//       const cacheKey = "activeBanner";
//       const cached = cacheService.get(cacheKey);

//       if (cached) {
//         setBannerData(cached);
//         return;
//       }

//       const result = await bannerService.getActiveBanner();

//       if (result.success && result.data) {
//         setBannerData(result.data);
//         cacheService.set(cacheKey, result.data);
//         setError(null);
//       } else {
//         const defaultData = getDefaultBannerData();
//         setBannerData(defaultData);
//         setError(null);
//       }
//     } catch (err) {
//       console.error("Error fetching banner:", err);
//       setBannerData(getDefaultBannerData());
//       setError("Failed to load banner data");
//     }
//   }, [getDefaultBannerData]);

//   const fetchNotifications = useCallback(async () => {
//     try {
//       const cacheKey = "activeNotifications";
//       const cached = cacheService.get(cacheKey);

//       if (cached && cached.length > 0) {
//         setNotifications(cached);
//         setCurrentNotificationIndex(0);
//         setShowNotification(true);
//         return;
//       }

//       const result = await notificationService.getActiveNotifications();

//       if (result.success && Array.isArray(result.data) && result.data.length > 0) {
//         setNotifications(result.data);
//         setCurrentNotificationIndex(0);
//         setShowNotification(true);
//         cacheService.set(cacheKey, result.data);
//       } else {
//         const defaultNotifications = getDefaultNotifications();
//         setNotifications(defaultNotifications);
//         setCurrentNotificationIndex(0);
//         setShowNotification(true);
//         cacheService.set(cacheKey, defaultNotifications);
//       }
//     } catch (err) {
//       console.error("Error fetching notifications, using defaults:", err);
//       const defaultNotifications = getDefaultNotifications();
//       setNotifications(defaultNotifications);
//       setCurrentNotificationIndex(0);
//       setShowNotification(true);
//     }
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       await Promise.all([fetchBannerData(), fetchNotifications()]);
//       setLoading(false);
//     };

//     fetchData();

//     refetchIntervalRef.current = setInterval(() => {
//       cacheService.clear("activeBanner");
//       cacheService.clear("activeNotifications");
//       fetchBannerData();
//       fetchNotifications();
//     }, 30000);

//     return () => {
//       if (refetchIntervalRef.current) clearInterval(refetchIntervalRef.current);
//     };
//   }, [fetchBannerData, fetchNotifications]);

//   useEffect(() => {
//     if (!showNotification || notifications.length === 0) return;

//     const notificationDuration = 6000;

//     notificationTimerRef.current = setTimeout(() => {
//       if (notifications.length > 1) {
//         const nextIndex = (currentNotificationIndex + 1) % notifications.length;
//         setCurrentNotificationIndex(nextIndex);
//       } else {
//         setShowNotification(false);
//       }
//     }, notificationDuration);

//     return () => {
//       if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
//     };
//   }, [showNotification, currentNotificationIndex, notifications.length]);

//   const getIconComponent = (iconName) => {
//     const iconMap = { Users, Globe, Sparkles, Zap };
//     return iconMap[iconName] || Sparkles;
//   };

//   const handleNotificationClose = () => {
//     setShowNotification(false);
//     if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
//   };

//   if (loading) {
//     return (
//       <div style={{ height: "100vh", background: "linear-gradient(135deg, #0a1226 0%, #16305c 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
//         <div style={{ textAlign: "center", color: "white" }}>
//           <div style={{ width: "40px", height: "40px", border: "3px solid rgba(255,255,255,0.25)", borderTop: "3px solid #e9b949", borderRadius: "50%", margin: "0 auto 20px", animation: "spin 1s linear infinite" }} />
//           <p>Loading banner...</p>
//           <style>{`
//             @keyframes spin {
//               to { transform: rotate(360deg); }
//             }
//           `}</style>
//         </div>
//       </div>
//     );
//   }

//   const data = bannerData || getDefaultBannerData();

//   return (
//     <>
//       <style>{`
//         html, body {
//           overflow-x: hidden;
//           scroll-behavior: smooth;
//         }

//         @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=Inter:wght@400;500;600&display=swap');

//         .epic-banner {
//           position: relative;
//           min-height: 100vh;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           overflow: hidden;
//           margin-top: 0;
//           padding: 0;
//         }

//         .banner-bg {
//           position: absolute;
//           inset: 0;
//           background-size: cover;
//           background-position: center;
//           background-attachment: fixed;
//           z-index: 1;
          
//           animation: bgZoom 20s ease-out forwards;
//           pointer-events: none;
//         }

//         @keyframes bgZoom {
//           from { transform: scale(1.06); }
//           to { transform: scale(1); }
//         }

//         /* Even, deliberate scrim: strong under the text, sheer over the photo,
//            consistent top and bottom fade so no single side reads as "patchy". */
//         .banner-overlay {
//           position: absolute;
//           inset: 0;
//           background:
//             linear-gradient(100deg,
//               rgba(6, 12, 28, 0.94) 0%,
//               rgba(6, 12, 28, 0.86) 30%,
//               rgba(6, 12, 28, 0.55) 52%,
//               rgba(6, 12, 28, 0.22) 72%,
//               rgba(6, 12, 28, 0.28) 100%
//             ),
//             linear-gradient(0deg, rgba(4, 8, 20, 0.65) 0%, rgba(4, 8, 20, 0) 30%, rgba(4, 8, 20, 0) 70%, rgba(4, 8, 20, 0.55) 100%);
//           z-index: 2;
//           pointer-events: none;
//         }

//         .orb {
//           position: absolute;
//           border-radius: 50%;
//           filter: blur(110px);
//           opacity: 0.35;
//           mix-blend-mode: screen;
//           z-index: 1;
//           pointer-events: none;
//         }

//         .orb-1 {
//           width: 500px;
//           height: 500px;
//           background: radial-gradient(circle, #e9b949 0%, transparent 70%);
//           top: -150px;
//           left: -150px;
//           opacity: 0.18;
//           animation: orb-move-1 15s ease-in-out infinite;
//         }

//         .orb-2 {
//           width: 600px;
//           height: 600px;
//           background: radial-gradient(circle, #16305c 0%, transparent 70%);
//           bottom: -200px;
//           right: -200px;
//           animation: orb-move-2 18s ease-in-out infinite;
//         }

//         .orb-3 {
//           width: 400px;
//           height: 400px;
//           background: radial-gradient(circle, #2a9d8f 0%, transparent 70%);
//           top: 50%;
//           left: 40%;
//           opacity: 0.2;
//           animation: orb-move-3 20s ease-in-out infinite;
//           transform: translate(-50%, -50%);
//         }

//         @keyframes orb-move-1 {
//           0%, 100% { transform: translate(0, 0); }
//           50% { transform: translate(50px, 50px); }
//         }

//         @keyframes orb-move-2 {
//           0%, 100% { transform: translate(0, 0); }
//           50% { transform: translate(-60px, -60px); }
//         }

//         @keyframes orb-move-3 {
//           0%, 100% { transform: translate(-50%, -50%) scale(1); }
//           50% { transform: translate(-50%, -50%) scale(1.1); }
//         }

//         .grid-bg {
//           position: absolute;
//           inset: 0;
//           background-image: linear-gradient(0deg, rgba(233, 185, 73, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(233, 185, 73, 0.06) 1px, transparent 1px);
//           background-size: 50px 50px;
//           animation: grid-move 20s linear infinite;
//           opacity: 0.4;
//           z-index: 1;
//           pointer-events: none;
//         }

//         @keyframes grid-move {
//           0% { transform: translateY(0); }
//           100% { transform: translateY(50px); }
//         }

//         .particles {
//           position: absolute;
//           inset: 0;
//           overflow: visible;
//           z-index: 1;
//           pointer-events: none;
//         }

//         .particle {
//           position: absolute;
//           width: 2px;
//           height: 2px;
//           background: rgba(255, 255, 255, 0.5);
//           border-radius: 50%;
//           animation: float-particle linear infinite;
//           pointer-events: none;
//         }

//         @keyframes float-particle {
//           0% { opacity: 0; transform: translateY(100vh) translateX(0); }
//           10% { opacity: 1; }
//           90% { opacity: 1; }
//           100% { opacity: 0; transform: translateY(-100vh) translateX(var(--tx)); }
//         }

//         .content {
//           position: relative;
//           z-index: 3;
//           max-width: 1400px;
//           width: 100%;
//           padding: 110px 50px 60px;
//           display: grid;
//           grid-template-columns: 1.2fr 0.8fr;
//           gap: 60px;
//           align-items: center;
//         }

//         .banner-left {
//           color: white;
//           animation: fadeInUp 0.8s ease-out;
//         }

//         @keyframes fadeInUp {
//           from { opacity: 0; transform: translateY(40px); }
//           to { opacity: 1; transform: translateY(0); }
//         }

//         .banner-subtitle {
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           padding: 10px 16px;
//           background: rgba(233, 185, 73, 0.14);
//           border: 1px solid rgba(233, 185, 73, 0.35);
//           border-radius: 50px;
//           font-size: 12px;
//           font-weight: 600;
//           color: #f2cb72;
//           margin-bottom: 24px;
//           backdrop-filter: blur(10px);
//           letter-spacing: 0.5px;
//           text-transform: uppercase;
//         }

//         .banner-title {
//           font-family: 'Sora', sans-serif;
//           font-size: clamp(44px, 5.5vw, 76px);
//           font-weight: 800;
//           line-height: 1.06;
//           margin-bottom: 22px;
//           color: #fff;
//           letter-spacing: -1px;
//         }

//         .banner-title .accent {
//           background: linear-gradient(135deg, #f5cd6b, #e9b949);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           background-clip: text;
//         }

//         .banner-description {
//           font-size: 18px;
//           opacity: 0.88;
//           max-width: 500px;
//           margin-bottom: 36px;
//           line-height: 1.65;
//           font-weight: 400;
//         }

//         .cta-buttons {
//           display: flex;
//           gap: 16px;
//           flex-wrap: wrap;
//         }

//         .btn-primary {
//           padding: 16px 36px;
//           border-radius: 12px;
//           border: none;
//           font-weight: 700;
//           cursor: pointer;
//           color: #14213d;
//           background: linear-gradient(135deg, #f5cd6b, #e9b949);
//           transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           font-size: 14px;
//           font-family: 'Sora', sans-serif;
//           box-shadow: 0 10px 26px rgba(233, 185, 73, 0.35);
//         }

//         .btn-primary:hover {
//           transform: translateY(-4px);
//           box-shadow: 0 14px 34px rgba(233, 185, 73, 0.45);
//         }

//         .btn-secondary {
//           padding: 16px 30px;
//           border-radius: 12px;
//           background: rgba(255, 255, 255, 0.08);
//           border: 1.5px solid rgba(255, 255, 255, 0.25);
//           color: white;
//           backdrop-filter: blur(12px);
//           cursor: pointer;
//           font-weight: 700;
//           transition: all 0.3s ease;
//           font-family: 'Sora', sans-serif;
//           font-size: 14px;
//           display: flex;
//           align-items: center;
//           gap: 8px;
//         }

//         .btn-secondary:hover {
//           background: rgba(255, 255, 255, 0.14);
//           border-color: rgba(233, 185, 73, 0.6);
//           transform: translateY(-4px);
//         }

//         .error-badge {
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           padding: 12px 16px;
//           background: rgba(239, 68, 68, 0.15);
//           border: 1px solid rgba(239, 68, 68, 0.3);
//           border-radius: 8px;
//           color: #fca5a5;
//           font-size: 13px;
//           margin-bottom: 20px;
//         }

//         /* Right-side glass panel: replaces the empty second column that was
//            leaving the right half of the hero looking bare next to the photo. */
//         .banner-stats-panel {
//           background: rgba(15, 25, 48, 0.45);
//           backdrop-filter: blur(18px) saturate(140%);
//           border: 1px solid rgba(233, 185, 73, 0.25);
//           border-radius: 22px;
//           padding: 32px 30px;
//           animation: fadeInUp 0.9s ease-out 0.2s backwards;
//           box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
//         }

//         .banner-stats-panel h3 {
//           font-family: 'Sora', sans-serif;
//           font-size: 15px;
//           font-weight: 700;
//           color: #f2cb72;
//           text-transform: uppercase;
//           letter-spacing: 0.6px;
//           margin: 0 0 20px;
//         }

//         .features-list {
//           display: flex;
//           flex-direction: column;
//           gap: 6px;
//         }

//         .feature-item {
//           display: flex;
//           align-items: center;
//           gap: 14px;
//           padding: 14px 10px;
//           border-radius: 14px;
//           transition: background 0.25s ease;
//           animation: fadeInUp 0.8s ease-out backwards;
//         }

//         .feature-item:hover {
//           background: rgba(255, 255, 255, 0.06);
//         }

//         .feature-item:nth-child(1) { animation-delay: 0.3s; }
//         .feature-item:nth-child(2) { animation-delay: 0.45s; }
//         .feature-item:nth-child(3) { animation-delay: 0.6s; }

//         .feature-icon {
//           width: 42px;
//           height: 42px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           background: linear-gradient(135deg, rgba(245, 205, 107, 0.22), rgba(233, 185, 73, 0.14));
//           border-radius: 12px;
//           color: #f2cb72;
//           flex-shrink: 0;
//         }

//         .feature-text {
//           font-size: 14.5px;
//           font-weight: 600;
//           color: #fff;
//         }

//         @media (max-width: 1024px) {
//           .content {
//             grid-template-columns: 1fr;
//             gap: 40px;
//             padding: 130px 30px 60px;
//           }
//           .banner-title {
//             font-size: 44px;
//           }
//           .banner-left {
//             text-align: center;
//           }
//           .banner-description {
//             margin-left: auto;
//             margin-right: auto;
//           }
//           .cta-buttons {
//             justify-content: center;
//           }
//           .banner-stats-panel {
//             max-width: 460px;
//             margin: 0 auto;
//           }
//         }

//         @media (max-width: 768px) {
//           .content {
//             padding: 110px 20px 50px;
//           }
//           .banner-title {
//             font-size: 34px;
//           }
//           .banner-description {
//             font-size: 16px;
//           }
//           .orb-1, .orb-2, .orb-3 {
//             filter: blur(80px);
//             opacity: 0.25;
//           }
//         }

//         @media (prefers-reduced-motion: reduce) {
//           * {
//             animation: none !important;
//             transition: none !important;
//           }
//         }
//       `}</style>

//       <div className="epic-banner">
//         <div className="banner-bg" style={{ backgroundImage: `url(${data.backgroundImage})` }} />
//         <div className="banner-overlay" />
//         <div className="grid-bg" />
//         <div className="orb orb-1" />
//         <div className="orb orb-2" />
//         <div className="orb orb-3" />
//         <div className="particles">
//           {particles.map((particle) => (
//             <div
//               key={particle.id}
//               className="particle"
//               style={{
//                 left: particle.left + "%",
//                 "--tx": particle.tx + "px",
//                 animationDuration: particle.duration + "s",
//                 animationDelay: particle.delay + "s",
//               }}
//             />
//           ))}
//         </div>

//         <div className="content">
//           <div className="banner-left">
//             {error && (
//               <div className="error-badge">
//                 <AlertCircle size={16} />
//                 {error}
//               </div>
//             )}

//             <div className="banner-subtitle">
//               <Sparkles size={14} />
//               {data.subtitle}
//             </div>

//             <h1 className="banner-title">{data.title}</h1>

//             <p className="banner-description">{data.description}</p>

//             <div className="cta-buttons">
//               <button className="btn-primary">
//                 <Zap size={18} />
//                 {data.primaryButtonText}
//               </button>
//               <button className="btn-secondary">
//                 {data.secondaryButtonText}
//                 <ArrowRight size={16} />
//               </button>
//             </div>
//           </div>

//           <div className="banner-stats-panel">
//             <h3>By the numbers</h3>
//             <div className="features-list">
//               {data.features &&
//                 data.features.map((feature, idx) => {
//                   const Icon = getIconComponent(feature.icon);
//                   return (
//                     <div key={idx} className="feature-item">
//                       <div className="feature-icon">
//                         <Icon size={20} />
//                       </div>
//                       <span className="feature-text">{feature.text}</span>
//                     </div>
//                   );
//                 })}
//             </div>
//           </div>
//         </div>

//         {/* Scrolling Notification at bottom of banner */}
//         {showNotification && notifications.length > 0 && (
//           <BannerScrollNotification
//             notification={notifications[currentNotificationIndex]}
//             onClose={handleNotificationClose}
//             total={notifications.length}
//             current={currentNotificationIndex + 1}
//             autoHideDuration={8000}
//           />
//         )}
//       </div>
//     </>
//   );
// };

// export default EpicBanner;