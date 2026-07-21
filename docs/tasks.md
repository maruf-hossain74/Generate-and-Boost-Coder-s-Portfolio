# Task Phases — Generate and Boost Coder's Portfolio (CodeFolio)

## MERN Stack · 15 Phases

---

## Phase 1: Project Scaffolding & MERN Boilerplate

**Goal:** Initialize the monorepo structure, install all dependencies, and verify the dev environment works end-to-end.

### Steps
1. Create project root with two folders: `server/` (Express API) and `client/` (React SPA)
2. **Server**: `npm init`, install `express`, `mongoose`, `dotenv`, `cors`, `bcryptjs`, `jsonwebtoken`, `passport`, `passport-google-oauth20`, `passport-github2`, `axios`, `node-cron`, `nodemailer`
3. **Client**: `npx create-react-app client` or Vite, install `react-router-dom`, `axios`, `lucide-react`, `recharts`, `tailwindcss`, `postcss`, `autoprefixer`
4. Configure Tailwind in the client (init, `tailwind.config.js` with the dark theme palette from SRS §4.1)
5. Add `.gitignore`, `.env.example` (PORT, MONGO_URI, JWT_SECRET, GMAIL credentials, OAuth keys)
6. Add `concurrently` to root `package.json` for `npm run dev` (starts both server and client)
7. Verify: `console.log("Server running")` + default React page renders

### Deliverables
- `/server/package.json` with all dependencies
- `/client/` with Tailwind configured and dark theme colors
- Root `package.json` with `dev` script
- `.env.example`

---

## Phase 2: Backend — MongoDB Connection & User Model

**Goal:** Connect to MongoDB, define the User model, and implement authentication routes.

### Steps
1. Create `/server/config/db.js` — Mongoose connection using `MONGO_URI`
2. Create `/server/models/User.js` — Schema: email, passwordHash, codefolioId, displayName, avatar, bio, badges[], role, provider, providerId, timestamps
3. Create `/server/models/PlatformConnection.js` — Schema: userId (ref), platform (enum), handle, profileUrl, isConnected, lastSyncedAt
4. Create `/server/models/UserStats.js` — Schema: userId (ref, unique), totalSolved, maxCfRating, currentCfRating, dayStreak, bestStreak, globalRank, platformsConnected
5. Create `/server/middleware/auth.js` — JWT verification middleware (extracts `req.user` from token)
6. Create `/server/routes/auth.js`:
   - `POST /api/auth/signup` — validate email/password, hash with bcrypt, create User, return JWT
   - `POST /api/auth/login` — find user by email, compare password, return JWT
   - `POST /api/auth/oauth/google` — verify Google token, find or create user
   - `POST /api/auth/oauth/github` — verify GitHub token, find or create user
   - `POST /api/auth/forgot-password` — generate reset token, send email (nodemailer)
   - `POST /api/auth/reset-password` — verify token, update password
   - `GET /api/auth/me` — protected; return current user from JWT
7. Create `/server/server.js` — Wire express, cors, json parser, routes, error handler. Listen on PORT.

### Deliverables
- Functional auth endpoints (test with curl/Postman)
- JWT-based protected routes
- Password hashing and email validation

---

## Phase 3: Backend — User Profile & Platform Management

**Goal:** Implement user profile CRUD and platform connection/disconnection.

### Steps
1. Create `/server/routes/user.js`:
   - `PUT /api/user/profile` — update displayName, bio, codefolioId, avatar. Validate codefolioId uniqueness.
   - `PUT /api/user/password` — require oldPassword, verify, hash new, save
   - `DELETE /api/user/account` — delete user + cascade delete PlatformConnection + UserStats + DailySubmissions + Reminders
   - `GET /api/user/portfolio/:codefolioId` — **public** route; fetch user + stats + platform connections (handle only, no tokens)
