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

  CREATE TABLE IF NOT EXISTS schemes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    category TEXT,
    link TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    message TEXT,
    type TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed some initial data
const seedPrices = db.prepare("INSERT OR IGNORE INTO market_prices (cropName, price, location) VALUES (?, ?, ?)");
seedPrices.run("Rice", 25.5, "Hyderabad Market");
seedPrices.run("Tomato", 40.0, "Kolar Market");
seedPrices.run("Onion", 35.0, "Lasalgaon Market");
seedPrices.run("Maize", 18.0, "Davangere Market");
seedPrices.run("Wheat", 22.0, "Khanna Market");

const seedEquipment = db.prepare("INSERT OR IGNORE INTO equipment (name, type, pricePerDay, image) VALUES (?, ?, ?, ?)");
seedEquipment.run("John Deere Tractor", "Tractor", 1500, "https://picsum.photos/seed/tractor/400/300");
seedEquipment.run("Kubota Harvester", "Harvester", 5000, "https://picsum.photos/seed/harvester/400/300");
seedEquipment.run("Power Sprayer", "Sprayer", 300, "https://picsum.photos/seed/sprayer/400/300");

async function startServer() {
  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ server });
  const PORT = 3001;

  app.use(express.json());

  // WebSocket Broadcast
  const broadcast = (data: any) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  };

  wss.on("connection", (ws) => {
    console.log("New client connected");
    ws.send(JSON.stringify({ type: "WELCOME", message: "Connected to Smart Farmer Real-time Server" }));
  });

  // Auth Routes
  app.post("/api/auth/register", (req, res) => {
    const { fullName, mobile, village, cropType, password } = req.body;
    try {
      const stmt = db.prepare("INSERT INTO users (fullName, mobile, village, cropType, password) VALUES (?, ?, ?, ?, ?)");
      const info = stmt.run(fullName, mobile, village, cropType, password);
      res.json({ success: true, userId: info.lastInsertRowid });
    } catch (error) {
      res.status(400).json({ success: false, error: "Mobile number already registered" });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    const { mobile, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE mobile = ? AND password = ?").get(mobile, password);
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, error: "Invalid credentials" });
    }
  });

  // Marketplace Routes
  app.get("/api/marketplace", (req, res) => {
    const items = db.prepare("SELECT * FROM marketplace ORDER BY createdAt DESC").all();
    res.json(items);
  });

  app.post("/api/marketplace", (req, res) => {
    const { farmerId, cropName, quantity, pricePerKg, location, contact } = req.body;
    const stmt = db.prepare("INSERT INTO marketplace (farmerId, cropName, quantity, pricePerKg, location, contact) VALUES (?, ?, ?, ?, ?, ?)");
    stmt.run(farmerId, cropName, quantity, pricePerKg, location, contact);
    broadcast({ type: "NEW_LISTING", cropName, pricePerKg });
    res.json({ success: true });
  });

  // Schemes Routes
  app.get("/api/schemes", (req, res) => {
    const schemes = db.prepare("SELECT * FROM schemes ORDER BY createdAt DESC").all();
    res.json(schemes);
  });

  app.post("/api/schemes", (req, res) => {
    const { title, description, category, link } = req.body;
    const stmt = db.prepare("INSERT INTO schemes (title, description, category, link) VALUES (?, ?, ?, ?)");
    stmt.run(title, description, category, link);
    broadcast({ type: "NEW_SCHEME", title });
    res.json({ success: true });
  });

  // Alerts Routes
  app.get("/api/alerts", (req, res) => {
    const alerts = db.prepare("SELECT * FROM alerts ORDER BY createdAt DESC").all();
    res.json(alerts);
  });

  app.post("/api/alerts", (req, res) => {
    const { title, message, type } = req.body;
    const stmt = db.prepare("INSERT INTO alerts (title, message, type) VALUES (?, ?, ?)");
    stmt.run(title, message, type);
    broadcast({ type: "ALERT", title, message, alertType: type });
    res.json({ success: true });
  });

  // Equipment Routes
  app.get("/api/equipment", (req, res) => {
    const items = db.prepare("SELECT * FROM equipment").all();
    res.json(items);
  });

  // Market Price Routes
  app.get("/api/market-prices", (req, res) => {
    const prices = db.prepare("SELECT * FROM market_prices").all();
    res.json(prices);
  });

  app.post("/api/market-prices", (req, res) => {
    const { id, price } = req.body;
    const stmt = db.prepare("UPDATE market_prices SET price = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?");
    stmt.run(price, id);
    const updated = db.prepare("SELECT * FROM market_prices WHERE id = ?").get(id);
    broadcast({ type: "PRICE_UPDATE", cropName: updated.cropName, price: updated.price });
    res.json({ success: true });
  });

  // Emergency Routes
  app.post("/api/emergencies", (req, res) => {
    const { farmerId, type, description } = req.body;
    const stmt = db.prepare("INSERT INTO emergencies (farmerId, type, description) VALUES (?, ?, ?)");
    stmt.run(farmerId, type, description);
    broadcast({ type: "EMERGENCY_REPORTED", alertType: type });
    res.json({ success: true });
  });

  app.post("/api/admin/emergencies/resolve", (req, res) => {
    const { id } = req.body;
    const stmt = db.prepare("UPDATE emergencies SET status = 'resolved' WHERE id = ?");
    stmt.run(id);
    res.json({ success: true });
  });

  // Admin Routes
  app.get("/api/admin/farmers", (req, res) => {
    const farmers = db.prepare("SELECT * FROM users WHERE role = 'farmer'").all();
    res.json(farmers);
  });

  app.get("/api/admin/emergencies", (req, res) => {
    const emergencies = db.prepare(`
      SELECT e.*, u.fullName as farmerName, u.mobile 
      FROM emergencies e 
      JOIN users u ON e.farmerId = u.id 
      ORDER BY e.createdAt DESC
    `).all();
    res.json(emergencies);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
