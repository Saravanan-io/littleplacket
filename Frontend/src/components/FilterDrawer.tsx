'use client';

import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { ProductFilters } from '../types';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ProductFilters;
  onApplyFilters: (newFilters: ProductFilters) => void;
}

const AGE_OPTIONS = [
  '2-3yr',
  '3-4yr',
  '4-5yr',
  '5-6yr',
  '6-7yr',
  '7-8yr',
  '8-9yr',
  '9-10yr',
  '10-11yr',
  '11-12yr',
];
const SIZE_OPTIONS = ['20', '22', '24', '26', '28', '30'];
const PRICE_OPTIONS = [
  { label: 'Below ₹500', value: 'below-500' },
  { label: '₹500 – ₹750', value: '500-750' },
  { label: '₹750 – ₹1000', value: '750-1000' },
  { label: '₹1000+', value: '1000-plus' },
];

const COLOUR_OPTIONS = [
  { name: 'Navy', hex: '#1E3A8A', border: false },
  { name: 'Red', hex: '#DC2626', border: false },
  { name: 'Green', hex: '#16A34A', border: false },
  { name: 'Yellow', hex: '#EAB308', border: false },
  { name: 'Pink', hex: '#F472B6', border: false },
  { name: 'White', hex: '#FFFFFF', border: true },
  { name: 'Lavender', hex: '#C084FC', border: false },
];

