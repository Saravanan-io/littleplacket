import React from 'react';
import HomeClient from '../components/HomeClient';
import { fetchProducts, fetchAges, fetchCollections, fetchSettings } from '../lib/api';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [products, ages, collections, settings] = await Promise.all([
    fetchProducts(),
    fetchAges(),
    fetchCollections(),
    fetchSettings(),
  ]);

  return (
    <HomeClient
      initialProducts={products}
      ages={ages}
      collections={collections}
      whatsappNumber={settings.whatsappNumber}
    />
  );
}
