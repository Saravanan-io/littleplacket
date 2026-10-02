'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Hero from './Hero';
import CategoryCards from './CategoryCards';
import ProductCard from './ProductCard';
import { Product, AgeOption, Collection, BusinessSettings } from '../types';
import { fetchProducts, fetchSettings } from '../lib/api';

interface HomeClientProps {
  initialProducts: Product[];
  ages: AgeOption[];
  collections: Collection[];
  settings?: BusinessSettings;
  whatsappNumber: string;
}

export default function HomeClient({
  initialProducts,
  settings: initialSettings,
  whatsappNumber,
}: HomeClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [settings, setSettings] = useState<BusinessSettings | undefined>(initialSettings);

  // Live Sync with Admin Panel
  useEffect(() => {
    let isMounted = true;
    const syncData = async () => {
      try {
        const [freshProds, freshSettings] = await Promise.all([
          fetchProducts(),
          fetchSettings(),
        ]);
        if (isMounted) {
          if (freshProds && freshProds.length > 0) setProducts(freshProds);
          if (freshSettings) setSettings(freshSettings);
        }
      } catch (e) {
        // fallback
      }
    };

    window.addEventListener('focus', syncData);
    const interval = setInterval(syncData, 4000);
    return () => {
      isMounted = false;
      window.removeEventListener('focus', syncData);
      clearInterval(interval);
    };
  }, []);

  const featuredProducts = products.filter((p) => p.featured).slice(0, 6);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 6);

  return (
    <div className="space-y-6 sm:space-y-10 pb-28 lg:pb-16">
      {/* 1. HERO SECTION */}
      <Hero settings={settings} whatsappNumber={whatsappNumber} />

      {/* 2. BOYS & GIRLS CATEGORY CARDS + QUICK TAGS */}
      <CategoryCards settings={settings} />

      {/* 3. FEATURED PRODUCTS SHOWCASE */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A4A] tracking-tight">
              Featured Boutique Outfits
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-600 font-medium">
              Handcrafted with love, comfort, and pure organic fabrics.
            </p>
          </div>

          <Link
            href="/collections"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-purple-700 hover:text-purple-900 group"
          >
            <span>View All Outfits</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 2-column on mobile, 3-4 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {displayProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} whatsappNumber={whatsappNumber} />
          ))}
        </div>

        <div className="pt-4 text-center">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-charcoal-900 hover:bg-charcoal-800 text-white font-extrabold text-sm shadow-soft transition-all"
          >
            <span>Explore All Little Outfits</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
