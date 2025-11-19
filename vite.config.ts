import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split React and related libraries into a separate chunk
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Split Chakra UI into a separate chunk
          'chakra-ui': ['@chakra-ui/react', '@emotion/react', '@emotion/styled', 'framer-motion'],
          // Split NOSTR libraries into a separate chunk
          'nostr': ['@nostr-dev-kit/ndk', 'nostr-tools'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase warning limit to 1000 KB
  },
})
