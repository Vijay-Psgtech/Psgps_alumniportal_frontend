import { useState } from "react";
import { CheckCircle, Clock3, Mail, MapPin, Phone, Send } from "lucide-react";
import { Link } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";
import { contactAPI } from "../services/api";

const contactDetails = [
  { icon: MapPin, label: "Visit us", value: <>PSG Public Schools<br />Avanashi Road, Peelamedu<br />Coimbatore - 641004, Tamil Nadu</> },
  { icon: Phone, label: "Call us", value: <><a href="tel:+914224344522">0422 4344522</a><br /><a href="tel:+914224344420">0422 4344420</a></> },
  { icon: Mail, label: "Write to us", value: <a href="mailto:alumni@psgps.edu.in">alumni@psgps.edu.in</a> },
  { icon: Clock3, label: "Office hours", value: <>Monday - Friday<br />9:00 AM - 5:00 PM</> },
];

function ContactPage() {
  usePageTitle("Contact Us");
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: ""
    }));
  };

   const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!form.email.includes("@")) newErrors.email = "Please enter a valid email";
    if (!form.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        payload.append(key, value);
      });
      setIsLoading(true);
      await contactAPI.submitMessage(payload);
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 3000);
    }
    catch (error) {
      console.error("Error submitting contact form:", error);
      alert("An error occurred while sending your message. Please try again later.");
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="contact-page">
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
          <form className="contact-form-new" onSubmit={handleSubmit}>
            <div className="contact-form-heading"><span className="contact-kicker">Send a message</span><h2>How can we help?</h2></div>
            <div className="contact-fields">
              <label>Name<input name="name" value={form.name} onChange={updateField} required placeholder="Your name" /></label>
              <label>Email<input name="email" type="email" value={form.email} onChange={updateField} required placeholder="you@example.com" /></label>
              <label>Phone<input name="phone" value={form.phone} onChange={updateField} placeholder="Your phone number" /></label>
              <label className="contact-field-wide">Subject<input name="subject" value={form.subject} onChange={updateField} placeholder="What would you like to know?" /></label>
              <label className="contact-field-wide">Message<textarea name="message" value={form.message} onChange={updateField} required placeholder="Write your message here..." rows="5" /></label>
            </div>
            {Object.keys(errors).length > 0 && <div className="contact-errors"><ul>{Object.entries(errors).map(([field, error]) => <li key={field}>{error}</li>)}</ul></div>}
            <button type="submit" className="contact-submit" disabled={isLoading}>
                <Send size={14} />
                {isLoading ? "Sending..." : "Send enquiry"}
              </button>
            {submitted && <p className="contact-sent"><CheckCircle size={16} /> Message sent successfully!</p>}
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
