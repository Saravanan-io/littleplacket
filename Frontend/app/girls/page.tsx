import React from 'react';
import type { Metadata } from 'next';
import CategoryPageClient from '../../components/CategoryPageClient';
import { fetchProducts, fetchAges, fetchCollections, fetchSettings } from '../../lib/api';

export const metadata: Metadata = {
  title: 'Baby Girls Collection — Kiddy Closet',
  description: 'Explore boutique baby girl clothes: tiered tulle frocks, watercolor sundresses, and chiffon party gowns with age-wise pricing.',
};

export const dynamic = 'force-dynamic';

export default async function GirlsPage() {
  const [products, ages, collections, settings] = await Promise.all([
    fetchProducts({ category: 'girls' }),
    fetchAges(),
    fetchCollections(),
    fetchSettings(),
  ]);

  return (
    <CategoryPageClient
      category="girls"
      initialProducts={products}
      ages={ages}
      collections={collections}
      whatsappNumber={settings.whatsappNumber}
    />
  );
}
