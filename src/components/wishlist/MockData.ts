import { WishlistItem, Category } from '../../types/models';

// Mock categories based on project requirements
export const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Home',
    description: 'Home improvement, furniture, and decor',
    color: 'green',
    createdAt: Date.now() - 1000000
  },
  {
    id: 'cat-2',
    name: 'Car',
    description: 'Vehicles, parts, and accessories',
    color: 'blue',
    createdAt: Date.now() - 900000
  },
  {
    id: 'cat-3',
    name: 'Gear',
    description: 'Electronics, tools, and equipment',
    color: 'purple',
    createdAt: Date.now() - 800000
  },
  {
    id: 'cat-4',
    name: 'Dream',
    description: 'Long-term aspirations and major purchases',
    color: 'orange',
    createdAt: Date.now() - 700000
  },
  {
    id: 'cat-5',
    name: 'Miscellaneous',
    description: 'Other items that don\'t fit in other categories',
    color: 'gray',
    createdAt: Date.now() - 600000
  }
];

// Mock wishlist items matching our categories
export const mockWishlistItems: WishlistItem[] = [
  {
    id: 'item-1',
    name: 'Bitcoin Hardware Wallet',
    description: 'Secure your bitcoin with this premium hardware wallet',
    price: 119.99,
    currency: 'USD',
    satsEquivalent: 195000,
    priority: 'high',
    category: 'cat-3', // Gear
    url: 'https://example.com/wallet',
    imageUrl: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?q=80&w=300',
    createdAt: Date.now() - 500000,
    updatedAt: Date.now() - 500000,
    notes: 'Important for security'
  },
  {
    id: 'item-2',
    name: 'Smart Home Lighting System',
    description: 'Programmable LED lighting system for the entire house',
    price: 349.99,
    currency: 'USD',
    satsEquivalent: 570000,
    priority: 'medium',
    category: 'cat-1', // Home
    url: 'https://example.com/lighting',
    imageUrl: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?q=80&w=300',
    createdAt: Date.now() - 450000,
    updatedAt: Date.now() - 450000,
    notes: 'Wait for sale'
  },
  {
    id: 'item-3',
    name: 'Tesla Model 3',
    description: 'Electric vehicle with autopilot capability',
    price: 42990.00,
    currency: 'USD',
    satsEquivalent: 70000000,
    priority: 'low',
    category: 'cat-2', // Car
    url: 'https://example.com/tesla',
    imageUrl: 'https://images.unsplash.com/photo-1617704548623-340376564e68?q=80&w=300',
    createdAt: Date.now() - 400000,
    updatedAt: Date.now() - 400000,
    notes: 'Long-term savings goal'
  },
  {
    id: 'item-4',
    name: 'Bitcoin Mining Farm',
    description: 'Complete mining operation with solar power',
    price: 125000.00,
    currency: 'USD',
    satsEquivalent: 203000000,
    priority: 'medium',
    category: 'cat-4', // Dream
    url: 'https://example.com/mining-farm',
    imageUrl: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=300',
    createdAt: Date.now() - 350000,
    updatedAt: Date.now() - 350000,
    notes: 'Ultimate goal - research property requirements'
  },
  {
    id: 'item-5',
    name: 'Bitcoin T-Shirt Collection',
    description: 'Various Bitcoin-themed t-shirts',
    price: 89.99,
    currency: 'USD',
    satsEquivalent: 146000,
    priority: 'low',
    category: 'cat-5', // Miscellaneous
    url: 'https://example.com/bitcoin-shirts',
    imageUrl: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=300',
    createdAt: Date.now() - 300000,
    updatedAt: Date.now() - 300000,
    notes: 'Gift ideas'
  }
];