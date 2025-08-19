import React from "react";
import { useAuth } from "./context/AuthContext";
import useAutoLogout from "./hooks/useAutoLogout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminSidebar from "./Components/AdminSidebar";
import confetti from "canvas-confetti";
import "./AdminDashboard.css";
// import { Link } from "react-router-dom";

import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Make sure this is imported
import { Modal, Button } from "react-bootstrap";
import { LogOut } from "lucide-react";
import { Helmet } from "react-helmet-async";

import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  CartesianGrid,
} from "recharts";
import { useRef } from "react";

function AdminDashboard() {
  const { admin } = useAuth();
  const remainingTime = useAutoLogout();
  const [stats, setStats] = useState({
    leads: 0,
    projects: 0,
    blogs: 0,
    careers: 0,
  });
  const [leadChartData, setLeadChartData] = useState([]);
  const [chartRange, setChartRange] = useState(7); // Default 7 days
  const [showChartModal, setShowChartModal] = useState(false);
  const [editingSnippetId, setEditingSnippetId] = useState(null);

  const [pendingComments, setPendingComments] = useState([]);
  const [loadingActions, setLoadingActions] = useState(true);
  const [todayLeads, setTodayLeads] = useState(0);
  const [todayCareers, setTodayCareers] = useState(0);
  const [showFestivalModal, setShowFestivalModal] = useState(false);
  const [htmlSnippet, setHtmlSnippet] = useState("");
  const confettiRef = useRef(null);
  const [existingSnippets, setExistingSnippets] = useState([]);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [newsTitle, setNewsTitle] = useState("");
  const [newsHTML, setNewsHTML] = useState("");
  const [newsTags, setNewsTags] = useState("");
  const [newsRibbon, setNewsRibbon] = useState("");

  // ✅ Step 3: News Submit Handler
  const handleSubmitNews = async () => {
    try {
      const payload = {
        title: newsTitle,
        htmlContent: newsHTML,
        tags: newsTags.split(",").map((tag) => tag.trim()),
        ribbon: newsRibbon,
      };

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/news/add`,
        payload
      );

      setShowNewsModal(false);
      setNewsTitle("");
      setNewsHTML("");
      setNewsTags("");
      setNewsRibbon("");
    } catch (err) {
      console.error("Error adding news:", err);
    }
  };

  const fetchSnippets = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/snippet/all-snippets`
      );
      setExistingSnippets(res.data || []);
    } catch (err) {
      console.error("Failed to fetch snippets:", err);
    }
  };

  const triggerButtonConfetti = () => {
    if (!confettiRef.current) return;

    const rect = confettiRef.current.getBoundingClientRect();

    confetti({
      particleCount: 100,
      spread: 80,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      },
      scalar: 0.9,
      colors: ["#ff007f", "#ffd700", "#7fff00", "#00bfff", "#ff4500"],
    });
  };

  const handleDeleteSnippet = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/snippet/delete-snippet/${id}`
      );

      fetchSnippets(); // Refresh
    } catch (err) {
      console.error("Error deleting snippet:", err);
    }
  };

  const handleSaveHtmlSnippet = async () => {
    try {
      if (editingSnippetId) {
        await axios.patch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/snippet/update-snippet/${editingSnippetId}`,
          { htmlCode: htmlSnippet } // ✅ CORRECT
        );

        console.log("Snippet updated");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/snippet/save-snippet`,
          { htmlCode: htmlSnippet }
        );
        console.log("Snippet created");
      }

      fetchSnippets();
      setShowFestivalModal(false);
      setHtmlSnippet("");
      setEditingSnippetId(null);
    } catch (err) {
      console.error("Error saving snippet:", err);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, [chartRange]);
  useEffect(() => {
    fetchSnippets();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL;

      // Step 1: Get overall stats
      const statsRes = await axios.get(
        `${API_BASE}/api/admin/dashboard-stats?days=${chartRange}`
      );

      const { leads, projects, blogs, careers, weeklyLeads } = statsRes.data;

      // Step 2: Get all project leads to count today's
      const leadsRes = await axios.get(`${API_BASE}/api/project-enquiry/all`);
      const allLeads = leadsRes.data || [];

      const today = new Date().toDateString();
      const todayLeadsCount = allLeads.filter(
        (lead) => new Date(lead.createdAt).toDateString() === today
      ).length;

      // Step 3: Get all career applications to count today's
      const careerRes = await axios.get(`${API_BASE}/api/career/all`);
      const allCareerApplications = careerRes.data || [];

      const todayCareerCount = allCareerApplications.filter(
        (app) => new Date(app.createdAt).toDateString() === today
      ).length;

      // Final update
      setStats({ leads, projects, blogs, careers });
      setTodayLeads(todayLeadsCount);
      setTodayCareers(todayCareerCount); // 👈 create this new state
      setLeadChartData(weeklyLeads || []); // 👈 Add this
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
    }
  };

  useEffect(() => {
    fetchPendingComments();
  }, []);

  const fetchPendingComments = async () => {
    try {
      setLoadingActions(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/blogs/comments/pending`
      );
      setPendingComments(res.data || []);
    } catch (err) {
      console.error("Error fetching pending comments:", err);
    } finally {
      setLoadingActions(false);
    }
  };

  const refreshDashboard = () => {
    fetchDashboardStats();
    fetchPendingComments();
  };

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>Admin | Dashboard </title>
      </Helmet>
      <div className="d-flex p-4">
        {/* <AdminSidebar adminName={admin?.name} remainingTime={remainingTime} /> */}

        <div className="flex-grow-1">
          <div className="container">
            {/* Main Motivational Heading */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="fw-bold text-white mb-0">
                Your ideas lead the way – let’s build something extraordinary!
              </h2>
              <button
                className="btn btn-outline-light btn-sm"
                onClick={refreshDashboard}
                disabled={loadingActions}
              >
                🔁 Refresh Dashboard
              </button>
              {/* <button
                className="btn btn-danger btn-sm"
                onClick={refreshDashboard}
                disabled={loadingActions}
              >
                🔁 Refresh Dashboard
              </button> */}
            </div>

            {/* Quote Below Title */}
            {/* Driver's Seat Motivational Line */}
            {/* Quote Below Title */}
            <blockquote
              className="fst-italic text-secondary border-start border-4 ps-3 mb-4"
              style={{ borderColor: "#f1c40f" }}
            >
              “You don’t have to be great to start, but you have to start to be
              great.”
            </blockquote>

            {/* Dashboard Summary Cards */}
            <div className="row mb-4">
              {/* Leads */}
              <div className="col-md-3 mb-3">
                <div className="card text-white bg-primary h-100 shadow">
                  <div className="card-body">
                    <h6 className="card-title">Customer Leads</h6>
                    <h3 className="card-text">{stats.leads}</h3>
                    <p className="mb-1 text-white-50">📅 Today: {todayLeads}</p>

                    {/* Button to open modal */}
                    <button
                      className="btn btn-sm btn-light fw-semibold mt-2 mb-2"
                      onClick={(e) => {
                        e.stopPropagation(); // prevent bubbling
                        setShowChartModal(true);
                      }}
                    >
                      📊 View Chart
                    </button>

                    {/* Wrap only this text in Link */}
                    <Link
                      to="/admin/projects-leads"
                      className="text-white text-decoration-none"
                    >
                      <p className="small m-0">Manage Leads →</p>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Projects */}
              <div className="col-md-3 mb-3">
                <Link
                  to="/admin/control-projects"
                  className="text-decoration-none"
                >
                  <div className="card text-white bg-success h-100 shadow">
                    <div className="card-body">
                      <h6 className="card-title">Projects</h6>
                      <h3 className="card-text">{stats.projects}</h3>
                      <p className="small">View Projects →</p>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Blogs */}
              <div className="col-md-3 mb-3">
                <Link
                  to="/admin/blogs-manager"
                  className="text-decoration-none"
                >
                  <div className="card text-white bg-warning h-100 shadow">
                    <div className="card-body">
                      <h6 className="card-title">Blog Posts</h6>
                      <h3 className="card-text">{stats.blogs}</h3>
                      <p className="small">Edit Blogs →</p>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Career Applications (replaces Gallery) */}
              <div className="col-md-3 mb-3">
                <Link
                  to="/admin/career-applications"
                  className="text-decoration-none"
                >
                  <div className="card text-white bg-danger h-100 shadow">
                    <div className="card-body">
                      <h6 className="card-title">Career Applications</h6>
                      <h3 className="card-text">{stats.careers}</h3>
                      <p className="mb-1 text-white-50">
                        📅 Today: {todayCareers}
                      </p>

                      <p className="small">Track Applicants →</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="card-title mb-0">
               
              </h5>
              <select
                className="form-select form-select-sm w-auto"
                value={chartRange}
                onChange={(e) => setChartRange(Number(e.target.value))}
              >
                <option value={7}>Last 7 Days</option>
                <option value={30}>Last 30 Days</option>
              </select>
            </div> */}

            {/* <div className="card shadow mb-4 border-0">
              <div className="card-body">
                <h5 className="card-title mb-3 p-4 ">
                  📊 Leads in Last {chartRange} Days
                </h5>
                {leadChartData.length === 0 ? (
                  <p className="text-muted">
                    No leads data available for the last {chartRange} days.
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={leadChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="leads" fill="#0d6efd" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div> */}

            {/* Pending Actions Card */}
            {/* Pending Actions Card */}
            <div className="card shadow mb-4 border-0">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title mb-0">🔔 Pending Actions</h5>
                  {/* <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={fetchPendingComments}
                  disabled={loadingActions}
                >
                  🔄 Refresh
                </button> */}
                </div>

                {loadingActions ? (
                  <p className="text-muted">Checking for pending tasks...</p>
                ) : pendingComments.length > 0 ? (
                  <Link
                    to="/admin/comments-moderation"
                    className="text-decoration-none"
                  >
                    <p className="mb-0 text-dark">
                      📝 You have <strong>{pendingComments.length}</strong>{" "}
                      comment
                      {pendingComments.length > 1 && "s"} pending approval.
                      <br />
                      <span className="text-primary">Review now →</span>
                    </p>
                  </Link>
                ) : (
                  <p className="text-success fw-semibold mb-0">
                    🎉 Hooray! Looks like you've done all the tasks for today.
                  </p>
                )}
              </div>
            </div>

            {/* Go to User Side Card */}
            <div
              className="card text-dark border-0 shadow go-to-card "
              style={{ backgroundColor: "#f1c40f", transition: "0.3s" }}
            >
              <div className="card-body d-flex flex-column justify-content-between">
                <div>
                  <h5 className="card-title">Preview Public Website</h5>
                  <p className="card-text">
                    Open the main site in a new tab to preview changes as a
                    user.
                  </p>
                </div>
                <button
                  className="btn btn-outline-dark mt-2 fw-semibold"
                  onClick={() => window.open("/", "_blank")}
                >
                  Go to User Side ↗
                </button>
              </div>
            </div>
            <div className="my-4">
              <button
                className="btn btn-lg btn-warning fw-bold w-100 shadow"
                onClick={() => setShowNewsModal(true)}
              >
                🗞️ Add Breaking Real Estate News
              </button>
            </div>

            {/* 👇 Add Inventory Button - paste below this */}
            <div className="my-4">
              <Link to="/admin/add-inventory">
                <button className="btn btn-lg btn-info fw-bold w-100 shadow">
                  📦 Add Inventory
                </button>
              </Link>
            </div>

            <div
              className="my-4 position-relative festival-button-wrapper"
              ref={confettiRef}
            >
              <button
                className="btn btn-lg fw-bold w-100 text-warning festival-celebrate-button shadow"
                onClick={() => setShowFestivalModal(true)}
                onMouseEnter={triggerButtonConfetti}
              >
                🎊 Festival Ahead? Change the Website Feel →
              </button>
            </div>

            <ToastContainer />
          </div>
        </div>

        {/* Hover Styling */}
        <style>{`
        .go-to-card:hover {
          background-color: #fff !important;
          border: 1px solid #f1c40f;
        }
        .go-to-card:hover .btn-outline-dark {
          background-color: #f1c40f;
          border-color: #f1c40f;
          color: #000;
        }
      `}</style>
      </div>
      <Modal
        show={showChartModal}
        onHide={() => setShowChartModal(false)}
        fullscreen
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Leads Summary (Last {chartRange} Days)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-end mb-3">
            <select
              className="form-select form-select-sm  widthwa"
              value={chartRange}
              onChange={(e) => setChartRange(Number(e.target.value))}
            >
              <option value={7}>Last 7 Days</option>
              <option value={30}>Last 30 Days</option>
            </select>
          </div>

          {leadChartData.length === 0 ? (
            <p className="text-muted">
              No leads data available for the last {chartRange} days.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300} className="p-5">
              <BarChart data={leadChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="leads" fill="#0d6efd" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowChartModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showFestivalModal}
        onHide={() => setShowFestivalModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            🎨{" "}
            {editingSnippetId
              ? "Edit Festival HTML"
              : "Add Custom Festival HTML"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label className="form-label fw-semibold">
            Paste HTML code (e.g. canvas animation, confetti, fireworks, etc.):
          </label>
          <textarea
            className="form-control"
            rows={6}
            placeholder="<canvas id='fireworks'>...</canvas>"
            value={htmlSnippet}
            onChange={(e) => setHtmlSnippet(e.target.value)}
          ></textarea>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowFestivalModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveHtmlSnippet}
            disabled={!htmlSnippet.trim()}
          >
            Save Snippet
          </Button>
        </Modal.Footer>
      </Modal>
      {existingSnippets.map((snippet, idx) => (
        <div
          key={idx}
          className="mb-3 position-relative border rounded p-2 text-white"
        >
          <div dangerouslySetInnerHTML={{ __html: snippet.htmlCode }}></div>

          <div className="position-absolute top-0 end-0 m-2 d-flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setHtmlSnippet(snippet.htmlCode);
                setEditingSnippetId(snippet._id);
                setShowFestivalModal(true);
              }}
            >
              Edit
            </Button>

            <Button
              size="sm"
              variant="danger"
              onClick={() => handleDeleteSnippet(snippet._id)}
            >
              ×
            </Button>
          </div>
        </div>
      ))}

      <Modal
        show={showNewsModal}
        onHide={() => setShowNewsModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>🗞️ Add Real Estate News</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label fw-semibold">Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. YEIDA announces new plot scheme"
              value={newsTitle}
              onChange={(e) => setNewsTitle(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              Formatted HTML Content
            </label>
            <textarea
              className="form-control"
              rows={6}
              placeholder="<p>YEIDA has launched...</p>"
              value={newsHTML}
              onChange={(e) => setNewsHTML(e.target.value)}
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              Tags (comma separated)
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="yeida, plot scheme, 2025"
              value={newsTags}
              onChange={(e) => setNewsTags(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Custom Ribbon Text</label>
            <input
              type="text"
              className="form-control"
              placeholder="Breaking | Just In | Must Read"
              value={newsRibbon}
              onChange={(e) => setNewsRibbon(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNewsModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmitNews}
            disabled={!newsTitle.trim() || !newsHTML.trim()}
          >
            Save News
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AdminDashboard;
