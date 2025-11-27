require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/evaluations",
  jwtSecret: process.env.JWT_SECRET || "fallback-secret-key",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
};
