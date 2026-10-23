const { body } = require("express-validator");

const registerValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Nama wajib diisi.")
    .isLength({ max: 100 })
    .withMessage("Nama maksimal 100 karakter."),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email wajib diisi.")
    .isEmail()
    .withMessage("Format email tidak valid.")
    .normalizeEmail(),

  body("password")
    .isString()
    .withMessage("Password harus berupa teks.")
    .isLength({ min: 8, max: 72 })
    .withMessage("Password harus 8-72 karakter."),
];

const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email wajib diisi.")
    .isEmail()
    .withMessage("Format email tidak valid.")
    .normalizeEmail(),

  body("password")
    .isString()
    .withMessage("Password harus berupa teks.")
    .notEmpty()
    .withMessage("Password wajib diisi."),
];

module.exports = {
  registerValidator,
  loginValidator,
};
