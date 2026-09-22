import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { newsLetterAPI, API_BASE } from "../services/api";

const NewsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newsletter, setNewsletter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsletter = async () => {
      try {
        setIsLoading(true);
        const response = await newsLetterAPI.getById(id);
        const data = response.data?.data ?? response.data;
        setNewsletter(data);
      } catch (fetchError) {
        console.error("Error fetching newsletter details:", fetchError);
        setError("Unable to load newsletter details.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchNewsletter();
    }
  }, [id]);

  const normalizeImage = (path) => {
    if (!path) return null;
    const normalized = path.replace(/\\/g, "/");
    return normalized.startsWith("http") ? normalized : `${API_BASE}/${normalized}`;
  };

  const renderDescription = (text) => {
    if (!text) return null;
    return text
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line, index) => (
        <p key={index} className="detail-paragraph">
          {line}
        </p>
      ));
  };

  const imageSrc = newsletter?.imageUrl ? normalizeImage(newsletter.imageUrl) : null;

  return (
    <>
      <style>{`
        .detail-page {
          min-height: 100vh;
          background: #f6f8fb;
          padding: 60px 40px;
          font-family: 'Inter', system-ui, sans-serif;
          color: #111827;
        }

        .detail-container {
          max-width: 1180px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 30px;
        }

        .detail-card {
          background: #ffffff;
          border: 1px solid rgba(148, 163, 184, 0.16);
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 28px 80px rgba(15, 23, 42, 0.08);
        }

        .detail-hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 420px;
        }

        .detail-hero-image {
          position: relative;
          overflow: hidden;
          background: #e2e8f0;
        }

        .detail-hero-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .detail-hero-content {
          padding: 40px 44px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 18px;
        }

        .detail-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(59, 130, 246, 0.08);
          color: #1d4ed8;
          border-radius: 999px;
          padding: 10px 16px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.02em;
          width: fit-content;
        }

        .detail-title {
          margin: 0;
          font-size: clamp(2rem, 2.5vw, 3rem);
          line-height: 1.05;
          color: #0f172a;
        }

        .detail-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          font-size: 0.95rem;
          color: #475569;
        }

        .detail-meta span {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .detail-meta strong {
          color: #0f172a;
        }

        .detail-body {
          padding: 32px 44px 40px;
          display: grid;
          gap: 24px;
        }

        .detail-paragraph {
          margin: 0;
          color: #334155;
          line-height: 1.85;
          letter-spacing: -0.01em;
          font-size: 1rem;
        }

        .detail-footer {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 16px;
          align-items: center;
          padding: 0 44px 34px;
          border-top: 1px solid rgba(148, 163, 184, 0.18);
        }

        .detail-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .detail-tag {
          background: #eff6ff;
          color: #1d4ed8;
          border-radius: 999px;
          padding: 10px 14px;
          font-size: 0.85rem;
          font-weight: 700;
        }

        .detail-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .detail-button {
          border: none;
          border-radius: 14px;
          padding: 12px 20px;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .detail-button.primary {
          background: #2563eb;
          color: white;
          box-shadow: 0 14px 26px rgba(37, 99, 235, 0.22);
        }

        .detail-button.secondary {
          background: #f8fafc;
          color: #334155;
          border: 1px solid rgba(148, 163, 184, 0.35);
        }

        .detail-button:hover {
          transform: translateY(-1px);
        }

        .detail-empty,
        .detail-loading,
        .detail-error {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 420px;
          background: white;
          border-radius: 28px;
          box-shadow: 0 28px 80px rgba(15, 23, 42, 0.08);
          color: #475569;
          font-size: 1rem;
          padding: 32px;
          text-align: center;
        }

        @media (max-width: 1024px) {
          .detail-hero {
            grid-template-columns: 1fr;
          }

          .detail-hero-content,
          .detail-body,
          .detail-footer {
            padding-left: 28px;
            padding-right: 28px;
          }
        }

        @media (max-width: 720px) {
          .detail-page {
            padding: 24px 16px;
          }

          .detail-hero-content {
            padding: 28px 24px;
          }

          .detail-title {
            font-size: 2rem;
          }

          .detail-body,
          .detail-footer {
            padding-left: 20px;
            padding-right: 20px;
          }
        }

        @media (max-width: 560px) {
          .detail-hero-content {
            padding: 24px 18px;
          }

          .detail-meta {
            flex-direction: column;
            gap: 10px;
          }

          .detail-footer {
            flex-direction: column;
            align-items: stretch;
          }

          .detail-actions {
            width: 100%;
          }

          .detail-button {
            width: 100%;
          }
        }
      `}</style>

      <main className="detail-page">
        <div className="detail-container">
          {isLoading ? (
            <div className="detail-loading">Loading newsletter details...</div>
          ) : error ? (
            <div className="detail-error">{error}</div>
          ) : !newsletter ? (
            <div className="detail-empty">Newsletter not found.</div>
          ) : (
            <article className="detail-card">
              <div className="detail-hero">
                <div className="detail-hero-image">
                  {imageSrc ? (
                    <img src={imageSrc} alt={newsletter.title} />
                  ) : (
                    <div className="detail-empty" style={{ minHeight: "100%", boxShadow: "none", background: "#e2e8f0" }}>
                      No image available
                    </div>
                  )}
                </div>

                <div className="detail-hero-content">
                  <div className="detail-badge">{newsletter.category || "Newsletter"}</div>
                  <h1 className="detail-title">{newsletter.title}</h1>
                  <div className="detail-meta">
                    <span>
                      <strong>Published:</strong> {new Date(newsletter.date).toLocaleDateString()}
                    </span>
                    <span>
                      <strong>Author:</strong> {newsletter.author || "Anonymous"}
                    </span>
                    <span>
                      <strong>Created:</strong> {new Date(newsletter.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-body">{renderDescription(newsletter.description)}</div>

              <div className="detail-footer">
                <div className="detail-tags">
                  {Array.isArray(newsletter.tags) && newsletter.tags.length > 0 ? (
                    newsletter.tags.map((tag) => (
                      <span key={tag} className="detail-tag">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="detail-tag">{newsletter.category || "Alumni Stories"}</span>
                  )}
                </div>

                <div className="detail-actions">
                  <button type="button" className="detail-button secondary" onClick={() => navigate(-1)}>
                    Back to News
                  </button>
                  {newsletter.pdfUrl && (
                    <a
                      href={normalizeImage(newsletter.pdfUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="detail-button primary"
                    >
                      Download PDF
                    </a>
                  )}
                </div>
              </div>
            </article>
          )}
        </div>
      </main>
    </>
  );
};

export default NewsDetailPage;
