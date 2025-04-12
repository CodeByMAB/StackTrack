import { WishlistItem, Category } from '../../types/models';

// Mock categories
export const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Electronics',
    description: 'Gadgets and electronic devices',
    color: 'blue',
    createdAt: Date.now() - 1000000
  },
  {
    id: 'cat-2',
    name: 'Home',
    description: 'Home improvement and decor',
    color: 'green',
    createdAt: Date.now() - 900000
  },
  {
    id: 'cat-3',
    name: 'Books',
    description: 'Books and educational resources',
    color: 'purple',
    createdAt: Date.now() - 800000
  },
  {
    id: 'cat-4',
    name: 'Travel',
    description: 'Travel gear and accessories',
    color: 'orange',
    createdAt: Date.now() - 700000
  }
];

// Mock wishlist items
export const mockWishlistItems: WishlistItem[] = [
  {
    id: 'item-1',
    name: 'Bitcoin Hardware Wallet',
    description: 'Secure your bitcoin with this premium hardware wallet',
    price: 119.99,
    currency: 'USD',
    satsEquivalent: 195000,
    priority: 'high',
    category: 'cat-1',
    url: 'https://example.com/wallet',
    imageUrl: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?q=80&w=300',
    createdAt: Date.now() - 500000,
    updatedAt: Date.now() - 500000,
    notes: 'Important for security'
  },
  {
    id: 'item-2',
    name: 'Bitcoin Standard Book',
    description: 'The Bitcoin Standard: The Decentralized Alternative to Central Banking',
    price: 24.99,
    currency: 'USD',
    satsEquivalent: 40800,
    priority: 'medium',
    category: 'cat-3',
    url: 'https://example.com/book',
    imageUrl: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=300',
    createdAt: Date.now() - 400000,
    updatedAt: Date.now() - 400000,
    notes: 'Recommended by friends'
  },
  {
    id: 'item-3',
    name: 'Bitcoin T-Shirt',
    description: 'Cool Bitcoin logo t-shirt in black',
    price: 29.99,
    currency: 'USD',
    satsEquivalent: 49000,
    priority: 'low',
    category: 'cat-4',
    url: 'https://example.com/tshirt',
    imageUrl: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=300',
    createdAt: Date.now() - 300000,
    updatedAt: Date.now() - 300000,
  },
  {
    id: 'item-4',
    name: 'Mining Setup Components',
    description: 'Parts needed for a small mining operation',
    price: 1299.99,
    currency: 'USD',
    satsEquivalent: 2120000,
    priority: 'medium',
    category: 'cat-1',
    url: 'https://example.com/mining',
    createdAt: Date.now() - 200000,
    updatedAt: Date.now() - 200000,
    notes: 'Research more efficient models first'
  }
];