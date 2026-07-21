const axios = require("axios");

async function fetch(handle) {
  try {
    const res = await axios.get(
      `https://atcoder.jp/users/${handle}`,
      { timeout: 10000 }
    );

    const html = res.data;
    if (!html || html.includes("Not Found")) return null;

    let rating = 0;
    const ratingMatch = html.match(
      /<th[^>]*>Rating<\/th>\s*<td[^>]*>(\d+)/
    );
    if (ratingMatch) {
      rating = parseInt(ratingMatch[1]);
    }

    let maxRating = 0;
    const maxRatingMatch = html.match(
      /<th[^>]*>Highest Rating<\/th>\s*<td[^>]*>(\d+)/
    );
    if (maxRatingMatch) {
      maxRating = parseInt(maxRatingMatch[1]);
    }

    let rank = "";
    if (rating >= 2800) rank = "Red";
    else if (rating >= 2400) rank = "Orange";
    else if (rating >= 2000) rank = "Yellow";
    else if (rating >= 1600) rank = "Blue";
    else if (rating >= 1200) rank = "Cyan";
    else if (rating >= 800) rank = "Green";
    else if (rating >= 400) rank = "Brown";
    else rank = "Gray";

    let totalSolved = 0;
    const solvedMatch = html.match(
      /<th[^>]*>Accepted<\/th>\s*<td[^>]*>(\d+)/
    );
    if (solvedMatch) {
      totalSolved = parseInt(solvedMatch[1]);
    }

    return {
      totalSolved,
      rating,
      maxRating,
      rank,
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
