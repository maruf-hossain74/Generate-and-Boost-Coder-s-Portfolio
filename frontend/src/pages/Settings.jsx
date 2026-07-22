import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const TABS = ["Basic Info", "Profile Details", "Platforms", "Account"];

const ALL_PLATFORMS = [
  { value: "leetcode", label: "LeetCode", color: "bg-orange-400" },
  { value: "codeforces", label: "Codeforces", color: "bg-blue-400" },
  { value: "hackerrank", label: "HackerRank", color: "bg-green-500" },
  { value: "codechef", label: "CodeChef", color: "bg-purple-500" },
  { value: "atcoder", label: "AtCoder", color: "bg-red-500" },
  { value: "geeksforgeeks", label: "GeeksforGeeks", color: "bg-green-400" },
  { value: "github", label: "GitHub", color: "bg-gray-400" },
];

function DeleteModal({ open, onClose, onConfirm }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-panel-bg border border-gray-800 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
        <h3 className="text-lg font-bold mb-2">Delete Account</h3>
        <p className="text-text-muted text-sm mb-6">
          This action is permanent and cannot be undone. All your data will be deleted.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="bg-gray-800 text-text-muted px-4 py-2 rounded-lg text-sm hover:text-body-text transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition"
          >
            Delete My Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("Account");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("success");

  const [basic, setBasic] = useState({ displayName: "", bio: "", avatar: "" });
  const [password, setPassword] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [codefolioId, setCodefolioId] = useState("");
  const [platforms, setPlatforms] = useState([]);
  const [platformHandles, setPlatformHandles] = useState({});
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (!user) return;
    setBasic({
      displayName: user.displayName || "",
      bio: user.bio || "",
      avatar: user.avatar || "",
    });
    setCodefolioId(user.codefolioId || "");
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    async function fetchPlatforms() {
      try {
        const res = await api.get("/platforms");
        if (!cancelled) {
          const list = res.data.platforms || [];
          setPlatforms(list);
          const handles = {};
          for (const p of list) {
            handles[p.platform] = p.handle || "";
          }
          setPlatformHandles(handles);
        }
      } catch {
        /* ignore */
      }
    }
    fetchPlatforms();
    return () => { cancelled = true; };
  }, []);

  const showMsg = (text, type = "success") => {
    setMsg(text);
    setMsgType(type);
    setTimeout(() => setMsg(""), 3000);
  };

  const handleSaveBasic = async () => {
    try {
      const res = await api.put("/user/profile", {
        displayName: basic.displayName,
        bio: basic.bio,
        avatar: basic.avatar,
      });
      showMsg("Profile updated");
    } catch (err) {
      showMsg(err.response?.data?.error || "Failed to update profile", "error");
    }
  };

  const handleSaveAccount = async () => {
    try {
      if (codefolioId !== user?.codefolioId) {
        await api.put("/user/profile", { codefolioId });
      }
      if (password.newPassword) {
        if (password.newPassword !== password.confirmPassword) {
          showMsg("Passwords do not match", "error");
          return;
        }
        if (password.newPassword.length < 6) {
          showMsg("Password must be at least 6 characters", "error");
          return;
        }
        await api.put("/user/password", {
          oldPassword: password.oldPassword,
          newPassword: password.newPassword,
        });
      }
      showMsg("Account updated");
      setPassword({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      showMsg(err.response?.data?.error || "Failed to update account", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete("/user/account");
      logout();
    } catch {
      showMsg("Failed to delete account", "error");
      setShowDelete(false);
    }
  };

  const handleConnect = async (platform) => {
    const handle = platformHandles[platform]?.trim();
    if (!handle) {
      showMsg("Please enter a handle", "error");
      return;
    }
    try {
      await api.post("/platforms/connect", { platform, handle });
      showMsg(`Connected to ${platform}`);
      const res = await api.get("/platforms");
      setPlatforms(res.data.platforms || []);
    } catch (err) {
      showMsg(err.response?.data?.error || "Failed to connect", "error");
    }
  };

  const handleDisconnect = async (platform) => {
    try {
      await api.delete(`/platforms/${platform}`);
      showMsg(`Disconnected from ${platform}`);
      const res = await api.get("/platforms");
      setPlatforms(res.data.platforms || []);
      setPlatformHandles((prev) => ({ ...prev, [platform]: "" }));
    } catch {
      showMsg("Failed to disconnect", "error");
    }
  };

  const isConnected = (platform) =>
    platforms.find((p) => p.platform === platform)?.isConnected || false;

  return (
    <div>
      <div className="flex gap-2 mb-8 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t
                ? "bg-accent-cyan text-app-bg font-semibold"
                : "bg-gray-800 text-text-muted hover:text-body-text"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {msg && (
        <div
          className={`mb-6 px-4 py-3 rounded-lg text-sm ${
            msgType === "error"
              ? "bg-red-500/10 text-red-400 border border-red-500/20"
              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          }`}
        >
          {msg}
        </div>
      )}

      <div className="bg-panel-bg border border-gray-800 p-8 rounded-2xl max-w-2xl">
        {tab === "Basic Info" && (
          <>
            <h2 className="text-2xl font-bold mb-1">Basic Info</h2>
            <p className="text-text-muted mb-8">Update your profile details.</p>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="text-sm text-text-muted block mb-1">Display Name</label>
                <input
                  value={basic.displayName}
                  onChange={(e) => setBasic({ ...basic, displayName: e.target.value })}
                  className="w-full bg-input-bg border border-gray-700 p-2.5 rounded text-sm focus:outline-none focus:border-accent-cyan"
                />
              </div>
              <div>
                <label className="text-sm text-text-muted block mb-1">Bio</label>
                <textarea
                  value={basic.bio}
                  onChange={(e) => setBasic({ ...basic, bio: e.target.value })}
                  rows={3}
                  className="w-full bg-input-bg border border-gray-700 p-2.5 rounded text-sm focus:outline-none focus:border-accent-cyan resize-none"
                />
              </div>
              <div>
                <label className="text-sm text-text-muted block mb-1">Avatar URL</label>
                <input
                  value={basic.avatar}
                  onChange={(e) => setBasic({ ...basic, avatar: e.target.value })}
                  className="w-full bg-input-bg border border-gray-700 p-2.5 rounded text-sm focus:outline-none focus:border-accent-cyan"
                  placeholder="https://..."
                />
              </div>
              <button
                onClick={handleSaveBasic}
                className="bg-accent-cyan text-body-text font-bold px-6 py-2 rounded text-sm hover:bg-cyan-400 transition"
              >
                Save
              </button>
            </div>
          </>
        )}

        {tab === "Profile Details" && (
          <>
            <h2 className="text-2xl font-bold mb-1">Profile Details</h2>
            <p className="text-text-muted mb-8">Customize your portfolio appearance.</p>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="text-sm text-text-muted block mb-1">Badge Tags</label>
                <p className="text-xs text-text-muted mb-2">
                  These appear as colored pills on your portfolio page.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Competitive Programmer", "Open Source", "Full Stack", "AI/ML", "DevOps", "Cyber Security"].map(
                    (b) => {
                      const active = (user?.badges || []).includes(b);
                      return (
                        <button
                          key={b}
                          onClick={async () => {
                            const current = user?.badges || [];
                            const next = active
                              ? current.filter((x) => x !== b)
                              : [...current, b];
                            try {
                              await api.put("/user/profile", { badges: next });
                              showMsg("Badges updated");
                            } catch {
                              showMsg("Failed to update badges", "error");
                            }
                          }}
                          className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                            active
                              ? "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20"
                              : "bg-gray-800 text-text-muted border-gray-700 hover:text-body-text"
                          }`}
                        >
                          {b}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {tab === "Platforms" && (
          <>
            <h2 className="text-2xl font-bold mb-1">Platforms</h2>
            <p className="text-text-muted mb-8">Connect or disconnect your coding platform accounts.</p>
            <div className="space-y-4">
              {ALL_PLATFORMS.map((p) => {
                const connected = isConnected(p.value);
                return (
                  <div
                    key={p.value}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 bg-card-bg rounded-xl border border-gray-800"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1 w-full sm:w-auto">
                      <div className={`w-3 h-3 rounded-full shrink-0 ${p.color}`} />
                      <span className="text-sm font-medium">{p.label}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          connected
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-gray-800 text-text-muted"
                        }`}
                      >
                        {connected ? "Connected" : "Not connected"}
                      </span>
                    </div>
                    {connected ? (
                      <button
                        onClick={() => handleDisconnect(p.value)}
                        className="text-red-400 text-xs font-semibold hover:text-red-300 transition shrink-0"
                      >
                        Disconnect
                      </button>
                    ) : (
                      <div className="flex gap-2 w-full sm:w-auto">
                        <input
                          value={platformHandles[p.value] || ""}
                          onChange={(e) =>
                            setPlatformHandles({ ...platformHandles, [p.value]: e.target.value })
                          }
                          placeholder="Your handle"
                          className="flex-1 sm:w-40 bg-input-bg border border-gray-700 p-2 rounded text-xs focus:outline-none focus:border-accent-cyan"
                        />
                        <button
                          onClick={() => handleConnect(p.value)}
                          className="bg-accent-cyan text-body-text text-xs font-bold px-3 py-2 rounded hover:bg-cyan-400 transition shrink-0"
                        >
                          Connect
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {tab === "Account" && (
          <>
            <h2 className="text-2xl font-bold mb-1">Accounts</h2>
            <p className="text-text-muted mb-8">You can manage your accounts here.</p>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Account Information</h3>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="text-sm text-text-muted block mb-1">CodeFolio Id:</label>
                  <input
                    value={codefolioId}
                    onChange={(e) => setCodefolioId(e.target.value)}
                    className="w-full bg-input-bg border border-gray-700 p-2.5 rounded text-sm focus:outline-none focus:border-accent-cyan"
                  />
                </div>
                <div>
                  <label className="text-sm text-text-muted block mb-1">Email:</label>
                  <input
                    value={user?.email || ""}
                    readOnly
                    className="w-full bg-input-bg border border-gray-700 p-2.5 rounded text-sm text-text-muted"
                  />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Update Password</h3>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="text-sm text-text-muted block mb-1">Original Password:</label>
                  <input
                    type="password"
                    value={password.oldPassword}
                    onChange={(e) => setPassword({ ...password, oldPassword: e.target.value })}
                    className="w-full bg-input-bg border border-gray-700 p-2.5 rounded text-sm focus:outline-none focus:border-accent-cyan"
                  />
                </div>
                <div>
                  <label className="text-sm text-text-muted block mb-1">New Password:</label>
                  <input
                    type="password"
                    value={password.newPassword}
                    onChange={(e) => setPassword({ ...password, newPassword: e.target.value })}
                    className="w-full bg-input-bg border border-gray-700 p-2.5 rounded text-sm focus:outline-none focus:border-accent-cyan"
                    placeholder="Min 6 characters"
                  />
                </div>
                <div>
                  <label className="text-sm text-text-muted block mb-1">Confirm Password:</label>
                  <input
                    type="password"
                    value={password.confirmPassword}
                    onChange={(e) => setPassword({ ...password, confirmPassword: e.target.value })}
                    className="w-full bg-input-bg border border-gray-700 p-2.5 rounded text-sm focus:outline-none focus:border-accent-cyan"
                    placeholder="Repeat new password"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-10">
              <button
                onClick={() => setShowDelete(true)}
                className="bg-red-900/50 text-red-300 px-6 py-2 rounded text-sm font-bold hover:bg-red-900 transition"
              >
                Delete
              </button>
              <button
                onClick={handleSaveAccount}
                className="bg-accent-cyan text-body-text font-bold px-8 py-2 rounded text-sm hover:bg-cyan-400 transition"
              >
                Save
              </button>
            </div>
          </>
        )}
      </div>

      <DeleteModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
