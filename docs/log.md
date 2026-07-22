# Update Log

## 2026-07-22

### Replaced brand logo/text with PNG image

- Added `frontend/resources/logos/CodeFolioLogo.png`
- Created `frontend/src/components/Logo.jsx` — reusable clickable logo component
  - Click navigates to `/dashboard` if logged in, otherwise refreshes landing page
- Replaced all CF icon + "CODEFOLIO" brand text with the PNG in:
  - `Sidebar.jsx` (sidebar navigation)
  - `Landing.jsx` (navbar + footer)
  - `Login.jsx` (left panel header)
  - `Signup.jsx` (left panel header)

### Improved CodeChef fetcher with robust web scraping

- Rewrote `backend/services/fetchers/codechef.js` with resilient regex patterns
  - Added `\s*` to handle whitespace between HTML tags and values
  - Added Python-inspired fallback `Highest\s+Rating[^\d]*(\d+)` for max rating
  - Multi-pattern approach for total solved (`Total Problems Solved` → `Problems Solved` → `Solved`)
  - Fixed star extraction to count `&#9733;` entities (not raw `★`)
  - Added per-field logging with `[CodeChef]` prefix for audit trail

### Moved profile/theme-toggle/logout to top Navbar

- Created `frontend/src/components/layout/Navbar.jsx` — sticky top bar with:
  - Theme toggle (`Sun`/`Moon` icon)
  - Clickable profile (avatar + name → `/dashboard`)
  - Logout button (`LogOut` icon)
- Updated `ProtectedLayout.jsx` — wraps main content area with `<Navbar />` above `<Outlet />`
- Simplified `Sidebar.jsx` — removed profile/theme/logout section, now contains only logo + nav links

### Added day/night theme toggle + sidebar improvements

- Created `frontend/src/context/ThemeContext.jsx` — theme provider with `dark`/`light` state persisted to localStorage
- Updated `tailwind.config.js` — added `darkMode: "class"` and switched colors to CSS variables (`var(--color-*)`)
- Updated `index.css` — defined CSS variables for dark (default) and `.light` theme overrides
- Updated `main.jsx` — wrapped app with `<ThemeProvider>`
- Updated `Sidebar.jsx`:
  - Profile avatar/name is now clickable → navigates to `/dashboard`
  - Added `Log Out` button with `LogOut` icon (red styling)
  - Added theme toggle button (`Sun`/`Moon` icon) switching between Light/Dark mode

### Fixed day/night toggle — made all Tailwind color utilities theme-aware

- Updated `tailwind.config.js`:
  - Added `shade()` helper function that maps colors to CSS variables with opacity support via `rgba()` / `rgb()`
  - Overrode `gray` (shades 200–900), `white`, and `black` color scales to use `var(--gray-*)` / `var(--white)` / `var(--black)`
- Updated `index.css`:
  - Added RGB space-separated CSS variables (`--gray-200` through `--gray-900`, `--white`, `--black`) in `:root` (dark) and `:root.light` (light)
  - Light mode grays 600–900 lighten from dark slate to near-white
  - Added CSS overrides for 4 arbitrary `bg-[#...]` classes used in forms and landing page
- **Zero changes** to any of the 13 component files — all `bg-gray-*`, `border-gray-*`, `text-gray-*`, `text-white`, `bg-white/*`, `bg-black/*`, `border-white/*` classes now respond to theme toggle

### Fixed hardcoded text colors breaking day/night mode
- Replaced all `text-white` (always white) → `text-body-text` (adapts to theme):
  - Landing page buttons, footer links, demo card buttons
  - Auth form inputs (Login, Signup, ForgotPassword)
  - Leaderboard score values, Contest register buttons
  - Navbar avatar initial, Sidebar badge count
  - Dashboard activity heatmap tooltips
  - Platforms page tooltips and rating text
- Replaced all `text-black` (always black) → `text-body-text` (adapts to theme):
  - All `bg-accent-cyan` buttons (Get Started, Sign In, Set Reminder, Connect, Save, etc.)
  - Sidebar badge count
- Replaced `text-emerald-400`, `text-gray-200` → `text-accent-green`, `text-body-text` for theme-consistent coloring on leaderboard/contests

### Fixed remaining non-adaptive gray text and hardcoded colors
- Replaced `text-gray-400` (same in both themes) → `text-text-muted` (adapts):
  - Dashboard metric card badge text, Contest unknown platform label
- Replaced `text-gray-500` (same in both themes) → `text-text-muted` (adapts):
  - Input icon placeholders in Login/Signup/ForgotPassword (14 instances)
  - Login/Signup footer "Secured with" text
- Replaced landing page demo stat colors `text-orange-600`/`text-green-500`/`text-red-600`/`text-blue-500` → `text-accent-orange`/`text-accent-green`/`text-accent-cyan` (theme-aware)
- Replaced landing page feature card icon colors `text-purple-400`/`text-green-400` → `text-accent-purple`/`text-accent-green` (theme-aware)
- Replaced Dashboard/Portfolio stat `text-red-400` → `text-accent-purple` for theme-consistent "Global Rank" coloring
- Fixed `Dashboard.jsx` greeting heading using broken `theme` ternary (`theme === "dark" ? "text-white" : "text-black"`):
  - `theme` was undefined in `Dashboard` scope (only declared inside `Heatmap` function)
  - Replaced with `text-body-text` — no ternary needed, properly theme-aware
  - Removed unused `useTheme` import and `useTheme()` call

### Registered missing `body-text` Tailwind color in tailwind.config.js
- Added `"body-text": "var(--color-body-text)"` to `tailwind.config.js` colors
- **Root cause**: CSS variable `--color-body-text` existed in `index.css` but had no corresponding Tailwind utility class — all previous `text-body-text` fixes across the codebase produced zero CSS and silently did nothing
- Now `text-body-text` properly resolves to `#ffffff` in dark mode and `#0f172a` in light mode
