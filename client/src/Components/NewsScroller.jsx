import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./NewsScroller.css";

function NewsScroller() {
  const [newsList, setNewsList] = useState([]);
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
    const speed = 1; // pixels per step
    const delay = 16; // ~60fps

    const startScroll = () => {
      if (scrollInterval) return;
      scrollInterval = setInterval(() => {
        if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
          el.scrollTop = 0; // reset to top
        } else {
          el.scrollTop += speed;
        }
      }, delay);
    };

    const stopScroll = () => {
      clearInterval(scrollInterval);
      scrollInterval = null;
    };

    // Start scrolling
    startScroll();

    // Pause on hover
    el.addEventListener("mouseenter", stopScroll);
    el.addEventListener("mouseleave", startScroll);

    return () => {
      stopScroll();
      el.removeEventListener("mouseenter", stopScroll);
      el.removeEventListener("mouseleave", startScroll);
    };
  }, [newsList]);

  return (
    <div className="bg-white bg-light p-3">
      <div className="container my-4 news-scroller-wrapper w-100 border rounded">
        <h5 className="p-1 bg-dark text-white mb-0 mt-0">
          🗞️ Latest Real Estate News
        </h5>
        <div className="news-scroller p-3" ref={scrollRef}>
          {newsList.length === 0 ? (
            <p className="text-muted">No news found.</p>
          ) : (
            <>
              {[...newsList, { isBreak: true }].map((news, idx) =>
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
                      <p className="text small mb-1">
                        Tags: {news.tags.join(", ")}
                      </p>
                    )}
                    <p className="publish-date">
                      📅 Published:{" "}
                      {new Date(news.createdAt).toLocaleDateString()}
                    </p>
                    <div
                      className="news-html-content"
                      dangerouslySetInnerHTML={{ __html: news.htmlContent }}
                    ></div>
                  </div>
                )
              )}
              <div style={{ height: "30px" }}></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewsScroller;
