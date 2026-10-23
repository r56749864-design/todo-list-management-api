
const { query } = require("express-validator");

const activityLogValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page harus berupa angka minimal 1"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit harus antara 1 sampai 100"),

  query("action")
    .optional()
    .isString()
    .withMessage("Action harus berupa teks")
    .trim()
    .isLength({ max: 100 })
    .withMessage("Action maksimal 100 karakter"),
];

module.exports = { activityLogValidator };
