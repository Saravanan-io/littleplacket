import { NextRequest } from 'next/server';
import { readStore, writeStore, verifyAdminToken, jsonResponse, corsOptions } from '@/lib/db';
import { AgeOption } from '@/types';

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
    const targetKey = store.ages[id] ? id : Object.keys(store.ages || {}).find((k) => store.ages[k].id === id);

    if (!targetKey || !store.ages[targetKey]) {
      return jsonResponse({ success: false, message: 'Age bracket not found' }, 404);
    }

    const body = await req.json();
    const updated: AgeOption = {
      ...store.ages[targetKey],
      ...body,
      id: store.ages[targetKey].id || id,
    };

    store.ages[targetKey] = updated;
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
    const targetKey = store.ages[id] ? id : Object.keys(store.ages || {}).find((k) => store.ages[k].id === id);

    if (!targetKey || !store.ages[targetKey]) {
      return jsonResponse({ success: false, message: 'Age bracket not found' }, 404);
    }

    delete store.ages[targetKey];
    writeStore(store);

    return jsonResponse({ success: true, message: 'Age bracket deleted' });
  } catch (error: any) {
    return jsonResponse({ success: false, message: error.message || 'Server error' }, 500);
  }
}
