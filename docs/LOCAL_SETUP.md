# Chanchal Fashion — Local Setup Guide

Steps to get the project running on your machine. Assumes Node 20 LTS, Git, and Docker are already installed.

## 0. Confirm tooling versions

```bash
node -v        # want 20.x LTS
git --version
docker --version
```

If Node isn't 20 LTS:
```bash
nvm install 20 && nvm use 20
```

## 1. Scaffold the Next.js app

```bash
npx create-next-app@latest chanchal-fashion --typescript --tailwind --app --eslint
cd chanchal-fashion
```

- Say **no** to `src/` directory (keep `app/` at root, matches the planned folder structure)
- Turbopack is optional, your call

## 2. Install the extra dependencies

```bash
npm install lowdb sharp
```

- **lowdb** — JSON-file database, no schema/migrations
- **sharp** — resizes and compresses uploaded product photos before saving

## 3. Create the data folder structure

```bash
mkdir -p data/images

cat > data/products.json << 'EOF'
[]
EOF

cat > data/orders.json << 'EOF'
[]
EOF

cat > data/config.json << 'EOF'
{
  "shopName": "Chanchal Fashion",
  "whatsappNumber": "",
  "adminPassword": "changeme"
}
EOF
```

Optional: paste real product/order data in now (from the artifact's Admin tab) instead of starting empty.

When adding sample products, include metadata fields where possible:

- `size` as optional free text (for example `Free Size`, `38 inch`, `XL`)
- `createdAt` and `updatedAt` as ISO timestamps for recency-aware admin sorting

## 4. Decide how `data/` is tracked in git

Recommended — track the JSON files, but keep binary images out of git history:

```bash
cat >> .gitignore << 'EOF'
data/images/*
!data/images/.gitkeep
EOF

touch data/images/.gitkeep
```

## 5. Env file

```bash
cat > .env.local << 'EOF'
ADMIN_SESSION_SECRET=replace-with-a-long-random-secret-at-least-32-chars
DATA_DIR=.local-data
EOF

echo ".env.local" >> .gitignore
```

Generate a secure session secret quickly:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

`DATA_DIR=.local-data` keeps your private runtime products, orders, and config out of the tracked repo `data/` seed files.
This is the recommended local workflow if you do not want local JSON changes to influence production bootstrap content.

## 6. Build the data/image helper libraries

Create these two files before wiring up API routes — everything else imports from them:

- `lib/db.ts` — lowdb wrapper, one `openDb()` helper reused for products/orders/config
- `lib/images.ts` — `saveProductImage()` (resize to ~1000px wide, convert to WebP via sharp) and `deleteProductImage()` (called on product update/delete to avoid orphaned files)

Runtime data ownership notes:

- Repo `data/` files are bootstrap/seed inputs.
- Local runtime state should live in `.local-data/` or another untracked directory.
- `orders.json` should be treated as runtime-only data, not sample seed content.

## 7. Run it locally

```bash
npm run dev
```

Visit `http://localhost:3000`. You'll see the default Next.js starter page until the shop/cart/admin UI is ported over from the artifact.

Admin routes:

- `/admin` overview
- `/admin/products` products CRUD
- `/admin/orders` order history
- `/admin/settings` shop settings + admin password update

## 8. Test and release gate checks

```bash
npm run test
npm run build
```

Before production readiness, require:

1. Tests pass
2. Build passes
3. Manual admin smoke check on desktop and narrow mobile viewport

## 8. First commit, push to your private GitHub repo

```bash
git init
git add .
git commit -m "Initial scaffold: Next.js + Tailwind + lowdb + sharp"
git remote add origin git@github.com:<your-username>/chanchal-fashion.git
git push -u origin main
```

## 9. Sanity-check the Docker build (do this before deploy day, not on it)

Requires a `Dockerfile` in the repo root (multi-stage: deps → build → slim runtime).

```bash
docker build -t chanchal-fashion .
docker run -p 3000:3000 -v $(pwd)/data:/app/data chanchal-fashion
```

If this runs cleanly locally, the Fly.io deploy later has one less thing to go wrong.

---

## What's deliberately out of scope here

This guide covers **local setup only**. Not included:
- Fly.io deployment (separate step, once the UI is actually ported in)
- WhatsApp Cloud API (Phase 2)
- Payments (Phase 3)

See `ARCHITECTURE.md` in this repo for the full phased plan.