2. Create `/server/routes/platforms.js`:
   - `GET /api/platforms` — list connected platforms for current user
   - `POST /api/platforms/connect` — body: { platform, handle }. Validate handle exists via a quick API check. Create/update PlatformConnection. Update `platformsConnected` count in UserStats.
   - `PUT /api/platforms/sync` — trigger re-fetch for all connected platforms (call Phase 4 fetchers)
   - `DELETE /api/platforms/:platform` — set isConnected=false, remove handle, update count

### Deliverables
- Profile update, password change, account deletion
- Platform connect/disconnect with validation
- Public portfolio endpoint (returns JSON for the React portfolio page)

---

## Phase 4: Backend — Data Aggregation (Platform Fetchers)

**Goal:** Build fetcher modules that pull stats from each platform's public API or scrape profile pages.

### Steps
1. Create `/server/services/fetchers/leetcode.js`:
   - Use LeetCode GraphQL public API (`https://leetcode.com/graphql`) to query user public profile
   - Return: totalSolved, rating (if available), submission calendar (for heatmap)
2. Create `/server/services/fetchers/codeforces.js`:
   - Use CF API (`https://codeforces.com/api/user.info?handles=...`)
   - Return: rating, maxRating, rank, totalSolved (from `/api/user.status`)
3. Create `/server/services/fetchers/hackerrank.js` (scrape or unofficial API):
   - Return: total solved (badges), streaks
4. Create `/server/services/fetchers/codechef.js`:
   - Scrape or use CodeChef API for rating, problems solved
5. Create `/server/services/fetchers/atcoder.js`:
   - Use AtCoder API for rating, accepted count
6. Create `/server/services/fetchers/geeksforgeeks.js`:
   - Scrape profile for total solved, coding score
7. Create `/server/services/fetchers/github.js`:
   - Use GitHub REST API to fetch public repos, contributions (for streak visualization)
8. Create `/server/services/syncService.js`:
   - Orchestrator: given a userId, iterate connected platforms, call each fetcher, normalize results, update UserStats and DailySubmissions
9. Add `node-cron` job in server.js: `*/30 * * * *` sync all users (staggered to avoid rate limits)

### Deliverables
- 7 platform fetchers returning normalized data
- Sync service that updates MongoDB
- Cron job for periodic refresh

---

## Phase 5: Backend — Leaderboard & Contests

**Goal:** Build leaderboard ranking, contest calendar fetch, and reminder logic.

### Steps
1. Create `/server/models/LeaderboardCache.js` — Schema: userId (ref, unique), totalScore, totalSolved, cfRating, streak, rank, rankChange, lastUpdated
2. Create `/server/models/Contest.js` — Schema: platform, name, description, url, startTime, duration, isActive
3. Create `/server/models/ContestReminder.js` — Schema: userId, contestId, reminderTime, isSent
4. Create `/server/services/contestService.js`:
   - Fetch upcoming contests from Codeforces API, LeetCode GraphQL, CodeChef (scrape)
   - Upsert into Contests collection
   - Remove past contests
5. Create `/server/routes/leaderboard.js`:
   - `GET /api/leaderboard?page&limit` — aggregate UserStats sorted by totalSolved descending. Assign rank, compute rankChange from previous cache, return with pagination metadata
   - `GET /api/leaderboard/search?q=` — text search on displayName/codefolioId
   - `GET /api/leaderboard/platform/:platform` — filter by platform-specific rating
6. Create `/server/routes/contests.js`:
   - `GET /api/contests/upcoming` — return contests where startTime > now, sorted ascending
   - `POST /api/contests/:id/reminder` — create ContestReminder (default 1 hour before)
   - `DELETE /api/contests/:id/reminder` — remove reminder
7. Create `/server/services/reminderService.js`:
   - Every 5 minutes, check reminders where `isSent=false` and `reminderTime <= now`
   - Send email via nodemailer, mark `isSent=true`

### Deliverables
- Leaderboard with pagination, search, per-platform filters
- Contest data from all platforms
- Working email reminder system

---

## Phase 6: Frontend — React App Foundation & Shared Layout

