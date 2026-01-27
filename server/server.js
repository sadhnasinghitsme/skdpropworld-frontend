const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const compression = require("compression");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const { SitemapStream, streamToPromise } = require("sitemap");
const { createGzip } = require("zlib");
const sitemap = require("./routes/sitemap");
const htmlSnippetRoutes = require("./routes/htmlSnippet");
const inventoryRoutes = require("./routes/inventoryRoutes.js");
const app = express();
// Server configuration - Use environment PORT or fallback to 10000 for Render
const PORT = process.env.PORT || 10000;
const prerender = require("prerender-node");
prerender.set("prerenderToken", "QHhhrvIPvM5gm4fHnmaT");
app.use(prerender);
console.log("✅ Prerender middleware loaded");

// Enable gzip compression for all responses
app.use(compression());
console.log("✅ Compression middleware loaded");

// WWW redirect middleware - Force www subdomain and HTTPS in production (SKIP for API routes)
app.use((req, res, next) => {
  // Skip redirect for API routes
  if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
    return next();
  }
  
  if (process.env.NODE_ENV === 'production') {
    const host = req.get('host');
    const url = req.originalUrl;
    const isHttps = req.secure || req.get('x-forwarded-proto') === 'https';
    
    // Check if we need to redirect
    if (!isHttps || !host.startsWith('www.')) {
      // Remove any existing 'www.' to avoid duplicates
      const domain = host.replace(/^www\./i, '');
      
      // Build the new URL with https and www
      const newUrl = `https://www.${domain}${url}`;
      
      // Only redirect if the URL would actually change
      if (req.originalUrl !== newUrl) {
        return res.redirect(301, newUrl);
      }
    }
  }
  
  next();
});
console.log("✅ WWW redirect middleware loaded");

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3001',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      'http://localhost:5177',
      'http://localhost:5178',
      'http://localhost:5179',
      'http://localhost:5000',
      'https://skd-production.up.railway.app',
      'https://www-skdpropworld-com.onrender.com',
      'https://skd-test.vercel.app',
      'https://skdpropworld.com',
      'https://www.skdpropworld.com',
      'https://https-www-skdpropworld-com.vercel.app',
      'https://skdpropworld.vercel.app'
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Debug logging
    console.log(`🔍 CORS Check - Origin: ${origin}`);
    console.log(`🔍 CORS Check - Allowed: ${allowedOrigins.includes(origin)}`);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      console.error(`❌ CORS Blocked: ${origin}`);
      return callback(new Error(msg), false);
    }
    console.log(`✅ CORS Allowed: ${origin}`);
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-prerender-token']
};

// Apply CORS with the above options
app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.options('*', cors(corsOptions));

// Explicit OPTIONS handler for login route
app.options('/api/admin/login', cors(corsOptions), (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});
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
// API Routes - Must come BEFORE route mounting
app.get("/api", (req, res) => {
  res.json({
    message: "✅ API is working fine!",
    timestamp: new Date().toISOString(),
    endpoints: [
      "/api/lead/submit",
      "/api/admin/projects", 
      "/api/news",
      "/api/project-enquiry"
    ]
  });
});

// Health check endpoint for production debugging
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    version: "1.0.0"
  });
});

// API status endpoint
app.get("/api/status", (req, res) => {
  res.json({
    api: "OK",
    endpoints: [
      "/api/lead/submit",
      "/api/admin/projects", 
      "/api/news",
      "/api/project-enquiry"
    ],
    timestamp: new Date().toISOString()
  });
});

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

// Root route - Simple response for debugging
app.get("/", (req, res) => {
  res.send("SKD Propworld Backend is running!");
});

// Static files and SPA routing - ONLY for non-API routes
const frontendPath = path.join(__dirname, "../client/dist");

// Serve static files, but not for API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  express.static(frontendPath)(req, res, next);
});

// Catch-all for SPA routing - ONLY for non-API routes
app.get("*", (req, res) => {
  // Explicitly reject API routes that weren't handled
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ 
      error: 'API endpoint not found',
      path: req.path,
      availableEndpoints: [
        "/api",
        "/api/status", 
        "/api/news",
        "/api/lead/submit"
      ]
    });
  }
  
  // Serve frontend for all other routes
  const indexPath = path.join(frontendPath, "index.html");
  res.sendFile(indexPath);
});


// Start MongoDB + Server
async function startServer() {
  try {
    // Check if MONGO_URI is provided
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is required");
    }

    console.log("🔄 Attempting to connect to MongoDB...");
    
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "SkdData",
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      // Production optimizations
      maxPoolSize: 10, // Maintain up to 10 socket connections
      bufferCommands: false // Disable mongoose buffering
    });

    console.log("✅ MongoDB connected successfully.");

    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`\n=== Server Configuration ===`);
      console.log(`PORT: ${PORT}`);
      console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
      console.log(`MongoDB: ${process.env.MONGO_URI ? 'Configured' : 'Not Configured'}`);
      console.log(`==========================\n`);
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Server started at ${new Date().toISOString()}`);
      console.log(`👂 Server PID: ${process.pid}`);
    });
  } catch (err) {
    console.error("❌ Server startup error:", err.message);
    if (err.message.includes("authentication failed")) {
      console.error("💡 Tip: Check your MongoDB username and password in MONGO_URI");
    } else if (err.message.includes("timeout") || err.message.includes("ENOTFOUND")) {
      console.error("💡 Tip: Check MongoDB Atlas Network Access - allow 0.0.0.0/0 or Render IPs");
    } else if (err.message.includes("MONGO_URI")) {
      console.error("💡 Tip: Set MONGO_URI in Render Environment Variables");
    }
    process.exit(1);
  }
}

startServer();

