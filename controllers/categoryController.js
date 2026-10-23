const Category = require("../models/Category");
const ActivityLog = require("../models/ActivityLog");

// Membuat kategori
const createCategory = async (req, res) => {
  try {
    const category = await Category.create({
      name: req.body.name,
      description: req.body.description || "",
      user: req.user.id,
      created_by: req.user.id,
      updated_by: req.user.id,
    });

    await ActivityLog.create({
      user: req.user.id,
      action: "category_created",
      description: `Membuat kategori: ${category.name}`,
      created_by: req.user.id,
      updated_by: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Kategori berhasil dibuat",
      data: category,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Nama kategori tersebut sudah digunakan",
      });
    }

    console.error("Create category error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal membuat kategori",
    });
  }
};

// Mengambil semua kategori milik user
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      user: req.user.id,
      archived: false,
    }).sort({ name: 1 });

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil kategori",
    });
  }
};

// Mengambil satu kategori
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user.id,
      archived: false,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Kategori tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Get category error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil kategori",
    });
  }
};

// Memperbarui kategori
const updateCategory = async (req, res) => {
  try {
    const updates = {};

    if (Object.hasOwn(req.body, "name")) {
      updates.name = req.body.name;
    }

    if (Object.hasOwn(req.body, "description")) {
      updates.description = req.body.description;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Tidak ada data kategori yang diubah",
      });
    }

    const category = await Category.findOneAndUpdate(
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

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Kategori tidak ditemukan",
      });
    }

    await ActivityLog.create({
      user: req.user.id,
      action: "category_updated",
      description: `Memperbarui kategori: ${category.name}`,
      created_by: req.user.id,
      updated_by: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "Kategori berhasil diperbarui",
      data: category,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Nama kategori tersebut sudah digunakan",
      });
    }

    console.error("Update category error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal memperbarui kategori",
    });
  }
};

// Mengarsipkan kategori
const archiveCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndUpdate(
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
      }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Kategori tidak ditemukan",
      });
    }

    await ActivityLog.create({
      user: req.user.id,
      action: "category_deleted",
      description: `Mengarsipkan kategori: ${category.name}`,
      created_by: req.user.id,
      updated_by: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "Kategori berhasil diarsipkan",
    });
  } catch (error) {
    console.error("Archive category error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengarsipkan kategori",
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  archiveCategory,
};
