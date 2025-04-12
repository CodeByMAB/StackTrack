# StackTrack

A Bitcoin-focused progressive web app for tracking your wishlist items and saving in sats. Built with React, TypeScript, and Chakra UI.

## Features

- Track items you wish to purchase denominated in sats
- Offline-first capability with localStorage persistence
- NOSTR login for identity management
- Bitcoin price tracking
- Beautiful dark/light mode with full responsiveness
- Full wishlist management (add, edit, delete items)

## Technologies

- React 19 + TypeScript
- Vite 6
- Chakra UI for component styling
- NOSTR integration via NDK
- Bitcoin Treasury API for price data
- Offline-capable with graceful degradation

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Testing Offline Functionality

StackTrack is designed to work offline. You can test this functionality in several ways:

1. **Test with no connection**: Turn off your network connection and continue using the app.

2. **Dummy Login**: If you don't have a Nostr key or can't connect to Nostr relays, open your browser console and paste the following to create a dummy test login:

```javascript
// Run this script in the browser console for dummy test login
const dummyPubkey = "npub1" + Array.from({length: 30}, () => 
  "0123456789abcdef"[Math.floor(Math.random() * 16)]).join('');

const dummyProfile = {
  name: "Test Stacker",
  about: "This is a test account for StackTrack development",
  picture: "https://api.dicebear.com/7.x/bottts/svg?seed=stacktrack"
};

// Store in localStorage 
localStorage.setItem('nostr_pubkey', dummyPubkey);
localStorage.setItem('nostr_profile', JSON.stringify(dummyProfile));
console.log('Test login created! Refresh the page to use it.');
```

3. **Dummy Bitcoin Price**: To test the Bitcoin price component with a static value:

```javascript
localStorage.setItem('stacktrack_bitcoin_price', JSON.stringify({
  usd: 62345.78,
  timestamp: Date.now() - 1000 * 60 * 20  // 20 minutes ago (expired)
}));
console.log('Dummy bitcoin price set in localStorage');
```

## Security Features

- Private keys are never stored anywhere
- Only public keys and minimal profile data are stored in localStorage
- Input sanitization prevents XSS and data injection
- Offline-first approach reduces network exposure

## License

[MIT License](LICENSE)
