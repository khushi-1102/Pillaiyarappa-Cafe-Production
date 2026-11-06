# 🆓 Free Deployment Guide: Vercel + Render (100% Free Forever)

Haan bilkul! Aap is poore project ko **₹0 (Bina 1 bhi rupya kharch kiye)** 100% free me deploy kar sakte hain using:
1. **Vercel** -> Frontend (React + Vite website) ke liye
2. **Render** -> Backend API (Node.js/Express) ke liye

---

## ⚡ Quick Comparison: Vercel/Render vs Hostinger

| Feature | Vercel + Render (Free) | Hostinger (Paid) |
| :--- | :---: | :---: |
| **Cost** | **₹0 / Month (Bilkul Free)** | ~₹2,500 – ₹3,000 / Year |
| **Domain** | `pillaiyarappa.vercel.app` (Free) | Free Custom Domain (`.com` / `.in`) |
| **Speed / CDN** | Global Edge CDN (Super Fast ⚡) | Apache / LiteSpeed (India Mumbai) |
| **SSL (HTTPS)** | Free Automatic (Green Lock) | Free Automatic |
| **Setup Time** | 3-5 Minutes | 10-15 Minutes |

---

## 🚀 Option A: Deploy on Vercel ALONE (Sabse Fast — Sirf 2 Minute)

> 💡 **Important Fact:** Humari website **Offline-First** design hai! Sabhi 10 menu categories, dosas, prices, photos, cart, 3 km GPS validator, aur WhatsApp ordering bina kisi external server ke direct chalti hai!

Iska matlab aapko backend ki tension lene ki bhi zaroorat nahi hai agar aap sirf restaurant ki website + WhatsApp ordering chalana chahte hain:

1. **[vercel.com](https://vercel.com)** par jayein aur **Sign Up with GitHub / Google** karein.
2. **"Add New..." -> "Project"** par click karein.
3. Apni GitHub repository select karein (ya Vercel CLI use karein).
4. Humne `vercel.json` pehle se configure kar diya hai:
   - Framework Preset: **Vite**
   - Root Directory: `.` (Project root)
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Deploy** button dabayein!
6. 🎉 1 minute me aapki website live ho jayegi:  
   👉 `https://pillaiyarappa.vercel.app`

---

## ⚙️ Option B: Fullstack (Vercel Frontend + Render Backend)

Agar aap dynamic admin panel sync aur database persistence bhi free me chahte hain:

### STEP 1: Backend Deploy Karein (Render.com)
1. **[render.com](https://render.com)** par free account banayein (Sign in with GitHub).
2. Dashboard me **"New +" -> "Web Service"** select karein.
3. Apni GitHub repository connect karein.
4. Settings me ye daalein:
   - **Name**: `pillaiyarappa-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: **Free ($0/month)**
5. Click **Create Web Service**.
6. Render aapko ek URL dega, jaise:  
   👉 `https://pillaiyarappa-api.onrender.com`

---

### STEP 2: Frontend Deploy Karein (Vercel)
1. **[vercel.com](https://vercel.com)** me apna project import karein.
2. **Environment Variables** section kholein aur add karein:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://pillaiyarappa-api.onrender.com` *(Render se mila hua URL)*
3. **Deploy** par click karein!

---

## 🌐 Custom Domain (.com / .in) Kab aur Kaise Lagayein?

Agar aapko future me `pillaiyarappa.com` ya `pillaiyarappa.in` jaisa professional domain chahiye:
1. Aap kisi bhi domain registrar (jaise GoDaddy, Namecheap, ya Hostinger Domain) se sirf **domain** le sakte hain (~₹399 se ₹800/year).
2. Fir Vercel ke **Settings > Domains** me jaakar apna domain daal dein.
3. Vercel aapke custom domain ko **100% Free** me connect aur SSL certificate de deta hai!
