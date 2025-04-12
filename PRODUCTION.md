# StackTrack Production Setup Guide

This document outlines the steps needed to properly set up the StackTrack application for production deployment.

## 1. Bitcoin Price API Integration

The application is already configured to use Block's Bitcoin price API:
```javascript
const BLOCK_BITCOIN_PRICE_API_URL = 'https://pricing.bitcoin.block.xyz/current-price';
```

This endpoint is publicly accessible and does not require an API key. It returns data in the format:
```json
{ "USD": 12345.67 }
```

## 2. External API Integration

The application currently has MOCK implementations of several external APIs:
- Amazon product search
- Etsy product search
- eBay product search
- Zillow property search

For production use, **you must implement secure API access**:

### Option A: Backend Proxy (Recommended)
1. Create a simple backend proxy (using Node.js, Express, Netlify Functions, etc.)
2. Make all API calls through your backend to avoid exposing API keys in frontend code
3. Set up proper CORS headers and rate limiting
4. Implement proper caching to reduce API usage

### Option B: Environment Variables 
1. Use environment variables with Vite (.env.local file)
2. Implement backend validation for any APIs requiring authorization
3. Understand that client-side API keys are never fully secure

## 3. Nostr Login Implementation 

The application includes multiple Nostr login methods:
- nsec (private key login) - ✅ Working
- nos2x extension - ✅ Working
- Alby extension - ✅ Working 
- Nostr Wallet Connect (NWC) - ❌ Incomplete

Before going live, implement a real NWC connection by following these steps:
1. Add proper connection code using nostr-tools
2. Handle NWC connection errors
3. Store connection info securely
4. See [NWC documentation](https://nwc.getalby.com/v1/demo) for implementation details

## 4. Data Storage

For production use, switch from localStorage to IndexedDB for better offline support:

1. Use the existing IndexedDBService.ts file
2. Update Dashboard.tsx to load wishlist items from IndexedDB instead of localStorage
3. Update all data save operations to use IndexedDB
4. Consider adding a data export/import feature for user backup

## 5. Securing API Keys and Environment Variables

Never expose API keys in your frontend code:

1. Copy `.env.example` to `.env.local` 
2. Add your real API keys to `.env.local`
3. Make sure `.env.local` is in your `.gitignore` file
4. For production, set environment variables on your hosting platform

## 6. Building for Production

Run the production build:

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Test the production build locally
npm run preview
```

The production build will be created in the `dist` directory.

## 7. Deployment Checklist

Before deploying to production:

- [ ] Remove all mock data and testing code (search for warning comments)
- [ ] Implement proper error handling for API failures
- [ ] Test all login methods thoroughly
- [ ] Verify offline functionality works as expected
- [ ] Add proper analytics and error logging
- [ ] Ensure all API keys are secured properly
- [ ] Set up environment variables on your hosting platform
- [ ] Configure proper security headers

## 8. Production Hosting

Deploy the `dist` directory to your preferred hosting platform:

- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

For optimal performance, configure:
- Caching headers for static assets
- Compression (Brotli or Gzip)
- CDN distribution
- HTTPS enforcement