import React from 'react'
import psgpsLogo from '../assets/PSGPS LOGO IN COREL.jpg'

const Footer = () => {
  return (
    <footer className="site-footer" id="join">
      <div className="footer-brand"><img src={psgpsLogo} alt="PSG Public Schools" /><b>PSGPS ALUMNI</b><span>Strong roots. Shared journey. Limitless impact.</span></div>
      <div className="footer-contact"><span className="footer-kicker">Visit the school</span><address>PSG Public Schools<br />Avanashi Road, Peelamedu<br />Coimbatore - 641004, Tamil Nadu, India</address><a className="map-link" href="https://www.google.com/maps/place/PSG+Public+Schools/@11.0242327,77.0066683,15z/data=!4m5!3m4!1s0x0:0xc55f6cac5ba482c7!8m2!3d11.0237272!4d77.0048229" target="_blank" rel="noreferrer">Open school location <span aria-hidden="true">&#8599;</span></a></div>
      <div className="footer-map"><span className="footer-kicker">School location</span><iframe title="PSG Public Schools location" src="https://www.google.com/maps?q=PSG%20Public%20Schools%20Coimbatore&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>
      <div className="footer-contact"><span className="footer-kicker">Connect with us</span><a href="tel:+914224344522">0422 4344522</a><a href="tel:+914224344420">0422 4344420</a><a href="mailto:principal@psgps.edu.in">principal@psgps.edu.in</a><a className="primary-button" href="mailto:principal@psgps.edu.in">Join the community <span aria-hidden="true">&#8594;</span></a></div>
    </footer>
  )
}

export default Footer