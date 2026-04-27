# CareerConnect Pro
> A production-grade, full-stack job portal where students find and track jobs, and recruiters manage the entire hiring pipeline — from posting to hiring.

---

## 🚀 Live Demo
Coming Soon — deployable on Vercel (frontend) + Render (backend)

---

## 📌 Overview
Most job portals are either too simple (no real ATS workflow) or too complex for a student project. CareerConnect Pro bridges that gap — it's a complete MERN stack application with a real 5-stage ATS pipeline, role-based access control, automated email notifications, and a recruiter analytics dashboard.

Built to demonstrate production-level engineering: the backend uses dual-strategy MongoDB connection with IPv4 fallback, Zod schema validation on every API endpoint, tiered rate limiting, and structured Winston logging. The frontend uses TanStack Query for server state with a strict separation from Redux UI state.

---

## ✨ Features

### 👨‍🎓 For Students
- 🔍 **Multi-criteria job search** — filter by keyword, location, job type, salary range (min/max LPA), and experience level simultaneously
- ⚡ **Debounced search** — 400ms debounce on hero search + 500ms on salary inputs to prevent unnecessary API calls
- 📋 **Job detail page** — shows requirements, benefits, salary, deadline, total applicants, and company info
- ✅ **One-click apply** — duplicate applications blocked at DB level via compound unique index `{ job, applicant }`
- 📊 **ATS progress tracker** — visual dot-connector timeline showing: Applied → Under Review → Shortlisted → Hired
- 💬 **Recruiter feedback visibility** — see the exact note a recruiter left when changing your status
- 👤 **Profile management** — update bio, skills, resume (PDF via Cloudinary), and profile photo
- 📧 **Email notifications** — receive confirmation on apply and updates on every status change

### 🏢 For Recruiters
- 🏗️ **Company management** — register companies with name, description, website, location, founded year, company size (6 tiers: 1-10 to 1000+), and logo
- 📝 **2-step job posting form** — Step 1: title, description, requirements, benefits, company | Step 2: salary, location, job type, experience, positions, deadline
- 🔄 **Full ATS pipeline** — move applicants through: `pending → under_review → shortlisted → hired` or `rejected` at any stage
- 📝 **Decision notes** — leave a feedback note (up to 500 chars) when proceeding or rejecting — visible to the candidate
- 📈 **Analytics dashboard** — area chart (applications over time, last 30 days), donut chart (status breakdown), 4 stat cards, recent activity feed (last 8 applications), auto-refreshes every 60 seconds
- 🔒 **Protected routes** — recruiter-only pages enforced on both frontend (ProtectedRoute) and backend (JWT middleware)

### 🛡️ Security & Infrastructure
- 🔐 **httpOnly JWT cookies** — `secure` flag enabled in production, `sameSite: strict`
- 🚦 **Tiered rate limiting** — auth routes: 20 req/15min | API routes: 100 req/15min
- 🪖 **Helmet.js** — security headers with environment-aware CSP
- 🌐 **Allowlist-based CORS** — function-based origin validation, not wildcard
- 📏 **10KB request body cap** — prevents payload flooding
- ✅ **Zod validation on every endpoint** — field-level error messages returned as structured array
- 📚 **OpenAPI/Swagger docs** — available at `/api-docs` in development only (disabled in production)

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Frontend Framework** | React 18 + Vite 5 |
| **Styling** | Tailwind CSS 3 + Shadcn UI (Radix primitives) |
| **Animations** | Framer Motion |
| **Server State** | TanStack Query v5 (2min stale, 5min GC, auto window-focus refetch) |
| **UI State** | Redux Toolkit + redux-persist (auth only persisted) |
| **Charts** | Recharts (AreaChart + PieChart) |
| **HTTP Client** | Axios |
| **Toast Notifications** | Sonner |
| **Backend Framework** | Node.js + Express.js (ES Modules) |
| **Database** | MongoDB Atlas + Mongoose 8 |
| **Authentication** | JWT (jsonwebtoken) + bcryptjs |
| **File Uploads** | Multer + Cloudinary (q_auto, f_auto transforms) |
| **Validation** | Zod v4 (backend schemas + env validation) |
| **Email** | Nodemailer (Gmail SMTP / dev console fallback) |
| **Logging** | Winston (colorized dev / JSON prod with file rotation) + Morgan |
| **Security** | Helmet + express-rate-limit |
| **API Docs** | swagger-jsdoc + swagger-ui-express (OpenAPI 3.0) |
| **Dev Tools** | Nodemon, ESLint |

