import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function Heatmap({ data, year }) {
  const startDate = new Date(year, 0, 1);
  const startDay = startDate.getDay();
  const daysInYear = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 366 : 365;
  const map = {};
  for (const s of data) {
    map[s.date] = s.count;
  }
  const maxCount = Math.max(...data.map((s) => s.count), 1);

  const cells = [];
  const totalDays = startDay + daysInYear;
  const weeks = Math.ceil(totalDays / 7);
  const monthPositions = [];
  let lastMonth = -1;

  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < 7; d++) {
      const dayIndex = w * 7 + d;
      const date = new Date(year, 0, 1 + dayIndex - startDay);
      const key = date.toISOString().split("T")[0];
      const count = map[key] || 0;
      const month = date.getMonth();

      if (month !== lastMonth && date.getDate() <= 7) {
        monthPositions.push({ label: MONTH_LABELS[month], col: w });
        lastMonth = month;
      }

      let level = 0;
      if (count > 0) {
        const ratio = count / maxCount;
        if (ratio > 0.66) level = 4;
        else if (ratio > 0.33) level = 3;
        else if (ratio > 0.1) level = 2;
        else level = 1;
      }

      const colors = [
        "bg-gray-800",
        "bg-green-900/60",
        "bg-green-700",
        "bg-green-500",
        "bg-green-400",
      ];

      cells.push(
        <div
          key={key}
          className={`w-3 h-3 rounded-sm ${colors[level]} tooltip-container relative`}
          title={`${key}: ${count} submissions`}
        >
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
            {count} on {key}
          </div>
        </div>
      );
    }
  }

  return (
    <div>
      <div className="flex gap-0.5 overflow-x-auto pb-2">
        {monthPositions.map((m, i) => (
          <div
            key={i}
            className="text-[10px] text-text-muted"
            style={{ marginLeft: i === 0 ? 0 : `${(m.col - (monthPositions[i - 1]?.col || 0)) * 16 - 8}px` }}
          >
            {m.label}
          </div>
        ))}
      </div>
      <div className="flex gap-0.5 overflow-x-auto">
        {Array.from({ length: weeks }, (_, w) => (
          <div key={w} className="flex flex-col gap-0.5">
            {Array.from({ length: 7 }, (_, d) => {
              const dayIndex = w * 7 + d;
              const date = new Date(year, 0, 1 + dayIndex - startDay);
              const key = date.toISOString().split("T")[0];
              const count = map[key] || 0;
              let level = 0;
              if (count > 0) {
                const ratio = count / maxCount;
                if (ratio > 0.66) level = 4;
                else if (ratio > 0.33) level = 3;
                else if (ratio > 0.1) level = 2;
                else level = 1;
              }
              const colors = [
                "bg-gray-800",
                "bg-green-900/60",
                "bg-green-700",
                "bg-green-500",
                "bg-green-400",
              ];
              return (
                <div
                  key={key}
                  className="group relative"
                >
                  <div className={`w-3 h-3 rounded-sm ${colors[level]}`} />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10 shadow-lg">
                    {count} submission{count !== 1 ? "s" : ""} on {key}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1 mt-2 text-[10px] text-text-muted">
        <span>Less</span>
        {["bg-gray-800", "bg-green-900/60", "bg-green-700", "bg-green-500", "bg-green-400"].map(
          (c) => (
            <div key={c} className={`w-3 h-3 rounded-sm ${c}`} />
          )
        )}
        <span>More</span>
      </div>
    </div>
  );
}

const PLATFORM_LABELS = {
  leetcode: "LeetCode",
  codeforces: "Codeforces",
  hackerrank: "HackerRank",
  codechef: "CodeChef",
  atcoder: "AtCoder",
  geeksforgeeks: "GeeksforGeeks",
  github: "GitHub",
};

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [platforms, setPlatforms] = useState([]);
  const [heatmap, setHeatmap] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        const [dashboardRes, heatmapRes] = await Promise.all([
          api.get("/stats/dashboard"),
          api.get("/stats/heatmap", { params: { year: 2026 } }),
        ]);
        if (!cancelled) {
          setStats(dashboardRes.data.stats);
          setPlatforms(dashboardRes.data.platforms);
          setHeatmap(heatmapRes.data.submissions || []);
        }
      } catch {
        /* silenty fail */
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const portfolioUrl = user?.codefolioId
    ? `${window.location.origin}/portfolio/${user.codefolioId}`
    : "";

  const handleShare = () => {
    if (portfolioUrl) {
      navigator.clipboard.writeText(portfolioUrl);
    }
  };

  const metricCards = [
    {
      label: "TOTAL SOLVED",
      value: stats?.totalSolved?.toLocaleString() || "—",
      color: "text-accent-cyan",
      badge: stats?.totalSolved ? "+23 this week" : "",
    },
    {
      label: "CF RATING",
      value: stats?.cfRating?.toLocaleString() || "—",
      color: "text-accent-purple",
      badge: stats?.cfRating ? `Rating • Max: ${stats.maxCfRating}` : "",
    },
    {
      label: "CURRENT STREAK",
      value: stats?.dayStreak?.toString() || "—",
      color: "text-accent-orange",
      badge: stats?.bestStreak ? `Best: ${stats.bestStreak}` : "",
    },
    {
      label: "GLOBAL RANK",
      value: stats?.globalRank ? `#${stats.globalRank}` : "—",
      color: "text-red-400",
      badge: stats?.globalRank ? "Globally ranked" : "",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-text-muted">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold">
          {greeting}, {user?.displayName || "Coder"}
        </h1>
        {portfolioUrl && (
          <button
            onClick={handleShare}
            className="bg-accent-cyan/10 text-accent-cyan px-4 py-2 rounded-lg text-sm font-bold border border-accent-cyan/20 hover:bg-accent-cyan/20 transition"
          >
            Share Portfolio
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metricCards.map((m) => (
          <div
            key={m.label}
            className="bg-panel-bg p-6 rounded-2xl border border-gray-800"
          >
            <p className="text-text-muted text-xs tracking-wider">{m.label}</p>
            <p className={`text-3xl font-bold ${m.color} mt-2 font-mono`}>
              {m.value}
            </p>
            {m.badge && (
              <p className="text-gray-400 text-xs mt-1">{m.badge}</p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-panel-bg p-6 rounded-2xl border border-gray-800">
          <p className="text-sm font-semibold mb-4">Activity Heatmap</p>
          <Heatmap data={heatmap} year={2026} />
        </div>
        <div className="bg-panel-bg p-6 rounded-2xl border border-gray-800">
          <p className="text-sm font-semibold mb-4">Platform Overview</p>
          {platforms.length === 0 ? (
            <p className="text-text-muted text-xs">No platforms connected yet.</p>
          ) : (
            <div className="space-y-5">
              {platforms.map((p) => (
                <div key={p.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium">
                      {PLATFORM_LABELS[p.name] || p.name}
                    </span>
                    <span className="text-text-muted font-mono">
                      {p.solved.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${p.color} transition-all duration-500`}
                      style={{ width: `${Math.max(p.width, 2)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
