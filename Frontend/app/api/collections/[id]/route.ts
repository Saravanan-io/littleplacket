import { NextRequest } from 'next/server';
import { readStore, writeStore, slugify, verifyAdminToken, jsonResponse, corsOptions } from '@/lib/db';
import { Collection } from '@/types';

export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return corsOptions();
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = verifyAdminToken(req.headers.get('authorization'));
    if (!admin) {
      return jsonResponse({ success: false, message: 'Unauthorized' }, 401);
    }

    const { id } = params;
    const store = readStore();
    const targetKey = store.collections[id] ? id : Object.keys(store.collections || {}).find((k) => store.collections[k].id === id);

    if (!targetKey || !store.collections[targetKey]) {
      return jsonResponse({ success: false, message: 'Collection not found' }, 404);
    }

    const body = await req.json();
    const existing = store.collections[targetKey];
    const updatedSlug = body.name ? slugify(body.name) : existing.slug;

    const updated: Collection = {
      ...existing,
      ...body,
      id: existing.id || id,
      slug: updatedSlug,
    };

    store.collections[targetKey] = updated;
    writeStore(store);

    return jsonResponse({ success: true, data: updated });
  } catch (error: any) {
    return jsonResponse({ success: false, message: error.message || 'Server error' }, 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = verifyAdminToken(req.headers.get('authorization'));
    if (!admin) {
      return jsonResponse({ success: false, message: 'Unauthorized' }, 401);
    }

    const { id } = params;
    const store = readStore();
    const targetKey = store.collections[id] ? id : Object.keys(store.collections || {}).find((k) => store.collections[k].id === id);

    if (!targetKey || !store.collections[targetKey]) {
      return jsonResponse({ success: false, message: 'Collection not found' }, 404);
    }

    delete store.collections[targetKey];
    writeStore(store);

    return jsonResponse({ success: true, message: 'Collection deleted' });
  } catch (error: any) {
    return jsonResponse({ success: false, message: error.message || 'Server error' }, 500);
  }
}
