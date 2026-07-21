import { useState, useEffect } from "react";
import api from "../api/axios";

const PLATFORM_COLORS = {
  codeforces: "bg-blue-500",
  leetcode: "bg-orange-400",
  codechef: "bg-purple-500",
  hackerrank: "bg-green-500",
  atcoder: "bg-red-500",
  geeksforgeeks: "bg-green-400",
  github: "bg-gray-400",
};

const PLATFORM_LABELS = {
  codeforces: "Codeforces",
  leetcode: "LeetCode",
  codechef: "CodeChef",
  hackerrank: "HackerRank",
  atcoder: "AtCoder",
  geeksforgeeks: "GeeksforGeeks",
  github: "GitHub",
};

function MiniHeatmap({ data, year }) {
  const startDate = new Date(year, 0, 1);
  const startDay = startDate.getDay();
  const daysInYear = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 366 : 365;
  const map = {};
  for (const s of data) {
    map[s.date] = s.count;
  }
  const maxCount = Math.max(...data.map((s) => s.count), 1);
  const totalDays = startDay + daysInYear;
  const weeks = Math.ceil(totalDays / 7);

  const colors = [
    "bg-gray-800",
    "bg-green-900/60",
    "bg-green-700",
    "bg-green-500",
    "bg-green-400",
  ];

  return (
    <div className="flex gap-px overflow-x-auto pb-1">
      {Array.from({ length: weeks }, (_, w) => (
        <div key={w} className="flex flex-col gap-px">
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
            return (
              <div
                key={key}
                className="group relative"
              >
                <div className={`w-2 h-2 rounded-sm ${colors[level]}`} />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10 shadow-lg">
                  {count} on {key}
                </div>
              </div>
            );
          })}
        </div>
      ))}
      <div className="flex items-center gap-1 ml-2">
        {colors.map((c) => (
          <div key={c} className={`w-2 h-2 rounded-sm ${c}`} />
        ))}
      </div>
    </div>
  );
}

export default function PlatformsPage() {
  const [connected, setConnected] = useState([]);
  const [active, setActive] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchPlatforms() {
      try {
        const res = await api.get("/platforms");
        const list = (res.data.platforms || []).filter((p) => p.isConnected);
        if (!cancelled) {
          setConnected(list);
          if (list.length > 0) setActive(list[0].platform);
        }
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchPlatforms();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    async function fetchData() {
      try {
        const res = await api.get(`/stats/platform/${active}`);
        if (!cancelled) setData(res.data);
      } catch {
        if (!cancelled) setData(null);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, [active]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-text-muted">Loading platforms...</p>
      </div>
    );
  }

  if (connected.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-text-muted">No platforms connected yet. Go to Settings to connect.</p>
      </div>
    );
  }

  const maxTopicCount = Math.max(...(data?.topics || []).map((t) => t.count), 1);

  return (
    <div>
      <div className="flex gap-2 mb-8 flex-wrap">
        {connected.map((p) => {
          const isActive = p.platform === active;
          return (
            <button
              key={p.platform}
              onClick={() => setActive(p.platform)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                isActive
                  ? "bg-accent-cyan text-app-bg font-semibold"
                  : "bg-card-bg border border-gray-800 text-text-muted hover:text-white"
              }`}
            >
              <div className={`w-2 h-2 rounded-sm ${PLATFORM_COLORS[p.platform] || "bg-gray-400"}`} />
              {PLATFORM_LABELS[p.platform] || p.platform}
            </button>
          );
        })}
      </div>

      {data && (
        <>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-3 bg-panel-bg border border-gray-800 rounded-2xl p-6">
              <div className="text-xs text-text-muted uppercase mb-1">Total Questions</div>
              <div className="text-3xl font-bold text-accent-green font-mono">
                {data.totalSolved?.toLocaleString() || "0"}
              </div>
            </div>
            <div className="col-span-3 bg-panel-bg border border-gray-800 rounded-2xl p-6">
              <div className="text-xs text-text-muted uppercase mb-1">Total Active Days</div>
              <div className="text-3xl font-bold text-accent-green font-mono">
                {data.activeDays?.toLocaleString() || "0"}
              </div>
            </div>
            <div className="col-span-6 bg-panel-bg border border-gray-800 rounded-2xl p-6">
              <div className="text-xs text-text-muted uppercase mb-3">Activity</div>
              <MiniHeatmap data={data.heatmap || []} year={2026} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="bg-panel-bg border border-gray-800 rounded-2xl p-6">
              <h3 className="text-sm font-bold mb-4">Contest Ratings</h3>
              <div className="text-accent-green font-bold text-3xl">
                {data.rating > 0 ? (
                  <>Pupil <span className="text-white">{data.rating}</span></>
                ) : (
                  <span className="text-text-muted text-lg">Not available</span>
                )}
              </div>
              {data.maxRating > 0 && (
                <div className="text-xs text-text-muted mt-1">
                  (max: {data.maxRating})
                </div>
              )}
            </div>
            <div className="bg-panel-bg border border-gray-800 rounded-2xl p-6">
              <h3 className="text-sm font-bold mb-4">Topic Wise Distribution</h3>
              {data.topics.length === 0 ? (
                <p className="text-text-muted text-sm">No topic data available.</p>
              ) : (
                <div className="space-y-3">
                  {data.topics.slice(0, 8).map((t) => (
                    <div key={t.name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span>{t.name}</span>
                        <span className="text-text-muted">{t.count}</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent-cyan/60 rounded-full"
                          style={{
                            width: `${Math.max(
                              (t.count / maxTopicCount) * 100,
                              2
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
