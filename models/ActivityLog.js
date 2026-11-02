
const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    action: {
      type: String,
      enum: [
        "todo_created",
        "todo_updated",
        "todo_deleted",
        "todo_archived",
        "category_created",
        "category_updated",
        "category_deleted",
        "user_registered",
        "user_login",
      ],
      required: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 500,
    },

    related_todo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Todo",
      default: null,
    },

    // Menyimpan kondisi Todo saat aktivitas terjadi.
    // Tetap tersimpan meskipun Todo diubah atau dihapus.
    snapshot: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    archived: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

activityLogSchema.index({ user: 1, created_at: -1 });

module.exports = mongoose.model("ActivityLog", activityLogSchema);
