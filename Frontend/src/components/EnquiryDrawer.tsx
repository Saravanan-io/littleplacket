'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, MessageCircle, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { EnquiryItem } from '../types';
import {
  getEnquiryItems,
  removeItemFromEnquiry,
  clearEnquiry,
  buildWhatsAppEnquiryUrl,
} from '../lib/enquiry';

interface EnquiryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  whatsappNumber?: string;
}

export default function EnquiryDrawer({
  isOpen,
  onClose,
  whatsappNumber = '919876543210',
}: EnquiryDrawerProps) {
  const [items, setItems] = useState<EnquiryItem[]>([]);

  const loadItems = () => {
    setItems(getEnquiryItems());
  };

  useEffect(() => {
    if (isOpen) {
      loadItems();
    }
    const handleUpdate = () => loadItems();
    window.addEventListener('kiddy_enquiry_updated', handleUpdate);
    return () => {
      window.removeEventListener('kiddy_enquiry_updated', handleUpdate);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRemove = (id: string) => {
    const updated = removeItemFromEnquiry(id);
    setItems(updated);
  };

  const handleClearAll = () => {
    clearEnquiry();
    setItems([]);
  };

  const totalEstimate = items.reduce((acc, it) => acc + (it.price || 0), 0);
  const whatsAppUrl = buildWhatsAppEnquiryUrl(items, whatsappNumber);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-6 py-5 border-b border-cream-200 flex items-center justify-between bg-cream-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-700">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#1B2A4A]">
                My Selection ({items.length})
              </h2>
              <p className="text-xs text-charcoal-500 font-medium">
                Enquiry List for WhatsApp
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-charcoal-500 hover:text-charcoal-900 hover:bg-cream-200 transition-colors"
            aria-label="Close selection drawer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <span className="text-5xl select-none">🧸</span>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-charcoal-900">
                  Your Enquiry List is Empty
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-500 max-w-xs">
                  Browse our little outfits, select your desired size and colour, then add to your selection!
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-purple-600 text-white font-bold text-xs sm:text-sm shadow-soft hover:bg-purple-700 transition-all"
              >
                <span>Browse Outfits</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-charcoal-400">
                  Selected Items
                </span>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs text-rose-500 hover:text-rose-700 font-bold"
                >
                  Clear All
                </button>
              </div>

              {items.map((it) => (
                <div
                  key={it.id}
                  className="p-3.5 rounded-2xl bg-cream-50 border border-cream-200 flex items-center gap-3.5 relative group hover:border-purple-200 transition-all"
                >
                  {/* Thumbnail */}
                  <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-white shrink-0 border border-cream-200">
                    <Image
                      src={it.image || '/images/hero-banner.jpg'}
                      alt={it.name}
                      fill
                      className="object-cover object-top"
                      sizes="64px"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="font-bold text-sm text-charcoal-900 truncate">
                      {it.name}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-charcoal-600 font-semibold">
                      <span>Size: {it.size}</span>
                      <span>•</span>
                      <span>Colour: {it.color}</span>
                    </div>
                    <p className="text-sm font-extrabold text-[#1B2A4A]">
                      ₹{it.price}
                    </p>
                  </div>

                  {/* Remove Button: ❌ */}
                  <button
                    type="button"
                    onClick={() => handleRemove(it.id)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-charcoal-400 hover:text-rose-600 hover:bg-rose-50 active:scale-90 transition-all"
                    aria-label={`Remove ${it.name} from selection`}
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Drawer Footer with WhatsApp Action Button */}
        {items.length > 0 && (
          <div className="p-4 sm:p-6 border-t border-cream-200 bg-cream-50/80 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-charcoal-600">Total Price Estimate</span>
              <span className="font-black text-lg text-[#1B2A4A]">₹{totalEstimate}</span>
            </div>

            <p className="text-[11px] text-charcoal-500 text-center leading-tight">
              Direct enquiry only — No online payment or cart checkout required.
            </p>

            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[52px] rounded-full bg-[#25D366] hover:bg-[#20ba59] active:scale-98 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-soft hover:shadow-glow-whatsapp transition-all"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Send Enquiry on WhatsApp</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
