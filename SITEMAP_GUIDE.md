# Sitemap Guide for SKD PropWorld

## 📍 What is a Sitemap?

A sitemap is an XML file that lists all the important pages of your website. It helps search engines like Google, Bing, and others discover and index your content more efficiently.

## 🎯 Your Sitemap Location

Your sitemap is located at:
- **File:** `client/public/sitemap.xml`
- **URL:** https://skdpropworld.com/sitemap.xml

## 🚀 How to Generate/Update Sitemap

### Method 1: Automatic Generation (Recommended)

Run this command to automatically generate a sitemap with all your projects and blogs:

```bash
npm run generate-sitemap
```

This will:
- ✅ Include all static pages (homepage, about, contact, etc.)
- ✅ Fetch all projects from your database
- ✅ Fetch all blogs from your database
- ✅ Generate a complete sitemap.xml file

### Method 2: Manual Update

If you prefer to manually update the sitemap, edit the file at `client/public/sitemap.xml`

## 📋 Pages Included in Sitemap

### Static Pages:
- Homepage (/)
- About Us (/about-us)
- Contact Us (/contact-us)
- Projects (/projects)
- Services (/services)
- Office Bearers (/office-bearers)
- Team (/team)
- Gallery (/view-gallery)
- Maps (/maps)
- All Blogs (/all-blogs)
- Career (/career@skd)

### Dynamic Pages (Auto-generated):
- Individual Project Pages (/projects/:slug)
- Individual Blog Posts (/read-blog/:id)

## 🔧 Configuration

The sitemap generator is configured in `generate-sitemap.js`:

- **Domain:** https://skdpropworld.com
- **API Base:** Uses your environment variable or localhost
- **Output:** client/public/sitemap.xml

## 📊 Priority & Change Frequency

| Page Type | Priority | Change Frequency |
|-----------|----------|------------------|
| Homepage | 1.0 | Daily |
| Projects List | 0.9 | Weekly |
| About/Contact | 0.8 | Monthly |
| Individual Projects | 0.8 | Weekly |
| Blogs List | 0.8 | Weekly |
| Individual Blogs | 0.7 | Monthly |
| Services/Gallery | 0.7 | Monthly |
| Team/Office Bearers | 0.6 | Monthly |

## 🌐 Submit to Search Engines

After generating your sitemap, submit it to search engines:

### Google Search Console
1. Go to https://search.google.com/search-console
2. Select your property (skdpropworld.com)
3. Go to "Sitemaps" in the left menu
4. Enter: `sitemap.xml`
5. Click "Submit"

### Bing Webmaster Tools
1. Go to https://www.bing.com/webmasters
2. Select your site
3. Go to "Sitemaps"
4. Submit: https://skdpropworld.com/sitemap.xml

## 🔄 When to Update Sitemap

Update your sitemap when:
- ✅ You add new projects
- ✅ You publish new blog posts
- ✅ You add new pages to your website
- ✅ You make significant changes to existing pages

**Recommended:** Run `npm run generate-sitemap` weekly or after major content updates.

## ✅ Verify Your Sitemap

Check if your sitemap is working:
1. Visit: https://skdpropworld.com/sitemap.xml
2. You should see an XML file with all your URLs
3. Use Google's Sitemap Validator: https://www.xml-sitemaps.com/validate-xml-sitemap.html

## 🤖 Robots.txt Integration

Your `robots.txt` file already references the sitemap:
```
User-agent: *
Allow: /
Sitemap: https://www.skdpropworld.com/sitemap.xml
```

This tells search engines where to find your sitemap automatically.

## 🎉 Benefits

- 🔍 Better SEO and search engine visibility
- 📈 Faster indexing of new content
- 🎯 Helps search engines understand your site structure
- 📊 Better tracking in Google Search Console
- 🚀 Improved organic traffic

## 💡 Tips

1. **Keep it updated:** Regenerate your sitemap regularly
2. **Monitor in Search Console:** Check for any errors
3. **Don't include admin pages:** They're already excluded
4. **Include only public pages:** Private/protected routes are not included
5. **Check file size:** If your sitemap grows beyond 50MB or 50,000 URLs, consider creating a sitemap index

## 🆘 Troubleshooting

**Sitemap not generating?**
- Make sure your server is running
- Check if the API endpoints are accessible
- Verify your .env file has the correct API_BASE_URL

**Search engines not finding sitemap?**
- Verify the file exists at: https://skdpropworld.com/sitemap.xml
- Check robots.txt has the correct sitemap URL
- Submit manually to Google Search Console

---

**Last Updated:** December 3, 2024
**Website:** https://skdpropworld.com
