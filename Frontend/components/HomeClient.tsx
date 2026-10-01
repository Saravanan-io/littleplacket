'use client';

import React, { useState, useEffect } from 'react';
import Hero from './Hero';
import CategoryCards from './CategoryCards';
import FilterBar from './FilterBar';
import ProductGrid from './ProductGrid';
import { Product, AgeOption, Collection, ProductFilters } from '../types';
import { Sparkles, Heart, ShieldCheck, MessageCircle, Truck } from 'lucide-react';
import Link from 'next/link';
import { fetchProducts } from '../lib/api';

interface HomeClientProps {
  initialProducts: Product[];
  ages: AgeOption[];
  collections: Collection[];
  whatsappNumber: string;
}

export default function HomeClient({
  initialProducts,
  ages,
  collections,
  whatsappNumber,
}: HomeClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filters, setFilters] = useState<ProductFilters>({
    category: 'all',
    collection: '',
    dressType: '',
    availability: 'all',
    ageId: '',
    search: '',
    sortBy: 'featured',
  });

  // Live Sync: Re-fetch products when tab gains focus or every 3 seconds so admin edits show instantly
  useEffect(() => {
    let isMounted = true;
    const syncProducts = async () => {
      try {
        const fresh = await fetchProducts();
        if (fresh && fresh.length > 0 && isMounted) {
          setProducts(fresh);
        }
      } catch (e) {
        // silently fallback to current state
      }
    };

    const handleFocus = () => syncProducts();
    window.addEventListener('focus', handleFocus);
    const interval = setInterval(syncProducts, 3000);

    return () => {
      isMounted = false;
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  const dressTypes = Array.from(
    new Set(products.map((p) => p.dressType).filter(Boolean))
  );

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Section */}
      <Hero whatsappNumber={whatsappNumber} />

      {/* 2. Boy & Girl Category Showcases */}
      <CategoryCards />

      {/* 3. Catalogue Section with Live Filter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream-200 text-charcoal-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3 h-3 text-gold-500 fill-gold-500" />
            <span>Complete Boutique Catalogue</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 tracking-tight">
            Explore All Little Outfits
          </h2>
          <p className="text-charcoal-600 mt-2 text-sm sm:text-base">
            Select an age or search styles to check sizes and transparent pricing.
          </p>
        </div>

        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          ages={ages}
          collections={collections}
          dressTypes={dressTypes}
        />

        <ProductGrid
          products={products}
          filters={filters}
          whatsappNumber={whatsappNumber}
        />
      </section>

      {/* 4. How Catalogue Ordering Works on WhatsApp */}
      <section className="py-16 bg-cream-100/60 border-y border-cream-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-baby-pink-dark">
              Simplicity & Personal Touch
            </span>
            <h2 className="text-3xl font-extrabold text-charcoal-900 mt-1">
              How Ordering Works via WhatsApp
            </h2>
            <p className="text-charcoal-600 mt-2 text-sm">
              We skip impersonal checkouts and confusing bots so you get genuine styling advice for your baby.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-6 shadow-soft border border-cream-200 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-baby-blue/80 text-blue-800 flex items-center justify-center text-2xl mx-auto font-black shadow-sm">
                1
              </div>
              <h3 className="text-lg font-bold text-charcoal-900">Choose Outfit & Size</h3>
              <p className="text-sm text-charcoal-600 leading-relaxed">
                Browse our catalogue and select your little one's age range to view exact prices and current availability.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-soft border border-cream-200 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center text-2xl mx-auto font-black shadow-sm">
                2
              </div>
              <h3 className="text-lg font-bold text-charcoal-900">Tap "Enquire on WhatsApp"</h3>
              <p className="text-sm text-charcoal-600 leading-relaxed">
                Your message is pre-filled with the outfit photo link, size, and price. No typing or guesswork required!
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-soft border border-cream-200 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-baby-pink/80 text-pink-800 flex items-center justify-center text-2xl mx-auto font-black shadow-sm">
                3
              </div>
              <h3 className="text-lg font-bold text-charcoal-900">Confirm & Doorstep Delivery</h3>
              <p className="text-sm text-charcoal-600 leading-relaxed">
                Our concierge confirms sizing, safely packs the outfit with delicate boutique wrapping, and dispatches to your doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Trust & Quality Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-4xl bg-gradient-to-r from-baby-peach/50 via-cream-100 to-baby-mint/50 p-8 sm:p-12 border border-cream-200/80 shadow-soft flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-charcoal-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>The Kiddy Closet Promise</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">
              Only The Softest Touch for Delicate Baby Skin
            </h3>
            <p className="text-sm text-charcoal-600 leading-relaxed">
              Every outfit in our collection is rigorously screened for itch-free seams, nickel-free snaps, and breathable certified organic cotton fibers.
            </p>
          </div>
          <Link
            href="/collections"
            className="shrink-0 px-8 py-4 rounded-full bg-charcoal-900 hover:bg-charcoal-800 text-white font-semibold text-sm shadow-soft transition-all transform hover:-translate-y-0.5"
          >
            Explore Complete Range ✨
          </Link>
        </div>
      </section>
    </div>
  );
}
