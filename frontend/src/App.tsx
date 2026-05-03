import React from 'react';
import './App.css';

interface ApiResponse {
  message: string;
  timestamp?: string;
}

export default function App() {
  const [data, setData] = React.useState<ApiResponse | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch data from backend API
  const fetchFromBackend = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const jsonData = await response.json();
      setData(jsonData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error fetching from backend:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🌾 Smart Farmer App
          </h1>
          <p className="text-gray-600">
            Production-Ready Full-Stack Architecture
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Backend Connection Test
          </h2>
          
          <button
            onClick={fetchFromBackend}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
          >
            {loading ? 'Connecting...' : 'Test API Connection'}
          </button>

          {/* Results */}
          {error && (
            <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {data && (
            <div className="mt-6 p-4 bg-green-100 border border-green-400 rounded">
              <p className="font-semibold text-green-800">✓ Backend Response:</p>
              <pre className="mt-2 bg-white p-3 rounded text-sm overflow-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Architecture Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              ⚛️ Frontend
            </h3>
            <ul className="text-gray-600 space-y-2">
              <li>✓ React 19</li>
              <li>✓ Vite (Fast build tool)</li>
              <li>✓ TypeScript</li>
              <li>✓ Tailwind CSS</li>
              <li>✓ Deployed on Vercel</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              🚀 Backend
            </h3>
            <ul className="text-gray-600 space-y-2">
              <li>✓ Node.js + Express</li>
              <li>✓ RESTful API</li>
              <li>✓ CORS enabled</li>
              <li>✓ Environment variables</li>
              <li>✓ Deployed on Render</li>
            </ul>
          </div>
        </div>

        {/* Connection Details */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            📡 API Configuration
          </h3>
          <div className="text-blue-800 text-sm space-y-2">
            <p>
              <strong>Frontend API URL:</strong>{' '}
              {import.meta.env.VITE_API_URL || 'http://localhost:5000'}
            </p>
            <p>
              <strong>Local Development:</strong> Backend runs on http://localhost:5000
            </p>
            <p>
              <strong>Production:</strong> Update VITE_API_URL in your Vercel environment
              variables to point to your Render backend URL
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
