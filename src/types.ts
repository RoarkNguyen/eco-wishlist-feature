export interface WishlistItem {
  id: string;
  quantity: number;
  productId: string;
  productVariantId: string;
  addedAt: Date;
  lastModified: Date;
  price: number;
}

export interface Wishlist {
  id: string;
  items: WishlistItem[];
  createdAt: Date;
  lastModified: Date;
  userId: string;
}

export interface ProductStats {
  productId: string;
  totalWishlists: number;
  totalQuantity: number;
  totalValue: number;
  variants: {
    variantId: string;
    totalWishlists: number;
    totalQuantity: number;
    totalValue: number;
  }[];
  trend: {
    date: Date;
    count: number;
  }[];
}

export interface TimeRange {
  start: Date;
  end: Date;
}