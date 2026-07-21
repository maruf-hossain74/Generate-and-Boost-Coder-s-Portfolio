const express = require("express");
const UserStats = require("../models/UserStats");
const PlatformConnection = require("../models/PlatformConnection");
const DailySubmissions = require("../models/DailySubmissions");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/dashboard", auth, async (req, res) => {
  try {
    const stats = await UserStats.findOne({ userId: req.user._id });
    const platforms = await PlatformConnection.find(
      { userId: req.user._id, isConnected: true },
      { platform: 1, handle: 1, totalSolved: 1, _id: 0 }
    );

    const platformColors = {
      leetcode: "bg-orange-400",
      codeforces: "bg-accent-cyan",
      hackerrank: "bg-green-500",
      codechef: "bg-purple-500",
      atcoder: "bg-red-500",
      geeksforgeeks: "bg-green-400",
      github: "bg-gray-400",
    };

    const maxSolved = Math.max(...platforms.map((p) => p.totalSolved || 0), 1);
    const platformData = platforms.map((p) => ({
      name: p.platform,
      handle: p.handle,
      solved: p.totalSolved || 0,
      color: platformColors[p.platform] || "bg-accent-cyan",
      width: Math.round(((p.totalSolved || 0) / maxSolved) * 100),
    }));

    res.json({
      stats: stats
        ? {
            totalSolved: stats.totalSolved,
            cfRating: stats.currentCfRating,
            maxCfRating: stats.maxCfRating,
            dayStreak: stats.dayStreak,
            bestStreak: stats.bestStreak,
            globalRank: stats.globalRank,
            platformsConnected: stats.platformsConnected,
          }
        : {
            totalSolved: 0,
            cfRating: 0,
            maxCfRating: 0,
            dayStreak: 0,
            bestStreak: 0,
            globalRank: 0,
            platformsConnected: 0,
          },
      platforms: platformData,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/heatmap", auth, async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const platform = req.query.platform;
    const start = new Date(`${year}-01-01T00:00:00Z`);
    const end = new Date(`${year + 1}-01-01T00:00:00Z`);

    const match = {
      userId: req.user._id,
      date: { $gte: start, $lt: end },
    };
    if (platform) match.platform = platform;

    const submissions = await DailySubmissions.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          count: { $sum: "$count" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      year,
      submissions: submissions.map((s) => ({
        date: s._id,
        count: s.count,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/platform/:platform", auth, async (req, res) => {
  try {
    const { platform } = req.params;

    const conn = await PlatformConnection.findOne({
      userId: req.user._id,
      platform,
      isConnected: true,
    });

    if (!conn) {
      return res.status(404).json({ error: "Platform not connected" });
    }

    const year = new Date().getFullYear();
    const start = new Date(`${year}-01-01T00:00:00Z`);
    const end = new Date(`${year + 1}-01-01T00:00:00Z`);

    const activeDays = await DailySubmissions.countDocuments({
      userId: req.user._id,
      platform,
      count: { $gt: 0 },
    });

    const heatmap = await DailySubmissions.aggregate([
      {
        $match: {
          userId: req.user._id,
          platform,
          date: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          count: { $sum: "$count" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const userStats = await UserStats.findOne({ userId: req.user._id });

    res.json({
      platform: conn.platform,
      handle: conn.handle,
      totalSolved: conn.totalSolved || 0,
      activeDays,
      topics: conn.topics || [],
      rating: userStats?.currentCfRating || 0,
      maxRating: userStats?.maxCfRating || 0,
      heatmap: heatmap.map((s) => ({ date: s._id, count: s.count })),
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