export default function FilterDrawer({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
}: FilterDrawerProps) {
  const [tempAge, setTempAge] = useState<string>(filters.ageGroup || '');
  const [tempSize, setTempSize] = useState<string>(filters.size || '');
  const [tempPrice, setTempPrice] = useState<string>(filters.priceRange || '');
  const [tempColour, setTempColour] = useState<string>(filters.color || '');
  const [tempOnlyAvailable, setTempOnlyAvailable] = useState<boolean>(filters.onlyAvailable ?? false);

  useEffect(() => {
    if (isOpen) {
      setTempAge(filters.ageGroup || '');
      setTempSize(filters.size || '');
      setTempPrice(filters.priceRange || '');
      setTempColour(filters.color || '');
      setTempOnlyAvailable(filters.onlyAvailable ?? false);
    }
  }, [isOpen, filters]);

  if (!isOpen) return null;

  const handleClearAll = () => {
    setTempAge('');
    setTempSize('');
    setTempPrice('');
    setTempColour('');
    setTempOnlyAvailable(false);
  };

  const handleApply = () => {
    onApplyFilters({
      ...filters,
      ageGroup: tempAge || undefined,
      size: tempSize || undefined,
      priceRange: tempPrice || undefined,
      color: tempColour || undefined,
      onlyAvailable: tempOnlyAvailable,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-in panel (Full screen on mobile, 420px on desktop) */}
      <div className="relative w-full max-w-md bg-white h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-6 py-5 border-b border-cream-200 flex items-center justify-between bg-cream-50/70">
          <div>
            <h2 className="text-xl font-extrabold text-charcoal-900">Filters</h2>
            <p className="text-xs text-charcoal-500 font-medium">
              Refine your little baby wardrobe search
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-charcoal-500 hover:text-charcoal-900 hover:bg-cream-200 transition-colors"
            aria-label="Close filters"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-7">
          {/* 1. AGE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-charcoal-800">
                Age
              </label>
              {tempAge && (
                <button
                  type="button"
                  onClick={() => setTempAge('')}
                  className="text-xs text-purple-600 font-bold hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {AGE_OPTIONS.map((age) => {
                const isSelected = tempAge === age;
                return (
                  <button
                    key={age}
                    type="button"
                    onClick={() => setTempAge(isSelected ? '' : age)}
                    className={`min-h-[44px] px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-purple-600 text-white shadow-soft scale-102'
                        : 'bg-cream-100 text-charcoal-700 hover:bg-cream-200 border border-cream-200'
                    }`}
                  >
                    {age}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. SIZE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-charcoal-800">
                Size
              </label>
              {tempSize && (
                <button
                  type="button"
                  onClick={() => setTempSize('')}
                  className="text-xs text-purple-600 font-bold hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="grid grid-cols-6 gap-2">
              {SIZE_OPTIONS.map((size) => {
                const isSelected = tempSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setTempSize(isSelected ? '' : size)}
                    className={`min-h-[44px] rounded-2xl flex items-center justify-center text-xs font-extrabold transition-all ${
                      isSelected
                        ? 'bg-purple-600 text-white shadow-soft scale-105'
                        : 'bg-cream-100 text-charcoal-800 hover:bg-cream-200 border border-cream-200'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. PRICE RANGE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-charcoal-800">
                Price Range
              </label>
              {tempPrice && (
                <button
                  type="button"
                  onClick={() => setTempPrice('')}
                  className="text-xs text-purple-600 font-bold hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PRICE_OPTIONS.map((opt) => {
                const isSelected = tempPrice === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setTempPrice(isSelected ? '' : opt.value)}
                    className={`min-h-[44px] px-3 py-2 rounded-2xl text-xs font-bold text-center transition-all ${
                      isSelected
                        ? 'bg-purple-600 text-white shadow-soft'
                        : 'bg-cream-100 text-charcoal-700 hover:bg-cream-200 border border-cream-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. COLOUR */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-charcoal-800">
                Colour
              </label>
              {tempColour && (
                <button
                  type="button"
                  onClick={() => setTempColour('')}
                  className="text-xs text-purple-600 font-bold hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {COLOUR_OPTIONS.map((col) => {
                const isSelected = tempColour.toLowerCase() === col.name.toLowerCase();
                return (
                  <button
                    key={col.name}
                    type="button"
                    onClick={() => setTempColour(isSelected ? '' : col.name)}
                    className="flex flex-col items-center gap-1 group min-h-[44px] justify-center"
                    aria-label={`Select ${col.name} color`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform ${
                        col.border ? 'border border-charcoal-200' : ''
                      } ${isSelected ? 'ring-3 ring-purple-600 ring-offset-2 scale-110 shadow-md' : 'group-hover:scale-105'}`}
                      style={{ backgroundColor: col.hex }}
                    >
                      {isSelected && (
                        <Check
                          className={`w-4 h-4 ${
                            col.name === 'White' || col.name === 'Yellow'
                              ? 'text-charcoal-900'
                              : 'text-white'
                          }`}
                        />
                      )}
                    </div>
                    <span className="text-[10px] font-semibold text-charcoal-600">
                      {col.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. AVAILABILITY TOGGLE */}
          <div className="pt-2 border-t border-cream-200">
            <div className="flex items-center justify-between min-h-[44px]">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-charcoal-800">
                  Availability
                </p>
                <p className="text-xs text-charcoal-500 font-medium">
                  Show only available products
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTempOnlyAvailable(!tempOnlyAvailable)}
                className={`w-14 h-8 rounded-full transition-colors relative p-1 focus:outline-none ${
                  tempOnlyAvailable ? 'bg-purple-600' : 'bg-charcoal-200'
                }`}
                role="switch"
                aria-checked={tempOnlyAvailable}
                aria-label="Toggle available only products"
              >
                <div
                  className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                    tempOnlyAvailable ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM FIXED BUTTONS */}
        <div className="p-4 sm:p-5 border-t border-cream-200 bg-cream-50 flex items-center gap-3">
          <button
            type="button"
            onClick={handleClearAll}
            className="flex-1 min-h-[48px] rounded-full border border-cream-300 bg-white text-charcoal-700 text-xs sm:text-sm font-bold hover:bg-cream-100 active:scale-98 transition-all"
          >
            CLEAR ALL
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 min-h-[48px] rounded-full bg-purple-600 hover:bg-purple-700 active:scale-98 text-white text-xs sm:text-sm font-extrabold shadow-soft transition-all"
          >
            APPLY FILTER
          </button>
        </div>
      </div>
    </div>
  );
}
