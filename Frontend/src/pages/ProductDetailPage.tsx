import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductDetailClient from '../components/ProductDetailClient';
import { fetchProductBySlug, fetchProducts, fetchSettings, DEFAULT_SETTINGS } from '../lib/api';
import { Product, BusinessSettings } from '../types';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [settings, setSettings] = useState<BusinessSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadProduct() {
      if (!slug) return;
      setLoading(true);
      try {
        const [prod, allProds, setRes] = await Promise.all([
          fetchProductBySlug(slug),
          fetchProducts(),
          fetchSettings(),
        ]);
        if (!isMounted) return;
        setProduct(prod);
        setSettings(setRes);

        if (prod) {
          const rel = allProds
            .filter(
              (p) =>
                p.id !== prod.id &&
                (p.slug || p.id) !== (prod.slug || prod.id) &&
                (p.category === prod.category || p.collection === prod.collection)
            )
            .slice(0, 4);
          setRelated(rel);
        }
      } catch (err) {
        console.error('Error fetching product detail:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadProduct();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50/50">
        <div className="flex flex-col items-center gap-3">
          <span className="text-4xl animate-bounce">🧸</span>
          <p className="text-xs font-bold text-charcoal-500 uppercase tracking-widest">
            Loading Outfit Details...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="text-5xl">🧸</div>
        <h1 className="text-3xl font-extrabold text-[#1B2A4A]">Outfit Not Found</h1>
        <p className="text-charcoal-600 text-sm">
          The baby outfit you are looking for may have been updated or moved.
        </p>
        <div className="pt-4">
          <Link
            to="/"
            className="px-6 py-3 rounded-full bg-charcoal-900 text-white font-semibold text-sm shadow-soft inline-block"
          >
            Return to Catalogue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={related}
      whatsappNumber={settings.whatsappNumber || '919876543210'}
    />
  );
}
