
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const ActivityLog = require("../models/ActivityLog");

const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validasi input gagal.",
        errors: errors.array(),
      });
    }

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email sudah terdaftar.",
      });
    }

    // Password di-hash otomatis oleh User model sebelum disimpan
    const user = await User.create({
      name,
      email,
      password,
      role: "user",
      created_by: null,
      updated_by: null,
    });

    await ActivityLog.create({
      user: user._id,
      action: "user_registered",
      description: "Pengguna baru melakukan registrasi.",
      created_by: user._id,
      updated_by: user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Registrasi berhasil.",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validasi input gagal.",
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user || user.archived) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah.",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await ActivityLog.create({
      user: user._id,
      action: "user_login",
      description: "Pengguna berhasil login.",
      created_by: user._id,
      updated_by: user._id,
    });

    return res.status(200).json({
      success: true,
      message: "Login berhasil.",
      data: {
        token,
        tokenType: "Bearer",
        expiresIn: "1h",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || user.archived) {
      return res.status(404).json({
        success: false,
        message: "Pengguna tidak ditemukan.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profil berhasil diambil.",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
};
