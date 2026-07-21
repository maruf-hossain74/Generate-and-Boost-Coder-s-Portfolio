const axios = require("axios");

const LEETCODE_API = "https://leetcode.com/graphql";

const USER_PROFILE_QUERY = `
query($username:String!) {
  matchedUser(username:$username) {
    username
    submitStats: submitStatsGlobal {
      acSubmissionNum {
        difficulty
        count
      }
    }
    profile {
      ranking
      reputation
    }
  }
  userContestRanking(username:$username) {
    rating
    attendedContestsCount
    globalRanking
  }
}
`;

const SUBMISSION_CALENDAR_QUERY = `
query($username:String!) {
  matchedUser(username:$username) {
    submissionCalendar
  }
}
`;

async function fetch(handle) {
  try {
    const [profileRes, calendarRes] = await Promise.all([
      axios.post(LEETCODE_API, {
        query: USER_PROFILE_QUERY,
        variables: { username: handle },
      }),
      axios.post(LEETCODE_API, {
        query: SUBMISSION_CALENDAR_QUERY,
        variables: { username: handle },
      }),
    ]);

    const matchedUser = profileRes.data?.data?.matchedUser;
    if (!matchedUser) return null;

    const acSubmissionNum = matchedUser.submitStats?.acSubmissionNum || [];
    const totalSolved = acSubmissionNum
      .filter((s) => s.difficulty !== "All")
      .reduce((sum, s) => sum + s.count, 0);

    const contestRanking = profileRes.data?.data?.userContestRanking || {};
    const rating = contestRanking.rating || 0;
    const globalRank = contestRanking.globalRanking || 0;

    const topics = [
      { name: "Easy", count: acSubmissionNum.find((s) => s.difficulty === "Easy")?.count || 0 },
      { name: "Medium", count: acSubmissionNum.find((s) => s.difficulty === "Medium")?.count || 0 },
      { name: "Hard", count: acSubmissionNum.find((s) => s.difficulty === "Hard")?.count || 0 },
    ];

    let submissions = [];
    try {
      const calendarRaw = calendarRes.data?.data?.matchedUser?.submissionCalendar;
      if (calendarRaw) {
        const calendar = JSON.parse(calendarRaw);
        submissions = Object.entries(calendar).map(([ts, count]) => ({
          date: new Date(parseInt(ts) * 1000).toISOString().split("T")[0],
          count,
        }));
      }
    } catch {
      /* ignore calendar parse errors */
    }

    return {
      totalSolved,
      rating: Math.round(rating),
      maxRating: Math.round(rating),
      rank: matchedUser.profile?.ranking
        ? `#${matchedUser.profile.ranking}`
        : "",
      globalRank,
      dayStreak: 0,
      bestStreak: 0,
      topics,
      submissions,
    };
  } catch {
    return null;
  }
}

module.exports = { fetch };
