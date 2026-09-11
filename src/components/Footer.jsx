import React from "react";
import { Mail, Linkedin, Twitter, Instagram, ArrowRight, Heart, Phone, MapPin, Globe } from "lucide-react";
import PSGLogo from "../assets/Images/1280.png";

const ModernFooter = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Alumni",
      links: [
        { name: "Alumni Directory", href: "/alumni/directory" },
        { name: "Events & Reunions", href: "/upcoming-events" },
        { name: "Alumni Profile", href: "/alumni/profile" },
        { name: "Alumni Chapters", href: "/alumni/chapters" },
      ],
    },
    {
      title: "Community",
      links: [
        { name: "Leadership", href: "/leadership" },
        { name: "News & Updates", href: "/newsletter" },
        { name: "Gallery", href: "/gallery" },
        { name: "Contact Us", href: "/contact" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Donate", href: "/donate" },
        { name: "Become Member", href: "/alumni/register" },
        { name: "Campaigns", href: "/campaigns" },
        { name: "Mentorship", href: "/alumni/dashboard" },
      ],
    },
    {
      title: "Careers",
      links: [
        { name: "Job Board", href: "/alumni/dashboard" },
        { name: "Career Services", href: "https://careers.psginstitutions.in/" },
        { name: "Internships", href: "https://careers.psginstitutions.in/" },
        { name: "For Employers", href: "/contact" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Linkedin, href: "https://www.linkedin.com/company/psg-institutions/", label: "LinkedIn" },
    { icon: Twitter, href: "https://twitter.com/psginstitutions", label: "Twitter" },
    { icon: Instagram, href: "https://www.instagram.com/psginstitutions/", label: "Instagram" },
    { icon: Mail, href: "mailto:alumni@psginstitutions.ac.in", label: "Email" },
  ];

  const contactInfo = [
    { icon: MapPin, text: "PSG College of Arts & Science, Coimbatore, India" },
    { icon: Phone, text: "+91 (0) 422 4393 800" },
    { icon: Mail, text: "alumni@psginstitutions.ac.in" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Poppins:wght@400;500;600&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .modern-footer {
          background: linear-gradient(180deg, #0f1729 0%, #1a2847 100%);
          color: white;
          position: relative;
          overflow: hidden;
        }

        /* Animated background elements */
        .footer-bg {
          position: absolute;
          top: 0;
          right: -200px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(200, 62, 125, 0.15) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 10s ease-in-out infinite;
        }

        .footer-bg-2 {
          position: absolute;
          bottom: -150px;
          left: -150px;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(30, 60, 114, 0.2) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 12s ease-in-out infinite reverse;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-40px) translateX(-40px); }
        }

        .footer-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: clamp(2rem, 5vw, 5rem) clamp(1rem, 3vw, 3rem);
          position: relative;
          z-index: 2;
        }

        /* Newsletter Section */
        .newsletter-section {
          background: linear-gradient(135deg, rgba(30, 60, 114, 0.3), rgba(200, 62, 125, 0.15));
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 20px;
          padding: clamp(1.5rem, 4vw, 2.5rem);
          margin-bottom: clamp(2rem, 4vw, 3.75rem);
          backdrop-filter: blur(10px);
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

        .newsletter-title {
          font-family: 'Sora', sans-serif;
          font-size: clamp(18px, 3vw, 24px);
          font-weight: 700;
          margin-bottom: clamp(0.5rem, 1vw, 0.75rem);
        }

        .newsletter-desc {
          font-size: clamp(12px, 1.5vw, 14px);
          opacity: 0.8;
          margin-bottom: clamp(1rem, 1.5vw, 1.25rem);
          line-height: 1.6;
        }

        .newsletter-form {
          display: flex;
          gap: clamp(0.5rem, 1vw, 0.75rem);
          flex-wrap: wrap;
        }

        .newsletter-input {
          flex: 1;
          min-width: 200px;
          padding: clamp(0.75rem, 1.5vw, 1rem);
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 10px;
          color: white;
          font-size: clamp(12px, 1.2vw, 14px);
          font-family: 'Poppins', sans-serif;
          transition: all 0.3s ease;
        }

        .newsletter-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .newsletter-input:focus {
          outline: none;
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(200, 62, 125, 0.6);
          box-shadow: 0 0 0 3px rgba(200, 62, 125, 0.1);
        }

        .newsletter-btn {
          padding: clamp(0.7rem, 1.5vw, 0.85rem) clamp(1rem, 2vw, 1.5rem);
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
          border: none;
          border-radius: 10px;
          color: white;
          cursor: pointer;
          font-weight: 600;
          font-size: clamp(11px, 1.2vw, 13px);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          white-space: nowrap;
          font-family: 'Poppins', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .newsletter-btn:hover {
          background: linear-gradient(135deg, #2a5298 0%, #c83e7d 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(200, 62, 125, 0.3);
        }

        .newsletter-btn:active {
          transform: translateY(0);
        }

        /* Main grid */
        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(clamp(200px, 20vw, 280px), 1fr));
          gap: clamp(2rem, 4vw, 3.75rem);
          margin-bottom: clamp(2rem, 4vw, 3.75rem);
          animation: slideUp 0.8s ease-out 0.2s backwards;
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: clamp(1rem, 1.5vw, 1.5rem);
          grid-column: 1 / -1;
        }

        @media (min-width: 1024px) {
          .footer-brand {
            grid-column: span 1;
          }

          .footer-grid {
            grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr;
          }
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: clamp(0.75rem, 1.5vw, 1rem);
          font-family: 'Sora', sans-serif;
          font-weight: 800;
          font-size: clamp(16px, 2vw, 20px);
          text-decoration: none;
          color: white;
          transition: all 0.3s ease;
        }

        .footer-logo:hover {
          transform: translateY(-2px);
        }

        .logo-icon {
          width: clamp(60px, 7vw, 170px);
          height: clamp(60px, 8vw, 40px);
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid rgba(255, 255, 255, 0.2);
          overflow: hidden;
        }

        .logo-icon img {
          width: 100%;
          height: 100%;
          object-fit:contain;
          padding: 1px;
        }

        .footer-description {
          font-size: clamp(12px, 1.3vw, 14px);
          opacity: 0.75;
          line-height: 1.7;
          max-width: 350px;
        }

        .footer-social {
          display: flex;
          gap: clamp(0.6rem, 1vw, 0.75rem);
          flex-wrap: wrap;
        }

        .social-btn {
          width: clamp(36px, 5vw, 44px);
          height: clamp(36px, 5vw, 44px);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          font-size: 18px;
          flex-shrink: 0;
        }

        .social-btn:hover {
          background: linear-gradient(135deg, #1e3c72, #c83e7d);
          border-color: rgba(200, 62, 125, 0.5);
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(200, 62, 125, 0.35);
        }

        /* Contact Info */
        .contact-info {
          display: flex;
          flex-direction: column;
          gap: clamp(1rem, 1.5vw, 1.25rem);
          grid-column: 1 / -1;
          margin-bottom: clamp(1.5rem, 2vw, 2.5rem);
          animation: slideUp 0.8s ease-out 0.3s backwards;
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: clamp(0.75rem, 1.5vw, 1rem);
          font-size: clamp(12px, 1.3vw, 14px);
          opacity: 0.85;
          line-height: 1.6;
        }

        .contact-item svg {
          width: clamp(18px, 2vw, 20px);
          height: clamp(18px, 2vw, 20px);
          flex-shrink: 0;
          margin-top: 2px;
          color: #c83e7d;
        }

        .footer-section {
          display: flex;
          flex-direction: column;
          gap: clamp(1rem, 1.5vw, 1.25rem);
          animation: slideUp 0.8s ease-out 0.4s backwards;
        }

        .section-title {
          font-family: 'Sora', sans-serif;
          font-weight: 700;
          font-size: clamp(13px, 1.5vw, 15px);
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          position: relative;
          padding-bottom: clamp(0.75rem, 1vw, 1rem);
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 35px;
          height: 2px;
          background: linear-gradient(90deg, #1e3c72, #c83e7d);
          border-radius: 2px;
        }

        .section-links {
          display: flex;
          flex-direction: column;
          gap: clamp(0.75rem, 1vw, 0.9rem);
        }

        .footer-link {
          font-size: clamp(12px, 1.3vw, 14px);
          color: rgba(255, 255, 255, 0.75);
          text-decoration: none;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
          position: relative;
          padding: 4px 0;
        }

        .footer-link::before {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #1e3c72, #c83e7d);
          transition: width 0.3s ease;
          border-radius: 2px;
        }

        .footer-link:hover::before {
          width: 100%;
        }

        .footer-link:hover {
          color: white;
          padding-left: 4px;
        }

        .footer-link-icon {
          width: 14px;
          height: 14px;
          opacity: 0.6;
        }

        /* Divider */
        .footer-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          margin-bottom: clamp(1.5rem, 2vw, 2.5rem);
        }

        /* Bottom section */
        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: clamp(1rem, 2vw, 1.5rem);
          font-size: clamp(11px, 1.2vw, 13px);
          opacity: 0.65;
          animation: slideUp 0.8s ease-out 0.5s backwards;
        }

        .footer-copyright {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .footer-links-bottom {
          display: flex;
          gap: clamp(1rem, 2vw, 1.5rem);
          flex-wrap: wrap;
          justify-content: center;
        }

        .footer-link-bottom {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
          padding-bottom: 2px;
        }

        .footer-link-bottom::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 1px;
          background: rgba(200, 62, 125, 0.7);
          transition: width 0.3s ease;
        }

        .footer-link-bottom:hover::after {
          width: 100%;
        }

        .footer-link-bottom:hover {
          color: rgba(255, 255, 255, 0.95);
        }

        .heart-icon {
          animation: heartbeat 1.5s ease-in-out infinite;
        }

        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: clamp(1.5rem, 3vw, 2.5rem);
          }

          .footer-content {
            padding: clamp(2rem, 4vw, 3rem) clamp(1rem, 2vw, 2rem);
          }
        }

        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: clamp(1.5rem, 3vw, 2rem);
          }

          .footer-brand {
            grid-column: 1 / -1;
            margin-bottom: clamp(1rem, 2vw, 1.5rem);
          }

          .newsletter-section {
            padding: clamp(1.25rem, 3vw, 2rem);
          }

          .newsletter-form {
            flex-direction: column;
          }

          .newsletter-input {
            min-width: unset;
            width: 100%;
          }

          .newsletter-btn {
            width: 100%;
            justify-content: center;
          }

          .footer-bottom {
            flex-direction: column;
            text-align: center;
            gap: clamp(0.75rem, 1.5vw, 1rem);
          }

          .footer-links-bottom {
            justify-content: center;
            order: -1;
            width: 100%;
          }

          .contact-info {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: clamp(1.25rem, 2vw, 1.5rem);
          }

          .footer-section {
            display: none;
          }

          .footer-section:nth-child(2),
          .footer-section:nth-child(3) {
            display: flex;
          }

          .footer-brand {
            grid-column: 1 / -1;
            margin-bottom: clamp(0.75rem, 1.5vw, 1rem);
          }

          .footer-logo {
            font-size: clamp(14px, 1.8vw, 16px);
          }

          .newsletter-section {
            margin-bottom: clamp(1.5rem, 3vw, 2rem);
          }

          .footer-copyright {
            font-size: clamp(10px, 1vw, 11px);
          }

          .contact-info {
            display: none;
          }
        }

        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }

        /* Print Styles */
        @media print {
          .modern-footer {
            background: white;
            color: black;
          }

          .newsletter-section {
            border: 1px solid #ddd;
            background: #f9f9f9;
          }

          .footer-bg,
          .footer-bg-2 {
            display: none;
          }

          .social-btn {
            border: 1px solid #ddd;
            background: #f9f9f9;
            color: black;
          }
        }
      `}</style>

      <footer className="modern-footer">
        {/* Background Decorations */}
        <div className="footer-bg"></div>
        <div className="footer-bg-2"></div>

        <div className="footer-content">
          {/* Newsletter Section */}
          <div className="newsletter-section">
            <h3 className="newsletter-title">📬 Stay Connected</h3>
            <p className="newsletter-desc">
              Get the latest news, events, career opportunities, and updates from PSG Arts Alumni community
            </p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                className="newsletter-input"
                placeholder="Enter your email address..."
                required
              />
              <button className="newsletter-btn" type="submit">
                <ArrowRight size={16} strokeWidth={2} />
                <span>Subscribe</span>
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="contact-info">
            {contactInfo.map((info, idx) => {
              const Icon = info.icon;
              return (
                <div key={idx} className="contact-item">
                  <Icon size={20} strokeWidth={1.5} />
                  <span>{info.text}</span>
                </div>
              );
            })}
          </div>

          {/* Main Grid */}
          <div className="footer-grid">
            {/* Brand Section */}
            <div className="footer-brand">
              <a href="/" className="footer-logo">
                <div className="logo-icon">
                  <img src={PSGLogo} alt="PSG Arts Alumni Logo" />
                </div>
                <div>
                  <div>PSG Arts</div>
                  <div style={{ fontSize: "0.7em", opacity: 0.8 }}>Alumni Portal</div>
                </div>
              </a>
              <p className="footer-description">
                Connecting global PSG Arts alumni through mentorship, community engagement, professional opportunities, and lifelong growth for sustained excellence.
              </p>
              <div className="footer-social">
                {socialLinks.map((social, idx) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={idx}
                      href={social.href}
                      className="social-btn"
                      aria-label={social.label}
                      title={social.label}
                      target={social.href.startsWith("http") ? "_blank" : "_self"}
                      rel={social.href.startsWith("http") ? "noopener noreferrer" : ""}
                    >
                      <Icon size={55} strokeWidth={1.5} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Alumni Section */}
            <div className="footer-section">
              <h4 className="section-title">👥 Alumni</h4>
              <div className="section-links">
                <a href="/alumni/directory" className="footer-link">
                  Directory
                </a>
                <a href="/upcoming-events" className="footer-link">
                  Events & Reunions
                </a>
                <a href="/alumni/profile" className="footer-link">
                  My Profile
                </a>
                <a href="/alumni/chapters" className="footer-link">
                  Alumni Chapters
                </a>
              </div>
            </div>

            {/* Community Section */}
            <div className="footer-section">
              <h4 className="section-title">🌍 Community</h4>
              <div className="section-links">
                <a href="/leadership" className="footer-link">
                  Leadership
                </a>
                <a href="/newsletter" className="footer-link">
                  News & Updates
                </a>
                <a href="/gallery" className="footer-link">
                  Photo Gallery
                </a>
                <a href="/contact" className="footer-link">
                  Contact Us
                </a>
              </div>
            </div>

            {/* Support Section */}
            <div className="footer-section">
              <h4 className="section-title">💪 Support</h4>
              <div className="section-links">
                <a href="/donate" className="footer-link">
                  Make a Donation
                </a>
                <a href="/alumni/register" className="footer-link">
                  Join Community
                </a>
                <a href="/campaigns" className="footer-link">
                  Campaigns
                </a>
                <a href="/alumni/dashboard" className="footer-link">
                  Mentorship
                </a>
              </div>
            </div>

            {/* Careers Section */}
            <div className="footer-section">
              <h4 className="section-title">🚀 Careers</h4>
              <div className="section-links">
                <a href="/alumni/dashboard" className="footer-link">
                  Job Board
                </a>
                <a 
                  href="https://careers.psginstitutions.in/" 
                  className="footer-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Career Services
                </a>
                <a 
                  href="https://careers.psginstitutions.in/" 
                  className="footer-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Internships
                </a>
                <a href="/contact" className="footer-link">
                  For Employers
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="footer-divider"></div>

          {/* Bottom Section */}
          <div className="footer-bottom">
            <div className="footer-copyright">
              <span>&copy; {currentYear}</span>
              <span>PSG Institutions</span>
              <span>•</span>
              <span>Powered by Central IT Services</span>
              <Heart size={14} strokeWidth={2} className="heart-icon" style={{ color: "#c83e7d" }} />
            </div>
            <div className="footer-links-bottom">
              <a href="#" className="footer-link-bottom">Privacy Policy</a>
              <a href="#" className="footer-link-bottom">Terms of Service</a>
              <a href="#" className="footer-link-bottom">Cookie Settings</a>
              <a href="#" className="footer-link-bottom">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default ModernFooter;