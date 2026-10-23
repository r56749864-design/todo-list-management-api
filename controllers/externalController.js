const Todo = require("../models/Todo");
const Category = require("../models/Category");
const ActivityLog = require("../models/ActivityLog");

// GET /api/external/summary
const getExternalSummary = async (req, res) => {
  try {
    const [
      totalTodos,
      todosByStatus,
      totalCategories,
    ] = await Promise.all([
      Todo.countDocuments({ archived: false }),
      Todo.aggregate([
        { $match: { archived: false } },
        { $group: { _id: "$status", total: { $sum: 1 } } },
      ]),
      Category.countDocuments({ archived: false }),
    ]);

    const statusSummary = {
      pending: 0,
      in_progress: 0,
      completed: 0,
    };

    todosByStatus.forEach((item) => {
      statusSummary[item._id] = item.total;
    });

    return res.status(200).json({
      success: true,
      data: {
        totalTodos,
        todosByStatus: statusSummary,
        totalCategories,
      },
    });
  } catch (error) {
    console.error("Gagal mengambil ringkasan eksternal:", error.message);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil ringkasan data.",
    });
  }
};

// GET /api/external/activity-logs
const getExternalActivityLogs = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit, 10) || 10)
    );

    const filter = { archived: false };

    if (req.query.action) {
      const allowedActions = [
        "todo_created",
        "todo_updated",
        "todo_deleted",
        "todo_archived",
        "category_created",
        "category_updated",
        "category_deleted",
        "user_registered",
        "user_login",
      ];

      if (!allowedActions.includes(req.query.action)) {
        return res.status(400).json({
          success: false,
          message: "Filter action tidak valid.",
        });
      }

      filter.action = req.query.action;
    }

    const [logs, total] = await Promise.all([
      ActivityLog.find(filter)
        .select("action description created_at")
        .sort({ created_at: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      ActivityLog.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Gagal mengambil log eksternal:", error.message);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil riwayat aktivitas.",
    });
  }
};

module.exports = {
  getExternalSummary,
  getExternalActivityLogs,
};
