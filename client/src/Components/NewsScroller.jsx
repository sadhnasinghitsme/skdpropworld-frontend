import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./NewsScroller.css";

function NewsScroller() {
  const [newsList, setNewsList] = useState([]);
  const scrollRef = useRef(null);
  const [duration, setDuration] = useState("60s"); // default fallback

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
    if (scrollRef.current) {
      const contentHeight = scrollRef.current.scrollHeight;
      const speed = 40; // pixels per second
      const calculatedDuration = contentHeight / speed;
      setDuration(`${calculatedDuration}s`);
    }
  }, [newsList]);

  return (
    <div className="bg-white bg-light p-3">
      <div className="container my-4 news-scroller-wrapper bg-light w-100 bg-white border rounded ">
        <h5 className="p-1 bg-dark text-white mb-0 mt-0">
          🗞️ Latest Real Estate News
        </h5>
        <div className="news-scroller p-3">
          {newsList.length === 0 ? (
            <p className="text-muted">No news found.</p>
          ) : (
            <div
              className="scrolling-content"
              ref={scrollRef}
              style={{ animationDuration: duration }}
            >
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

              <div style={{ height: "50px" }}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewsScroller;
