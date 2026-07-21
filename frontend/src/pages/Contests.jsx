import { useState, useEffect, useCallback } from "react";
import { Bell, BellOff, ExternalLink, Mail, Settings } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const PLATFORM_META = {
  leetcode: { label: "LeetCode", dot: "bg-orange-400", text: "text-orange-400" },
  codeforces: { label: "Codeforces", dot: "bg-blue-400", text: "text-blue-400" },
  codechef: { label: "CodeChef", dot: "bg-purple-500", text: "text-purple-500" },
};

const FILTERS = [
  { label: "All Contests", value: "" },
  { label: "LeetCode", value: "leetcode" },
  { label: "Codeforces", value: "codeforces" },
];

function formatDuration(seconds) {
  if (!seconds) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m} min`;
}

function formatDateTime(dateStr) {
  const d = new Date(dateStr);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const day = days[d.getDay()];
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${day}, ${h12}:${m} ${ampm}`;
}

function Countdown({ startTime }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const diff = new Date(startTime).getTime() - now;
  if (diff <= 0) return <span className="text-accent-green">Started</span>;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  return (
    <span className="font-mono text-accent-cyan font-bold">
      {days > 0 ? `${days}d ` : ""}{hours}h {minutes}m
    </span>
  );
}

export default function ContestsPage() {
  const { user } = useAuth();
  const [contests, setContests] = useState([]);
  const [reminders, setReminders] = useState(new Set());
  const [filter, setFilter] = useState("");
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchReminders = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.get("/contests/reminders");
      const ids = new Set(
        (res.data.reminders || []).map((r) => r.contestId?._id?.toString())
      );
      setReminders(ids);
    } catch {
      /* ignore */
    }
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    async function fetchContests() {
      try {
        const params = filter ? { platform: filter } : {};
        const res = await api.get("/contests/upcoming", { params });
        if (!cancelled) setContests(res.data.contests || []);
      } catch {
        if (!cancelled) setContests([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchContests();
    fetchReminders();
    return () => { cancelled = true; };
  }, [filter, fetchReminders]);

  const toggleReminder = async (contestId) => {
    if (!user) return;
    if (reminders.has(contestId)) {
      try {
        await api.delete(`/contests/${contestId}/reminder`);
        setReminders((prev) => {
          const next = new Set(prev);
          next.delete(contestId);
          return next;
        });
      } catch {
        /* ignore */
      }
    } else {
      try {
        await api.post(`/contests/${contestId}/reminder`);
        setReminders((prev) => new Set(prev).add(contestId));
      } catch {
        /* ignore */
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-text-muted">Loading contests...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold">Upcoming Contests</h1>
          {user && (
            <button
              onClick={() => setRemindersEnabled(!remindersEnabled)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 border transition-colors ${
                remindersEnabled
                  ? "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20"
                  : "bg-card-bg text-text-muted border-gray-800"
              }`}
            >
              <Bell className="w-3 h-3" />
              {remindersEnabled ? "Reminders On" : "Enable Reminders"}
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-2 mb-8">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f.value
                ? "bg-accent-cyan text-app-bg font-semibold"
                : "bg-card-bg border border-gray-800 text-text-muted hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {remindersEnabled && user && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-emerald-500 shrink-0" />
            <span className="text-sm font-medium">
              Email + Push reminders are enabled.{" "}
              <span className="text-text-muted italic">
                You&apos;ll be notified 1 hour before each contest you&apos;ve registered for.
              </span>
            </span>
          </div>
          <button className="text-xs text-accent-cyan font-semibold hover:underline flex items-center gap-1 shrink-0">
            <Settings className="w-3 h-3" /> Manage settings
          </button>
        </div>
      )}

      {contests.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-text-muted">No upcoming contests found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {contests.map((contest) => {
            const meta = PLATFORM_META[contest.platform] || {
              label: contest.platform,
              dot: "bg-gray-400",
              text: "text-gray-400",
            };
            const hasReminder = reminders.has(contest._id);

            return (
              <div
                key={contest._id}
                className="bg-panel-bg border border-gray-800 rounded-2xl p-6 relative"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-2 h-2 rounded-full ${meta.dot}`} />
                  <span className={`text-xs font-mono ${meta.text} uppercase`}>
                    {meta.label}
                  </span>
                  <span className="bg-red-500/10 text-red-500 px-2 py-0.5 rounded text-[10px] font-bold">
                    UPCOMING
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-1">{contest.name}</h3>
                <p className="text-sm text-text-muted mb-6">
                  {contest.description || "Competitive programming contest"}
                </p>

                <div className="flex flex-wrap gap-4 sm:gap-8 mb-6">
                  <div>
                    <div className="text-[10px] text-text-muted uppercase">Starts In</div>
                    <Countdown startTime={contest.startTime} />
                  </div>
                  <div>
                    <div className="text-[10px] text-text-muted uppercase">Duration</div>
                    <div className="font-mono text-gray-200 font-bold text-sm">
                      {formatDuration(contest.duration)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-text-muted uppercase">Date & Time</div>
                    <div className="font-mono text-gray-200 font-bold text-sm">
                      {formatDateTime(contest.startTime)}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  {user && (
                    <button
                      onClick={() => toggleReminder(contest._id)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold flex-1 flex items-center justify-center gap-2 transition-colors ${
                        hasReminder
                          ? "bg-gray-800 text-text-muted hover:bg-gray-700"
                          : "bg-accent-cyan text-black hover:bg-cyan-400"
                      }`}
                    >
                      {hasReminder ? (
                        <><BellOff className="w-4 h-4" /> Remove Reminder</>
                      ) : (
                        <><Bell className="w-4 h-4" /> Set Reminder</>
                      )}
                    </button>
                  )}
                  <a
                    href={contest.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-card-bg border border-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex-1 flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" /> Register
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
