import React, { useState, useEffect } from "react";
import { X, AlertCircle, Info, CheckCircle, TrendingUp } from "lucide-react";

const BannerScrollNotification = ({ 
  notification, 
  onClose, 
  total = 1, 
  current = 1,
  autoHideDuration = 8000 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldScroll, setShouldScroll] = useState(true);

  useEffect(() => {
    if (!shouldScroll) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, autoHideDuration);

    return () => clearTimeout(timer);
  }, [shouldScroll, autoHideDuration]);

  const getIconComponent = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle size={18} />;
      case "warning":
        return <AlertCircle size={18} />;
      case "info":
        return <Info size={18} />;
      case "trending":
        return <TrendingUp size={18} />;
      default:
        return <AlertCircle size={18} />;
    }
  };

  const getNotificationStyles = (type) => {
    const styles = {
      success: {
        bg: "rgba(16, 185, 129, 0.15)",
        border: "rgba(16, 185, 129, 0.4)",
        iconColor: "#10b981",
        text: "#d1fae5",
        accent: "rgba(16, 185, 129, 0.3)",
      },
      warning: {
        bg: "rgba(245, 158, 11, 0.15)",
        border: "rgba(245, 158, 11, 0.4)",
        iconColor: "#f59e0b",
        text: "#fef3c7",
        accent: "rgba(245, 158, 11, 0.3)",
      },
      info: {
        bg: "rgba(59, 130, 246, 0.15)",
        border: "rgba(59, 130, 246, 0.4)",
        iconColor: "#3b82f6",
        text: "#dbeafe",
        accent: "rgba(59, 130, 246, 0.3)",
      },
      trending: {
        bg: "rgba(168, 85, 247, 0.15)",
        border: "rgba(168, 85, 247, 0.4)",
        iconColor: "#a855f7",
        text: "#e9d5ff",
        accent: "rgba(168, 85, 247, 0.3)",
      },
      default: {
        bg: "rgba(200, 62, 125, 0.15)",
        border: "rgba(200, 62, 125, 0.4)",
        iconColor: "#ff6b9d",
        text: "#ffb3d9",
        accent: "rgba(200, 62, 125, 0.3)",
      },
    };

    return styles[type] || styles.default;
  };

  const notificationStyle = getNotificationStyles(notification.type || "default");

  if (!isVisible) return null;

  return (
    <>
      <style>{`
        .banner-scroll-notification {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          width: 100%;
          background: linear-gradient(90deg, 
            ${notificationStyle.bg} 0%, 
            ${notificationStyle.accent} 50%, 
            ${notificationStyle.bg} 100%);
          border-top: 1px solid ${notificationStyle.border};
          border-bottom: 1px solid ${notificationStyle.border};
          padding: 0;
          overflow: hidden;
          z-index: 50;
        }

        .scroll-notification-content {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 16px 40px;
          min-height: 60px;
          animation: scrollLeft 15s linear infinite;
          white-space: nowrap;
          width: fit-content;
        }

        @keyframes scrollLeft {
          0% {
            transform: translateX(100vw);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .scroll-notification-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: ${notificationStyle.text};
          flex-shrink: 0;
        }

        .scroll-notification-icon {
          color: ${notificationStyle.iconColor};
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .scroll-notification-text {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.3px;
          text-transform: uppercase;
        }

        .scroll-notification-message {
          font-size: 13px;
          font-weight: 500;
          opacity: 0.95;
          text-transform: none;
          letter-spacing: 0;
        }

        .notification-divider {
          width: 1px;
          height: 24px;
          background: ${notificationStyle.border};
          margin: 0 10px;
          flex-shrink: 0;
        }

        .scroll-notification-close {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: ${notificationStyle.iconColor};
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          transition: all 0.2s ease;
          border-radius: 6px;
        }

        .scroll-notification-close:hover {
          background: ${notificationStyle.accent};
          color: ${notificationStyle.iconColor};
        }

        /* Duplicate content for seamless loop */
        .scroll-notification-content .scroll-notification-item:nth-child(4) {
          margin-left: 40px;
        }

        @media (max-width: 768px) {
          .banner-scroll-notification {
            padding: 0;
          }

          .scroll-notification-content {
            padding: 12px 20px;
            gap: 15px;
            min-height: 50px;
          }

          .scroll-notification-text {
            font-size: 12px;
          }

          .scroll-notification-message {
            font-size: 11px;
          }

          .notification-divider {
            height: 20px;
            margin: 0 8px;
          }

          .scroll-notification-close {
            right: 10px;
            padding: 6px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .scroll-notification-content {
            animation: none !important;
            transform: translateX(0) !important;
          }
        }
      `}</style>

      <div className="banner-scroll-notification">
        <div className="scroll-notification-content">
          {/* First item */}
          <div className="scroll-notification-item">
            <div className="scroll-notification-icon">
              {getIconComponent(notification.type)}
            </div>
            <span className="scroll-notification-text">
              {notification.title || "Update"}
            </span>
            {notification.message && (
              <>
                <div className="notification-divider"></div>
                <span className="scroll-notification-message">
                  {notification.message}
                </span>
              </>
            )}
          </div>

          {/* Divider */}
          <div style={{ 
            width: "2px", 
            height: "30px", 
            background: notificationStyle.border,
            flexShrink: 0,
            opacity: 0.5
          }}></div>

          {/* Duplicate for seamless loop */}
          <div className="scroll-notification-item">
            <div className="scroll-notification-icon">
              {getIconComponent(notification.type)}
            </div>
            <span className="scroll-notification-text">
              {notification.title || "Update"}
            </span>
            {notification.message && (
              <>
                <div className="notification-divider"></div>
                <span className="scroll-notification-message">
                  {notification.message}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Close button */}
        <button 
          className="scroll-notification-close"
          onClick={() => setIsVisible(false)}
          aria-label="Close notification"
          title="Close"
        >
          <X size={16} />
        </button>
      </div>
    </>
  );
};

export default BannerScrollNotification;