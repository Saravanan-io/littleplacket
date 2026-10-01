'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../types';
import { createProductEnquiryUrl } from '../lib/whatsapp';

interface ProductCardProps {
  product: Product;
  whatsappNumber?: string;
}

export default function ProductCard({
  product,
  whatsappNumber = '919876543210',
}: ProductCardProps) {
  const images =
    product.images && product.images.length > 0
      ? product.images
      : [{ url: '/images/hero-banner.jpg', order: 0 }];

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const touchStartX = useRef<number>(0);
  const mouseStartX = useRef<number>(0);
  const isMouseDown = useRef<boolean>(false);

  const prices = product.agePrices?.filter((ap) => ap.available).map((ap) => ap.price) || [];
  const minPrice = prices.length > 0 ? prices[0] : 0;

  const enquiryUrl = createProductEnquiryUrl(whatsappNumber, product);

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 35) {
      // Swiped left -> next
      setActiveImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    } else if (diff < -35) {
      // Swiped right -> prev
      setActiveImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isMouseDown.current = true;
    mouseStartX.current = e.clientX;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isMouseDown.current) return;
    isMouseDown.current = false;
    const diff = mouseStartX.current - e.clientX;
    if (diff > 40) {
      setActiveImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    } else if (diff < -40) {
      setActiveImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

  const getAvailabilityBadge = (status: string) => {
    switch (status) {
      case 'available':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100/90 text-emerald-800 backdrop-blur-md border border-emerald-200 shadow-sm">
            In Stock
          </span>
        );
      case 'limited':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100/90 text-amber-800 backdrop-blur-md border border-amber-200 shadow-sm">
            Limited
          </span>
        );
      case 'coming_soon':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-100/90 text-purple-800 backdrop-blur-md border border-purple-200 shadow-sm">
            Coming Soon
          </span>
        );
      case 'out_of_stock':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-100/90 text-rose-800 backdrop-blur-md border border-rose-200 shadow-sm">
            Out of Stock
          </span>
        );
      default:
        return null;
    }
  };

  const activeImage = images[activeImageIdx]?.url || images[0].url;

  return (
    <div className="group relative rounded-3xl bg-white p-4 shadow-soft hover:shadow-soft-xl border border-cream-200/80 hover:border-cream-300 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Swipeable Multi-Image Area */}
        <div
          className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-cream-100 mb-4 select-none cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          <Link href={`/product/${product.slug}`} className="block w-full h-full">
            <Image
              src={activeImage}
              alt={`${product.name} - Photo ${activeImageIdx + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500 pointer-events-none"
            />
          </Link>

          {/* Badges on Top Left */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
            {product.category === 'boys' ? (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-baby-blue/90 text-blue-800 backdrop-blur-md shadow-sm border border-white">
                👦 Baby Boy
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-baby-pink/90 text-pink-800 backdrop-blur-md shadow-sm border border-white">
                👧 Baby Girl
              </span>
            )}
            {product.featured && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold-400 text-white shadow-sm">
                <Sparkles className="w-2.5 h-2.5" /> Featured
              </span>
            )}
          </div>

          {/* Top Right: Availability Badge & Photo Counter */}
          <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 z-10 pointer-events-none">
            {getAvailabilityBadge(product.availability)}
            {images.length > 1 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-charcoal-900/70 text-white backdrop-blur-md shadow-sm">
                {activeImageIdx + 1}/{images.length}
              </span>
            )}
          </div>

          {/* Swipe / Arrow Controls (if more than 1 image) */}
          {images.length > 1 && (
            <>
              {/* Left Arrow Button */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-charcoal-800 flex items-center justify-center shadow-soft backdrop-blur-md opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 z-20"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Right Arrow Button */}
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-charcoal-800 flex items-center justify-center shadow-soft backdrop-blur-md opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 z-20"
                aria-label="Next photo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Bottom Pagination Dots */}
              <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5 z-20 pointer-events-auto">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveImageIdx(idx);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeImageIdx === idx
                        ? 'w-5 bg-white shadow-sm'
                        : 'w-1.5 bg-white/60 hover:bg-white/90'
                    }`}
                    aria-label={`Jump to photo ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Clean Content Below Image (NO image description / subtitle) */}
        <div className="space-y-2">
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="text-base font-bold text-charcoal-900 hover:text-baby-pink-dark transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Age Size Chips */}
          <div className="flex flex-wrap gap-1">
            {product.agePrices?.slice(0, 4).map((ap) => (
              <span
                key={ap.ageId}
                className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                  ap.available
                    ? 'bg-cream-100 text-charcoal-700'
                    : 'bg-gray-100 text-gray-400 line-through'
                }`}
              >
                {ap.ageLabel}
              </span>
            ))}
            {product.agePrices && product.agePrices.length > 4 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-cream-100 text-charcoal-500 font-semibold">
                +{product.agePrices.length - 4}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer: Single Price & WhatsApp Action */}
      <div className="pt-4 mt-3 border-t border-cream-200/60 flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] uppercase font-semibold text-charcoal-400 block tracking-wider">
            Price
          </span>
          <div className="text-base font-black text-charcoal-900">
            {minPrice > 0 ? (
              <span>₹{minPrice.toLocaleString('en-IN')}</span>
            ) : (
              <span className="text-sm font-semibold text-charcoal-500">Price on Ask</span>
            )}
          </div>
        </div>

        {/* WhatsApp Enquiry Button */}
        <a
          href={enquiryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm hover:shadow-soft transition-all duration-200 transform hover:scale-105"
          title="Enquire on WhatsApp"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-white" />
          <span>Enquire</span>
        </a>
      </div>
    </div>
  );
}
