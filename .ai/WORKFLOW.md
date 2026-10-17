# NamPS OS — Development Workflow & Operations

## 1. Local Environment Requirements
- Node.js >= 20 (Verified: Node v24.19.0)
- Package Manager: `pnpm` (Verified: v12.8.1)
- Git (Verified: v2.56.0)
- Database: PostgreSQL 16 (Local via Docker or Cloud Free Tier like Neon)

## 2. Standard Commands
```bash
# Install dependencies
pnpm install

# Run database migrations
pnpm db:migrate

# Seed fictional demonstration data (Grades 5-11)
pnpm db:seed

# Start development server
pnpm dev

# Type check
pnpm typecheck

# Lint check
pnpm lint

# Run automated tests
pnpm test

# Production build
pnpm build

# Start production server
pnpm start
```

## 3. Container Workflow (Self-Hosted / School Server)
```bash
# Build and run containers
docker-compose up -d --build

# Run database migrations in container
docker-compose exec app pnpm db:migrate

# Seed data in container
docker-compose exec app pnpm db:seed

# Inspect container logs
docker-compose logs -f app
```

## 4. Quality Gates
Before any milestone is completed or code is committed:
1. `pnpm typecheck` must pass with 0 errors.
2. `pnpm lint` must pass with 0 warnings/errors.
3. `pnpm test` must execute and pass all unit, integration, and security tests.
4. `pnpm build` must produce a production-ready standalone build without errors.
