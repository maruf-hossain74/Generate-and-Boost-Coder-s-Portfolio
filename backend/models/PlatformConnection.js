const mongoose = require("mongoose");

const platformConnectionSchema = new mongoose.Schema(
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
      enum: [
        "leetcode",
        "codeforces",
        "hackerrank",
        "codechef",
        "atcoder",
        "geeksforgeeks",
        "github",
      ],
    },
    handle: {
      type: String,
      default: "",
    },
    profileUrl: {
      type: String,
      default: "",
    },
    isConnected: {
      type: Boolean,
      default: false,
    },
    lastSyncedAt: {
      type: Date,
      default: null,
    },
    totalSolved: {
      type: Number,
      default: 0,
    },
    topics: {
      type: [{ name: String, count: Number }],
      default: [],
    },
  },
  { timestamps: true }
);

platformConnectionSchema.index({ userId: 1, platform: 1 }, { unique: true });

module.exports = mongoose.model("PlatformConnection", platformConnectionSchema);