---

## 📸 Screenshots
These screenshot are taken as i run the project and i have uploaded it to show you all about the project

<img width="958" height="441" alt="Screenshot 2026-04-27 210028" src="https://github.com/user-attachments/assets/9232d146-3c89-4cbf-9fd5-ec311ffd261f" />
<img width="960" height="442" alt="Screenshot 2026-04-27 210038" src="https://github.com/user-attachments/assets/c60def2e-8cd1-49c9-9972-3ef2a40bec2a" />
<img width="960" height="439" alt="Screenshot 2026-04-27 210057" src="https://github.com/user-attachments/assets/a3bc1627-88eb-40cd-a48d-0b9212bf9262" />
<img width="960" height="442" alt="Screenshot 2026-04-27 210124" src="https://github.com/user-attachments/assets/e381ca50-9174-48e6-b236-f2c4bcbe0cd3" />
<img width="960" height="402" alt="Screenshot 2026-04-27 210132" src="https://github.com/user-attachments/assets/74f2ca72-1900-4b97-bcee-17b64612f695" />
<img width="960" height="440" alt="Screenshot 2026-04-27 210145" src="https://github.com/user-attachments/assets/17f60fe9-b0d7-4f1e-9431-70f0c0f43e2f" />
<img width="960" height="446" alt="Screenshot 2026-04-27 210200" src="https://github.com/user-attachments/assets/a52e08bd-505e-4e28-89f0-875664e3bb6d" />
<img width="960" height="438" alt="Screenshot 2026-04-27 210308" src="https://github.com/user-attachments/assets/f73591aa-36ff-47cc-af4d-0dd7f0ff973d" />

Now according to current status of the project the data shown in mongodb 

<img width="921" height="403" alt="Screenshot 2026-04-27 210914" src="https://github.com/user-attachments/assets/8819fac0-ecc3-42ff-8998-c2b9e1f7661a" />
<img width="923" height="403" alt="Screenshot 2026-04-27 210926" src="https://github.com/user-attachments/assets/555560ef-e8e3-4daa-ae78-26bd29d0ffe2" />
<img width="923" height="440" alt="Screenshot 2026-04-27 210950" src="https://github.com/user-attachments/assets/d78331ca-b675-429c-8c4a-c33a1f9f3241" />


| Page | Description |
|---|---|
| Home | Hero search + Latest Jobs grid |
| Jobs | Filter sidebar + paginated job cards |
| Job Detail | Company info, requirements, benefits, apply button |
| Profile | Applied jobs with ATS timeline + recruiter feedback |
| Admin Dashboard | Stat cards + area chart + donut chart + activity feed |
| Post Job | 2-step form with progress bar |
| Applicants | ATS table with Next Round / Reject dialog |

---

## ⚙️ How to Run Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)
- Cloudinary account (free tier works)

### 1. Clone the repository
```bash
git clone https://github.com/RishiRaj0011/CareerConnect-Pro---Full-Stack-Job-Portal-Platform.git
cd CareerConnect-Pro---Full-Stack-Job-Portal-Platform
```

### 2. Install dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configure environment variables
Create `backend/.env` with the following:
```env
PORT=8000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority&appName=<appName>
SECRET_KEY=<minimum_16_character_secret>
CLOUD_NAME=<your_cloudinary_cloud_name>
API_KEY=<your_cloudinary_api_key>
API_SECRET=<your_cloudinary_api_secret>
FRONTEND_URL=http://localhost:5173

# Optional — leave empty to use console logging in dev
EMAIL_USER=
EMAIL_PASS=
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:8000
```

> **MongoDB Atlas setup:** Create a free M0 cluster → add a database user → set Network Access to `0.0.0.0/0` → copy the connection string.

### 4. Start the servers

**Option A — One command (Windows):**
```bash
# From project root
dev-start.bat
```

**Option B — Two terminals:**
```bash
# Terminal 1 — Backend (from /backend)
npm start

# Terminal 2 — Frontend (from /frontend)
npm run dev
```

