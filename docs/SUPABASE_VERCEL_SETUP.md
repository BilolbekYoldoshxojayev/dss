# Deploying NamPS OS on Vercel with Supabase ($0 Free Tier)

This guide walks you through deploying **NamPS OS** to **Vercel** with a free-tier **Supabase PostgreSQL** database and Supabase Storage for attachments.

---

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and log in or create a free account.
2. Click **New Project**.
3. Choose an organization and configure:
   - **Name**: `namps-os` (or any name you prefer)
   - **Database Password**: Choose a strong password and **save it safely** (you will need it for the connection string).
   - **Region**: Choose `Frankfurt (eu-central-1)` or a region closest to Uzbekistan for optimal latency.
   - **Pricing Plan**: Free Tier ($0/month).
4. Click **Create new project** and wait ~2 minutes for provisioning.

---

## 2. Get Your Supabase Database Connection String

1. In your Supabase project dashboard, navigate to **Project Settings** (gear icon) → **Database**.
2. Scroll to the **Connection string** section and select **URI**.
3. Select **Mode: Session** (port `5432`):
   ```text
   postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres?sslmode=require
   ```
   *(Note: Port 5432 Session Pooler is recommended because it supports both Drizzle schema migrations and high-performance serverless query pooling).*
4. Replace `[YOUR-PASSWORD]` with the actual database password you chose in Step 1.
5. This is your `DATABASE_URL`.

---

## 3. (Optional) Get Supabase Storage Keys for Homework Attachments

If you want teachers and students to upload homework attachments (PDF, DOCX, images up to 5 MB) persistently on Vercel:

1. In Supabase dashboard, go to **Project Settings** → **API**.
2. Copy:
   - **Project URL** (e.g. `https://xyzcompany.supabase.co`) → `SUPABASE_URL`
   - **`service_role` Secret Key** (under "Project API keys", click "Reveal") → `SUPABASE_SERVICE_ROLE_KEY`
3. The platform will automatically create the `homework-attachments` private storage bucket on first upload.
*(If you leave these unset, homework text still works, and attachments fall back to serverless temporary storage).*

---

## 4. Run Migrations & Bootstrap Initial Admin

You can run the initial migration and create the very first administrator account right from your local terminal before deploying:

```bash
# 1. Apply database migrations to Supabase
$env:DATABASE_URL="your-supabase-connection-string"
pnpm db:migrate

# 2. Bootstrap the first administrator
$env:BOOTSTRAP_ADMIN_USERNAME="admin"
$env:BOOTSTRAP_ADMIN_PASSWORD="ChooseAStrongPassword123!"
$env:BOOTSTRAP_ADMIN_NAME="Head Administrator"
pnpm admin:bootstrap
```

*(On Linux / macOS bash, replace `$env:VAR="value"` with `VAR="value"`).*

Once completed, you will see `[bootstrap] Created the first administrator "admin"`.

---

## 5. Deploy on Vercel

1. Push your repository changes to GitHub:
   ```bash
   git add .
   git commit -m "feat: configure Supabase and serverless optimizations for Vercel deployment"
   git push origin main
   ```
2. Open [vercel.com](https://vercel.com) and log in.
3. Click **Add New...** → **Project**.
4. Select your GitHub repository (`dss` or `BilolbekYoldoshxojayev/dss`) and click **Import**.
5. In **Configure Project**:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `./`
   - **Build Command**: Leave default (or `pnpm vercel-build`)
6. Expand **Environment Variables** and add the following:

| Name | Value | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://postgres.[REF]:[PASS]@aws-0-...pooler.supabase.com:5432/postgres?sslmode=require` | Supabase Session Pooler URL |
| `SESSION_SECRET` | *(Run `openssl rand -hex 32` or use a 64-char random string)* | Secret for HMAC session cookies |
| `ANONYMOUS_PEPPER` | *(Run `openssl rand -hex 16` or use a 32-char random string)* | Secret for anonymous suggestions |
| `DEMO_MODE` | `false` | Disables demo test endpoints |
| `FEATURES` | `""` | Leave empty for core v1 platform |
| `SUPABASE_URL` | `https://[PROJECT-REF].supabase.co` | (Optional) For homework attachments |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJh...` (Supabase service_role secret key) | (Optional) For homework attachments |

7. Click **Deploy**. Vercel will build the project and assign a live URL (e.g. `https://dss-xxx.vercel.app`).

---

## 6. Verification Checklist

After deployment completes:
- [ ] **Health Check**: Open `https://your-app.vercel.app/api/health` → returns `{"ok":true}`.
- [ ] **Admin Login**: Log in with your bootstrap admin credentials. The system will prompt you to change your password immediately.
- [ ] **School Setup**: Go to **School Setup** in the admin sidebar:
  1. Add Academic Terms (e.g. Term 1, Term 2).
  2. Add Subjects (e.g. Mathematics, English, Physics).
  3. Create Classes (e.g. 10-A, 10-B) and appoint class teachers.
  4. Assign teachers to subjects ("Who teaches what") and configure timetable.
- [ ] **Transcripts & PDF**: Generate a student transcript and download the PDF. Uzbek characters (o', g') render cleanly with bundled Noto Sans fonts.
