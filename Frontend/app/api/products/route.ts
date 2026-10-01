import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { readStore, writeStore, slugify, verifyAdminToken, jsonResponse, corsOptions } from '@/lib/db';
import { Product } from '@/types';

export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return corsOptions();
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const collection = searchParams.get('collection');
    const dressType = searchParams.get('dressType');
    const availability = searchParams.get('availability');
    const ageId = searchParams.get('ageId');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'featured';

    const store = readStore();
    let products: Product[] = Object.entries(store.products || {}).map(([id, p]) => ({
      ...p,
      id: p.id || id,
    }));

    if (category && category !== 'all') {
      products = products.filter((p) => p.category === category);
    }
    if (collection) {
      products = products.filter((p) => p.collection?.toLowerCase() === collection.toLowerCase());
    }
    if (dressType) {
      products = products.filter((p) => p.dressType?.toLowerCase() === dressType.toLowerCase());
    }
    if (availability && availability !== 'all') {
      products = products.filter((p) => p.availability === availability);
    }
    if (ageId) {
      products = products.filter((p) =>
        p.agePrices?.some((ap) => ap.ageId === ageId && ap.available)
      );
    }
    if (search) {
      const q = search.toLowerCase().trim();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.dressType?.toLowerCase().includes(q) ||
          p.collection?.toLowerCase().includes(q)
      );
    }

    // Sort
    products.sort((a, b) => {
      if (sortBy === 'price_asc') {
        const pa = a.agePrices?.[0]?.price || 0;
        const pb = b.agePrices?.[0]?.price || 0;
        return pa - pb;
      }
      if (sortBy === 'price_desc') {
        const pa = a.agePrices?.[0]?.price || 0;
        const pb = b.agePrices?.[0]?.price || 0;
        return pb - pa;
      }
      if (sortBy === 'newest') {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
      // 'featured'
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

    return jsonResponse({
      success: true,
      data: products,
      total: products.length,
    });
  } catch (error: any) {
    return jsonResponse({ success: false, message: error.message || 'Server error' }, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = verifyAdminToken(req.headers.get('authorization'));
    if (!admin) {
      return jsonResponse({ success: false, message: 'Unauthorized' }, 401);
    }

    const body = await req.json();
    const { name, category, description, dressType, collection, featured, agePrices, availability, images } = body;

    if (!name || !category) {
      return jsonResponse({ success: false, message: 'Name and category are required' }, 400);
    }

    const store = readStore();
    let slug = slugify(name);
    const existingSlugs = Object.values(store.products || {}).map((p) => p.slug);
    if (existingSlugs.includes(slug)) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const newId = uuidv4().replace(/-/g, '').slice(0, 20);
    const now = new Date().toISOString();

    const newProduct: Product = {
      id: newId,
      name: name.trim(),
      slug,
      category,
      description: description || '',
      dressType: dressType || '',
      collection: collection || '',
      featured: Boolean(featured),
      agePrices: agePrices || [],
      availability: availability || 'available',
      images: images || [],
      createdAt: now,
      updatedAt: now,
    };

    store.products[newId] = newProduct;
    writeStore(store);

    return jsonResponse({ success: true, data: newProduct }, 201);
  } catch (error: any) {
    return jsonResponse({ success: false, message: error.message || 'Server error' }, 500);
  }
}
