import { useState } from "react";
import { CheckCircle, Clock3, Mail, MapPin, Phone, Send } from "lucide-react";
import { Link } from "react-router-dom";
import SiteNavbar from "../components/SiteNavbar";
import usePageTitle from "../hooks/usePageTitle";

const contactDetails = [
  { icon: MapPin, label: "Visit us", value: <>PSG Public Schools<br />Avanashi Road, Peelamedu<br />Coimbatore - 641004, Tamil Nadu</> },
  { icon: Phone, label: "Call us", value: <><a href="tel:+914224344522">0422 4344522</a><br /><a href="tel:+914224344420">0422 4344420</a></> },
  { icon: Mail, label: "Write to us", value: <a href="mailto:principal@psgps.edu.in">principal@psgps.edu.in</a> },
  { icon: Clock3, label: "Office hours", value: <>Monday - Friday<br />9:00 AM - 5:00 PM</> },
];

function ContactPage() {
  usePageTitle("Contact Us");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setSent(false);
  };

  const submitForm = (event) => {
    event.preventDefault();
    const body = `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`;
    window.location.href = `mailto:principal@psgps.edu.in?subject=${encodeURIComponent(form.subject || "PSGPS Alumni enquiry")}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <div className="contact-page">
      <SiteNavbar />
      <header className="contact-hero-new">
        <span className="contact-kicker">PSGPS Alumni Association</span>
        <h1>Let&apos;s stay connected.</h1>
        <p>Whether you are reconnecting with the school, looking for your alumni community, or simply want to say hello, we would love to hear from you.</p>
      </header>

      <main className="contact-main">
        <section className="contact-intro">
          <div><span className="contact-kicker">Get in touch</span><h2>Strong roots.<br /><em>Open doors.</em></h2></div>
          <p>Reach the PSG Public Schools team directly or send us a note through the form. We will route your message to the right person.</p>
        </section>

        <section className="contact-layout">
          <form className="contact-form-new" onSubmit={submitForm}>
            <div className="contact-form-heading"><span className="contact-kicker">Send a message</span><h2>How can we help?</h2></div>
            <div className="contact-fields">
              <label>Name<input name="name" value={form.name} onChange={updateField} required placeholder="Your name" /></label>
              <label>Email<input name="email" type="email" value={form.email} onChange={updateField} required placeholder="you@example.com" /></label>
              <label className="contact-field-wide">Subject<input name="subject" value={form.subject} onChange={updateField} placeholder="What would you like to know?" /></label>
              <label className="contact-field-wide">Message<textarea name="message" value={form.message} onChange={updateField} required placeholder="Write your message here..." rows="5" /></label>
            </div>
            <button className="contact-submit" type="submit"><Send size={16} /> Send enquiry</button>
            {sent && <p className="contact-sent"><CheckCircle size={16} /> Your email app should open with the enquiry ready to send.</p>}
          </form>

          <div className="contact-side">
            <div className="contact-details-grid">{contactDetails.map(({ icon: Icon, label, value }) => <article key={label}><span className="contact-icon"><Icon size={17} /></span><div><b>{label}</b><p>{value}</p></div></article>)}</div>
            <div className="contact-map"><div className="contact-map-heading"><span className="contact-kicker">Find the school</span><a href="https://www.google.com/maps/place/PSG+Public+Schools/@11.0242327,77.0066683,15z" target="_blank" rel="noreferrer">Open in Maps &#8599;</a></div><iframe title="PSG Public Schools location" src="https://www.google.com/maps?q=PSG%20Public%20Schools%20Coimbatore&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>
          </div>
        </section>
      </main>

      <footer className="contact-footer"><p>Ready to reconnect with the community?</p><Link to="/alumni/register">Join the alumni network <span aria-hidden="true">&#8594;</span></Link></footer>
    </div>
  );
}

export default ContactPage;
