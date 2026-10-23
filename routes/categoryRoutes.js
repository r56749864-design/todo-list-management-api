
const express = require("express");
const router = express.Router();

const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  archiveCategory,
} = require("../controllers/categoryController");

const authMiddleware = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

const {
  createCategoryValidator,
  updateCategoryValidator,
  categoryIdValidator,
} = require("../validators/categoryValidator");

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Pengelolaan kategori Todo
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         name:
 *           type: string
 *           example: Pekerjaan
 *         description:
 *           type: string
 *           example: Daftar tugas pekerjaan
 */

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Membuat kategori baru
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Pekerjaan
 *               description:
 *                 type: string
 *                 example: Daftar tugas pekerjaan
 *     responses:
 *       201:
 *         description: Kategori berhasil dibuat
 *       400:
 *         description: Validasi input gagal
 *       401:
 *         description: Tidak terautentikasi
 *   get:
 *     summary: Mendapatkan daftar kategori
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar kategori berhasil diambil
 *       401:
 *         description: Tidak terautentikasi
 */

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Mendapatkan kategori berdasarkan ID
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID kategori
 *     responses:
 *       200:
 *         description: Detail kategori berhasil diambil
 *       400:
 *         description: ID kategori tidak valid
 *       404:
 *         description: Kategori tidak ditemukan
 *   put:
 *     summary: Memperbarui kategori
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID kategori
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Kuliah
 *               description:
 *                 type: string
 *                 example: Daftar tugas kuliah
 *     responses:
 *       200:
 *         description: Kategori berhasil diperbarui
 *       400:
 *         description: Validasi input gagal
 *       404:
 *         description: Kategori tidak ditemukan
 *   delete:
 *     summary: Mengarsipkan kategori
 *     description: Mengarsipkan kategori, bukan menghapusnya secara permanen.
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID kategori
 *     responses:
 *       200:
 *         description: Kategori berhasil diarsipkan
 *       400:
 *         description: ID kategori tidak valid
 *       404:
 *         description: Kategori tidak ditemukan
 */

router.use(authMiddleware);

router.post(
  "/",
  createCategoryValidator,
  validateRequest,
  createCategory
);

router.get("/", getCategories);

router.get(
  "/:id",
  categoryIdValidator,
  validateRequest,
  getCategoryById
);

router.put(
  "/:id",
  updateCategoryValidator,
  validateRequest,
  updateCategory
);

router.delete(
  "/:id",
  categoryIdValidator,
  validateRequest,
  archiveCategory
);

module.exports = router;
