# Santander Module

This module provides integration with Santander's Open Banking API to retrieve transaction data.

## Features

- POST endpoint to login to Santander and obtain access tokens
- POST endpoint to fetch transactions from Santander accounts with automatic login
- JWT authentication required for transaction endpoints
- Proper error handling and response transformation
- User identifier field for Santander authentication
- Automatic Santander login when password is provided in transaction request

## Environment Variables

The following environment variables need to be set:

- `SANTANDER_CLIENT_ID`: The Santander client ID (optional, has default value)
- `SANTANDER_ACCESS_TOKEN`: The Bearer token for authentication (optional if using automatic login)

## API Endpoints

### POST /santander/login

Authenticates with Santander using identifier and password to obtain an access token.

**Request Body:**

```json
{
  "identifier": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "accessToken": "string",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "scope": ["NPB", "PPC", "MPE", "SST"]
}
```

### POST /santander/transactions

Fetches transactions from a Santander account. This endpoint can automatically login to Santander if a password is provided.

**Headers:**

- Authorization: Bearer {JWT_TOKEN}

**Request Body:**

```json
{
  "accountId": "string",
  "fromDate": "2024-01-01", // optional
  "toDate": "2024-12-31", // optional
  "transactionType": "string", // optional
  "password": "string", // optional - Santander password for automatic login
  "accessToken": "string" // optional - Santander access token (alternative to password)
}
```

**Response:**

```json
{
  "transactions": [
    {
      "transactionId": "string",
      "accountId": "string",
      "amount": 1000,
      "currency": "CLP",
      "description": "Transaction description",
      "transactionDate": "2024-01-01T00:00:00Z",
      "transactionType": "DEBIT",
      "balance": 5000
    }
  ],
  "totalCount": 1,
  "hasMore": false
}
```

## User Model Updates

The User entity now includes an `identifier` field that can be used for Santander authentication:

```typescript
@Entity()
export class User {
  // ... existing fields
  @Column({ nullable: true })
  identifier?: string;
}
```

## Usage Examples

### 1. Login to Santander (Manual)

```bash
curl -X POST http://localhost:3000/santander/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "your-santander-identifier",
    "password": "your-santander-password"
  }'
```

### 2. Get Transactions with Automatic Login (Recommended)

```bash
curl -X POST http://localhost:3000/santander/transactions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "your-account-id",
    "fromDate": "2024-01-01",
    "toDate": "2024-12-31",
    "password": "your-santander-password"
  }'
```

### 3. Get Transactions (using environment token)

```bash
curl -X POST http://localhost:3000/santander/transactions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "your-account-id",
    "fromDate": "2024-01-01",
    "toDate": "2024-12-31"
  }'
```

### 4. Get Transactions (using manual login token)

```bash
# First login to get token
LOGIN_RESPONSE=$(curl -X POST http://localhost:3000/santander/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "your-santander-identifier",
    "password": "your-santander-password"
  }')

# Extract token and use it for transactions
SANTANDER_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.accessToken')

curl -X POST http://localhost:3000/santander/transactions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "your-account-id",
    "accessToken": "'$SANTANDER_TOKEN'"
  }'
```

## Automatic Login Workflow

The transaction endpoint now supports automatic Santander login:

1. **User Authentication**: User must be authenticated with JWT token
2. **Identifier Lookup**: System retrieves user's Santander identifier from database
3. **Automatic Login**: If password is provided, system automatically logs in to Santander
4. **Token Usage**: Uses the obtained token to fetch transactions
5. **Fallback**: Falls back to environment token if no password provided

## Complete Workflow Script

Here's a complete bash script that demonstrates the full workflow:

```bash
#!/bin/bash

# Configuration
API_BASE="http://localhost:3000"
EMAIL="user@example.com"
PASSWORD="password123"
SANTANDER_PASSWORD="your-santander-password"
ACCOUNT_ID="your-account-id"

echo "1. Registering user..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\",
    \"firstName\": \"John\",
    \"lastName\": \"Doe\",
    \"identifier\": \"00204297746\"
  }")

echo "2. Logging in to application..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\"
  }")

JWT_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token')

echo "3. Getting transactions with automatic login..."
TRANSACTIONS_RESPONSE=$(curl -s -X POST "$API_BASE/santander/transactions" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"accountId\": \"$ACCOUNT_ID\",
    \"fromDate\": \"2024-01-01\",
    \"toDate\": \"2024-12-31\",
    \"password\": \"$SANTANDER_PASSWORD\"
  }")

echo "Transactions:"
echo $TRANSACTIONS_RESPONSE | jq '.'
```

## Error Handling

The module handles various error scenarios:

- Missing or invalid authentication credentials
- User identifier not found in database
- Santander API errors
- Network connectivity issues
- Invalid request data
- Login failures

All errors are properly formatted and include appropriate HTTP status codes.

## Workflow

1. **User Registration**: Users provide their Santander identifier during registration
2. **Application Login**: Users login to your app to get JWT token
3. **Transaction Retrieval**: Use the transaction endpoint with password for automatic Santander login
4. **Alternative**: Use manual login endpoint to get token first, then use token in transaction request
