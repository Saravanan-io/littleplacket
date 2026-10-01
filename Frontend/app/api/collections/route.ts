import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { readStore, writeStore, slugify, verifyAdminToken, jsonResponse, corsOptions } from '@/lib/db';
import { Collection } from '@/types';

export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return corsOptions();
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get('active') === 'true';

    const store = readStore();
    let collections: Collection[] = Object.entries(store.collections || {}).map(([id, c]) => ({
      ...c,
      id: c.id || id,
    }));

    if (activeOnly) {
      collections = collections.filter((c) => c.active);
    }

    return jsonResponse({ success: true, data: collections });
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
    const { name, description, active } = body;

    if (!name) {
      return jsonResponse({ success: false, message: 'Collection name is required' }, 400);
    }

    const store = readStore();
    const newId = uuidv4().replace(/-/g, '').slice(0, 16);
    const slug = slugify(name);

    const newCollection: Collection = {
      id: newId,
      name: name.trim(),
      slug,
      description: description || '',
      active: active !== false,
    };

    store.collections[newId] = newCollection;
    writeStore(store);

    return jsonResponse({ success: true, data: newCollection }, 201);
  } catch (error: any) {
    return jsonResponse({ success: false, message: error.message || 'Server error' }, 500);
  }
}
