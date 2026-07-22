import { useNavigate } from "react-router-dom";
import { Sun, Moon, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 bg-sidebar-bg border-b border-gray-800 px-4 lg:px-6 h-14 flex items-center justify-end gap-3">
      <div className="flex items-center gap-3 ml-auto">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-colors"
          title={theme === "dark" ? "Light Mode" : "Dark Mode"}
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {user && (
          <>
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0">
                {user.displayName?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="min-w-0 hidden sm:block text-left">
                <p className="text-sm font-bold leading-tight truncate max-w-[120px]">
                  {user.displayName || "User"}
                </p>
                <p className="text-[11px] text-accent-cyan truncate max-w-[120px]">
                  @{user.codefolioId || user.email?.split("@")[0]}
                </p>
              </div>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors"
              title="Log Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </header>
  );
}
