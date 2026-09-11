// src/App.jsx - ENHANCED WITH SMOOTH SCROLLING & ANIMATIONS
// ✅ Updated with better scroll behavior, animations, and optimized layout

import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ScrolltoTop from "./components/ScrolltoTop";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

import "./App.css";

// ═══════════════════════════════════════════════════════════════════════
// PUBLIC PAGES
// ═══════════════════════════════════════════════════════════════════════
const HomePage = lazy(() => import("./components/Homepage"));
const LeadershipPage = lazy(() => import("./pages/LeadershipPage"));
const NewsPage = lazy(() => import("./pages/Newspage"));
const NewsDetailPage = lazy(() => import("./pages/NewsDetailPage"));
const ContactPage = lazy(() => import("./sections/Contact"));
const DonatePage = lazy(() => import("./pages/DonatePage"));

// ═══════════════════════════════════════════════════════════════════════
// EVENT PAGES
// ═══════════════════════════════════════════════════════════════════════
const CasEventsPage = lazy(() => import("./pages/CasEventsPage"));
const CasEventDetailPage = lazy(() => import("./pages/CasEventDetailPage"));
const UpcomingEventsPage = lazy(() => import("./pages/UpcomingEventsPage"));
const PastEventsPage = lazy(() => import("./pages/PastEventsPage"));
const ReunionsPage = lazy(() => import("./pages/ReunionsPage"));
const EventsPage = lazy(() => import("./pages/EventsPage"));
const EventDetailPage = lazy(() => import("./pages/EventDetailPage"));

// ═══════════════════════════════════════════════════════════════════════
// GALLERY PAGES
// ═══════════════════════════════════════════════════════════════════════
const LocalGalleryPage = lazy(() => import("./pages/LocalGalleryPage"));
const GalleryDetailPage = lazy(() => import("./pages/GalleryDetailPage"));

// ═══════════════════════════════════════════════════════════════════════
// CAMPAIGN PAGES
// ═══════════════════════════════════════════════════════════════════════
const CampaignsPage = lazy(() => import("./pages/alumni/CampaignsPage"));
const CampaignFormPage = lazy(() => import("./pages/alumni/CampaignFormPage"));

// ═══════════════════════════════════════════════════════════════════════
// ALUMNI PAGES
// ═══════════════════════════════════════════════════════════════════════
const AlumniRegistration = lazy(() => import("./pages/alumni/AlumniRegistration"));
const AlumniDashboard = lazy(() => import("./pages/alumni/AlumniDashboard"));
const AlumniLogin = lazy(() => import("./pages/alumni/AlumniLogin"));
const ForgotPassword = lazy(() => import("./pages/alumni/ForgotPassword"));
const AlumniProfile = lazy(() => import("./pages/alumni/AlumniProfile"));
const AlumniDirectory = lazy(() => import("./pages/alumni/AlumniDirectory"));
const AlumniMap = lazy(() => import("./pages/alumni/AlumniMap"));
const AlumniDonations = lazy(() => import("./pages/alumni/AlumniDonations"));
const AlumniChapters = lazy(() => import("./pages/alumni/AlumniChapters"));
const NotificationInbox = lazy(() => import("./pages/alumni/NotificationInbox"));

// ═══════════════════════════════════════════════════════════════════════
// ADMIN PAGES
// ═══════════════════════════════════════════════════════════════════════
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminEvents = lazy(() => import("./pages/admin/AdminEvents"));
const AlumniUsers = lazy(() => import("./pages/admin/AlumniUsersList"));
const AdminNewsLetter = lazy(() => import("./pages/admin/AdminNewsLetter"));
const AdminReports = lazy(() => import("./pages/admin/AdminReports"));
const AdminNotifications = lazy(() => import("./pages/admin/AdminNotifications"));

// ═══════════════════════════════════════════════════════════════════════
// ROUTE GUARDS
// ═══════════════════════════════════════════════════════════════════════

