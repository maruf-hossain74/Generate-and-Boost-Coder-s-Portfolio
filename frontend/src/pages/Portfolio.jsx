import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Star, Share2, FileText, Copy, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const BADGE_DEFS = [
  { key: "dayStreak", min: 50, label: "50+ Day Streak", icon: "🔥" },
  { key: "dayStreak", min: 100, label: "100+ Day Streak", icon: "🔥" },
  { key: "dayStreak", min: 200, label: "200+ Day Streak", icon: "🔥" },
  { key: "totalSolved", min: 500, label: "500 Problems Solved", icon: "⭐" },
  { key: "totalSolved", min: 1000, label: "1,000 Problems Solved", icon: "⭐" },
  { key: "totalSolved", min: 2000, label: "2,000 Problems Solved", icon: "⭐" },
  { key: "maxCfRating", min: 1200, label: "Pupil on Codeforces", icon: "📈" },
  { key: "maxCfRating", min: 1600, label: "Expert on Codeforces", icon: "📈" },
  { key: "maxCfRating", min: 2000, label: "Candidate Master", icon: "📈" },
  { key: "globalRank", min: 10000, label: "Top 10K Globally", icon: "🌍" },
  { key: "globalRank", min: 5000, label: "Top 5K Globally", icon: "🌍" },
  { key: "globalRank", min: 1000, label: "Top 1K Globally", icon: "🌍" },
  { key: "platformsConnected", min: 3, label: "Multi-Platform Coder", icon: "🔗" },
  { key: "platformsConnected", min: 5, label: "Full Stack Coder", icon: "🔗" },
  { key: "platformsConnected", min: 7, label: "Platform Conqueror", icon: "🔗" },
];

function computeBadges(stats) {
  if (!stats) return [];
  const earned = [];
  for (const b of BADGE_DEFS) {
    const val = stats[b.key];
    if (val !== undefined && val >= b.min) {
      earned.push(b);
    }
  }
  const seen = new Set();
  return earned.filter((b) => {
    const key = b.key + b.min;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export default function Portfolio() {
  const { codefolioId } = useParams();
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const targetId = codefolioId || authUser?.codefolioId;

  useEffect(() => {
    if (!targetId) {
      setLoading(false);
      setError("No user specified");
      return;
    }
    let cancelled = false;
    async function fetchPortfolio() {
      try {
        const res = await api.get(`/user/portfolio/${targetId}`);
        if (!cancelled) setData(res.data);
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.error || "User not found");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchPortfolio();
    return () => { cancelled = true; };
  }, [targetId]);

  const handleShare = async () => {
    const url = `${window.location.origin}/portfolio/${targetId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center">
        <p className="text-text-muted">Loading portfolio...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted mb-4">{error || "Portfolio not found"}</p>
          <Link to="/" className="text-accent-cyan hover:underline">Go home</Link>
        </div>
      </div>
    );
  }

  const { user, stats, platforms, topicMastery } = data;
  const badges = computeBadges(stats);
  const isOwn = authUser?._id === user._id;

  return (
    <div className="min-h-screen bg-app-bg p-6 lg:p-10 max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-12">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-wider">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-sm shadow-[0_0_10px_rgba(19,212,241,0.3)]">
            CF
          </div>
          CODEFOLOI
        </Link>
        <div className="space-x-4">
          {!authUser && (
            <Link to="/login" className="bg-gray-800 px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition">
              Sign In
            </Link>
          )}
        </div>
      </header>

      <section className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-12">
        <div className="w-24 h-24 rounded-full border-4 border-gray-800 bg-gray-700 flex items-center justify-center text-3xl font-bold shrink-0">
          {user.avatar ? (
            <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
          ) : (
            (user.displayName || "U").charAt(0).toUpperCase()
          )}
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold">{user.displayName || "Unknown"}</h1>
          <p className="text-text-muted mt-1">
            @{user.codefolioId || "user"} &bull; Competitive Programmer
          </p>
          {user.bio && (
            <p className="text-text-muted text-sm mt-2 max-w-lg">{user.bio}</p>
          )}
          <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
            {user.badges?.length > 0 ? (
              user.badges.map((b, i) => (
                <span
                  key={i}
                  className="bg-accent-cyan/10 text-accent-cyan px-3 py-1 rounded-full text-xs border border-accent-cyan/20"
                >
                  {b}
                </span>
              ))
            ) : (
              <>
                <span className="bg-accent-cyan/10 text-accent-cyan px-3 py-1 rounded-full text-xs border border-accent-cyan/20">
                  Competitive Programmer
                </span>
                <span className="bg-accent-purple/10 text-accent-purple px-3 py-1 rounded-full text-xs border border-accent-purple/20">
                  Open Source
                </span>
              </>
            )}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 bg-sidebar-bg p-6 lg:p-8 rounded-2xl border border-gray-800 mb-8">
        <StatItem value={stats.totalSolved?.toLocaleString() || "0"} label="Problems Solved" color="text-accent-cyan" />
        <StatItem value={stats.maxCfRating?.toLocaleString() || "0"} label="Max CF Rating" color="text-accent-purple" />
        <StatItem value={stats.dayStreak?.toString() || "0"} label="Day Streak" color="text-accent-orange" />
        <StatItem value={stats.globalRank ? `#${stats.globalRank.toLocaleString()}` : "—"} label="Global Rank" color="text-red-400" />
        <StatItem value={stats.platformsConnected?.toString() || "0"} label="Platforms" color="text-accent-green" />
      </div>

      <div className="flex gap-3 mb-8 justify-center sm:justify-start">
        <button
          onClick={handleShare}
          className="flex items-center gap-2 bg-accent-cyan/10 text-accent-cyan px-4 py-2 rounded-lg text-sm font-bold border border-accent-cyan/20 hover:bg-accent-cyan/20 transition"
        >
          {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          {copied ? "Copied!" : "Share Portfolio"}
        </button>
        <button className="flex items-center gap-2 bg-gray-800 text-text-muted px-4 py-2 rounded-lg text-sm font-bold border border-gray-700 hover:bg-gray-700 transition">
          <FileText className="w-4 h-4" /> Export PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-sidebar-bg p-6 rounded-2xl border border-gray-800">
          <h2 className="font-bold mb-6">Topic Mastery</h2>
          {(!topicMastery || topicMastery.length === 0) ? (
            <p className="text-text-muted text-sm">No topic data available yet. Connect platforms to see your topic breakdown.</p>
          ) : (
            <div className="space-y-4">
              {topicMastery.map((t) => (
                <div key={t.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{t.name}</span>
                    <span className="text-text-muted">{t.percentage}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent-cyan rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(t.percentage, 1)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-sidebar-bg p-6 rounded-2xl border border-gray-800">
          <h2 className="font-bold mb-6">Achievements & Badges</h2>
          {badges.length === 0 ? (
            <p className="text-text-muted text-sm">No badges earned yet. Start solving problems to unlock achievements!</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {badges.map((b) => (
                <div
                  key={b.key + b.min}
                  className="p-4 border border-gray-700 rounded-xl hover:border-accent-cyan transition-all cursor-pointer text-center"
                >
                  <div className="text-2xl mb-2">{b.icon}</div>
                  <p className="text-xs font-bold">{b.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatItem({ value, label, color }) {
  return (
    <div className="text-center">
      <p className={`text-2xl font-bold font-mono ${color}`}>{value}</p>
      <p className="text-xs text-text-muted mt-1">{label}</p>
    </div>
  );
}
