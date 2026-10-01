import React from 'react';
import type { Metadata } from 'next';
import CategoryPageClient from '../../components/CategoryPageClient';
import { fetchProducts, fetchAges, fetchCollections, fetchSettings } from '../../lib/api';

export const metadata: Metadata = {
  title: 'Baby Boys Collection — Kiddy Closet',
  description: 'Explore boutique baby boy clothes: rompers, linen sets, formal waistcoat suits, and cozy playsuits with age-wise pricing.',
};

export const dynamic = 'force-dynamic';

export default async function BoysPage() {
  const [products, ages, collections, settings] = await Promise.all([
    fetchProducts({ category: 'boys' }),
    fetchAges(),
    fetchCollections(),
    fetchSettings(),
  ]);

  return (
    <CategoryPageClient
      category="boys"
      initialProducts={products}
      ages={ages}
      collections={collections}
      whatsappNumber={settings.whatsappNumber}
    />
  );
}
