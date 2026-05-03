
# Frontend-Backend Integration Guide

This guide explains how the frontend connects to the backend and how to add new API calls.

---

## 🔌 How They Connect

### Frontend (React)
```typescript
// File: frontend/src/App.tsx

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const response = await fetch(`${apiUrl}/api`);
```

### Backend (Express)
```javascript
// File: backend/server.js

app.get('/api', (req, res) => {
  res.json({
    message: '✓ Backend API is working correctly!',
    timestamp: new Date().toISOString(),
  });
});
```

**Connection Flow:**
1. Frontend reads `VITE_API_URL` from environment
2. Frontend makes HTTP request to backend
3. Backend receives request and responds with JSON
4. Frontend displays response

---

## 📡 Frontend Fetch Example

```typescript
// Basic GET request
const fetchFromBackend = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const response = await fetch(`${apiUrl}/api/crops`);
    
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    
    const data = await response.json();
    console.log(data);  // Use the data
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## 🔨 Adding New Endpoints

### Step 1: Create Backend Endpoint

**File: `backend/server.js`**

```javascript
// Add this before app.listen()

app.get('/api/weather', (req, res) => {
  const weatherData = {
    temperature: 28,
    humidity: 65,
    forecast: 'Rainy'
  };
  res.json({
    success: true,
    data: weatherData,
  });
});
```

### Step 2: Call from Frontend

**File: `frontend/src/App.tsx`**

```typescript
const getWeather = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const response = await fetch(`${apiUrl}/api/weather`);
    const data = await response.json();
    setWeatherData(data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## 📝 POST Request Example

### Backend (Express)

```javascript
app.post('/api/plants', express.json(), (req, res) => {
  const { name, type } = req.body;
  
  if (!name || !type) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields'
    });
  }
  
  res.json({
    success: true,
    message: 'Plant added successfully',
    data: { name, type, id: 1 }
  });
});
```

### Frontend (React)

```typescript
const addPlant = async (plantName, plantType) => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const response = await fetch(`${apiUrl}/api/plants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: plantName,
        type: plantType
      })
    });
    
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## 🛡️ Error Handling

### Handle Errors Properly

```typescript
const fetchData = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const response = await fetch(`${apiUrl}/api`);
    
    // Check if response is ok
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    if (error instanceof TypeError) {
      console.error('Network error - backend may be down');
    } else {
      console.error('Error:', error.message);
    }
  }
};
```

---

## 🌍 Environment Configuration

### Local Development

**frontend/.env.local:**
```
VITE_API_URL=http://localhost:5000
```

**backend/.env:**
```
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### Production

**Vercel (Frontend) Environment Variables:**
```
VITE_API_URL=https://your-render-backend.onrender.com
```

**Render (Backend) Environment Variables:**
```
PORT=5000
FRONTEND_URL=https://your-vercel-frontend.vercel.app
```

---

## ✅ CORS Configuration

Backend CORS setup (already configured):

```javascript
// backend/server.js

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
```

- Frontend can make requests to backend
- Credentials (cookies, auth) are allowed
- Uses `FRONTEND_URL` environment variable

---

## 🧪 Testing API Calls

### Using curl (Command Line)

```bash
# Test GET endpoint
curl http://localhost:5000/api

# Test POST endpoint
curl -X POST http://localhost:5000/api/plants \
  -H "Content-Type: application/json" \
  -d '{"name":"Wheat","type":"Grain"}'
```

### Using Postman (GUI)

1. Download Postman from https://www.postman.com
2. Create new request
3. Set method to GET/POST
4. Set URL to http://localhost:5000/api
5. Click Send
6. View response

### Using Frontend UI

1. Open http://localhost:5173
2. Click "Test API Connection"
3. View response on page

---

## 🔗 API Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "id": 1,
    "name": "Example"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message here",
  "path": "/api/endpoint"
}
```

---

## 📚 Common Headers

### Request Headers (Frontend → Backend)

```javascript
const headers = {
  'Content-Type': 'application/json',      // JSON data
  'Accept': 'application/json',             // Expect JSON
  'Authorization': 'Bearer <token>'         // Auth token (optional)
};
```

### Response Headers (Backend → Frontend)

```javascript
// Backend automatically sets:
'Content-Type': 'application/json'
'Access-Control-Allow-Origin': 'http://localhost:5173'
```

---

## 🚀 Performance Tips

### 1. Cache Responses

```typescript
const [crops, setCrops] = React.useState(null);
const [cached, setCached] = React.useState(false);

const getCrops = async () => {
  if (cached) return crops;  // Use cached data
  
  const data = await fetch(...);
  setCrops(data);
  setCached(true);
};
```

### 2. Debounce Requests

```typescript
import { useState, useEffect, useRef } from 'react';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};
```

### 3. Loading States

```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const fetchData = async () => {
  setLoading(true);
  setError(null);
  try {
    const data = await fetch(...);
    // Process data
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

---

## 🔐 Security Best Practices

### ✅ DO
- ✓ Use HTTPS in production
- ✓ Validate input on both frontend and backend
- ✓ Never expose sensitive keys in frontend code
- ✓ Use environment variables for API URLs
- ✓ Implement proper CORS
- ✓ Use secure headers

### ❌ DON'T
- ✗ Don't hardcode API URLs
- ✗ Don't expose API keys in code
- ✗ Don't trust frontend validation alone
- ✗ Don't use HTTP in production
- ✗ Don't allow all origins in CORS

---

## 📖 Examples Repository

See working examples in:
- **Frontend:** `frontend/src/App.tsx`
- **Backend:** `backend/server.js`

Both have complete implementations ready to modify!

---

**Next:** Read DEPLOYMENT.md to deploy to production!
