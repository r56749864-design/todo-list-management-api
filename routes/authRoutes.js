
const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getMe,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const {
  registerValidator,
  loginValidator,
} = require("../validators/authValidator");

const validateRequest = require("../middleware/validateRequest");

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Autentikasi dan akun pengguna
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Mendaftarkan pengguna baru
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Pengguna Baru
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: PasswordContoh123!
 *     responses:
 *       201:
 *         description: Pengguna berhasil didaftarkan
 *       400:
 *         description: Data pendaftaran tidak valid
 *       409:
 *         description: Email sudah terdaftar
 */
router.post(
  "/register",
  registerValidator,
  validateRequest,
  register
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login pengguna
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: PasswordContoh123!
 *     responses:
 *       200:
 *         description: Login berhasil dan token autentikasi dikembalikan
 *       400:
 *         description: Data login tidak valid
 *       401:
 *         description: Email atau password salah
 */
router.post(
  "/login",
  loginValidator,
  validateRequest,
  login
);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Mendapatkan profil pengguna yang sedang login
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profil pengguna berhasil diambil
 *       401:
 *         description: Token tidak tersedia atau tidak valid
 */
router.get("/me", authMiddleware, getMe);

module.exports = router;
