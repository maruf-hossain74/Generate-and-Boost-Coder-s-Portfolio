const axios = require("axios");

function log(...args) {
  console.log("[CodeChef]", ...args);
}

function warn(...args) {
  console.warn("[CodeChef]", ...args);
}

async function fetch(handle) {
  log(`Fetching profile for "${handle}"...`);

  try {
    const res = await axios.get(
      `https://www.codechef.com/users/${handle}`,
      { timeout: 15000 }
    );

    const html = res.data;
    if (!html || html.includes("Request unsuccessful")) {
      warn(`Request unsuccessful for "${handle}"`);
      return null;
    }

    const result = {
      totalSolved: 0,
      rating: 0,
      maxRating: 0,
      rank: "",
      globalRank: 0,
      dayStreak: 0,
      bestStreak: 0,
      topics: [],
      submissions: [],
    };

    // Current rating
    const ratingMatch = html.match(/rating-number[^>]*>\s*(\d+)/);
    if (ratingMatch) {
      result.rating = parseInt(ratingMatch[1]);
      log(`Rating found: ${result.rating}`);
    } else {
      warn(`Rating not found for "${handle}"`);
    }

    // Max / Highest rating (multiple pattern approach like Python sample)
    const maxRatingMatch = html.match(/max-rating[^>]*>\s*(\d+)/);
    if (maxRatingMatch) {
      result.maxRating = parseInt(maxRatingMatch[1]);
    } else {
      const highestMatch = html.match(/Highest\s+Rating[^\d]*(\d+)/i);
      if (highestMatch) {
        result.maxRating = parseInt(highestMatch[1]);
      }
    }
    if (result.maxRating) log(`Max rating found: ${result.maxRating}`);

    // Stars / rank (stars are &#9733; HTML entities in source)
    const starSection = html.match(/rating-star[^>]*>([\s\S]*?)<\/div>/);
    if (starSection) {
      const stars = (starSection[1].match(/&#9733;/g) || []).length;
      if (stars > 0) {
        result.rank = `${stars} Star`;
        log(`Rank found: ${stars} Star`);
      }
    }

    // Total problems solved (multi-pattern like Python sample)
    const solvedPatterns = [
      /Total\s+Problems\s+Solved[^\d]*(\d+)/i,
      /Problems\s+Solved[^\d]*(\d+)/i,
      /Solved[^\d]*(\d+)/i,
    ];
    for (const p of solvedPatterns) {
      const m = html.match(p);
      if (m) {
        result.totalSolved = parseInt(m[1]);
        log(`Total solved found: ${result.totalSolved}`);
        break;
      }
    }
    if (!result.totalSolved) warn(`Total solved not found for "${handle}"`);

    // Global rank
    const globalRankMatch = html.match(/global-rank[^>]*>\s*(\d+)<\/strong>/);
    if (globalRankMatch) {
      result.globalRank = parseInt(globalRankMatch[1]);
      log(`Global rank found: ${result.globalRank}`);
    }

    log(`Fetch complete for "${handle}"`);
    return result;
  } catch (err) {
    warn(`Fetch failed for "${handle}": ${err.message || err}`);
    return null;
  }
}

module.exports = { fetch };
