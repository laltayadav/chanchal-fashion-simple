## ADDED Requirements

### Requirement: Typed lowdb-backed persistence for products, orders, and config
The system SHALL provide a single `lib/db.ts` module that exposes typed helpers to read and write `products.json`, `orders.json`, and `config.json` under the `data/` directory.

#### Scenario: Read products
- **WHEN** server code calls `db.getProducts()`
- **THEN** it receives an array of `Product` objects parsed from `data/products.json` or an empty array if the file doesn't exist

#### Scenario: Write products
- **WHEN** server code calls `db.saveProducts(products)`
- **THEN** the `data/products.json` file is atomically updated to contain the serialized products list
