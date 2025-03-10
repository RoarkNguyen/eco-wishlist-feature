import React from 'react';
import { ChevronDown, ChevronRight, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import type { ProductStats } from '../types';

interface ProductStatsTableProps {
  stats: ProductStats[];
}

export function ProductStatsTable({ stats }: ProductStatsTableProps) {
  const [expandedProducts, setExpandedProducts] = React.useState<Set<string>>(new Set());
  const [selectedProduct, setSelectedProduct] = React.useState<string | null>(null);

  const toggleProduct = (productId: string) => {
    const newExpanded = new Set(expandedProducts);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
      setSelectedProduct(null);
    } else {
      newExpanded.add(productId);
      setSelectedProduct(productId);
    }
    setExpandedProducts(newExpanded);
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Wishlists
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Value
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stats.map((product) => (
              <React.Fragment key={product.productId}>
                <tr 
                  className="hover:bg-gray-50 cursor-pointer" 
                  onClick={() => toggleProduct(product.productId)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center">
                      {expandedProducts.has(product.productId) ? (
                        <ChevronDown size={16} className="mr-2" />
                      ) : (
                        <ChevronRight size={16} className="mr-2" />
                      )}
                      {product.productId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.totalWishlists}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.totalQuantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(product.totalValue)}
                  </td>
                </tr>
                {expandedProducts.has(product.productId) && (
                  <>
                    <tr>
                      <td colSpan={4} className="px-6 py-4 bg-gray-50">
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={product.trend}>
                              <XAxis
                                dataKey="date"
                                tickFormatter={(date) => format(new Date(date), 'MM/dd')}
                              />
                              <YAxis />
                              <Tooltip
                                labelFormatter={(date) =>
                                  format(new Date(date), 'MMM dd, yyyy')
                                }
                              />
                              <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#EC4899"
                                strokeWidth={2}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </td>
                    </tr>
                    {product.variants.map((variant) => (
                      <tr key={variant.variantId} className="bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 pl-12">
                          {variant.variantId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {variant.totalWishlists}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {variant.totalQuantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(variant.totalValue)}
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {selectedProduct && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-5 w-5 text-pink-500 mr-2" />
            <h3 className="text-lg font-semibold">Trend Analysis</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Product performance over time
          </p>
        </div>
      )}
    </div>
  );
}