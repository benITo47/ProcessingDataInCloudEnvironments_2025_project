// Load environment variables
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { initDriver } = require("./src/services/neo4jService");
const mainRouter = require("./src/api/routes");

const app = express();
const port = process.env.PORT || 2067;

// Initialize Neo4j Driver
initDriver();

// Global Middleware
app.use(cors());
app.use(express.json());

// Main API Router
app.use("/api", mainRouter);

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
