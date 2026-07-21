const axios = require("axios");

async function fetch(handle) {
  try {
    const res = await axios.get(
      `https://www.codechef.com/users/${handle}`,
      { timeout: 15000 }
    );

    const html = res.data;
    if (!html || html.includes("Request unsuccessful")) return null;

    const ratingMatch = html.match(/rating-number[^>]*>(\d+)/);
    const rating = ratingMatch ? parseInt(ratingMatch[1]) : 0;

    const maxRatingMatch = html.match(/max-rating[^>]*>(\d+)/);
    const maxRating = maxRatingMatch ? parseInt(maxRatingMatch[1]) : 0;

    const starMatch = html.match(/rating-star.*?>(.*?)</);
    let rank = "";
    if (starMatch) {
      const stars = (starMatch[1].match(/★/g) || []).length;
      rank = `${stars} Star`;
    }

    const solvedMatch = html.match(/Problems Solved[^]*?<h3[^>]*>(\d+)<\/h3>/);
    const totalSolved = solvedMatch ? parseInt(solvedMatch[1]) : 0;

    let globalRank = 0;
    const globalRankMatch = html.match(/global-rank[^>]*>(\d+)<\/strong>/);
    if (globalRankMatch) {
      globalRank = parseInt(globalRankMatch[1]);
    }

    return {
      totalSolved,
      rating,
      maxRating,
      rank,
      globalRank,
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
