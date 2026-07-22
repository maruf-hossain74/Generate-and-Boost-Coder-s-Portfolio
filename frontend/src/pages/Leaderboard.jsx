import { useState, useEffect, useCallback } from "react";
import { Search, Crown, ChevronDown, ChevronUp, Minus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const FILTERS = [
  { label: "Global", value: "" },
  { label: "LeetCode", value: "leetcode" },
  { label: "Codeforces", value: "codeforces" },
  { label: "CodeChef", value: "codechef" },
  { label: "Friends", value: "friends" },
];

function getPodium(data) {
  const top3 = data.slice(0, 3);
  if (top3.length === 0) return null;
  const first = top3[0] || null;
  const second = top3[1] || null;
  const third = top3[2] || null;
  return { first, second, third };
}

function ChangeIcon({ change }) {
  if (change > 0) return <ChevronUp className="w-4 h-4 text-accent-green" />;
  if (change < 0) return <ChevronDown className="w-4 h-4 text-red-500" />;
  return <Minus className="w-4 h-4 text-text-muted" />;
}

export default function LeaderboardPage() {
  const { user: authUser } = useAuth();
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const fetchData = useCallback(async (p, f, q) => {
    setLoading(true);
    try {
      if (q) {
        const res = await api.get("/leaderboard/search", { params: { q } });
        setData(res.data.leaderboard || []);
        setPagination(null);
      } else if (f) {
        const res = await api.get(`/leaderboard/platform/${f}`, {
          params: { page: p, limit: 20 },
        });
        setData(res.data.leaderboard || []);
        setPagination(res.data.pagination);
      } else {
        const res = await api.get("/leaderboard", {
          params: { page: p, limit: 20 },
        });
        setData(res.data.leaderboard || []);
        setPagination(res.data.pagination);
      }
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    fetchData(1, filter, debouncedQuery);
  }, [filter, debouncedQuery, fetchData]);

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    setLoading(true);
    const fetchMore = async () => {
      try {
        if (filter) {
          const res = await api.get(`/leaderboard/platform/${filter}`, {
            params: { page: next, limit: 20 },
          });
          setData((prev) => [...prev, ...(res.data.leaderboard || [])]);
          setPagination(res.data.pagination);
        } else {
          const res = await api.get("/leaderboard", {
            params: { page: next, limit: 20 },
          });
          setData((prev) => [...prev, ...(res.data.leaderboard || [])]);
          setPagination(res.data.pagination);
        }
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    fetchMore();
  };

  const podium = getPodium(data);
  const hasMore = pagination ? page < pagination.totalPages : false;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 ">Global Leaderboard</h1>
          <p className="text-sm text-text-muted italic">
            Compete across all platforms &middot; Updated every 15 minutes
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search coders..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-card-bg border border-gray-800 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-accent-cyan text-body-text placeholder-text-muted transition-colors"
          />
        </div>
      </div>

      <div className="flex gap-2 mb-10 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f.value
                ? "bg-accent-cyan text-app-bg font-semibold"
                : "bg-card-bg border border-gray-800 text-text-muted hover:text-body-text"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {debouncedQuery && (
        <p className="text-text-muted text-sm mb-4">
          Search results for &ldquo;{debouncedQuery}&rdquo;
        </p>
      )}

      {loading && data.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-text-muted">Loading leaderboard...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-text-muted">No entries found.</p>
        </div>
      ) : (
        <>
          {!debouncedQuery && podium && !filter && (
            <div className="flex items-end justify-center gap-4 sm:gap-6 mb-12 flex-wrap">
              <div className="bg-panel-bg border border-gray-800 rounded-2xl p-6 flex flex-col items-center w-44 sm:w-56 shadow-lg pb-8 sm:pb-10">
                <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-full border-2 border-silver bg-gray-700 flex items-center justify-center text-lg font-bold mb-3">
                  {podium.second?.avatar ? (
                    <img src={podium.second.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    (podium.second?.displayName || "?")[0]
                  )}
                </div>
                <div className="text-2xl font-bold text-silver mb-1">#2</div>
                <div className="text-sm font-semibold text-center truncate w-full">
                  {podium.second?.displayName || "—"}
                </div>
                <div className="text-xs text-silver font-mono tracking-tight mt-1">
                  {podium.second?.totalSolved?.toLocaleString() || "0"} pts
                </div>
              </div>

              <div className="bg-panel-bg border-2 border-gold rounded-2xl p-6 flex flex-col items-center w-48 sm:w-64 shadow-[0_0_20px_rgba(245,158,11,0.15)] pb-10 sm:pb-12 relative -top-4">
                <Crown className="w-6 h-6 text-gold mb-2 absolute top-4" />
                <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full border-2 border-gold bg-gray-700 flex items-center justify-center text-2xl font-bold mb-3 mt-6">
                  {podium.first?.avatar ? (
                    <img src={podium.first.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    (podium.first?.displayName || "?")[0]
                  )}
                </div>
                <div className="text-3xl font-bold text-gold mb-1">#1</div>
                <div className="text-base font-bold text-center truncate w-full">
                  {podium.first?.displayName || "—"}
                </div>
                <div className="text-sm text-gold font-mono tracking-tight font-semibold mt-1">
                  {podium.first?.totalSolved?.toLocaleString() || "0"} pts
                </div>
              </div>

              <div className="bg-panel-bg border border-gray-800 rounded-2xl p-6 flex flex-col items-center w-44 sm:w-56 shadow-lg pb-6 sm:pb-8">
                <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-full border-2 border-bronze bg-gray-700 flex items-center justify-center text-base font-bold mb-3">
                  {podium.third?.avatar ? (
                    <img src={podium.third.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    (podium.third?.displayName || "?")[0]
                  )}
                </div>
                <div className="text-2xl font-bold text-bronze mb-1">#3</div>
                <div className="text-sm font-semibold text-center truncate w-full">
                  {podium.third?.displayName || "—"}
                </div>
                <div className="text-xs text-bronze font-mono tracking-tight mt-1">
                  {podium.third?.totalSolved?.toLocaleString() || "0"} pts
                </div>
              </div>
            </div>
          )}

          <div className="w-full">
            <div className="hidden sm:grid grid-cols-7 gap-4 px-6 py-3 bg-card-bg rounded-t-xl border border-gray-800 text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">
              <div className="text-center">#</div>
              <div className="col-span-2">Coder</div>
              <div className="text-center">Score</div>
              <div className="text-center">Solved</div>
              <div className="text-center">CF Rating</div>
              <div className="text-center">Streak</div>
              <div className="text-center">Change</div>
            </div>

            <div className="space-y-2">
              {data.map((entry, i) => {
                const isCurrentUser = authUser?.codefolioId === entry.codefolioId;
                return (
                  <div
                    key={entry.rank || i}
                    className={`grid grid-cols-2 sm:grid-cols-7 gap-2 sm:gap-4 px-4 sm:px-6 py-4 rounded-xl items-center shadow-sm ${
                      isCurrentUser
                        ? "bg-[#0c1626] border border-cyan-900/50"
                        : "bg-card-bg border border-gray-800"
                    }`}
                  >
                    <div
                      className={`font-mono text-center ${
                        isCurrentUser ? "text-accent-cyan font-semibold" : "text-text-muted"
                      }`}
                    >
                      {entry.rank}
                    </div>
                    <div className="col-span-2 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold shrink-0">
                        {entry.avatar ? (
                          <img src={entry.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          (entry.displayName || "?")[0]
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span
                          className={`text-sm font-semibold truncate ${
                            isCurrentUser ? "text-accent-cyan" : "text-body-text"
                          }`}
                        >
                          {entry.displayName}
                        </span>
                        {isCurrentUser && (
                          <span className="text-[10px] text-text-muted">You</span>
                        )}
                      </div>
                    </div>
                    <div
                      className={`font-mono text-center text-sm font-semibold hidden sm:block ${
                        isCurrentUser ? "text-accent-cyan" : "text-body-text"
                      }`}
                    >
                      {entry.totalSolved?.toLocaleString()}
                    </div>
                    <div className="font-mono text-center text-sm text-text-muted hidden sm:block">
                      {entry.totalSolved?.toLocaleString()}
                    </div>
                    <div className="font-mono text-center text-sm text-text-muted hidden sm:block">
                      {entry.cfRating || "—"}
                    </div>
                    <div
                      className={`font-mono text-center text-sm hidden sm:block ${
                        entry.streak > 100 ? "text-gold font-semibold" : "text-text-muted"
                      }`}
                    >
                      {entry.streak ? `${entry.streak}d` : "—"}
                    </div>
                    <div className="flex items-center justify-center hidden sm:flex">
                      <span className="font-mono text-sm font-semibold">
                        <ChangeIcon change={0} />
                      </span>
                    </div>

                    <div className="col-span-2 sm:hidden flex gap-4 mt-1 text-xs text-text-muted">
                      <span>Score: {entry.totalSolved?.toLocaleString()}</span>
                      <span>CF: {entry.cfRating || "—"}</span>
                      <span>Streak: {entry.streak ? `${entry.streak}d` : "—"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="bg-card-bg border border-gray-800 text-text-muted hover:text-body-text px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
