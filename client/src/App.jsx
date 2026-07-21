import { Routes, Route } from "react-router-dom";
import PublicLayout from "./components/layout/PublicLayout";
import ProtectedLayout from "./components/layout/ProtectedLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import LeaderboardPage from "./pages/Leaderboard";
import ContestsPage from "./pages/Contests";
import PlatformsPage from "./pages/Platforms";
import SettingsPage from "./pages/Settings";

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/portfolio/:codefolioId" element={<Portfolio />} />
      </Route>
      <Route
        element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/contests" element={<ContestsPage />} />
        <Route path="/platforms" element={<PlatformsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
