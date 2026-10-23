
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");
const {
  getActivityLogs,
} = require("../controllers/activityLogController");

const {
  activityLogValidator,
} = require("../validators/activityLogValidator");

/**
 * @swagger
 * tags:
 *   name: Activity Logs
 *   description: Riwayat aktivitas pengguna pada Todo List API
 */

/**
 * @swagger
 * /api/activity-logs:
 *   get:
 *     summary: Mendapatkan riwayat aktivitas
 *     description: Mengambil catatan aktivitas yang tersedia dengan parameter filter dan pagination sesuai validator.
 *     tags: [Activity Logs]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Riwayat aktivitas berhasil diambil
 *       400:
 *         description: Parameter filter atau pagination tidak valid
 *       401:
 *         description: Token autentikasi tidak ada atau tidak valid
 *       500:
 *         description: Terjadi kesalahan pada server
 */

router.use(authMiddleware);

router.get(
  "/",
  activityLogValidator,
  validateRequest,
  getActivityLogs
);

module.exports = router;
