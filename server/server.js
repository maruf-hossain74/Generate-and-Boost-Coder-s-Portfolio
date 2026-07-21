const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const platformRoutes = require("./routes/platforms");
const leaderboardRoutes = require("./routes/leaderboard");
const contestRoutes = require("./routes/contests");
const { syncAllUsers } = require("./services/syncService");
const { refreshContests } = require("./services/contestService");
const { processReminders } = require("./services/reminderService");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "CodeFolio API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/platforms", platformRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/contests", contestRoutes);

app.use((err, req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

const start = async () => {
  await connectDB();

  cron.schedule("*/30 * * * *", () => {
    console.log("[Cron] Starting sync for all users...");
    syncAllUsers();
  });

  cron.schedule("0 */2 * * *", () => {
    console.log("[Cron] Refreshing contests...");
    refreshContests();
  });

  cron.schedule("*/5 * * * *", () => {
    processReminders();
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
