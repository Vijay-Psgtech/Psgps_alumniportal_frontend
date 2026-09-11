import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import SiteNavbar from "../components/SiteNavbar";
import usePageTitle from "../hooks/usePageTitle";
import { albumsAPI, API_BASE } from "../services/api";
import { galleryAlbums, findAlbum } from "../content/data/EventsGalleryData";

const imageUrl = (value) => {
  if (!value) return "";
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (/^(https?:)?\/\//.test(trimmed) || trimmed.startsWith("data:") || trimmed.startsWith("/")) return trimmed;
  return `${API_BASE}/${trimmed.replace(/\\/g, "/")}`;
};

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "album";

function GalleryDetailPage() {
  const { slug } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAlbum = async () => {
      try {
        const response = await albumsAPI.getAll();
        const data = Array.isArray(response?.data?.data)
          ? response.data.data
          : Array.isArray(response?.data) ? response.data : [];

        const match = data.find((item) => {
          const itemSlug = item.slug || slugify(item.title) || item._id || item.id;
          return String(itemSlug) === String(slug) || String(item._id || item.id) === String(slug);
        });

        const localMatch = match || findAlbum(slug) || galleryAlbums.find((item) => (item.slug || slugify(item.title)) === slug);
        setAlbum(localMatch || null);
      } catch (error) {
        console.error("Failed to load album:", error);
        const localMatch = findAlbum(slug) || galleryAlbums.find((item) => (item.slug || slugify(item.title)) === slug);
        setAlbum(localMatch || null);
      } finally {
        setLoading(false);
      }
    };

    loadAlbum();
  }, [slug]);

  usePageTitle(album ? album.title : "Gallery");

  if (loading) {
    return (
      <div className="media-page">
        <SiteNavbar />
        <main className="media-empty"><h1>Loading gallery...</h1></main>
      </div>
    );
  }

  if (!album) return <NotFound />;

  return (
    <div className="media-page">
      <SiteNavbar />
      <main className="album-detail">
        <Link className="back-link" to="/gallery"><ArrowLeft size={15} /> Back to gallery</Link>
        <div className="album-heading"><span className="media-kicker">{album.event || "Community"}</span><h1>{album.title}</h1><p>{album.description || `A gallery of moments from ${album.title}.`}</p><div className="media-meta"><span><Calendar size={14} />{album.date}</span><span><MapPin size={14} />{album.venue || "PSGPS Campus"}</span></div></div>
        <div className="album-grid">{(album.images || []).map((image, index) => <img key={`${album.id || slug}-${index}`} src={imageUrl(image)} alt={`${album.title} moment ${index + 1}`} loading="lazy" />)}</div>
      </main>
    </div>
  );
}

function NotFound() {
  return <div className="media-page"><SiteNavbar /><main className="media-empty"><h1>Gallery not found</h1><Link to="/gallery">Back to gallery</Link></main></div>;
}

export default GalleryDetailPage;
