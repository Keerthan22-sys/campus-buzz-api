const express = require("express");
const cors = require("cors");
const logger = require("./middleware/logger");

// Import routes (we'll create these later)
const postRoutes = require("./routes/posts");

// Create the Express app
const app = express();

// Middleware - runs on every request, in order to parse JSON and handle CORS
app.use(cors({
    origin: "http://localhost:5173", // Allow requests from the React frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
}));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Custom logger middleware - logs every request to the console
app.use(logger);

// Routes - tell the app to use our post routes for any requests to /api/posts

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({ status: "okkk" });
});

app.use("/api/posts", postRoutes);

// 404 handler - no route matched, so this runs
app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
});

// Error handler - catches all errors from routes and middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack trace for debugging
    res.status(500).json({ error: "Internal Server Error" }); // Send a generic error response
});

module.exports = app;