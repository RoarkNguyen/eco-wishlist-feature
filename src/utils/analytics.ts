import { startOfDay, eachDayOfInterval, format } from 'date-fns';
import type { Wishlist, ProductStats, TimeRange } from '../types';

export function calculateProductStats(
  wishlists: Wishlist[],
  timeRange?: TimeRange
): ProductStats[] {
  const productMap = new Map<string, {
    totalWishlists: Set<string>;
    totalQuantity: number;
    totalValue: number;
    variants: Map<string, {
      totalWishlists: Set<string>;
      totalQuantity: number;
      totalValue: number;
    }>;
    dailyCounts: Map<string, number>;
  }>();

  const filteredWishlists = timeRange
    ? wishlists.filter(w => w.createdAt >= timeRange.start && w.createdAt <= timeRange.end)
    : wishlists;

  // Calculate statistics
  filteredWishlists.forEach(wishlist => {
    wishlist.items.forEach(item => {
      // Get or create product stats
      if (!productMap.has(item.productId)) {
        productMap.set(item.productId, {
          totalWishlists: new Set(),
          totalQuantity: 0,
          totalValue: 0,
          variants: new Map(),
          dailyCounts: new Map(),
        });
      }
      const productStats = productMap.get(item.productId)!;
      
      // Update product stats
      productStats.totalWishlists.add(wishlist.id);
      productStats.totalQuantity += item.quantity;
      productStats.totalValue += item.price * item.quantity;

      // Update daily counts
      const dateKey = format(item.addedAt, 'yyyy-MM-dd');
      productStats.dailyCounts.set(
        dateKey,
        (productStats.dailyCounts.get(dateKey) || 0) + 1
      );

      // Get or create variant stats
      if (!productStats.variants.has(item.productVariantId)) {
        productStats.variants.set(item.productVariantId, {
          totalWishlists: new Set(),
          totalQuantity: 0,
          totalValue: 0,
        });
      }
      const variantStats = productStats.variants.get(item.productVariantId)!;

      // Update variant stats
      variantStats.totalWishlists.add(wishlist.id);
      variantStats.totalQuantity += item.quantity;
      variantStats.totalValue += item.price * item.quantity;
    });
  });

  // Generate trend data for the time range
  const dateRange = timeRange
    ? eachDayOfInterval({ start: timeRange.start, end: timeRange.end })
    : eachDayOfInterval({
        start: new Date(Math.min(...wishlists.map(w => w.createdAt.getTime()))),
        end: new Date(),
      });

  // Convert to array and sort by total wishlists (descending)
  return Array.from(productMap.entries())
    .map(([productId, stats]) => ({
      productId,
      totalWishlists: stats.totalWishlists.size,
      totalQuantity: stats.totalQuantity,
      totalValue: stats.totalValue,
      variants: Array.from(stats.variants.entries())
        .map(([variantId, variantStats]) => ({
          variantId,
          totalWishlists: variantStats.totalWishlists.size,
          totalQuantity: variantStats.totalQuantity,
          totalValue: variantStats.totalValue,
        }))
        .sort((a, b) => b.totalWishlists - a.totalWishlists),
      trend: dateRange.map(date => ({
        date,
        count: stats.dailyCounts.get(format(date, 'yyyy-MM-dd')) || 0,
      })),
    }))
    .sort((a, b) => b.totalWishlists - a.totalWishlists);
}

export function calculateTotalRevenuePotential(wishlists: Wishlist[]): number {
  return wishlists.reduce(
    (total, wishlist) =>
      total +
      wishlist.items.reduce(
        (subtotal, item) => subtotal + item.price * item.quantity,
        0
      ),
    0
  );
}

export function getTopUsers(wishlists: Wishlist[]): { userId: string; totalValue: number }[] {
  const userStats = new Map<string, number>();

  wishlists.forEach(wishlist => {
    const userTotal = wishlist.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    userStats.set(
      wishlist.userId,
      (userStats.get(wishlist.userId) || 0) + userTotal
    );
  });

  return Array.from(userStats.entries())
    .map(([userId, totalValue]) => ({ userId, totalValue }))
    .sort((a, b) => b.totalValue - a.totalValue);
}