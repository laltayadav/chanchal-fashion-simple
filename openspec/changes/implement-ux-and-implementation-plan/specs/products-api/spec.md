## ADDED Requirements

### Requirement: Products API (CRUD)
The system SHALL expose `app/api/products/route.ts` supporting GET (list), POST (create), PUT (update), and DELETE (remove) operations. Create/update operations that include images SHALL use `lib/images.ts`.

#### Scenario: Create product with image
- **WHEN** POST with multipart/form-data containing image and product fields
- **THEN** the image is processed using `lib/images.ts` and the product is saved with the image path
