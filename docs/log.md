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
