/**
 * SecurityService
 * Provides security utilities for StackTrack application
 * 
 * IMPORTANT: This code is open source. It follows security best practices for
 * client-side applications, but remember that all client-side code can be
 * inspected and modified by users. No sensitive data should ever be stored
 * or processed on the client side in a way that assumes the client is trusted.
 */

// Time for authentication token expiration (1 week)
export const AUTH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000;

// Security-critical storage keys
const SECURE_KEYS = [
  'nostr_pubkey',
  'nostr_profile',
  'nostr_login_method'
];

/**
 * Security Service for managing authentication, data protection, and privacy
 */
export const SecurityService = {
  /**
   * Check if the user is authenticated via Nostr
   * @returns True if authenticated, false otherwise
   */
  isAuthenticated: (): boolean => {
    const pubkey = localStorage.getItem('nostr_pubkey');
    const authTimestamp = localStorage.getItem('nostr_auth_timestamp');
    
    if (!pubkey || !authTimestamp) {
      return false;
    }
    
    // Check if authentication has expired
    const timestamp = parseInt(authTimestamp, 10);
    if (isNaN(timestamp) || Date.now() - timestamp > AUTH_TOKEN_EXPIRY) {
      // Clear expired auth data
      SecurityService.clearAuthData();
      return false;
    }
    
    return true;
  },
  
  /**
   * Update the authentication timestamp to extend the session
   */
  refreshAuthentication: (): void => {
    if (SecurityService.isAuthenticated()) {
      localStorage.setItem('nostr_auth_timestamp', Date.now().toString());
    }
  },
  
  /**
   * Clear all authentication data
   */
  clearAuthData: (): void => {
    SECURE_KEYS.forEach(key => {
      localStorage.removeItem(key);
    });
    localStorage.removeItem('nostr_auth_timestamp');
  },
  
  /**
   * Sanitize user input to prevent XSS attacks
   * @param input The input to sanitize
   * @returns Sanitized input
   */
  sanitizeInput: (input: string): string => {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  },
  
  /**
   * Sanitize a URL to prevent javascript: protocol attacks
   * @param url The URL to sanitize
   * @returns A sanitized URL or empty string if invalid
   */
  sanitizeUrl: (url: string): string => {
    if (!url) return '';
    
    try {
      const urlObj = new URL(url);
      // Block potentially dangerous URL protocols
      const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
      if (dangerousProtocols.some(protocol => urlObj.protocol.startsWith(protocol))) {
        console.warn('Blocked potentially dangerous URL:', url);
        return '';
      }
      return url;
    } catch (e) {
      // If it's not a valid URL, return empty string
      return '';
    }
  },
  
  /**
   * Detect if the app is running in private browsing mode
   * @returns Promise that resolves to true if in private mode
   */
  isPrivateBrowsing: async (): Promise<boolean> => {
    return new Promise(resolve => {
      const testKey = 'stacktrack-private-test';
      try {
        localStorage.setItem(testKey, '1');
        localStorage.removeItem(testKey);
        resolve(false);
      } catch (e) {
        resolve(true);
      }
    });
  },
  
  /**
   * Check if the app is running in a secure context (HTTPS)
   * @returns True if secure, false otherwise
   */
  isSecureContext: (): boolean => {
    return window.isSecureContext;
  },
  
  /**
   * Enable privacy mode which hides sensitive information on the UI
   * @param enable Whether to enable privacy mode
   */
  enablePrivacyMode: (enable: boolean): void => {
    localStorage.setItem('stacktrack_privacy_mode', enable.toString());
    
    // Add a class to the document body for CSS to handle privacy-sensitive elements
    if (enable) {
      document.body.classList.add('privacy-mode');
    } else {
      document.body.classList.remove('privacy-mode');
    }
  },
  
  /**
   * Check if privacy mode is enabled
   * @returns True if privacy mode is enabled
   */
  isPrivacyModeEnabled: (): boolean => {
    return localStorage.getItem('stacktrack_privacy_mode') === 'true';
  },
  
  /**
   * Generate a secure random ID for client-side use only
   * This is NOT cryptographically secure enough for sensitive operations,
   * but is suitable for generating IDs for UI elements or local storage.
   * 
   * @returns A random ID
   */
  generateId: (): string => {
    // Use crypto.getRandomValues when available for better randomness
    if (window.crypto && window.crypto.getRandomValues) {
      const arr = new Uint8Array(8);
      window.crypto.getRandomValues(arr);
      return Array.from(arr)
        .map(n => n.toString(16).padStart(2, '0'))
        .join('');
    }
    
    // Fallback to Math.random (less secure but still usable for non-sensitive IDs)
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  },
  
  /**
   * Validate that a string doesn't contain potentially malicious content
   * @param input String to validate
   * @returns True if safe, false if potentially unsafe
   */
  validateSafeString: (input: string): boolean => {
    if (!input) return true;
    
    // Check for script tags, iframes, and other potentially harmful HTML
    const dangerousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /<img[^>]+onerror\s*=\s*[^>]+>/gi,
      /javascript:/gi,
      /data:text\/html/gi
    ];
    
    return !dangerousPatterns.some(pattern => pattern.test(input));
  },
  
  /**
   * Verify Content Security Policy compliance
   * This helps identify if the CSP is properly configured
   * @returns Object with CSP status information
   */
  verifyCspCompliance: (): { enabled: boolean, policy: string | null } => {
    // Check if CSP is enabled by looking for the meta tag or HTTP header
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    const cspContent = cspMeta ? cspMeta.getAttribute('content') : null;
    
    return {
      enabled: !!cspContent || !!document.contentSecurityPolicy,
      policy: cspContent || document.contentSecurityPolicy || null
    };
  },
  
  /**
   * Report a security issue to the console (in a real app, would report to a server)
   * @param issue Description of the security issue
   * @param data Optional data related to the issue
   */
  reportSecurityIssue: (issue: string, data?: any): void => {
    console.warn('Security Issue Detected:', issue, data);
    
    // In a production app, you might want to log this to a secure endpoint
    // if (SecurityService.isSecureContext()) {
    //   fetch('/api/security-report', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ issue, data, timestamp: Date.now() })
    //   }).catch(err => console.error('Failed to report security issue:', err));
    // }
  }
};