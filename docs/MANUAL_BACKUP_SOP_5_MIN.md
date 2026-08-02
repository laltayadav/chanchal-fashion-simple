# 5-Minute Manual Backup SOP

Purpose: create fast, repeatable backups for JSON data before deploys and once daily.

Scope:
- runtime `products.json`
- runtime `orders.json`
- runtime `config.json`
- runtime `admin-auth.json`
- public/uploads (if product images are stored there)

Important:
- In production, back up the mounted runtime data directory (for this repo: `/data`).
- Do not assume repo-tracked `data/*.json` files are the current production source of truth.
- `orders.json` is runtime-owned business data and must be backed up from runtime storage, not from bundled seed files.

Frequency:
- Mandatory: before every deploy
- Mandatory: once daily at fixed local time

Target runtime:
- 5 minutes

---

## A) Create backup folder and snapshot name

Use timestamp format:
- YYYYMMDD-HHMM

Example backup root:
- backups

Example snapshot:
- backups/chanchal-20260727-1830

---

## B) Create backup snapshot (PowerShell)

Run from project root.

1) Make snapshot folder:
- New-Item -ItemType Directory -Force -Path "backups/chanchal-$(Get-Date -Format yyyyMMdd-HHmm)" | Out-Null

2) Save path to variable:
- $snap = Get-ChildItem backups | Sort-Object LastWriteTime -Descending | Select-Object -First 1
- $dst = $snap.FullName

3) Copy JSON files:
- Copy-Item data/products.json "$dst/products.json" -Force
- Copy-Item data/orders.json "$dst/orders.json" -Force
- Copy-Item data/config.json "$dst/config.json" -Force
- Copy-Item data/admin-auth.json "$dst/admin-auth.json" -Force

4) Copy uploads folder if present:
- if (Test-Path public/uploads) { Copy-Item public/uploads "$dst/uploads" -Recurse -Force }

5) Create checksum manifest:
- Get-FileHash "$dst/*" -Algorithm SHA256 | Format-Table Path, Hash | Out-File "$dst/CHECKSUMS.txt"

6) Create compressed archive:
- Compress-Archive -Path "$dst/*" -DestinationPath "$dst.zip" -Force

7) Verify archive exists and is non-zero:
- Get-Item "$dst.zip" | Select-Object FullName, Length, LastWriteTime

---

## C) Store one off-host copy

Minimum rule:
- Copy the zip file to one external location not on the same machine/volume.

Examples:
- local external drive
- cloud drive folder
- another secure workstation

---

## D) Retention policy (manual)

Keep:
- Last 7 daily backups
- Last 4 pre-deploy backups

Weekly cleanup:
- delete older snapshots beyond above policy

---

## E) 2-minute restore drill (weekly)

Goal: prove backup is usable.

1) Pick latest backup zip
2) Extract to temporary folder
3) Confirm required files exist:
- products.json
- orders.json
- config.json
- admin-auth.json
4) Open one JSON file and confirm valid structure

Monthly full drill:
- restore into a test environment and verify app + admin + orders read correctly

---

## F) Failure handling

If backup command fails:
1. Do not deploy
2. Fix file path or permission issue
3. Re-run backup and verify zip size
4. Proceed only after success

---

## Quick checklist card

Before deploy:
- [ ] Run backup commands
- [ ] Confirm zip size > 0
- [ ] Copy zip off-host
- [ ] Only then deploy

Daily:
- [ ] Create one snapshot
- [ ] Keep retention clean
