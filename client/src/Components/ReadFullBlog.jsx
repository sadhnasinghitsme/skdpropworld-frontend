import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./ReadFullBlog.css";
import Navbar from "./Navbar";
import Footer from "../Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SupportWidget from "./SupportWidget";
import ErrorBoundary from "./ErrorBoundary";
import SafeHTMLRenderer from "./SafeHTMLRenderer";
// import { toast } from "react-toastify";
// import { ToastContainer } from "react-toastify";
import { Helmet } from "react-helmet-async";

const ReadFullBlog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  const API = `${import.meta.env.VITE_API_BASE_URL}/api/blogs/${id}`;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!id) {
          setError("Invalid blog ID");
          setLoading(false);
          return;
        }
        
        console.log("Fetching blog with ID:", id);
        console.log("API URL:", API);
        
        const res = await axios.get(API);
        console.log("Blog API Response:", res.data);
        
        if (res.data && res.data.blog) {
          const blogData = res.data.blog;
          console.log("Blog data received:", {
            id: blogData._id,
            title: blogData.title,
            hasContent: !!blogData.content,
            contentLength: blogData.content?.length || 0
          });
          
          setBlog(blogData); // Main blog
          setComments(blogData.comments || []);
          setRelatedBlogs(res.data.relatedBlogs || []); // ✅ Set suggested blogs
        } else if (res.data && !res.data.blog) {
          // Sometimes API might return blog directly
          console.log("Blog data structure different, trying direct assignment");
          if (res.data._id) {
            setBlog(res.data);
            setComments(res.data.comments || []);
            setRelatedBlogs([]);
          } else {
            setError("Blog data structure is invalid");
          }
        } else {
          setError("Blog data is invalid");
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        console.error("Error details:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          statusText: err.response?.statusText
        });
        const errorMessage = err.response?.data?.error || err.message || "Failed to load blog";
        setError(errorMessage);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    if (id && API) {
      fetchBlog();
    } else {
      setError("Invalid blog ID or API URL");
      setLoading(false);
    }
  }, [id, API]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    try {
      const res = await axios.post(`${API}/comment`, { name, comment });
      setComments(res.data.comments);
      setName("");
      setComment("");

      // ✅ Show toast notification
      toast.success("Your comment has been submitted and is pending approval.");
    } catch (err) {
      console.error("Failed to post comment", err);
      toast.error("Failed to post comment. Please try again later.");
    }
  };

  if (loading) return <div className="blogdetail-loading">Loading...</div>;
  if (error) return <div className="blogdetail-error">Error: {error}</div>;
  if (!blog) return <div className="blogdetail-error">Blog not found.</div>;

  // SEO: override title for the YEIDA Plots blog
  const SPECIAL_YEIDA_TITLE =
    "YEIDA Plots in Greater Noida | Property Dealer & Real Estate Consultant – SKD Propworld";

  const pageTitle =
    blog._id === "693d1ad0f880b08242ab9606"
      ? SPECIAL_YEIDA_TITLE
      : `${blog.title || "Blog"} | SKD PropWorld Blog`;

  return (
    <ErrorBoundary>
      <>
        <Helmet>
        {/* Primary Meta Tags */}
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={
            blog.content
              ? blog.content.replace(/<[^>]+>/g, "").slice(0, 150) + "..."
              : "Read this blog post on SKD PropWorld"
          }
        />
        <meta
          name="keywords"
          content={`${
            blog.tags || "real estate, property, blog, YEIDA, Noida"
          }`}
        />
        <meta name="author" content={blog.author || "SKD PropWorld"} />
       

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={pageTitle} />
        <meta
          property="og:description"
          content={
            blog.content
              ? blog.content.replace(/<[^>]+>/g, "").slice(0, 150) + "..."
              : "Read this blog post on SKD PropWorld"
          }
        />
        <meta
          property="og:url"
          content={`https://skdpropworld.com/read-blog/${blog._id || ""}`}
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta
          name="twitter:description"
          content={
            blog.content
              ? blog.content.replace(/<[^>]+>/g, "").slice(0, 150) + "..."
              : "Read this blog post on SKD PropWorld"
          }
        />
      </Helmet>
      <Navbar />
      <div className="readblog-container p-6">
        <div className="readblog-wrapper-flex">
          {/* MAIN BLOG CONTENT */}
          <div className="readblog-main">
            <Link to="/all-blogs" className="readblog-backlink">
              ← Back to Blogs
            </Link>

            {blog.imageUrl && (
              <img
                src={blog.imageUrl}
                alt={blog.title || "Blog image"}
                className="readblog-image"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            )}

            <h1 className="readblog-title">{blog.title || "Untitled Blog"}</h1>
            <p className="readblog-meta">
              By <span>{blog.author || "Unknown"}</span>
              {blog.timestamp && (
                <> on {new Date(blog.timestamp).toLocaleDateString()}</>
              )}
            </p>

            {/* TAGS + SHARE */}
            <div className="readblog-tags-share">
              {blog.tags && (
                <>
                  <strong>Tags:</strong>{" "}
                  {blog.tags.split(",").map((tag, idx) => (
                    <button className="readblog-tag-button" key={idx}>
                      {tag.trim()}
                    </button>
                  ))}
                </>
              )}
              <div className="readblog-share-section mt-3 mb-4">
                <strong>Share:</strong>
                <div className="readblog-social-icons mt-2">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Share on Facebook"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog.title || "Blog")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Share on Twitter"
                  >
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Share on LinkedIn"
                  >
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      (blog.title || "Blog") + " - " + window.location.href
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Share on WhatsApp"
                  >
                    <i className="fab fa-whatsapp"></i>
                  </a>
                  <button
                    className="readblog-copy-link-button"
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(window.location.href);
                        toast.info("Link copied to clipboard!");
                      } else {
                        toast.error("Clipboard not available");
                      }
                    }}
                    title="Copy Link"
                  >
                    <i className="fas fa-link"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* BLOG CONTENT */}
            <ErrorBoundary>
              {blog.content ? (
                <SafeHTMLRenderer
                  html={blog.content}
                  className="readblog-content"
                />
              ) : (
                <div className="readblog-content">
                  <p>No content available for this blog.</p>
                </div>
              )}
            </ErrorBoundary>
          </div>

          {/* SUGGESTED BLOGS PANEL */}
          {relatedBlogs.length > 0 && (
            <div className="readblog-sidebar">
              <h4 className="readblog-sidebar-title">Suggested Blogs</h4>
              {relatedBlogs.map((rel) => {
                if (!rel || !rel._id) return null;
                try {
                  return (
                    <Link
                      to={`/read-blog/${rel._id}`}
                      key={rel._id}
                      className={`readblog-suggested-card ${
                        rel._id === blog._id ? "active-suggested" : ""
                      }`}
                    >
                      {rel.imageUrl && (
                        <img
                          src={rel.imageUrl}
                          alt={rel.title || "Blog image"}
                          className="readblog-suggested-img"
                          loading="lazy"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      )}
                      <h5 className="readblog-suggested-blog-title">
                        {rel.title || "Untitled Blog"}
                      </h5>
                      <p className="readblog-suggested-author">
                        By {rel.author || "Unknown"}
                        {rel.timestamp && (
                          <> • {new Date(rel.timestamp).toLocaleDateString()}</>
                        )}
                      </p>
                    </Link>
                  );
                } catch (err) {
                  console.error("Error rendering related blog:", rel._id, err);
                  return null;
                }
              })}
            </div>
          )}
        </div>

        <div className="width-decider">
          {/* COMMENT FORM */}
          <div className="readblog-comment-form">
            <h4>Leave a Comment</h4>
            <form onSubmit={handleCommentSubmit}>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <textarea
                placeholder="Your Comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              ></textarea>
              <button type="submit">Submit</button>
            </form>
          </div>

          {/* COMMENTS */}
          {comments.length > 0 && (
            <div className="readblog-comment-section mt-5">
              <h4>Comments</h4>
              {comments.map((c, idx) => {
                if (!c) return null;
                try {
                  return (
                    <div className="readblog-comment-item" key={idx}>
                      <div className="readblog-comment-header">
                        <span>
                          <strong>{c.name || "Anonymous"}</strong>
                          {c.createdAt && (
                            <> on {new Date(c.createdAt).toLocaleDateString()}</>
                          )}{" "}
                          wrote
                          {c.approved && (
                            <span className="readblog-safe-tag ms-2">
                              🟢 Verified comment
                            </span>
                          )}
                        </span>
                      </div>
                      <p className="readblog-comment-text mb-2">
                        {c.comment || "No comment text"}
                      </p>
                      {c.replies?.length > 0 && c.replies[0]?.reply && (
                        <div className="readblog-admin-reply-box p-2 border bg-light rounded">
                          <strong>Admin Reply:</strong> {c.replies[0].reply}
                        </div>
                      )}
                    </div>
                  );
                } catch (err) {
                  console.error("Error rendering comment:", idx, err);
                  return null;
                }
              })}
            </div>
          )}
        </div>
      </div>
        <ToastContainer position="top-right" autoClose={3000} />
        <SupportWidget />
        <Footer />
      </>
    </ErrorBoundary>
  );
};

export default ReadFullBlog;
