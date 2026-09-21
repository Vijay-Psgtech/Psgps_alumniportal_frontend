import psgpsLogo from '../assets/ALUMNI LOGO.jpg'
import { useState, useRef, useCallback } from 'react'
import { 
  ChevronDown, 
  Map, 
  Menu, 
  Users, 
  X, 
  LayoutDashboard, 
  Calendar, 
  LogOut,
  LayoutDashboardIcon,
  User,
  Heart,
  FileText
} from 'lucide-react'
import { Link, useNavigate, NavLink } from 'react-router-dom'
import { useAuth } from "../context/AuthContext";

function SiteNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate()
  const [alumniMenuOpen, setAlumniMenuOpen] = useState(false)
  const [adminMenuOpen, setAdminMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)


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
    <nav className="nav-bar" aria-label="Main navigation">
      <Link className="brand" to="/" aria-label="PSGPS Alumni home">
        <img src={psgpsLogo} alt="PSG Public Schools" />
        <span>PSGPS ALUMNI</span>
      </Link>

      <div className={`nav-links${mobileMenuOpen ? ' is-open' : ''}`} id="primary-navigation">
        {/* <Link to="/about" onClick={closeMobileMenu}>About us</Link>
        <Link to="/committee" onClick={closeMobileMenu}>Committee</Link> */}
        <Link to="/" onClick={closeMobileMenu}>Home</Link>
        <Link to="/leadership" onClick={closeMobileMenu}>Leadership</Link>
        <Link to="/newsletter" onClick={closeMobileMenu}>Newsletter</Link>
        <Link to="/events" onClick={closeMobileMenu}>Events</Link>
        <Link to="/gallery" onClick={closeMobileMenu}>Gallery</Link>
        <div className="nav-dropdown">
          <button
            className="nav-dropdown-toggle"
            type="button"
            aria-expanded={alumniMenuOpen}
            aria-controls="alumni-menu"
            onClick={() => setAlumniMenuOpen((isOpen) => !isOpen)}
          >
            Find Alumni <ChevronDown size={15} aria-hidden="true" />
          </button>
          {alumniMenuOpen && (
            <div className="nav-dropdown-menu" id="alumni-menu">
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
          // <Link to="/admin/dashboard" onClick={closeMobileMenu}>Admin Dashboard</Link>
          <div className="nav-dropdown">
            <button
              className="nav-dropdown-toggle"
              type="button"
              aria-expanded={adminMenuOpen}
              aria-controls="admin-menu"
              onClick={() => setAdminMenuOpen((isOpen) => !isOpen)}
            >
              Admin <ChevronDown size={15} aria-hidden="true" />
            </button>
            {adminMenuOpen && (
              <div className="nav-dropdown-menu" id="admin-menu">
                <Link to="/admin/dashboard" onClick={closeMobileMenu}>
                  <LayoutDashboard size={16} aria-hidden="true" />
                  Dashboard
                </Link>
                <Link to="/admin/events" onClick={closeMobileMenu}>
                  <Calendar size={16} aria-hidden="true" />
                  Events
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

      <div className="nav-actions">
        {user ? (
          <div style={{ position: "relative" }} ref={userMenuRef}>
            <button
              className="user-btn"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <div className="user-avatar">
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </div>
              <div>
                <div className="user-name">
                  {user.firstName || user.name}
                </div>
              </div>
              <ChevronDown
                size={13}
                className={`chevron-icon ${userMenuOpen ? "chevron-open" : ""}`}
              />
            </button>

            {userMenuOpen && (
              <div className="user-dropdown">
                <div className="dropdown-bar" />
                <div className="user-dropdown-header">
                  <div className="ud-label">Signed in as</div>
                  <div className="ud-name">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="ud-role">
                    {user.role === "admin"
                      ? "Admin User"
                      : user.role === "superadmin"
                        ? "Super Admin"
                        : "Alumni Member"}
                  </div>
                </div>
                <div style={{ padding: "6px 0" }}>
                  {user.role === "alumni" && (
                    <>
                      <NavLink
                        to="/alumni/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="ud-item"
                      >
                        <LayoutDashboardIcon size={14} />
                        Dashboard
                      </NavLink>

                      <NavLink
                        to="/alumni/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="ud-item"
                      >
                        <User size={14} />
                        My Profile
                      </NavLink>

                      <NavLink
                        to="/alumni/donations"
                        onClick={() => setUserMenuOpen(false)}
                        className="ud-item"
                      >
                        <Heart size={14} />
                        My Donations
                      </NavLink>
                    </>
                  )}
                  {(user.role === "admin" ||
                    user.role === "superadmin") && (
                      <>
                        <div className="ud-divider" />
                        <NavLink
                          to="/admin/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="ud-item"
                        >
                          <LayoutDashboard size={14} />
                          Admin Dashboard
                        </NavLink>
                        <NavLink
                          to="/admin/events"
                          onClick={() => setUserMenuOpen(false)}
                          className="ud-item"
                        >
                          <Calendar size={14} />
                          Manage Events
                        </NavLink>
                        <NavLink
                          to="/admin/users"
                          onClick={() => setUserMenuOpen(false)}
                          className="ud-item"
                        >
                          <Users size={14} />
                          Alumni Management
                        </NavLink>
                        {user?.role === 'superadmin' && (
                          <NavLink
                            to="/admin/reports"
                            onClick={() => setUserMenuOpen(false)}
                            className="ud-item"
                          >
                            <FileText size={14} />
                            Reports
                          </NavLink>
                        )}
                      </>
                    )}
                  <div className="ud-divider" />
                  <button onClick={handleLogout} className="ud-item danger">
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link className="nav-sign-in" to="/alumni/login">Sign in</Link>
            <Link className="nav-join" to="/alumni/register">Join now</Link>
          </>
        )}
        <button
          className="nav-menu-toggle"
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
  )
}

export default SiteNavbar