### 5. Open in browser
| URL | What you'll see |
|---|---|
| `http://localhost:5173` | Frontend application |
| `http://localhost:8000/api-docs` | Swagger API documentation |

---

## 🏗️ Architecture

```
jobportal-main/
├── backend/                    # Node.js + Express (ES Modules)
│   ├── controllers/            # Business logic — 4 resources
│   ├── middlewares/            # Auth, validation, error handler, logger
│   ├── models/                 # Mongoose schemas — User, Job, Company, Application
│   ├── routes/                 # 13 API endpoints across 4 route files
│   ├── swagger/                # OpenAPI 3.0 spec + path definitions
│   ├── utils/                  # AppError, asyncHandler, logger, emailService, env validator
│   └── validations/            # Zod schemas for all 4 resources
│
└── frontend/                   # React 18 + Vite
    └── src/
        ├── components/
        │   ├── admin/          # Recruiter-only pages (ProtectedRoute wrapped)
        │   ├── auth/           # Login + Signup
        │   ├── shared/         # Navbar, Footer, BackButton, EmptyState
        │   └── ui/             # Shadcn components + custom Skeletons, Sheet
        ├── hooks/              # 5 TanStack Query hooks (one per resource)
        ├── redux/              # 3 slices — auth (persisted), job (UI filters), company (search)
        ├── lib/                # QueryClient config
        └── utils/              # API endpoints, error parser
```

### Key Design Decisions

**Hybrid state management:** Redux owns only UI state (auth session, search inputs). All server data (jobs, companies, applications) lives in TanStack Query. This prevents stale data bugs and eliminates manual cache invalidation for most cases.

**Dual-strategy MongoDB connection:** `db.js` first attempts SRV URI connection. If DNS resolution fails (common on mobile hotspots), it automatically retries with a direct shard connection string — making the app work on restricted networks without code changes.

**`asyncHandler` HOF:** A single higher-order function wraps every async controller, eliminating try/catch boilerplate across all 13 endpoints. Errors propagate to a single global handler that classifies them (CastError, duplicate key, JWT errors) and returns consistent JSON responses.

**Zod env validation at startup:** `env.js` uses `__dirname`-relative path resolution (ES Module safe) to load `.env` before any other import runs. If any required variable is missing or invalid, the server exits immediately with a clear error message — no silent failures.

**Application status history:** Every status change is appended to a `statusHistory[]` array on the Application document, creating a full audit trail. The recruiter's note is stored both as `recruiterNote` (latest) and inside the history entry.

---

## 📈 Performance & Highlights

- **6 MongoDB indexes** across 3 collections: compound text index `{ title, description }` for full-text keyword search (index scan vs. collection scan), compound unique index `{ job, applicant }` enforcing one-application-per-user at DB level, `{ created_by, createdAt: -1 }` for recruiter job queries
- **`.lean()` on all read-only queries** — skips Mongoose document hydration, reducing memory overhead on list endpoints
- **`Promise.all()` for parallel queries** — every paginated endpoint runs the data query and `countDocuments` in parallel, cutting response time roughly in half vs. sequential
- **Paginated API responses** — all list endpoints support `page` + `limit` (max 50), returning `{ total, page, totalPages, hasNextPage, hasPrevPage }`
- **Debounced search inputs** — 400ms on hero search bar, 500ms on salary range inputs — prevents API calls on every keystroke
- **TanStack Query caching** — 2-minute stale time means repeated navigation to the same page doesn't trigger redundant network requests
- **Cloudinary `q_auto` + `f_auto`** — automatic quality and format optimization on every image upload
- **Non-blocking email sends** — `sendApplicationConfirmEmail` and `sendStatusUpdateEmail` are fire-and-forget; email failures are logged but never crash the API response
- **Winston log rotation** — production logs capped at 5MB per file, max 5 files each for `error.log` and `combined.log`

---

## 🔮 Future Improvements

1. **Resume parsing with AI** — integrate an LLM to auto-extract skills from uploaded PDFs and match them against job requirements, giving candidates a "match score" before applying
2. **Real-time notifications** — replace the 60-second dashboard polling with WebSocket (Socket.io) push notifications so recruiters see new applications instantly without page refresh
3. **Saved jobs + job alerts** — let students bookmark jobs and set up email alerts for new postings matching their saved filters (location, job type, salary range)
