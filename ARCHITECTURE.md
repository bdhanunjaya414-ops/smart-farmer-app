
# 🏗️ Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRODUCTION SETUP                          │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────┐   ┌──────────────────────────────┐
│   VERCEL (Frontend Host)         │   │  RENDER (Backend Host)       │
│  https://your-app.vercel.app     │   │ https://your-app.onrender.com│
│                                  │   │                              │
│  ┌────────────────────────────┐  │   │  ┌──────────────────────────┐
│  │   React 19 + Vite App      │  │   │  │  Express.js API Server   │
│  │                            │  │   │  │                          │
│  │  1. User opens browser     │  │   │  │  Endpoints:              │
│  │  2. Loads React UI         │  │   │  │  - GET /health           │
│  │  3. Makes API call to      │  │   │  │  - GET /api              │
│  │     backend                │  │   │  │  - GET /api/crops        │
│  │  4. Displays response      │  │   │  │  - GET /api/market-prices│
│  │                            │  │   │  │  - POST /api/plants      │
│  └────────────────────────────┘  │   │  └──────────────────────────┘
│           │                       │   │            ▲
└───────────┼───────────────────────┘   └────────────┼──────────────
            │                                        │
            │        HTTPS API Call                  │
            │ (Environment Variable: VITE_API_URL)   │
            └────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                    LOCAL DEVELOPMENT SETUP                        │
└─────────────────────────────────────────────────────────────────┘

