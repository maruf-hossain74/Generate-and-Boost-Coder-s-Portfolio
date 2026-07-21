const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: true,
      enum: ["codeforces", "leetcode", "codechef"],
    },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    url: { type: String, default: "" },
    startTime: { type: Date, required: true },
    duration: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

contestSchema.index({ platform: 1, startTime: -1 });
contestSchema.index({ startTime: 1 });

module.exports = mongoose.model("Contest", contestSchema);
