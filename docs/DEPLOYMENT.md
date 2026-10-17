# NamPS OS — Free Public Deployment Guide ($0 Cost)

## 1. Zero Spending Policy
The deployment strategy strictly respects the $0 budget constraint:
- No paid credit card requirements.
- No trial periods that silently convert to paid billing.
- Core operations function without paid external AI inference or metered resources.

## 2. Recommended Free Tier Cloud Providers
1. **Frontend & Server Actions**: **Vercel** (Hobby Tier - Free forever, generous bandwidth, automatic SSL/HTTPS, instant deployments from GitHub).
   - Alternatively: **Render** (Free Web Service) or **Koyeb** (Free Eco instance).
2. **Database (PostgreSQL)**: **Neon** Serverless Postgres (Free tier: 0.5 GiB storage, branchable, compute scaling to zero) or **Supabase** (Free tier: 500 MB Postgres).

## 3. Deployment Steps via Vercel + GitHub
The repository is fully initialized and pushed to:
`https://github.com/BilolbekYoldoshxojayev/dss.git`

To deploy in under 2 minutes:
1. Go to [https://vercel.com/new](https://vercel.com/new) and log in with GitHub.
2. Select repository `BilolbekYoldoshxojayev/dss`.
3. In Environment Variables, configure:
   - `NEXT_PUBLIC_DEMO_MODE=true`
   - `JWT_SECRET=a-secure-random-32-char-string`
   - `ANONYMOUS_PEPPER=a-secure-random-pepper-string`
   - `DATABASE_URL` (optional: connect a free Neon database, or leave blank to run the embedded persistent demo engine).
4. Click **Deploy**.
5. Vercel automatically builds and provides a public `.vercel.app` URL with free TLS/HTTPS.
