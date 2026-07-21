const express = require("express");
const Contest = require("../models/Contest");
const ContestReminder = require("../models/ContestReminder");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/upcoming", async (req, res) => {
  try {
    const platform = req.query.platform;
    const filter = { startTime: { $gt: new Date() }, isActive: true };
    if (platform) filter.platform = platform;

    const contests = await Contest.find(filter)
      .sort({ startTime: 1 })
      .lean();

    res.json({ contests });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/:id/reminder", auth, async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id);
    if (!contest) {
      return res.status(404).json({ error: "Contest not found" });
    }

    if (new Date(contest.startTime) < new Date()) {
      return res.status(400).json({ error: "Contest has already started" });
    }

    const reminderTime = new Date(contest.startTime.getTime() - 60 * 60 * 1000);

    const reminder = await ContestReminder.findOneAndUpdate(
      { userId: req.user._id, contestId: contest._id },
      { reminderTime, isSent: false },
      { upsert: true, new: true }
    );

    res.status(201).json({ reminder });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Reminder already set" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id/reminder", auth, async (req, res) => {
  try {
    const result = await ContestReminder.findOneAndDelete({
      userId: req.user._id,
      contestId: req.params.id,
    });

    if (!result) {
      return res.status(404).json({ error: "Reminder not found" });
    }

    res.json({ message: "Reminder removed" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
