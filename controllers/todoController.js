
const mongoose = require("mongoose");

const Todo = require("../models/Todo");
const Category = require("../models/Category");
const ActivityLog = require("../models/ActivityLog");

// Membuat snapshot kondisi Todo saat aktivitas terjadi
const createTodoSnapshot = (todo) => {
  if (!todo) return null;

  return {
    title: todo.title,
    description: todo.description,
    status: todo.status,
    priority: todo.priority,
    due_date: todo.due_date,
    category: todo.category,
    archived: todo.archived,
  };
};

// Membuat Todo baru
const createTodo = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      due_date,
      category,
    } = req.body;

    // Pastikan kategori milik user yang sedang login
    if (category) {
      if (!mongoose.isValidObjectId(category)) {
        return res.status(400).json({
          success: false,
          message: "ID kategori tidak valid",
        });
      }

      const categoryExists = await Category.findOne({
        _id: category,
        user: req.user.id,
        archived: false,
      });

      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: "Kategori tidak ditemukan atau bukan milik Anda",
        });
      }
    }

    const todo = await Todo.create({
      title,
      description,
      status,
      priority,
      due_date,
      category: category || null,
      user: req.user.id,
      created_by: req.user.id,
      updated_by: req.user.id,
    });

    await ActivityLog.create({
      user: req.user.id,
      action: "todo_created",
      description: `Membuat todo: ${todo.title}`,
      related_todo: todo._id,
      snapshot: createTodoSnapshot(todo),
      created_by: req.user.id,
      updated_by: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Todo berhasil dibuat",
      data: todo,
    });
  } catch (error) {
    console.error("Create todo error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Gagal membuat todo",
    });
  }
};

// Mengambil daftar Todo milik user
const getTodos = async (req, res) => {
  try {
    const {
      search,
      status,
      priority,
      category,
      page = "1",
      limit = "10",
      sort = "created_at",
      order = "desc",
      archived = "false",
    } = req.query;

    // Validasi archived
    if (archived !== "true" && archived !== "false") {
      return res.status(400).json({
        success: false,
        message: "Parameter archived harus true atau false",
      });
    }

    // Validasi status
    const allowedStatuses = [
      "pending",
      "in_progress",
      "completed",
    ];

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Parameter status tidak valid",
      });
    }

    // Validasi priority
    const allowedPriorities = ["low", "medium", "high"];

    if (priority && !allowedPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "Parameter priority tidak valid",
      });
    }

    // Validasi sorting
    const allowedSort = [
      "created_at",
      "updated_at",
      "due_date",
      "title",
      "priority",
    ];

    // Sort dengan awalan minus berarti descending
    const isDescending = sort.startsWith("-");
    const sortField = isDescending ? sort.slice(1) : sort;

    if (!allowedSort.includes(sortField)) {
      return res.status(400).json({
        success: false,
        message: "Parameter sort tidak valid",
      });
    }

    // Validasi order tetap berlaku untuk format sorting biasa
    if (order !== "asc" && order !== "desc") {
      return res.status(400).json({
        success: false,
        message: "Parameter order harus asc atau desc",
      });
    }

    // Jika sort diawali minus, descending menjadi prioritas.
    // Jika tidak, gunakan parameter order seperti sebelumnya.
    const sortOrder = isDescending
      ? -1
      : order === "asc"
        ? 1
        : -1;

    // Validasi pagination
    const pageNumber = Number(page);
    const pageSize = Number(limit);

    if (!Number.isInteger(pageNumber) || pageNumber < 1) {
      return res.status(400).json({
        success: false,
        message: "Parameter page harus berupa bilangan bulat minimal 1",
      });
    }

    if (
      !Number.isInteger(pageSize) ||
      pageSize < 1 ||
      pageSize > 100
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Parameter limit harus berupa bilangan bulat antara 1 sampai 100",
      });
    }

    // Filter Todo milik user yang login
    const filter = {
      user: req.user.id,
      archived: archived === "true",
    };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    // Filter kategori
    if (category) {
      if (!mongoose.isValidObjectId(category)) {
        return res.status(400).json({
          success: false,
          message: "ID kategori tidak valid",
        });
      }

      filter.category = category;
    }

    // Search berdasarkan judul
    if (search && search.trim()) {
      const escapedSearch = search
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      filter.title = {
        $regex: escapedSearch,
        $options: "i",
      };
    }

    // Query data dan hitung total secara bersamaan
    const [todos, total] = await Promise.all([
      Todo.find(filter)
        .sort({ [sortField]: sortOrder })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize),

      Todo.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: todos,
      pagination: {
        total,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Get todos error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil daftar todo",
    });
  }
};

// Mengambil satu Todo aktif berdasarkan ID
const getTodoById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "ID todo tidak valid",
      });
    }

    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user.id,
      archived: false,
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    console.error("Get todo error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil todo",
    });
  }
};

// Mengubah Todo
const updateTodo = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "ID todo tidak valid",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "status",
      "priority",
      "due_date",
      "category",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Tidak ada data todo yang diubah",
      });
    }

    if (
      Object.prototype.hasOwnProperty.call(updates, "category") &&
      updates.category !== null &&
      updates.category !== ""
    ) {
      if (!mongoose.isValidObjectId(updates.category)) {
        return res.status(400).json({
          success: false,
          message: "ID kategori tidak valid",
        });
      }

      const categoryExists = await Category.findOne({
        _id: updates.category,
        user: req.user.id,
        archived: false,
      });

      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: "Kategori tidak ditemukan atau bukan milik Anda",
        });
      }
    }

    if (updates.category === "") {
      updates.category = null;
    }

    const todo = await Todo.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
        archived: false,
      },
      {
        $set: {
          ...updates,
          updated_by: req.user.id,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo tidak ditemukan",
      });
    }

    await ActivityLog.create({
      user: req.user.id,
      action: "todo_updated",
      description: `Memperbarui todo: ${todo.title}`,
      related_todo: todo._id,
      snapshot: createTodoSnapshot(todo),
      created_by: req.user.id,
      updated_by: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "Todo berhasil diperbarui",
      data: todo,
    });
  } catch (error) {
    console.error("Update todo error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Gagal memperbarui todo",
    });
  }
};

// Menghapus Todo secara permanen
const deleteTodo = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "ID todo tidak valid",
      });
    }

    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
      archived: false,
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo tidak ditemukan",
      });
    }

    await ActivityLog.create({
      user: req.user.id,
      action: "todo_deleted",
      description: `Menghapus todo: ${todo.title}`,
      related_todo: todo._id,
      snapshot: createTodoSnapshot(todo),
      created_by: req.user.id,
      updated_by: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "Todo berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete todo error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Gagal menghapus todo",
    });
  }
};

// Mengarsipkan Todo tanpa menghapusnya
const archiveTodo = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "ID todo tidak valid",
      });
    }

    const todo = await Todo.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
        archived: false,
      },
      {
        $set: {
          archived: true,
          updated_by: req.user.id,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo tidak ditemukan",
      });
    }

    await ActivityLog.create({
      user: req.user.id,
      action: "todo_archived",
      description: `Mengarsipkan todo: ${todo.title}`,
      related_todo: todo._id,
      snapshot: createTodoSnapshot(todo),
      created_by: req.user.id,
      updated_by: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "Todo berhasil diarsipkan",
      data: todo,
    });
  } catch (error) {
    console.error("Archive todo error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Gagal mengarsipkan todo",
    });
  }
};

module.exports = {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
  archiveTodo,
};
