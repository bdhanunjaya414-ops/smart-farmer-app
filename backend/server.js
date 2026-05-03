import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARE
// ============================================

// Enable CORS - Allow requests from frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Parse JSON request bodies
app.use(express.json());

// ============================================
// ROUTES
// ============================================

/**
 * Health Check Endpoint
 * GET /health
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend server is running',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Main API Endpoint
 * GET /api
 */
app.get('/api', (req, res) => {
  res.json({
    message: '✓ Backend API is working correctly!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      api: 'GET /api',
    },
  });
});

/**
 * Example: Get Crop Information
 * GET /api/crops
 */
app.get('/api/crops', (req, res) => {
  const crops = [
    { id: 1, name: 'Wheat', yield: '5 tons/ha' },
    { id: 2, name: 'Rice', yield: '6 tons/ha' },
    { id: 3, name: 'Corn', yield: '8 tons/ha' },
  ];
  res.json({
    success: true,
    data: crops,
    timestamp: new Date().toISOString(),
  });
});

/**
 * Example: Get Market Prices
 * GET /api/market-prices
 */
app.get('/api/market-prices', (req, res) => {
  const prices = [
    { crop: 'Wheat', pricePerKg: 25, market: 'Delhi' },
    { crop: 'Rice', pricePerKg: 35, market: 'Punjab' },
    { crop: 'Corn', pricePerKg: 22, market: 'Haryana' },
  ];
  res.json({
    success: true,
    data: prices,
    timestamp: new Date().toISOString(),
  });
});

/**
 * 404 - Not Found Handler
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.path,
  });
});

/**
 * Error Handler
 */
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Unknown error',
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   Smart Farmer Backend API Server      ║
╚════════════════════════════════════════╝

✓ Server running on http://localhost:${PORT}
✓ CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}
✓ Environment: ${process.env.NODE_ENV || 'development'}

Available Endpoints:
  GET /health              - Health check
  GET /api                 - Main API response
  GET /api/crops           - Get crop information
  GET /api/market-prices   - Get market prices

Press Ctrl+C to stop the server
  `);
});
