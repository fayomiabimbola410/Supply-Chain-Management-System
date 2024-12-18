# Supply Chain Management System

## Overview
The **Supply Chain Management System** is a smart contract-based solution designed to streamline the management of supply chain operations and product quality assurance. The system is implemented in Clarity, leveraging its secure and predictable nature.

## Features
### Product Quality Management
- Add ratings for products.
- Validate ratings with a range of 1 to 5.
- Retrieve the average rating for a product.
- Get the total number of ratings for a product.

### Supply Chain Management
- Register new products with a unique ID.
- Update the status of a product (e.g., "shipped," "delivered").
- Transfer ownership of a product to a new owner.
- Retrieve product details by ID.
- Get the total count of registered products.

## Project Structure
```
.
├── contracts
│   ├── product-quality.clar   # Handles product quality ratings
│   └── supply-chain.clar      # Manages supply chain operations
├── tests
│   ├── product-quality.test.ts  # Unit tests for product-quality contract
│   └── supply-chain.test.ts     # Unit tests for supply-chain contract
├── .cache                      # Cache directory for build artifacts
└── Clarinet.toml               # Project configuration
```

## Contracts
### Product Quality Contract (`contracts/product-quality.clar`)
- **Constants:**
  - `contract-owner`: Deployer of the contract.
  - `err-unauthorized`: Error code for unauthorized actions.
  - `err-invalid-rating`: Error code for invalid ratings.
- **Functions:**
  - `add-rating(product-id, rating)`: Add a rating to a product.
  - `get-average-rating(product-id)`: Get the average rating of a product.
  - `get-rating-count(product-id)`: Get the number of ratings for a product.

### Supply Chain Contract (`contracts/supply-chain.clar`)
- **Constants:**
  - `contract-owner`: Deployer of the contract.
  - `err-unauthorized`: Error code for unauthorized actions.
  - `err-not-found`: Error code for missing products.
- **Functions:**
  - `add-product(name)`: Add a new product.
  - `update-status(product-id, new-status)`: Update the status of a product.
  - `transfer-ownership(product-id, new-owner)`: Transfer ownership of a product.
  - `get-product(product-id)`: Get details of a product.
  - `get-product-count()`: Get the total number of products.

## Testing
The project includes unit tests written in TypeScript using the [Clarinet](https://github.com/hirosystems/clarinet) framework.

### Running Tests
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the tests:
   ```bash
   npm run test
   ```

### Test Coverage
- Validate correct functionality of all public and read-only functions.
- Ensure proper error handling for invalid inputs and unauthorized actions.

## Configuration
### Clarinet Configuration (`Clarinet.toml`)
- Defines contract paths and telemetry settings.
- Configures REPL analysis for input validation and safety checks.

### REPL Analysis Settings
- `trusted_sender`: Ensures inputs are trusted after verifying the transaction sender.
- `trusted_caller`: Ensures inputs are trusted after verifying the contract caller.
- `callee_filter`: Filters untrusted data passed into private functions.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

