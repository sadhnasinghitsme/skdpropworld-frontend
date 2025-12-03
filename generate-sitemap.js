const fs = require('fs');
const axios = require('axios');

// Configuration
const DOMAIN = 'https://skdpropworld.com';
const API_BASE = process.env.VITE_API_BASE_URL || 'http://localhost:5000';
const OUTPUT_PATH = './client/public/sitemap.xml';

// Static pages with their priorities and change frequencies
const staticPages = [
  { url: '/', changefreq: 'daily', priority: '1.0' },
  { url: '/about-us', changefreq: 'monthly', priority: '0.8' },
  { url: '/contact-us', changefreq: 'monthly', priority: '0.8' },
  { url: '/projects', changefreq: 'weekly', priority: '0.9' },
  { url: '/services', changefreq: 'monthly', priority: '0.7' },
  { url: '/office-bearers', changefreq: 'monthly', priority: '0.6' },
  { url: '/team', changefreq: 'monthly', priority: '0.6' },
  { url: '/view-gallery', changefreq: 'weekly', priority: '0.7' },
  { url: '/maps', changefreq: 'monthly', priority: '0.7' },
  { url: '/all-blogs', changefreq: 'weekly', priority: '0.8' },
  { url: '/career@skd', changefreq: 'monthly', priority: '0.6' },
];

// Get current date in YYYY-MM-DD format
function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

// Generate XML for a single URL
function generateUrlXml(url, lastmod, changefreq, priority) {
  return `
  <url>
    <loc>${DOMAIN}${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

// Fetch dynamic content (projects and blogs)
async function fetchDynamicContent() {
  const dynamicUrls = [];
  const currentDate = getCurrentDate();

  try {
    // Fetch all projects
    console.log('Fetching projects...');
    const projectsResponse = await axios.get(`${API_BASE}/api/admin/projects`);
    const projects = projectsResponse.data;

    projects.forEach(project => {
      if (project.slug) {
        dynamicUrls.push({
          url: `/projects/${project.slug}`,
          lastmod: project.updatedAt ? project.updatedAt.split('T')[0] : currentDate,
          changefreq: 'weekly',
          priority: '0.8'
        });
      }
    });

    console.log(`✅ Added ${projects.length} projects to sitemap`);
  } catch (error) {
    console.warn('⚠️ Could not fetch projects:', error.message);
  }

  try {
    // Fetch all blogs
    console.log('Fetching blogs...');
    const blogsResponse = await axios.get(`${API_BASE}/api/blogs`);
    const blogs = blogsResponse.data;

    blogs.forEach(blog => {
      if (blog._id) {
        dynamicUrls.push({
          url: `/read-blog/${blog._id}`,
          lastmod: blog.updatedAt ? blog.updatedAt.split('T')[0] : currentDate,
          changefreq: 'monthly',
          priority: '0.7'
        });
      }
    });

    console.log(`✅ Added ${blogs.length} blogs to sitemap`);
  } catch (error) {
    console.warn('⚠️ Could not fetch blogs:', error.message);
  }

  return dynamicUrls;
}

// Generate the complete sitemap
async function generateSitemap() {
  console.log('🚀 Generating sitemap...');
  
  const currentDate = getCurrentDate();
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

  // Add static pages
  staticPages.forEach(page => {
    xml += generateUrlXml(page.url, currentDate, page.changefreq, page.priority);
  });

  // Add dynamic content
  const dynamicUrls = await fetchDynamicContent();
  dynamicUrls.forEach(page => {
    xml += generateUrlXml(page.url, page.lastmod, page.changefreq, page.priority);
  });

  xml += '\n</urlset>';

  // Write to file
  fs.writeFileSync(OUTPUT_PATH, xml);
  console.log(`✅ Sitemap generated successfully at ${OUTPUT_PATH}`);
  console.log(`📊 Total URLs: ${staticPages.length + dynamicUrls.length}`);
}

// Run the generator
generateSitemap().catch(error => {
  console.error('❌ Error generating sitemap:', error);
  process.exit(1);
});
