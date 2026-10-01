'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MessageCircle,
  Share2,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  Check,
  Copy,
  Info,
  Ruler,
  Clock,
} from 'lucide-react';
import { Product, AgePriceEntry } from '../types';
import { createProductEnquiryUrl } from '../lib/whatsapp';
import { fetchProductBySlug, fetchProductById } from '../lib/api';
import confetti from 'canvas-confetti';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
  whatsappNumber: string;
}

export default function ProductDetailClient({
  product: initialProduct,
  relatedProducts,
  whatsappNumber,
}: ProductDetailClientProps) {
  const [product, setProduct] = useState<Product>(initialProduct);

  // Live Sync: Re-fetch current product when admin edits
  useEffect(() => {
    let isMounted = true;
    const syncCurrentProduct = async () => {
      try {
        const fresh = initialProduct.id
          ? await fetchProductById(initialProduct.id)
          : await fetchProductBySlug(initialProduct.slug);
        if (fresh && isMounted) {
          setProduct(fresh);
        }
      } catch (e) {
        // silently fallback
      }
    };

    const handleFocus = () => syncCurrentProduct();
    window.addEventListener('focus', handleFocus);
    const interval = setInterval(syncCurrentProduct, 3000);

    return () => {
      isMounted = false;
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [initialProduct.id, initialProduct.slug]);

  const images = product.images && product.images.length > 0
    ? product.images
    : [{ url: '/images/hero-banner.jpg', order: 0 }];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedAge, setSelectedAge] = useState<AgePriceEntry | null>(
    product.agePrices?.find((ap) => ap.available) || product.agePrices?.[0] || null
  );
  const [copiedLink, setCopiedLink] = useState(false);

  // Keep selected age synced if product agePrices update
  useEffect(() => {
    if (selectedAge) {
      const match = product.agePrices?.find((ap) => ap.ageId === selectedAge.ageId);
      if (match) setSelectedAge(match);
    } else {
      setSelectedAge(product.agePrices?.find((ap) => ap.available) || product.agePrices?.[0] || null);
    }
  }, [product.agePrices]);

  const activeImage = images[activeImageIndex]?.url || images[0].url;

  const currentPrice = selectedAge?.price || 0;
  const isSelectedAgeAvailable = selectedAge ? selectedAge.available : true;

  const enquiryUrl = createProductEnquiryUrl(
    whatsappNumber,
    product,
    selectedAge,
    typeof window !== 'undefined' ? window.location.href : ''
  );

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleEnquiryClick = () => {
    // Joyful micro-celebration confetti
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#FB6F92', '#3A86FF', '#25D366', '#FFD166'],
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Back button */}
      <div>
        <Link
          href={product.category === 'boys' ? '/boys' : '/girls'}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-charcoal-600 hover:text-charcoal-900 bg-white px-4 py-2 rounded-full border border-cream-200 shadow-soft transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {product.category === 'boys' ? 'Boys' : 'Girls'} Collection</span>
        </Link>
      </div>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          {/* Active Main Image */}
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-cream-100 shadow-soft-lg border border-cream-200">
            <Image
              src={activeImage}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover object-center transition-all duration-300"
            />

            {/* Badges on Image */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-md shadow-sm border border-white text-charcoal-900">
                {product.category === 'boys' ? '👦 Baby Boy' : '👧 Baby Girl'}
              </span>
              {product.featured && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gold-400 text-white shadow-sm">
                  <Sparkles className="w-3 h-3" /> Featured Collection
                </span>
              )}
            </div>

            <div className="absolute top-4 right-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                  product.availability === 'available'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}
              >
                {product.availability === 'available' ? 'Available' : 'Limited Pieces'}
              </span>
            </div>
          </div>

          {/* Thumbnails row (if more than 1 image) */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-baby-pink-dark scale-105 shadow-soft'
                      : 'border-cream-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details & Age-Based Pricing & WhatsApp CTA */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-baby-pink-dark uppercase tracking-wider">
              <span>{product.dressType}</span>
              <span>•</span>
              <span className="text-charcoal-500">{product.collection}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 tracking-tight">
              {product.name}
            </h1>

            {/* Single Uniform Price Display */}
            {currentPrice > 0 && (
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-3xl sm:text-4xl font-black text-charcoal-900 tracking-tight">
                  ₹{currentPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cream-200/90 text-charcoal-700 border border-cream-300">
                  Same price for all ages
                </span>
              </div>
            )}

            <p className="text-sm text-charcoal-600 leading-relaxed pt-1">
              {product.description}
            </p>
          </div>

          {/* Available Sizes for Ages */}
          <div className="bg-white rounded-3xl p-6 shadow-soft border border-cream-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-charcoal-900 flex items-center gap-1.5">
                  <Ruler className="w-4 h-4 text-baby-pink-dark" />
                  <span>Available Sizes for Ages</span>
                </h3>
                <p className="text-xs text-charcoal-500">
                  Select your baby's age size to enquire on WhatsApp
                </p>
              </div>

              {selectedAge && (
                <span className="text-xs font-bold text-baby-pink-dark bg-baby-pink/30 px-3 py-1 rounded-full border border-baby-pink-dark/20">
                  Selected: {selectedAge.ageLabel}
                </span>
              )}
            </div>

            {/* Clean Age Size Pills (Single price shown above, sizes listed here) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {product.agePrices?.map((entry) => {
                const isSelected = selectedAge?.ageId === entry.ageId;
                return (
                  <button
                    key={entry.ageId}
                    type="button"
                    onClick={() => setSelectedAge(entry)}
                    className={`py-3 px-3 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? 'border-charcoal-900 bg-charcoal-900 text-white shadow-soft scale-102 ring-2 ring-charcoal-900/20'
                        : entry.available
                        ? 'border-cream-200 bg-cream-50/70 hover:bg-cream-100 text-charcoal-800'
                        : 'border-gray-200 bg-gray-50 text-gray-400 line-through cursor-not-allowed'
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-bold">
                      {entry.ageLabel}
                    </div>
                    <div className="text-[10px] sm:text-[11px] mt-0.5 font-medium">
                      {entry.available ? (
                        <span className={isSelected ? 'text-emerald-300' : 'text-emerald-700'}>
                          In Stock
                        </span>
                      ) : (
                        <span className="text-rose-500">Out of Stock</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {!isSelectedAgeAvailable && (
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0 text-amber-600" />
                <span>
                  The selected age size is currently in high demand or limited. You can still message us on WhatsApp to check if a restock is arriving soon!
                </span>
              </div>
            )}
          </div>

          {/* Primary Action: Direct WhatsApp Enquiry Button */}
          <div className="space-y-3 pt-2">
            <a
              href={enquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleEnquiryClick}
              className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20ba59] text-white py-4 px-8 rounded-full text-base sm:text-lg font-bold shadow-soft hover:shadow-glow-whatsapp transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <MessageCircle className="w-6 h-6 fill-white" />
              <span>Enquire on WhatsApp</span>
              {selectedAge && (
                <span className="text-xs font-semibold bg-black/20 px-2.5 py-1 rounded-full ml-1">
                  Size: {selectedAge.ageLabel}
                </span>
              )}
            </a>

            {/* Sub-actions: Share Link */}
            <div className="flex items-center justify-center gap-4 text-xs font-semibold text-charcoal-600 pt-1">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 hover:text-charcoal-900 transition-colors"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Link Copied to Clipboard!' : 'Copy Catalogue Link'}</span>
              </button>
            </div>
          </div>

          {/* Organic Quality & Care Guarantee */}
          <div className="p-4 rounded-3xl bg-cream-100/70 border border-cream-200 space-y-2.5">
            <div className="flex items-center gap-2 font-bold text-xs text-charcoal-800 uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Baby Safety & Fabric Specifications</span>
            </div>
            <ul className="text-xs text-charcoal-600 space-y-1 list-disc list-inside">
              <li>100% GOTS-certified organic combed cotton & hypoallergenic lining</li>
              <li>Nickel-free non-allergic metal snap closures</li>
              <li>Smooth flatlock interior seams to prevent delicate skin irritation</li>
              <li>Gentle machine wash or hand wash in cold water recommended</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-cream-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-baby-pink-dark">
                You May Also Adore
              </span>
              <h2 className="text-2xl font-extrabold text-charcoal-900 mt-1">
                More in {product.collection || 'Boutique Collection'}
              </h2>
            </div>
            <Link
              href={product.category === 'boys' ? '/boys' : '/girls'}
              className="text-xs font-bold text-charcoal-700 hover:text-charcoal-900 underline"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => {
              const prices = rel.agePrices?.map((p) => p.price) || [];
              const minP = prices.length > 0 ? Math.min(...prices) : 0;
              return (
                <Link
                  key={rel.id || rel.slug}
                  href={`/product/${rel.slug}`}
                  className="group rounded-3xl bg-white p-3 shadow-soft hover:shadow-soft-lg border border-cream-200 transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-cream-100 mb-3">
                    <Image
                      src={rel.images?.[0]?.url || '/images/hero-banner.jpg'}
                      alt={rel.name}
                      fill
                      sizes="300px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-charcoal-900 group-hover:text-baby-pink-dark transition-colors line-clamp-1">
                      {rel.name}
                    </h4>
                    <span className="text-xs font-bold text-charcoal-700 mt-1 block">
                      From ₹{minP.toLocaleString('en-IN')}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
