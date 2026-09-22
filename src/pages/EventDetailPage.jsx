import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import SiteNavbar from "../components/SiteNavbar";
import usePageTitle from "../hooks/usePageTitle";
import { API_BASE, eventsAPI } from "../services/api";
import { alumniEvents, findEvent } from "../content/data/EventsGalleryData";

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
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

function EventDetailPage() {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const response = await eventsAPI.getById(slug);
        const selectedEvent = response?.data?.data || response?.data || null;
        if (selectedEvent) {
          setEvent({
            ...selectedEvent,
            id: selectedEvent._id || selectedEvent.id,
            cover: selectedEvent.imageUrl || selectedEvent.cover || selectedEvent.coverImage || "",
            formattedDate: formatDate(selectedEvent.date),
          });
          return;
        }

        const fallback = await eventsAPI.getAll();
        const list = Array.isArray(fallback?.data?.data)
          ? fallback.data.data
          : Array.isArray(fallback?.data) ? fallback.data : [];

        const match = list.find((item) =>
          String(item._id || item.id) === String(slug) ||
          (item.slug && String(item.slug) === String(slug)) ||
          (item.title && item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === String(slug).toLowerCase()),
        );

        const localMatch = match || findEvent(slug) || alumniEvents.find((item) => item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === String(slug).toLowerCase());

        setEvent(localMatch ? { ...localMatch, id: localMatch._id || localMatch.id || localMatch.slug, cover: localMatch.imageUrl || localMatch.cover || localMatch.coverImage || "", formattedDate: formatDate(localMatch.date) } : null);
      } catch (error) {
        console.error("Failed to load event:", error);
        const localMatch = findEvent(slug) || alumniEvents.find((item) => item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === String(slug).toLowerCase());
        setEvent(localMatch ? { ...localMatch, id: localMatch.slug, cover: localMatch.cover || localMatch.images?.[0], formattedDate: formatDate(localMatch.date) } : null);
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [slug]);

  usePageTitle(event ? event.title : "Event");

  if (loading) {
    return (
      <div className="media-page">
        <SiteNavbar />
        <main className="media-empty">
          <h1>Loading event...</h1>
        </main>
      </div>
    );
  }

  if (!event) return <NotFound />;

  return (
    <div className="media-page">
      <SiteNavbar />
      <main className="album-detail event-detail">
        <Link className="back-link" to="/events"><ArrowLeft size={15} /> Back to events</Link>
        <div className="album-heading"><span className="media-kicker">{event.category || "Community"}</span><h1>{event.title}</h1><p>{event.description}</p><div className="media-meta"><span><Calendar size={14} />{event.formattedDate}</span><span><MapPin size={14} />{event.venue}</span></div></div>
        <img className="event-detail-cover" src={imageUrl(event.cover)} alt={event.title} />
        <div className="event-detail-gallery">{(event.images || []).slice(1).map((image, index) => <img key={`${event.id || slug}-${index}`} src={imageUrl(image)} alt={`${event.title} highlight ${index + 1}`} loading="lazy" />)}</div>
        <Link className="media-card-link" to={`/gallery/${event.slug || event.id || slug}`}>View this event in the gallery <span aria-hidden="true">&#8594;</span></Link>
      </main>
    </div>
  );
}

function NotFound() {
  return <div className="media-page"><SiteNavbar /><main className="media-empty"><h1>Event not found</h1><Link to="/events">Back to events</Link></main></div>;
}

export default EventDetailPage;
