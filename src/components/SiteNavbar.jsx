import psgpsLogo from '../assets/ALUMNI LOGO.jpg'
import { useState } from 'react'
import { ChevronDown, Map, Menu, Users, X } from 'lucide-react'
import { Link } from 'react-router-dom'

function SiteNavbar() {
  const [alumniMenuOpen, setAlumniMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
    setAlumniMenuOpen(false)
  }

  return (
    <nav className="nav-bar" aria-label="Main navigation">
      <Link className="brand" to="/" aria-label="PSGPS Alumni home">
        <img src={psgpsLogo} alt="PSG Public Schools" />
        <span>PSGPS ALUMNI</span>
      </Link>
      
      <div className={`nav-links${mobileMenuOpen ? ' is-open' : ''}`} id="primary-navigation">
        <Link to="/about" onClick={closeMobileMenu}>About us</Link>
        <Link to="/committee" onClick={closeMobileMenu}>Committee</Link>
        <Link to="/events" onClick={closeMobileMenu}>Events</Link>
        <Link to="/gallery" onClick={closeMobileMenu}>Gallery</Link>
        <Link to="/leadership" onClick={closeMobileMenu}>Leadership</Link>
        <div className="nav-dropdown">
          <button
            className="nav-dropdown-toggle"
            type="button"
            aria-expanded={alumniMenuOpen}
            aria-controls="alumni-menu"
            onClick={() => setAlumniMenuOpen((isOpen) => !isOpen)}
          >
            Alumni <ChevronDown size={15} aria-hidden="true" />
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
      </div>

      <div className="nav-actions">
        <Link className="nav-sign-in" to="/alumni/login">Sign in</Link>
        <Link className="nav-join" to="/alumni/register">Join now</Link>
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
