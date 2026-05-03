# Smart Farmer App - Getting Started Guide

This is a complete working setup with separate frontend and backend.

## 📁 Folder Structure

```
project/
├── frontend/          ← React + Vite app
├── backend/           ← Node.js + Express API
├── README.md          ← Main documentation
└── DEPLOYMENT.md      ← Production deployment guide
```

---

## 🚀 Quick Start (5 minutes)

### Terminal 1: Start Backend

```bash
cd backend
npm install
npm run dev
```

✓ Backend runs on: http://localhost:5000

### Terminal 2: Start Frontend

```bash
cd frontend
npm install
npm run dev
```

✓ Frontend runs on: http://localhost:5173

### Test It!

1. Open http://localhost:5173
2. Click **"Test API Connection"** button
3. Should show green ✓ if working

---

## 📖 Full Documentation

- [README.md](./README.md) - Project overview & local development
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment to Vercel & Render
- [frontend/README.md](./frontend/README.md) - Frontend specific
- [backend/README.md](./backend/README.md) - Backend specific

---

## 🎯 What's Included

✓ **Frontend**
- React 19 + Vite
- TypeScript
- Tailwind CSS
- API connection example
- Ready for Vercel

✓ **Backend**
- Express.js
- CORS enabled
- Multiple example endpoints
- Environment configuration
- Ready for Render

✓ **Documentation**
- Step-by-step local setup
- Complete deployment guide
- Troubleshooting tips
- Production checklist

---

## 📝 Next Steps

1. **Local Development** (Now)
   - Backend: `cd backend && npm install && npm run dev`
   - Frontend: `cd frontend && npm install && npm run dev`

2. **Test Connection**
   - Open http://localhost:5173
   - Click test button

3. **When Ready - Deploy**
   - Follow [DEPLOYMENT.md](./DEPLOYMENT.md)
   - Backend → Render
   - Frontend → Vercel

---

**Start with:** `cd backend && npm run dev` in one terminal, then `cd frontend && npm run dev` in another!
