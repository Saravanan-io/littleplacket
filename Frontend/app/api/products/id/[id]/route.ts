import { NextRequest } from 'next/server';
import { readStore, jsonResponse, corsOptions } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return corsOptions();
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const store = readStore();
    const product = store.products[id] || Object.values(store.products || {}).find((p) => p.id === id);

    if (!product) {
      return jsonResponse({ success: false, message: 'Product not found' }, 404);
    }

    return jsonResponse({ success: true, data: { ...product, id: product.id || id } });
  } catch (error: any) {
    return jsonResponse({ success: false, message: error.message || 'Server error' }, 500);
  }
}
