# Software Requirements Specification (SRS)

## Generate and Boost Coder's Portfolio

**Version:** 2.0
**Prepared by:** MD. MARUF HOSSAIN
**Roll No:** 22102010
**Programme:** B.Sc. (Engg.)
**Session:** 2021–22
**Supervised by:** Dr. A.H.M. KAMAL, Professor
**Date:** July 2026

---

## Table of Contents

1. [Introduction](#1-introduction)
   - 1.1 Purpose
   - 1.2 Scope
   - 1.3 Definitions
   - 1.4 References
2. [Overall Description](#2-overall-description)
   - 2.1 Product Perspective
   - 2.2 Product Functions
   - 2.3 User Characteristics
   - 2.4 Operating Environment
   - 2.5 Design & Implementation Constraints
   - 2.6 Assumptions & Dependencies
3. [Specific Requirements](#3-specific-requirements)
   - 3.1 Functional Requirements
   - 3.2 Non-Functional Requirements
4. [UI/UX Design](#4-uiux-design)
   - 4.1 Color Palette
   - 4.2 Typography
   - 4.3 Iconography
   - 4.4 Page-by-Page UI Specification
5. [System Architecture](#5-system-architecture)
   - 5.1 High-Level Architecture
   - 5.2 Technology Stack (MERN)
   - 5.3 Database Schema
   - 5.4 API Endpoints
6. [Appendix](#6-appendix)

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) document defines the complete functional and non-functional requirements for **"Generate and Boost Coder's Portfolio"** (branded as **CodeFolio**), a MERN-stack web application that aggregates competitive programming and developer performance data across multiple coding platforms into a single unified portfolio dashboard.

Many coders practice on platforms like LeetCode, CodeChef, Codeforces, and GeeksforGeeks, but their achievements are scattered across multiple websites. Recruiters must check each platform separately, which is time-consuming. Additionally, many programmers do not have web development skills or time to build and maintain a professional portfolio. This system solves that problem by providing a centralized, recruiter-friendly portfolio.

The intended audience includes the development team, the project supervisor (Dr. A.H.M. KAMAL), and stakeholders evaluating the system.

### 1.2 Scope

The **"Generate and Boost Coder's Portfolio"** (CodeFolio) application allows competitive programmers and software developers to:

- Connect multiple coding platforms (LeetCode, Codeforces, HackerRank, CodeChef, AtCoder, GeeksForGeeks, GitHub)
- View consolidated performance metrics in a single dashboard
- Generate and share a professional coding portfolio page via a public link
- Track progress via heatmaps, rating graphs, and streak counters
- Compete on a global leaderboard
- Receive contest reminders for upcoming rounds
- Export portfolio as PDF
- Manage account settings (profile info, passwords, linked platforms)

The system is scoped as a **MERN-stack single-page application (SPA)** with a dark-theme UI, built as an academic project under the Department of Computer Science and Engineering, JKKNIU.

### 1.3 Definitions

| Term | Definition |
|------|------------|
| **Platform** | A third-party coding/judging service (e.g., LeetCode, Codeforces) |
| **Portfolio** | A public-facing profile page showcasing a user's coding stats |
| **Rating** | Elo/points-based skill metric on competitive programming platforms |
| **Streak** | Consecutive days of solving at least one problem |
| **Heatmap** | A calendar-style visualization of daily coding activity |
| **Leaderboard** | A ranked list comparing users across aggregated metrics |
| **Podium** | The top 3 ranked users displayed prominently |
| **CF** | Codeforces (competitive programming platform) |

### 1.4 References

- Project Proposal: "Generate and Boost Coder's Portfolio" — MD. Maruf Hossain, Roll 22102010, Session 2021–22
- HTML Demo Pages: contest.html, dashboard.html, homepage.html, leaderboard.html, loginPage.html, platforms.html, portfolio.html, settings.html
- React: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- Lucide Icons: https://lucide.dev
- Google Fonts (Inter, JetBrains Mono): https://fonts.google.com
- MongoDB: https://mongodb.com
- Express.js: https://expressjs.com
- Node.js: https://nodejs.org

---

## 2. Overall Description

### 2.1 Product Perspective

CodeFolio is a **new, self-contained web application**. It does not replace any existing system but instead **aggregates data** from existing third-party coding platforms. The system acts as a **unified frontend** that:

- Uses public APIs or scraping mechanisms to pull user stats from connected platforms
- Stores user profile data and aggregated metrics locally
- Renders a personalized portfolio page and analytics dashboard

### 2.2 Product Functions

The major functions of **CodeFolio** are aligned with the project's specific aims:

1. **User Authentication** — Sign Up / Sign In with email or OAuth (Google, GitHub)
2. **Platform Integration** — Link accounts from LeetCode, Codeforces, HackerRank, CodeChef, AtCoder, GeeksForGeeks, GitHub and aggregate data into one dashboard
3. **Data Aggregation & Tracking** — Fetch and normalize stats (problems solved, ratings, rankings, streaks); track submissions, ratings, and activity over time
4. **Portfolio Generation** — Auto-generate a public, shareable portfolio link for recruiters with user info, badges, metrics, topic mastery, and achievements
5. **Analytics & Visualization** — Visualize progress through heatmaps, rating trend graphs, and topic-wise breakdown charts
6. **Leaderboard** — Global and per-platform ranking with podium display, search, and rank change tracking
7. **Contest Calendar & Reminders** — List upcoming contests from connected platforms with countdown timers and send reminders
8. **Platform-Specific Dashboards** — Detailed stats per platform (ratings, activity heatmap, topic-wise distribution)
9. **User Settings** — Profile management, password update, account deletion, platform management
10. **Portfolio Sharing & Export** — Shareable public portfolio link and PDF export for recruiters

### 2.3 User Characteristics

| User Type | Description |
|-----------|-------------|
| **Competitive Programmer** | Primary user. Solves problems on multiple platforms, wants a unified dashboard to track progress and showcase work to recruiters. |
| **Recruiter / Employer** | Secondary user. Views shared portfolios to assess candidate coding proficiency. |
| **Admin** | Manages platform integrations, user reports, and system health. |

### 2.4 Operating Environment

- **Platform:** Web (cross-browser, responsive)
- **Supported Browsers:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Backend:** Node.js + Express.js (REST API)
- **Frontend:** React (SPA), Tailwind CSS, JavaScript (Lucide Icons), Recharts/Chart.js for visualizations
- **Database:** MongoDB (NoSQL document store)
- **Runtime:** Node.js
- **Deployment:** Cloud hosting (e.g., Vercel, Netlify, AWS, Render)

### 2.5 Design & Implementation Constraints

- Must use the **MERN stack** (MongoDB, Express, React, Node.js) as per project methodology
- Must use the **dark theme** color palette defined in Section 4.1
- Font stack: **Inter** (UI) and **JetBrains Mono** (code/stats)
- Must be **responsive** (mobile, tablet, desktop)
- Must handle **rate limits** from third-party platform APIs gracefully
- Must be a **single-page application (SPA)** using React Router for client-side navigation
- Project is part of an academic curriculum; must be completed within the semester timeline
- All authenticated pages share a consistent sidebar layout component

### 2.6 Assumptions & Dependencies

- Third-party platforms provide public APIs or scrape-able profile pages
- Users have accounts on at least one supported coding platform
- The system relies on an internet connection to fetch live data
- No real-time collaboration features are required
- The app uses a client-side routing or server-rendered multi-page approach

---

## 3. Specific Requirements

### 3.1 Functional Requirements

#### FR-01: User Authentication (Login / Sign Up)
| ID | Requirement |
|----|-------------|
| FR-01.1 | The system shall allow users to sign up using email + password with validation |
| FR-01.2 | The system shall allow users to sign in via Google OAuth |
| FR-01.3 | The system shall allow users to sign in via GitHub OAuth |
| FR-01.4 | The system shall support password reset via email ("Forgot password?" link) |
| FR-01.5 | The system shall maintain session state (JWT or cookie-based) |
| FR-01.6 | The login page shall show platform tags (LeetCode, Codeforces, HackerRank, CodeChef, AtCoder) |
| FR-01.7 | The login page shall display a testimonial card |
| FR-01.8 | The login page shall have a link "Don't have an account? Create one free" |
| FR-01.9 | The login page shall show a security badge ("Secured with 256-bit SSL encryption") |
| FR-01.10 | The password input shall have a show/hide toggle (eye icon) |

#### FR-02: Platform Connection
| ID | Requirement |
|----|-------------|
| FR-02.1 | The system shall allow users to connect LeetCode profile by providing username |
| FR-02.2 | The system shall allow users to connect Codeforces handle |
| FR-02.3 | The system shall allow users to connect HackerRank profile |
| FR-02.4 | The system shall allow users to connect CodeChef handle |
| FR-02.5 | The system shall allow users to connect AtCoder handle |
| FR-02.6 | The system shall allow users to connect GeeksForGeeks profile |
| FR-02.7 | The system shall allow users to connect GitHub profile (via OAuth) |
| FR-02.8 | The system shall let users disconnect any platform at any time |
| FR-02.9 | The system shall validate that a connected handle/profile exists before saving |
| FR-02.10 | The platform connection UI shall have filter buttons (Codeforces, Codechef, Atcoder, Hackerrank) |

#### FR-03: Data Aggregation & Sync
| ID | Requirement |
|----|-------------|
| FR-03.1 | The system shall fetch problems solved count from each connected platform |
| FR-03.2 | The system shall fetch current rating from competitive programming platforms |
| FR-03.3 | The system shall fetch global/world rank per platform |
| FR-03.4 | The system shall calculate a combined total of problems solved across all platforms |
| FR-03.5 | The system shall track daily submission activity to compute streak |
| FR-03.6 | The system shall cache fetched data with configurable refresh intervals |
| FR-03.7 | The system shall display the number of connected platforms |

#### FR-04: Dashboard (Authenticated Home)
| ID | Requirement |
|----|-------------|
| FR-04.1 | The dashboard shall have a fixed **sidebar** with navigation items: Dashboard, My Portfolio, Leaderboard, Contests (with notification badge), Platforms, Settings |
| FR-04.2 | The sidebar shall show the logged-in user's avatar, name, plan info, and streak at the bottom |
| FR-04.3 | The sidebar logo shall read "CODEFOLOI" |
| FR-04.4 | The dashboard header shall show a personalized greeting (e.g., "Good morning, Maruf") |
| FR-04.5 | The dashboard shall display **4 metric cards** in a row: |
| | - Total Solved (cyan, with weekly delta) |
| | - CF Rating (purple, with monthly delta) |
| | - Current Streak (orange, with best streak) |
| | - Global Rank (red, with percentile) |
| FR-04.6 | The dashboard shall include an **Activity Heatmap** visualization |
| FR-04.7 | The dashboard shall include a **Platform Overview** section with progress bars per platform |
| FR-04.8 | The dashboard shall have a "Share Portfolio" header button |

#### FR-05: Portfolio Page (Public Profile)
| ID | Requirement |
|----|-------------|
| FR-05.1 | The portfolio page header shall show the CodeFolio logo and navigation (Portfolios, Sign In) |
| FR-05.2 | The portfolio shall display a profile hero: avatar, name, handle, bio, and badge tags |
| FR-05.3 | The portfolio shall display a **stats bar** with 5 metrics: Problems Solved, Max CF Rating, Day Streak, Global Rank, Platforms Connected |
| FR-05.4 | The portfolio shall display a **Topic Mastery** section with skill names and percentage progress bars |
| FR-05.5 | The portfolio shall display an **Achievements & Badges** section with badge cards in a grid (e.g., "200+ Day Streak") |
| FR-05.6 | The portfolio shall be publicly accessible without authentication |

#### FR-06: Leaderboard
| ID | Requirement |
|----|-------------|
| FR-06.1 | The leaderboard shall display a **podium** showing the top 3 users (Gold #1, Silver #2, Bronze #3) |
| FR-06.2 | The #1 rank shall have a crown icon and be visually elevated |
| FR-06.3 | The system shall provide a **search input** to find coders by name |
| FR-06.4 | The system shall provide **filter tabs**: Global, LeetCode, Codeforces, CodeChef, Friends |
| FR-06.5 | The leaderboard shall display a **table** with columns: Rank, Coder (avatar + name), Score, Solved, CF Rating, Streak, Change |
| FR-06.6 | The current user's row shall be highlighted with a cyan border/background |
| FR-06.7 | Rank change shall be color-coded: green for positive (+2), red for negative (-1), gray for no change (0) |
| FR-06.8 | The header shall state "Updated every 15 minutes" |

#### FR-07: Contests Calendar & Reminders
| ID | Requirement |
|----|-------------|
| FR-07.1 | The contests page shall have **filter buttons**: All Contests, LeetCode, Codeforces |
| FR-07.2 | Each contest card shall display: platform indicator dot, contest name, description, countdown timer, duration, date/time |
| FR-07.3 | Each contest card shall have "Set Reminder" and "Register" buttons |
| FR-07.4 | The system shall show an "Enable Reminders" toggle button in the header |
| FR-07.5 | The system shall display an info bar when reminders are enabled, stating "Email + Push reminders are enabled. You'll be notified 1 hour before each contest" |
| FR-07.6 | The info bar shall have a "Manage settings" link |
| FR-07.7 | The header shall show a notification badge on the sidebar Contests link (e.g., "3") |

#### FR-08: Platform-Specific Dashboard
| ID | Requirement |
|----|-------------|
| FR-08.1 | The platforms page shall have **filter buttons** to switch between connected platforms |
| FR-08.2 | The page shall display metric cards: Total Questions (green), Total Active Days (green) |
| FR-08.3 | The page shall display an **Activity Heatmap** visualization |
| FR-08.4 | The page shall display **Contest Ratings** with current rank (e.g., "Pupil 1303") and max rating |
| FR-08.5 | The page shall display **Topic Wise Distribution** as horizontal bars |

#### FR-09: Settings Page
| ID | Requirement |
|----|-------------|
| FR-09.1 | The settings page shall have **tab navigation**: Basic Info, Profile Details, Platforms, Account |
| FR-09.2 | The Account tab (default active) shall display an "Accounts" panel |
| FR-09.3 | The Account panel shall show **Account Information**: CodeFolio ID (editable), Email |
| FR-09.4 | The Account panel shall provide an **Update Password** section with fields: Original Password, New Password, Confirm Password |
| FR-09.5 | The Account panel shall have action buttons: **Delete** (red) and **Save** (green) |

#### FR-10: Landing Page (Public Homepage)
| ID | Requirement |
|----|-------------|
| FR-10.1 | The homepage shall have a **fixed navbar** with: CodeFolio logo, nav links (Features, Leaderboard, Pricing, Blog), CTA buttons (Sign In, Get Started) |
| FR-10.2 | The navbar logo shall have a gradient background and "Build Your Digital Portfolio" tagline |
| FR-10.3 | The **Hero section** shall include: a "Your Coding Career, Supercharged" pill badge, headline "One Dashboard for Your Entire Coding Journey", subtext, and two CTAs ("Generate My Portfolio", "Watch Demo") |
| FR-10.4 | The Hero section shall include a **stats row**: 50,000+ Active Coders, 8 Platforms Integrated, 2.4M+ Submissions Tracked |
| FR-10.5 | The homepage shall display a **Demo Profile Preview** card (rotated -1deg) showing: avatar, name (Maruf Hossain), handle, badges, action buttons (Share Portfolio, Export PDF), and metrics dashboard |
| FR-10.6 | The **Features section** shall display 3 feature cards: Multi-Platform Sync, Deep Analytics, Contest Reminders |
| FR-10.7 | The Features section shall include an **Integrated Platforms strip** listing: LeetCode, Codeforces, HackerRank, CodeChef, AtCoder, GeeksForGeeks, GitHub |
| FR-10.8 | The homepage shall include a **Social Proof section** with trust metrics: #1 Coder Portfolio Tool, 99% Uptime SLA, 4.9 User Rating, 340+ Recruiters |
| FR-10.9 | The homepage shall include a **Bottom CTA** section: "Ready to boost your coding career?", [Start Building Your Portfolio], "Free forever - No credit card required" |
| FR-10.10 | The homepage shall have a **Footer** with: product links (Dashboard, Portfolio, Leaderboard, Contests), company links (About, Blog, Careers, Privacy), branding, and academic credits |

#### FR-11: Academic Credits (Footer Section)
| ID | Requirement |
|----|-------------|
| FR-11.1 | The footer shall have a "Meet us" section |
| FR-11.2 | The "Meet us" section shall show **Supervisor**: Dr. AHM Kamal, Professor, Computer Science and Engineering, kamal@jkkniu.edu.bd, +8801732226402 |
| FR-11.3 | The "Meet us" section shall show **Developer**: MD. Maruf Hossain, Session 2021-2022, CSE Department, marufhussain745@gmail.com, +8801831710007 |
| FR-11.4 | Each credit card shall include an avatar image |

#### FR-12: Portfolio Sharing & Export
| ID | Requirement |
|----|-------------|
| FR-12.1 | The system shall provide a "Share Portfolio" button that copies or opens the portfolio URL |
| FR-12.2 | The system shall provide an "Export PDF" button to download the portfolio as a PDF |
| FR-12.3 | Both buttons shall be available on the demo preview card and the portfolio page |

### 3.2 Non-Functional Requirements

| ID | Requirement | Category |
|----|-------------|----------|
| NFR-01 | The system shall load the homepage within 3 seconds on a standard broadband connection | Performance |
| NFR-02 | The system shall be available 99% uptime (SLA) | Reliability |
| NFR-03 | The system shall use HTTPS for all communications | Security |
| NFR-04 | Passwords shall be hashed using bcrypt or equivalent | Security |
| NFR-05 | API rate limiting shall be implemented to prevent abuse | Security |
| NFR-06 | The UI shall be responsive across mobile (320px), tablet (768px), and desktop (1280px+) | Usability |
| NFR-07 | The system shall follow the defined dark theme color palette consistently | Consistency |
| NFR-08 | The system shall handle third-party API failures gracefully with user-friendly error messages | Reliability |
| NFR-09 | The system shall support screen readers via semantic HTML and ARIA labels | Accessibility |
| NFR-10 | The system shall be deployable via CI/CD pipeline | Maintainability |
| NFR-11 | Sidebar navigation items shall highlight the active page with accent color | Usability |
| NFR-12 | Countdown timers on contest cards shall update in real-time | Performance |

---

## 4. UI/UX Design

### 4.1 Color Palette

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| App Background | `#090d14` | Main page background (authenticated pages) |
| Primary Dark | `#0a0f1a` | Homepage background |
| Panel Background | `#121927` | Card and section backgrounds |
| Card Background | `#1a2235` | Sidebar, cards, inputs |
| Sidebar Background | `#0c121e` | Sidebar panel |
| Input Background | `#1a1a1a` | Form input fields |
| Accent Cyan | `#13d4f1` | CTAs, active nav items, key metrics, interactive elements |
| Text Muted | `#8f9bb3` | Secondary text, labels, hints |
| Border Dim | `rgba(255, 255, 255, 0.05)` | Subtle borders |
| Border Strong | `rgba(255, 255, 255, 0.1)` | Visible borders |
| Gold | `#f59e0b` | #1 rank, gold accents |
| Silver | `#cbd5e1` | #2 rank |
| Bronze | `#d97706` | #3 rank |
| Accent Green | `#10b981` | Success metrics, solved counts |
| Accent Orange | `#f97316` | LeetCode indicator, streak |
| Accent Purple | `#a855f7` | CF Rating, Codeforces |

### 4.2 Typography

| Font | Usage | Fallback |
|------|-------|----------|
| **Inter** | All UI text, body, navigation, buttons | sans-serif |
| **JetBrains Mono** | Metrics, stats, ratings, code handles, timers, rank numbers | monospace |

### 4.3 Iconography

- Library: **Lucide Icons** (loaded via `https://unpkg.com/lucide@latest`)
- Initialize with `lucide.createIcons()` on each page
- Key icons used: `layout-grid`, `user`, `trophy`, `calendar`, `link`, `settings`, `zap`, `play-circle`, `layers`, `bar-chart-2`, `bell`, `mail`, `search`, `crown`, `star`, `shield-check`, `github`, `globe`, `arrow-right`, `eye-off`, `share-2`, `download`, `rocket`

### 4.4 Page-by-Page UI Specification

#### 4.4.1 Landing Page (homepage.html)

```
┌─────────────────────────────────────────────┐
│   Navbar (Fixed, glass-panel, blur)         │
│   CF Logo + "CODEFOLIO" + tagline           │
│   [Features] [Leaderboard] [Pricing] [Blog] │
│   [Sign In] [Get Started]                   │
├─────────────────────────────────────────────┤
│   Hero Section (full-screen, bg image)      │
│   Pill: "Your Coding Career, Supercharged"  │
│   H1: "One Dashboard for Your Entire        │
│        Coding Journey"                       │
│   Subtext (aggregate LeetCode, Codeforces…) │
│   [Generate My Portfolio] [Watch Demo]      │
│   Stats: 50K+ Coders | 8 Platforms | 2.4M+  │
│        Submissions                           │
├─────────────────────────────────────────────┤
│   Demo Profile Preview (rotated -1deg)      │
│   Profile Card:                             │
│   Avatar + Name + Handle + Bio + Badges     │
│   [Share Portfolio] [Export PDF]            │
│   Metrics: Problems 3,172 | CF 1,409 |      │
│   Streak 228 | Rank #5,016 | Platforms 8    │
├─────────────────────────────────────────────┤
│   Features Section                          │
│   "Everything In One Place"                 │
│   3 cards: Multi-Platform Sync, Deep        │
│   Analytics, Contest Reminders              │
│   Integrated Platforms strip (grayscale)    │
├─────────────────────────────────────────────┤
│   Social Proof Section (card-bg)            │
│   #1 Tool | 99% Uptime | 4.9 Rating |      │
│   340+ Recruiters                           │
├─────────────────────────────────────────────┤
│   Bottom CTA                                │
│   "Ready to boost your coding career?"      │
│   [Start Building Your Portfolio]           │
│   "Free forever. No credit card required."  │
├─────────────────────────────────────────────┤
│   Footer                                    │
│   CF Logo + description                     │
│   Product: Dashboard, Portfolio, LB,        │
│            Contests                         │
│   Company: About, Blog, Careers, Privacy    │
│   "Meet us": Supervisor + Developer cards   │
│   Copyright © 2026 CodeFolio                │
└─────────────────────────────────────────────┘
```

#### 4.4.2 Login Page (loginPage.html)

```
┌──────────────────────────────┬──────────────────────────────┐
│  Left Panel (50%)            │  Right Panel (50%)           │
│                              │                              │
│  CF Logo + "CODEFOLIO"      │  Card:                        │
│  + tagline                   │  "Welcome back"              │
│                              │  "Sign in to your CodeFolio  │
│  H1: "Your entire coding     │   account"                   │
│       journey, unified."     │                              │
│  Subtext (join 500+ devs…)   │  [GitHub] [Google] OAuth     │
│                              │          — OR —              │
│  Platform tags: LeetCode,    │  Email input (with mail icon)│
│  Codeforces, HackerRank,     │  Password input (with lock   │
│  CodeChef, AtCoder           │   icon + eye toggle)         │
│                              │  [Forgot password?]          │
│  Testimonial card:           │  [Sign In to CodeFolio]      │
│  "CodeFolio helped me..."    │                              │
│  Alex Rabbi - SDE @ Samsung  │  "Don't have an account?     │
│                              │   Create one free ->"        │
│                              │                              │
│                              │  Security badge (SSL)        │
└──────────────────────────────┴──────────────────────────────┘
```

#### 4.4.3 Dashboard (dashboard.html)

```
┌──────────────┬──────────────────────────────────────────────┐
│  Sidebar     │  Main Content                                │
│  (fixed 64)  │                                              │
│              │  Header: "Good morning, Maruf"               │
│  CF Logo     │           [Share Portfolio]                  │
│  CODEFOLOI   │                                              │
│              │  Metric Cards (4 columns):                   │
│  [Dashboard] │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │
│  My Portfolio│  │Total │ │CF    │ │Streak│ │Global│       │
│  Leaderboard │  │Solved│ │Rating│ │147d  │ │Rank  │       │
│  Contests [3]│  │1,847 │ │2,154 │ │Best: │ │#312  │       │
│  Platforms   │  │+23/wk│ │+122/m│ │203   │ │Top   │       │
│  Settings    │  └──────┘ └──────┘ └──────┘ └───0.6%┘       │
│              │                                              │
│              │  ┌───────────────────────┐ ┌──────────────┐ │
│              │  │ Activity Heatmap      │ │ Platform     │ │
│              │  │ [Visualization Grid]  │ │ Overview     │ │
│              │  │                       │ │ LC: 1,284 ██ │ │
│              │  │                       │ │ CF: 1,347 ██ │ │
│              │  └───────────────────────┘ └──────────────┘ │
│  User Card   │                                              │
│  (bottom)    │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

#### 4.4.4 Contests Page (contest.html)

```
┌──────────────┬──────────────────────────────────────────────┐
│  Sidebar     │  Main Content                                │
│  (same as    │                                              │
│   dashboard) │  Header: "Upcoming Contests"                 │
│              │          [Enable Reminders]                  │
│  Contests    │                                              │
│  (active)    │  Filter: [All Contests] [LeetCode] [CF]     │
│              │                                              │
│              │  Info Bar: Email + Push enabled ✓            │
│              │  "Manage settings ->"                        │
│              │                                              │
│              │  Contest Card (grid 2 cols):                 │
│              │  ┌─────────────────┐ ┌─────────────────┐    │
│              │  │ ● LeetCode      │ │ ● Codeforces    │    │
│              │  │ UPCOMING        │ │ UPCOMING        │    │
│              │  │ Weekly 418      │ │ Round 927       │    │
│              │  │ Standard 4-prob │ │ Standard round  │    │
│              │  │                 │ │                 │    │
│              │  │ Starts: 2d 14h  │ │ Starts: 4d 2h   │    │
│              │  │ 22m             │ │                 │    │
│              │  │ Duration: 90min │ │ Duration: 2h    │    │
│              │  │ Date: Sun 8AM   │ │ Date: Wed 6PM   │    │
│              │  │                 │ │                 │    │
│              │  │ [Set Reminder]  │ │ [Set Reminder]  │    │
│              │  │ [Register]      │ │ [Register]      │    │
│              │  └─────────────────┘ └─────────────────┘    │
│              │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

#### 4.4.5 Leaderboard (leaderboard.html)

```
┌──────────────┬──────────────────────────────────────────────┐
│  Sidebar     │  Main Content                                │
│              │                                              │
│  Leaderboard │  Header: "Global Leaderboard"                │
│  (active)    │  "Updated every 15 minutes"  [Search...]     │
│              │                                              │
│              │  Filter: [Global] [LeetCode] [CF] [CC] [Fr] │
│              │                                              │
│              │  Podium:                                     │
│              │    #2          👑 #1           #3             │
│              │   Maruf      CodeMaster_X   AlgoKing_99      │
│              │   3,912 pts   4,847 pts      3,654 pts       │
│              │                                              │
│              │  Table:                                      │
│              │  # │ Coder       │ Score│Solved│CF  │Str│Chg│
│              │  ──┼─────────────┼──────┼──────┼────┼───┼───┤
│              │  4 │Alex_Coder   │ 3,412│1,847 │2,15│147│+2 │
│              │  5 │devNinja_Pro │ 3,201│1,622 │2,06│89d│ -1│
│              │  6 │ByteWizard42 │ 3,087│1,544 │2,01│201│ 0 │
│              │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

#### 4.4.6 Platforms Page (platforms.html)

```
┌──────────────┬──────────────────────────────────────────────┐
│  Sidebar     │  Main Content                                │
│              │                                              │
│  Platforms   │  Filter: [Codeforces] [Codechef] [Atcoder]  │
│  (active)    │          [Hackerrank]                        │
│              │                                              │
│              │  ┌──────────┐ ┌──────────┐ ┌────────────────┐│
│              │  │Total     │ │Total     │ │ Activity       ││
│              │  │Questions │ │Active    │ │ Heatmap        ││
│              │  │  2,072   │ │ Days     │ │ [Visualization]││
│              │  │          │ │  772     │ │                ││
│              │  └──────────┘ └──────────┘ └────────────────┘│
│              │                                              │
│              │  ┌──────────────────┐ ┌────────────────────┐ │
│              │  │ Contest Ratings  │ │ Topic Wise         │ │
│              │  │                  │ │ Distribution       │ │
│              │  │ Pupil 1303       │ │ ████████████ 75%   │ │
│              │  │ (max: 1409)      │ │ ████████     60%   │ │
│              │  │                  │ │ ██████       50%   │ │
│              │  └──────────────────┘ └────────────────────┘ │
└──────────────┴──────────────────────────────────────────────┘
```

#### 4.4.7 Portfolio Page (portfolio.html)

```
┌─────────────────────────────────────────────────────────────┐
│  Header: CF Logo + CODEFOLOI  [Portfolios] [Sign In]       │
├─────────────────────────────────────────────────────────────┤
│  Profile Hero:                                              │
│  [Avatar] Maruf Hossain                                     │
│           @maruf_codes • Full Stack Dev • CP                │
│           [Competitive Programmer] [Open Source]            │
├─────────────────────────────────────────────────────────────┤
│  Stats Bar (5 columns):                                     │
│  3,172    1,409    228      #5,016    8                     │
│  Problems  Max CF   Day     Global    Platforms             │
│  Solved    Rating   Streak  Rank      Connected             │
├────────────────────────────────┬────────────────────────────┤
│  Topic Mastery                 │ Achievements & Badges      │
│                                │                            │
│  DP          ██████████ 92%    │ ┌────┐ ┌────┐ ┌────┐     │
│  Arrays      █████████  85%    │ │★   │ │★   │ │★   │     │
│  Graphs      ████████   78%    │ │200+│ │500+│ │1000│     │
│  Strings     ███████    70%    │ │Strk│ │Solv│ │Solv│     │
│                                │ └────┘ └────┘ └────┘     │
└────────────────────────────────┴────────────────────────────┘
```

#### 4.4.8 Settings Page (settings.html)

```
┌──────────────┬──────────────────────────────────────────────┐
│  Sidebar     │  Main Content                                │
│              │                                              │
│  Settings    │  Tabs: [Basic Info] [Profile Details]        │
│  (active)    │        [Platforms] [Account]                 │
│              │                                              │
│              │  Panel: "Accounts"                           │
│              │  ─────────────────────────────────────       │
│              │  Account Information:                        │
│              │  CodeFolio Id: [Maruf_Hossain____] [Edit]   │
│              │  Email:       [maruf...@gmail.com]          │
│              │                                              │
│              │  Update Password:                            │
│              │  Original Pass: [********___________]        │
│              │  New Password:  [new password_________]      │
│              │  Confirm Pass:  [confirm password______]     │
│              │                                              │
│              │  [Delete (red)]     [Save (green)]          │
└──────────────┴──────────────────────────────────────────────┘
```

### 4.5 Sidebar Navigation (Shared Across Authenticated Pages)

All authenticated pages (Dashboard, Portfolio, Leaderboard, Contests, Platforms, Settings) share a consistent sidebar:

```
┌──────────────────┐
│  CF              │  Logo with gradient + shadow glow
│  CODEFOLOI       │
│  Build your      │
│  digital portf.  │
│                  │
│  ■ Dashboard     │  <-- active page highlighted
│  ■ My Portfolio  │
│  ■ Leaderboard   │
│  ■ Contests [3]  │  Notification badge (cyan bg)
│  ■ Platforms     │
│  ■ Settings      │
│                  │
│  ┌──────────────┐│
│  │ Avatar + Name ││  Bottom user card
│  │ 5 contests   ││
│  └──────────────┘│
└──────────────────┘
```

---

## 5. System Architecture

### 5.1 High-Level Architecture (MERN)

```
┌───────────────────┐         ┌────────────────────────────────────────────┐
│  React SPA        │  HTTP   │         Express.js REST API Server         │
│  (Browser)        │◄──────►│                                            │
│                   │  JSON   │  ┌────────────┐  ┌─────────────────────┐   │
│  React Router     │         │  │  Auth       │  │  Data Aggregator   │   │
│  Tailwind CSS     │         │  │  Middleware │  │  (Platform Fetcher)│   │
│  Recharts         │         │  └────────────┘  └──────────┬──────────┘   │
│  Lucide Icons     │         │             │               │              │
│  Axios (HTTP)     │         │  ┌──────────┴───────────┐   │              │
│                   │         │  │  Service Layer        │   │              │
│                   │         │  │  ┌─────────────────┐  │   │              │
│                   │         │  │  │ UserService      │  │   │              │
│                   │         │  │  │ PortfolioService │  │   │              │
│                   │         │  │  │ AnalyticsEngine  │  │   │              │
│                   │         │  │  │ LeaderboardSvc   │  │   │              │
│                   │         │  │  │ ReminderSvc      │  │   │              │
│                   │         │  │  │ ContestSvc       │  │   │              │
│                   │         │  │  └─────────────────┘  │   │              │
│                   │         │  └────────────────────────┘   │              │
│                   │         │              │                │              │
│                   │         │  ┌───────────┴────────────────┴──────────┐  │
│                   │         │  │       MongoDB (Mongoose ODM)          │  │
│                   │         │  └────────────────────────────────────────┘  │
│                   │         └─────────────────────────────────────────────┘
│                   │                           │
│                   │         ┌─────────────────┼──────────────────┐
│                   │         ▼                 ▼                  ▼
│                   │   ┌───────────┐    ┌───────────┐    ┌─────────────┐
│                   │   │ LeetCode  │    │ Codeforces│    │ HackerRank  │
│                   │   │   API     │    │   API     │    │    API      │
│                   │   └───────────┘    └───────────┘    └─────────────┘
│                   │         ▲                ▲                ▲
│                   │         │                │                │
│                   │   ┌───────────┐    ┌───────────┐    ┌──────────────┐
│                   │   │ CodeChef  │    │  AtCoder  │    │ GeeksForGeeks│
│                   │   │   API     │    │   API     │    │    API       │
│                   │   └───────────┘    └───────────┘    └──────────────┘
│                   │                                              │
│                   │                                       ┌───────────┐
│                   │                                       │  GitHub   │
│                   │                                       │ OAuth API │
│                   │                                       └───────────┘
└───────────────────┘
```

### 5.2 Technology Stack (MERN)

| Layer | Technology |
|-------|-----------|
| **Frontend** | React (SPA with React Router), Tailwind CSS, Lucide Icons, Recharts / Chart.js |
| **Fonts** | Google Fonts (Inter, JetBrains Mono) |
| **Backend** | Node.js + Express.js (RESTful API) |
| **Database** | MongoDB (with Mongoose ODM) |
| **Authentication** | JWT (jsonwebtoken) + bcrypt + Passport.js (Google, GitHub OAuth) |
| **HTTP Client** | Axios (frontend to backend communication) |
| **PDF Export** | jsPDF + html2canvas or Puppeteer |
| **Deployment** | Frontend: Vercel / Netlify · Backend: Render / AWS EC2 / Railway |

### 5.3 Database Schema (MongoDB / Mongoose)

#### Users Collection
```
users {
  _id: ObjectId
  email:           String (unique, required, indexed)
  passwordHash:    String (bcrypt, required)
  codefolioId:     String (unique, display name)
  displayName:     String
  avatar:          String (URL)
  bio:             String
  badges:          [String]  // ["Competitive Programmer", "Open Source", ...]
  role:            String (enum: "user" | "admin", default: "user")
  provider:        String (enum: "local" | "google" | "github")
  providerId:      String
  createdAt:       Date (timestamps)
  updatedAt:       Date (timestamps)
}
```

#### Platform Connections Collection
```
platformConnections {
  _id:             ObjectId
  userId:          ObjectId (ref: users, indexed)
  platform:        String (enum: "leetcode" | "codeforces" | "hackerrank" |
                                  "codechef" | "atcoder" | "geeksforgeeks" | "github")
  handle:          String
  profileUrl:      String
  isConnected:     Boolean (default: false)
  lastSyncedAt:    Date
  createdAt:       Date (timestamps)
  updatedAt:       Date (timestamps)
}
// Compound index: { userId: 1, platform: 1 } (unique)
```

#### User Stats Collection
```
userStats {
  _id:             ObjectId
  userId:          ObjectId (ref: users, unique, indexed)
  totalSolved:     Number (default: 0)
  maxCfRating:     Number (default: 0)
  currentCfRating: Number (default: 0)
  dayStreak:       Number (default: 0)
  bestStreak:      Number (default: 0)
  globalRank:      Number (default: 0)
  platformsConnected: Number (default: 0)
  lastUpdated:     Date
}
```

#### Daily Submissions Collection (for heatmap)
```
dailySubmissions {
  _id:             ObjectId
  userId:          ObjectId (ref: users, indexed)
  date:            Date
  count:           Number (default: 0)
  platform:        String
}
// Compound index: { userId: 1, date: -1 }
```

#### Contests Collection
```
contests {
  _id:             ObjectId
  platform:        String (enum)
  name:            String
  description:     String
  url:             String
  startTime:       Date
  duration:        Number (minutes)
  isActive:        Boolean (default: true)
  createdAt:       Date
}
// Index: { startTime: 1, platform: 1 }
```

#### Contest Reminders Collection
```
contestReminders {
  _id:             ObjectId
  userId:          ObjectId (ref: users)
  contestId:       ObjectId (ref: contests)
  reminderTime:    Date  // e.g., 1 hour before start
  isSent:          Boolean (default: false)
  createdAt:       Date (timestamps)
}
// Compound index: { userId: 1, contestId: 1 } (unique)
```

#### Leaderboard Cache Collection
```
leaderboardCache {
  _id:             ObjectId
  userId:          ObjectId (ref: users, unique, indexed)
  totalScore:      Number
  totalSolved:     Number
  cfRating:        Number
  streak:          Number
  rank:            Number
  rankChange:      Number
  lastUpdated:     Date
}
// Index: { rank: 1 }
```

### 5.4 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | No | Register with email + password |
| POST | `/api/auth/login` | No | Login with email + password, returns JWT |
| POST | `/api/auth/oauth/google` | No | Google OAuth login |
| POST | `/api/auth/oauth/github` | No | GitHub OAuth login |
| POST | `/api/auth/forgot-password` | No | Send password reset email |
| POST | `/api/auth/reset-password` | No | Reset password with token |
| GET | `/api/auth/me` | Yes | Get current authenticated user |
| PUT | `/api/user/profile` | Yes | Update profile (name, bio, codefolioId, avatar) |
| GET | `/api/user/portfolio/:codefolioId` | No | Get public portfolio data |
| GET | `/api/user/export/portfolio/:codefolioId` | No | Export portfolio as PDF |
| GET | `/api/platforms` | Yes | List connected platforms for current user |
| POST | `/api/platforms/connect` | Yes | Connect a platform handle |
| PUT | `/api/platforms/sync` | Yes | Trigger data sync for all platforms |
| DELETE | `/api/platforms/:platform` | Yes | Disconnect a specific platform |
| GET | `/api/stats/dashboard` | Yes | Get aggregated dashboard metrics |
| GET | `/api/stats/heatmap?year=2026` | Yes | Get heatmap submission data |
| GET | `/api/stats/topics` | Yes | Get topic-wise problem distribution |
| GET | `/api/leaderboard?page=1&limit=20` | Yes | Get global leaderboard (paginated) |
| GET | `/api/leaderboard/search?q=alex` | Yes | Search leaderboard by name |
| GET | `/api/leaderboard/platform/:platform` | Yes | Get per-platform leaderboard |
| GET | `/api/contests/upcoming` | Yes | Get all upcoming contests |
| POST | `/api/contests/:id/reminder` | Yes | Set reminder for a contest |
| DELETE | `/api/contests/:id/reminder` | Yes | Remove contest reminder |
| PUT | `/api/user/password` | Yes | Update password (requires old password) |
| DELETE | `/api/user/account` | Yes | Delete account permanently |

---

## 6. Appendix

### 6.1 Badge System

| Badge | Criteria |
|-------|----------|
| Competitive Programmer | Connected CF or CodeChef account |
| Open Source | Connected GitHub with >10 repos |
| Web Developer | Connected GitHub with web projects |
| 200+ Day Streak | Streak >= 200 |
| 500+ Problems Solved | Total solved >= 500 |
| 1000+ Problems Solved | Total solved >= 1000 |

### 6.2 Contest Platform Colors

| Platform | Indicator Color |
|----------|----------------|
| LeetCode | Orange (`#f97316`) |
| Codeforces | Blue (`#3b82f6`) |
| CodeChef | Purple (`#a855f7`) |
| AtCoder | Red (`#ef4444`) |
| HackerRank | Green (`#10b981`) |

### 6.3 Glossary

| Term | Definition |
|------|------------|
| **API** | Application Programming Interface |
| **CF** | Codeforces (competitive programming platform) |
| **CTA** | Call-to-action button |
| **JWT** | JSON Web Token |
| **OAuth** | Open standard for access delegation |
| **SLA** | Service Level Agreement |
| **SRS** | Software Requirements Specification |

### 6.4 Open Issues / Future Enhancements

- [ ] Support for additional platforms (TopCoder, Codewars, Exercism)
- [ ] Team/group leaderboards for university or company cohorts
- [ ] Automated portfolio deployment as a GitHub Pages / subdomain
- [ ] AI-powered problem recommendations based on weak topics
- [ ] Interview preparation tracker with company-specific problem sets
- [ ] Dark/Light mode toggle (currently dark-only)
- [ ] Mobile app (React Native / Flutter)
- [ ] Real-time contest countdown timers with WebSocket push

### 6.5 Document History

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | July 2026 | MD. Maruf Hossain | Initial SRS document |
| 2.0 | July 2026 | MD. Maruf Hossain | Aligned with project proposal "Generate and Boost Coder's Portfolio"; migrated tech stack to MERN (MongoDB, Express, React, Node.js); added roll/session/programme metadata; updated architecture diagram, DB schema, and API endpoints to MERN conventions |
