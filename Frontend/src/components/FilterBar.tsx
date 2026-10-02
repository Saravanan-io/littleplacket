'use client';

import React from 'react';
import { Search, X, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { AgeOption, Collection, ProductFilters } from '../types';

interface FilterBarProps {
  filters: ProductFilters;
  onFilterChange: (newFilters: ProductFilters) => void;
  ages: AgeOption[];
  collections: Collection[];
  dressTypes: string[];
  hideCategorySelector?: boolean;
}

export default function FilterBar({
  filters,
  onFilterChange,
  ages,
  collections,
  dressTypes,
  hideCategorySelector = false,
}: FilterBarProps) {
  const updateField = (key: keyof ProductFilters, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFilterChange({
      category: hideCategorySelector ? filters.category : 'all',
      collection: '',
      dressType: '',
      availability: 'all',
      minPrice: undefined,
      maxPrice: undefined,
      ageId: '',
      search: '',
      sortBy: 'featured',
    });
  };

  const hasActiveFilters =
    Boolean(filters.search) ||
    Boolean(filters.collection) ||
    Boolean(filters.dressType) ||
    (filters.availability && filters.availability !== 'all') ||
    Boolean(filters.ageId) ||
    (!hideCategorySelector && filters.category && filters.category !== 'all');

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 shadow-soft border border-cream-200/80 mb-8 space-y-4">
      {/* Top Row: Search and Sort */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
          <input
            type="text"
            placeholder="Search rompers, frocks, linen sets, tuxedos..."
            value={filters.search || ''}
            onChange={(e) => updateField('search', e.target.value)}
            className="w-full pl-11 pr-10 py-2.5 rounded-2xl bg-cream-100/70 border border-cream-200 text-sm text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-baby-pink-dark/30 focus:border-baby-pink-dark transition-all"
          />
          {filters.search && (
            <button
              onClick={() => updateField('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-charcoal-500 whitespace-nowrap hidden sm:inline">
            Sort by:
          </label>
          <select
            value={filters.sortBy || 'featured'}
            onChange={(e) => updateField('sortBy', e.target.value)}
            className="px-3 py-2.5 rounded-2xl bg-cream-100/70 border border-cream-200 text-xs font-medium text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-baby-pink-dark/30"
          >
            <option value="featured">✨ Featured Outfits</option>
            <option value="price-asc">💰 Price: Low to High</option>
            <option value="price-desc">💎 Price: High to Low</option>
            <option value="newest">🌱 Newest Additions</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-2xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold border border-rose-200 transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Selectors Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-2 border-t border-cream-200/60">
        {/* Category Pill Switcher (if not hidden) */}
        {!hideCategorySelector && (
          <div>
            <label className="text-[11px] font-bold text-charcoal-500 block mb-1 uppercase tracking-wider">
              Category
            </label>
            <select
              value={filters.category || 'all'}
              onChange={(e) => updateField('category', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-200 text-xs font-medium text-charcoal-800 focus:outline-none"
            >
              <option value="all">👶 All Categories</option>
              <option value="boys">👦 Baby Boys</option>
              <option value="girls">👧 Baby Girls</option>
            </select>
          </div>
        )}

        {/* Age Dropdown */}
        <div>
          <label className="text-[11px] font-bold text-charcoal-500 block mb-1 uppercase tracking-wider">
            Age Size
          </label>
          <select
            value={filters.ageId || ''}
            onChange={(e) => updateField('ageId', e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-200 text-xs font-medium text-charcoal-800 focus:outline-none"
          >
            <option value="">📏 All Baby Ages</option>
            {ages.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        </div>

        {/* Dress Type */}
        <div>
          <label className="text-[11px] font-bold text-charcoal-500 block mb-1 uppercase tracking-wider">
            Dress Style
          </label>
          <select
            value={filters.dressType || ''}
            onChange={(e) => updateField('dressType', e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-200 text-xs font-medium text-charcoal-800 focus:outline-none"
          >
            <option value="">👗 All Styles</option>
            {dressTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Collection */}
        <div>
          <label className="text-[11px] font-bold text-charcoal-500 block mb-1 uppercase tracking-wider">
            Collection
          </label>
          <select
            value={filters.collection || ''}
            onChange={(e) => updateField('collection', e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-200 text-xs font-medium text-charcoal-800 focus:outline-none"
          >
            <option value="">✨ All Collections</option>
            {collections.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
