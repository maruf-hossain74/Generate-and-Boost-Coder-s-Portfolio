const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const UserStats = require("../models/UserStats");
const PlatformConnection = require("../models/PlatformConnection");
const DailySubmissions = require("../models/DailySubmissions");
const auth = require("../middleware/auth");

const router = express.Router();

router.put("/profile", auth, async (req, res) => {
  try {
    const { displayName, bio, codefolioId, avatar } = req.body;

    if (codefolioId) {
      const existing = await User.findOne({
        codefolioId,
        _id: { $ne: req.user._id },
      });
      if (existing) {
        return res.status(409).json({ error: "CodeFolio ID already taken" });
      }
    }

    const updates = {};
    if (displayName !== undefined) updates.displayName = displayName;
    if (bio !== undefined) updates.bio = bio;
    if (codefolioId !== undefined) updates.codefolioId = codefolioId;
    if (avatar !== undefined) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ user: user.toPublicJSON() });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "CodeFolio ID already taken" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/password", auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Old password and new password are required" });
    }
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "New password must be at least 6 characters" });
    }

    if (req.user.provider !== "local") {
      return res.status(400).json({
        error: `Password change not available for ${req.user.provider} accounts`,
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, req.user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    req.user.passwordHash = await bcrypt.hash(newPassword, 12);
    await req.user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/account", auth, async (req, res) => {
  try {
    await Promise.all([
      User.findByIdAndDelete(req.user._id),
      UserStats.findOneAndDelete({ userId: req.user._id }),
      PlatformConnection.deleteMany({ userId: req.user._id }),
      DailySubmissions.deleteMany({ userId: req.user._id }),
    ]);

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/portfolio/:codefolioId", async (req, res) => {
  try {
    const user = await User.findOne({
      codefolioId: req.params.codefolioId,
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const [stats, platforms] = await Promise.all([
      UserStats.findOne({ userId: user._id }),
      PlatformConnection.find(
        { userId: user._id, isConnected: true },
        { platform: 1, handle: 1, profileUrl: 1, totalSolved: 1, topics: 1, _id: 0 }
      ),
    ]);

    const allTopics = {};
    for (const p of platforms) {
      for (const t of p.topics || []) {
        allTopics[t.name] = (allTopics[t.name] || 0) + t.count;
      }
    }
    const maxTopicCount = Math.max(...Object.values(allTopics), 1);
    const topicMastery = Object.entries(allTopics)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / maxTopicCount) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    res.json({
      user: user.toPublicJSON(),
      stats: stats || {},
      platforms,
      topicMastery,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
