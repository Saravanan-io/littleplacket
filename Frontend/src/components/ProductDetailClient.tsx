'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  MessageCircle,
  Sparkles,
  ShoppingBag,
  Share2,
} from 'lucide-react';
import { Product } from '../types';
import {
  buildSingleProductWhatsAppUrl,
} from '../lib/enquiry';
import ProductCard from './ProductCard';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
  whatsappNumber: string;
}

export default function ProductDetailClient({
  product,
  relatedProducts,
  whatsappNumber = '919876543210',
}: ProductDetailClientProps) {
  const router = useRouter();

  // Images
  const images =
    product.images && product.images.length > 0
      ? product.images
      : [{ url: '/images/hero-banner.jpg', order: 0 }];
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Available Ages (configured in Admin Panel)
  const availableAges =
    product.availableAges && product.availableAges.length > 0
      ? product.availableAges
      : ['2-3yr', '3-4yr', '4-5yr', '5-6yr'];
  const [selectedAge, setSelectedAge] = useState<string>(availableAges[0] || '2-3yr');

  // WhatsApp number (product-specific or fallback to boutique setting)
  const effectiveWhatsApp = product.whatsappNumber?.trim() || whatsappNumber;
  const isOutOfStock = product.availability === 'out_of_stock';

  // Direct single WhatsApp enquiry URL with selected age
  const singleWhatsAppUrl = buildSingleProductWhatsAppUrl(
    product.name,
    selectedAge,
    '',
    product.price || 749,
    effectiveWhatsApp
  );


  const displayStartingPrice =
    product.price ? `₹${product.price}` : '₹699';


  // Back destination: if category is boys -> /boys, else -> /girls
  const backHref = product.category === 'boys' ? '/boys' : '/girls';

  return (
    <div className="min-h-screen bg-cream-50/50 pb-28 lg:pb-16">
      {/* Top Header: Back Button */}
      <div className="sticky top-16 sm:top-20 z-30 bg-white/95 backdrop-blur-md border-b border-cream-200/80 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-charcoal-700 hover:text-charcoal-900 font-bold text-sm min-h-[44px] px-2 rounded-xl active:bg-cream-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            <span className="capitalize">{product.category} Collection</span>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 sm:pt-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 items-start">
          {/* LEFT: Large Product Image & Thumbnail Carousel */}
          <div className="space-y-3 sm:space-y-4">
            {/* Large Product Image */}
            <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-white shadow-soft border-2 border-white">
              <Image
                src={images[activeImageIdx]?.url || images[0].url}
                alt={product.name}
                fill
                priority
                className="object-cover object-top transition-all duration-300"
                sizes="(max-width: 768px) 100vw, 500px"
              />

            </div>

            {/* Thumbnail Image Carousel */}
            {images.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                {images.map((img, idx) => (
                  <button
                    key={`${img.url}-${idx}`}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-2xl overflow-hidden shrink-0 transition-all border-2 ${
                      activeImageIdx === idx
                        ? 'border-purple-600 ring-2 ring-purple-600/30 shadow-md scale-102'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={`${product.name} angle ${idx + 1}`}
                      fill
                      className="object-cover object-top"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Details, Size Selector, Price, Colors, Actions */}
          <div className="space-y-6">
            {/* Title, Starting Price, & Stock Status */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A4A] tracking-tight leading-snug">
                  {product.name}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold shrink-0 border ${
                    isOutOfStock
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {isOutOfStock ? '✕ Out of Stock' : '✓ In Stock'}
                </span>
              </div>
              <p className="text-sm font-semibold text-charcoal-500">
                {displayStartingPrice}
              </p>
            </div>

            {/* AVAILABLE AGES SELECTOR */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-charcoal-800">
                  Available Ages
                </span>
                <span className="text-xs font-extrabold text-purple-700">
                  Selected Age: {selectedAge}
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {availableAges.map((age) => {
                  const isSelected = selectedAge === age;
                  return (
                    <button
                      key={age}
                      type="button"
                      onClick={() => setSelectedAge(age)}
                      className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all border ${
                        isSelected
                          ? 'bg-purple-600 text-white border-purple-600 shadow-soft scale-105 ring-2 ring-purple-400'
                          : 'bg-white text-charcoal-800 hover:bg-purple-50 border-cream-200 shadow-xs'
                      }`}
                    >
                      {isSelected ? `✓ ${age}` : age}
                    </button>
                  );
                })}
              </div>
            </div>


            {/* PRICE DISPLAY */}
            <div className="p-4 rounded-2xl bg-cream-100/90 border border-cream-200/90 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500 block">
                  Catalogue Price
                </span>
                <span className="text-2xl sm:text-3xl font-black text-[#1B2A4A] tracking-tight">
                  ₹{product.price || 749}
                </span>
              </div>
            </div>




            {/* Desktop Actions */}
            <div className="pt-2">
              <a
                href={singleWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full min-h-[52px] rounded-full active:scale-98 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-soft transition-all ${
                  isOutOfStock
                    ? 'bg-amber-600 hover:bg-amber-700 shadow-soft'
                    : 'bg-[#25D366] hover:bg-[#20ba59] hover:shadow-glow-whatsapp'
                }`}
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>
                  {isOutOfStock ? 'Enquire for Restock on WhatsApp' : 'Enquire on WhatsApp'}
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* RELATED OUTFITS SECTION */}
        {relatedProducts.length > 0 && (
          <div className="pt-10 sm:pt-14 border-t border-cream-200/80 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#1B2A4A] tracking-tight">
                More Adorable Outfits You May Love
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {relatedProducts.slice(0, 4).map((rel) => (
                <ProductCard key={rel.id} product={rel} whatsappNumber={effectiveWhatsApp} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MOBILE STICKY BOTTOM BAR (Always visible on mobile) */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-cream-200 px-4 py-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] flex items-center">
        <a
          href={singleWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full min-h-[48px] rounded-full text-white text-sm font-extrabold flex items-center justify-center gap-2 shadow-soft active:scale-95 transition-all ${
            isOutOfStock ? 'bg-amber-600' : 'bg-[#25D366]'
          }`}
        >
          <MessageCircle className="w-5 h-5 fill-white" />
          <span>
            {isOutOfStock ? 'Enquire for Restock on WhatsApp' : 'Enquire on WhatsApp'}
          </span>
        </a>
      </div>
    </div>
  );
}
