import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Calendar,
  Check,
  CircleAlert,
  Search,
  Share2,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { newsLetterAPI, API_BASE } from "../services/api";
import { Link } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";

const categories = [
  "All Posts",
  "Newsletters",
  "Alumni Stories",
  "Institute Updates",
  "Events",
  "Accolades/Accreditations",
];

const formatDate = (value) => {
  if (!value) return "Date to be announced";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

const getImageUrl = (value) => {
  if (!value || typeof value !== "string") return "";
  const normalized = value.trim().replace(/\\/g, "/");
  if (/^(https?:)?\/\//.test(normalized) || normalized.startsWith("data:") || normalized.startsWith("/")) {
    return normalized;
  }
  return `${API_BASE}/${normalized}`;
};

const NewsPage = () => {
  const [newsData, setNewsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Posts");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [copiedId, setCopiedId] = useState("");
  usePageTitle("News & Updates");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        setLoadError("");
        const response = await newsLetterAPI.getAll();
        const data = Array.isArray(response?.data?.data)
          ? response.data.data
          : Array.isArray(response?.data) ? response.data : [];
        setNewsData(data);
      } catch (error) {
        console.error("Error fetching news data:", error);
        setLoadError("We could not load the latest stories. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  const filteredNews = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return newsData.filter((news) => {
      const tags = Array.isArray(news.tags) ? news.tags : [];
      const matchesCategory = selectedCategory === "All Posts"
        || news.category === selectedCategory
        || tags.includes(selectedCategory);
      const searchableText = `${news.title || ""} ${news.description || ""}`.toLowerCase();
      return matchesCategory && (!query || searchableText.includes(query));
    });
  }, [newsData, searchQuery, selectedCategory]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const shareStory = async (news) => {
    const url = `${window.location.origin}/news/${news._id || news.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: news.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopiedId(news._id || news.id);
        window.setTimeout(() => setCopiedId(""), 1800);
      }
    } catch (error) {
      if (error.name !== "AbortError") console.error("Unable to share story:", error);
    }
  };

  const renderStory = (news, index, featured = false) => {
    const id = news._id || news.id || index;
    const imageSrc = getImageUrl(news.imageUrl || news.image);
    return (
      <motion.article
        key={id}
        className={`news-story ${featured ? "news-story-featured" : ""}`}
        variants={itemVariants}
      >
        {imageSrc ? (
          <Link className="news-story-image" to={`/news/${id}`} aria-label={`Read ${news.title}`}>
            <img src={imageSrc} alt="" loading={featured ? "eager" : "lazy"} />
            <span className="news-story-image-action"><ArrowUpRight size={18} /></span>
          </Link>
        ) : (
          <Link className="news-story-image news-story-image-empty" to={`/news/${id}`} aria-label={`Read ${news.title}`}>
            <span>PSGPS</span>
          </Link>
        )}
        <div className="news-story-body">
          <div className="news-story-meta">
            <span className="news-tag">{news.category || "Community"}</span>
            <span><Calendar size={14} /> {formatDate(news.date)}</span>
          </div>
          <Link to={`/news/${id}`} className="news-story-title">{news.title || "Untitled story"}</Link>
          <p>{news.description || "Read the latest from the PSGPS alumni community."}</p>
          <div className="news-story-footer">
            <span className="news-author">{news.author || "PSGPS Alumni Association"}</span>
            <button className="news-share-button" type="button" onClick={() => shareStory(news)} aria-label={`Share ${news.title}`}>
              {copiedId === id ? <Check size={15} /> : <Share2 size={15} />}
              <span>{copiedId === id ? "Copied" : "Share"}</span>
            </button>
          </div>
        </div>
      </motion.article>
    );
  };

  return (
    <div className="news-page">
      <header className="news-hero">
        <div className="news-hero-copy">
          <span className="media-kicker">The alumni journal</span>
          <h1>Stories from our shared journey.</h1>
          <p>News, milestones, and ideas from the people who make the PSGPS community what it is.</p>
        </div>
        <div className="news-hero-mark" aria-hidden="true"><span>PSGPS</span><b>NEWS</b></div>
      </header>

      <main className="news-content">
        <div className="news-toolbar">
          <div>
            <span className="media-kicker">From the association</span>
            <h2>Latest updates</h2>
          </div>
          <p>Keep up with the people, places, and progress shaping our alumni network.</p>
        </div>

        <section className="news-filters" aria-label="News filters">
          <label className="news-search">
            <Search size={18} aria-hidden="true" />
            <span className="sr-only">Search stories</span>
            <input
              type="search"
              placeholder="Search stories"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            {searchQuery && <button type="button" onClick={() => setSearchQuery("")} aria-label="Clear search"><X size={16} /></button>}
          </label>
          <div className="news-filter-label"><SlidersHorizontal size={15} /> Filter by</div>
          <div className="news-category-list">
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                className={selectedCategory === category ? "is-active" : ""}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {isLoading ? (
          <div className="news-loading" aria-label="Loading stories">
            {[1, 2, 3].map((item) => <div className="news-skeleton" key={item} />)}
          </div>
        ) : loadError ? (
          <div className="news-empty"><CircleAlert size={28} /><h3>Something went wrong</h3><p>{loadError}</p></div>
        ) : filteredNews.length === 0 ? (
          <div className="news-empty"><Search size={28} /><h3>No stories found</h3><p>Try another search or choose a different category.</p></div>
        ) : (
          <motion.div className="news-results" variants={containerVariants} initial="hidden" animate="visible">
            {renderStory(filteredNews[0], 0, true)}
            <div className="news-story-grid">{filteredNews.slice(1).map((news, index) => renderStory(news, index + 1))}</div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default NewsPage;