// Redirects logged-in ALUMNI away from login/register
const PublicOnlyRoute = ({ children }) => {
  const { user, authLoading } = useAuth();
  if (authLoading) return <AppLoader />;
  if (!user) return children;
  if (user.role === "admin" || user.role === "superadmin") 
    return <Navigate to="/admin/dashboard" replace />;
  if (user.isApproved) return <Navigate to="/alumni/dashboard" replace />;
  return children;
};

// Redirects logged-in ADMIN away from admin login
const AdminPublicOnlyRoute = ({ children }) => {
  const { user, authLoading } = useAuth();
  if (authLoading) return <AppLoader />;
  if ((user?.role === "admin" || user?.role === "superadmin") && user?.isApproved)
    return <Navigate to="/admin/dashboard" replace />;
  return children;
};

// Full-screen spinner while AuthContext verifies the token
const AppLoader = () => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "16px",
      background: "linear-gradient(135deg, #f8f5ee 0%, #f0f5fb 100%)",
      fontFamily: "'Poppins', 'Inter', sans-serif",
    }}
  >
    <div
      style={{
        width: "44px",
        height: "44px",
        borderRadius: "50%",
        border: "3px solid #e2e8f0",
        borderTop: "3px solid #c9a84c",
        animation: "spin 0.8s linear infinite",
      }}
    />
    <p style={{ color: "#64748B", fontSize: "14px", fontWeight: 500 }}>
      Loading...
    </p>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// 404 Not Found Page
