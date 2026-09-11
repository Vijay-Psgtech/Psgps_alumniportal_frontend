import psgpsLogo from '../assets/ALUMNI LOGO.jpg'
import { Link } from 'react-router-dom'

function SiteNavbar() {
  return (
    <nav className="nav-bar" aria-label="Main navigation">
      <Link className="brand" to="/" aria-label="PSGPS Alumni home">
        <img src={psgpsLogo} alt="PSG Public Schools" />
        <span>PSGPS ALUMNI</span>
      </Link>
      <div className="nav-links">
        <Link to="/#about">About us</Link>
        <Link to="/#community">Community</Link>
        <Link to="/events">Events</Link>
        <Link to="/gallery">Gallery</Link>
        <Link to="/leadership">Leadership</Link>
        <Link to="/#directory">Directory</Link>
        <Link to="/contact">Contact</Link>
      </div>
      <Link className="nav-join" to="/#join">Join now</Link>
    </nav>
  )
}

export default SiteNavbar
