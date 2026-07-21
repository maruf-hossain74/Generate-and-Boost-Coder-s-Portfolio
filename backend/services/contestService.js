const axios = require("axios");
const Contest = require("../models/Contest");

async function fetchCodeforces() {
  try {
    const res = await axios.get("https://codeforces.com/api/contest.list");
    if (res.data?.status !== "OK") return;

    const upcoming = res.data.result.filter((c) => c.phase === "BEFORE");
    for (const c of upcoming) {
      await Contest.findOneAndUpdate(
        { platform: "codeforces", name: c.name },
        {
          platform: "codeforces",
          name: c.name,
          description: "",
          url: `https://codeforces.com/contest/${c.id}`,
          startTime: new Date(c.startTimeSeconds * 1000),
          duration: c.durationSeconds || 0,
          isActive: true,
        },
        { upsert: true, new: true }
      );
    }
  } catch {
    /* silenty fail */
  }
}

async function fetchLeetcode() {
  try {
    const res = await axios.post("https://leetcode.com/graphql", {
      query: `{
        upcomingContests {
          title
          titleSlug
          startTime
          duration
        }
      }`,
    });

    const contests = res.data?.data?.upcomingContests || [];
    for (const c of contests) {
      await Contest.findOneAndUpdate(
        { platform: "leetcode", name: c.title },
        {
          platform: "leetcode",
          name: c.title,
          description: "",
          url: `https://leetcode.com/contest/${c.titleSlug}`,
          startTime: new Date(c.startTime * 1000),
          duration: c.duration || 0,
          isActive: true,
        },
        { upsert: true, new: true }
      );
    }
  } catch {
    /* silenty fail */
  }
}

async function fetchCodechef() {
  try {
    const res = await axios.get("https://www.codechef.com/api/list/contests/all", {
      timeout: 10000,
    });

    const future = res.data?.future_contests || [];
    for (const c of future) {
      const name = c.contest_name || c.contest_code;
      await Contest.findOneAndUpdate(
        { platform: "codechef", name },
        {
          platform: "codechef",
          name,
          description: c.contest_description || "",
          url: `https://www.codechef.com/${c.contest_code}`,
          startTime: new Date(c.contest_start_date_iso || c.contest_start_date),
          duration: parseInt(c.contest_duration) * 60 || 0,
          isActive: true,
        },
        { upsert: true, new: true }
      );
    }
  } catch {
    /* silenty fail */
  }
}

async function refreshContests() {
  await Promise.allSettled([
    fetchCodeforces(),
    fetchLeetcode(),
    fetchCodechef(),
  ]);

  await Contest.deleteMany({ startTime: { $lt: new Date() }, isActive: true });
}

module.exports = { refreshContests };