**Goal:** Set up the React app with routing, global state, and the authenticated layout component.

### Steps
1. Configure React Router in `App.js`:
   - Public routes: `/` (Landing), `/login`, `/portfolio/:codefolioId`
   - Protected routes (wrap in `<ProtectedRoute>`): `/dashboard`, `/portfolio`, `/leaderboard`, `/contests`, `/platforms`, `/settings`
2. Create `/client/src/context/AuthContext.js`:
   - Store user, token, isAuthenticated
   - `login()`, `signup()`, `logout()`, `loadUser()` actions
   - Persist JWT in localStorage; on mount, call `GET /api/auth/me` to restore session
3. Create `/client/src/components/layout/Sidebar.jsx`:
   - CF Logo (gradient box) + "CODEFOLOI" + tagline
   - Nav items with Lucide icons: Dashboard, My Portfolio, Leaderboard, Contests (with notification badge count), Platforms, Settings
   - Active page highlighted with accent-cyan bg/border
   - Bottom: user card (avatar, name, subtitle)
4. Create `/client/src/components/layout/ProtectedLayout.jsx`:
   - Renders Sidebar + `<Outlet />` (main content area)
   - Responsive: sidebar collapses on mobile (hamburger toggle)
5. Create `/client/src/components/layout/PublicLayout.jsx` for landing page (navbar + footer)
6. Set up Axios instance in `/client/src/api/axios.js`:
   - Base URL from env, attach JWT via interceptor, handle 401 (auto-logout)

### Deliverables
- Routing with public/protected separation
- Sidebar component matching the demo HTML
- Auth context with token persistence
- Axios interceptors

---

## Phase 7: Frontend — Authentication Pages (Login/Signup)

**Goal:** Build the Login and Sign Up pages matching `loginPage.html`.

### Steps
1. Create `/client/src/pages/Login.jsx`:
   - **Left panel**: CF logo + "CODEFOLIO" + tagline, headline "Your entire coding journey, unified.", platform tags (LeetCode, Codeforces, HackerRank, CodeChef, AtCoder), testimonial card with avatar + quote
   - **Right panel**: form card with "Welcome back", GitHub + Google OAuth buttons, OR divider, email input (mail icon), password input (lock icon + eye toggle), "Forgot password?" link, Submit button, "Don't have an account? Create one free" link, SSL security badge
   - On submit: call `POST /api/auth/login`, store token in localStorage, redirect to `/dashboard`
2. Create `/client/src/pages/Signup.jsx`:
   - Same left panel
   - Form: email, password, confirm password, codefolioId
   - On submit: call `POST /api/auth/signup`
3. Create `/client/src/pages/ForgotPassword.jsx`:
   - Email input + submit. Show success message after sending.
4. Wire routes in App.js

### Deliverables
- Fully functional login/signup flow
- OAuth buttons (callback routes handled on server, redirect to `/dashboard` after success)
- Password reset flow

---

## Phase 8: Frontend — Dashboard Page

**Goal:** Build the authenticated dashboard matching `dashboard.html`.

### Steps
1. Create `/client/src/pages/Dashboard.jsx`:
   - Page header: "Good morning, {displayName}" + [Share Portfolio] button (copies the portfolio URL)
2. **4 Metric Cards** (grid-cols-4):
   - Total Solved (cyan) — value from UserStats, "+23 this week" badge
   - CF Rating (purple) — current rating + "Expert" rank label, "+122 this month"
   - Current Streak (orange) — streak + "Best: 203"
   - Global Rank (red) — rank + "Top 0.6% globally"
   - Each card: bg `panel-bg`, border `border-gray-800`, rounded-2xl
3. **Activity Heatmap** (col-span-2):
   - Fetch from `GET /api/stats/heatmap?year=2026`
   - Render a GitHub-style contribution grid (use `recharts` or a custom CSS grid)
   - Tooltip on hover showing date + submission count
