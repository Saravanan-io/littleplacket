import { NextRequest } from 'next/server';
import { readStore, writeStore, verifyAdminToken, jsonResponse, corsOptions } from '@/lib/db';
import { BusinessSettings } from '@/types';

export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return corsOptions();
}

export async function GET() {
  try {
    const store = readStore();
    const settings = store.settings?.business || {
      businessName: 'Kiddy Closet',
      whatsappNumber: '919876543210',
      email: 'hello@kiddycloset.com',
      phone: '+91 98765 43210',
      instagramUrl: 'https://instagram.com/kiddycloset',
      facebookUrl: 'https://facebook.com/kiddycloset',
      address: 'Shop 14, Lilac Arcade, Blossom Street, Bandra West, Mumbai 400050',
      heroImages: ['/images/hero-banner.jpg'],
      homepageContent: 'Handcrafted luxury baby fashion designed with love, organic cotton, and timeless silhouettes.',
      footerContent: '© 2026 Kiddy Closet. Little Styles, Big Smiles. All rights reserved.',
    };

    return jsonResponse({ success: true, data: settings });
  } catch (error: any) {
    return jsonResponse({ success: false, message: error.message || 'Server error' }, 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = verifyAdminToken(req.headers.get('authorization'));
    if (!admin) {
      return jsonResponse({ success: false, message: 'Unauthorized' }, 401);
    }

    const body = await req.json();
    const store = readStore();
    const current = store.settings?.business || {};

    const updated: BusinessSettings = {
      ...current,
      ...body,
    };

    if (!store.settings) store.settings = {} as any;
    store.settings.business = updated;
    writeStore(store);

    return jsonResponse({ success: true, data: updated });
  } catch (error: any) {
    return jsonResponse({ success: false, message: error.message || 'Server error' }, 500);
  }
}
