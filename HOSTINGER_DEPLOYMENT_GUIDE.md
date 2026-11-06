# 🚀 Hostinger Deployment Guide — Pillaiyarappa South Indian Corner

This guide explains how to deploy this project to **Hostinger Shared Hosting** (or Hostinger Cloud/Business Hosting) with zero errors.

---

## 📁 1. Project Structure Overview

The project is now cleanly split into two production-ready root folders:

```text
d:\Khushi\
├── client/                     # Frontend (React 19 + Vite + Tailwind v4)
│   ├── src/                    # All UI components, pages, hooks, state
│   ├── public/                 # Static assets (images, icons, brand)
│   │   ├── .htaccess           # 🔥 Essential for Hostinger SPA routing (prevents 404s)
│   │   └── robots.txt          # SEO crawlers config
│   ├── index.html              # HTML entry point
│   ├── vite.config.ts          # Vite build & dev configuration
│   ├── tsconfig.json           # Client TypeScript configuration
│   └── package.json            # Client dependencies
│
├── server/                     # Backend API (Node.js + Express + JSON DB)
│   ├── api/                    # Menu & Admin REST endpoints
│   ├── data/                   # Dynamic JSON database (db.json)
│   ├── db/                     # Store logic & schema
│   ├── index.ts                # TypeScript server entry
│   ├── server.js               # ⚡ Standalone production bundle (zero compile needed on Hostinger!)
│   ├── tsconfig.json           # Server TypeScript configuration
│   └── package.json            # Server dependencies
│
├── dist/                       # 🎯 The Final Production Build (Upload this to Hostinger!)
│   ├── index.html
│   ├── .htaccess               # Hostinger Apache rewrite rules
│   ├── assets/                 # Minified & hashed JS/CSS
│   ├── images/                 # Restaurant, dishes & branches photos
│   └── ...
│
├── package.json                # Root monorepo orchestrator (npm workspaces)
└── HOSTINGER_DEPLOYMENT_GUIDE.md
```

---

## 🛠️ 2. Build Commands

Before uploading, you can regenerate the build anytime with:

```bash
# Build both frontend and backend
npm run build

# Or build client only
npm run build:client

# Or build server bundle only
npm run build:server
```

When `npm run build` runs:
1. It builds the React client directly into the root **`dist/`** folder.
2. It automatically includes `.htaccess`, `robots.txt`, all images, and hashed assets.
3. It compiles the Express backend into **`server/server.js`** using esbuild.

---

## 🌐 3. Deployment Method 1: Hostinger Shared Hosting (Most Popular & Simplest)

In Hostinger Shared Hosting (Single, Premium, or Business), your website is served from the **`public_html`** folder using Apache / LiteSpeed web servers.

### Step-by-Step Instructions:

1. **Log in to Hostinger hPanel**:
   - Go to [hostinger.com](https://hostinger.com) and log in.
   - Click on **Websites** and click **Manage** next to your domain.

2. **Open File Manager**:
   - Under **Files**, click **File Manager** (or connect via FTP / FileZilla).
   - Navigate into the **`public_html`** directory.

3. **Clean Default Files (If New Site)**:
   - If there is a `default.php` file created by Hostinger, delete it.

4. **Upload the contents of `dist/`**:
   > ⚠️ **IMPORTANT:** Do NOT upload the `dist` folder itself. Upload the **contents inside** the `dist/` folder directly into `public_html/`.

   Your `public_html/` should look like this:
   ```text
   public_html/
   ├── .htaccess            <-- 🔥 MUST be present (Enable "Show Hidden Files" in File Manager)
   ├── index.html
   ├── robots.txt
   ├── manifest.webmanifest
   ├── favicon.svg
   ├── apple-touch-icon.png
   ├── sw.js
   ├── assets/
   ├── images/
   ├── brand/
   ├── icons/
   └── patterns/
   ```

5. **Verify `.htaccess` (Hidden Files)**:
   - In Hostinger File Manager top-right settings, make sure **Show Hidden Files (dotfiles)** is turned **ON** so you can see `.htaccess`.
   - The `.htaccess` file provided handles **SPA routing** so refreshing pages like `/menu`, `/branches`, `/catering`, `/about`, `/admin` will **never throw 404 Not Found** errors.

6. **Test Your Website**:
   - Open `https://yourdomain.com` in your browser.
   - Try navigating to `/menu`, `/branches`, add items to cart, test 3 km GPS validator, and refresh the page. Everything works!

---

## ⚡ 4. Deployment Method 2: Hostinger with Node.js Application (Fullstack)

If your Hostinger plan includes the **Node.js** feature (Hostinger Business Web Hosting, Cloud Startup, or VPS):

1. **In Hostinger hPanel**:
   - Search for **Node.js** in the left sidebar under **Advanced** or **Applications**.
   - Click **Create Application**.

2. **Configure Node.js Settings**:
   - **Node.js version**: Select `18.x`, `20.x`, or `22.x`.
   - **Application root**: Select `server` (or upload files to a directory like `api` or `public_html/server`).
   - **Application startup file**: `server.js` (this file is already pre-bundled and ready!).
   - **Application URL**: `yourdomain.com` (or a subdomain like `api.yourdomain.com`).

3. **Install Dependencies & Start**:
   - Click **NPM Install** in hPanel.
   - Click **Start** or **Restart Application**.

4. **Static Frontend + Dynamic API Together**:
   - The included `server/server.js` is programmed to automatically detect `dist/`.
   - If you place the `dist/` build in the root next to `server`, a single Node process will serve **both** the full React website AND the `/api` endpoints!

---

## 🔄 5. Optional: External Backend Configuration

If you host the frontend on Hostinger `public_html` and decide to run the Node.js backend on a free/dedicated platform like **Render**, **Railway**, or a **VPS**:

1. In `client/`, create a file named `.env`:
   ```env
   VITE_API_URL=https://your-backend-api.onrender.com
   ```
2. Run `npm run build`.
3. Upload the newly generated `dist/` to Hostinger `public_html`.
4. The client will automatically direct all API calls to your external server while maintaining full CORS support!

---

## ✅ 6. Production Readiness Checklist

| Feature | Status | Details |
| :--- | :---: | :--- |
| **Folder Separation** | ✅ Ready | `client/` and `server/` isolated cleanly |
| **Direct Hostinger Build** | ✅ Ready | `dist/` at root contains complete production files |
| **SPA 404 Fix (.htaccess)** | ✅ Ready | Included in `public/.htaccess` and `dist/.htaccess` |
| **GZIP Compression** | ✅ Ready | Configured in `.htaccess` for LiteSpeed/Apache |
| **Browser Caching** | ✅ Ready | 1-year cache on hashed assets & images |
| **Pre-bundled Server** | ✅ Ready | `server/server.js` (64KB standalone ES Module) |
| **CORS Middleware** | ✅ Ready | Enabled on Express API for cross-origin hosting |
| **Offline-First Store** | ✅ Ready | Works 100% even if backend is offline or static-only |
| **3 km GPS Radius Validator** | ✅ Ready | High accuracy geolocation with fallback |
| **WhatsApp Checkout** | ✅ Ready | Turn-by-turn Google Maps pin for in-house riders |