4. **Platform Overview** (col-span-1):
   - For each connected platform: name, solved count, horizontal progress bar (color-coded by platform)
5. Data fetching: `useEffect` on mount -> `GET /api/stats/dashboard`, `GET /api/stats/heatmap`

### Deliverables
- Live dashboard with real user data
- Interactive heatmap visualization
- Platform overview with progress bars

---

## Phase 9: Frontend — Portfolio Page (Public)

**Goal:** Build the public portfolio page matching `portfolio.html` (visible to anyone with the link).

### Steps
1. Create `/client/src/pages/Portfolio.jsx`:
   - Read `codefolioId` from URL params
   - Fetch data from `GET /api/user/portfolio/:codefolioId`
2. **Header**: CF logo + "CODEFOLOI" + [Portfolios] [Sign In] buttons
3. **Profile Hero**: avatar (large, centered), name, "@handle • Full Stack Developer • Competitive Programmer", badge tags (colored pills)
4. **Stats Bar** (5 columns, grid): Problems Solved (cyan), Max CF Rating (purple), Day Streak (orange), Global Rank (red), Platforms Connected (green)
5. **Topic Mastery** (left panel): fetch topic breakdown, render each as: skill name + percentage + horizontal progress bar
6. **Achievements & Badges** (right panel): grid of badge cards, each: star icon, title (e.g., "200+ Day Streak"), hover effect (border turns cyan)
7. [Share Portfolio] [Export PDF] buttons in the header area

### Deliverables
- Publicly accessible portfolio page
- Topic mastery bars
- Achievements grid with hover effect

---

## Phase 10: Frontend — Leaderboard Page

**Goal:** Build the leaderboard page matching `leaderboard.html`.

### Steps
1. Create `/client/src/pages/Leaderboard.jsx`:
   - Header: "Global Leaderboard" + "Updated every 15 minutes" + search input (with search icon)
2. **Filter Tabs**: [Global] [LeetCode] [Codeforces] [CodeChef] [Friends]
   - Friends tab shows only users the current user follows (optional: can be a static subset for now)
3. **Podium** (3 columns, centered):
   - #2 Silver (left) — avatar, rank #2, name, score — shorter card
   - #1 Gold (center) — crown icon, avatar (bigger), rank #1, name, score — taller, elevated, gold border glow
   - #3 Bronze (right) — avatar, rank #3, name, score
4. **Table**: 7-column grid:
   - # (rank number, monospace)
   - Coder (avatar + name; if current user, show "You" tag and cyan highlight on the row)
   - Score (monospace, semibold)
   - Solved (monospace)
   - CF Rating (monospace)
   - Streak (monospace, gold if >100)
   - Change (green=+, red=-, gray=0, monospace)
   - Rows: bg `card-bg`, border, rounded-xl, shadow-sm
5. Pagination: "Load more" button or scroll-based
6. Search: debounced input, calls `GET /api/leaderboard/search?q=...`

### Deliverables
- Full leaderboard with podium
- Search and platform filtering
- Current user row highlighting

---

## Phase 11: Frontend — Contests Page

**Goal:** Build the contests page matching `contest.html`.

### Steps
1. Create `/client/src/pages/Contests.jsx`:
   - Header: "Upcoming Contests" + [Enable Reminders] toggle button
2. **Filter bar**: [All Contests] [LeetCode] [Codeforces] — clicking filters contests by platform
3. **Info bar** (when reminders enabled): green-tinted bg, mail icon, "Email + Push reminders are enabled. You'll be notified 1 hour before each contest you've registered for." + [Manage settings] link
4. **Contest Cards** (grid 2 columns):
   - Platform indicator dot (colored: orange=LC, blue=CF, purple=CChef) + platform name (monospace, uppercase) + UPCOMING badge (red)
   - Contest name (bold)
   - Description (text-muted)
   - 3 info blocks: "Starts In" (countdown timer, real-time update via `setInterval`, cyan monospace), "Duration" (gray, monospace), "Date & Time" (gray, monospace)
   - 2 buttons: [Set Reminder] (cyan bg, bell icon) — toggles to "Remove Reminder" when active, [Register] (opens platform URL in new tab)
