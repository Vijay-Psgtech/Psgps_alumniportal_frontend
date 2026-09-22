import React, { useState } from "react";
import {
  Calendar,
  Eye,
  Download,
  FileText,
  Sparkles,
  Lock,
  FileCheck,
} from "lucide-react";

const WhatIsNew = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const newsletters = [
    {
      id: 1,
      title: "PSG Arts Alumni Newsletter - Oct-Dec 2025",
      date: "Feb 04, 2026",
      views: 245,
      fileName: "PSG_Alumni_Newsletter_Oct-Dec_2025.pdf",
      fileSize: "18 MB",
      thumbnail: "linear-gradient(135deg, #3B82F6 0%, #0EA5E9 100%)",
      image:
        "https://images.unsplash.com/photo-1557821552-17105176677c?w=400&h=250&fit=crop",
      pdfUrl: "/PDF/oct_dec_25.pdf",
      category: "newsletter",
      excerpt:
        "Stay updated with the latest alumni achievements, events, and success stories from our community.",
      color: "#3B82F6",
      bgColor: "#F0F9FF",
    },
    {
      id: 2,
      title: "PSG Arts Alumni Newsletter - Jul - Sep 2025",
      date: "Nov 03, 2025",
      views: 512,
      fileName: "PSG_Alumni_Newsletter_Jul-Sep_2025.pdf",
      fileSize: "16 MB",
      thumbnail: "linear-gradient(135deg, #0369A1 0%, #06B6D4 100%)",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
      pdfUrl: "/PDF/jul_sep_25.pdf",
      category: "newsletter",
      excerpt:
        "Connecting alumni across the globe through inspiring stories and valuable updates.",
      color: "#06B6D4",
      bgColor: "#F0FDFA",
    },
    {
      id: 3,
      title: "In Their Words: Thank You to Our Teachers",
      date: "Sep 09, 2025",
      views: 789,
      fileName: "",
      fileSize: "",
      thumbnail: "linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
      pdfUrl: "",
      category: "alumni-stories",
      excerpt:
        "Celebrating the dedication and impact of our beloved faculty members.",
      color: "#8B5CF6",
      bgColor: "#FAF5FF",
    },
  ];

  const filteredNewsletters =
    activeTab === "all"
      ? newsletters
      : newsletters.filter((n) => n.category === activeTab);

  const handleOpenPDF = (pdf) => {
    if (pdf.pdfUrl) {
      window.open(pdf.pdfUrl, "_blank");
      console.log("📄 Opening PDF in new tab:", pdf.pdfUrl);
    } else {
      console.error("❌ PDF URL not available");
    }
  };

  const downloadPDF = (pdf) => {
    if (pdf && pdf.pdfUrl) {
      const link = document.createElement("a");
      link.href = pdf.pdfUrl;
      link.download = pdf.fileName || "document.pdf";
      link.setAttribute("target", "_blank");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log("📥 Downloaded:", pdf.fileName);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        /* ==================== SECTION ==================== */
        .whats-new-section {
          min-height: 100vh;
          background: linear-gradient(135deg, #F8FAFB 0%, #FFFFFF 50%, #F0F9FF 100%);
          padding: clamp(3rem, 8vw, 8.75rem) clamp(1rem, 3vw, 2.5rem);
          position: relative;
          overflow: hidden;
          border-top: 1px solid #E2E8F0;
        }

        /* Background Decorations */
        .whats-new-bg {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 0;
        }

        .bg-decoration {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.06;
          animation: float 15s ease-in-out infinite;
        }

        .deco-1 {
          width: clamp(300px, 40vw, 600px);
          height: clamp(300px, 40vw, 600px);
          background: linear-gradient(135deg, #3B82F6, #0EA5E9);
          top: -200px;
          right: -100px;
          animation-delay: 0s;
        }

        .deco-2 {
          width: clamp(250px, 35vw, 500px);
          height: clamp(250px, 35vw, 500px);
          background: linear-gradient(135deg, #06B6D4, #8B5CF6);
          bottom: -150px;
          left: -80px;
          animation-delay: 3s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-50px);
          }
        }

        /* ==================== HEADER ==================== */
        .whats-new-header {
          position: relative;
          z-index: 10;
          margin-bottom: clamp(2rem, 6vw, 5rem);
          max-width: 900px;
        }

        .whats-new-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: clamp(0.6rem, 1.5vw, 0.75rem) clamp(1rem, 2vw, 1.5rem);
          background: #F0F9FF;
          border: 1.5px solid #BFDBFE;
          border-radius: 50px;
          margin-bottom: clamp(1rem, 2vw, 1.5rem);
          font-size: clamp(10px, 1.5vw, 12px);
          font-weight: 700;
          color: #3B82F6;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          font-family: 'Poppins', sans-serif;
          animation: slideUp 0.8s ease-out 0.1s backwards;
          white-space: nowrap;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .whats-new-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(32px, 7vw, 72px);
          font-weight: 800;
          color: #0F172A;
          margin-bottom: clamp(0.75rem, 1.5vw, 1rem);
          letter-spacing: -1.5px;
          line-height: 1.1;
          animation: slideUp 0.8s ease-out 0.2s backwards;
        }

        .whats-new-title span {
          background: linear-gradient(90deg, #3B82F6 0%, #06B6D4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .whats-new-subtitle {
          font-family: 'Poppins', sans-serif;
          font-size: clamp(13px, 2.2vw, 16px);
          color: #64748B;
          line-height: 1.7;
          animation: slideUp 0.8s ease-out 0.3s backwards;
          max-width: 750px;
        }

        .header-line {
          width: clamp(60px, 10vw, 120px);
          height: 3px;
          background: linear-gradient(90deg, #3B82F6 0%, #06B6D4 100%);
          margin-top: clamp(1.5rem, 3vw, 2rem);
          border-radius: 2px;
          animation: expandWidth 0.8s ease-out 0.4s backwards;
        }

        @keyframes expandWidth {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        /* ==================== TABS ==================== */
        .newsletter-tabs {
          display: flex;
          gap: clamp(0.5rem, 1.5vw, 0.75rem);
          margin-bottom: clamp(2rem, 5vw, 5rem);
          position: relative;
          z-index: 10;
          flex-wrap: wrap;
          animation: fadeIn 0.8s ease-out 0.5s backwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .tab-btn {
          padding: clamp(0.65rem, 1.5vw, 0.75rem) clamp(1rem, 2vw, 1.75rem);
          background: #FFFFFF;
          border: 2px solid #E2E8F0;
          color: #64748B;
          border-radius: 50px;
          cursor: pointer;
          font-size: clamp(11px, 1.5vw, 13px);
          font-weight: 600;
          font-family: 'Poppins', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
          white-space: nowrap;
        }

        .tab-btn:hover {
          border-color: #3B82F6;
          color: #3B82F6;
          background: #F0F9FF;
          transform: translateY(-2px);
        }

        .tab-btn.active {
          background: linear-gradient(135deg, #3B82F6 0%, #0EA5E9 100%);
          border-color: transparent;
          color: white;
          box-shadow: 0 12px 40px rgba(59, 130, 246, 0.3);
          transform: translateY(-3px);
        }

        /* ==================== GRID ==================== */
        .newsletter-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(clamp(300px, 80vw, 380px), 1fr));
          gap: clamp(1.5rem, 3vw, 3rem);
          position: relative;
          z-index: 10;
        }

        /* ==================== CARD ==================== */
        .newsletter-card {
          group: newsletter-card;
          position: relative;
          cursor: pointer;
          animation: cardSlide 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
          animation-fill-mode: both;
          height: 100%;
        }

        .newsletter-card:nth-child(1) { animation-delay: 0.6s; }
        .newsletter-card:nth-child(2) { animation-delay: 0.7s; }
        .newsletter-card:nth-child(3) { animation-delay: 0.8s; }
        .newsletter-card:nth-child(4) { animation-delay: 0.9s; }

        @keyframes cardSlide {
          from {
            opacity: 0;
            transform: translateY(60px) translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0) translateX(0);
          }
        }

        .card-inner {
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 24px;
          overflow: hidden;
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .newsletter-card:hover .card-inner {
          border-color: var(--card-color);
          background: var(--card-bg);
          transform: translateY(-12px) scale(1.01);
          box-shadow: 0 30px 80px rgba(15, 23, 42, 0.12);
        }

        /* Image Section */
        .newsletter-image-wrapper {
          position: relative;
          height: clamp(180px, 40vw, 320px);
          overflow: hidden;
          background: linear-gradient(135deg, var(--card-bg), #FFFFFF);
          aspect-ratio: auto;
        }

        .newsletter-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .newsletter-card:hover .newsletter-image {
          transform: scale(1.12) rotate(1deg);
        }

        /* Overlay */
        .image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--thumbnail), var(--thumbnail));
          opacity: 0;
          transition: opacity 0.5s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }

        .newsletter-card:hover .image-overlay {
          opacity: 0.85;
        }

        .overlay-icon {
          width: clamp(48px, 8vw, 64px);
          height: clamp(48px, 8vw, 64px);
          border-radius: 16px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--card-color);
          animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }

        /* Content */
        .newsletter-content {
          padding: clamp(1.25rem, 3vw, 2.5rem);
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: clamp(0.75rem, 1.5vw, 1rem);
        }

        .newsletter-meta-top {
          display: flex;
          align-items: center;
          gap: clamp(0.5rem, 1.5vw, 0.75rem);
          margin-bottom: clamp(0.5rem, 1vw, 1rem);
        }

        .meta-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(59, 130, 246, 0.15);
          color: #3B82F6;
          padding: clamp(0.4rem, 0.8vw, 0.5rem) clamp(0.7rem, 1.2vw, 0.75rem);
          border-radius: 20px;
          font-size: clamp(9px, 1.2vw, 11px);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-family: 'Poppins', sans-serif;
          white-space: nowrap;
        }

        .newsletter-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(18px, 3.5vw, 24px);
          font-weight: 800;
          color: #0F172A;
          margin-bottom: clamp(0.5rem, 1vw, 1rem);
          line-height: 1.3;
          letter-spacing: -0.5px;
        }

        .newsletter-excerpt {
          font-family: 'Poppins', sans-serif;
          font-size: clamp(12px, 1.8vw, 14px);
          color: #64748B;
          line-height: 1.6;
          margin-bottom: clamp(1rem, 1.5vw, 1.5rem);
        }

        .newsletter-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: clamp(1rem, 1.5vw, 1.25rem);
          border-top: 1px solid #E2E8F0;
          margin-bottom: clamp(1rem, 1.5vw, 1.5rem);
          flex-wrap: wrap;
          gap: clamp(0.75rem, 1.5vw, 1rem);
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: 'Poppins', sans-serif;
          font-size: clamp(11px, 1.5vw, 12px);
          color: #64748B;
        }

        .meta-item svg {
          color: #3B82F6;
          width: clamp(14px, 2vw, 16px);
          height: clamp(14px, 2vw, 16px);
          flex-shrink: 0;
        }

        .file-info {
          font-family: 'Poppins', sans-serif;
          font-size: clamp(11px, 1.5vw, 12px);
          color: #64748B;
          display: flex;
          align-items: center;
          gap: clamp(0.5rem, 1vw, 0.75rem);
          background: rgba(59, 130, 246, 0.08);
          padding: clamp(0.75rem, 1.5vw, 1rem);
          border-radius: 12px;
          margin-bottom: clamp(1rem, 1.5vw, 1.25rem);
          border: 1px solid rgba(59, 130, 246, 0.15);
          word-break: break-word;
        }

        .file-info svg {
          color: #3B82F6;
          width: clamp(12px, 1.8vw, 14px);
          height: clamp(12px, 1.8vw, 14px);
          flex-shrink: 0;
        }

        .cta-group {
          display: flex;
          gap: clamp(0.5rem, 1vw, 0.75rem);
          align-items: center;
          margin-top: auto;
        }

        .view-btn {
          flex: 1;
          padding: clamp(0.65rem, 1.5vw, 0.75rem) clamp(0.75rem, 1.5vw, 1.25rem);
          background: linear-gradient(135deg, #3B82F6 0%, #0EA5E9 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-family: 'Poppins', sans-serif;
          font-size: clamp(11px, 1.5vw, 13px);
          font-weight: 700;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(0.3rem, 0.8vw, 0.5rem);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
          white-space: nowrap;
        }

        .view-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(59, 130, 246, 0.4);
        }

        .view-btn:active {
          transform: translateY(0);
        }

        .download-btn {
          width: clamp(40px, 8vw, 48px);
          height: clamp(40px, 8vw, 48px);
          border-radius: 12px;
          background: rgba(59, 130, 246, 0.15);
          border: 1.5px solid rgba(59, 130, 246, 0.25);
          color: #3B82F6;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .download-btn:hover {
          background: rgba(59, 130, 246, 0.25);
          transform: scale(1.1);
          border-color: #3B82F6;
        }

        .download-btn svg {
          width: clamp(16px, 3vw, 20px);
          height: clamp(16px, 3vw, 20px);
        }

        /* ==================== RESPONSIVE ==================== */
        @media (max-width: 640px) {
          .whats-new-section {
            padding: clamp(2rem, 4vw, 3rem) clamp(0.75rem, 2vw, 1rem);
          }

          .whats-new-header {
            margin-bottom: clamp(2rem, 4vw, 3rem);
          }

          .newsletter-grid {
            grid-template-columns: 1fr;
            gap: clamp(1.25rem, 2.5vw, 2rem);
          }

          .newsletter-image-wrapper {
            height: clamp(160px, 35vw, 220px);
          }

          .newsletter-content {
            padding: clamp(1rem, 2.5vw, 1.5rem);
          }

          .newsletter-title {
            font-size: clamp(16px, 3vw, 20px);
          }

          .newsletter-excerpt {
            font-size: clamp(11px, 1.6vw, 12px);
            margin-bottom: clamp(0.75rem, 1.2vw, 1rem);
          }

          .view-btn {
            padding: clamp(0.6rem, 1.2vw, 0.65rem) clamp(0.6rem, 1.2vw, 1rem);
            font-size: clamp(10px, 1.3vw, 11px);
          }

          .download-btn {
            width: clamp(36px, 7vw, 40px);
            height: clamp(36px, 7vw, 40px);
          }

          .tab-btn {
            padding: clamp(0.6rem, 1.2vw, 0.65rem) clamp(0.8rem, 1.5vw, 1.2rem);
            font-size: clamp(10px, 1.3vw, 11px);
          }

          .meta-badge {
            padding: clamp(0.35rem, 0.7vw, 0.45rem) clamp(0.6rem, 1vw, 0.65rem);
            font-size: clamp(8px, 1vw, 10px);
          }

          .file-info {
            font-size: clamp(10px, 1.3vw, 11px);
            padding: clamp(0.6rem, 1.2vw, 0.8rem);
            gap: clamp(0.4rem, 0.8vw, 0.5rem);
          }

          .newsletter-meta {
            gap: clamp(0.5rem, 1vw, 0.75rem);
          }

          .meta-item {
            font-size: clamp(10px, 1.3vw, 11px);
          }
        }

        @media (max-width: 480px) {
          .whats-new-section {
            padding: clamp(1.5rem, 3vw, 2.5rem) clamp(0.75rem, 1.5vw, 1rem);
          }

          .whats-new-header {
            margin-bottom: clamp(1.5rem, 3vw, 2.5rem);
          }

          .whats-new-title {
            font-size: clamp(26px, 5vw, 36px);
          }

          .whats-new-subtitle {
            font-size: clamp(12px, 1.8vw, 13px);
          }

          .newsletter-grid {
            gap: clamp(1rem, 2vw, 1.5rem);
          }

          .newsletter-image-wrapper {
            height: clamp(140px, 30vw, 180px);
          }

          .newsletter-content {
            padding: clamp(0.9rem, 2vw, 1.2rem);
            gap: clamp(0.5rem, 1vw, 0.75rem);
          }

          .newsletter-title {
            font-size: clamp(14px, 2.8vw, 18px);
            margin-bottom: clamp(0.35rem, 0.8vw, 0.75rem);
          }

          .newsletter-excerpt {
            font-size: clamp(10px, 1.4vw, 11px);
            margin-bottom: clamp(0.6rem, 1vw, 0.8rem);
          }

          .file-info {
            font-size: clamp(9px, 1.2vw, 10px);
            padding: clamp(0.5rem, 1vw, 0.7rem);
          }

          .cta-group {
            gap: clamp(0.4rem, 0.8vw, 0.6rem);
          }

          .view-btn {
            padding: clamp(0.55rem, 1vw, 0.6rem) clamp(0.5rem, 1vw, 0.8rem);
            font-size: clamp(9px, 1.2vw, 10px);
          }

          .download-btn {
            width: clamp(34px, 6vw, 36px);
            height: clamp(34px, 6vw, 36px);
          }

          .tab-btn {
            padding: clamp(0.55rem, 1vw, 0.6rem) clamp(0.7rem, 1.2vw, 1rem);
            font-size: clamp(9px, 1.2vw, 10px);
          }

          .newsletter-meta {
            padding-top: clamp(0.75rem, 1.2vw, 1rem);
            margin-bottom: clamp(0.75rem, 1.2vw, 1rem);
          }

          .meta-item {
            font-size: clamp(9px, 1.2vw, 10px);
          }

          .whats-new-badge {
            font-size: clamp(9px, 1.2vw, 10px);
          }
        }

        @media (min-width: 641px) and (max-width: 768px) {
          .whats-new-section {
            padding: clamp(3rem, 5vw, 4rem) clamp(1rem, 2vw, 1.5rem);
          }

          .whats-new-header {
            margin-bottom: clamp(2.5rem, 4vw, 3.5rem);
          }

          .whats-new-title {
            font-size: clamp(36px, 6vw, 52px);
          }

          .newsletter-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: clamp(1.5rem, 2.5vw, 2.5rem);
          }

          .newsletter-image-wrapper {
            height: clamp(200px, 35vw, 260px);
          }

          .newsletter-content {
            padding: clamp(1.2rem, 2.5vw, 1.8rem);
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .whats-new-section {
            padding: clamp(3.5rem, 6vw, 4.5rem) clamp(1.5rem, 2.5vw, 2rem);
          }

          .whats-new-header {
            margin-bottom: clamp(3rem, 5vw, 4rem);
          }

          .whats-new-title {
            font-size: clamp(44px, 6.5vw, 60px);
          }

          .newsletter-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: clamp(2rem, 3vw, 2.5rem);
          }

          .newsletter-content {
            padding: clamp(1.5rem, 3vw, 2rem);
          }
        }

        @media (min-width: 1025px) {
          .whats-new-section {
            padding: clamp(4rem, 6vw, 8.75rem) clamp(1.5rem, 3vw, 2.5rem);
          }

          .whats-new-header {
            margin-bottom: clamp(3.5rem, 6vw, 5rem);
          }

          .newsletter-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: clamp(2rem, 3.5vw, 3rem);
          }

          .newsletter-image-wrapper {
            height: 320px;
          }

          .newsletter-content {
            padding: clamp(1.75rem, 3.5vw, 2.5rem);
          }
        }

        @media (min-width: 1440px) {
          .whats-new-section {
            max-width: 1600px;
            margin: 0 auto;
            padding: 6rem 3rem;
          }

          .newsletter-grid {
            gap: 3rem;
          }
        }

        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }

        /* High Contrast Mode */
        @media (prefers-contrast: more) {
          .whats-new-title {
            font-weight: 900;
          }

          .newsletter-title {
            font-weight: 900;
          }

          .tab-btn.active {
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.4);
          }

          .view-btn {
            font-weight: 800;
          }
        }

        /* Dark Mode Support */
        @media (prefers-color-scheme: dark) {
          .whats-new-section {
            background: linear-gradient(135deg, #1A1F35 0%, #0F1420 50%, #162A4C 100%);
            border-top-color: #374151;
          }

          .whats-new-title {
            color: #FFFFFF;
          }

          .whats-new-subtitle {
            color: #CBD5E1;
          }

          .card-inner {
            background: #1F2937;
            border-color: #374151;
          }

          .newsletter-title {
            color: #FFFFFF;
          }

          .newsletter-excerpt {
            color: #D1D5DB;
          }

          .newsletter-meta {
            border-top-color: #374151;
            color: #E5E7EB;
          }

          .meta-item {
            color: #D1D5DB;
          }

          .meta-badge {
            background: rgba(59, 130, 246, 0.2);
            color: #93C5FD;
          }

          .file-info {
            background: rgba(59, 130, 246, 0.1);
            border-color: rgba(59, 130, 246, 0.2);
            color: #D1D5DB;
          }

          .tab-btn {
            background: #374151;
            border-color: #4B5563;
            color: #E5E7EB;
          }

          .tab-btn:hover {
            background: #1E293B;
            border-color: #3B82F6;
            color: #93C5FD;
          }

          .download-btn {
            background: rgba(59, 130, 246, 0.15);
            border-color: rgba(59, 130, 246, 0.3);
          }

          .download-btn:hover {
            background: rgba(59, 130, 246, 0.25);
            border-color: #3B82F6;
          }
        }
      `}</style>

      <section className="whats-new-section">
        {/* Background */}
        <div className="whats-new-bg">
          <div className="bg-decoration deco-1"></div>
          <div className="bg-decoration deco-2"></div>
        </div>

        {/* Header */}
        <div className="whats-new-header">
          <div className="whats-new-badge">
            <Sparkles size={16} />
            Explore Latest
          </div>
          <h2 className="whats-new-title">
            What's <span>New</span>
          </h2>
          <p className="whats-new-subtitle">
            Discover the latest alumni newsletters and brochures. Click any card
            to view the complete PDF with our interactive viewer.
          </p>
          <div className="header-line"></div>
        </div>

        {/* Tabs */}
        <div className="newsletter-tabs">
          <button
            className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
            aria-label="Show all items"
          >
            All
          </button>
          <button
            className={`tab-btn ${activeTab === "newsletter" ? "active" : ""}`}
            onClick={() => setActiveTab("newsletter")}
            aria-label="Show newsletters"
          >
            Newsletters
          </button>
          <button
            className={`tab-btn ${activeTab === "alumni-stories" ? "active" : ""}`}
            onClick={() => setActiveTab("alumni-stories")}
            aria-label="Show alumni stories"
          >
            Alumni Stories
          </button>
        </div>

        {/* Grid */}
        <div className="newsletter-grid">
          {filteredNewsletters.map((item) => (
            <div
              key={item.id}
              className="newsletter-card"
              style={{
                "--card-color": item.color,
                "--card-bg": item.bgColor,
                "--thumbnail": item.thumbnail,
              }}
              onClick={() => handleOpenPDF(item)}
              onMouseEnter={() => setHoveredCard(item.id)}
              onMouseLeave={() => setHoveredCard(null)}
              role="button"
              tabIndex={0}
              aria-label={`Open ${item.title}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleOpenPDF(item);
                }
              }}
            >
              <div className="card-inner">
                {/* Image */}
                <div className="newsletter-image-wrapper">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="newsletter-image"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="image-overlay">
                    <div className="overlay-icon">
                      <FileText size={32} strokeWidth={1.5} />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="newsletter-content">
                  <div className="newsletter-meta-top">
                    <span className="meta-badge">
                      <Lock size={12} />
                      PDF
                    </span>
                  </div>

                  <h3 className="newsletter-title">{item.title}</h3>
                  <p className="newsletter-excerpt">{item.excerpt}</p>

                  {item.fileName && (
                    <div className="file-info">
                      <FileCheck size={14} />
                      <span>{item.fileName} • {item.fileSize}</span>
                    </div>
                  )}

                  <div className="newsletter-meta">
                    <div className="meta-item">
                      <Calendar size={14} />
                      <span>{item.date}</span>
                    </div>
                    <div className="meta-item">
                      <Eye size={14} />
                      <span>{item.views}</span>
                    </div>
                  </div>

                  <div className="cta-group">
                    <button
                      className="view-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenPDF(item);
                      }}
                      aria-label={`View ${item.title} PDF`}
                    >
                      <FileText size={16} strokeWidth={1.5} />
                      View PDF
                    </button>
                    <button
                      className="download-btn"
                      title="Download PDF"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadPDF(item);
                      }}
                      aria-label={`Download ${item.title}`}
                    >
                      <Download size={18} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default WhatIsNew;