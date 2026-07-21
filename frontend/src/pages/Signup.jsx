import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, ShieldCheck, Github, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const platforms = [
  { name: "LeetCode", color: "bg-orange-400" },
  { name: "Codeforces", color: "bg-blue-400" },
  { name: "HackerRank", color: "bg-green-500" },
  { name: "CodeChef", color: "bg-purple-500" },
  { name: "AtCoder", color: "bg-red-500" },
];

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
    codefolioId: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await signup(form.email, form.password, form.displayName || form.email.split("@")[0]);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="lg:w-1/2 bg-panel-bg flex flex-col justify-center p-8 lg:p-24 relative overflow-hidden border-r border-gray-800">
        <div className="max-w-xl mx-auto w-full z-10 relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-2xl shadow-[0_0_15px_rgba(19,212,241,0.3)]">
              CF
            </div>
            <div>
              <span className="font-bold text-2xl tracking-wide">CODEFOLIO</span>
              <p className="text-[10px] text-text-muted uppercase tracking-widest leading-none mt-1">Build Your Digital Portfolio</p>
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold leading-[1.15] tracking-tight mb-6">
            Your entire coding<br />journey, unified.
          </h1>
          <p className="text-text-muted text-lg leading-relaxed mb-10 max-w-md italic">
            Join 500+ developers who track their progress, compete on leaderboards, and build standout portfolios that land jobs.
          </p>
          <div className="flex flex-wrap gap-3 mb-16">
            {platforms.map((p) => (
              <div
                key={p.name}
                className="flex items-center gap-2 bg-white/5 border border-gray-800 px-3 py-1.5 rounded text-sm font-mono text-gray-300"
              >
                <div className={`w-2 h-2 rounded-full ${p.color}`} />
                {p.name}
              </div>
            ))}
          </div>
          <div className="bg-card-bg/60 border border-gray-800 rounded-xl p-6 shadow-lg max-w-lg relative backdrop-blur-sm">
            <p className="text-gray-300 mb-6 italic leading-relaxed text-sm lg:text-base">
              &ldquo;CodeFolio helped me to maintain consistency and to reach from 1100 to 1800 rating in just 2 months.&rdquo;
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-600 border border-gray-600 flex items-center justify-center text-xs font-bold shrink-0">
                AR
              </div>
              <div>
                <div className="font-bold text-sm">Alex Rabbi</div>
                <div className="text-xs text-text-muted font-mono">SDE @ Samsung &bull; LeetCode 2100+</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:w-1/2 bg-primary-dark flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-card-bg border border-gray-800 rounded-2xl p-8 lg:p-10 shadow-2xl">
          <h2 className="text-2xl font-bold mb-2">Create your account</h2>
          <p className="text-text-muted text-sm mb-8 italic">Start building your developer portfolio</p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-800 rounded-lg py-2.5 text-sm font-medium transition-colors">
              <Github className="w-4 h-4" /> GitHub
            </button>
            <button className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-800 rounded-lg py-2.5 text-sm font-medium transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
          </div>
          <div className="relative flex items-center mb-8">
            <div className="flex-grow border-t border-gray-800" />
            <span className="flex-shrink-0 mx-4 text-text-muted text-xs uppercase tracking-widest font-semibold">OR</span>
            <div className="flex-grow border-t border-gray-800" />
          </div>
          {error && (
            <p className="text-red-400 text-sm mb-4">{error}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  name="displayName"
                  value={form.displayName}
                  onChange={handleChange}
                  className="w-full bg-[#111624] border border-gray-800 rounded-lg py-2.5 pl-10 pr-3 text-sm text-white focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-colors"
                  placeholder="Your name"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">CodeFolio ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <span className="text-sm">@</span>
                </div>
                <input
                  name="codefolioId"
                  value={form.codefolioId}
                  onChange={handleChange}
                  className="w-full bg-[#111624] border border-gray-800 rounded-lg py-2.5 pl-10 pr-3 text-sm text-white focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-colors"
                  placeholder="your-username"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-[#111624] border border-gray-800 rounded-lg py-2.5 pl-10 pr-3 text-sm text-white focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-colors"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  className="w-full bg-[#111624] border border-gray-800 rounded-lg py-2.5 pl-10 pr-10 text-sm text-white focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-colors"
                  placeholder="Min 6 characters"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-[#111624] border border-gray-800 rounded-lg py-2.5 pl-10 pr-3 text-sm text-white focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-colors"
                  placeholder="Repeat password"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-accent-cyan hover:bg-cyan-400 text-black font-bold text-sm py-3 rounded-lg flex items-center justify-center gap-2 mt-2 transition-transform hover:-translate-y-0.5"
            >
              Create Account
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-8 text-center">
            <Link to="/login" className="text-text-muted text-sm hover:text-white transition-colors italic">
              Already have an account? Sign in &rarr;
            </Link>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-800 flex items-center justify-center gap-2 text-xs text-gray-500">
            <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
            <span className="italic">Secured with 256-bit SSL encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}
