import schoolImage from '../assets/SCHOOL BUILDING PICTURE.png'
import psgpsLogo from '../assets/PSGPS LOGO IN COREL.jpg'

function HeroBanner() {
  return (
    <section className="hero-banner" id="home" style={{ '--building-image': `url("${schoolImage}")` }}>
      <div className="hero-copy">
        <img className="hero-brand-logo" src={psgpsLogo} alt="PSG Public Schools" />
        <span className="eyebrow">Welcome to excellence</span>
        <h1>Together<br />we thrive</h1>
        <p>Join the <strong>PSGPS Alumni</strong> community - reconnect,<br className="desktop-break" /> collaborate, inspire, and create meaningful<br className="desktop-break" /> opportunities for lifelong success.</p>
        <div className="hero-stats"><div><span className="stat-icon people-stat" aria-hidden="true">&#9673;</span><strong>900<span>+</span></strong><small>Alumni Connected</small></div><div><span className="stat-icon globe-stat" aria-hidden="true">&#8853;</span><strong>15<span>+</span></strong><small>Countries</small></div><div><span className="stat-icon calendar-stat" aria-hidden="true">&#9633;</span><strong>5<span>+</span></strong><small>Annual Events</small></div></div>
        <div className="hero-actions"><a className="primary-button" href="#join">Join now <span aria-hidden="true">&#8594;</span></a><a className="outline-button" href="#about">Learn more <span aria-hidden="true">&#8594;</span></a></div>
      </div>
      <div className="hero-signoff">PSGPS ALUMNI <span>Strong roots. Shared journey. Limitless impact.</span></div>
    </section>
  )
}

export default HeroBanner