const NotFoundPage = () => (
  <div
    style={{
      minHeight: "calc(100vh - 70px)",
      marginTop: "70px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #E8F1F8 0%, #F0F5FB 100%)",
      padding: "40px 20px",
      textAlign: "center",
    }}
  >
    <h1
      style={{
        fontSize: "72px",
        fontWeight: "700",
        color: "#1A3A52",
        marginBottom: "16px",
      }}
    >
      404
    </h1>
    <p style={{ fontSize: "18px", color: "#4b5563", marginBottom: "24px" }}>
      Page Not Found
    </p>
    <a
      href="/"
      style={{
        padding: "12px 28px",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        color: "white",
        borderRadius: "8px",
        textDecoration: "none",
        fontWeight: "600",
        transition: "all 0.3s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => (e.target.style.transform = "translateY(-2px)")}
      onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
    >
      Go Back Home
    </a>
  </div>
);

export default function App() {
  // ✅ Enhanced scroll behavior and animations
  useEffect(() => {
    // Smooth scroll behavior for all anchor links
    document.documentElement.style.scrollBehavior = "smooth";

    // Hide scrollbar on mobile while keeping functionality
    const handleResize = () => {
      if (window.innerWidth < 768) {
        document.documentElement.style.setProperty("--scrollbar-width", "0px");
      } else {
        document.documentElement.style.setProperty("--scrollbar-width", "10px");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <style>{`
        /* ═══════════════════════════════════════════════════════════════ */
        /* GLOBAL STYLES & SCROLLING */
        /* ═══════════════════════════════════════════════════════════════ */
        html,
        body {
          margin: 0;
          padding: 0;
          font-family: 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #374151;
          background: #F9FAFB;
          scroll-behavior: smooth;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* ═══════════════════════════════════════════════════════════════ */
        /* SCROLLBAR STYLING */
        /* ═══════════════════════════════════════════════════════════════ */
        ::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }

        ::-webkit-scrollbar-track {
          background: #F3F4F6;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
          border-radius: 5px;
          transition: all 0.3s ease;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #764ba2 0%, #667eea 100%);
          box-shadow: 0 0 10px rgba(102, 126, 234, 0.3);
        }

        ::-webkit-scrollbar-corner {
          background: #F3F4F6;
        }

        /* Firefox scrollbar */
        * {
          scrollbar-color: linear-gradient(180deg, #667eea, #764ba2) #F3F4F6;
          scrollbar-width: thin;
        }

        /* ═══════════════════════════════════════════════════════════════ */
        /* LAYOUT STRUCTURE */
        /* ═══════════════════════════════════════════════════════════════ */
        #root {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background: #F9FAFB;
        }

        .app-wrapper {
          flex: 1;
          width: 100%;
          animation: fadeIn 0.5s ease-in-out;
        }

        .footer-wrapper {
          margin-top: auto;
          width: 100%;
          animation: fadeInUp 0.6s ease-in-out;
        }

        /* ═══════════════════════════════════════════════════════════════ */
        /* TEXT SELECTION & HIGHLIGHTS */
        /* ═══════════════════════════════════════════════════════════════ */
        ::selection {
          background: #667eea;
          color: white;
        }

        ::-moz-selection {
          background: #667eea;
          color: white;
        }

        /* ═══════════════════════════════════════════════════════════════ */
        /* ANIMATIONS */
        /* ═══════════════════════════════════════════════════════════════ */
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        /* ═══════════════════════════════════════════════════════════════ */
        /* SMOOTH SCROLL BEHAVIOR */
        /* ═══════════════════════════════════════════════════════════════ */
        html {
          scroll-behavior: smooth;
        }

        /* Smooth scroll on all interactive elements */
        a[href^="#"],
        button {
          scroll-behavior: smooth;
        }

        /* ═══════════════════════════════════════════════════════════════ */
        /* MOBILE OPTIMIZATIONS */
        /* ═══════════════════════════════════════════════════════════════ */
        @media (max-width: 768px) {
          body {
            font-size: 14px;
          }

          ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }

          .app-wrapper {
            animation: fadeIn 0.3s ease-in-out;
          }

          .footer-wrapper {
            animation: fadeInUp 0.4s ease-in-out;
          }
        }

        /* ═══════════════════════════════════════════════════════════════ */
        /* TABLET OPTIMIZATIONS */
        /* ═══════════════════════════════════════════════════════════════ */
        @media (min-width: 768px) and (max-width: 1024px) {
          body {
            font-size: 15px;
          }

          ::-webkit-scrollbar {
            width: 8px;
          }
        }

        /* ═══════════════════════════════════════════════════════════════ */
        /* PRINT STYLES */
        /* ═══════════════════════════════════════════════════════════════ */
        @media print {
          html {
            scroll-behavior: auto;
          }

          .app-wrapper,
          .footer-wrapper {
            animation: none;
          }

          ::-webkit-scrollbar {
            display: none;
          }

          body {
            background: white;
          }
        }

        /* ═══════════════════════════════════════════════════════════════ */
        /* FOCUS STYLES FOR ACCESSIBILITY */
        /* ═══════════════════════════════════════════════════════════════ */
        :focus-visible {
          outline: 2px solid #667eea;
          outline-offset: 2px;
        }

        button:focus-visible,
        a:focus-visible {
          outline: 2px solid #667eea;
          outline-offset: 2px;
          border-radius: 4px;
        }

        /* ═══════════════════════════════════════════════════════════════ */
        /* REDUCED MOTION PREFERENCE */
        /* ═══════════════════════════════════════════════════════════════ */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }

        /* ═══════════════════════════════════════════════════════════════ */
        /* HIGH CONTRAST MODE SUPPORT */
        /* ═══════════════════════════════════════════════════════════════ */
        @media (prefers-contrast: more) {
          body {
            color: #000;
          }

          ::-webkit-scrollbar-thumb {
            background: #000;
          }

          ::selection {
            background: #000;
            color: #fff;
          }
        }
      `}</style>

      <>
        <ScrolltoTop />
        <Suspense fallback={<AppLoader />}>
          <div className="app-wrapper">
            <Routes>
              {/* ═══════════════════════════════════════════════════════════════ */}
              {/* PUBLIC ROUTES */}
              {/* ═══════════════════════════════════════════════════════════════ */}
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/leadership" element={<LeadershipPage />} />
              <Route path="/leadership-team" element={<LeadershipPage />} />
              <Route path="/newsletter" element={<NewsPage />} />
              <Route path="/news/:id" element={<NewsDetailPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/contact-us" element={<ContactPage />} />
              <Route path="/donate" element={<DonatePage />} />

              {/* ═══════════════════════════════════════════════════════════════ */}
              {/* EVENT ROUTES */}
              {/* ═══════════════════════════════════════════════════════════════ */}
              <Route path="/cas-events" element={<CasEventsPage />} />
              <Route path="/cas-events/:id" element={<CasEventDetailPage />} />
              <Route path="/upcoming-events" element={<UpcomingEventsPage />} />
              <Route path="/past-events" element={<PastEventsPage />} />
              <Route path="/reunions" element={<ReunionsPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:slug" element={<EventDetailPage />} />

              {/* ═══════════════════════════════════════════════════════════════ */}
              {/* GALLERY ROUTES */}
              {/* ═══════════════════════════════════════════════════════════════ */}
              <Route path="/gallery" element={<LocalGalleryPage />} />
              <Route path="/gallery/:slug" element={<GalleryDetailPage />} />

              {/* ═══════════════════════════════════════════════════════════════ */}
              {/* CAMPAIGN ROUTES - PUBLIC */}
              {/* ═══════════════════════════════════════════════════════════════ */}
              <Route path="/campaigns" element={<CampaignsPage />} />
              <Route path="/campaign/:id" element={<CampaignFormPage />} />

              {/* ═══════════════════════════════════════════════════════════════ */}
              {/* ALUMNI AUTHENTICATION */}
              {/* ═══════════════════════════════════════════════════════════════ */}
              <Route
                path="/alumni/register"
                element={
                  <PublicOnlyRoute>
                    <AlumniRegistration />
                  </PublicOnlyRoute>
                }
              />
              <Route
                path="/alumni/login"
                element={
                  <PublicOnlyRoute>
                    <AlumniLogin />
                  </PublicOnlyRoute>
                }
              />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* ═══════════════════════════════════════════════════════════════ */}
              {/* ALUMNI PROTECTED ROUTES */}
              {/* ═══════════════════════════════════════════════════════════════ */}
              <Route
                path="/alumni/dashboard"
                element={
                  <ProtectedRoute>
                    <AlumniDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/alumni/profile"
                element={
                  <ProtectedRoute>
                    <AlumniProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/alumni/directory"
                element={
                  <ProtectedRoute>
                    <AlumniDirectory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/alumni/map"
                element={
                  <ProtectedRoute>
                    <AlumniMap />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/alumni/donations"
                element={
                  <ProtectedRoute>
                    <AlumniDonations />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/alumni/chapters"
                element={
                  <ProtectedRoute>
                    <AlumniChapters />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/alumni/notifications"
                element={
                  <ProtectedRoute>
                    <NotificationInbox />
                  </ProtectedRoute>
                }
              />

              {/* ═══════════════════════════════════════════════════════════════ */}
              {/* ADMIN ROUTES */}
              {/* ═══════════════════════════════════════════════════════════════ */}
              <Route
                path="/admin"
                element={
                  <AdminPublicOnlyRoute>
                    <AdminLogin />
                  </AdminPublicOnlyRoute>
                }
              />
              <Route
                path="/admin/login"
                element={
                  <AdminPublicOnlyRoute>
                    <AdminLogin />
                  </AdminPublicOnlyRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/events"
                element={
                  <ProtectedAdminRoute>
                    <AdminEvents />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/newsletters"
                element={
                  <ProtectedAdminRoute>
                    <AdminNewsLetter />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedAdminRoute>
                    <AlumniUsers />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <ProtectedAdminRoute>
                    <AdminReports />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/notifications"
                element={
                  <ProtectedAdminRoute>
                    <AdminNotifications />
                  </ProtectedAdminRoute>
                }
              />

              {/* ═══════════════════════════════════════════════════════════════ */}
              {/* 404 FALLBACK - MUST BE LAST */}
              {/* ═══════════════════════════════════════════════════════════════ */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>

        </Suspense>
      </>
    </>
  );
}