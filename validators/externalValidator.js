
const { query } = require("express-validator");

const externalActivityLogsValidator = [
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
    .isIn([
      "todo_created",
      "todo_updated",
      "todo_deleted",
      "todo_archived",
      "category_created",
      "category_updated",
      "category_deleted",
      "user_registered",
      "user_login",
    ])
    .withMessage("Filter action tidak valid"),
];

module.exports = { externalActivityLogsValidator };
