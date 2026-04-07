const { PrismaClient } = require("@prisma/client");

// Create a single PrismaClient instance for the entire app
const prisma = new PrismaClient({
    log: ["query", "error"], // Log all queries and errors for debugging
});

module.exports = prisma;