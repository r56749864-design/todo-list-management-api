const mongoose = require("mongoose");

let connectionPromise = null;

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => {
        console.log("MongoDB Atlas berhasil terhubung!");
        return mongoose.connection;
      })
      .catch((error) => {
        connectionPromise = null;
        console.error("Koneksi MongoDB gagal:", error.message);
        throw error;
      });
  }

  return connectionPromise;
}

module.exports = connectDB;
