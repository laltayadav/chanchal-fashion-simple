## ADDED Requirements

### Requirement: Runtime JSON ownership SHALL be separated from seed data
The system SHALL distinguish bundled seed JSON from runtime-managed JSON so that production and local runtime state are not implicitly sourced from repo-tracked files.

#### Scenario: Runtime path differs from bundled seed path
- **WHEN** the application is configured with a runtime data directory
- **THEN** runtime reads and writes use that directory as the source of truth for mutable state

#### Scenario: Bundled seed files are treated as bootstrap-only
- **WHEN** repo-tracked JSON files exist in the application bundle
- **THEN** they are treated as seed/bootstrap inputs rather than live runtime state

### Requirement: Orders SHALL never be seeded from bundled repo data
The system SHALL NOT copy repo-tracked `orders.json` into runtime storage during initialization in production-like or mounted-data environments.

#### Scenario: Missing runtime orders file initializes empty
- **WHEN** runtime storage does not contain `orders.json`
- **THEN** the system creates an empty orders file or equivalent empty state instead of copying bundled repo orders data

#### Scenario: Local committed test orders do not become production orders
- **WHEN** bundled repo content includes non-empty `orders.json`
- **THEN** production-like startup does not import those orders into runtime order history

### Requirement: Production-like runtime startup SHALL avoid unsafe silent fallback
The system SHALL avoid silently promoting bundled runtime JSON into production-like storage when mounted runtime data is missing or misconfigured.

#### Scenario: Mounted runtime storage is missing expected files
- **WHEN** the application starts in a production-like environment with mounted runtime storage and one or more files are missing
- **THEN** the system follows an explicit safe initialization policy rather than silently copying unsafe repo state

#### Scenario: Operator can detect runtime bootstrap condition
- **WHEN** production-like startup requires safe initialization or warning behavior
- **THEN** the system emits a detectable signal for operators through logs, errors, or documented startup output

### Requirement: Local development SHALL support private untracked runtime JSON
The system SHALL support a documented local-only runtime data directory pattern so local products and orders can remain outside git-tracked repo files.

#### Scenario: Local developer stores private runtime data outside tracked repo seed files
- **WHEN** a developer configures a local runtime data directory
- **THEN** products, orders, and other mutable JSON state are read from that local-only directory instead of overwriting bundled seed files
