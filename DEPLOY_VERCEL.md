# Vercel Deployment Guide — Smart Attendance & Analytics System

This project is fully configured and ready for **1-click deployment on [Vercel](https://vercel.com)** with:
- **Frontend**: Vite + React SPA served statically on Vercel's global CDN
- **Backend API**: Express 5 running as a Vercel Serverless Function (`api/index.js`)
- **Database**: PostgreSQL (Neon, Supabase, Railway, AWS RDS, etc.) with Drizzle ORM

---

## Quick Step-by-Step Deployment to Vercel

### Step 1: Push Code to GitHub
Your code is committed and pushed to your GitHub repository:
```bash
git push origin main
```
Repository: `https://github.com/ramchandaninikhil17-web/Smart-Attendance-Analyst-System`

---

### Step 2: Get a Free PostgreSQL Database
If you do not already have a PostgreSQL database:
1. Go to **[Neon.tech](https://neon.tech)** (free serverless Postgres) or **[Supabase](https://supabase.com)**.
2. Create a new database project (e.g. `smart-attendance`).
3. Copy your pooled connection string (starts with `postgresql://...`).
4. (Optional) Run the contents of `schema.sql` in the Neon/Supabase SQL editor, or enable `AUTO_SEED=true` to let the serverless backend automatically seed initial tables.

---

### Step 3: Import Project into Vercel
1. Log in to your **[Vercel Dashboard](https://vercel.com/dashboard)**.
2. Click **"Add New..."** → **"Project"**.
3. Select your GitHub repository: `ramchandaninikhil17-web/Smart-Attendance-Analyst-System`.
4. Vercel will automatically detect `vercel.json` and the Vite framework:
   - **Framework Preset**: `Vite` (or Other)
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `pnpm run build` (configured automatically via `vercel.json`)
   - **Output Directory**: `artifacts/smart-attendance/dist/public` (configured automatically via `vercel.json`)

---

### Step 4: Configure Environment Variables in Vercel
In the Vercel project configuration page, expand **Environment Variables** and add:

| Variable Name | Required | Example / Description |
|---|---|---|
| `DATABASE_URL` | **Yes** | `postgresql://user:password@ep-xyz.neon.tech/dbname?sslmode=require` |
| `JWT_SECRET` | **Yes** | A random 64-char secret (e.g. `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`) |
| `QR_HMAC_SECRET` | **Yes** | A random 64-char secret for 15s rotating dynamic QR codes |
| `NODE_ENV` | **Yes** | `production` |
| `AUTO_SEED` | No (default `true`) | `true` (auto-seeds classes, students, teachers, demo accounts on first run) |
| `DEFAULT_SEED_PASSWORD` | No | `charusat123` (password for demo accounts) |
| `WEBAUTHN_RP_NAME` | No | `CHARUSAT Smart Attendance` |
| `WEBAUTHN_RP_ID` | Recommended | Your Vercel domain without protocol (e.g. `smart-attendance.vercel.app`) |
| `WEBAUTHN_ORIGIN` | Recommended | Your full HTTPS domain (e.g. `https://smart-attendance.vercel.app`) |

> **Tip to generate secrets**: Run in any terminal:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

---

### Step 5: Click "Deploy"
1. Click **Deploy**.
2. Vercel will install dependencies using `pnpm`, build the React frontend and serverless API, and deploy your application.
3. Once finished, visit your live URL:
   - Frontend: `https://your-project.vercel.app/`
   - API Status: `https://your-project.vercel.app/api`
   - Health Check: `https://your-project.vercel.app/api/health`

---

## Default Seed Accounts

When `AUTO_SEED=true` is enabled:
- **Admin**: `amit.ganatra@charusat.ac.in` / `charusat123`
- **Faculty / Teacher**: `amit.ganatra.teacher@charusat.ac.in` / `charusat123`
- **Student**: `d21ce101@charusat.edu.in` / `charusat123`
