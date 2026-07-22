import { Link } from "react-router-dom";
import { Zap, PlayCircle, Share2, Download, Layers, BarChart2, Bell, Star, Rocket } from "lucide-react";
import Logo from "../components/Logo";
import banner from "../../resources/images/Codeforlio-Banner.png"
import supervisorImage from "../../resources/images/Dr_AHM_kamal.jpg";
import developerImage from "../../resources/images/maruf_hossain.png";
import demoUserImage from "../../resources/images/saikat.png"

export default function Landing() {
  return (
    <div className="bg-primary-dark overflow-x-hidden">
      <nav className="fixed w-full top-0 z-50 bg-[rgba(21,27,44,0.7)] backdrop-blur-[10px] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Logo className="h-10 w-auto" />
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-text-muted hover:text-accent-cyan px-3 py-2 text-sm font-medium transition-colors">Features</a>
              <Link to="/leaderboard" className="text-text-muted hover:text-accent-cyan px-3 py-2 text-sm font-medium transition-colors">Leaderboard</Link>
              <a href="#" className="text-text-muted hover:text-accent-cyan px-3 py-2 text-sm font-medium transition-colors">Pricing</a>
              <a href="#" className="text-text-muted hover:text-accent-cyan px-3 py-2 text-sm font-medium transition-colors">Blog</a>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="text-text-muted hover:text-body-text text-sm font-medium">Sign In</Link>
              <Link to="/signup" className="bg-accent-cyan hover:bg-cyan-400 text-body-text px-6 py-2.5 rounded-md text-sm font-bold transition-colors">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-screen flex items-center justify-center">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed opacity-50"
          style={{
            backgroundImage: `url(${banner})`,
          }}
        />
        <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(to bottom, rgba(10, 15, 26, 0.8) 0%, rgba(10, 15, 26, 1) 100%)" }} />
        <div className="absolute inset-0 z-0" style={{ background: "radial-gradient(circle at center, rgba(0, 210, 255, 0.15) 0%, rgba(10, 15, 26, 0) 70%)" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            Your Coding Career, Supercharged
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl mx-auto leading-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            One Dashboard for <br /> Your Entire Coding Journey
          </h1>

          <p className="mt-4 text-xl text-text-muted max-w-2xl mx-auto mb-10">
            Aggregate LeetCode, Codeforces, HackerRank & more into one powerful portfolio. Track your progress, compete on leaderboards, and land your dream job.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-accent-cyan hover:bg-cyan-400 text-body-text px-8 py-3.5 rounded-md font-bold text-lg transition-all transform hover:scale-105"
            >
              Generate My Portfolio
            </Link>
            <a
              href="#demo"
              className="bg-[rgba(21,27,44,0.7)] backdrop-blur-[10px] border border-white/5 hover:bg-white/10 text-body-text px-8 py-3.5 rounded-md font-medium text-lg flex items-center gap-2 transition-all"
            >
              <PlayCircle className="w-5 h-5" />
              Watch Demo
            </a>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/10 pt-10 w-full">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent-cyan">50,000+</div>
              <div className="text-sm text-text-muted mt-2 uppercase tracking-wide">Active Coders</div>
            </div>
            <div className="text-center md:border-l md:border-r border-white/10 px-12">
              <div className="text-4xl font-bold text-accent-cyan">8</div>
              <div className="text-sm text-text-muted mt-2 uppercase tracking-wide">Platforms Integrated</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent-cyan">2.4M+</div>
              <div className="text-sm text-text-muted mt-2 uppercase tracking-wide">Submissions Tracked</div>
            </div>
          </div>
        </div>
      </section>

      <section id="demo" className="relative -mt-20 z-20 max-w-5xl mx-auto px-4">
        <h3 className="text-xl font-bold mb-4 ml-4">Demo Profile</h3>

        <div className="bg-card-bg rounded-2xl shadow-2xl overflow-hidden border border-white/10 transform rotate-[-1deg] hover:rotate-0 transition-transform duration-500">
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-white/20 overflow-hidden shrink-0">
                  <img
                    src={demoUserImage}
                    alt="Maruf_Hossain"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-accent-cyan animate-pulse" />
              </div>

              <div className="text-center md:text-left flex-1">
                <h2 className="text-3xl font-bold mb-2">Muhammad SaiKat</h2>
                <div className="text-text-muted text-sm mb-4 font-mono">
                  @Saikat_codes &bull; Full Stack Developer &bull; Competitive Programmer &bull; Candidate Master @Codeforces 
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium border border-blue-500/30">Competitive Programmer</span>
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-medium border border-purple-500/30">Open Source</span>
                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium border border-green-500/30">Web Developer</span>
                </div>

                <div className="flex gap-3 justify-center md:justify-start">
                  <button className="bg-accent-cyan text-body-text px-4 py-2 rounded text-sm font-bold flex items-center gap-2">
                    <Share2 className="w-4 h-4" /> Share Portfolio
                  </button>
                  <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-body-text px-4 py-2 rounded text-sm flex items-center gap-2 transition-colors">
                    <Download className="w-4 h-4" /> Export PDF
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-10 bg-[#0a0f1a] rounded-xl p-6 border border-white/5 flex flex-wrap justify-between items-center gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-cyan font-mono">3,172</div>
                <div className="text-xs text-text-muted mt-1 uppercase">Problems Solved</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-orange font-mono">2,085</div>
                <div className="text-xs text-text-muted mt-1 uppercase">Max CF Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-green font-mono">228</div>
                <div className="text-xs text-text-muted mt-1 uppercase">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-orange font-mono">#516</div>
                <div className="text-xs text-text-muted mt-1 uppercase">Global Rank</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-cyan font-mono">8</div>
                <div className="text-xs text-text-muted mt-1 uppercase">Platforms Connected</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-32 px-4 max-w-7xl mx-auto text-center">
        <div className="text-accent-cyan text-xs font-bold tracking-widest uppercase mb-4">Everything In One Place</div>
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Built for Competitive Coders</h2>
        <p className="text-text-muted max-w-2xl mx-auto mb-16">Stop juggling tabs. CodeFolio unifies your performance data across all major coding platforms.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card-bg p-8 rounded-xl border border-white/5 hover:border-white/20 transition-colors text-left group">
            <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-6 text-accent-cyan group-hover:bg-accent-cyan/10 transition-colors">
              <Layers />
            </div>
            <h4 className="text-xl font-bold mb-3">Multi-Platform Sync</h4>
            <p className="text-text-muted text-sm leading-relaxed">Connect LeetCode, Codeforces, HackerRank, CodeChef, AtCoder and more with one click.</p>
          </div>

          <div className="bg-card-bg p-8 rounded-xl border border-white/5 hover:border-white/20 transition-colors text-left group">
            <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-6 text-accent-purple group-hover:bg-accent-purple/10 transition-colors">
              <BarChart2 />
            </div>
            <h4 className="text-xl font-bold mb-3">Deep Analytics</h4>
            <p className="text-text-muted text-sm leading-relaxed">Heatmaps, rating graphs, streak tracking and topic-wise breakdown give you full clarity.</p>
          </div>

          <div className="bg-card-bg p-8 rounded-xl border border-white/5 hover:border-white/20 transition-colors text-left group">
            <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-6 text-accent-green group-hover:bg-accent-green/10 transition-colors">
              <Bell />
            </div>
            <h4 className="text-xl font-bold mb-3">Contest Reminders</h4>
            <p className="text-text-muted text-sm leading-relaxed">Never miss a contest. Get notified about upcoming rounds on Codeforces, LeetCode and more.</p>
          </div>
        </div>

        <div className="mt-24">
          <div className="text-sm text-text-muted uppercase tracking-widest mb-8">Integrated Platforms</div>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500 font-mono text-sm">
            <span>LeetCode</span>
            <span>Codeforces</span>
            <span>HackerRank</span>
            <span>CodeChef</span>
            <span>AtCoder</span>
            <span>GeeksForGeeks</span>
            <span>GitHub</span>
          </div>
        </div>
      </section>

      <section className="bg-card-bg py-24 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-16 max-w-xl mx-auto">Trusted by coders at top companies</h2>

          <div className="flex flex-col md:flex-row justify-center gap-16 md:gap-24">
            <div>
              <div className="text-5xl font-bold text-accent-cyan mb-2">#1</div>
              <div className="text-sm text-text-muted italic">Coder Portfolio Tool</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-accent-cyan mb-2">99%</div>
              <div className="text-sm text-text-muted italic">Uptime SLA</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-accent-cyan mb-2 flex items-center justify-center gap-2">
                4.9 <Star className="text-yellow-500 fill-current" />
              </div>
              <div className="text-sm text-text-muted italic">User Rating</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-accent-cyan mb-2">340+</div>
              <div className="text-sm text-text-muted italic">Recruiters Using Portfolios</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 text-center px-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to boost your coding<br />career?</h2>
        <p className="text-text-muted mb-10 max-w-lg mx-auto">Join 50,000+ developers who use CodeFolio to track progress and impress recruiters.</p>
        <Link
          to="/signup"
          className="bg-accent-cyan hover:bg-cyan-400 text-body-text px-8 py-4 rounded-md font-bold text-lg inline-flex items-center gap-2 transition-transform transform hover:-translate-y-1"
        >
          <Rocket /> Start Building Your Portfolio
        </Link>
        <p className="text-xs text-text-muted mt-4 italic">Free forever &bull; No credit card required</p>
      </section>

      <footer className="bg-card-bg border-t border-white/5 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <Logo className="h-8 w-auto mb-4" />
              <p className="text-text-muted text-sm max-w-xs italic">The definitive coding portfolio platform for developers who mean business.</p>
            </div>

            <div>
              <h5 className="font-bold text-sm mb-4">Product</h5>
              <ul className="space-y-2 text-sm text-text-muted">
                <li><Link to="/dashboard" className="hover:text-body-text transition-colors">Dashboard</Link></li>
                <li><Link to="/portfolio" className="hover:text-body-text transition-colors">Portfolio</Link></li>
                <li><Link to="/leaderboard" className="hover:text-body-text transition-colors">Leaderboard</Link></li>
                <li><Link to="/contests" className="hover:text-body-text transition-colors">Contests</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-sm mb-4">Company</h5>
              <ul className="space-y-2 text-sm text-text-muted">
                <li><a href="#" className="hover:text-body-text transition-colors">About</a></li>
                <li><a href="#" className="hover:text-body-text transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-body-text transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-body-text transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-12 pb-8">
            <h4 className="text-2xl font-bold mb-8">Meet us</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full border-2 border-white/20 overflow-hidden shrink-0">
                  <img
                    src={supervisorImage}
                    alt="Dr. AHM Kamal"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm text-text-muted mb-1">Supervised By:</div>
                  <div className="font-bold">Dr. AHM Kamal</div>
                  <div className="text-sm text-text-muted text-xs leading-relaxed">
                    Professor<br />
                    Computer Science and Engineering<br />
                    Jatiya Kabi Kazi Nazrul Islam University<br />
                    kamal@jkkniu.edu.bd<br />
                    +8801732226402
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full border-2 border-white/20 overflow-hidden shrink-0">
                  <img
                    src={developerImage}
                    alt="MD. Maruf hossain"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm text-text-muted mb-1">Developed By:</div>
                  <div className="font-bold">MD. Maruf Hossain</div>
                  <div className="text-sm text-text-muted text-xs leading-relaxed">
                    Session: 2021-2022<br />
                    Department of Computer Science and Engineering<br />
                    Jatiya Kabi Kazi Nazrul Islam University<br />
                    marufhussain745@gmail.com<br />
                    +8801831710007
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-text-muted">
            <p>&copy; 2026 CodeFolio. All rights reserved.</p>
            <p className="font-mono">Made with code, coffee, and caffeine.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
