const mongoose = require("mongoose");

const dailySubmissionsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    platform: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

dailySubmissionsSchema.index({ userId: 1, platform: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("DailySubmissions", dailySubmissionsSchema);