Terminal 1 (Backend)              Terminal 2 (Frontend)
┌────────────────────────┐        ┌────────────────────────┐
│ npm run dev            │        │ npm run dev            │
│                        │        │                        │
│ Backend running on:    │        │ Frontend running on:   │
│ http://localhost:5000  │        │ http://localhost:5173  │
│                        │        │                        │
│ ┌──────────────────┐   │        │ ┌──────────────────┐   │
│ │ Express Server   │   │        │ │ React App        │   │
│ │ - CORS Enabled   │   │        │ │ - Vite Dev Server│   │
│ │ - JSON API       │   │        │ │ - Live Reload    │   │
│ │ - Error Handler  │   │        │ │ - TypeScript     │   │
│ └──────────────────┘   │        │ └──────────────────┘   │
│           ▲            │        │        │               │
└───────────┼────────────┘        └────────┼───────────────┘
            │                             │
            └─────────── HTTP ───────────┘
         (VITE_API_URL=http://localhost:5000)
```

---

## 📊 Data Flow

### Frontend Request Flow
```
User opens http://localhost:5173
        ↓
React component loads
        ↓
User clicks "Test API Connection"
        ↓
fetch(`http://localhost:5000/api`)
        ↓
Browser sends HTTP GET request
        ↓
Backend receives request at GET /api
        ↓
Backend sends JSON response:
{
  "message": "✓ Backend API is working",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
        ↓
Frontend receives response
        ↓
React updates state
        ↓
UI displays success message ✓
```

---

## 📁 Folder Structure

```
smart-farmer-app/
│
├── frontend/                    ← REACT VITE APP
│   ├── src/
│   │   ├── App.tsx             # Main component (API calls here)
│   │   ├── main.tsx            # React entry point
│   │   └── index.css           # Global styles
│   ├── index.html              # HTML template
│   ├── package.json            # npm dependencies
│   ├── vite.config.ts          # Build config
│   ├── vercel.json             # Vercel deployment
│   └── .env.example            # Environment template
│
├── backend/                     ← EXPRESS API
│   ├── server.js               # API server (endpoints here)
│   ├── package.json            # npm dependencies
│   ├── .env.example            # Environment template
│   └── README.md               # Backend docs
│
├── README.md                    # Main guide
├── DEPLOYMENT.md               # Deploy to production
├── PROJECTSETUP_COMPLETE.md    # Setup checklist
└── FRONTEND_BACKEND_INTEGRATION.md # API patterns
```

---

## 🔄 Deployment Flow

### From Your Computer to Production

```
Step 1: Local Development
├── Write code in frontend/
├── Write code in backend/
└── Test locally on http://localhost:5173

Step 2: Push to GitHub
└── git push origin main

Step 3: Automatic Deployment

    ┌─────────────────────┐
    │  Your GitHub Repo   │
    │     (branch: main)  │
    └──────────┬──────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
   ┌────────┐       ┌────────┐
   │ Vercel │       │ Render │
   └───┬────┘       └───┬────┘
       │                │
       ▼                ▼
   Build: npm build  Build: npm install
   Test UI           Start: npm start
       │                │
       ▼                ▼
   https://vercel.app  https://onrender.com

Step 4: Production Running
└── Frontend + Backend working together in production
```

---

## 🔐 Environment Variables

### How They Flow

```
Development (Local)
┌──────────────────────────────────────────┐
│ frontend/.env.local                      │
│ VITE_API_URL=http://localhost:5000      │
│ ↓ (read by Vite)                         │
│ Frontend fetches from http://localhost:5000
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ backend/.env                             │
│ FRONTEND_URL=http://localhost:5173      │
│ ↓ (read by Node.js)                      │
│ Backend allows CORS from localhost:5173  │
└──────────────────────────────────────────┘


Production (Deployed)
┌────────────────────────────────────────────────┐
│ Vercel Environment Variable                    │
│ VITE_API_URL=https://api.onrender.com         │
│ ↓ (injected at build time)                     │
│ Frontend fetches from https://api.onrender.com │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│ Render Environment Variable                    │
│ FRONTEND_URL=https://app.vercel.app           │
│ ↓ (read at startup)                            │
│ Backend allows CORS from https://app.vercel.app
└────────────────────────────────────────────────┘
```

---

## 🎯 Request/Response Cycle

### Example: "Test API Connection" Button Click

```
1. FRONTEND ACTION
   ┌─────────────────────────────────┐
   │ User clicks "Test API Connection"│
   └─────────────────────────────────┘
                  ↓
   
2. FRONTEND CODE
   ┌──────────────────────────────────┐
   │ fetch(VITE_API_URL + "/api")     │
   │ const response = await fetch(...) │
   │ const data = await response.json()│
   └──────────────────────────────────┘
                  ↓
   
3. HTTP REQUEST
   ┌──────────────────────────────────────┐
   │ GET http://localhost:5000/api        │
   │ Headers:                             │
   │   Accept: application/json           │
   │   Origin: http://localhost:5173      │
   └──────────────────────────────────────┘
                  ↓
   
4. BACKEND ROUTING
   ┌──────────────────────────────────────┐
   │ Express matches: app.get('/api', ...) │
   │ Checks CORS: Origin matches            │
   │ Executes handler function              │
   └──────────────────────────────────────┘
                  ↓
   
5. BACKEND RESPONSE
   ┌──────────────────────────────────────┐
   │ res.json({                           │
   │   message: "✓ Backend API...",      │
   │   timestamp: "2024-01-15T...",      │
   │   version: "1.0.0"                   │
   │ })                                    │
   └──────────────────────────────────────┘
                  ↓
   
6. HTTP RESPONSE (200 OK)
   ┌──────────────────────────────────────┐
   │ Status: 200 OK                       │
   │ Content-Type: application/json       │
   │ Body: {                              │
   │   "message": "✓ Backend API...",    │
   │   "timestamp": "2024-01-15T...",    │
   │   "version": "1.0.0"                 │
   │ }                                     │
   │ Access-Control-Allow-Origin: *       │
   └──────────────────────────────────────┘
                  ↓
   
7. FRONTEND PROCESSING
   ┌──────────────────────────────────────┐
   │ Response received                    │
   │ data = {                             │
   │   message: "✓ Backend API...",      │
   │   timestamp: "2024-01-15T...",      │
   │   version: "1.0.0"                   │
   │ }                                     │
   │ setData(data)                        │
   └──────────────────────────────────────┘
                  ↓
   
8. UI UPDATE
   ┌──────────────────────────────────────┐
   │ React re-renders                     │
   │ Shows green success box with data:   │
   │ ✓ Backend Response:                  │
   │ {                                     │
   │   "message": "✓ Backend API...",    │
   │   "timestamp": "2024-01-15T...",    │
   │   "version": "1.0.0"                 │
   │ }                                     │
   └──────────────────────────────────────┘
```

---

## 🛠️ Technology Relationships

```
┌─────────────────────────────────────────────┐
│         Frontend Development Flow            │
└─────────────────────────────────────────────┘

TypeScript Code (.tsx files)
          ↓
        Vite
          ↓
    Babel (transpile to JS)
          ↓
    React compilation
          ↓
    Bundled JS + CSS
          ↓
    dist/ folder
          ↓
    Vercel deploys to CDN
          ↓
    User downloads from CDN
          ↓
    Browser runs React app


┌─────────────────────────────────────────────┐
│         Backend Development Flow             │
└─────────────────────────────────────────────┘

JavaScript Code (.js files)
          ↓
    Node.js directly interprets
          ↓
    Express routes requests
          ↓
    Execute handler functions
          ↓
    Send JSON responses
          ↓
    No bundling needed
          ↓
    Render runs on Linux server
          ↓
    User makes HTTP request
          ↓
    Backend responds with JSON
```

---

## 🚀 Performance Considerations

### Frontend Optimization
- Vite provides instant module replacement (HMR)
- React 19 with concurrent rendering
- Tailwind CSS for small bundle size
- Automatic code splitting

### Backend Optimization
- Express lightweight and fast
- JSON responses (no template rendering)
- CORS middleware (efficient)
- Stateless requests (easy to scale)

### Network Optimization
- CDN distribution (Vercel)
- HTTP/2 with HTTPS
- Minimal payload size
- Efficient API responses

---

## 🔍 Debugging Checklist

```
Backend Not Responding?
├── Check: npm run dev in backend/
├── Check: http://localhost:5000/health
├── Check: Console for errors
├── Check: Environment variables

Frontend Can't See Backend?
├── Check: VITE_API_URL in frontend/.env.local
├── Check: Backend CORS allows frontend URL
├── Check: Browser DevTools → Network tab
├── Check: Frontend Console for errors

Production Not Working?
├── Check: Environment variables on Vercel
├── Check: Environment variables on Render
├── Check: URLs match in both services
├── Check: Service logs for errors
```

---

**This architecture is now production-ready! 🎉**

See [DEPLOYMENT.md](./DEPLOYMENT.md) to go live.
