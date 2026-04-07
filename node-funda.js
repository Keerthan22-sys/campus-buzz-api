// fs (File System) module is used to read the API key from a file
const fs = require("fs");

// Read the API key from a file (make sure to create api_key.txt with your Funda API key)
const apiKey = fs.readFileSync("api_key.txt", "utf-8").trim();

// Write a file
fs.writeFileSync("api_key.txt", "your-funda-api-key-here");

// path - handle file paths safely across different operating systems
const path = require("path");
const filePath = path.join(__dirname, "api_key.txt");

// os - system information
const os = require("os");

console.log("Operating System:", os.platform());
console.log("CPU Architecture:", os.arch());
console.log("Total Memory:", os.totalmem());
console.log("Free Memory:", os.freemem());