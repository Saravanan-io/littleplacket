'use client';

import React from 'react';
import { X, Check } from 'lucide-react';

interface SortSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentSort: string;
  onSelectSort: (sort: string) => void;
}

const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'A–Z', value: 'a-z' },
];

export default function SortSheet({
  isOpen,
  onClose,
  currentSort,
  onSelectSort,
}: SortSheetProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Bottom Sheet on Mobile / Modal on Tablet/Desktop */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Handle / Header */}
        <div className="px-6 pt-5 pb-4 border-b border-cream-200 flex items-center justify-between bg-cream-50/70">
          <div>
            <h3 className="text-lg font-extrabold text-charcoal-900">Sort By</h3>
            <p className="text-xs text-charcoal-500 font-medium">Select your preferred catalogue order</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-charcoal-500 hover:bg-cream-200 transition-colors"
            aria-label="Close sort sheet"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options List */}
        <div className="p-3 sm:p-4 space-y-1">
          {SORT_OPTIONS.map((opt) => {
            const isSelected = currentSort === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onSelectSort(opt.value);
                  onClose();
                }}
                className={`w-full min-h-[48px] px-4 py-3 rounded-2xl flex items-center justify-between text-sm font-bold transition-all ${
                  isSelected
                    ? 'bg-purple-100/80 text-purple-700'
                    : 'text-charcoal-800 hover:bg-cream-100'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="w-5 h-5 text-purple-600 stroke-[2.5]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
