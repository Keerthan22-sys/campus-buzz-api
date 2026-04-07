// Node.js has built-in modules — no npm install needed
const http = require("http");

// Create a server that handles requests
const server = http.createServer((req, res) => {
  // req = incoming request (what the client sent)
  // res = outgoing response (what we send back)

  console.log(`${req.method} ${req.url}`);

  // Set response header — telling the browser "this is JSON"
  res.setHeader("Content-Type", "application/json");

  // Simple routing
  if (req.url === "/" && req.method === "GET") {
    res.statusCode = 200;
    res.end(JSON.stringify({ message: "Welcome to Campus Buzz API!" }));
  } else if (req.url === "/api/health" && req.method === "GET") {
    res.statusCode = 200;
    res.end(JSON.stringify({ status: "OK", timestamp: new Date().toISOString() }));
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Route not found" }));
  }
});

// Start listening on port 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});