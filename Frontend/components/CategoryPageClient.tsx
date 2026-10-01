'use client';

import React, { useState, useEffect } from 'react';
import FilterBar from './FilterBar';
import ProductGrid from './ProductGrid';
import { Product, AgeOption, Collection, ProductFilters, Category } from '../types';
import { Sparkles } from 'lucide-react';
import { fetchProducts } from '../lib/api';

interface CategoryPageClientProps {
  category: Category;
  initialProducts: Product[];
  ages: AgeOption[];
  collections: Collection[];
  whatsappNumber: string;
}

export default function CategoryPageClient({
  category,
  initialProducts,
  ages,
  collections,
  whatsappNumber,
}: CategoryPageClientProps) {
  const isBoys = category === 'boys';

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filters, setFilters] = useState<ProductFilters>({
    category,
    collection: '',
    dressType: '',
    availability: 'all',
    ageId: '',
    search: '',
    sortBy: 'featured',
  });

  // Live Sync
  useEffect(() => {
    let isMounted = true;
    const syncCategoryProducts = async () => {
      try {
        const fresh = await fetchProducts({ category });
        if (fresh && fresh.length > 0 && isMounted) {
          setProducts(fresh);
        }
      } catch (e) {
        // silently fallback
      }
    };

    const handleFocus = () => syncCategoryProducts();
    window.addEventListener('focus', handleFocus);
    const interval = setInterval(syncCategoryProducts, 3000);

    return () => {
      isMounted = false;
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [category]);

  const dressTypes = Array.from(
    new Set(
      products
        .filter((p) => p.category === category)
        .map((p) => p.dressType)
        .filter(Boolean)
    )
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Category Hero Banner */}
      <div
        className={`rounded-4xl p-8 sm:p-12 border shadow-soft flex flex-col md:flex-row items-center justify-between gap-6 ${
          isBoys
            ? 'bg-gradient-baby-boy border-blue-100'
            : 'bg-gradient-baby-girl border-pink-100'
        }`}
      >
        <div className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 text-xs font-bold uppercase tracking-wider shadow-sm">
            <span className="text-sm">{isBoys ? '👦' : '👧'}</span>
            <span>{isBoys ? 'Little Gentleman Collection' : 'Little Princess Collection'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-charcoal-900 tracking-tight">
            {isBoys ? 'Baby Boys Wardrobe' : 'Baby Girls Wardrobe'}
          </h1>
          <p className="text-charcoal-600 text-sm sm:text-base max-w-lg">
            {isBoys
              ? 'From cozy fleece hooded rompers to linen coordinates and formal waistcoat sets.'
              : 'From heavenly tiered tulle party frocks to pastel sundresses and soft knit playsuits.'}
          </p>
        </div>

        <div className="w-24 h-24 rounded-3xl bg-white shadow-soft flex items-center justify-center text-5xl">
          {isBoys ? '🧸' : '🌸'}
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        ages={ages}
        collections={collections}
        dressTypes={dressTypes}
        hideCategorySelector={true}
      />

      {/* Products */}
      <ProductGrid
        products={products}
        filters={filters}
        whatsappNumber={whatsappNumber}
        title={isBoys ? 'Baby Boy Outfits' : 'Baby Girl Outfits'}
      />
    </div>
  );
}
