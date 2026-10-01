import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { readStore, writeStore, verifyAdminToken, jsonResponse, corsOptions } from '@/lib/db';
import { AgeOption } from '@/types';

export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return corsOptions();
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get('active') === 'true';

    const store = readStore();
    let ages: AgeOption[] = Object.entries(store.ages || {}).map(([id, a]) => ({
      ...a,
      id: a.id || id,
    }));

    if (activeOnly) {
      ages = ages.filter((a) => a.active);
    }

    ages.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    return jsonResponse({ success: true, data: ages });
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
    const { label, minMonths, maxMonths, active, sortOrder } = body;

    if (!label) {
      return jsonResponse({ success: false, message: 'Age label is required' }, 400);
    }

    const store = readStore();
    const newId = uuidv4().replace(/-/g, '').slice(0, 16);

    const newAge: AgeOption = {
      id: newId,
      label: label.trim(),
      minMonths: Number(minMonths) || 0,
      maxMonths: Number(maxMonths) || 12,
      active: active !== false,
      sortOrder: Number(sortOrder) || Object.keys(store.ages || {}).length,
    };

    store.ages[newId] = newAge;
    writeStore(store);

    return jsonResponse({ success: true, data: newAge }, 201);
  } catch (error: any) {
    return jsonResponse({ success: false, message: error.message || 'Server error' }, 500);
  }
}
