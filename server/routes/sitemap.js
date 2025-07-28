const express = require("express");
const { SitemapStream, streamToPromise } = require("sitemap");
const { Readable } = require("stream");

const Project = require("../models/Project"); // Ensure valid Mongoose model
const Blog = require("../models/Blog"); // Ensure valid Mongoose model

const router = express.Router();

router.get("/sitemap.xml", async (req, res) => {
  // Utility: Safe ISO date or undefined


  const safeDate = (d) => {
    const date = new Date(d);
    return isNaN(date) ? undefined : date.toISOString();
  };

  try {
    const hostname = "https://www.skdpropworld.com";

    // ✅ Static routes with full metadata
    const staticRoutes = [
      {
        url: "/",
        changefreq: "daily",
        priority: 1.0,
        lastmod: new Date(), // Current timestamp
      },
      { url: "/about-us", changefreq: "monthly", priority: 0.7 },
      { url: "/contact-us", changefreq: "monthly", priority: 0.7 },
      { url: "/career@skd", changefreq: "monthly", priority: 0.7 },
      {
        url: "/projects",
        changefreq: "weekly",
        priority: 0.9,
        lastmod: new Date(),
      },
      { url: "/maps", changefreq: "monthly", priority: 0.7 },
      { url: "/view-gallery", changefreq: "monthly", priority: 0.7 },
      {
        url: "/all-blogs",
        changefreq: "weekly",
        priority: 0.8,
        lastmod: new Date(),
      },
      { url: "/services", changefreq: "monthly", priority: 0.7 },
      { url: "/office-bearers", changefreq: "monthly", priority: 0.7 },
      { url: "/team", changefreq: "monthly", priority: 0.7 },
    ];

    // ✅ Fetch dynamic project URLs
    const projects = await Project.find({}, "slug updatedAt");
    const projectRoutes = projects.map((proj) => ({
      url: `/projects/${proj.slug}`,
      changefreq: "weekly",
      priority: 0.95,
      lastmod: safeDate(proj.updatedAt),
    }));

    // ✅ Fetch dynamic blog URLs
    const blogs = await Blog.find({}, "slug _id updatedAt");
    const blogRoutes = blogs.map((blog) => ({
      url: `/read-blog/${blog._id}`,
      changefreq: "weekly",
      priority: 0.9,
      lastmod: safeDate(blog.updatedAt),
    }));

    // ✅ Combine all routes
    const allRoutes = [...staticRoutes, ...projectRoutes, ...blogRoutes];

    // ✅ Generate XML
    const stream = new SitemapStream({ hostname });
    res.header("Content-Type", "application/xml");

    const xml = await streamToPromise(
      Readable.from(allRoutes).pipe(stream)
    ).then((data) => data.toString());

    res.send(xml);
  } catch (err) {
    console.error("❌ Error generating sitemap:", err);
    res.status(500).end();
  }
});

module.exports = router;
