'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Baby,
  IndianRupee,
  X,
  ArrowLeft,
} from 'lucide-react';
import { Product, AgeOption, Collection, ProductFilters } from '../types';
import ProductCard from './ProductCard';
import AgeFilterSheet from './AgeFilterSheet';
import PriceFilterSheet, { getPriceLabel } from './PriceFilterSheet';
import { fetchProducts } from '../lib/api';
import { getWishlist } from '../lib/enquiry';

interface AllOutfitsClientProps {
  initialProducts: Product[];
  ages: AgeOption[];
  collections: Collection[];
  whatsappNumber: string;
}

export default function AllOutfitsClient({
  initialProducts,
  ages,
  collections,
  whatsappNumber,
}: AllOutfitsClientProps) {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialWishlistOnly = searchParams.get('wishlist') === 'true';

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [ageSheetOpen, setAgeSheetOpen] = useState(false);
  const [priceSheetOpen, setPriceSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [wishlistOnly, setWishlistOnly] = useState(initialWishlistOnly);

  const [filters, setFilters] = useState<ProductFilters>({
    category: 'all',
    collection: '',
    dressType: '',
    ageGroup: undefined,
    size: undefined,
    priceRange: undefined,
    color: undefined,
    onlyAvailable: false,
    sortBy: 'featured',
  });

  // Live Sync
  useEffect(() => {
    let isMounted = true;
    const sync = async () => {
      try {
        const fresh = await fetchProducts();
        if (fresh && fresh.length > 0 && isMounted) {
          setProducts(fresh);
        }
      } catch (e) {
        // fallback
      }
    };
    window.addEventListener('focus', sync);
    const interval = setInterval(sync, 4000);
    return () => {
      isMounted = false;
      window.removeEventListener('focus', sync);
      clearInterval(interval);
    };
  }, []);

  // Compute dress types and collections from active products
  const dressTypes = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.dressType).filter(Boolean)));
  }, [products]);

  // Client-side filtering
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Wishlist filter
    if (wishlistOnly) {
      const favIds = getWishlist();
      result = result.filter((p) => favIds.includes(p.id));
    }

    // Category
    if (filters.category && filters.category !== 'all') {
      result = result.filter((p) => p.category === filters.category);
    }

    // Collection
    if (filters.collection) {
      result = result.filter(
        (p) => p.collection?.toLowerCase() === filters.collection?.toLowerCase()
      );
    }

    // Dress Type
    if (filters.dressType) {
      result = result.filter(
        (p) => p.dressType?.toLowerCase() === filters.dressType?.toLowerCase()
      );
    }

    // Age Group
    if (filters.ageGroup) {
      result = result.filter(
        (p) =>
          p.ageGroup === filters.ageGroup ||
          (p.availableAges && p.availableAges.includes(filters.ageGroup!))
      );
    }

    // Size
    if (filters.size) {
      result = result.filter((p) => p.sizes && p.sizes.includes(filters.size!));
    }

    // Price Range
    if (filters.priceRange) {
      result = result.filter((p) => {
        const pr = p.price || 0;
        if (filters.priceRange === 'below-500') return pr < 500;
        if (filters.priceRange === '500-750') return pr >= 500 && pr <= 750;
        if (filters.priceRange === '750-1000') return pr > 750 && pr <= 1000;
        if (filters.priceRange === '1000-plus') return pr > 1000;
        return true;
      });
    }

    // Colour
    if (filters.color) {
      const targetCol = filters.color.toLowerCase();
      result = result.filter((p) => {
        if (!p.colors) return false;
        return p.colors.some((c) => {
          const cName = typeof c === 'string' ? c : c.name;
          return cName.toLowerCase() === targetCol;
        });
      });
    }

    // Only Available
    if (filters.onlyAvailable) {
      result = result.filter((p) => p.availability === 'available');
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.dressType?.toLowerCase().includes(q) ||
          p.collection?.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (filters.sortBy === 'price-asc') {
        return (a.price || 0) - (b.price || 0);
      }
      if (filters.sortBy === 'price-desc') {
        return (b.price || 0) - (a.price || 0);
      }
      if (filters.sortBy === 'a-z') {
        return a.name.localeCompare(b.name);
      }
      if (filters.sortBy === 'newest') {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
      // 'featured'
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

    return result;
  }, [products, filters, searchQuery, wishlistOnly]);

  const activeFilterCount = [
    filters.category !== 'all' ? filters.category : null,
    filters.collection,
    filters.dressType,
    filters.ageGroup,
    filters.size,
    filters.priceRange,
    filters.color,
    filters.onlyAvailable,
    wishlistOnly ? 'Wishlist' : null,
  ].filter(Boolean).length;

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      collection: '',
      dressType: '',
      ageGroup: undefined,
      size: undefined,
      priceRange: undefined,
      color: undefined,
      onlyAvailable: false,
      sortBy: 'featured',
    });
    setSearchQuery('');
    setWishlistOnly(false);
  };

  return (
    <div className="min-h-screen bg-cream-50/50 pb-28 lg:pb-16 pt-4 sm:pt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Header Title & Subtitle */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1B2A4A] tracking-tight">
            Explore All Little Outfits
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 font-medium">
            Handcrafted baby clothes & boutique collections for every occasion.
          </p>
        </div>

        {/* Quick Category Tabs: All, Boys, Girls */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setFilters({ ...filters, category: 'all' })}
            className={`min-h-[44px] px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
              filters.category === 'all' && !wishlistOnly
                ? 'bg-charcoal-900 text-white shadow-soft scale-102'
                : 'bg-white text-charcoal-700 hover:bg-cream-100 border border-cream-200'
            }`}
          >
            All Outfits ✨
          </button>

          <button
            type="button"
            onClick={() => {
              setWishlistOnly(false);
              setFilters({ ...filters, category: 'boys' });
            }}
            className={`min-h-[44px] px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              filters.category === 'boys' && !wishlistOnly
                ? 'bg-blue-600 text-white shadow-soft scale-102'
                : 'bg-white text-charcoal-700 hover:bg-blue-50 border border-cream-200'
            }`}
          >
            <img
              src="/images/nav/nav-boys.jpg"
              alt="Boys"
              className="w-5 h-5 rounded-full object-cover border border-white/60 shrink-0"
            />
            <span>Boys Collection</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setWishlistOnly(false);
              setFilters({ ...filters, category: 'girls' });
            }}
            className={`min-h-[44px] px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              filters.category === 'girls' && !wishlistOnly
                ? 'bg-pink-500 text-white shadow-soft scale-102'
                : 'bg-white text-charcoal-700 hover:bg-pink-50 border border-cream-200'
            }`}
          >
            <img
              src="/images/nav/nav-girls.jpg"
              alt="Girls"
              className="w-5 h-5 rounded-full object-cover border border-white/60 shrink-0"
            />
            <span>Girls Collection</span>
          </button>

        </div>

        {/* Action Bar: Search by Age & Search by Price */}
        <div className="flex items-center justify-between gap-3 pt-1">
          {/* SEARCH BY AGE Button */}
          <button
            type="button"
            onClick={() => setAgeSheetOpen(true)}
            className={`flex-1 min-h-[46px] px-4 rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-sm font-bold border transition-all active:scale-98 ${
              filters.ageGroup
                ? 'bg-purple-600 text-white border-purple-600 shadow-soft'
                : 'bg-white text-charcoal-800 border-cream-300 hover:bg-cream-100 shadow-soft'
            }`}
          >
            <Baby className="w-4 h-4 stroke-[2.2]" />
            <span className="uppercase">
              {filters.ageGroup ? `Age: ${filters.ageGroup}` : 'Search by Age'}
            </span>
            {filters.ageGroup && (
              <span
                role="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFilters({ ...filters, ageGroup: undefined });
                }}
                className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors ml-0.5"
                title="Clear age filter"
              >
                <X className="w-3 h-3 stroke-[2.5]" />
              </span>
            )}
          </button>

          {/* SEARCH BY PRICE Button */}
          <button
            type="button"
            onClick={() => setPriceSheetOpen(true)}
            className={`flex-1 min-h-[46px] px-4 rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-sm font-bold border transition-all active:scale-98 ${
              filters.priceRange
                ? 'bg-purple-600 text-white border-purple-600 shadow-soft'
                : 'bg-white text-charcoal-800 border-cream-300 hover:bg-cream-100 shadow-soft'
            }`}
          >
            <IndianRupee className="w-4 h-4 stroke-[2.2]" />
            <span className="uppercase">
              {filters.priceRange ? `Price: ${getPriceLabel(filters.priceRange)}` : 'Search by Price'}
            </span>
            {filters.priceRange && (
              <span
                role="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFilters({ ...filters, priceRange: undefined });
                }}
                className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors ml-0.5"
                title="Clear price filter"
              >
                <X className="w-3 h-3 stroke-[2.5]" />
              </span>
            )}
          </button>
        </div>

        {/* Active Filter Tags */}
        {(filters.category !== 'all' || filters.ageGroup || filters.priceRange) && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs text-charcoal-500 font-semibold shrink-0">
              Active:
            </span>
            {filters.category !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold shrink-0 capitalize">
                Category: {filters.category}
                <button
                  type="button"
                  onClick={() => setFilters({ ...filters, category: 'all' })}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {filters.ageGroup && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold shrink-0">
                Age: {filters.ageGroup}
                <button
                  type="button"
                  onClick={() => setFilters({ ...filters, ageGroup: undefined })}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {filters.priceRange && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold shrink-0">
                Price: {getPriceLabel(filters.priceRange)}
                <button
                  type="button"
                  onClick={() => setFilters({ ...filters, priceRange: undefined })}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-purple-600 hover:text-purple-700 font-bold underline shrink-0 ml-1"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Product Grid: 2-column on mobile, 3-4 on desktop */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center space-y-4 bg-white rounded-3xl border border-cream-200 p-8 shadow-soft">
            <span className="text-6xl select-none block">🧸</span>
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-[#1B2A4A]">
                No Outfits Found
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-500 max-w-sm mx-auto">
                Try adjusting your search criteria or resetting filters to see more adorable baby clothing.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-6 py-2.5 rounded-full bg-purple-600 text-white font-bold text-xs sm:text-sm shadow-soft hover:bg-purple-700 transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} whatsappNumber={whatsappNumber} />
            ))}
          </div>
        )}
      </div>

      {/* SEARCH BY AGE SHEET */}
      <AgeFilterSheet
        isOpen={ageSheetOpen}
        onClose={() => setAgeSheetOpen(false)}
        selectedAge={filters.ageGroup}
        onSelectAge={(newAge) => setFilters({ ...filters, ageGroup: newAge || undefined })}
      />

      {/* SEARCH BY PRICE SHEET */}
      <PriceFilterSheet
        isOpen={priceSheetOpen}
        onClose={() => setPriceSheetOpen(false)}
        selectedPrice={filters.priceRange}
        onSelectPrice={(newPrice) => setFilters({ ...filters, priceRange: newPrice || undefined })}
      />
    </div>
  );
}
