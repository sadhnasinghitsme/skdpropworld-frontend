# Fix Render.com 502 Bad Gateway Error

## Current Issue
Your backend at https://yeida-backend.onrender.com is showing a **502 Bad Gateway** error, which means the application is failing to start properly.

## Root Causes & Solutions

### 1. 🔧 Environment Variables Missing
**Problem**: Your app needs environment variables to connect to MongoDB and other services.

**Solution**: Set these in your Render dashboard:

1. Go to https://dashboard.render.com
2. Find your `yeida-backend` service
3. Go to **Environment** tab
4. Add these variables:

```
MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/SkdData
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
NODE_ENV=production
```

### 2. 🔧 Port Configuration
**Problem**: App might not be listening on the correct port.

**Solution**: Already fixed in server.js:
```javascript
const PORT = process.env.PORT || 10000;
```

### 3. 🔧 Dependencies Issues
**Problem**: Missing dependencies causing startup failures.

**Solution**: Already fixed in package.json with all required dependencies.

## Step-by-Step Fix

### Step 1: Check Render Logs
1. Go to your Render dashboard
2. Click on your `yeida-backend` service
3. Go to **Logs** tab
4. Look for error messages during startup

### Step 2: Set Environment Variables
**Critical**: You MUST set your MongoDB connection string:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/SkdData
```

Without this, your app will crash immediately.

### Step 3: Redeploy
After setting environment variables:
1. Go to **Manual Deploy** 
2. Click **Deploy Latest Commit**
3. Watch the logs for successful startup

### Step 4: Test Endpoints
Once deployed successfully, test:
```bash
curl https://yeida-backend.onrender.com/api
```

Should return: `✅ API is working fine!`

## Common Error Messages & Fixes

### "MongoDB connection error"
- **Cause**: Missing or incorrect MONGO_URI
- **Fix**: Set correct MongoDB connection string in environment variables

### "Cannot find module"
- **Cause**: Missing dependencies
- **Fix**: Already resolved in package.json

### "EADDRINUSE"
- **Cause**: Port conflict
- **Fix**: Already resolved with dynamic PORT configuration

### "Application failed to respond"
- **Cause**: App not listening on correct port
- **Fix**: Already resolved in server.js

## Environment Variables Template

Copy these to your Render dashboard (replace with your actual values):

```
MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/SkdData
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
NODE_ENV=production
```

## Verification Steps

1. **Check Logs**: Look for "MongoDB connected successfully" and "Server running on port"
2. **Test API**: `curl https://yeida-backend.onrender.com/api`
3. **Test Projects**: `curl https://yeida-backend.onrender.com/api/admin/projects`

## If Still Failing

1. **Check MongoDB**: Ensure your MongoDB Atlas cluster is running and accessible
2. **Check Whitelist**: Add `0.0.0.0/0` to MongoDB Atlas IP whitelist for Render
3. **Check Credentials**: Verify MongoDB username/password are correct
4. **Contact Support**: Share Render logs if issue persists

Your backend code is correct - this is purely a deployment configuration issue that will be resolved once environment variables are properly set.