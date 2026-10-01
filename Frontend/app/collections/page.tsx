import React from 'react';
import type { Metadata } from 'next';
import HomeClient from '../../components/HomeClient';
import { fetchProducts, fetchAges, fetchCollections, fetchSettings } from '../../lib/api';

export const metadata: Metadata = {
  title: 'All Collections — Kiddy Closet Baby Fashion',
  description: 'View the complete catalogue of premium baby fashion, organized by collections and ages.',
};

export const dynamic = 'force-dynamic';

export default async function CollectionsPage() {
  const [products, ages, collections, settings] = await Promise.all([
    fetchProducts(),
    fetchAges(),
    fetchCollections(),
    fetchSettings(),
  ]);

  return (
    <div className="pt-4">
      <HomeClient
        initialProducts={products}
        ages={ages}
        collections={collections}
        whatsappNumber={settings.whatsappNumber}
      />
    </div>
  );
}
