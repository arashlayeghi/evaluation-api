const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Evaluation API",
      version: "1.0.0",
      description:
        "REST API with JWT authentication, CRUD operations, pagination, and role management",
    },
    servers: [
      { url: "http://localhost:3000", description: "Development server" },
    ],
  },
  apis: ["./src/routes/*.js"],
};

module.exports = swaggerJsdoc(options);
