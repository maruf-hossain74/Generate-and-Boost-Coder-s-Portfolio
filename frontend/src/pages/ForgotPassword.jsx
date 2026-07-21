import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import api from "../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-card-bg border border-gray-800 rounded-2xl p-8 lg:p-10 shadow-2xl text-center">
          <div className="w-16 h-16 bg-accent-cyan/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-accent-cyan" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Check your email</h2>
          <p className="text-text-muted text-sm mb-8">
            If an account exists with that email, we&apos;ve sent a password reset link.
          </p>
          <Link
            to="/login"
            className="text-accent-cyan text-sm hover:underline flex items-center justify-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-dark flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-card-bg border border-gray-800 rounded-2xl p-8 lg:p-10 shadow-2xl">
        <h2 className="text-2xl font-bold mb-2">Forgot password?</h2>
        <p className="text-text-muted text-sm mb-8">
          Enter your email and we&apos;ll send you a reset link.
        </p>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#111624] border border-gray-800 rounded-lg py-2.5 pl-10 pr-3 text-sm text-white focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-colors"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-accent-cyan hover:bg-cyan-400 text-black font-bold text-sm py-3 rounded-lg transition-transform hover:-translate-y-0.5"
          >
            Send Reset Link
          </button>
        </form>
        <div className="mt-8 text-center">
          <Link to="/login" className="text-text-muted text-sm hover:text-white transition-colors italic flex items-center justify-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
