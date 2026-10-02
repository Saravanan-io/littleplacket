'use client';

import React from 'react';
import { X, Check, IndianRupee } from 'lucide-react';

interface PriceFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPrice?: string;
  onSelectPrice: (price: string) => void;
}

export const PRICE_OPTIONS = [
  { label: 'All Prices', value: '', description: 'Show all price points' },
  { label: 'Below ₹500', value: 'below-500', description: 'Pocket-friendly everyday wear' },
  { label: '₹500 – ₹750', value: '500-750', description: 'Popular & bestselling outfits' },
  { label: '₹750 – ₹1,000', value: '750-1000', description: 'Premium celebration styles' },
  { label: 'Above ₹1,000', value: '1000-plus', description: 'Exclusive designer & formal sets' },
];

export function getPriceLabel(value?: string): string {
  if (!value) return '';
  const match = PRICE_OPTIONS.find((p) => p.value === value);
  return match ? match.label : value;
}

export default function PriceFilterSheet({
  isOpen,
  onClose,
  selectedPrice = '',
  onSelectPrice,
}: PriceFilterSheetProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Bottom Sheet on Mobile / Modal on Tablet & Desktop */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-cream-200 flex items-center justify-between bg-cream-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <IndianRupee className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-charcoal-900">Search by Price</h3>
              <p className="text-xs text-charcoal-500 font-medium">Select price range to filter outfits</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-charcoal-500 hover:bg-cream-200 transition-colors"
            aria-label="Close price sheet"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options List */}
        <div className="p-3 sm:p-4 space-y-2 max-h-[60vh] overflow-y-auto">
          {PRICE_OPTIONS.map((opt) => {
            const isSelected = selectedPrice === opt.value || (!selectedPrice && opt.value === '');
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onSelectPrice(opt.value);
                  onClose();
                }}
                className={`w-full min-h-[52px] px-4 py-3 rounded-2xl flex items-center justify-between text-left transition-all border ${
                  isSelected
                    ? 'bg-purple-100/90 text-purple-900 border-purple-300 shadow-sm font-bold'
                    : 'bg-white text-charcoal-800 border-cream-200 hover:bg-cream-50 hover:border-cream-300 font-medium'
                }`}
              >
                <div>
                  <div className="text-sm font-bold">{opt.label}</div>
                  <div className="text-[11px] text-charcoal-500">{opt.description}</div>
                </div>
                {isSelected && <Check className="w-5 h-5 text-purple-600 stroke-[2.5] shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
