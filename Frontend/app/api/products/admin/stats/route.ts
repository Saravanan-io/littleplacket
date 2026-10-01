import { NextRequest } from 'next/server';
import { readStore, verifyAdminToken, jsonResponse, corsOptions } from '@/lib/db';
import { Product } from '@/types';

export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return corsOptions();
}

export async function GET(req: NextRequest) {
  try {
    const admin = verifyAdminToken(req.headers.get('authorization'));
    if (!admin) {
      return jsonResponse({ success: false, message: 'Unauthorized' }, 401);
    }

    const store = readStore();
    const products: Product[] = Object.entries(store.products || {}).map(([id, p]) => ({
      ...p,
      id: p.id || id,
    }));

    const totalProducts = products.length;
    const boysCount = products.filter((p) => p.category === 'boys').length;
    const girlsCount = products.filter((p) => p.category === 'girls').length;
    const featuredCount = products.filter((p) => p.featured).length;
    const availableCount = products.filter((p) => p.availability === 'available').length;

    const recentProducts = [...products]
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 5);

    return jsonResponse({
      success: true,
      data: {
        stats: {
          totalProducts,
          boysCount,
          girlsCount,
          featuredCount,
          availableCount,
        },
        recentProducts,
      },
    });
  } catch (error: any) {
    return jsonResponse({ success: false, message: error.message || 'Server error' }, 500);
  }
}
