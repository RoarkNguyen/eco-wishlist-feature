import React, { useState } from 'react';
import { Heart, ListOrdered, TrendingUp, Users } from 'lucide-react';
import { WishlistTable } from './components/WishlistTable';
import { WishlistItemsModal } from './components/WishlistItemsModal';
import { ProductStatsTable } from './components/ProductStatsTable';
import { calculateProductStats, calculateTotalRevenuePotential, getTopUsers } from './utils/analytics';
import type { Wishlist, TimeRange } from './types';

// Sample data with more items for better analytics demonstration
const mockWishlists: Wishlist[] = [
  {
    id: "1",
    userId: "user_1",
    createdAt: new Date('2024-02-01'),
    lastModified: new Date('2024-02-01'),
    items: [
      { 
        id: "1", 
        quantity: 2, 
        productId: "prod_1", 
        productVariantId: "var_1",
        price: 99.99,
        addedAt: new Date('2024-02-01'),
        lastModified: new Date('2024-02-01')
      },
      { 
        id: "2", 
        quantity: 1, 
        productId: "prod_2", 
        productVariantId: "var_2",
        price: 149.99,
        addedAt: new Date('2024-02-01'),
        lastModified: new Date('2024-02-01')
      }
    ]
  },
  {
    id: "2",
    userId: "user_2",
    createdAt: new Date('2024-02-15'),
    lastModified: new Date('2024-02-15'),
    items: [
      { 
        id: "3", 
        quantity: 1, 
        productId: "prod_1", 
        productVariantId: "var_1",
        price: 99.99,
        addedAt: new Date('2024-02-15'),
        lastModified: new Date('2024-02-15')
      },
      { 
        id: "4", 
        quantity: 3, 
        productId: "prod_3", 
        productVariantId: "var_3",
        price: 199.99,
        addedAt: new Date('2024-02-15'),
        lastModified: new Date('2024-02-15')
      }
    ]
  },
  {
    id: "3",
    userId: "user_3",
    createdAt: new Date('2024-03-01'),
    lastModified: new Date('2024-03-01'),
    items: [
      { 
        id: "5", 
        quantity: 1, 
        productId: "prod_1", 
        productVariantId: "var_2",
        price: 129.99,
        addedAt: new Date('2024-03-01'),
        lastModified: new Date('2024-03-01')
      },
      { 
        id: "6", 
        quantity: 2, 
        productId: "prod_2", 
        productVariantId: "var_2",
        price: 149.99,
        addedAt: new Date('2024-03-01'),
        lastModified: new Date('2024-03-01')
      }
    ]
  }
];

type TimeRangeOption = '7d' | '30d' | '90d' | 'all';

function App() {
  const [wishlists, setWishlists] = useState<Wishlist[]>(mockWishlists);
  const [selectedWishlist, setSelectedWishlist] = useState<Wishlist | null>(null);
  const [activeTab, setActiveTab] = useState<'wishlists' | 'analytics'>('analytics');
  const [timeRange, setTimeRange] = useState<TimeRangeOption>('all');

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this wishlist?')) {
      setWishlists(wishlists.filter(w => w.id !== id));
    }
  };

  const getTimeRangeFilter = (option: TimeRangeOption): TimeRange | undefined => {
    if (option === 'all') return undefined;
    
    const end = new Date();
    const start = new Date();
    const days = parseInt(option);
    start.setDate(start.getDate() - days);
    
    return { start, end };
  };

  const productStats = calculateProductStats(wishlists, getTimeRangeFilter(timeRange));
  const totalRevenue = calculateTotalRevenuePotential(wishlists);
  const topUsers = getTopUsers(wishlists);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-b border-gray-200 pb-5 mb-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-pink-500 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Wishlist Administration
                </h1>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    activeTab === 'analytics'
                      ? 'bg-pink-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <ListOrdered className="h-5 w-5 mr-2" />
                  Product Analytics
                </button>
                <button
                  onClick={() => setActiveTab('wishlists')}
                  className={`px-4 py-2 rounded-lg ${
                    activeTab === 'wishlists'
                      ? 'bg-pink-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  All Wishlists
                </button>
              </div>
            </div>
          </div>

          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg p-6 shadow">
                <div className="flex items-center">
                  <TrendingUp className="h-6 w-6 text-pink-500 mr-2" />
                  <h3 className="text-lg font-semibold">Revenue Potential</h3>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(totalRevenue)}
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow">
                <div className="flex items-center">
                  <Users className="h-6 w-6 text-pink-500 mr-2" />
                  <h3 className="text-lg font-semibold">Top Users</h3>
                </div>
                <div className="mt-2">
                  {topUsers.slice(0, 3).map((user, index) => (
                    <div key={user.userId} className="flex justify-between items-center mt-1">
                      <span className="text-sm text-gray-600">{user.userId}</span>
                      <span className="text-sm font-semibold">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(user.totalValue)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow">
                <h3 className="text-lg font-semibold mb-2">Time Range</h3>
                <div className="flex space-x-2">
                  {(['7d', '30d', '90d', 'all'] as TimeRangeOption[]).map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-3 py-1 rounded ${
                        timeRange === range
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {range === 'all' ? 'All Time' : `${range}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="bg-white shadow rounded-lg p-6">
            {activeTab === 'analytics' ? (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Top Products in Wishlists
                </h2>
                <ProductStatsTable stats={productStats} />
              </div>
            ) : (
              <WishlistTable
                wishlists={wishlists}
                onDelete={handleDelete}
                onView={setSelectedWishlist}
              />
            )}
          </div>
        </div>
      </div>

      {selectedWishlist && (
        <WishlistItemsModal
          wishlist={selectedWishlist}
          onClose={() => setSelectedWishlist(null)}
        />
      )}
    </div>
  );
}

export default App;