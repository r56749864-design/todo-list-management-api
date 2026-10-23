const express = require("express");
const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const activityLogRoutes = require("./routes/activityLogRoutes");
const externalRoutes = require("./routes/externalRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const logger = require("./middleware/logger");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(logger);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/activity-logs", activityLogRoutes);
app.use("/api/external", externalRoutes);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Halaman utama
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Todo List Management API berhasil berjalan!",
  });
});

// Handler terakhir
app.use(notFound);
app.use(errorHandler);

module.exports = app;