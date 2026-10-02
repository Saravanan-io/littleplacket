'use client';

import React from 'react';
import { X, Check, Baby } from 'lucide-react';

interface AgeFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAge?: string;
  onSelectAge: (age: string) => void;
}

const AGE_OPTIONS = [
  { label: 'All Ages', value: '', description: 'Show outfits for all age groups' },
  { label: '2–3 Years', value: '2-3yr', description: 'Toddler outfit styles (2–3 Y)' },
  { label: '3–4 Years', value: '3-4yr', description: 'Early childhood outfits (3–4 Y)' },
  { label: '4–5 Years', value: '4-5yr', description: 'Pre-school kids outfits (4–5 Y)' },
  { label: '5–6 Years', value: '5-6yr', description: 'Kindergarten kids outfits (5–6 Y)' },
  { label: '6–7 Years', value: '6-7yr', description: 'Junior kids collection (6–7 Y)' },
  { label: '7–8 Years', value: '7-8yr', description: 'Primary school styles (7–8 Y)' },
  { label: '8–9 Years', value: '8-9yr', description: 'Growing kids boutique wear (8–9 Y)' },
  { label: '9–10 Years', value: '9-10yr', description: 'Pre-teen collection (9–10 Y)' },
  { label: '10–11 Years', value: '10-11yr', description: 'Pre-teen outfits (10–11 Y)' },
  { label: '11–12 Years', value: '11–12yr', description: 'Boutique kids fashion (11–12 Y)' },
];

export default function AgeFilterSheet({
  isOpen,
  onClose,
  selectedAge = '',
  onSelectAge,
}: AgeFilterSheetProps) {
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
              <Baby className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-charcoal-900">Search by Age</h3>
              <p className="text-xs text-charcoal-500 font-medium">Select age group to filter outfits</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-charcoal-500 hover:bg-cream-200 transition-colors"
            aria-label="Close age sheet"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options List */}
        <div className="p-3 sm:p-4 space-y-2 max-h-[60vh] overflow-y-auto">
          {AGE_OPTIONS.map((opt) => {
            const isSelected = selectedAge === opt.value || (!selectedAge && opt.value === '');
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onSelectAge(opt.value);
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
