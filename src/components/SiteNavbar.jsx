import psgpsLogo from '../assets/ALUMNI LOGO.jpg'
import { useState } from 'react'
import { ChevronDown, Map, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

function SiteNavbar() {
  const [alumniMenuOpen, setAlumniMenuOpen] = useState(false)

  return (
    <nav className="nav-bar" aria-label="Main navigation">
      <Link className="brand" to="/" aria-label="PSGPS Alumni home">
        <img src={psgpsLogo} alt="PSG Public Schools" />
        <span>PSGPS ALUMNI</span>
      </Link>
      <div className="nav-links">
        <Link to="/about">About us</Link>
        <Link to="/committee">Committee</Link>
        <Link to="/events">Events</Link>
        <Link to="/gallery">Gallery</Link>
        <Link to="/leadership">Leadership</Link>
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
              <Link to="/alumni/directory" onClick={() => setAlumniMenuOpen(false)}>
                <Users size={16} aria-hidden="true" />
                Directory
              </Link>
              <Link to="/alumni/map" onClick={() => setAlumniMenuOpen(false)}>
                <Map size={16} aria-hidden="true" />
                Alumni map
              </Link>
            </div>
          )}
        </div>
        <Link to="/contact">Contact</Link>
      </div>
      <div className="nav-actions">
        <Link className="nav-sign-in" to="/alumni/login">Sign in</Link>
        <Link className="nav-join" to="/alumni/register">Join now</Link>
      </div>
    </nav>
  )
}

export default SiteNavbar
