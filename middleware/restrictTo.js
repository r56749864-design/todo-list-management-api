
const AppError = require("../utils/AppError");

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError(
          "Kamu tidak memiliki izin untuk mengakses resource ini.",
          403
        )
      );
    }

    next();
  };
};

module.exports = restrictTo;
