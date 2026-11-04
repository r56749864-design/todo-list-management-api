
const { body, param, query } = require("express-validator");

// Validasi saat membuat Todo
const createTodoValidator = [
  body("title")
    .isString()
    .withMessage("Judul todo harus berupa teks")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Judul todo wajib diisi")
    .bail()
    .isLength({ max: 150 })
    .withMessage("Judul maksimal 150 karakter"),

  body("description")
    .optional()
    .isString()
    .withMessage("Deskripsi harus berupa teks")
    .bail()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Deskripsi maksimal 2000 karakter"),

  body("status")
    .optional()
    .isIn(["pending", "in_progress", "completed"])
    .withMessage("Status todo tidak valid"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Prioritas todo tidak valid"),

  body("category")
    .optional({ values: "null" })
    .isMongoId()
    .withMessage("ID kategori tidak valid"),

  body("due_date")
    .optional({ values: "null" })
    .isISO8601()
    .withMessage("Tanggal jatuh tempo harus berformat ISO 8601"),
];

// Validasi saat mengubah Todo
const updateTodoValidator = [
  param("id")
    .isMongoId()
    .withMessage("ID todo tidak valid"),

  body("title")
    .optional()
    .isString()
    .withMessage("Judul harus berupa teks")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Judul tidak boleh kosong")
    .bail()
    .isLength({ max: 150 })
    .withMessage("Judul maksimal 150 karakter"),

  body("description")
    .optional()
    .isString()
    .withMessage("Deskripsi harus berupa teks")
    .bail()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Deskripsi maksimal 2000 karakter"),

  body("status")
    .optional()
    .isIn(["pending", "in_progress", "completed"])
    .withMessage("Status todo tidak valid"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Prioritas todo tidak valid"),

  body("category")
    .optional({ values: "null" })
    .isMongoId()
    .withMessage("ID kategori tidak valid"),

  body("due_date")
    .optional({ values: "null" })
    .isISO8601()
    .withMessage("Tanggal jatuh tempo harus berformat ISO 8601"),
];

// Validasi ID Todo
const todoIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("ID todo tidak valid"),
];

// Validasi pencarian, filter, sorting, dan pagination
const listTodoValidator = [
  query("search")
    .optional()
    .isString()
    .withMessage("Pencarian harus berupa teks")
    .bail()
    .trim(),

  query("status")
    .optional()
    .isIn(["pending", "in_progress", "completed"])
    .withMessage("Filter status tidak valid"),

  query("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Filter prioritas tidak valid"),

  query("category")
    .optional()
    .isMongoId()
    .withMessage("ID kategori tidak valid"),

  query("archived")
    .optional()
    .isIn(["true", "false"])
    .withMessage("Filter archived harus true atau false"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page harus berupa angka minimal 1"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit harus antara 1 sampai 100"),

  query("sort")
    .optional()
    .isIn([
      "created_at",
      "updated_at",
      "due_date",
      "title",
      "priority",
      "-created_at",
      "-updated_at",
      "-due_date",
      "-title",
      "-priority",
    ])
    .withMessage("Kolom pengurutan tidak valid"),

  query("order")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Order harus asc atau desc"),
];

module.exports = {
  createTodoValidator,
  updateTodoValidator,
  todoIdValidator,
  listTodoValidator,
};
