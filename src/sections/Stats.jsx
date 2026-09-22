import React, { useState, useEffect, useRef } from "react";

const PremiumStats = () => {
  const [counts, setCounts] = useState({ alumni: 0, chapters: 0, countries: 0, events: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const targetCounts = { alumni: 12000, chapters: 50, countries: 35, events: 200 };
    const speeds = { alumni: 40, chapters: 16, countries: 12, events: 6 };
    let interval;
    let currentValues = { alumni: 0, chapters: 0, countries: 0, events: 0 };

    const incrementCounts = () => {
      currentValues.alumni += speeds.alumni;
      currentValues.chapters += speeds.chapters;
      currentValues.countries += speeds.countries;
      currentValues.events += speeds.events;

      setCounts({
        alumni: Math.min(Math.floor(currentValues.alumni), targetCounts.alumni),
        chapters: Math.min(Math.floor(currentValues.chapters), targetCounts.chapters),
        countries: Math.min(Math.floor(currentValues.countries), targetCounts.countries),
        events: Math.min(Math.floor(currentValues.events), targetCounts.events),
      });
    };

    interval = setInterval(incrementCounts, 30);
    return () => clearInterval(interval);
  }, [isVisible]);

  const stats = [
    { 
      number: counts.alumni, 
      suffix: "+", 
      label: "Active Alumni", 
      icon: "👥",
      description: "Worldwide community",
      color: "#3B82F6",
      bgColor: "#F0F9FF"
    },
    { 
      number: counts.chapters, 
      suffix: "+", 
      label: "Local Chapters", 
      icon: "🌍",
      description: "Across the globe",
      color: "#8B5CF6",
      bgColor: "#FAF5FF"
    },
    { 
      number: counts.countries, 
      suffix: "+", 
      label: "Countries", 
      icon: "🗺️",
      description: "Global presence",
      color: "#06B6D4",
      bgColor: "#F0FDFA"
    },
    { 
      number: counts.events, 
      suffix: "+", 
      label: "Annual Events", 
      icon: "🎉",
      description: "Celebrations & connections",
      color: "#EC4899",
      bgColor: "#FDF2F8"
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Poppins:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');

        /* Premium Stats Section */
        .premium-stats {
          background: linear-gradient(135deg, #F8FAFB 0%, #FFFFFF 50%, #F0F9FF 100%);
          padding: 120px 40px;
          position: relative;
          overflow: hidden;
          border-top: 1px solid #E2E8F0;
          border-bottom: 1px solid #E2E8F0;
        }

        /* Background Elements */
        .stats-bg-gradient {
          position: absolute;
          top: -100px;
          right: -100px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }

        .stats-bg-gradient-2 {
          position: absolute;
          bottom: -100px;
          left: -100px;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }

        .stats-container {
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        /* Header */
        .stats-header {
          text-align: center;
          margin-bottom: 80px;
        }

        .stats-subtitle {
          font-size: 12px;
          font-weight: 700;
          color: #3B82F6;
          text-transform: uppercase;
          letter-spacing: 1.8px;
          margin-bottom: 16px;
          display: inline-block;
          padding: 8px 16px;
          background: #F0F9FF;
          border-radius: 20px;
          font-family: 'Poppins', sans-serif;
          border: 1px solid #BFDBFE;
        }

        .stats-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(36px, 5vw, 52px);
          font-weight: 700;
          color: #0F172A;
          line-height: 1.1;
          letter-spacing: -0.5px;
          margin-bottom: 20px;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }

        .stats-description {
          font-size: 16px;
          color: #64748B;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
          font-weight: 400;
          font-family: 'Poppins', sans-serif;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 32px;
          margin-top: 20px;
        }

        /* Stat Card */
        .stat-card {
          background: linear-gradient(135deg, var(--bg-color) 0%, #FFFFFF 100%);
          border: 1.5px solid #E2E8F0;
          border-radius: 16px;
          padding: 48px 32px;
          text-align: center;
          transition: all 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 0;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
        }

        /* Animated Border */
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--card-color) 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .stat-card:hover::before {
          opacity: 1;
        }

        .stat-card-content {
          position: relative;
          z-index: 1;
        }

        .stat-card:hover {
          transform: translateY(-8px);
          border-color: var(--card-color);
          box-shadow: 0 12px 32px rgba(15, 23, 42, 0.12);
        }

        /* Stat Icon */
        .stat-icon {
          font-size: 48px;
          margin-bottom: 20px;
          display: inline-block;
          animation: ${isVisible ? 'float 3s ease-in-out infinite' : 'none'};
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        .stat-card:nth-child(1) .stat-icon { animation-delay: 0s; --card-color: #3B82F6; --bg-color: #F0F9FF; }
        .stat-card:nth-child(2) .stat-icon { animation-delay: 0.2s; --card-color: #8B5CF6; --bg-color: #FAF5FF; }
        .stat-card:nth-child(3) .stat-icon { animation-delay: 0.4s; --card-color: #06B6D4; --bg-color: #F0FDFA; }
        .stat-card:nth-child(4) .stat-icon { animation-delay: 0.6s; --card-color: #EC4899; --bg-color: #FDF2F8; }

        /* Stat Number */
        .stat-number {
          font-family: 'Playfair Display', serif;
          font-size: clamp(40px, 8vw, 56px);
          font-weight: 700;
          color: var(--card-color);
          line-height: 1;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }

        .stat-suffix {
          font-size: 0.4em;
          margin-left: 2px;
          color: var(--card-color);
        }

        /* Stat Label */
        .stat-label {
          font-size: 15px;
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 8px;
          font-family: 'Poppins', sans-serif;
          letter-spacing: -0.3px;
        }

        /* Stat Description */
        .stat-description {
          font-size: 13px;
          color: #64748B;
          font-weight: 500;
          line-height: 1.4;
          font-family: 'Poppins', sans-serif;
        }

        /* Animation for cards on load */
        .stat-card {
          opacity: ${isVisible ? 1 : 0};
          animation: ${isVisible ? 'slideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : 'none'};
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .stat-card:nth-child(1) { animation-delay: 0.1s; }
        .stat-card:nth-child(2) { animation-delay: 0.2s; }
        .stat-card:nth-child(3) { animation-delay: 0.3s; }
        .stat-card:nth-child(4) { animation-delay: 0.4s; }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .premium-stats {
            padding: 80px 30px;
          }

          .stats-header {
            margin-bottom: 60px;
          }

          .stats-title {
            font-size: 42px;
          }

          .stat-card {
            padding: 40px 28px;
          }
        }

        @media (max-width: 768px) {
          .premium-stats {
            padding: 60px 20px;
          }

          .stats-header {
            margin-bottom: 50px;
          }

          .stats-title {
            font-size: 32px;
            margin-bottom: 16px;
          }

          .stats-description {
            font-size: 14px;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }

          .stat-card {
            padding: 32px 20px;
          }

          .stat-icon {
            font-size: 40px;
            margin-bottom: 16px;
          }

          .stat-number {
            font-size: 40px;
          }

          .stat-label {
            font-size: 14px;
          }

          .stat-description {
            font-size: 12px;
          }
        }

        @media (max-width: 640px) {
          .premium-stats {
            padding: 50px 16px;
          }

          .stats-header {
            margin-bottom: 40px;
          }

          .stats-title {
            font-size: 28px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .stat-card {
            padding: 28px 16px;
          }

          .stat-icon {
            font-size: 36px;
            margin-bottom: 12px;
          }

          .stat-number {
            font-size: 32px;
          }
        }
      `}</style>

      <section className="premium-stats" ref={sectionRef}>
        <div className="stats-bg-gradient"></div>
        <div className="stats-bg-gradient-2"></div>

        <div className="stats-container">
          {/* Header */}
          <div className="stats-header">
            <div className="stats-subtitle">📊 Our Impact</div>
            <h2 className="stats-title">By The Numbers</h2>
            <p className="stats-description">
              Our global community continues to grow, creating meaningful connections and driving positive change across the world
            </p>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            {stats.map((stat, idx) => (
              <div 
                key={idx} 
                className="stat-card"
                style={{
                  '--card-color': stat.color,
                  '--bg-color': stat.bgColor
                }}
              >
                <div className="stat-card-content">
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-number">
                    {stat.number.toLocaleString()}
                    <span className="stat-suffix">{stat.suffix}</span>
                  </div>
                  <div className="stat-label">{stat.label}</div>
                  <div className="stat-description">{stat.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default PremiumStats;