const mongoose = require("mongoose");

const leaderboardCacheSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    totalScore: { type: Number, default: 0 },
    totalSolved: { type: Number, default: 0 },
    cfRating: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    rank: { type: Number, default: 0 },
    rankChange: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LeaderboardCache", leaderboardCacheSchema);