5. Countdown logic: calculate `startTime - now`, display `Xd Yh Zm`. Update every second.

### Deliverables
- Live contest cards with real-time countdown
- Reminder toggle (on/off)
- Platform filter tabs

---

## Phase 12: Frontend — Platforms Page

**Goal:** Build the per-platform dashboard matching `platforms.html`.

### Steps
1. Create `/client/src/pages/Platforms.jsx`:
   - **Platform filter pills**: [Codeforces] [Codechef] [Atcoder] [Hackerrank] — clicking switches the active platform
   - Active platform has: dot indicator + accent-cyan bg
2. **Metric cards** (3-column grid):
   - Total Questions (green, monospace large number)
   - Total Active Days (green, monospace large number)
   - Activity Heatmap (placeholder or actual mini heatmap, col-span-2)
3. **Row 2** (2-column grid):
   - **Contest Ratings**: current rank/title (e.g., "Pupil 1303"), max rating below "(max: 1409)", with a mini rating trend sparkline (use Recharts LineChart)
   - **Topic Wise Distribution**: horizontal stacked bar segments (or simple bars) showing topics like DP, Arrays, Graphs, Strings with width proportional to count
4. Data fetched per platform from the sync'd data for the selected platform

### Deliverables
- Per-platform analytics view
- Rating display with sparkline
- Topic distribution bars

---

## Phase 13: Frontend — Settings Page

**Goal:** Build the settings page matching `settings.html`.

### Steps
1. Create `/client/src/pages/Settings.jsx`:
   - **Tabs**: [Basic Info] [Profile Details] [Platforms] [Account] — clicking switches panel content
2. **Account tab** (default):
   - "Accounts" panel card (bg `panel-bg`, border, rounded-2xl)
   - **Account Information**: CodeFolio Id (text input + [Edit] button), Email (read-only input)
   - **Update Password**: Original Password, New Password, Confirm Password (all password inputs)
   - Action buttons: [Delete] (red bg, red text) — confirmation modal before deleting — and [Save] (green bg)
3. **Basic Info tab**: displayName, bio, avatar URL inputs
4. **Profile Details tab**: badges (checkboxes to show/hide), social links
5. **Platforms tab**: list of all 7 platforms, each with connect/disconnect toggle, handle input
6. On save: call `PUT /api/user/profile`, `PUT /api/user/password` as appropriate

### Deliverables
- Multi-tab settings page
- Account management (password change, info edit, account deletion)
- Platform connect/disconnect UI

---

## Phase 14: Frontend — Landing Page (Public Homepage)

**Goal:** Build the public landing page matching `homepage.html` — the first page visitors see.

