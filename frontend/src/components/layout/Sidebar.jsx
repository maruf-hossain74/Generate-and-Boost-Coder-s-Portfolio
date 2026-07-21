import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Trophy,
  Calendar,
  Link,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/portfolio", label: "My Portfolio", icon: User },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/contests", label: "Contests", icon: Calendar, badge: true },
  { to: "/platforms", label: "Platforms", icon: Link },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
      isActive
        ? "bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20"
        : "text-text-muted hover:text-white hover:bg-white/5"
    }`;

  const sidebar = (
    <div className="h-full bg-sidebar-bg border-r border-gray-800 flex flex-col justify-between p-6">
      <div>
        <div className="flex items-center gap-2 mb-10 font-bold text-lg tracking-wider">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-sm shadow-[0_0_10px_rgba(19,212,241,0.3)]">
            CF
          </div>
          CODEFOLOI
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={linkClass}
              onClick={() => setMobileOpen(false)}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-accent-cyan text-black text-[10px] px-1.5 rounded-full font-bold">
                  3
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
      {user && (
        <div className="bg-gray-900/50 p-3 rounded-lg flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0">
            {user.displayName?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold truncate">
              {user.displayName || "User"}
            </p>
            <p className="text-xs text-accent-cyan truncate">
              @{user.codefolioId || user.email?.split("@")[0]}
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-sidebar-bg border border-gray-800 rounded-lg text-text-muted"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <aside className="hidden lg:flex w-64 shrink-0">{sidebar}</aside>

      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/60 z-30"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="lg:hidden fixed inset-y-0 left-0 z-40 w-64 animate-slide-in">
            {sidebar}
          </aside>
        </>
      )}
    </>
  );
}
