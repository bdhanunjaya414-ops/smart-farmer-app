# Backend Installation & Development

## Installation

```bash
cd backend
npm install
```

## Development

```bash
npm run dev
```

Server runs on: http://localhost:5000

## Production

```bash
npm start
```

## Environment Variables

Create `.env`:

```
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-vercel-frontend.vercel.app
GEMINI_API_KEY=your_api_key
```

## Deployment on Render

### Step 1: Create Render Account
- Go to https://render.com
- Sign up with GitHub

### Step 2: Create New Web Service
- Click "New" → "Web Service"
- Connect your GitHub repository
- Select the repository

### Step 3: Configure Render
- **Name:** smart-farmer-backend
- **Environment:** Node
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Root Directory:** `backend`

### Step 4: Add Environment Variables
In Render dashboard, go to Environment:
```
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-vercel-frontend.vercel.app
GEMINI_API_KEY=your_api_key
```

### Step 5: Deploy
- Click "Create Web Service"
- Render will auto-deploy

Your backend URL: `https://smart-farmer-backend.onrender.com`

## API Endpoints

### Health Check
```bash
curl http://localhost:5000/health
```

### Main API
```bash
curl http://localhost:5000/api
```

### Get Crops
```bash
curl http://localhost:5000/api/crops
```

### Get Market Prices
```bash
curl http://localhost:5000/api/market-prices
```

## Testing with Frontend

Update frontend `.env.local`:
```
VITE_API_URL=http://localhost:5000
```

Then click "Test API Connection" in the frontend.

## CORS Configuration

Backend allows requests from:
- Development: `http://localhost:5173`
- Production: Update `FRONTEND_URL` in environment variables

Modify in `server.js` line 15 if needed.
