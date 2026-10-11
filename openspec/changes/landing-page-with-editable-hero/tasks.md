## 1. Route migration and landing page

- [x] 1.1 Move the existing product shop page to `/shop` without changing catalog, filter, cart, or order behavior; update imports and Shop navigation.
- [x] 1.2 Create the fixed home landing page with up to five ordered responsive hero images, slow rotation and clickable indicators, default headline/supporting copy, fixed `/shop` CTA, and branded no-image fallback.
- [x] 1.3 Add distinct title, description, and canonical metadata for `/` and `/shop`.

## 2. Admin-editable content and persistence

- [x] 2.1 Add optional homepage content fields and safe defaults, preserving compatibility with existing runtime config files.
- [x] 2.2 Extend the protected config API allowlist and server validation for homepage copy and ordered hero images; persist uploaded images using existing WebP processing and storage.
- [x] 2.3 Extend admin settings with a minimal multi-image upload/preview/reorder/remove flow and headline/supporting-copy inputs, including clear validation and save errors.
- [x] 2.4 Extend the homepage slide configuration so optional per-slide title and description overrides remain associated with their image when reordered, preserving compatibility with existing single-image and multi-image settings.
- [x] 2.5 Update the admin editor and landing-page renderer to require master copy, allow independent per-slide copy overrides, and fall back per field to the master copy.

## 3. Verification

- [x] 3.1 Add focused tests for public config safety, authenticated updates, legacy config defaults, invalid image/copy inputs, and landing-page fallback/CTA behavior.
- [x] 3.2 Run relevant tests, full test suite, and production build; smoke-check `/`, `/shop`, cart/order flow, admin editing, and uploaded image serving.
- [x] 3.3 Review the final diff and confirm unrelated pre-existing worktree changes remain untouched.
- [x] 3.4 Add and run tests for independent per-field fallback, slide/image copy association through reordering, and legacy configuration compatibility.
