
const express = require("express");
const router = express.Router();

const {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
  archiveTodo,
} = require("../controllers/todoController");

const authMiddleware = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

const {
  createTodoValidator,
  updateTodoValidator,
  todoIdValidator,
  listTodoValidator,
} = require("../validators/todoValidator");

/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: Pengelolaan daftar tugas
 */

// Semua endpoint Todo menggunakan JWT
router.use(authMiddleware);

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Membuat Todo baru
 *     tags: [Todos]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Belajar Node.js
 *               description:
 *                 type: string
 *                 example: Mempelajari Express dan MongoDB
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed]
 *                 example: pending
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 example: medium
 *               category:
 *                 type: string
 *                 nullable: true
 *                 example: 6ad81d0f2ed4d44646b62e0a
 *               due_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-11-01T10:00:00.000Z"
 *     responses:
 *       201:
 *         description: Todo berhasil dibuat
 *       400:
 *         description: Data Todo tidak valid
 *       401:
 *         description: Token tidak valid atau tidak tersedia
 */
router.post(
  "/",
  createTodoValidator,
  validateRequest,
  createTodo
);

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Mendapatkan daftar Todo
 *     description: Mendukung filtering, pencarian, pagination, serta sorting ASC dan DESC.
 *     tags: [Todos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, in_progress, completed]
 *         description: Filter berdasarkan status
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *         description: Filter berdasarkan prioritas
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter berdasarkan ID kategori
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Pencarian berdasarkan judul Todo
 *       - in: query
 *         name: archived
 *         schema:
 *           type: boolean
 *           default: false
 *         description: false untuk Todo aktif, true untuk Todo yang diarsipkan
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum:
 *             - created_at
 *             - updated_at
 *             - due_date
 *             - title
 *             - priority
 *           default: created_at
 *         description: Kolom pengurutan Todo
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: asc untuk urutan naik, desc untuk urutan turun
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Nomor halaman
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Jumlah data per halaman
 *     responses:
 *       200:
 *         description: Daftar Todo berhasil diambil
 *       400:
 *         description: Parameter query tidak valid
 *       401:
 *         description: Token tidak valid atau tidak tersedia
 */
router.get(
  "/",
  listTodoValidator,
  validateRequest,
  getTodos
);

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     summary: Mendapatkan detail Todo
 *     tags: [Todos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID Todo
 *     responses:
 *       200:
 *         description: Detail Todo berhasil diambil
 *       400:
 *         description: ID Todo tidak valid
 *       401:
 *         description: Token tidak valid atau tidak tersedia
 *       404:
 *         description: Todo tidak ditemukan
 */
router.get(
  "/:id",
  todoIdValidator,
  validateRequest,
  getTodoById
);

/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     summary: Memperbarui Todo
 *     tags: [Todos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID Todo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Belajar Express.js
 *               description:
 *                 type: string
 *                 example: Memahami routing dan middleware
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed]
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               category:
 *                 type: string
 *                 nullable: true
 *               due_date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Todo berhasil diperbarui
 *       400:
 *         description: Data atau ID Todo tidak valid
 *       401:
 *         description: Token tidak valid atau tidak tersedia
 *       404:
 *         description: Todo tidak ditemukan
 */
router.put(
  "/:id",
  updateTodoValidator,
  validateRequest,
  updateTodo
);

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Menghapus Todo secara permanen
 *     tags: [Todos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID Todo
 *     responses:
 *       200:
 *         description: Todo berhasil dihapus
 *       400:
 *         description: ID Todo tidak valid
 *       401:
 *         description: Token tidak valid atau tidak tersedia
 *       404:
 *         description: Todo tidak ditemukan
 */
router.delete(
  "/:id",
  todoIdValidator,
  validateRequest,
  deleteTodo
);

/**
 * @swagger
 * /api/todos/{id}/archive:
 *   patch:
 *     summary: Mengarsipkan Todo
 *     tags: [Todos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID Todo
 *     responses:
 *       200:
 *         description: Todo berhasil diarsipkan
 *       400:
 *         description: ID Todo tidak valid
 *       401:
 *         description: Token tidak valid atau tidak tersedia
 *       404:
 *         description: Todo tidak ditemukan
 */
router.patch(
  "/:id/archive",
  todoIdValidator,
  validateRequest,
  archiveTodo
);

module.exports = router;
