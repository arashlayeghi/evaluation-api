const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

const config = require("./config");
const swaggerSpec = require("./swagger/swagger");
const authRoutes = require("./routes/auth");
const evaluationRoutes = require("./routes/evaluations");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/evaluations", evaluationRoutes);

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Error handler
app.use(errorHandler);

// Database connection and server start
mongoose
  .connect(config.mongoUri)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
      console.log(`Swagger docs: http://localhost:${config.port}/api-docs`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

module.exports = app;
