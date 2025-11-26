# News Management Guide

## Overview
You can now manage YEIDA news dynamically without redeploying your application!

## How to Use

### 1. Access Admin Panel
- Go to your website and login to admin panel
- Navigate to: **Admin Dashboard → News Manager**
- Or directly visit: `/admin/news-manager`

### 2. Add New News
1. Click **"Add New News"** button
2. Fill in the form:
   - **Title**: News headline
   - **Category**: Select from dropdown (YEIDA Updates, Market News, etc.)
   - **Excerpt**: Short summary (shown on cards)
   - **Content**: Full news content
   - **Image URL**: Link to news image
   - **External Link**: (Optional) Link to full article
   - **Visible**: Check to show on website immediately
3. Click **"Create"**

### 3. Edit Existing News
1. Find the news in the table
2. Click the **yellow edit icon** (✏️)
3. Update the fields
4. Click **"Update"**

### 4. Hide/Show News
- Click the **eye icon** (👁️) to toggle visibility
- Hidden news won't appear on the website but remain in database

### 5. Delete News
- Click the **red trash icon** (🗑️)
- Confirm deletion
- News will be permanently removed

## Features

✅ **No Redeployment Needed**: Changes appear instantly
✅ **Visibility Control**: Show/hide news without deleting
✅ **Categories**: Organize news by type
✅ **Image Support**: Add images via URL
✅ **External Links**: Link to full articles on other sites
✅ **Date Tracking**: Automatically tracks creation date

## API Endpoints (Already Configured)

- `GET /api/news` - Get visible news (public)
- `GET /api/news/admin/all` - Get all news (admin)
- `POST /api/news` - Create news
- `PUT /api/news/:id` - Update news
- `DELETE /api/news/:id` - Delete news
- `PATCH /api/news/:id/toggle-visibility` - Toggle visibility

## Where News Appears

News items appear on your homepage in the **"Latest YEIDA News & Updates"** section, showing the 6 most recent visible news items.

## Tips

1. **Use High-Quality Images**: Upload images to a CDN or image hosting service and use the URL
2. **Keep Excerpts Short**: 100-150 characters work best for card display
3. **Update Regularly**: Fresh news keeps visitors engaged
4. **Use Categories**: Helps organize and filter news
5. **Test Visibility**: Use the hide/show feature to preview before publishing

## Troubleshooting

**News not showing?**
- Check if "Visible" is enabled
- Verify the image URL is accessible
- Check browser console for errors

**Can't access admin panel?**
- Make sure you're logged in as admin
- Check your admin credentials

**Images not loading?**
- Verify the image URL is correct and publicly accessible
- Use HTTPS URLs for images
- Consider using image hosting services like Cloudinary or ImgBB
