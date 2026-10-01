'use client';

import React, { useMemo } from 'react';
import ProductCard from './ProductCard';
import { Product, ProductFilters } from '../types';
import { Sparkles, PackageOpen } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  filters: ProductFilters;
  whatsappNumber?: string;
  title?: string;
  subtitle?: string;
}

export default function ProductGrid({
  products,
  filters,
  whatsappNumber,
  title,
  subtitle,
}: ProductGridProps) {
  // Apply filtering and sorting
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (filters.category && filters.category !== 'all') {
      result = result.filter((p) => p.category === filters.category);
    }

    // Collection filter
    if (filters.collection) {
      result = result.filter((p) => p.collection === filters.collection);
    }

    // Dress Type filter
    if (filters.dressType) {
      result = result.filter((p) => p.dressType === filters.dressType);
    }

    // Availability filter
    if (filters.availability && filters.availability !== 'all') {
      result = result.filter((p) => p.availability === filters.availability);
    }

    // Age filter
    if (filters.ageId) {
      result = result.filter((p) =>
        p.agePrices?.some((ap) => ap.ageId === filters.ageId && ap.available)
      );
    }

    // Search query
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.dressType?.toLowerCase().includes(q) ||
          p.collection?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (filters.sortBy === 'price-asc') {
      result.sort((a, b) => {
        const minA = Math.min(...(a.agePrices?.filter((p) => p.available).map((p) => p.price) || [0]));
        const minB = Math.min(...(b.agePrices?.filter((p) => p.available).map((p) => p.price) || [0]));
        return minA - minB;
      });
    } else if (filters.sortBy === 'price-desc') {
      result.sort((a, b) => {
        const maxA = Math.max(...(a.agePrices?.filter((p) => p.available).map((p) => p.price) || [0]));
        const maxB = Math.max(...(b.agePrices?.filter((p) => p.available).map((p) => p.price) || [0]));
        return maxB - maxA;
      });
    } else if (filters.sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      // Featured first
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [products, filters]);

  return (
    <section className="py-6">
      {(title || subtitle) && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            {title && (
              <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight flex items-center gap-2">
                <span>{title}</span>
                <Sparkles className="w-5 h-5 text-gold-500 fill-gold-500" />
              </h2>
            )}
            {subtitle && <p className="text-sm text-charcoal-600 mt-1">{subtitle}</p>}
          </div>
          <div className="text-xs font-semibold text-charcoal-500">
            Showing <span className="text-charcoal-900 font-bold">{filteredProducts.length}</span> curated outfits
          </div>
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-white/60 border border-cream-200 shadow-soft max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-cream-200 flex items-center justify-center mx-auto mb-4 text-3xl">
            🧸
          </div>
          <h3 className="text-lg font-bold text-charcoal-900">No Outfits Found</h3>
          <p className="text-sm text-charcoal-500 mt-1 max-w-xs mx-auto">
            Try adjusting your search criteria or resetting filters to see more adorable baby clothing.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id || product.slug}
              product={product}
              whatsappNumber={whatsappNumber}
            />
          ))}
        </div>
      )}
    </section>
  );
}
