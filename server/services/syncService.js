const PlatformConnection = require("../models/PlatformConnection");
const UserStats = require("../models/UserStats");
const DailySubmissions = require("../models/DailySubmissions");

const fetchers = {
  leetcode: require("./fetchers/leetcode"),
  codeforces: require("./fetchers/codeforces"),
  hackerrank: require("./fetchers/hackerrank"),
  codechef: require("./fetchers/codechef"),
  atcoder: require("./fetchers/atcoder"),
  geeksforgeeks: require("./fetchers/geeksforgeeks"),
  github: require("./fetchers/github"),
};

async function syncUser(userId) {
  try {
    const connections = await PlatformConnection.find({
      userId,
      isConnected: true,
    });

    if (connections.length === 0) return;

    let totalSolved = 0;
    let maxCfRating = 0;
    let currentCfRating = 0;
    let maxStreak = 0;
    let currentStreak = 0;

    for (const conn of connections) {
      const fetcher = fetchers[conn.platform];
      if (!fetcher) continue;

      const data = await fetcher.fetch(conn.handle);
      if (!data) continue;

      if (conn.platform === "codeforces") {
        currentCfRating = data.rating || 0;
        maxCfRating = data.maxRating || 0;
      }

      totalSolved += data.totalSolved || 0;
      currentStreak = Math.max(currentStreak, data.dayStreak || 0);
      maxStreak = Math.max(maxStreak, data.bestStreak || 0);

      if (data.submissions && data.submissions.length > 0) {
        const bulkOps = data.submissions.map((s) => ({
          updateOne: {
            filter: {
              userId,
              platform: conn.platform,
              date: new Date(s.date),
            },
            update: { $set: { count: s.count } },
            upsert: true,
          },
        }));
        if (bulkOps.length > 0) {
          await DailySubmissions.bulkWrite(bulkOps, { ordered: false });
        }
      }

      conn.totalSolved = data.totalSolved || 0;
      conn.topics = (data.topics || []).slice(0, 20);
      conn.lastSyncedAt = new Date();
      await conn.save();
    }

    await UserStats.findOneAndUpdate(
      { userId },
      {
        totalSolved,
        maxCfRating,
        currentCfRating,
        dayStreak: currentStreak,
        bestStreak: maxStreak,
        lastUpdated: new Date(),
      }
    );
  } catch {
    /* silenty fail for individual sync */
  }
}

async function syncAllUsers() {
  try {
    const connected = await PlatformConnection.distinct("userId", {
      isConnected: true,
    });

    for (const userId of connected) {
      await syncUser(userId);
    }
  } catch {
    /* silenty fail for batch sync */
  }
}

module.exports = { syncUser, syncAllUsers };
