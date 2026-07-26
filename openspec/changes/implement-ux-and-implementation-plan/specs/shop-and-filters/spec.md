## ADDED Requirements

### Requirement: Shop page with type tabs and dynamic subcategory chips
The system SHALL provide a Shop page that includes main type tabs (`All`, `Saree`, `Blouse`, `Set`) and, when `Saree` or `Blouse` is selected, shows subcategory chips derived from distinct `category` values found in the current product list. The product grid SHALL be responsive (2 columns on mobile).

#### Scenario: Subcategory chips derive from products
- **WHEN** the product list contains categories `Silk`, `Chiffon`
- **THEN** the subcategory chips render `All`, `Silk`, `Chiffon`
