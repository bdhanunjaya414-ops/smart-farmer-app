# Complete Deployment Guide

This guide walks you through deploying your Smart Farmer App to production.

---

## 📋 Prerequisites

- GitHub account with your code pushed
- Vercel account (free: https://vercel.com)
- Render account (free: https://render.com)
- Node.js 18+ installed locally

---

## 🌐 PART 1: Deploy Backend to Render

### Step 1: Create Render Account

1. Go to https://render.com
2. Sign up with GitHub (recommended for easy integration)
3. Authorize Render to access your GitHub repositories

### Step 2: Create Web Service

1. Click **New** → **Web Service**
2. Select your GitHub repository from the list
3. Click **Connect**

### Step 3: Configure the Web Service

Fill in these settings:

| Setting | Value |
|---------|-------|
| **Name** | `smart-farmer-backend` |
| **Environment** | `Node` |
| **Region** | Choose closest to you |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

### Step 4: Add Environment Variables

1. Scroll down to **Environment** section
2. Add these variables:

```
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-vercel-frontend-url.vercel.app
GEMINI_API_KEY=your_actual_gemini_api_key
```

**Important:** Replace `your-vercel-frontend-url` with your actual Vercel URL (you'll get this in Part 2)

### Step 5: Deploy

1. Click **Create Web Service**
2. Render will build and deploy automatically
3. Wait for deployment to complete (2-5 minutes)
4. Copy your backend URL (looks like: `https://smart-farmer-backend.onrender.com`)

✓ **Backend is now live!**

### Note: Render Free Tier
- Services spin down after 15 minutes of inactivity
- First request after spin-down may take 30 seconds
- Upgrade to paid for always-on service

---

## 🎯 PART 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub (recommended)
3. Authorize Vercel to access your GitHub

### Step 2: Import Project

1. Click **Add New...** → **Project**
2. Click **Import Git Repository**
3. Find and select your GitHub repository
4. Click **Import**

### Step 3: Configure Project

Fill in these settings:

| Setting | Value |
|---------|-------|
| **Project Name** | `smart-farmer-frontend` |
| **Root Directory** | `frontend` |
| **Framework** | `Vite` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

### Step 4: Add Environment Variables

1. Scroll to **Environment Variables**
2. Add this variable:

```
VITE_API_URL=https://smart-farmer-backend.onrender.com
```

Use your actual Render backend URL from Part 1!

### Step 5: Deploy

1. Click **Deploy**
2. Vercel will build and deploy (1-3 minutes)
3. Copy your frontend URL (looks like: `https://smart-farmer-frontend.vercel.app`)

✓ **Frontend is now live!**

### Update Backend CORS

Now that you have your frontend URL:

1. Go back to Render dashboard
2. Open your backend service
3. Go to **Environment**
4. Update `FRONTEND_URL` to your Vercel URL
5. Render will automatically redeploy

---

## 🔄 PART 3: Test Production Setup

### Test Backend API

Open in browser:
```
https://your-render-backend.onrender.com/health
```

Should see:
```json
{
  "status": "ok",
  "message": "Backend server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Test Frontend

1. Open your Vercel URL in browser
2. Click **"Test API Connection"** button
3. Should show green success message ✓

---

## 📱 Continuous Deployment

Both Vercel and Render support auto-deployment:

### When you push to GitHub:

1. **Backend (Render)**
   - Automatically pulls latest code
   - Runs `npm install`
   - Starts with `npm start`
   - Takes 2-5 minutes

2. **Frontend (Vercel)**
   - Automatically pulls latest code
   - Runs `npm run build`
   - Deploys to CDN
   - Takes 1-3 minutes

No manual deployment needed! Just commit and push.

---

## 🌍 Custom Domain (Optional)

### Frontend Custom Domain on Vercel

1. Go to Vercel project settings
2. Click **Domains**
3. Add your custom domain
4. Follow DNS instructions

### Backend Custom Domain on Render

1. Go to Render service settings
2. Click **Custom Domain**
3. Add your domain
4. Follow DNS instructions

---

## 🔐 Security Checklist

- [ ] Never commit `.env` files (use `.env.example`)
- [ ] Set strong API keys in environment variables
- [ ] CORS is configured for your frontend URL
- [ ] Frontend and backend URLs match in both services
- [ ] Remove sensitive data from code
- [ ] Use HTTPS everywhere
- [ ] Consider rate limiting for API

---

## 🚨 Troubleshooting

### Frontend shows 503 Bad Gateway

**Cause:** Backend is not responding
- Check if Render service is running
- If on free tier, backend may be spinning up (wait 30 seconds)
- Check environment variables in Render

**Fix:**
1. Go to Render dashboard
2. Check backend service status
3. Check environment variables
4. Check logs for errors

### Frontend won't load on Vercel

**Cause:** Build failed or wrong configuration
- Check Root Directory is `frontend`
- Check Build Command is `npm run build`
- Check Output Directory is `dist`

**Fix:**
1. Go to Vercel deployments
2. Check build logs for errors
3. Check Environment Variables
4. Redeploy

### API calls return CORS error

**Cause:** CORS not configured correctly
- Check `VITE_API_URL` matches backend URL
- Check backend CORS allows frontend URL

**Fix:**
1. Check `FRONTEND_URL` in Render backend
2. Check `VITE_API_URL` in Vercel frontend
3. Both must match production URLs
4. Check frontend console for error details

### Backend keeps timing out

**Cause:** Free tier Render is slow or spinning up
- Render spins down after 15 minutes of inactivity
- First request after spin-down takes 30+ seconds

**Solution:**
1. Use paid Render instance for always-on
2. Or add ping service to keep backend alive
3. Or upgrade Render subscription

---

## 📊 Monitoring

### Vercel Monitoring

1. Go to your project dashboard
2. Click **Analytics**
3. View performance, traffic, deployments

### Render Monitoring

1. Go to your service dashboard
2. Click **Logs** to see recent activity
3. Click **Metrics** for performance data

---

## 🔄 Updates & Maintenance

### Update Frontend Code

```bash
cd frontend
npm run build  # Test locally
git add .
git commit -m "Update frontend"
git push
# Auto-deploys to Vercel!
```

### Update Backend Code

```bash
cd backend
git add .
git commit -m "Update backend"
git push
# Auto-deploys to Render!
```

### Update Dependencies

```bash
# Frontend
cd frontend
npm update
npm audit fix

# Backend
cd backend
npm update
npm audit fix
```

---

## 📞 Support

- **Vercel Issues:** https://vercel.com/support
- **Render Issues:** https://render.com/docs
- **Express Documentation:** https://expressjs.com
- **React Documentation:** https://react.dev

---

## ✅ Final Checklist

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Environment variables set correctly
- [ ] CORS configured for both URLs
- [ ] API connection test passes
- [ ] Auto-deployment enabled on both
- [ ] Custom domain added (optional)
- [ ] Monitoring set up (optional)

---

**Congratulations! Your Smart Farmer App is now live in production! 🎉**

Frontend: https://your-vercel-url.vercel.app
Backend: https://your-render-url.onrender.com
