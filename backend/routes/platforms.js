const express = require("express");
const axios = require("axios");
const PlatformConnection = require("../models/PlatformConnection");
const UserStats = require("../models/UserStats");
const auth = require("../middleware/auth");
const { syncUser } = require("../services/syncService");

const router = express.Router();

const PLATFORM_CHECK = {
  leetcode: async (handle) => {
    const res = await axios.post("https://leetcode.com/graphql", {
      query: `query($username:String!){matchedUser(username:$username){username}}`,
      variables: { username: handle },
    });
    return !!res.data?.data?.matchedUser;
  },
  codeforces: async (handle) => {
    const res = await axios.get(
      `https://codeforces.com/api/user.info?handles=${handle}`
    );
    return res.data?.status === "OK";
  },
  hackerrank: async () => true,
  codechef: async () => true,
  atcoder: async () => true,
  geeksforgeeks: async () => true,
  github: async (handle) => {
    const res = await axios.get(`https://api.github.com/users/${handle}`);
    return res.status === 200;
  },
};

const PLATFORM_URLS = {
  leetcode: (handle) => `https://leetcode.com/u/${handle}/`,
  codeforces: (handle) => `https://codeforces.com/profile/${handle}`,
  hackerrank: (handle) => `https://www.hackerrank.com/profile/${handle}`,
  codechef: (handle) => `https://www.codechef.com/users/${handle}`,
  atcoder: (handle) => `https://atcoder.jp/users/${handle}`,
  geeksforgeeks: (handle) =>
    `https://www.geeksforgeeks.org/user/${handle}/`,
  github: (handle) => `https://github.com/${handle}`,
};

router.get("/", auth, async (req, res) => {
  try {
    const platforms = await PlatformConnection.find({ userId: req.user._id });
    res.json({ platforms });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/connect", auth, async (req, res) => {
  try {
    const { platform, handle } = req.body;

    if (!platform || !handle) {
      return res
        .status(400)
        .json({ error: "Platform and handle are required" });
    }

    const validPlatforms = [
      "leetcode",
      "codeforces",
      "hackerrank",
      "codechef",
      "atcoder",
      "geeksforgeeks",
      "github",
    ];
    if (!validPlatforms.includes(platform)) {
      return res.status(400).json({ error: "Invalid platform" });
    }

    const checkFn = PLATFORM_CHECK[platform];
    try {
      const isValid = await checkFn(handle);
      if (!isValid) {
        return res
          .status(400)
          .json({ error: `Could not verify handle on ${platform}` });
      }
    } catch {
      return res
        .status(400)
        .json({ error: `Could not verify handle on ${platform}` });
    }

    const profileUrl = PLATFORM_URLS[platform](handle);

    const connection = await PlatformConnection.findOneAndUpdate(
      { userId: req.user._id, platform },
      { handle, profileUrl, isConnected: true, lastSyncedAt: new Date() },
      { upsert: true, new: true }
    );

    const count = await PlatformConnection.countDocuments({
      userId: req.user._id,
      isConnected: true,
    });
    await UserStats.findOneAndUpdate(
      { userId: req.user._id },
      { platformsConnected: count }
    );

    res.json({ platform: connection });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Platform already connected" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/sync", auth, async (req, res) => {
  try {
    const platforms = await PlatformConnection.find({
      userId: req.user._id,
      isConnected: true,
    });

    if (platforms.length === 0) {
      return res.json({ message: "No platforms connected", platformsSynced: 0 });
    }

    await syncUser(req.user._id);

    const updated = await PlatformConnection.find({
      userId: req.user._id,
      isConnected: true,
    });

    res.json({
      message: "Sync completed",
      platformsSynced: updated.length,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:platform", auth, async (req, res) => {
  try {
    const { platform } = req.params;

    const connection = await PlatformConnection.findOne({
      userId: req.user._id,
      platform,
    });
    if (!connection) {
      return res.status(404).json({ error: "Platform not connected" });
    }

    connection.isConnected = false;
    connection.handle = "";
    connection.profileUrl = "";
    connection.lastSyncedAt = null;
    await connection.save();

    const count = await PlatformConnection.countDocuments({
      userId: req.user._id,
      isConnected: true,
    });
    await UserStats.findOneAndUpdate(
      { userId: req.user._id },
      { platformsConnected: count }
    );

    res.json({ message: `Disconnected from ${platform}` });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
