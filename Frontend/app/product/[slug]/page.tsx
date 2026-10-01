import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import ProductDetailClient from '../../../components/ProductDetailClient';
import { fetchProductBySlug, fetchProducts, fetchSettings } from '../../../lib/api';

export const dynamic = 'force-dynamic';

interface ProductPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await fetchProductBySlug(params.slug);
  if (!product) {
    return {
      title: 'Product Not Found — Kiddy Closet',
    };
  }

  return {
    title: `${product.name} — Kiddy Closet Baby Fashion`,
    description: product.description?.slice(0, 160),
    openGraph: {
      title: `${product.name} | Kiddy Closet`,
      description: product.description?.slice(0, 160),
      images: product.images?.map((img) => ({ url: img.url })),
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const [product, allProducts, settings] = await Promise.all([
    fetchProductBySlug(params.slug),
    fetchProducts(),
    fetchSettings(),
  ]);

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="text-5xl">🧸</div>
        <h1 className="text-3xl font-extrabold text-charcoal-900">Outfit Not Found</h1>
        <p className="text-charcoal-600 text-sm">
          The baby outfit you are looking for may have been updated or moved.
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="px-6 py-3 rounded-full bg-charcoal-900 text-white font-semibold text-sm shadow-soft inline-block"
          >
            Return to Catalogue
          </Link>
        </div>
      </div>
    );
  }

  // Filter related products (exclude current product)
  const related = allProducts
    .filter((p) => p.slug !== product.slug && (p.category === product.category || p.collection === product.collection))
    .slice(0, 4);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={related}
      whatsappNumber={settings.whatsappNumber}
    />
  );
}
