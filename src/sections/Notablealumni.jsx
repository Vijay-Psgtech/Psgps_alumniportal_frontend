import React, { useState } from "react";
import { Award, Briefcase, Zap, ChevronRight, Star } from "lucide-react";
import alumniImage1 from "../assets/Images/Alum1.png";
import alumniImage2 from "../assets/Images/Alum2.png";
import alumniImage3 from "../assets/Images/Alum3.png";

const NotableAlumni = () => {
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (alumniId) => {
    console.warn(`Image failed to load for alumni ${alumniId}`);
    setImageErrors((prev) => ({
      ...prev,
      [alumniId]: true,
    }));
  };

  const getFallbackImage = (alumniId) => {
    if (alumniId === 1) {
      return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop";
    } else if (alumniId === 2) {
      return "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop";
    } else if (alumniId === 3) {
      return "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop";
    }
    return "https://via.placeholder.com/400?text=Alumni";
  };

  const alumni = [
    {
      id: 1,
      name: "Dr. R. Ravichandan",
      batch: "1982 - 1987",
      degree: "B.Sc Nutrition & Dietetics",
      title: "Vice President and Head of Asia Business Operation",
      company: "Indian Immunological Ltd Hyderabad, Telangana",
      image: alumniImage1,
      category: "healthcare",
      icon: Award,
      achievement: "Healthcare Innovation",
      color: "#3B82F6",
      bgColor: "#F0F9FF",
      borderColor: "#BFDBFE",
    },
    {
      id: 2,
      name: "Mrs. Vanathi Srinivasan",
      batch: "1987-1990",
      degree: "B.Sc Chemistry",
      title: "National President of the Women's wing of",
      company: "Bharathiya Jananta Party (BJP) Member of Tamil",
      image: alumniImage2,
      category: "politics",
      icon: Star,
      achievement: "Political Leadership",
      color: "#EC4899",
      bgColor: "#FDF2F8",
      borderColor: "#FBCFE8",
    },
    {
      id: 3,
      name: "Dr. K. Kathirvelu",
      batch: "1986-1989",
      degree: "B.Sc Zoology & MSC Environmental Science",
      title: 'Scientist "F" DEBEL Defence Research and',
      company: "Development Organization (DRDO)",
      image: alumniImage3,
      category: "research",
      icon: Zap,
      achievement: "Defence Technology",
      color: "#06B6D4",
      bgColor: "#F0FDFA",
      borderColor: "#A5F3FC",
    },
  ];

  const filteredAlumni =
    selectedCategory === "all"
      ? alumni
      : alumni.filter((a) => a.category === selectedCategory);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Poppins:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');

        * {
          box-sizing: border-box;
        }

        /* Notable Alumni Section */
        .notable-alumni-section {
          padding: 5rem 2rem;
          background: linear-gradient(135deg, #F8FAFB 0%, #FFFFFF 50%, #F0F9FF 100%);
          position: relative;
          overflow: hidden;
          border-top: 1px solid #E2E8F0;
          min-height: 100vh;
        }

        /* Background Decorations */
        .alumni-bg-decoration {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .alumni-blob {
          position: absolute;
          border-radius: 50%;
          opacity: 0.04;
        }

        .blob-1 {
          width: 400px;
          height: 400px;
          background: #3B82F6;
          top: -100px;
          right: 10%;
        }

        .blob-2 {
          width: 300px;
          height: 300px;
          background: #8B5CF6;
          bottom: -50px;
          left: 5%;
        }

        .blob-3 {
          width: 250px;
          height: 250px;
          background: #06B6D4;
          top: 50%;
          right: -50px;
        }

        /* Header */
        .alumni-header {
          position: relative;
          z-index: 1;
          text-align: center;
          margin-bottom: 3rem;
          animation: slideUp 0.8s ease-out;
        }

        .alumni-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0.625rem 1.125rem;
          background: #F0F9FF;
          border: 1px solid #BFDBFE;
          border-radius: 50px;
          margin-bottom: 1rem;
          font-size: clamp(10px, 1.5vw, 12px);
          font-weight: 700;
          color: #3B82F6;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          font-family: 'Poppins', sans-serif;
          animation: slideUp 0.8s ease-out 0.1s backwards;
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

        .alumni-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 5vw, 56px);
          font-weight: 800;
          color: #0F172A;
          margin-bottom: 1rem;
          letter-spacing: -0.5px;
          animation: slideUp 0.8s ease-out 0.2s backwards;
          line-height: 1.2;
        }

        .alumni-subtitle {
          font-size: clamp(14px, 2vw, 16px);
          color: #64748B;
          font-weight: 400;
          max-width: 700px;
          margin: 0 auto;
          font-family: 'Poppins', sans-serif;
          line-height: 1.7;
          animation: slideUp 0.8s ease-out 0.3s backwards;
          padding: 0 1rem;
        }

        .alumni-header::after {
          content: '';
          display: block;
          width: 60px;
          height: 4px;
          background: linear-gradient(90deg, #3B82F6, #06B6D4);
          border-radius: 2px;
          margin: 1.5rem auto 0;
          animation: expandWidth 0.8s ease-out 0.4s backwards;
        }

        @keyframes expandWidth {
          from {
            width: 0;
            opacity: 0;
          }
          to {
            width: 60px;
            opacity: 1;
          }
        }

        /* Filter Tabs */
        .alumni-filters {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: 3.5rem;
          flex-wrap: wrap;
          position: relative;
          z-index: 1;
          animation: fadeIn 0.8s ease-out 0.5s backwards;
          padding: 0 1rem;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .filter-btn {
          padding: 0.7rem 1.25rem;
          background: #FFFFFF;
          border: 2px solid #E2E8F0;
          border-radius: 50px;
          cursor: pointer;
          font-size: clamp(11px, 1.5vw, 13px);
          font-weight: 600;
          color: #64748B;
          transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
          font-family: 'Poppins', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .filter-btn:hover {
          border-color: #3B82F6;
          color: #3B82F6;
          background: #F0F9FF;
          transform: translateY(-2px);
        }

        .filter-btn.active {
          background: linear-gradient(135deg, #3B82F6, #0EA5E9);
          color: white;
          border-color: transparent;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
        }

        .filter-btn.active:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
        }

        /* Alumni Grid */
        .alumni-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
          position: relative;
          z-index: 1;
          padding: 0 1rem;
        }

        /* Alumni Card */
        .alumni-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 20px;
          overflow: hidden;
          transition: all 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.03);
          height: 100%;
        }

        .alumni-card:hover {
          transform: translateY(-12px);
          border-color: var(--accent-color);
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.15), 0 2px 8px rgba(15, 23, 42, 0.06);
        }

        /* Image Wrapper */
        .alumni-image-wrapper {
          position: relative;
          height: clamp(240px, 50vw, 320px);
          overflow: hidden;
          background: var(--bg-color);
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .alumni-card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          background: var(--bg-color);
          transition: transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .alumni-card:hover .alumni-card-image {
          transform: scale(1.05);
        }

        /* Image Overlay */
        .image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%);
          display: flex;
          align-items: flex-end;
          padding: 1.5rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .alumni-card:hover .image-overlay {
          opacity: 1;
        }

        /* Achievement Badge */
        .achievement-badge {
          background: linear-gradient(135deg, var(--accent-color), var(--accent-darker));
          color: white;
          padding: 0.65rem 1rem;
          border-radius: 10px;
          font-size: clamp(9px, 1.2vw, 11px);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          font-family: 'Poppins', sans-serif;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(10px);
        }

        /* Icon Badge */
        .icon-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 48px;
          height: 48px;
          background: #FFFFFF;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-color);
          box-shadow: 0 6px 16px rgba(15, 23, 42, 0.12), 0 2px 6px rgba(15, 23, 42, 0.05);
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 1px solid rgba(255, 255, 255, 0.6);
        }

        .alumni-card:hover .icon-badge {
          transform: translateY(-6px) scale(1.05);
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.18), 0 4px 10px rgba(15, 23, 42, 0.08);
        }

        /* Content */
        .alumni-content {
          padding: clamp(1.25rem, 3vw, 2rem);
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
          background: linear-gradient(135deg, #FFFFFF 0%, rgba(248, 250, 251, 0.4) 100%);
        }

        .alumni-meta {
          font-size: clamp(9px, 1.2vw, 11px);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--accent-color);
          font-family: 'Poppins', sans-serif;
          opacity: 0.9;
        }

        .alumni-name {
          font-family: 'Playfair Display', serif;
          font-size: clamp(20px, 3.5vw, 26px);
          font-weight: 700;
          color: #0F172A;
          margin: 0.25rem 0;
          line-height: 1.3;
          letter-spacing: -0.3px;
        }

        .alumni-degree {
          font-size: clamp(11px, 1.5vw, 12px);
          color: var(--accent-color);
          font-weight: 600;
          font-family: 'Poppins', sans-serif;
          opacity: 0.85;
          margin-bottom: 0.25rem;
          line-height: 1.4;
        }

        .alumni-position {
          font-size: clamp(12px, 1.8vw, 13px);
          color: #475569;
          line-height: 1.6;
          flex: 1;
          margin: 0.5rem 0 0.75rem 0;
          font-family: 'Poppins', sans-serif;
        }

        .alumni-position strong {
          color: #0F172A;
          font-weight: 600;
        }

        /* Button */
        .alumni-btn {
          align-self: flex-start;
          padding: clamp(0.65rem, 1.5vw, 0.75rem) clamp(1rem, 2vw, 1.25rem);
          background: linear-gradient(135deg, var(--accent-color), var(--accent-darker));
          color: white;
          border: none;
          border-radius: 10px;
          font-size: clamp(10px, 1.3vw, 12px);
          font-weight: 700;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          letter-spacing: 0.6px;
          margin-top: auto;
          font-family: 'Poppins', sans-serif;
          box-shadow: 0 6px 16px rgba(15, 23, 42, 0.12);
        }

        .alumni-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.18);
        }

        .alumni-btn:active {
          transform: translateY(-2px);
        }

        /* Stats */
        .alumni-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          padding: clamp(2rem, 4vw, 3rem);
          background: linear-gradient(135deg, #F8FAFB 0%, #FFFFFF 100%);
          border: 1.5px solid #E2E8F0;
          border-radius: 16px;
          position: relative;
          z-index: 1;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
          margin: 0 1rem;
        }

        .stat-item {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .stat-number {
          font-family: 'Playfair Display', serif;
          font-size: clamp(32px, 6vw, 56px);
          font-weight: 800;
          color: #3B82F6;
          margin-bottom: 0.5rem;
          line-height: 1;
        }

        .stat-label {
          font-size: clamp(11px, 1.5vw, 13px);
          font-weight: 700;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-family: 'Poppins', sans-serif;
        }

        /* Image Loading Fallback */
        .image-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          background: var(--bg-color);
          color: var(--accent-color);
          font-family: 'Poppins', sans-serif;
          font-size: clamp(12px, 2vw, 14px);
          text-align: center;
          padding: 1rem;
        }

        /* Responsive Design - Mobile First Approach */
        @media (max-width: 640px) {
          .notable-alumni-section {
            padding: 2.5rem 1rem;
          }

          .alumni-header {
            margin-bottom: 2.5rem;
          }

          .alumni-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            padding: 0;
          }

          .alumni-filters {
            gap: 0.5rem;
            margin-bottom: 2.5rem;
            padding: 0;
          }

          .filter-btn {
            padding: 0.6rem 1rem;
            font-size: 11px;
          }

          .alumni-content {
            padding: 1.25rem;
            gap: 0.7rem;
          }

          .alumni-position {
            font-size: 12px;
          }

          .alumni-btn {
            padding: 0.6rem 1rem;
          }

          .alumni-stats {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            padding: 1.5rem;
            margin: 0;
          }

          .stat-number {
            font-size: 36px;
          }

          .stat-label {
            font-size: 11px;
          }

          .icon-badge {
            width: 44px;
            height: 44px;
          }

          .icon-badge svg {
            width: 20px;
            height: 20px;
          }
        }

        @media (min-width: 641px) and (max-width: 768px) {
          .notable-alumni-section {
            padding: 3rem 1.5rem;
          }

          .alumni-header {
            margin-bottom: 3rem;
          }

          .alumni-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.75rem;
            padding: 0;
          }

          .alumni-filters {
            margin-bottom: 3rem;
            gap: 0.65rem;
            padding: 0;
          }

          .filter-btn {
            padding: 0.65rem 1.15rem;
            font-size: 12px;
          }

          .alumni-content {
            padding: 1.5rem;
          }

          .alumni-stats {
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
            padding: 2.5rem;
            margin: 0 0.5rem;
          }

          .stat-number {
            font-size: 42px;
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .notable-alumni-section {
            padding: 4rem 2rem;
          }

          .alumni-header {
            margin-bottom: 3.5rem;
          }

          .alumni-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
            padding: 0;
          }

          .alumni-filters {
            margin-bottom: 3.5rem;
            gap: 0.75rem;
          }

          .alumni-content {
            padding: 1.75rem;
          }

          .alumni-stats {
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
            padding: 3rem;
          }

          .stat-number {
            font-size: 48px;
          }
        }

        @media (min-width: 1025px) {
          .notable-alumni-section {
            padding: 5rem 2.5rem;
          }

          .alumni-header {
            margin-bottom: 4rem;
          }

          .alumni-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 2.5rem;
            padding: 0;
          }

          .alumni-image-wrapper {
            height: 350px;
          }

          .alumni-filters {
            margin-bottom: 4rem;
          }

          .alumni-content {
            padding: 2rem;
          }

          .alumni-stats {
            grid-template-columns: repeat(3, 1fr);
            gap: 3rem;
            padding: 3.5rem;
            margin: 0 auto;
            max-width: 1400px;
          }

          .stat-number {
            font-size: 56px;
          }
        }

        @media (min-width: 1440px) {
          .notable-alumni-section {
            padding: 6rem 3rem;
            max-width: 1600px;
            margin: 0 auto;
          }

          .alumni-grid {
            gap: 3rem;
          }

          .alumni-stats {
            gap: 4rem;
            max-width: 1400px;
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
          .alumni-title {
            font-weight: 900;
          }

          .alumni-name {
            font-weight: 800;
          }

          .filter-btn.active {
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.4);
          }
        }

        /* Dark Mode Support (Optional) */
        @media (prefers-color-scheme: dark) {
          .notable-alumni-section {
            background: linear-gradient(135deg, #1A1F35 0%, #0F1420 50%, #162A4C 100%);
            border-top-color: #374151;
          }

          .alumni-header {
            color: #FFFFFF;
          }

          .alumni-title {
            color: #FFFFFF;
          }

          .alumni-subtitle {
            color: #CBD5E1;
          }

          .alumni-card {
            background: #1F2937;
            border-color: #374151;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          }

          .alumni-name {
            color: #FFFFFF;
          }

          .alumni-position {
            color: #D1D5DB;
          }

          .alumni-position strong {
            color: #FFFFFF;
          }

          .filter-btn {
            background: #374151;
            border-color: #4B5563;
            color: #E5E7EB;
          }

          .filter-btn:hover {
            background: #1E293B;
            border-color: #3B82F6;
          }

          .alumni-stats {
            background: linear-gradient(135deg, #1A1F35 0%, #111827 100%);
            border-color: #374151;
          }
        }
      `}</style>

      <section className="notable-alumni-section">
        {/* Decorative Background */}
        <div className="alumni-bg-decoration">
          <div className="alumni-blob blob-1"></div>
          <div className="alumni-blob blob-2"></div>
          <div className="alumni-blob blob-3"></div>
        </div>

        {/* Header */}
        <div className="alumni-header">
          <div className="alumni-badge">⭐ Excellence in Education</div>
          <h2 className="alumni-title">Distinguished Alumni</h2>
          <p className="alumni-subtitle">
            Celebrating the achievements of our distinguished graduates who are
            making a global impact across various fields
          </p>
        </div>

        {/* Filters */}
        <div className="alumni-filters">
          <button
            className={`filter-btn ${selectedCategory === "all" ? "active" : ""}`}
            onClick={() => setSelectedCategory("all")}
            aria-label="Show all alumni"
          >
            All Alumni
          </button>
          <button
            className={`filter-btn ${selectedCategory === "healthcare" ? "active" : ""}`}
            onClick={() => setSelectedCategory("healthcare")}
            aria-label="Filter healthcare alumni"
          >
            Healthcare
          </button>
          <button
            className={`filter-btn ${selectedCategory === "politics" ? "active" : ""}`}
            onClick={() => setSelectedCategory("politics")}
            aria-label="Filter politics alumni"
          >
            Politics
          </button>
          <button
            className={`filter-btn ${selectedCategory === "research" ? "active" : ""}`}
            onClick={() => setSelectedCategory("research")}
            aria-label="Filter research alumni"
          >
            Research
          </button>
        </div>

        {/* Alumni Grid */}
        <div className="alumni-grid">
          {filteredAlumni.map((person) => {
            const IconComponent = person.icon;
            const imageUrl = imageErrors[person.id]
              ? getFallbackImage(person.id)
              : person.image;

            return (
              <div
                key={person.id}
                className="alumni-card"
                style={{
                  "--accent-color": person.color,
                  "--accent-darker": person.borderColor,
                  "--bg-color": person.bgColor,
                }}
                onMouseEnter={() => setHoveredId(person.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="alumni-image-wrapper">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={person.name}
                      className="alumni-card-image"
                      onError={() => handleImageError(person.id)}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="image-loading">
                      <span>Unable to load image</span>
                    </div>
                  )}
                  <div className="image-overlay">
                    <div className="achievement-badge">
                      {person.achievement}
                    </div>
                  </div>
                  <div className="icon-badge">
                    <IconComponent size={24} strokeWidth={1.5} />
                  </div>
                </div>

                <div className="alumni-content">
                  <div className="alumni-meta">{person.batch}</div>
                  <h3 className="alumni-name">{person.name}</h3>
                  <p className="alumni-degree">{person.degree}</p>
                  <p className="alumni-position">
                    <strong>{person.title}</strong>
                    <br />
                    {person.company}
                  </p>
                  <button className="alumni-btn">
                    Learn More <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="alumni-stats">
          <div className="stat-item">
            <div className="stat-number">3K+</div>
            <div className="stat-label">Successful Alumni</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50+</div>
            <div className="stat-label">Countries</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100+</div>
            <div className="stat-label">Leading Companies</div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotableAlumni;