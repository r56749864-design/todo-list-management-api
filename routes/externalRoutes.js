
const express = require("express");
const router = express.Router();

const apiKeyMiddleware = require("../middleware/apiKeyMiddleware");
const validateRequest = require("../middleware/validateRequest");

const {
  getExternalSummary,
  getExternalActivityLogs,
} = require("../controllers/externalController");

const {
  externalActivityLogsValidator,
} = require("../validators/externalValidator");

/**
 * @swagger
 * tags:
 *   name: External API
 *   description: Endpoint ringkasan dan aktivitas untuk integrasi eksternal
 */

/**
 * @swagger
 * /api/external/summary:
 *   get:
 *     summary: Mendapatkan ringkasan statistik Todo
 *     description: Mengambil ringkasan statistik melalui API key.
 *     tags: [External API]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Ringkasan statistik berhasil diambil
 *       401:
 *         description: API key tidak ada atau tidak valid
 *       500:
 *         description: Terjadi kesalahan pada server
 */

/**
 * @swagger
 * /api/external/activity-logs:
 *   get:
 *     summary: Mendapatkan activity logs untuk integrasi eksternal
 *     description: Mengambil riwayat aktivitas dengan parameter yang didukung validator.
 *     tags: [External API]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Activity logs berhasil diambil
 *       400:
 *         description: Parameter request tidak valid
 *       401:
 *         description: API key tidak ada atau tidak valid
 *       500:
 *         description: Terjadi kesalahan pada server
 */

router.use(apiKeyMiddleware);

router.get("/summary", getExternalSummary);

router.get(
  "/activity-logs",
  externalActivityLogsValidator,
  validateRequest,
  getExternalActivityLogs
);

module.exports = router;
