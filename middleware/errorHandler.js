
const errorHandler = (err, req, res, next) => {
  let statusCode = Number(err.statusCode || err.status || 500);

  // Pastikan status code HTTP valid.
  if (
    !Number.isInteger(statusCode) ||
    statusCode < 400 ||
    statusCode > 599
  ) {
    statusCode = 500;
  }

  let message =
    statusCode >= 500
      ? "Terjadi kesalahan pada server."
      : err.message || "Permintaan tidak dapat diproses.";

  // Error ID MongoDB/Mongoose tidak valid.
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Format ID atau nilai data tidak valid.";
  }

  // Error validasi schema Mongoose.
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Data yang dikirim tidak memenuhi validasi.";
  }

  // Error duplikasi data MongoDB.
  if (err.code === 11000) {
    statusCode = 409;
    message = "Data sudah terdaftar.";
  }

  // Error JSON body yang formatnya tidak valid.
  if (err instanceof SyntaxError && err.status === 400) {
    statusCode = 400;
    message = "Format JSON pada request tidak valid.";
  }

  // Jangan bocorkan detail internal server.
  if (statusCode >= 500) {
    message = "Terjadi kesalahan pada server.";
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
