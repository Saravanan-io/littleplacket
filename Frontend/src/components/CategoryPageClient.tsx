'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Search,
  Baby,
  IndianRupee,
  X,
  Sparkles,
} from 'lucide-react';
import { Product, AgeOption, Collection, ProductFilters, Category } from '../types';
import ProductCard from './ProductCard';
import AgeFilterSheet from './AgeFilterSheet';
import PriceFilterSheet, { getPriceLabel } from './PriceFilterSheet';
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
  const [ageSheetOpen, setAgeSheetOpen] = useState(false);
  const [priceSheetOpen, setPriceSheetOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [filters, setFilters] = useState<ProductFilters>({
    category,
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
        const fresh = await fetchProducts({ category });
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
  }, [category]);

  // Client-side filtering & sorting
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => p.category === category);

    // Search query
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

    // Availability
    if (filters.onlyAvailable) {
      result = result.filter((p) => p.availability === 'available');
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
  }, [products, category, searchQuery, filters]);

  // Active filters count
  const activeFilterCount = [
    filters.ageGroup,
    filters.size,
    filters.priceRange,
    filters.color,
    filters.onlyAvailable,
  ].filter(Boolean).length;

  const handleResetFilters = () => {
    setFilters({
      category,
      ageGroup: undefined,
      size: undefined,
      priceRange: undefined,
      color: undefined,
      onlyAvailable: false,
      sortBy: 'featured',
    });
    setSearchQuery('');
  };

  const headerTitle = isBoys ? 'BOYS COLLECTION' : 'GIRLS COLLECTION';
  const pageTitle = isBoys ? 'Boys Collection' : 'Girls Collection';
  const pageSubtitle = isBoys
    ? 'Trendy outfits for every occasion'
    : 'Pretty outfits for every little star';

  return (
    <div className="min-h-screen bg-cream-50/50 pb-28 lg:pb-16">
      {/* 1. HEADER (Back button, Title, Search icon) */}
      <div className="sticky top-16 sm:top-20 z-30 bg-white/95 backdrop-blur-md border-b border-cream-200/90 shadow-soft">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          {/* Back button */}
          <Link
            href="/"
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-charcoal-700 hover:bg-cream-100 active:scale-95 transition-all"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </Link>

          {/* Center Category Title */}
          <span className="font-black text-sm sm:text-base tracking-wider text-charcoal-900 uppercase">
            {headerTitle}
          </span>
          <div className="w-11" aria-hidden="true" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 sm:pt-8 space-y-4 sm:space-y-6">
        {/* 2. TITLE & SUBTITLE */}
        <div className="text-left space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-4xl font-black text-[#1B2A4A] tracking-tight">
              {pageTitle}
            </h1>
            <img
              src={isBoys ? '/images/nav/nav-boys.jpg' : '/images/nav/nav-girls.jpg'}
              alt={pageTitle}
              className="w-7 h-7 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
            />
          </div>
          <p className="text-xs sm:text-base font-medium text-charcoal-600">
            {pageSubtitle}
          </p>
        </div>

        {/* TWO CONTROLS: SEARCH BY AGE & SEARCH BY PRICE */}
        <div className="flex items-center gap-2.5 pt-1">
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

        {/* Active filter pills */}
        {(filters.ageGroup || filters.priceRange) && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs text-charcoal-500 font-semibold shrink-0">
              Active:
            </span>
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

        {/* 4. PRODUCT GRID: 2 Columns on Mobile, 3-4 on Desktop */}
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
