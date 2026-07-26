## ADDED Requirements

### Requirement: Image processing utilities
The system SHALL provide `lib/images.ts` functions to accept uploaded images, resize to a maximum width of 1000px, convert to WebP, and write files to `data/images/` using a generated UUID filename. The functions SHALL also provide a delete utility to remove images when products are deleted or replaced.

#### Scenario: Save product image
- **WHEN** `images.saveProductImage(stream, originalName)` is called with an image stream
- **THEN** the image is resized, converted to WebP, written to `data/images/<uuid>.webp`, and the function returns the relative path

#### Scenario: Delete product image
- **WHEN** `images.deleteProductImage(path)` is called with a relative image path
- **THEN** the file at `data/images/<name>.webp` is removed if it exists
