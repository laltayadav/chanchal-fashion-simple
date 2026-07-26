## ADDED Requirements

### Requirement: ProductCard component
The system SHALL provide a `components/ProductCard.tsx` React component that renders image, category label (or includes text), name, price (with strikethrough when `discountPrice` is present), and an "Add to Order" button. If `inStock` is false, the component SHALL display an "Out of Stock" badge and disable the Add button.

#### Scenario: Out of stock rendering
- **WHEN** `ProductCard` is rendered with `product.inStock === false`
- **THEN** the card shows an "Out of Stock" badge and the Add button is disabled
