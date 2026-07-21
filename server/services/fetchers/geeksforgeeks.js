const axios = require("axios");

async function fetch(handle) {
  try {
    const res = await axios.get(
      `https://www.geeksforgeeks.org/user/${handle}/`,
      { timeout: 10000 }
    );

    const html = res.data;
    if (!html || html.includes("Page Not Found")) return null;

    let totalSolved = 0;
    const solvedMatch = html.match(
      /<div[^>]*class="[^"]*problemSolvedSection[^"]*"[^>]*>[\s\S]*?<h3[^>]*>(\d+)<\/h3>/
    );
    if (solvedMatch) {
      totalSolved = parseInt(solvedMatch[1]);
    }

    let codingScore = 0;
    const scoreMatch = html.match(/Coding Score[^<]*<[^>]*>\s*(\d+)/);
    if (scoreMatch) {
      codingScore = parseInt(scoreMatch[1]);
    }

    const topics = [];
    const topicMatches = html.matchAll(
      /<div[^>]*class="[^"]*topic[^"]*"[^>]*>([^<]+)<\/div>[^]*?<div[^>]*class="[^"]*problemCount[^"]*"[^>]*>(\d+)<\/div>/g
    );
    for (const match of topicMatches) {
      topics.push({
        name: match[1].trim(),
        count: parseInt(match[2]),
      });
    }

    return {
      totalSolved,
      rating: codingScore,
      maxRating: codingScore,
      rank: "",
      globalRank: 0,
      dayStreak: 0,
      bestStreak: 0,
      topics,
      submissions: [],
    };
  } catch {
    return null;
  }
}

module.exports = { fetch };
