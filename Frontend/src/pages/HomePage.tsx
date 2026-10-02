import React, { useState, useEffect } from 'react';
import HomeClient from '../components/HomeClient';
import { fetchProducts, fetchAges, fetchCollections, fetchSettings, DEFAULT_SETTINGS } from '../lib/api';
import { Product, AgeOption, Collection, BusinessSettings } from '../types';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [ages, setAges] = useState<AgeOption[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [settings, setSettings] = useState<BusinessSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [prodRes, ageRes, colRes, setRes] = await Promise.all([
          fetchProducts(),
          fetchAges(),
          fetchCollections(),
          fetchSettings(),
        ]);
        if (!isMounted) return;
        setProducts(prodRes);
        setAges(ageRes);
        setCollections(colRes);
        setSettings(setRes);
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50/50">
        <div className="flex flex-col items-center gap-3">
          <span className="text-4xl animate-bounce">🧸</span>
          <p className="text-xs font-bold text-charcoal-500 uppercase tracking-widest">
            Loading Little Outfits...
          </p>
        </div>
      </div>
    );
  }

  return (
    <HomeClient
      initialProducts={products}
      ages={ages}
      collections={collections}
      settings={settings}
      whatsappNumber={settings.whatsappNumber || '919876543210'}
    />
  );
}
