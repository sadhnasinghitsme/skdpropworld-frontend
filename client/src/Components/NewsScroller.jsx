import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./NewsScroller.css";

function NewsScroller() {
  const [newsList, setNewsList] = useState([]);
  const [isDark, setIsDark] = useState(false); // 🌙 theme toggle
  const scrollRef = useRef(null);

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
    const el = scrollRef.current;
    if (!el) return;

    let scrollInterval = null;
    const speed = 1; // smooth speed
    const delay = 16; // ~60fps

    const startScroll = () => {
      if (scrollInterval) return;
      scrollInterval = setInterval(() => {
        if (el.scrollTop >= el.scrollHeight / 2) {
          el.scrollTop = 0;
        } else {
          el.scrollTop += speed;
        }
      }, delay);
    };

    const stopScroll = () => {
      clearInterval(scrollInterval);
      scrollInterval = null;
    };

    startScroll();
    el.addEventListener("mouseenter", stopScroll);
    el.addEventListener("mouseleave", startScroll);

    return () => {
      stopScroll();
      el.removeEventListener("mouseenter", stopScroll);
      el.removeEventListener("mouseleave", startScroll);
    };
  }, [newsList]);

  const renderNews = (copyIndex = 0) =>
    [...newsList, { isBreak: true }].map((news, idx) =>
      news.isBreak ? (
        <div
          key={`break-${copyIndex}-${idx}`}
          className="news-break text-center text-muted py-4"
        >
          <p className="fw-semibold fs-5">
            📢 News coming up... <br /> ↓
          </p>
        </div>
      ) : (
        <div key={`${copyIndex}-${idx}`} className="mb-4 border-bottom pb-3">
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
            <>
              {renderNews(0)}
              {renderNews(1)}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewsScroller;
