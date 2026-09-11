import { Link } from 'react-router-dom'
import gopalakrishnanImage from '../assets/Banner/Patron1.jpg'
import alaguImage from '../assets/Banner/Picture1.png'

function LeadershipSection() {
  return (
    <section className="leaders-section" id="leaders">
      <div className="section-heading">
        <span className="section-pill">Meet our leadership</span>
        <h2>Visionary leaders shaping excellence</h2>
        <p>
          Guided by inspiring leaders committed to strengthening alumni connections,
          fostering opportunity, and building a vibrant community across generations.
        </p>
        <Link className="leadership-detail-link" to="/leadership">
          View the full leadership team <span aria-hidden="true">&#8594;</span>
        </Link>
      </div>

      <div className="leader-grid">
        <article className="leader-card leader-card-featured">
          <div className="leader-portrait">
            <img src={gopalakrishnanImage} alt="Mr. L. Gopalakrishnan" />
          </div>
          <div className="leader-detail">
            <span className="leader-label">Chief Patron · Institutional leadership</span>
            <h3>Mr. L. Gopalakrishnan</h3>
            <b>Managing Trustee · PSG &amp; Sons' Charities</b>
            <p>
              Guiding educational excellence and creating enduring opportunities for
              every generation of the PSG community.
            </p>
            <div className="leader-stat">
              <strong>25<span>+</span></strong>
              <small>Years of service</small>
            </div>
          </div>
        </article>

        <article className="leader-card">
          <div className="leader-portrait">
            <img src={alaguImage} alt="Mr. AlaguNachiappan S" />
          </div>
          <div className="leader-detail">
            <span className="leader-label">President · PSG Public Schools Alumni Association</span>
            <h3>Mr. AlaguNachiappan S</h3>
            <b>Connecting generations of excellence</b>
            <p>Dedicated to building stronger alumni networks, mentorship, and opportunity.</p>
            <div className="leader-stat">
              <strong>900<span>+</span></strong>
              <small>Alumni connected</small>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}

export default LeadershipSection
