# Day-0 Fly.io Launch Checklist

Purpose: launch Chanchal Fashion safely on Fly.io with JSON-file persistence.

Owner: single admin owner
Target duration: 60 to 90 minutes

---

## 0) Launch readiness gate (must pass before deploy)

- [ ] npm run test passes locally
- [ ] npm run build passes locally
- [ ] Admin login works locally
- [ ] Place order flow works locally (cart -> order save -> WhatsApp open)
- [ ] data folder is present and readable locally

If any item fails, stop launch and fix first.

---

## 1) Prepare production secrets

Required secret:
- ADMIN_SESSION_SECRET (minimum 32 chars, recommended 48+ random bytes)

Generate on your machine:
- node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"

Record in your password manager before setting in Fly.

---

## 2) Install and authenticate Fly CLI

- [ ] Install Fly CLI (if missing)
- [ ] fly auth login
- [ ] fly whoami confirms the right account

---

## 3) Initialize app and region

- [ ] fly launch (choose app name and nearest region)
- [ ] Keep internal port at 3000
- [ ] Do not deploy yet if asked automatically (choose no if you want to finish storage steps first)

Suggested app naming:
- chanchal-fashion-prod

---

## 4) Create and mount persistent volume for data

Your app stores orders/config/products in local JSON files. This must live on a persistent Fly volume.

- [ ] Create volume in same region as machine
- [ ] Configure mount path used by app runtime

Recommended mount path:
- /app/data

After mount, verify your app reads/writes from mounted data path in production runtime.

---

## 5) Configure environment and secrets

- [ ] Set ADMIN_SESSION_SECRET in Fly secrets
- [ ] Set NODE_ENV=production (if not already)
- [ ] Confirm no plaintext admin password is committed anywhere

---

## 6) First deploy

- [ ] fly deploy
- [ ] Wait for healthy status
- [ ] fly status shows running machine
- [ ] fly logs has no crash loop

---

## 7) Day-0 smoke test (production URL)

Customer flow:
- [ ] Open home page
- [ ] Products load
- [ ] Add to cart works
- [ ] Cart page loads
- [ ] Place one test order

Admin flow:
- [ ] Admin login succeeds
- [ ] New test order visible in admin orders list
- [ ] Order detail page opens

Persistence flow:
- [ ] Restart machine once
- [ ] Re-open admin orders
- [ ] Confirm test order still present after restart

If order disappears after restart, stop and fix volume mount before go-live.

---

## 8) Pre-go-live backup snapshot (manual)

- [ ] Run the 5-minute backup SOP once
- [ ] Confirm snapshot file exists and has non-zero size
- [ ] Keep one copy outside Fly host

---

## 9) Go-live switch

- [ ] Replace test WhatsApp/config values with production values
- [ ] Remove test order if needed
- [ ] Announce storefront URL live

---

## 10) Day-1 monitoring plan

Check every 4 to 6 hours on day 1:
- [ ] fly status
- [ ] fly logs for errors
- [ ] New orders visible in admin
- [ ] One manual backup completed today

---

## Rollback plan (keep this ready)

Trigger rollback if:
- users cannot place orders
- admin login fails for valid credentials
- data write/read fails

Rollback steps:
1. Put storefront in maintenance communication mode (message users)
2. Deploy previous known-good release
3. Restore latest valid backup snapshot of data
4. Re-run smoke checks (customer + admin + persistence)

---

## Exit criteria for successful Day-0 launch

- [ ] App deployed and stable
- [ ] Order path verified end-to-end
- [ ] Data persisted across restart
- [ ] Manual backup process tested
- [ ] Owner can operate admin safely
