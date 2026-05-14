# SINU Island Gateway

**Solomon Islands National University — Student Application & Portal Platform**

A full-stack web platform for SINU that handles public information, student applications, an admin review workflow, and an authenticated student portal with multi-factor login.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Features & Workflows](#features--workflows)
   - [Public Site](#public-site)
   - [Student Application Flow](#student-application-flow)
   - [Admin Review Workflow](#admin-review-workflow)
   - [Student Login & OTP Flow](#student-login--otp-flow)
   - [Student Portal](#student-portal)
5. [Database Schema](#database-schema)
6. [Environment Variables](#environment-variables)
7. [Local Development Setup](#local-development-setup)
8. [Running with Docker](#running-with-docker)
9. [API Reference](#api-reference)
10. [Project Structure](#project-structure)
11. [Contributing](#contributing)

---

## Project Overview

SINU Island Gateway is a monorepo that hosts both the React/Vite **front-end** (marketing site, course catalogue, student application form, student portal) and an **Express API** back-end in the same repository. They share type definitions and are deployed separately (or together via Docker Compose).

Key capabilities:

- **Public marketing site** with course catalogue, policies, research, and international student information.
- **Student application portal** — students fill a multi-step form, upload required documents, and choose up to three programme preferences.
- **Automated email at registration** — an auto-generated login credential is emailed to the student upon submission.
- **Admin dashboard** — admissions staff review, approve, or reject applications with email notifications sent on each decision.
- **Two-factor student login** — email + password followed by a time-limited OTP delivered to the registered email address.
- **Session management** — short-lived access tokens (JWT-like HMAC) paired with long-lived refresh tokens stored in the database.

---

## Tech Stack

### Frontend

| Layer | Technology |
|---|---|
| Framework | [React 18](https://react.dev/) |
| Build tool | [Vite 7](https://vitejs.dev/) |
| Language | TypeScript 5 |
| Routing | [React Router v6](https://reactrouter.com/) |
| Styling | [Tailwind CSS 3](https://tailwindcss.com/) |
| UI primitives | [Radix UI](https://www.radix-ui.com/) + shadcn/ui |
| Forms | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Data fetching | [TanStack Query v5](https://tanstack.com/query/) |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| CMS (blog/news) | [Sanity](https://www.sanity.io/) |
| Toast notifications | [Sonner](https://sonner.emilkowal.ski/) |

### Backend

| Layer | Technology |
|---|---|
| Runtime | [Node.js](https://nodejs.org/) 18+ |
| Framework | [Express 5](https://expressjs.com/) |
| Language | TypeScript (run directly via `tsx`) |
| File uploads | [Multer](https://github.com/expressjs/multer) |
| Emails | [Nodemailer](https://nodemailer.com/) |
| Auth | HMAC-SHA256 signed tokens (access) + random hex refresh tokens |
| OTP | Server-generated 6-digit code, stored hashed, delivered via SMTP |
| Password hashing | [bcryptjs](https://github.com/dcodeIO/bcrypt.js) |

### Database

| Component | Technology |
|---|---|
| Database | [PostgreSQL 15+](https://www.postgresql.org/) |
| ORM | [Prisma 6](https://www.prisma.io/) |
| Migrations | Prisma Migrate (SQL files in `prisma/migrations/`) |

### Infrastructure

| Component | Technology |
|---|---|
| Containerisation | [Docker](https://www.docker.com/) + Docker Compose |
| Reverse proxy | [Nginx](https://nginx.org/) (production & staging) |
| CI/CD | GitHub Actions (`.github/workflows/ci-cd.yml`) |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                             │
│        React SPA  (Vite build → Nginx :80 / :443)          │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS / HTTP
┌────────────────────────▼────────────────────────────────────┐
│              Nginx Reverse Proxy (production)               │
│   /         → React SPA (static files)                      │
│   /api/*    → Express API (internal :7000)                  │
└───────────────┬──────────────────────────────────────────────┘
                │
┌───────────────▼──────────────────────────────────────────────┐
│            Express API  (Node.js / tsx :7000)                │
│  Routes: adminRoutes · studentRoutes · applyRoutes           │
│          fileRoutes                                          │
│  Utilities: smtpMailer · password · adminToken               │
└───────────────┬──────────────────────────────────────────────┘
                │ Prisma Client
┌───────────────▼──────────────────────────────────────────────┐
│             PostgreSQL 15  (:5432)                           │
│  Tables: student_applications · student_sessions            │
│          policy_files · programmes · units                   │
└──────────────────────────────────────────────────────────────┘
```

---

## Features & Workflows

### Public Site

The landing page (`/`) and all sub-pages are standard React routes served as a SPA. They consume:

- **Sanity CMS** for news/events/blog content.
- **Express `/programme_catalogue`** for searchable course listings.
- **Express `/policy_files`** for downloadable policy PDFs.

---

### Student Application Flow

```
Student fills Apply form (/apply)
    │
    ▼
POST /student_applications   (multipart/form-data)
    │
    ├─ Validates: email (unique), phone (unique), files, programme codes
    ├─ Generates a random 12-character password
    ├─ Hashes password (bcrypt, 10 rounds) → stored in DB
    ├─ Creates StudentApplication record (status = "pending")
    └─ Sends confirmation email containing:
          • Student name + programmes applied for
          • Login ID (email address)
          • Auto-generated password
          • Link to Student Portal (/student-login)
    │
    ▼
Success screen shown with "Go to Student Portal Login" button
```

> **Email is mandatory.** The email field is required and validated as a unique address; duplicate applications are rejected at both check-duplicate and submit stages.

---

### Admin Review Workflow

```
Admin logs in  →  POST /admin/login  (username + password)
                  Returns a short-lived HMAC access token

Admin reviews applications at /admin/applied
    │
    ├─ PATCH /admin/applications/:id  { action: "approve" }
    │       • Sets status = "approved"
    │       • Sends approval email to student with accepted programme list
    │
    └─ PATCH /admin/applications/:id  { action: "reject", remarks: "…" }
            • Sets status = "rejected"
            • Sends rejection email to student
```

---

### Student Login & OTP Flow

```
Step 1 — Credentials
────────────────────
Student enters email + password at /student-login
    │
    ▼
POST /student/login
    ├─ Verifies email + bcrypt password
    ├─ Generates 6-digit OTP (valid 10 min, max 5 attempts)
    ├─ Stores OTP hash + expiry in DB
    └─ Sends OTP to student's registered email
    │
    ▼
Frontend advances to OTP step

Step 2 — OTP Verification
──────────────────────────
Student enters 6-digit code
    │
    ▼
POST /student/verify-otp
    ├─ Checks OTP match, attempts, expiry
    ├─ Clears OTP fields
    ├─ Creates StudentSession (refresh token, 30-day TTL)
    └─ Returns:
          accessToken  — 2-hour HMAC-signed token
          refreshToken — 30-day random hex token (stored in localStorage)
    │
    ▼
Student is redirected to /student-portal

Token Refresh
─────────────
POST /student/refresh  { refreshToken }
    └─ Returns new accessToken if session is still valid

Sign Out
────────
POST /student/logout  { refreshToken }
    └─ Deletes session from DB
```

---

### Student Portal

After login, `/student-portal` shows a **status banner** contextualised to the student's application state:

| Status | Banner |
|---|---|
| `pending` | Amber — "Application Under Review" |
| `approved` | Green — "Welcome to SINU! Accepted for [programmes]" |
| `rejected` | Red — Rejection notice with "Apply Again" button |

---

## Database Schema

```
student_applications
├── id                     UUID PK
├── full_name              TEXT NOT NULL
├── email                  TEXT UNIQUE NOT NULL
├── phone                  TEXT
├── phone_normalized       TEXT (indexed)
├── date_of_birth          TEXT
├── gender / nationality / residential_address
├── programmes             JSONB  [{priority, programme_code, programme_name}]
├── documents              JSONB  [{category, storedFileName, originalName}]
├── status                 TEXT   DEFAULT 'pending'  (pending|approved|rejected)
├── admin_remarks          TEXT
├── reviewed_at            TIMESTAMPTZ
├── password_hash          TEXT   (bcrypt)
├── must_reset_password    BOOLEAN
├── password_reset_token_hash / password_reset_expires_at
├── otp_code               TEXT   (plain 6-digit OTP — cleared after use)
├── otp_expires_at         TIMESTAMPTZ
├── otp_attempts           INTEGER DEFAULT 0
└── created_at / updated_at

student_sessions
├── id             UUID PK
├── application_id TEXT FK → student_applications.id  (CASCADE DELETE)
├── refresh_token  TEXT UNIQUE
├── expires_at     TIMESTAMPTZ
└── created_at

policy_files      — PDF blobs served via /policy_files/:filename
programmes        — Course catalogue imported via Excel
units             — Unit catalogue linked to programmes
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in all values.

| Variable | Required | Description |
|---|---|---|
| `NODE_ENV` | Yes | `local` / `staging` / `production` |
| `HOST` | Yes | API bind host (`0.0.0.0` in Docker) |
| `PORT` | Yes | API port (default `7000`) |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `VITE_API_URL` | Recommended | API base URL for frontend (e.g. `/api` behind nginx) |
| `VITE_API_URL_7000` | Fallback | Full URL to API (e.g. `http://1.2.3.4:7000`) |
| `PUBLIC_SITE_URL` | Yes | Public URL of the front-end (used in emails) |
| `ADMIN_USERNAME` | Yes | Admin portal username |
| `ADMIN_PASSWORD` | Yes | Admin portal password |
| `ADMIN_JWT_SECRET` | Yes | Secret for signing admin + student access tokens |
| `SMTP_HOST` | Yes\* | SMTP server hostname (\*required for emails) |
| `SMTP_PORT` | No | SMTP port (default `587`) |
| `SMTP_SECURE` | No | `true` for port 465 / TLS |
| `SMTP_USER` | Yes\* | SMTP username |
| `SMTP_PASS` | Yes\* | SMTP password |
| `SMTP_FROM` | No | Sender name+address shown in emails |

> **Warning:** Never commit a `.env` file with real credentials to version control. `.env` is in `.gitignore`.

---

## Local Development Setup

### Prerequisites

- **Node.js** 18 or later (`node -v`)
- **pnpm / npm / yarn** — examples use `npm`
- **PostgreSQL 15+** running locally or via Docker

### 1. Clone the repository

```bash
git clone https://github.com/your-org/sinu-island-gateway.git
cd sinu-island-gateway
```

### 2. Install dependencies

```bash
npm install
```

`postinstall` automatically runs `prisma generate`.

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env — set DATABASE_URL, SMTP_*, ADMIN_* and VITE_API_URL_7000
```

For local development create a minimal `.env`:

```env
NODE_ENV=local
HOST=localhost
PORT=7000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sinu_gateway
VITE_API_URL_7000=http://localhost:7000
PUBLIC_SITE_URL=http://localhost:5173
ADMIN_USERNAME=sinu_admin
ADMIN_PASSWORD=admin_dev_password
ADMIN_JWT_SECRET=local_dev_secret_change_me
# Leave SMTP_* empty to skip emails (the app will log a warning)
```

### 4. Set up the database

```bash
# Create the database (if it doesn't exist)
createdb sinu_gateway

# Run all Prisma migrations
npm run db:migrate

# (Optional) Open Prisma Studio to browse data
npx prisma studio
```

### 5. Start the API server

```bash
# Development mode (ts-node with watch)
npm run server
```

The API will be available at `http://localhost:7000`.

### 6. Start the frontend (in a separate terminal)

```bash
npm run dev
```

The React SPA will be available at `http://localhost:5173`.

---

## Running with Docker

### Staging

Uses `docker-compose-staging.yml` — a single-machine setup (app + API + PostgreSQL).

```bash
# 1. Copy and edit the staging env file
cp staging.env.example .env.staging

# 2. Build and start all services
docker compose -f docker-compose-staging.yml up -d --build

# 3. View logs
docker compose -f docker-compose-staging.yml logs -f api

# 4. Stop services
docker compose -f docker-compose-staging.yml down
```

The app is available on port **3000** and the API on **7000** (internal, proxied through Nginx).

### Production

Uses `docker-compose.yml` — includes Nginx with SSL, multiple API replicas.

```bash
# 1. Ensure SSL certificates are in place (nginx/production/certs/)
# 2. Set production environment variables on the host

docker compose up -d --build

# Scale API replicas
docker compose up -d --scale api=3
```

### Makefile shortcuts

```bash
make staging-up      # docker compose staging up
make staging-down    # docker compose staging down
make staging-logs    # tail staging logs
make prod-up         # docker compose production up
make db-migrate      # run prisma migrate deploy inside API container
```

---

## API Reference

All endpoints are served from the same Express process.

### Health

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | None | Returns `{ ok: true }` |

### Student Applications

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/student_applications/check-duplicate` | None | Check email/phone availability |
| `POST` | `/student_applications` | None | Submit new application (multipart) |

### Student Auth

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/student/login` | None | Step 1 — verify credentials, send OTP |
| `POST` | `/student/verify-otp` | None | Step 2 — verify OTP, receive tokens |
| `POST` | `/student/refresh` | None | Exchange refresh token for new access token |
| `POST` | `/student/logout` | None | Revoke session (refresh token) |
| `GET` | `/student/me` | Bearer | Return current student's profile |
| `POST` | `/student/forgot-password` | None | Send password-reset email |
| `GET` | `/student/reset-password/status` | None | Validate reset token |
| `POST` | `/student/reset-password` | None | Set new password via reset token |

### Admin

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/admin/login` | None | Admin login → access token |
| `GET` | `/admin/me` | Admin Bearer | Verify admin token |
| `GET` | `/admin/stats` | Admin Bearer | Application counts + programme breakdown |
| `GET` | `/admin/applications` | Admin Bearer | List applications (filter by status) |
| `GET` | `/admin/applications/:id` | Admin Bearer | Get full application detail |
| `PATCH` | `/admin/applications/:id` | Admin Bearer | Approve or reject application |
| `GET` | `/admin/files/:appId/:file` | Admin Bearer | Stream an uploaded document |

### Files / Catalogue

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/policy_files` | None | List policy PDF filenames |
| `GET` | `/policy_files/:filename` | None | Download policy PDF |
| `POST` | `/policy_files` | None | Upload policy PDF |
| `GET` | `/programme_catalogue/search` | None | Search programmes |
| `GET` | `/unit_catalogues/search` | None | Search units |
| `POST` | `/programme_catalogue/import` | None | Import programmes from Excel |

---

## Project Structure

```
sinu-island-gateway/
├── prisma/
│   ├── schema.prisma                 # Prisma data model
│   └── migrations/                   # SQL migration files
│       ├── 20260511120000_init/
│       └── 20260511130000_otp_sessions/
├── src/
│   ├── app.ts                        # Express entry point
│   ├── config/
│   │   └── dbconnect.ts              # DB connection + phone backfill
│   ├── lib/
│   │   ├── prisma.ts                 # Prisma client singleton
│   │   ├── apiBase.ts                # Frontend API URL helper
│   │   ├── authStorage.ts            # Token localStorage helpers
│   │   └── applicationSummary.ts     # PDF/print summary builder
│   ├── routes/
│   │   ├── adminRoutes.ts            # Admin auth + application management
│   │   ├── applyRoutes.ts            # Student application submission
│   │   ├── studentRoutes.ts          # Student auth (OTP, sessions, reset)
│   │   └── fileRoutes.ts             # Policy PDFs + programme catalogue
│   ├── utils/
│   │   ├── adminToken.ts             # HMAC token sign/verify
│   │   ├── password.ts               # bcrypt hash/verify + random password
│   │   ├── smtpMailer.ts             # Nodemailer SMTP wrapper
│   │   ├── resetPasswordToken.ts     # Reset token generation
│   │   ├── uploadPaths.ts            # Upload directory resolution
│   │   ├── phoneNormalize.ts         # Phone digit normalisation
│   │   ├── prismaApiShapes.ts        # DB → API response transformers
│   │   ├── uuidValidation.ts         # UUID regex helper
│   │   └── excelProgrammeUnit.ts     # Excel row → programme/unit mapper
│   ├── types/
│   │   └── studentApplication.ts     # Shared TypeScript types
│   ├── pages/                        # React route-level pages
│   │   ├── Apply.tsx                 # Multi-step application form
│   │   ├── StudentLogin.tsx          # Two-step login (credentials + OTP)
│   │   ├── StudentsPortal.tsx        # Authenticated student portal
│   │   ├── StudentForgotPassword.tsx
│   │   ├── StudentResetPassword.tsx
│   │   └── admin/                    # Admin dashboard pages
│   ├── components/                   # Reusable React components
│   │   ├── layout/                   # Header, Footer, Nav, MegaMenu
│   │   ├── ui/                       # shadcn/ui primitives
│   │   └── …                         # Section-specific components
│   ├── data/                         # Static data (megaMenuData, etc.)
│   ├── hooks/                        # Custom React hooks
│   └── App.tsx                       # Root React router config
├── nginx/
│   ├── production/                   # Nginx config for production
│   └── staging/                      # Nginx config for staging
├── sanity/                           # Sanity CMS schemas + CLI config
├── scripts/                          # Post-deploy helper scripts
├── .github/workflows/ci-cd.yml       # GitHub Actions CI/CD
├── docker-compose.yml                # Production Docker Compose
├── docker-compose-staging.yml        # Staging Docker Compose
├── Dockerfile.api                    # API container image
├── makefile                          # Common task shortcuts
├── .env.example                      # Environment variable template
├── staging.env.example               # Staging-specific env template
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## Contributing

1. Fork the repository and create a feature branch (`git checkout -b feature/your-feature`).
2. Make changes and ensure no TypeScript or ESLint errors (`npm run lint`).
3. Test locally with `npm run server` (API) and `npm run dev` (frontend).
4. Open a pull request with a clear description of changes.

---

*Solomon Islands National University — SINU Island Gateway*
