# Frontend Installation & Development

## Installation

```bash
cd frontend
npm install
```

## Development

```bash
npm run dev
```

App runs on: http://localhost:5173

## Build for Production

```bash
npm run build
```

Output: `frontend/dist`

## Environment Variables

Create `.env.local`:

```
VITE_API_URL=http://localhost:5000
VITE_GEMINI_API_KEY=your_api_key
```

For production (Vercel):
- Set `VITE_API_URL` to your Render backend URL

## Deployment on Vercel

1. Connect your Git repository to Vercel
2. Set Root Directory: `frontend`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Add Environment Variables in Vercel:
   - `VITE_API_URL=https://your-render-backend.onrender.com`

Done! Your frontend will auto-deploy on each push.
