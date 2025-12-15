# 📦 How to Install FFmpeg on Windows

## Method 1: Using Chocolatey (Recommended)

### Step 1: Install Chocolatey (if not installed)
Open PowerShell as Administrator and run:
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

### Step 2: Install FFmpeg
```powershell
choco install ffmpeg
```

### Step 3: Verify Installation
```bash
ffmpeg -version
```

---

## Method 2: Manual Installation

### Step 1: Download FFmpeg
1. Go to: https://www.gyan.dev/ffmpeg/builds/
2. Download: **ffmpeg-release-essentials.zip**
3. Extract the ZIP file

### Step 2: Add to PATH
1. Extract to: `C:\ffmpeg`
2. Open System Properties → Environment Variables
3. Edit "Path" variable
4. Add: `C:\ffmpeg\bin`
5. Click OK

### Step 3: Restart Terminal
Close and reopen your terminal/PowerShell

### Step 4: Verify
```bash
ffmpeg -version
```

---

## Method 3: Using Scoop

### Step 1: Install Scoop
```powershell
iwr -useb get.scoop.sh | iex
```

### Step 2: Install FFmpeg
```bash
scoop install ffmpeg
```

---

## Alternative: Use Online Video Compressor

If you don't want to install FFmpeg, use an online tool:

### **Option A: FreeConvert (Recommended)**
1. Go to: https://www.freeconvert.com/video-compressor
2. Upload: `client/public/videos/hero-video-compressed.mp4`
3. Settings:
   - Quality: Medium
   - Resolution: 1280x720
   - Format: MP4
4. Download compressed video
5. Replace the old file

### **Option B: Clideo**
1. Go to: https://clideo.com/compress-video
2. Upload your video
3. Download compressed version
4. Replace the old file

### **Option C: HandBrake (Desktop App)**
1. Download: https://handbrake.fr/
2. Install and open
3. Load your video
4. Preset: "Fast 720p30"
5. Start encoding
6. Replace the old file

---

## After Installation:

Once FFmpeg is installed, run:
```bash
node compress-video.js
```

This will automatically:
- ✅ Compress video from 9.47 MB to ~1.5 MB
- ✅ Generate poster image
- ✅ Replace old video
- ✅ Keep backup

---

## Quick Test:

After installing FFmpeg, test it:
```bash
ffmpeg -version
```

You should see version information.

---

## Need Help?

If you have issues, let me know which method you tried!
