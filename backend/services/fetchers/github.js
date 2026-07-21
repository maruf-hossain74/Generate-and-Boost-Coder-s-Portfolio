const axios = require("axios");

async function fetch(handle) {
  try {
    const [userRes, reposRes, eventsRes] = await Promise.all([
      axios.get(`https://api.github.com/users/${handle}`, {
        headers: { Accept: "application/vnd.github.v3+json" },
        timeout: 10000,
      }),
      axios.get(
        `https://api.github.com/users/${handle}/repos?per_page=100&sort=updated`,
        {
          headers: { Accept: "application/vnd.github.v3+json" },
          timeout: 10000,
        }
      ),
      axios.get(
        `https://api.github.com/users/${handle}/events?per_page=100`,
        {
          headers: { Accept: "application/vnd.github.v3+json" },
          timeout: 10000,
        }
      ),
    ]);

    if (!userRes.data || userRes.data.message === "Not Found") return null;

    const user = userRes.data;
    const repos = reposRes.data || [];
    const events = eventsRes.data || [];

    const totalSolved = user.public_repos || 0;
    const rating = user.followers || 0;

    const dayCount = {};
    for (const event of events) {
      if (event.type === "PushEvent" || event.type === "PullRequestEvent") {
        const date = new Date(event.created_at).toISOString().split("T")[0];
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

    const submissions = Object.entries(dayCount).map(([date, count]) => ({
      date,
      count,
    }));

    const langMap = {};
    for (const repo of repos) {
      if (repo.language) {
        langMap[repo.language] = (langMap[repo.language] || 0) + 1;
      }
    }
    const topics = Object.entries(langMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalSolved,
      rating,
      maxRating: rating,
      rank: "",
      globalRank: 0,
      dayStreak: currentStreak,
      bestStreak,
      topics,
      submissions,
    };
  } catch {
    return null;
  }
}

module.exports = { fetch };
