import { NextRequest } from 'next/server';
import { readStore, writeStore, slugify, verifyAdminToken, jsonResponse, corsOptions } from '@/lib/db';
import { Product } from '@/types';

export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return corsOptions();
}

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    const store = readStore();
    const products = Object.entries(store.products || {}).map(([id, p]) => ({ ...p, id: p.id || id }));

    // Find by slug first, then by id
    const product = products.find((p) => p.slug === slug || p.id === slug);

    if (!product) {
      return jsonResponse({ success: false, message: 'Product not found' }, 404);
    }

    return jsonResponse({ success: true, data: product });
  } catch (error: any) {
    return jsonResponse({ success: false, message: error.message || 'Server error' }, 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const admin = verifyAdminToken(req.headers.get('authorization'));
    if (!admin) {
      return jsonResponse({ success: false, message: 'Unauthorized' }, 401);
    }

    const id = params.slug; // In admin PUT /api/products/:id, the param is the product id
    const store = readStore();
    const existing = store.products[id] || Object.values(store.products).find((p) => p.id === id);

    if (!existing) {
      return jsonResponse({ success: false, message: 'Product not found' }, 404);
    }

    const body = await req.json();
    const targetKey = store.products[id] ? id : Object.keys(store.products).find((k) => store.products[k].id === id) || id;

    // Check if name changed to update slug
    let updatedSlug = existing.slug;
    if (body.name && body.name.trim() !== existing.name) {
      updatedSlug = slugify(body.name);
    }

    const updatedProduct: Product = {
      ...existing,
      ...body,
      id: existing.id || id,
      slug: updatedSlug,
      updatedAt: new Date().toISOString(),
    };

    store.products[targetKey] = updatedProduct;
    writeStore(store);

    return jsonResponse({ success: true, data: updatedProduct });
  } catch (error: any) {
    return jsonResponse({ success: false, message: error.message || 'Server error' }, 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const admin = verifyAdminToken(req.headers.get('authorization'));
    if (!admin) {
      return jsonResponse({ success: false, message: 'Unauthorized' }, 401);
    }

    const id = params.slug;
    const store = readStore();
    const targetKey = store.products[id] ? id : Object.keys(store.products).find((k) => store.products[k].id === id);

    if (!targetKey || !store.products[targetKey]) {
      return jsonResponse({ success: false, message: 'Product not found' }, 404);
    }

    delete store.products[targetKey];
    writeStore(store);

    return jsonResponse({ success: true, message: 'Product deleted' });
  } catch (error: any) {
    return jsonResponse({ success: false, message: error.message || 'Server error' }, 500);
  }
}
