import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, ArrowUpRight } from "lucide-react";
import SiteNavbar from "../components/SiteNavbar";
import usePageTitle from "../hooks/usePageTitle";
import { API_BASE, eventsAPI } from "../services/api";
import { alumniEvents } from "../content/data/EventsGalleryData";

const imageUrl = (value) => {
  if (!value) return "";
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (/^(https?:)?\/\//.test(trimmed) || trimmed.startsWith("data:") || trimmed.startsWith("/")) return trimmed;
  return `${API_BASE}/${trimmed.replace(/\\/g, "/")}`;
};

const formatDate = (value) => {
  if (!value) return "Date TBD";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  usePageTitle("Alumni Events");

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await eventsAPI.getAll();
        const data = Array.isArray(response?.data?.data)
          ? response.data.data
          : Array.isArray(response?.data) ? response.data : [];

        const source = data.length ? data : alumniEvents;

        setEvents(
          source.map((event) => ({
            ...event,
            id: event._id || event.id || event.slug,
            slug: event.slug || event._id || event.id,
            cover: event.imageUrl || event.cover || event.coverImage || "",
            formattedDate: formatDate(event.date),
          })),
        );
      } catch (error) {
        console.error("Failed to load events:", error);
        setEvents(
          alumniEvents.map((event) => ({
            ...event,
            id: event.slug,
            slug: event.slug,
            formattedDate: formatDate(event.date),
          })),
        );
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  return (
    <div className="media-page">
      <SiteNavbar />
      <header className="media-hero">
        <span className="media-kicker">PSGPS Alumni Association</span>
        <h1>Events that bring us together.</h1>
        <p>Reconnect, celebrate, and make new memories with the alumni community.</p>
      </header>
      <main className="media-content">
        <div className="media-section-heading">
          <div><span className="media-kicker">The calendar</span><h2>What&apos;s happening</h2></div>
          <p>From annual meets to sporting celebrations, every gathering is part of our shared story.</p>
        </div>

        {loading ? (
          <div className="media-grid">
            {[...Array(3)].map((_, index) => (
              <article className="media-card" key={`skeleton-${index}`}>
                <div className="media-card-image" style={{ background: '#e2e8f0', minHeight: 220 }} />
              </article>
            ))}
          </div>
        ) : events.length === 0 ? (
          <p className="media-empty-state">No events are available right now.</p>
        ) : (
          <div className="media-grid">
            {events.map((event) => (
              <article className="media-card" key={event.id || event.slug}>
                <Link className="media-card-image" to={`/events/${event.id || event.slug}`}>
                  <img src={imageUrl(event.cover)} alt={event.title} loading="lazy" />
                  <span><ArrowUpRight size={17} /></span>
                </Link>
                <div className="media-card-body">
                  <span className="media-tag">{event.category || "Community"}</span>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <div className="media-meta"><span><Calendar size={14} />{event.formattedDate}</span><span><MapPin size={14} />{event.venue}</span></div>
                  <Link className="media-card-link" to={`/events/${event.id || event.slug}`}>View event details <span aria-hidden="true">&#8594;</span></Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default EventsPage;
