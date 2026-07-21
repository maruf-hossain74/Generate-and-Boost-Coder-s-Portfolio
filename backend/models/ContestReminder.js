const mongoose = require("mongoose");

const contestReminderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    contestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contest",
      required: true,
    },
    reminderTime: { type: Date, required: true },
    isSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

contestReminderSchema.index({ userId: 1, contestId: 1 }, { unique: true });
contestReminderSchema.index({ isSent: 1, reminderTime: 1 });

module.exports = mongoose.model("ContestReminder", contestReminderSchema);
