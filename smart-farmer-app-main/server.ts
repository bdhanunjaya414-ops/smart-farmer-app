import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { WebSocketServer, WebSocket } from "ws";
import { createServer } from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("smart_farmer.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullName TEXT,
    mobile TEXT UNIQUE,
    village TEXT,
    cropType TEXT,
    password TEXT,
    role TEXT DEFAULT 'farmer'
  );

  CREATE TABLE IF NOT EXISTS marketplace (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    farmerId INTEGER,
    cropName TEXT,
    quantity TEXT,
    pricePerKg REAL,
    location TEXT,
    contact TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS equipment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    type TEXT,
    pricePerDay REAL,
    availability BOOLEAN DEFAULT 1,
    image TEXT
  );

  CREATE TABLE IF NOT EXISTS emergencies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    farmerId INTEGER,
    type TEXT,
    description TEXT,
    status TEXT DEFAULT 'pending',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS market_prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cropName TEXT,
    price REAL,
    location TEXT,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed Data
db.prepare("INSERT OR IGNORE INTO market_prices (cropName, price, location) VALUES (?, ?, ?)").run("Tomato", 40, "Kolar");
db.prepare("INSERT OR IGNORE INTO market_prices (cropName, price, location) VALUES (?, ?, ?)").run("Rice", 25, "Hyderabad");

async function startServer() {
  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ server });

  const PORT = process.env.PORT || 3001;

  app.use(express.json());

  const broadcast = (data) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  };

  wss.on("connection", (ws) => {
    ws.send(JSON.stringify({ message: "Connected Successfully" }));
  });

  // Register
  app.post("/api/auth/register", (req, res) => {
    const { fullName, mobile, village, cropType, password } = req.body;
    try {
      const stmt = db.prepare(
        "INSERT INTO users (fullName, mobile, village, cropType, password) VALUES (?, ?, ?, ?, ?)"
      );
      const info = stmt.run(fullName, mobile, village, cropType, password);
      res.json({ success: true, userId: info.lastInsertRowid });
    } catch {
      res.status(400).json({ success: false, error: "Mobile already registered" });
    }
  });

  // Login
  app.post("/api/auth/login", (req, res) => {
    const { mobile, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE mobile = ? AND password = ?").get(mobile, password);

    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, error: "Invalid credentials" });
    }
  });

  // Market Prices
  app.get("/api/market-prices", (req, res) => {
    const prices = db.prepare("SELECT * FROM market_prices").all();
    res.json(prices);
  });

  // Marketplace Add
  app.post("/api/marketplace", (req, res) => {
    const { farmerId, cropName, quantity, pricePerKg, location, contact } = req.body;

    const stmt = db.prepare(
      "INSERT INTO marketplace (farmerId, cropName, quantity, pricePerKg, location, contact) VALUES (?, ?, ?, ?, ?, ?)"
    );

    stmt.run(farmerId, cropName, quantity, pricePerKg, location, contact);

    broadcast({ type: "NEW_LISTING", cropName });

    res.json({ success: true });
  });

  // Marketplace Get
  app.get("/api/marketplace", (req, res) => {
    const data = db.prepare("SELECT * FROM marketplace").all();
    res.json(data);
  });

  // Equipment
  app.get("/api/equipment", (req, res) => {
    res.json([
      {
        name: "John Deere Tractor",
        pricePerDay: 1500
      }
    ]);
  });

  // Production
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "dist")));

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });

    app.use(vite.middlewares);
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();