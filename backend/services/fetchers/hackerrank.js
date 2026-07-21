const axios = require("axios");

async function fetch(handle) {
  try {
    const res = await axios.get(
      `https://www.hackerrank.com/rest/hackers/${handle}/reputation`,
      { timeout: 10000 }
    );

    if (!res.data || res.data.status === false) return null;

    const algorithms = res.data?.algorithms || {};
    const totalSolved =
      (algorithms.solved || 0) +
      (res.data?.data_structures?.solved || 0) +
      (res.data?.mathematics?.solved || 0);

    return {
      totalSolved,
      rating: 0,
      maxRating: 0,
      rank: "",
      globalRank: 0,
      dayStreak: 0,
      bestStreak: 0,
      topics: [],
      submissions: [],
    };
  } catch {
    return null;
  }
}

module.exports = { fetch };
