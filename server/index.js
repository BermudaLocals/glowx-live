const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4500;
const JWT_SECRET = process.env.JWT_SECRET || "glowx-secret-key-2026";

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// In-memory user store (for demo - replace with database in production)
let users = [];

// Health endpoint
app.get("/health", (req, res) => {
    res.json({
        status: "live",
        service: "glowx-adult-platform",
        auth: true,
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get("/", (req, res) => {
    res.json({
        status: "online",
        brand: "GlowX",
        port: PORT,
        authentication: "active",
        endpoints: [
            "GET /health",
            "POST /auth/register",
            "POST /auth/login",
            "GET /auth/me",
            "GET /dashboard",
            "POST /auth/logout"
        ]
    });
});

// Dashboard HTML
app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/glowx-frontend.html"));
});

// Landing page
app.get("/landing", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/glowx-landing-v2.html"));
});

// User registration
app.post("/auth/register", async (req, res) => {
    try {
        const { email, password, name } = req.body;
        
        if (!email || !password || !name) {
            return res.status(400).json({ error: "Please provide email, password, and name" });
        }
        
        // Check if user exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        const user = {
            id: users.length + 1,
            email,
            password: hashedPassword,
            name,
            createdAt: new Date().toISOString()
        };
        
        users.push(user);
        
        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: "7d" }
        );
        
        res.status(201).json({
            message: "Registration successful",
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
        
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Registration failed" });
    }
});

// User login
app.post("/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: "Please provide email and password" });
        }
        
        // Find user
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        
        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: "7d" }
        );
        
        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
        
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Login failed" });
    }
});

// Get current user
app.get("/auth/me", (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }
        
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = users.find(u => u.id === decoded.id);
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt
            }
        });
        
    } catch (error) {
        console.error("Auth error:", error);
        res.status(401).json({ error: "Invalid token" });
    }
});

// Logout
app.post("/auth/logout", (req, res) => {
    res.json({ message: "Logout successful" });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 GLOWX Adult Site with Authentication running on port ${PORT}`);
    console.log(`🔐 Authentication endpoints active`);
    console.log(`🌐 Live at: https://glowx.live`);
});
