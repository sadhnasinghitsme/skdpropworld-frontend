const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const { SitemapStream, streamToPromise } = require("sitemap");
const { createGzip } = require("zlib");
const sitemap = require("./routes/sitemap");
const htmlSnippetRoutes = require("./routes/htmlSnippet");
const newsRoutes = require("./routes/newsRoutes.js");
const inventoryRoutes = require("./routes/inventoryRoutes.js");
const app = express();
// const PORT = process.env.PORT || 8080;
const prerender = require("prerender-node");
prerender.set("prerenderToken", "QHhhrvIPvM5gm4fHnmaT");
app.use(prerender);
console.log("✅ Prerender middleware loaded");

// Uncomment this for local-run
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(
  cors({
    origin: [
      "http://localhost:5000",
      "http://localhost:5173",
      "https://skd-production.up.railway.app",
      "https://www-skdpropworld-com.onrender.com",
      "https://skd-test.vercel.app",
      "https://skdpropworld.com",
      "https://www.skdpropworld.com",
      "https://https-www-skdpropworld-com.vercel.app"
    ],
    credentials: true,
  })
);

// Uncomment this for production build
// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "https://skd-testmode.vercel.app",
//       "https://www.skdpropworld.com", // ✅ Now it's correct
//     ],
//     credentials: true,
//   })
// );

// app.use(express.json());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
// Register the HTML snippet route
app.use("/api/snippet", htmlSnippetRoutes);
// ⬇️ Serve frontend build in production
// if (process.env.NODE_ENV === "production") {
//   const __dirname = path.resolve();
//   app.use(express.static(path.join(__dirname, "../client/dist")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "../client/dist", "index.html"));
//   });
// }
app.use("/", sitemap); // <-- mount it
app.use("/api", require("./routes/htmlSnippet"));

console.log("→ Mounting /api/admin");
app.use("/api/admin", require("./routes/adminRoutes"));

console.log("→ Mounting /api/lead");
app.use("/api/lead", require("./routes/leadRoutes"));

console.log("→ Mounting /api/inventories");
app.use("/api/admin/inventories", require("./routes/inventoryRoutes"));

console.log("→ Mounting /api");
app.use("/api", require("./routes/visitorRoutes"));

console.log("→ Mounting /api/admin/projects");
app.use("/api/admin/projects", require("./routes/projectRoutes"));

console.log("→ Mounting /api/news");
app.use("/api/news", require("./routes/news"));

console.log("→ Mounting /api/project-enquiry");
app.use("/api/project-enquiry", require("./routes/projectEnquiryRoutes"));

console.log("→ Mounting /api/career");
app.use("/api/career", require("./routes/careerRoutes"));

console.log("→ Mounting /uploads/resumes");
app.use("/uploads/resumes", express.static("uploads/resumes"));

console.log("→ Mounting /api/map-manager");
app.use("/api/map-manager", require("./routes/mapEntryRoutes"));

console.log("→ Mounting /api/admin/gallery");
app.use("/api/admin/gallery", require("./routes/adminGallery"));

console.log("→ Mounting /api/blogs");
app.use("/api/blogs", require("./routes/blogRoutes"));

console.log("→ Mounting /api/site-config");
app.use("/api/site-config", require("./routes/siteConfigRoutes"));

console.log("→ Mounting /api/admin/dashboard-stats");
app.use("/api/admin/dashboard-stats", require("./routes/adminStats"));

console.log("→ Mounting /api/admin/youtube");
app.use("/api/admin/youtube", require("./routes/youtubeVideos"));

// DB Connection
// mongoose
//   .connect(process.env.MONGO_URI, {
//     dbName: "SkdData",
//   })
//   .then(() => {
//     console.log("MongoDB connected");
//     app.listen(5000, () => console.log("Server running on port 5000"));
//   })
//   .catch((err) => console.error("MongoDB connection error:", err));
// Simple test route
app.get("/api", (req, res) => {
  res.send("✅ API is working fine!");
});


// Start MongoDB + Server
async function startServer() {
  await mongoose.connect(process.env.MONGO_URI, {
    dbName: "SkdData",
  });

  console.log("MongoDB connected successfully.");

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1);
});

