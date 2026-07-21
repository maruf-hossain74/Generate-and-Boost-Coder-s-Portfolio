const mongoose = require("mongoose");

const userStatsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    totalSolved: { type: Number, default: 0 },
    maxCfRating: { type: Number, default: 0 },
    currentCfRating: { type: Number, default: 0 },
    dayStreak: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 },
    globalRank: { type: Number, default: 0 },
    platformsConnected: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserStats", userStatsSchema);
