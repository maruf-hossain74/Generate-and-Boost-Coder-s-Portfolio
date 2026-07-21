const express = require("express");
const User = require("../models/User");
const UserStats = require("../models/UserStats");
const LeaderboardCache = require("../models/LeaderboardCache");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      UserStats.aggregate([
        { $sort: { totalSolved: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 0,
            userId: 1,
            totalSolved: 1,
            currentCfRating: 1,
            dayStreak: 1,
            "user.displayName": 1,
            "user.codefolioId": 1,
            "user.avatar": 1,
          },
        },
      ]),
      UserStats.countDocuments({}),
    ]);

    const entries = users.map((u, i) => ({
      rank: skip + i + 1,
      displayName: u.user?.displayName || "Unknown",
      codefolioId: u.user?.codefolioId || "",
      avatar: u.user?.avatar || "",
      totalSolved: u.totalSolved || 0,
      cfRating: u.currentCfRating || 0,
      streak: u.dayStreak || 0,
    }));

    res.json({
      leaderboard: entries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/search", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) {
      return res.json({ leaderboard: [] });
    }

    const regex = new RegExp(q, "i");
    const users = await User.find({
      $or: [{ displayName: regex }, { codefolioId: regex }],
    }).select("_id displayName codefolioId avatar");

    if (users.length === 0) {
      return res.json({ leaderboard: [] });
    }

    const userIds = users.map((u) => u._id);
    const stats = await UserStats.find({ userId: { $in: userIds } });

    const statsMap = {};
    for (const s of stats) {
      statsMap[s.userId.toString()] = s;
    }

    const allStats = await UserStats.find({}).sort({ totalSolved: -1 });
    const rankMap = {};
    allStats.forEach((s, i) => {
      rankMap[s.userId.toString()] = i + 1;
    });

    const entries = users
      .map((u) => {
        const s = statsMap[u._id.toString()];
        return {
          rank: rankMap[u._id.toString()] || 0,
          displayName: u.displayName || "Unknown",
          codefolioId: u.codefolioId || "",
          avatar: u.avatar || "",
          totalSolved: s?.totalSolved || 0,
          cfRating: s?.currentCfRating || 0,
          streak: s?.dayStreak || 0,
        };
      })
      .sort((a, b) => a.rank - b.rank);

    res.json({ leaderboard: entries });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/platform/:platform", async (req, res) => {
  try {
    const { platform } = req.params;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    let sortField = "totalSolved";
    if (platform === "codeforces") sortField = "currentCfRating";

    const [stats, total] = await Promise.all([
      UserStats.aggregate([
        { $match: { [sortField]: { $gt: 0 } } },
        { $sort: { [sortField]: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 0,
            totalSolved: 1,
            currentCfRating: 1,
            dayStreak: 1,
            "user.displayName": 1,
            "user.codefolioId": 1,
            "user.avatar": 1,
          },
        },
      ]),
      UserStats.countDocuments({ [sortField]: { $gt: 0 } }),
    ]);

    const entries = stats.map((u, i) => ({
      rank: skip + i + 1,
      displayName: u.user?.displayName || "Unknown",
      codefolioId: u.user?.codefolioId || "",
      avatar: u.user?.avatar || "",
      totalSolved: u.totalSolved || 0,
      cfRating: u.currentCfRating || 0,
      streak: u.dayStreak || 0,
    }));

    res.json({
      platform,
      leaderboard: entries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
