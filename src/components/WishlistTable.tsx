import React from 'react';
import { Trash2, Eye } from 'lucide-react';
import type { Wishlist } from '../types';

interface WishlistTableProps {
  wishlists: Wishlist[];
  onDelete: (id: string) => void;
  onView: (wishlist: Wishlist) => void;
}

export function WishlistTable({ wishlists, onDelete, onView }: WishlistTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Items Count
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {wishlists.map((wishlist) => (
            <tr key={wishlist.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {wishlist.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {wishlist.items.length}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onView(wishlist)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Eye size={20} />
                  </button>
                  <button
                    onClick={() => onDelete(wishlist.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}