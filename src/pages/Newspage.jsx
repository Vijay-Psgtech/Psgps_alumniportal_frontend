import React, { useState, useEffect } from "react";
import { Search, Calendar, Share2, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { newsLetterAPI, API_BASE } from "../services/api";
import { Link } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";


const NewsPage = () => {
  const [newsData, setNewsData] = useState([]);
  usePageTitle("News & Updates");

  // Now use the defined newsData in state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Posts");
  const [filteredNews, setFilteredNews] = useState(newsData);

  // Categories sidebar
  const categories = [
    { id: "all", label: "All Posts", icon: "📰" },
    { id: "newsletters", label: "Newsletters", icon: "📬" },
    { id: "alumni-stories", label: "Alumni Stories", icon: "👥" },
    { id: "institute-updates", label: "Institute Updates", icon: "🏫" },
    { id: "events", label: "Events", icon: "🎯" },
    { id: "accolades", label: "Accolades/Accreditations", icon: "🏆" },
  ];

  // Fetch news data from API on component mount
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await newsLetterAPI.getAll();
        setNewsData(response.data.data);
        setFilteredNews(response.data.data);
      } catch (error) {
        console.error("Error fetching news data:", error);
      }
    };

    fetchNews();
  }, []);

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    filterNews(query, selectedCategory);
  };

  // Handle category filter
  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    filterNews(searchQuery, category);
  };

  // Filter news based on search and category
  const filterNews = (query, category) => {
    let filtered = newsData;

    if (category !== "All Posts") {
      filtered = filtered.filter(
        (news) => news.category === category || news.tags.includes(category),
      );
    }

    if (query.trim()) {
      filtered = filtered.filter(
        (news) =>
          news.title.toLowerCase().includes(query.toLowerCase()) ||
          news.description.toLowerCase().includes(query.toLowerCase()),
      );
    }

    setFilteredNews(filtered);
  };

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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        /* News Page Container */
        .news-page {
          min-height: 100vh;
          background: #f8f9fa;
          padding: 100px 60px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .news-container {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 40px;
        }

        /* Sidebar */
        .news-sidebar {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* Search Box */
        .search-box {
          display: flex;
          gap: 0;
          border-radius: 8px;
          overflow: hidden;
          background: white;
          box-shadow: 0 4px 12px rgba(31, 41, 55, 0.1);
        }

        .search-box input {
          flex: 1;
          padding: 14px 18px;
          border: none;
          font-size: 14px;
          color: #1f2937;
          background: white;
          font-family: inherit;
        }

        .search-box input::placeholder {
          color: #9ca3af;
        }

        .search-box input:focus {
          outline: none;
          background: #fafbfc;
        }

        .search-btn {
          padding: 0 18px;
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          border: none;
          color: white;
          cursor: pointer;
          font-weight: 600;
          transition: all 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .search-btn:hover {
          transform: translateX(-2px);
          box-shadow: 0 8px 20px rgba(220, 38, 38, 0.3);
        }

        /* Categories Section */
        .categories-section {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(31, 41, 55, 0.1);
        }

        .categories-title {
          padding: 20px 18px;
          font-size: 14px;
          font-weight: 700;
          color: #1f2937;
          border-bottom: 2px solid #e5e7eb;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .category-list {
          list-style: none;
        }

        .category-item {
          border-bottom: 1px solid #e5e7eb;
          transition: all 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .category-item:last-child {
          border-bottom: none;
        }

        .category-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 18px;
          color: #4b5563;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: all 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
          background: white;
          border: none;
          width: 100%;
          text-align: left;
          font-family: inherit;
        }

        .category-link:hover {
          background: #f3f4f6;
          color: #0052cc;
          padding-left: 22px;
        }

        .category-link.active {
          background: #eff6ff;
          color: #0052cc;
          font-weight: 600;
          border-left: 4px solid #dc2626;
          padding-left: 14px;
        }

        /* Main Content */
        .news-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* News Card */
        .news-card {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(31, 41, 55, 0.08);
          transition: all 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
          display: grid;
          grid-template-columns: 1fr;
        }

        .news-card:hover {
          box-shadow: 0 8px 20px rgba(31, 41, 55, 0.12);
          transform: translateY(-4px);
        }

        .news-card.with-image {
          grid-template-columns: 280px 1fr;
        }

        .news-image {
          width: 100%;
          height: 100%;
          min-height: 200px;
          object-fit: cover;
          background: #e5e7eb;
        }

        .news-body {
          padding: 28px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .news-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 12px;
          font-size: 13px;
        }

        .news-date {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #6b7280;
          font-weight: 500;
        }

        .news-share {
          cursor: pointer;
          color: #9ca3af;
          transition: color 300ms;
        }

        .news-share:hover {
          color: #0052cc;
        }

        .news-title {
          font-size: 18px;
          font-weight: 700;
          color: #0052cc;
          margin-bottom: 12px;
          line-height: 1.4;
          text-decoration: none;
          display: block;
          transition: color 300ms;
          cursor: pointer;
        }

        .news-title:hover {
          color: #1a73e8;
          text-decoration: underline;
        }

        .news-excerpt {
          font-size: 14px;
          color: #6b7280;
          -webkit-line-clamp: 2;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .news-footer {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .news-tag {
          display: inline-block;
          padding: 6px 12px;
          background: #eff6ff;
          color: #0052cc;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .news-author {
          font-size: 12px;
          color: #9ca3af;
          margin-left: auto;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #6b7280;
        }

        .empty-state-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .empty-state-text {
          font-size: 16px;
          color: #4b5563;
        }

        /* Responsive */
        @media(max-width: 1024px) {
          .news-container {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .news-card.with-image {
            grid-template-columns: 240px 1fr;
          }

          .news-sidebar {
            order: 2;
          }

          .news-content {
            order: 1;
          }
        }

        @media(max-width: 768px) {
          .news-page {
            padding: 40px 16px;
          }

          .news-container {
            gap: 24px;
          }

          .news-card.with-image {
            grid-template-columns: 200px 1fr;
          }

          .news-body {
            padding: 20px;
          }

          .news-title {
            font-size: 16px;
          }

          .news-excerpt {
            font-size: 13px;
          }
        }

        @media(max-width: 640px) {
          .news-page {
            padding: 30px 12px;
          }

          .news-container {
            grid-template-columns: 1fr;
          }

          .news-card.with-image {
            grid-template-columns: 1fr;
          }

          .news-image {
            min-height: 180px;
          }

          .news-body {
            padding: 16px;
          }

          .news-title {
            font-size: 15px;
          }

          .search-box {
            margin-bottom: 16px;
          }
        }
      `}</style>

      <div className="news-page">
        <motion.div
          className="news-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Sidebar */}
          <motion.aside className="news-sidebar" variants={itemVariants}>
            {/* Search Box */}
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by title"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <button
                className="search-btn"
                onClick={() => handleSearch(searchQuery)}
              >
                <Search size={20} />
              </button>
            </div>

            {/* Categories */}
            <div className="categories-section">
              <div className="categories-title">Categories</div>
              <ul className="category-list">
                {categories.map((category) => (
                  <li key={category.id} className="category-item">
                    <button
                      className={`category-link ${
                        selectedCategory === category.label ? "active" : ""
                      }`}
                      onClick={() => handleCategoryFilter(category.label)}
                    >
                      <span>{category.icon}</span>
                      <span>{category.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </motion.aside>

          {/* Main Content */}
          <motion.main className="news-content" variants={containerVariants}>
            {filteredNews.length > 0 ? (
              filteredNews.map((news, idx) => {
                const imageSrc = news.imageUrl
                  ? `${API_BASE}/${news.imageUrl}`
                  : news.image;
                const hasImage = Boolean(imageSrc);
                return (
                  <motion.article
                    key={news._id || news.id || idx}
                    className={`news-card ${hasImage ? "with-image" : ""}`}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {hasImage && (
                      <img
                        src={imageSrc}
                        alt={news.title}
                        className="news-image"
                      />
                    )}
                    <div className="news-body">
                      <div>
                        <div className="news-header">
                          <span className="news-date">
                            <Calendar size={16} />
                            {new Date(news.date).toLocaleString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                          <span className="news-share">
                            <Share2 size={18} />
                          </span>
                        </div>
                        <Link
                          to={`/news/${news._id || news.id}`}
                          className="news-title"
                        >
                          <h2 className="news-title">{news.title}</h2>
                        </Link>

                        <p className="news-excerpt">{news.description}</p>
                      </div>

                      <div className="news-footer">
                        <span className="news-tag">{news.category}</span>
                        <span className="news-author">{news.author}</span>
                      </div>
                    </div>
                  </motion.article>
                );
              })
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">📭</div>
                <p className="empty-state-text">
                  No posts found. Try adjusting your filters or search query.
                </p>
              </div>
            )}
          </motion.main>
        </motion.div>
      </div>
    </>
  );
};

export default NewsPage;
