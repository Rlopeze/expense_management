# 🔐 Santander Token Scraper

This module provides automated web scraping functionality to extract the `bsch_t` token from Santander Chile's website.

## 🚀 Features

- **Automated Login**: Automatically logs into Santander Chile using provided credentials
- **Token Extraction**: Extracts the `bsch_t` token from browser cookies
- **Session Support**: Can extract tokens from existing browser sessions
- **Error Handling**: Comprehensive error handling and logging
- **Flexible Selectors**: Multiple selector strategies for different page layouts

## 📋 API Endpoints

### 1. Extract Token with Credentials

```http
POST /santander/scraper/extract-token
Content-Type: application/json

{
  "username": "your_santander_username",
  "password": "your_santander_password"
}
```

**Response:**

```json
{
  "success": true,
  "token": "extracted_bsch_t_token",
  "message": "Token extracted successfully"
}
```

### 2. Extract Token from Existing Session

```http
GET /santander/scraper/extract-from-session
```

**Response:**

```json
{
  "success": true,
  "token": "extracted_bsch_t_token",
  "message": "Token extracted from existing session"
}
```

## 🛠️ Usage Examples

### Using cURL

```bash
# Extract token with credentials
curl -X POST http://localhost:3000/santander/scraper/extract-token \
  -H "Content-Type: application/json" \
  -d '{
    "username": "your_username",
    "password": "your_password"
  }'

# Extract from existing session
curl http://localhost:3000/santander/scraper/extract-from-session
```

### Using JavaScript/Node.js

```javascript
const axios = require('axios');

// Extract token with credentials
const response = await axios.post(
  'http://localhost:3000/santander/scraper/extract-token',
  {
    username: 'your_username',
    password: 'your_password',
  },
);

console.log('Token:', response.data.token);

// Extract from existing session
const sessionResponse = await axios.get(
  'http://localhost:3000/santander/scraper/extract-from-session',
);
console.log('Session Token:', sessionResponse.data.token);
```

## 🔧 Configuration

### Browser Settings

The scraper uses Puppeteer with the following configuration:

```typescript
{
  headless: false, // Set to true for production
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--no-zygote',
    '--disable-gpu'
  ]
}
```

### User Agent

The scraper uses a realistic Chrome user agent to avoid detection:

```
Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36
```

## 🧪 Testing

Use the provided test script:

```bash
# Install dependencies
npm install axios

# Run the test script
node scripts/test-scraper.js
```

## ⚠️ Important Notes

### Security

- **Never commit real credentials** to version control
- Store credentials securely (environment variables, secure vaults)
- Use HTTPS in production
- Consider rate limiting to avoid being blocked

### Legal Considerations

- Ensure you have permission to scrape Santander's website
- Respect the website's robots.txt and terms of service
- Consider using official APIs when available

### Technical Limitations

- The scraper may break if Santander changes their website structure
- Captcha or 2FA may prevent automated login
- Network issues can cause timeouts
- Browser automation can be detected and blocked

## 🔍 Troubleshooting

### Common Issues

1. **"Could not find login form fields"**
   - Santander may have changed their login page structure
   - Check if the selectors need updating

2. **"bsch_t token not found"**
   - Login may have failed
   - Token might be stored under a different name
   - Check the returned cookies for alternative tokens

3. **"Timeout errors"**
   - Network connection issues
   - Santander's website is slow
   - Increase timeout values

4. **"Browser detection"**
   - Santander may be blocking automated browsers
   - Try different user agents
   - Consider using stealth plugins

### Debug Mode

Set `headless: false` to see the browser in action and debug issues.

## 📝 Logging

The scraper provides detailed logging:

- Navigation steps
- Form field detection
- Cookie extraction
- Error details

Check your application logs for detailed information.

## 🔄 Integration with Santander Service

You can integrate the scraper with your existing Santander service:

```typescript
// In your SantanderService
constructor(
  private readonly scraperService: SantanderScraperService,
) {}

async getTransactions(requestDto: TransactionRequestDto): Promise<MovementResponseDto> {
  // Extract token automatically
  const result = await this.scraperService.extractToken({
    username: requestDto.username,
    password: requestDto.password
  });

  if (!result.success) {
    throw new Error('Failed to extract token');
  }

  // Use the extracted token
  const token = result.token;
  // ... rest of your API call logic
}
```
