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
import { useState } from "react";
import Logo from "../Logo";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/portfolio", label: "My Portfolio", icon: User },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/contests", label: "Contests", icon: Calendar, badge: true },
  { to: "/platforms", label: "Platforms", icon: Link },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
      isActive
        ? "bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20"
        : "text-text-muted hover:text-white hover:bg-white/5"
    }`;

  const sidebar = (
    <div className="h-full bg-sidebar-bg border-r border-gray-800 flex flex-col p-6">
      <div className="mb-10">
        <Logo className="h-8 w-auto" />
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
