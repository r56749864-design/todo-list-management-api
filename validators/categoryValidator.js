const { body, param } = require("express-validator");

const createCategoryValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Nama kategori wajib diisi")
    .isLength({ max: 100 })
    .withMessage("Nama kategori maksimal 100 karakter"),

  body("description")
    .optional()
    .isString()
    .withMessage("Deskripsi harus berupa teks")
    .trim()
    .isLength({ max: 500 })
    .withMessage("Deskripsi maksimal 500 karakter"),
];

const updateCategoryValidator = [
  param("id")
    .isMongoId()
    .withMessage("ID kategori tidak valid"),

  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Nama kategori tidak boleh kosong")
    .isLength({ max: 100 })
    .withMessage("Nama kategori maksimal 100 karakter"),

  body("description")
    .optional()
    .isString()
    .withMessage("Deskripsi harus berupa teks")
    .trim()
    .isLength({ max: 500 })
    .withMessage("Deskripsi maksimal 500 karakter"),
];

const categoryIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("ID kategori tidak valid"),
];

module.exports = {
  createCategoryValidator,
  updateCategoryValidator,
  categoryIdValidator,
};