### Steps
1. Create `/client/src/pages/Landing.jsx`:
   - **Navbar** (fixed, glass-panel blur): CF logo (gradient) + "CODEFOLIO" + tagline, [Features] [Leaderboard] [Pricing] [Blog] links, [Sign In] [Get Started] buttons
   - **Hero Section** (full viewport height, bg image overlay):
     - Pill badge: "Your Coding Career, Supercharged" (zap icon, cyan border)
     - H1: "One Dashboard for Your Entire Coding Journey" (text gradient)
     - Subtext: "Aggregate LeetCode, Codeforces, HackerRank..."
     - 2 CTAs: [Generate My Portfolio] (cyan, hover scale) + [Watch Demo] (glass, play icon)
     - **Stats row** (3 columns, border-top): 50,000+ Active Coders, 8 Platforms Integrated, 2.4M+ Submissions Tracked
   - **Demo Profile Preview** section (z-index overlap, rotated -1deg):
     - Profile card with avatar, name "Maruf Hossain", handle, badges, [Share Portfolio] [Export PDF] buttons, 5 metrics (Problems 3,172 | CF 1,409 | Streak 228 | Rank #5,016 | Platforms 8)
   - **Features Section** (3 cards): Multi-Platform Sync (layers icon), Deep Analytics (bar-chart icon), Contest Reminders (bell icon)
     - Integrated Platforms strip: LeetCode, Codeforces, HackerRank, CodeChef, AtCoder, GeeksForGeeks, GitHub (grayscale, hover removes it)
   - **Social Proof** (card-bg bg): "#1 Coder Portfolio Tool", "99% Uptime SLA", "4.9 ★ User Rating", "340+ Recruiters Using Portfolios"
   - **Bottom CTA**: "Ready to boost your coding career?" + [Start Building Your Portfolio] + "Free forever • No credit card required"
   - **Footer**: CF branding + description, Product links (Dashboard, Portfolio, Leaderboard, Contests), Company links (About, Blog, Careers, Privacy), **"Meet us"** section:
     - Supervisor card: Dr. A.H.M. KAMAL, Professor, CSE, kamal@jkkniu.edu.bd, phone
     - Developer card: MD. MARUF HOSSAIN, Session 2021-22, CSE, marufhussain745@gmail.com, phone
   - Copyright: "© 2026 CodeFolio. All rights reserved."

### Deliverables
- Complete, pixel-perfect landing page matching the HTML demo
- "Meet us" academic credits section
- Fully responsive design

---

## Phase 15: Integration, Polish, Testing & Deployment

**Goal:** Connect frontend to backend end-to-end, fix all integration issues, test, and deploy.

### Steps
1. **Integration**: Ensure all React pages call real API endpoints and render data correctly. Fix CORS issues. Handle loading states (spinners/skeletons) and error states (toast notifications).
2. **Environment Variables**: Verify `.env` on both client and server. Client: `REACT_APP_API_URL`. Server: `MONGO_URI`, `JWT_SECRET`, `PORT`, OAuth keys, email credentials.
3. **Testing**:
   - Server: unit tests for auth middleware, fetchers, sync service (Jest)
   - Client: component smoke tests (React Testing Library)
   - Manual: full flow from signup -> connect platforms -> view dashboard -> leaderboard -> contests -> settings -> share portfolio
4. **Build**: `npm run build` on client, verify production build works
5. **Deploy**:
   - Frontend → Vercel/Netlify: connect GitHub repo, set build command, env vars
   - Backend → Render/Railway: deploy from `/server`, set start script, env vars
   - MongoDB → MongoDB Atlas (free tier)
6. **Post-deploy smoke test**: Create a test user, connect mock platforms, verify all pages render in production
7. **Update README.md** with live URLs, tech stack, setup instructions

### Deliverables
- Live, publicly accessible application (URL)
- All 15 phases integrated and working
- README with deployment instructions

---

## Summary Table

| Phase | Area | Description | Depends On |
|-------|------|-------------|------------|
| 1 | Setup | Project scaffolding, dependencies, Tailwind config | — |
| 2 | Backend | MongoDB, User model, Auth routes | Phase 1 |
| 3 | Backend | Profile & platform CRUD | Phase 2 |
| 4 | Backend | 7 platform fetchers, sync service | Phase 3 |
| 5 | Backend | Leaderboard, contests, reminders | Phase 4 |
| 6 | Frontend | React app, routing, AuthContext, Sidebar | Phase 2 |
| 7 | Frontend | Login/Signup pages | Phase 6 |
| 8 | Frontend | Dashboard page | Phase 6, 4 |
| 9 | Frontend | Public Portfolio page | Phase 6, 3 |
| 10 | Frontend | Leaderboard page | Phase 6, 5 |
| 11 | Frontend | Contests page | Phase 6, 5 |
| 12 | Frontend | Platforms page | Phase 6, 4 |
| 13 | Frontend | Settings page | Phase 6, 3 |
| 14 | Frontend | Landing page | Phase 6 |
| 15 | Ops | Integration, testing, deployment | All previous |
