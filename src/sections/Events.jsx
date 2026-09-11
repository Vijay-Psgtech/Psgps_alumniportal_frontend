import React, { useState } from "react";
import {
  MapPin,
  Calendar,
  ChevronRight,
  X,
  Share2,
  Heart,
  MessageCircle,
  Eye,
  Users,
} from "lucide-react";

import Gal1 from "../assets/Gallery/Gal1.jpg";
import Reunion from "../assets/Gallery/reunion.jpg";
import silverjubilee from "../assets/Gallery/silverjubilee.jpg";
import Elevate from "../assets/Gallery/elevate.jpg";
import BscReunion from "../assets/Gallery/bsc_reunion.jpg";
import alumniReunion from "../assets/Gallery/alumni_reunion.jpg";

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);

  const events = [
    {
      id: 1,
      title: "50th Golden Jubilee Celebration - 1975 Batch Young Oldies Meet",
      status: "Upcoming",
      statusColor: "#1e40af",
      location: "GRD Auditorium, PSG Arts College, Coimbatore",
      date: "Mar 15, 2026",
      cardImage: Gal1,
      description:
        "Celebrating 50 glorious years of PSG Arts College with the historic 1975 batch reunion.",
      fullDetails:
        "The 50th Golden Jubilee celebration is a momentous occasion marking five decades of excellence at PSG Arts College. This special event honors the distinguished 1975 batch who graduated during the college's formative years. The reunion brings together alumni, faculty, and dignitaries to celebrate the institution's remarkable journey, academic achievements, and the lasting bonds formed during their time at the college. The event features nostalgic reminiscences, achievement awards, keynote speeches from eminent alumni, and networking opportunities. It's a perfect time to reflect on the transformative education received and the significant contributions made by PSG Arts College graduates in various fields.",
      category: "Milestone Celebration",
      attendees: 650,
      views: 5420,
      shares: 523,
    },
    {
      id: 2,
      title: "Silver Jubilee Reunion - Santhipoma '97",
      status: "Past Event",
      statusColor: "#6b7280",
      location: "GRD Auditorium, PSG CAS, Coimbatore",
      date: "Jul 26, 2025",
      cardImage: alumniReunion,
      description:
        "A celebration of 25 years of memories, connections, and friendships formed at PSG Arts College.",
      fullDetails:
        "The Silver Jubilee Reunion was a grand celebration where the 1997 batch reunited after 25 years of graduation. The event featured nostalgic reminiscences, award presentations, and reconnection among batch mates. Many shared their success stories and career journeys, inspiring current students and faculty. The highlight was the unveiling of the batch plaque and touching farewell speeches by senior batch mates. The event celebrated the lasting friendships, professional achievements, and personal growth of the alumni over the past 25 years. Interactive sessions allowed alumni to share their experiences and mentor current students.",
      category: "Alumni Reunion",
      attendees: 300,
      views: 3560,
      shares: 289,
    },
    {
      id: 3,
      title: "Elevate 2025 - Pathway to Success",
      status: "Past Event",
      statusColor: "#6b7280",
      location: "GRD Auditorium PSGCAS, Coimbatore",
      date: "Mar 28, 2025",
      cardImage: Elevate,
      description:
        "Success stories and career development workshop featuring renowned speakers and industry experts.",
      fullDetails:
        "Elevate 2025 was an inspiring workshop focused on personal and professional development. Eminent speakers from various fields shared their success stories and provided valuable guidance on career development. The workshop covered topics ranging from entrepreneurship, corporate leadership, personal branding, to emerging technologies. Interactive sessions and Q&A rounds allowed students and faculty to engage directly with speakers and gain practical insights. Participants learned about resilience, innovation, and the importance of continuous learning in today's dynamic professional landscape. The event inspired attendees to pursue their aspirations and make meaningful contributions to society.",
      category: "Career Development",
      attendees: 500,
      views: 4120,
      shares: 342,
    },
  ];

  // ✅ UPDATED: each gallery image now has a `caption` field
  const galleryImages = [
    {
      id: 1,
      src: Gal1,
      alt: "Alumni Group Photo",
      event: "50th Jubilee",
      caption: "Golden Jubilee Reunion of the 1975–1978 B.Com batch. Alumni gather to celebrate 50 years of memories and achievements at PSG Arts College.",
    },
    {
      id: 2,
      src: Reunion,
      alt: "Reunion Photo",
      event: "Reunion",
      caption: "Reunion of the 2013–2016 B.Sc. Mathematics with Computer Applications batch was held on 31.01.2026 at Sangamam Hall.",
    },
    {
      id: 3,
      src: silverjubilee,
      alt: "Group Discussion",
      event: "Silver Jubilee",
      caption: "Preliminary Meeting of PSG CAS ReCALL – Silver Jubilee Reunion of 1998, 1999 - 2001 batch held on 24.01.2026 at Sangamam Hall, PSG CAS.",
    },
    {
      id: 4,
      src: Elevate,
      alt: "Academic Session",
      event: "Guest Lecture",
      caption: "Elevate 2026 – Guest Lecture at PSG CAS (20 Jan 2026)",
    },
    {
      id: 5,
      src: BscReunion,
      alt: "Alumni Reunion",
      event: "Alumni Reunion",
      caption: "Alumni reunion of the B.Sc. Computer Science batch (1999–2002 )",
    },
    {
      id: 6,
      src: alumniReunion,
      alt: "Alumni Reunion",
      event: "Silver Jubilee",
      caption: "Silver Jubilee Alumni Reunion 1997 UG / 1998 PG – 2000 Batch",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        /* ==================== EVENTS SECTION ==================== */
        .events-section {
          padding: 100px 40px;
          max-width: 1400px;
          margin: 0 auto;
          background: linear-gradient(180deg, #f8fafc 0%, #f0f9ff 100%);
          min-height: 100vh;
        }

        .events-title {
          font-family: 'Playfair Display', serif;
          font-size: 56px;
          font-weight: 800;
          color: #0c2340;
          margin-bottom: 60px;
          position: relative;
          display: inline-block;
          letter-spacing: -1px;
          animation: slideDown 0.8s ease-out;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-30px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .events-title::after {
          content: '';
          position: absolute;
          bottom: -15px;
          left: 0;
          width: 120px;
          height: 5px;
          background: linear-gradient(90deg, #1e40af, #0369a1);
          border-radius: 3px;
        }

        /* ==================== EVENTS GRID ==================== */
        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
          gap: 48px;
          margin-bottom: 100px;
          margin-top: 60px;
        }

        .event-card {
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(30, 64, 175, 0.1);
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          cursor: pointer;
          animation: cardPop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .event-card:nth-child(1) { animation-delay: 0.2s; }
        .event-card:nth-child(2) { animation-delay: 0.3s; }
        .event-card:nth-child(3) { animation-delay: 0.4s; }

        @keyframes cardPop {
          from { opacity: 0; transform: scale(0.9) translateY(30px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        .event-card:hover {
          transform: translateY(-20px);
          box-shadow: 0 35px 100px rgba(30, 64, 175, 0.25);
          border: 2px solid #1e40af;
        }

        .event-image-wrapper {
          position: relative;
          overflow: hidden;
          height: 280px;
          background: linear-gradient(135deg, rgba(30, 64, 175, 0.1), rgba(3, 105, 161, 0.1));
        }

        .event-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .event-card:hover .event-image {
          transform: scale(1.12) rotate(1deg);
        }

        .event-status-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          padding: 10px 18px;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: white;
          z-index: 2;
          backdrop-filter: blur(10px);
          animation: slideUp 0.6s ease-out;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .event-content {
          padding: 36px 28px;
        }

        .event-category {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          color: #1e40af;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 12px;
          background: rgba(30, 64, 175, 0.1);
          padding: 6px 12px;
          border-radius: 20px;
        }

        .event-title {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 800;
          color: #0c2340;
          margin-bottom: 12px;
          line-height: 1.3;
          letter-spacing: -0.5px;
        }

        .event-description {
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .event-meta {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          font-size: 13px;
          color: #666;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e0e7ff;
        }

        .event-meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #1e40af;
          font-weight: 600;
        }

        .event-meta-item svg { width: 16px; height: 16px; }

        .event-button {
          background: linear-gradient(135deg, #1e40af 0%, #0369a1 100%);
          color: white;
          border: none;
          padding: 13px 28px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          justify-content: center;
        }

        .event-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(30, 64, 175, 0.4);
        }

        /* ==================== EVENT DETAIL MODAL ==================== */
        .event-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(12, 35, 64, 0.85);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          animation: fadeIn 0.3s ease;
          overflow-y: auto;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .event-modal {
          background: white;
          border-radius: 32px;
          overflow: hidden;
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 50px 150px rgba(30, 64, 175, 0.4);
          animation: slideUpModal 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes slideUpModal {
          from { opacity: 0; transform: translateY(60px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .modal-header {
          position: relative;
          height: 400px;
          overflow: hidden;
        }

        .modal-header-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .modal-header-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 40%, rgba(12, 35, 64, 0.8) 100%);
        }

        .modal-close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .modal-close-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
        }

        .modal-content {
          padding: 48px;
          flex: 1;
          overflow-y: auto;
        }

        .modal-category {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          color: #1e40af;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 16px;
          background: rgba(30, 64, 175, 0.1);
          padding: 8px 16px;
          border-radius: 20px;
        }

        .modal-title {
          font-family: 'Playfair Display', serif;
          font-size: 48px;
          font-weight: 800;
          color: #0c2340;
          margin-bottom: 24px;
          line-height: 1.2;
          letter-spacing: -1px;
        }

        .modal-meta-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
          padding-bottom: 40px;
          border-bottom: 2px solid #e0e7ff;
        }

        .modal-meta-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .modal-meta-icon { width: 24px; height: 24px; color: #1e40af; flex-shrink: 0; }

        .modal-meta-content { display: flex; flex-direction: column; }

        .modal-meta-label {
          font-size: 11px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .modal-meta-value {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 700;
          color: #0c2340;
        }

        .modal-description {
          font-family: 'Poppins', sans-serif;
          font-size: 16px;
          color: #333;
          line-height: 1.8;
          margin-bottom: 32px;
        }

        .modal-social-row {
          display: flex;
          gap: 16px;
          margin-bottom: 32px;
        }

        .social-btn {
          flex: 1;
          padding: 14px 20px;
          border: 2px solid #e0e7ff;
          background: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-weight: 600;
          color: #1e40af;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .social-btn:hover {
          border-color: #1e40af;
          background: #f0f9ff;
          transform: translateY(-3px);
        }

        /* ==================== GALLERY SECTION ==================== */
        .gallery-section {
          margin-top: 100px;
          background: linear-gradient(135deg, #1e40af 0%, #0369a1 50%, #0c2f4d 100%);
          border-radius: 32px;
          padding: 80px 40px;
        }

        .gallery-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 60px;
          color: white;
          animation: slideUp 0.8s ease-out;
        }

        .gallery-title {
          font-family: 'Playfair Display', serif;
          font-size: 48px;
          font-weight: 800;
          letter-spacing: -1px;
        }

        .gallery-view-all {
          background: white;
          color: #1e40af;
          border: none;
          padding: 14px 36px;
          border-radius: 50px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .gallery-view-all:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 24px;
        }

        /* ── Gallery Item with Caption ── */
        .gallery-item {
          position: relative;
          overflow: hidden;
          border-radius: 20px;
          cursor: pointer;
          height: 280px;
          animation: galleryItem 0.6s ease-out both;
        }

        .gallery-item:nth-child(1)  { animation-delay: 0.1s; }
        .gallery-item:nth-child(2)  { animation-delay: 0.2s; }
        .gallery-item:nth-child(3)  { animation-delay: 0.3s; }
        .gallery-item:nth-child(4)  { animation-delay: 0.4s; }
        .gallery-item:nth-child(5)  { animation-delay: 0.5s; }
        .gallery-item:nth-child(6)  { animation-delay: 0.6s; }
        .gallery-item:nth-child(7)  { animation-delay: 0.7s; }
        .gallery-item:nth-child(8)  { animation-delay: 0.8s; }
        .gallery-item:nth-child(9)  { animation-delay: 0.9s; }
        .gallery-item:nth-child(10) { animation-delay: 1s;   }
        .gallery-item:nth-child(11) { animation-delay: 1.1s; }

        @keyframes galleryItem {
          from { opacity: 0; transform: scale(0.9); }
          to   { opacity: 1; transform: scale(1); }
        }

        .gallery-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: block;
        }

        .gallery-item:hover .gallery-image {
          transform: scale(1.15) rotate(2deg);
        }

        /* Caption overlay — slides up on hover */
        .gallery-caption-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(12, 35, 64, 0.92) 0%,
            rgba(12, 35, 64, 0.55) 45%,
            rgba(30, 64, 175, 0.18) 100%
          );
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 20px 18px 18px;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.32s ease, transform 0.32s ease;
        }

        .gallery-item:hover .gallery-caption-overlay {
          opacity: 1;
          transform: translateY(0);
        }

        /* Eye icon — top-right corner */
        .gallery-eye-icon {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.18);
          backdrop-filter: blur(6px);
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          opacity: 0;
          transform: scale(0.8);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .gallery-item:hover .gallery-eye-icon {
          opacity: 1;
          transform: scale(1);
        }

        /* Event tag pill */
        .gallery-event-tag {
          display: inline-block;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.65);
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          padding: 3px 9px;
          border-radius: 20px;
          margin-bottom: 7px;
          width: fit-content;
        }

        /* Caption text */
        .gallery-caption-text {
          font-family: 'Poppins', sans-serif;
          font-size: 12.5px;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.92);
          line-height: 1.55;
          margin: 0;
        }

        /* ==================== GALLERY LIGHTBOX MODAL ==================== */
        .gallery-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(12, 35, 64, 0.97);
          backdrop-filter: blur(10px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 1100;
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }

        .gallery-modal {
          position: relative;
          max-width: 880px;
          width: 100%;
          animation: slideUpModal 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
        }

        .gallery-modal-image {
          width: 100%;
          height: auto;
          max-height: 72vh;
          object-fit: contain;
          border-radius: 18px 18px 0 0;
          display: block;
        }

        /* ── Lightbox caption bar ── */
        .gallery-modal-caption-bar {
          width: 100%;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-top: none;
          border-radius: 0 0 18px 18px;
          padding: 16px 24px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }

        .gallery-modal-event-pill {
          flex-shrink: 0;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #93c5fd;
          background: rgba(30, 64, 175, 0.35);
          border: 1px solid rgba(96, 165, 250, 0.3);
          padding: 4px 10px;
          border-radius: 20px;
          margin-top: 2px;
          white-space: nowrap;
        }

        .gallery-modal-caption-text {
          font-family: 'Poppins', sans-serif;
          font-size: 13.5px;
          color: rgba(255, 255, 255, 0.78);
          line-height: 1.6;
          margin: 0;
        }

        .gallery-modal-close {
          position: absolute;
          top: -52px;
          right: 0;
          width: 42px;
          height: 42px;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: white;
          transition: all 0.3s ease;
        }

        .gallery-modal-close:hover {
          background: white;
          color: #1e40af;
          transform: scale(1.1);
        }

        /* ==================== RESPONSIVE ==================== */
        @media (max-width: 1024px) {
          .events-section { padding: 80px 30px; }
          .events-title   { font-size: 48px; }
          .events-grid    { gap: 40px; }
        }

        @media (max-width: 768px) {
          .events-section     { padding: 60px 20px; }
          .events-title       { font-size: 36px; }
          .events-grid        { grid-template-columns: 1fr; gap: 32px; }
          .gallery-section    { padding: 60px 20px; }
          .gallery-header     { flex-direction: column; gap: 24px; text-align: center; }
          .gallery-title      { font-size: 36px; }
          .gallery-grid       { grid-template-columns: repeat(2, 1fr); gap: 16px; }
          .modal-content      { padding: 32px; }
          .modal-title        { font-size: 36px; }
          /* Always show captions on touch devices */
          .gallery-caption-overlay { opacity: 1; transform: translateY(0); }
          .gallery-eye-icon   { opacity: 1; transform: scale(1); }
        }

        @media (max-width: 480px) {
          .events-section   { padding: 40px 16px; }
          .events-title     { font-size: 28px; }
          .event-content    { padding: 24px; }
          .gallery-grid     { grid-template-columns: 1fr; }
          .modal-content    { padding: 24px; }
          .modal-title      { font-size: 28px; }
          .modal-header     { height: 250px; }
          .gallery-modal-caption-bar { flex-direction: column; gap: 8px; }
        }
      `}</style>

      <section className="events-section">
        <h2 className="events-title">Upcoming & Past Events</h2>

        {/* ── Events Grid ── */}
        <div className="events-grid">
          {events.map((event) => (
            <div
              key={event.id}
              className="event-card"
              onClick={() => setSelectedEvent(event)}
            >
              <div className="event-image-wrapper">
                <img src={event.cardImage} alt={event.title} className="event-image" />
                <div className="event-status-badge" style={{ background: event.statusColor }}>
                  {event.status}
                </div>
              </div>

              <div className="event-content">
                <div className="event-category">{event.category}</div>
                <h3 className="event-title">{event.title}</h3>
                <p className="event-description">{event.description}</p>

                <div className="event-meta">
                  <div className="event-meta-item">
                    <Calendar size={16} />
                    {event.date}
                  </div>
                  <div className="event-meta-item">
                    <MapPin size={16} />
                    {event.location}
                  </div>
                </div>

                <button className="event-button">
                  View Details
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── Gallery Section ── */}
        <div className="gallery-section">
          <div className="gallery-header">
            <h3 className="gallery-title">Photo Gallery</h3>
            <a href="/gallery" className="gallery-view-all-link">
              <button className="gallery-view-all">
                View All
                <ChevronRight size={18} />
              </button>
            </a>
          </div>

          <div className="gallery-grid">
            {galleryImages.map((img) => (
              <div
                key={img.id}
                className="gallery-item"
                onClick={() => setSelectedGalleryImage(img)}
              >
                <img src={img.src} alt={img.alt} className="gallery-image" />

                {/* ✅ Caption overlay — slides up on hover */}
                <div className="gallery-caption-overlay">
                  <span className="gallery-event-tag">{img.event}</span>
                  <p className="gallery-caption-text">{img.caption}</p>
                </div>

                {/* Eye icon — top-right */}
                <div className="gallery-eye-icon">
                  <Eye size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Event Detail Modal ── */}
      {selectedEvent && (
        <div className="event-modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="event-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <img src={selectedEvent.cardImage} alt={selectedEvent.title} className="modal-header-image" />
              <div className="modal-header-overlay" />
              <button className="modal-close-btn" onClick={() => setSelectedEvent(null)}>
                <X size={24} color="#1e40af" />
              </button>
            </div>

            <div className="modal-content">
              <div className="modal-category">{selectedEvent.category}</div>
              <h2 className="modal-title">{selectedEvent.title}</h2>

              <div className="modal-meta-row">
                <div className="modal-meta-item">
                  <Calendar className="modal-meta-icon" />
                  <div className="modal-meta-content">
                    <div className="modal-meta-label">Date & Time</div>
                    <div className="modal-meta-value">{selectedEvent.date}</div>
                  </div>
                </div>
                <div className="modal-meta-item">
                  <MapPin className="modal-meta-icon" />
                  <div className="modal-meta-content">
                    <div className="modal-meta-label">Location</div>
                    <div className="modal-meta-value">{selectedEvent.location}</div>
                  </div>
                </div>
                <div className="modal-meta-item">
                  <Users className="modal-meta-icon" />
                  <div className="modal-meta-content">
                    <div className="modal-meta-label">Attendees</div>
                    <div className="modal-meta-value">{selectedEvent.attendees}+</div>
                  </div>
                </div>
              </div>

              <p className="modal-description">{selectedEvent.fullDetails}</p>

              <div className="modal-social-row">
                <button className="social-btn"><Share2 size={18} /> Share</button>
                <button className="social-btn"><Heart size={18} /> Like</button>
                <button className="social-btn"><MessageCircle size={18} /> Comment</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Gallery Lightbox Modal — with caption bar ── */}
      {selectedGalleryImage && (
        <div className="gallery-modal-overlay" onClick={() => setSelectedGalleryImage(null)}>
          <div className="gallery-modal" onClick={(e) => e.stopPropagation()}>
            <button className="gallery-modal-close" onClick={() => setSelectedGalleryImage(null)}>
              <X size={20} />
            </button>

            <img
              src={selectedGalleryImage.src}
              alt={selectedGalleryImage.alt}
              className="gallery-modal-image"
            />

            {/* ✅ Caption bar below the lightbox image */}
            <div className="gallery-modal-caption-bar">
              <span className="gallery-modal-event-pill">{selectedGalleryImage.event}</span>
              <p className="gallery-modal-caption-text">{selectedGalleryImage.caption}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Events;