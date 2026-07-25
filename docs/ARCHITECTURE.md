# Anokhi Saris — Architecture & Build Plan (JSON-file version)

## Recommended stack (all open-source, minimal moving parts)

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js** (React) | One repo for site + backend API routes. |
| Styling | **Tailwind CSS** | Matches the current design. |
| Data storage | **Plain JSON files + [lowdb](https://github.com/typicode/lowdb)** | lowdb is a small, widely-used open-source library that reads/writes a JSON file with a simple `.get()/.set()` API — no query language, no schema migrations, easy to read the raw file yourself. |
| Hosting | **A small always-on server with persistent disk** (see note below) | JSON files need somewhere that doesn't reset. |
| Admin auth | Simple password now → swap for real auth later if needed | Matches current complexity level. |
| WhatsApp (Phase 2) | **Meta WhatsApp Cloud API** | Free for first 1,000 conversations/month, sends automatically. |
| Payments (Phase 3) | **Razorpay** | UPI support, ~2% fee, no monthly cost. |

## The one thing that matters: hosting must be "always-on," not serverless

Vercel/Netlify-style hosting spins your app up fresh for each request — great for speed, but any file you write to disk disappears immediately. JSON-file storage needs a server that **stays running** with a **persistent disk**. Options, cheapest first:

| Host | Cost | Notes |
|---|---|---|
| **Fly.io** | Free allowance covers this app | Free tier includes small persistent volumes — good first choice. |
| **Render.com** | Free web service, but disk resets on redeploy/sleep | Fine for testing, not reliable for live order data. |
| **A small VPS** (Hetzner / DigitalOcean) | ~₹350–450/month (~$4–5) | Full control, guaranteed persistence, dead simple to reason about — recommended once you're past the testing stage. |

Start on Fly.io's free tier tomorrow; move to a ~$5/month VPS once you have real daily orders you can't risk losing.

## Repo structure

```
sari-shop/
├─ data/
│  ├─ products.json        # array of saris
│  ├─ orders.json          # array of orders
│  └─ config.json          # shop name, WhatsApp number, admin password
├─ app/
│  ├─ page.tsx              # customer shop view
│  ├─ cart/page.tsx
│  ├─ admin/
│  │  ├─ page.tsx
│  │  ├─ products/page.tsx
│  │  └─ orders/page.tsx
│  └─ api/
│     ├─ products/route.ts  # reads/writes data/products.json via lowdb
│     ├─ orders/route.ts    # reads/writes data/orders.json via lowdb
│     └─ whatsapp/route.ts  # Phase 2
├─ components/
│  ├─ ProductCard.tsx
│  ├─ CartDrawer.tsx
│  └─ OrderCard.tsx
├─ lib/
│  └─ db.ts                 # lowdb setup, one function per file
├─ .env.local
├─ .env.example
└─ README.md
```

Every JSON file is human-readable — you can open `data/products.json` in any text editor and see exactly what's stored. No hidden state, no query language to learn.

## Example: data/products.json

```json
[
  {
    "id": "p1",
    "name": "Banarasi Silk — Wine Red",
    "category": "Silk",
    "price": 4500,
    "discountPrice": 3800,
    "image": "https://..."
  }
]
```

`orders.json` and `config.json` follow the same flat, obvious shape as the fields already in the artifact you're using today.

## lib/db.ts (the whole "database layer")

```ts
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

export function openDb<T>(filename: string, defaultData: T) {
  const adapter = new JSONFile<T>(`data/${filename}`)
  const db = new Low<T>(adapter, defaultData)
  return db
}

// usage in an API route:
// const db = openDb('products.json', [])
// await db.read()
// db.data.push(newProduct)
// await db.write()
```

That's genuinely the entire persistence layer. No connection strings, no migrations.

## Build phases

**Phase 0 — today (done):** Artifact live, real customers can order now. Keep it running.

**Phase 1 — tomorrow:**
1. `npx create-next-app@latest sari-shop --typescript --tailwind --app`
2. `npm install lowdb sharp`
3. Create `data/products.json`, `data/orders.json`, `data/config.json` seeded from the artifact's current contents; create `data/images/` for uploaded photos
4. Build `lib/db.ts` and the three API routes
5. Build `lib/images.ts`: resize/compress every upload with **sharp** (cap ~1000px wide, convert to WebP) before saving to `data/images/` — keeps storage small from day one instead of cleaning up later
6. In the product update/delete API routes, delete the old image file whenever it's replaced or the product is removed — no orphaned files piling up
7. Port shop/cart/admin UI from the artifact into components
8. Push to your private GitHub repo
9. Deploy to Fly.io (`fly launch`, attach a small volume mounted at `/data`)

**Phase 2 — WhatsApp auto-notify:** Register a number with Meta's Cloud API, call it from `api/whatsapp/route.ts` when an order is created — no customer tap needed.

**Phase 3 — Payments:** Razorpay checkout on the cart page.

**Phase 4 — if you ever outgrow JSON files:** Swap `lib/db.ts` for a real database (Postgres/Supabase). Because every API route already goes through `lib/db.ts`, the swap touches one file — the rest of the app doesn't change. This is the "extend later" path from your earlier ask.

## When JSON files stop being enough

Rule of thumb: fine up to a few thousand orders and moderate concurrent admin edits. If two people edit the catalog at the exact same second, last write wins (same limitation the current artifact already has). You'll feel it as "slow to update" before you feel it as "broken" — that's your signal to do the Phase 4 swap, not before.
