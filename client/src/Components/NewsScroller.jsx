import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./NewsScroller.css";

function NewsScroller() {
  const [newsList, setNewsList] = useState([]);
  const [isDark, setIsDark] = useState(false);
  const scrollRef = useRef(null);
  const contentRef = useRef(null); // for height of 1st copy

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/news/all`
        );
        const sorted = (res.data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNewsList(sorted);
      } catch (err) {
        console.error("Failed to fetch news:", err);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    let scrollInterval = null;
    const speed = 1;
    const delay = 16;

    const startScroll = () => {
      if (scrollInterval) return;
      scrollInterval = setInterval(() => {
        if (container.scrollTop >= content.scrollHeight) {
          container.scrollTop = 0;
        } else {
          container.scrollTop += speed;
        }
      }, delay);
    };

    const stopScroll = () => {
      clearInterval(scrollInterval);
      scrollInterval = null;
    };

    startScroll();
    container.addEventListener("mouseenter", stopScroll);
    container.addEventListener("mouseleave", startScroll);

    return () => {
      stopScroll();
      container.removeEventListener("mouseenter", stopScroll);
      container.removeEventListener("mouseleave", startScroll);
    };
  }, [newsList]);

  const renderNews = () =>
    [...newsList, { isBreak: true }].map((news, idx) =>
      news.isBreak ? (
        <div
          key={`break-${idx}`}
          className="news-break text-center text-muted py-4"
        >
          <p className="fw-semibold fs-5">
            📢 News coming up... <br /> ↓
          </p>
        </div>
      ) : (
        <div key={idx} className="mb-4 border-bottom pb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <h6 className="fw-bold mb-0">{news.title}</h6>
            {news.ribbon && (
              <span className="badge bg-warning text-dark ms-2">
                {news.ribbon}
              </span>
            )}
          </div>
          {news.tags?.length > 0 && (
            <p className="text small mb-1">Tags: {news.tags.join(", ")}</p>
          )}
          <p className="publish-date">
            📅 Published: {new Date(news.createdAt).toLocaleDateString()}
          </p>
          <div
            className="news-html-content"
            dangerouslySetInnerHTML={{ __html: news.htmlContent }}
          ></div>
        </div>
      )
    );

  return (
    <div className={`p-3 ${isDark ? "dark-mode" : "light-mode"}`}>
      <div className="container my-4 news-scroller-wrapper w-100 border rounded">
        <div className="d-flex justify-content-between align-items-center px-2 py-1 bg-dark text-white">
          <h5 className="mb-0">🗞️ Latest Real Estate News</h5>
          <button
            className="btn btn-sm btn-light"
            onClick={() => setIsDark(!isDark)}
          >
            {isDark ? "🌞 Light" : "🌙 Dark"}
          </button>
        </div>

        <div
          className={`news-scroller p-3 ${
            isDark ? "dark-scroll" : "light-scroll"
          }`}
          ref={scrollRef}
        >
          {newsList.length === 0 ? (
            <p className="text-muted">No news found.</p>
          ) : (
            <div>
              <div ref={contentRef}>{renderNews()}</div>
              <div>{renderNews()}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewsScroller;
