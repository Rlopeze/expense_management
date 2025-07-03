# Santander Module Usage Example

This example demonstrates how to use the Santander module to automatically login and retrieve transactions.

## Step 1: User Registration with Identifier

First, register a user with their Santander identifier:

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "identifier": "00204297746"
  }'
```

## Step 2: Login to Your Application

Login to your application to get a JWT token:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

Response:

```json
{
  "access_token": "your-jwt-token-here"
}
```

## Step 3: Get Transactions with Automatic Login (Recommended)

Now you can retrieve transactions with automatic Santander login by providing your Santander password:

```bash
curl -X POST http://localhost:3000/santander/transactions \
  -H "Authorization: Bearer your-jwt-token-here" \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "your-account-id",
    "fromDate": "2024-01-01",
    "toDate": "2024-12-31",
    "password": "your-santander-password"
  }'
```

## Alternative: Manual Login (Optional)

If you prefer to login manually first, you can still use the separate login endpoint:

```bash
curl -X POST http://localhost:3000/santander/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "00204297746",
    "password": "your-santander-password"
  }'
```

Response:

```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "scope": [
    "NPB",
    "PPC",
    "MPE",
    "SST",
    "ChinChin",
    "bindid_transmit_admin",
    "bindid_biocatch_admin",
    "DEFAULT",
    "CLIENT"
  ]
}
```

Then use the token in the transaction request:

```bash
curl -X POST http://localhost:3000/santander/transactions \
  -H "Authorization: Bearer your-jwt-token-here" \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "your-account-id",
    "fromDate": "2024-01-01",
    "toDate": "2024-12-31",
    "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

## Complete Workflow Script (Automatic Login)

Here's a complete bash script that demonstrates the automatic login workflow:

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

echo "3. Getting transactions with automatic Santander login..."
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

## How Automatic Login Works

1. **User Authentication**: The system verifies your JWT token
2. **Identifier Retrieval**: System looks up your Santander identifier from your user profile
3. **Automatic Santander Login**: System uses your identifier and provided password to login to Santander
4. **Token Acquisition**: System obtains the Santander access token automatically
5. **Transaction Fetching**: System uses the token to fetch your transactions
6. **Response**: Returns the transaction data

## Benefits of Automatic Login

- **Simplified Workflow**: No need for separate login calls
- **Better UX**: Users only need to provide their Santander password once
- **Automatic Token Management**: System handles token acquisition transparently
- **Fallback Support**: Still supports manual token provision if needed

## Error Scenarios

- **Missing Identifier**: If user doesn't have a Santander identifier set
- **Invalid Password**: If Santander password is incorrect
- **Network Issues**: If Santander API is unavailable
- **Authentication Failures**: If JWT token is invalid or expired

## Notes

- The automatic login feature requires the user to have a Santander identifier set in their profile
- The password is only used for Santander authentication and is not stored
- The system automatically handles token expiration and renewal
- You can still use the manual login approach if preferred
