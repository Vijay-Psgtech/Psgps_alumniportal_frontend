// SiteNavbar.jsx
import psgpsLogo from '../assets/ALUMNI LOGO.jpg'
import { useState, useRef, useCallback, useEffect } from 'react'
import {
  ChevronDown, Map, Menu, Users, X, LayoutDashboard, Calendar,
  LogOut, LayoutDashboardIcon, User, Heart, FileText, NewspaperIcon
} from 'lucide-react'
import { Link, useNavigate, useLocation, NavLink } from 'react-router-dom'
import { useAuth } from "../context/AuthContext";

function SiteNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate()
  const location = useLocation()
  const [alumniMenuOpen, setAlumniMenuOpen] = useState(false)
  const [adminMenuOpen, setAdminMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const userMenuRef = useRef(null)
  const alumniMenuRef = useRef(null)
  const adminMenuRef = useRef(null)

  useEffect(() => {
    // location / and home : transparent initially, dark after scrolling.
    // All other pages: dark immediately
    const isHomePage = location.pathname === '/' || location.pathname === '/home'

    const onScroll = () => setScrolled(!isHomePage || window.scrollY > 60)

    onScroll()

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [location.pathname])

  useEffect(() => {
    const onClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false)
      if (alumniMenuRef.current && !alumniMenuRef.current.contains(e.target)) setAlumniMenuOpen(false)
      if (adminMenuRef.current && !adminMenuRef.current.contains(e.target)) setAdminMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
    setAlumniMenuOpen(false)
    setAdminMenuOpen(false)
  }

  const handleLogout = useCallback(() => {
    logout();
    setUserMenuOpen(false);
    navigate("/");
  }, [logout, navigate]);

  return (
    <>
      <style>{`
        .ab-navbar {
          position: fixed;
          top: 0; left: 0;
          width: 100%;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 82px;
          padding: 0 6vw;
          /* Transparent by default — the hero's own gradient shows through,
             so there's no visible seam between nav and hero at the top of
             the page. */
          background: transparent;
          border-bottom: 1px solid transparent;
          box-shadow: none;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
          transition: min-height 0.35s ease, background 0.35s ease,
                      box-shadow 0.35s ease, border-color 0.35s ease,
                      backdrop-filter 0.35s ease;
        }
        .ab-navbar.ab-condensed {
          min-height: 66px;
          background: linear-gradient(180deg, rgba(7,29,56,0.97), rgba(11,33,61,0.97));
          border-color: rgba(215, 173, 90, 0.4);
          box-shadow: 0 16px 34px rgba(5, 18, 32, 0.3);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .ab-brand { display: flex; align-items: center; gap: 12px; text-decoration: none; }
        .ab-brand img { width: 40px; height: 40px; object-fit: contain; border-radius: 8px; }
        .ab-brand span {
          font-family: var(--font-display, serif);
          font-size: 19px;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: #f7fbff;
        }

        .ab-nav-links { display: flex; align-items: center; gap: 4px; }
        .ab-nav-links > a {
          padding: 9px 15px;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(226, 235, 248, 0.86);
          text-decoration: none;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .ab-nav-links > a:hover { background: rgba(255,255,255,0.08); color: #ffd98f; }

        .ab-dropdown { position: relative; }
        .ab-dropdown-toggle {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 9px 15px;
          border-radius: 8px;
          border: none;
          background: transparent;
          font-size: 12.5px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(226, 235, 248, 0.86);
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .ab-dropdown-toggle:hover { background: rgba(255,255,255,0.08); color: #ffd98f; }

        .ab-dropdown-menu {
          position: absolute;
          top: calc(100% + 12px);
          left: 50%;
          transform: translateX(-50%);
          min-width: 195px;
          padding: 8px;
          border-radius: 14px;
          background: #0e2748;
          border: 1px solid rgba(215, 173, 90, 0.3);
          box-shadow: 0 22px 40px rgba(3, 15, 29, 0.4);
          animation: abFadeIn 0.16s ease-out;
        }
        .ab-dropdown-menu a {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 600;
          color: #e8f1fc;
          text-decoration: none;
          white-space: nowrap;
        }
        .ab-dropdown-menu a:hover { background: rgba(255,255,255,0.08); color: #ffd98f; }

        @keyframes abFadeIn {
          from { opacity: 0; transform: translate(-50%, -6px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }

        .ab-actions { display: flex; align-items: center; gap: 12px; }
        .ab-sign-in {
          padding: 10px 16px;
          border-radius: 10px;
          border: 1px solid rgba(230, 239, 250, 0.32);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #f0f6ff;
          text-decoration: none;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .ab-sign-in:hover { border-color: rgba(215, 173, 90, 0.8); background: rgba(255,255,255,0.06); }
        .ab-join {
          padding: 10px 20px;
          border-radius: 999px;
          background: linear-gradient(135deg, #eac67a 0%, #d1a04d 100%);
          color: #0d2140;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          box-shadow: 0 12px 24px rgba(218, 162, 72, 0.28);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .ab-join:hover { transform: translateY(-2px); box-shadow: 0 16px 30px rgba(218, 162, 72, 0.36); }

        .ab-user-btn {
          display: flex; align-items: center; gap: 9px;
          padding: 5px 14px 5px 6px;
          border-radius: 999px;
          border: 1px solid rgba(230, 239, 250, 0.28);
          background: rgba(255,255,255,0.06);
          cursor: pointer;
          transition: background 0.15s ease, border-color 0.15s ease;
        }
        .ab-user-btn:hover { background: rgba(255,255,255,0.1); border-color: rgba(215, 173, 90, 0.6); }
        .ab-avatar {
          width: 30px; height: 30px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 11.5px; font-weight: 800;
          background: linear-gradient(135deg, #eac67a, #b77b2d);
          color: #0d2140;
        }
        .ab-user-name { font-size: 13px; font-weight: 700; color: #f1f4f8; }
        .ab-chevron { transition: transform 0.2s ease; color: rgba(226,232,240,0.65); }
        .ab-chevron.ab-open { transform: rotate(180deg); }

        .ab-user-dropdown {
          position: absolute;
          top: calc(100% + 14px);
          right: 0;
          width: 246px;
          border-radius: 16px;
          background: #ffffff;
          border: 1px solid rgba(126, 165, 214, 0.25);
          box-shadow: 0 26px 50px rgba(3, 15, 29, 0.3);
          overflow: hidden;
          animation: abFadeIn 0.16s ease-out;
        }
        .ab-dropdown-bar { height: 4px; background: linear-gradient(90deg, #eac67a, #1f66b8); }
        .ab-ud-header { padding: 16px 18px 13px; background: #f5f9fe; border-bottom: 1px solid #e2ebf5; }
        .ab-ud-label { color: #7890aa; font-size: 10px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; }
        .ab-ud-name { margin-top: 5px; color: #071d38; font-size: 14.5px; font-weight: 800; }
        .ab-ud-role { margin-top: 3px; color: #1f66b8; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
        .ab-ud-item {
          display: flex; align-items: center; gap: 10px;
          width: 100%; padding: 11px 18px;
          border: 0; background: transparent;
          font-size: 13px; font-weight: 600;
          color: #38516d; text-align: left;
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .ab-ud-item:hover { background: #edf5ff; color: #1f66b8; }
        .ab-ud-item.ab-danger { color: #b42318; }
        .ab-ud-item.ab-danger:hover { background: #fff1f0; }
        .ab-ud-divider { height: 1px; margin: 6px 14px; background: #e7eef6; }

        .ab-menu-toggle { display: none; background: none; border: none; color: #f1f4f8; cursor: pointer; }

        @media (max-width: 900px) {
          .ab-navbar { padding: 0 5vw; background: linear-gradient(180deg, rgba(7,29,56,0.9), rgba(11,33,61,0.9)); }
          .ab-menu-toggle {
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            padding: 0;
            border: 1px solid rgba(230, 239, 250, 0.5);
            border-radius: 10px;
            background: rgba(7, 29, 56, 0.72);
            color: #f1f4f8;
            box-shadow: 0 8px 18px rgba(0, 0, 0, 0.2);
          }
          .ab-navbar.ab-mobile-menu-open .ab-menu-toggle {
            position: fixed;
            top: 18px;
            right: 5vw;
            z-index: 1002;
          }
          .ab-navbar.ab-mobile-menu-open .ab-actions > *:not(.ab-menu-toggle) {
            opacity: 0;
            pointer-events: none;
          }
          .ab-menu-toggle:hover,
          .ab-menu-toggle:focus-visible {
            border-color: #f5d58a;
            color: #f5d58a;
            outline: none;
          }
          .ab-user-name { display: none; }
          .ab-nav-links {
            position: fixed;
            top: 0; right: -100%;
            width: min(320px, 84vw);
            height: 100vh;
            flex-direction: column;
            align-items: stretch;
            gap: 3px;
            padding: 96px 22px 24px;
            background: #0a1f3c;
            box-shadow: -20px 0 44px rgba(0,0,0,0.45);
            transition: right 0.3s ease;
          }
          .ab-nav-links.ab-open-links { right: 0; }
          .ab-dropdown-menu { position: static; transform: none; margin-top: 4px; box-shadow: none; border-color: rgba(215,173,90,0.2); background: rgba(255,255,255,0.04); }
        }
      `}</style>

      <nav className={`ab-navbar${scrolled ? ' ab-condensed' : ''}${mobileMenuOpen ? ' ab-mobile-menu-open' : ''}`} aria-label="Main navigation">
        <Link className="ab-brand" to="/" aria-label="PSGPS Alumni home">
          <img src={psgpsLogo} alt="PSG Public Schools" />
          <span>PSGPS Alumni</span>
        </Link>

        <div className={`ab-nav-links${mobileMenuOpen ? ' ab-open-links' : ''}`} id="primary-navigation">
          <Link to="/" onClick={closeMobileMenu}>Home</Link>
          <Link to="/leadership" onClick={closeMobileMenu}>Leadership</Link>
          <Link to="/newsletter" onClick={closeMobileMenu}>Newsletter</Link>
          <Link to="/events" onClick={closeMobileMenu}>Events</Link>
          <Link to="/gallery" onClick={closeMobileMenu}>Gallery</Link>

          <div className="ab-dropdown" ref={alumniMenuRef}>
            <button
              className="ab-dropdown-toggle"
              type="button"
              aria-expanded={alumniMenuOpen}
              aria-controls="alumni-menu"
              onClick={() => setAlumniMenuOpen((isOpen) => !isOpen)}
            >
              Find alumni <ChevronDown size={14} aria-hidden="true" />
            </button>
            {alumniMenuOpen && (
              <div className="ab-dropdown-menu" id="alumni-menu">
                <Link to="/alumni/directory" onClick={closeMobileMenu}>
                  <Users size={16} aria-hidden="true" />
                  Directory
                </Link>
                <Link to="/alumni/map" onClick={closeMobileMenu}>
                  <Map size={16} aria-hidden="true" />
                  Alumni map
                </Link>
              </div>
            )}
          </div>

          <Link to="/contact" onClick={closeMobileMenu}>Contact</Link>

          {user?.role === 'admin' || user?.role === 'superadmin' ? (
            <div className="ab-dropdown" ref={adminMenuRef}>
              <button
                className="ab-dropdown-toggle"
                type="button"
                aria-expanded={adminMenuOpen}
                aria-controls="admin-menu"
                onClick={() => setAdminMenuOpen((isOpen) => !isOpen)}
              >
                Admin <ChevronDown size={14} aria-hidden="true" />
              </button>
              {adminMenuOpen && (
                <div className="ab-dropdown-menu" id="admin-menu">
                  <Link to="/admin/dashboard" onClick={closeMobileMenu}>
                    <LayoutDashboard size={16} aria-hidden="true" />
                    Dashboard
                  </Link>
                  <Link to="/admin/events" onClick={closeMobileMenu}>
                    <Calendar size={16} aria-hidden="true" />
                    Events
                  </Link>
                  <Link to="/admin/newsletters" onClick={closeMobileMenu}>
                    <NewspaperIcon size={16} aria-hidden="true" />
                    Newsletter
                  </Link>
                  <Link to="/admin/users" onClick={closeMobileMenu}>
                    <Users size={16} aria-hidden="true" />
                    Alumni management
                  </Link>
                  <Link to="/admin/reports" onClick={closeMobileMenu}>
                    <Map size={16} aria-hidden="true" />
                    Reports
                  </Link>
                </div>
              )}
            </div>
          ) : null}
        </div>

        <div className="ab-actions">
          {user ? (
            <div style={{ position: "relative" }} ref={userMenuRef}>
              <button className="ab-user-btn" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                <div className="ab-avatar">
                  {user.firstName?.[0]}
                  {user.lastName?.[0]}
                </div>
                <div className="ab-user-name">{user.firstName || user.name}</div>
                <ChevronDown size={13} className={`ab-chevron ${userMenuOpen ? "ab-open" : ""}`} />
              </button>

              {userMenuOpen && (
                <div className="ab-user-dropdown">
                  <div className="ab-dropdown-bar" />
                  <div className="ab-ud-header">
                    <div className="ab-ud-label">Signed in as</div>
                    <div className="ab-ud-name">{user.firstName} {user.lastName}</div>
                    <div className="ab-ud-role">
                      {user.role === "admin" ? "Admin User" : user.role === "superadmin" ? "Super Admin" : "Alumni Member"}
                    </div>
                  </div>
                  <div style={{ padding: "6px 0" }}>
                    {user.role === "alumni" && (
                      <>
                        <NavLink to="/alumni/dashboard" onClick={() => setUserMenuOpen(false)} className="ab-ud-item">
                          <LayoutDashboardIcon size={14} />
                          Dashboard
                        </NavLink>
                        <NavLink to="/alumni/profile" onClick={() => setUserMenuOpen(false)} className="ab-ud-item">
                          <User size={14} />
                          My Profile
                        </NavLink>
                        <NavLink to="/alumni/donations" onClick={() => setUserMenuOpen(false)} className="ab-ud-item">
                          <Heart size={14} />
                          My Donations
                        </NavLink>
                      </>
                    )}
                    {(user.role === "admin" || user.role === "superadmin") && (
                      <>
                        <div className="ab-ud-divider" />
                        <NavLink to="/admin/dashboard" onClick={() => setUserMenuOpen(false)} className="ab-ud-item">
                          <LayoutDashboard size={14} />
                          Admin Dashboard
                        </NavLink>
                        <NavLink to="/admin/events" onClick={() => setUserMenuOpen(false)} className="ab-ud-item">
                          <Calendar size={14} />
                          Manage Events
                        </NavLink>
                        <NavLink
                          to="/admin/newsletters"
                          onClick={() => setUserMenuOpen(false)}
                          className="ud-item"
                        >
                          <NewspaperIcon size={14} />
                          NewsLetter
                        </NavLink>

                        <NavLink to="/admin/users" onClick={() => setUserMenuOpen(false)} className="ab-ud-item">
                          <Users size={14} />
                          Alumni Management
                        </NavLink>
                        {user?.role === 'superadmin' && (
                          <NavLink to="/admin/reports" onClick={() => setUserMenuOpen(false)} className="ab-ud-item">
                            <FileText size={14} />
                            Reports
                          </NavLink>
                        )}
                      </>
                    )}
                    <div className="ab-ud-divider" />
                    <button onClick={handleLogout} className="ab-ud-item ab-danger">
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link className="ab-sign-in" to="/alumni/login">Sign in</Link>
              <Link className="ab-join" to="/alumni/register">Join now</Link>
            </>
          )}
          <button
            className="ab-menu-toggle"
            type="button"
            aria-expanded={mobileMenuOpen}
            aria-controls="primary-navigation"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
          >
            {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </nav>
    </>
  )
}

export default SiteNavbar
