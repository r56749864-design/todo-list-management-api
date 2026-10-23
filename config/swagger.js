
const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Todo List Management API",
      version: "1.0.0",
      description:
        "Dokumentasi API untuk pengelolaan Todo, kategori, autentikasi, dan aktivitas."
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local development server"
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Gunakan JWT yang diperoleh dari endpoint login."
        },
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",
          description:
            "API Key untuk endpoint eksternal."
        }
      }
    }
  },
  apis: [
    path.resolve(__dirname, "../routes/authRoutes.js"),
    path.resolve(__dirname, "../routes/todoRoutes.js"),
    path.resolve(__dirname, "../routes/categoryRoutes.js"),
    path.resolve(__dirname, "../routes/activityLogRoutes.js"),
    path.resolve(__dirname, "../routes/externalRoutes.js")
  ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
