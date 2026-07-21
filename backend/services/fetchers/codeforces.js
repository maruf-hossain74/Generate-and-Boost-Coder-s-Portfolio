const axios = require("axios");

const CF_API = "https://codeforces.com/api";

const RANK_ORDER = [
  "newbie",
  "pupil",
  "specialist",
  "expert",
  "candidate master",
  "master",
  "international master",
  "grandmaster",
  "international grandmaster",
  "legendary grandmaster",
];

function getRankLabel(rating) {
  if (rating >= 3000) return "Legendary Grandmaster";
  if (rating >= 2600) return "International Grandmaster";
  if (rating >= 2400) return "Grandmaster";
  if (rating >= 2300) return "International Master";
  if (rating >= 2100) return "Master";
  if (rating >= 1900) return "Candidate Master";
  if (rating >= 1600) return "Expert";
  if (rating >= 1400) return "Specialist";
  if (rating >= 1200) return "Pupil";
  return "Newbie";
}

async function fetch(handle) {
  try {
    const [infoRes, statusRes] = await Promise.all([
      axios.get(`${CF_API}/user.info?handles=${handle}`),
      axios.get(`${CF_API}/user.status?handle=${handle}&from=1&count=10000`),
    ]);

    if (infoRes.data?.status !== "OK") return null;
    const user = infoRes.data.result[0];
    if (!user) return null;

    const submissions = statusRes.data?.result || [];
    const solved = new Set();
    const dayCount = {};

    for (const sub of submissions) {
      if (sub.verdict === "OK") {
        const key = `${sub.problem.contestId}-${sub.problem.index}`;
        solved.add(key);

        const date = new Date(sub.creationTimeSeconds * 1000)
          .toISOString()
          .split("T")[0];
        dayCount[date] = (dayCount[date] || 0) + 1;
      }
    }

    let currentStreak = 0;
    let bestStreak = 0;
    const sortedDates = Object.keys(dayCount).sort().reverse();
    if (sortedDates.length > 0) {
      const today = new Date().toISOString().split("T")[0];
      let check = new Date(today);
      for (let i = 0; i < 365; i++) {
        const ds = check.toISOString().split("T")[0];
        if (dayCount[ds]) {
          currentStreak++;
        } else if (ds !== today) {
          break;
        }
        check.setDate(check.getDate() - 1);
      }

      let run = 0;
      for (const d of sortedDates.reverse()) {
        if (dayCount[d] > 0) {
          run++;
          bestStreak = Math.max(bestStreak, run);
        } else {
          run = 0;
        }
      }
    }

    const totalSolved = solved.size;
    const rating = user.rating || 0;
    const maxRating = user.maxRating || 0;

    const submissionsArr = Object.entries(dayCount).map(([date, count]) => ({
      date,
      count,
    }));

    const topicsMap = {};
    for (const sub of submissions) {
      if (sub.verdict === "OK" && sub.problem.tags) {
        for (const tag of sub.problem.tags) {
          topicsMap[tag] = (topicsMap[tag] || 0) + 1;
        }
      }
    }
    const topics = Object.entries(topicsMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalSolved,
      rating,
      maxRating,
      rank: getRankLabel(rating),
      globalRank: 0,
      dayStreak: currentStreak,
      bestStreak,
      topics,
      submissions: submissionsArr,
    };
  } catch {
    return null;
  }
}

module.exports = { fetch };
