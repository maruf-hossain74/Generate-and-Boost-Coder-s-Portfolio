const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn("MONGO_URI not set — skipping DB connection.");
    return;
  }
  try {
    await mongoose.connect(uri);
    console.log(`MongoDB connected successfully to: ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    console.error(err);
    console.warn("Server will continue without database connection.");
  }
};

module.exports = connectDB;
