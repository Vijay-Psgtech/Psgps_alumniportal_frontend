import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Images } from "lucide-react";
import SiteNavbar from "../components/SiteNavbar";
import usePageTitle from "../hooks/usePageTitle";
import { albumsAPI, API_BASE } from "../services/api";
import { galleryAlbums } from "../content/data/EventsGalleryData";

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

function LocalGalleryPage() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  usePageTitle("Alumni Gallery");

  useEffect(() => {
    const loadAlbums = async () => {
      try {
        const response = await albumsAPI.getAll();
        const data = Array.isArray(response?.data?.data)
          ? response.data.data
          : Array.isArray(response?.data) ? response.data : [];

        const source = data.length ? data : galleryAlbums;

        setAlbums(
          source.map((album) => ({
            ...album,
            id: album._id || album.id || album.slug,
            slug: album.slug || slugify(album.title) || album._id || album.id,
            cover: album.coverImage || album.images?.[0] || album.cover || "",
          })),
        );
      } catch (error) {
        console.error("Failed to load albums:", error);
        setAlbums(
          galleryAlbums.map((album) => ({
            ...album,
            id: album.slug,
            slug: album.slug,
            cover: album.cover || album.images?.[0] || "",
          })),
        );
      } finally {
        setLoading(false);
      }
    };

    loadAlbums();
  }, []);

  return (
    <div className="media-page">
      <SiteNavbar />
      <header className="media-hero media-hero-gallery">
        <span className="media-kicker">From the archives</span>
        <h1>Moments worth remembering.</h1>
        <p>A visual record of the people, places, and celebrations that keep PSGPS connected.</p>
      </header>
      <main className="media-content">
        <div className="media-section-heading"><div><span className="media-kicker">The gallery</span><h2>Our shared memories</h2></div><p>Explore each album to see the full story behind the gathering.</p></div>

        {loading ? (
          <div className="album-list">
            {[...Array(3)].map((_, index) => (
              <div className="album-card" key={`album-skeleton-${index}`} style={{ background: '#e2e8f0', minHeight: 220 }} />
            ))}
          </div>
        ) : albums.length === 0 ? (
          <p className="media-empty-state">No gallery albums are available right now.</p>
        ) : (
          <div className="album-list">
            {albums.map((album) => (
              <Link className="album-card" to={`/gallery/${album.slug || album.id}`} key={album.id || album.slug}>
                <img src={imageUrl(album.cover)} alt={album.title} loading="lazy" />
                <div><span className="media-tag"><Images size={13} /> {(album.images || []).length || album.photos || 0} photos</span><h3>{album.title}</h3><p>{album.date}</p></div><span className="album-arrow"><ArrowUpRight size={18} /></span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default LocalGalleryPage;
