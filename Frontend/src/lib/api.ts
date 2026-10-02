import { Product, AgeOption, Collection, BusinessSettings } from '../types';

const getApiBase = () => {
  if (typeof window !== 'undefined') return '/api';
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
};

export const DEFAULT_SETTINGS: BusinessSettings = {
  businessName: 'THE LITTLE PLACKET',
  tagline: 'LITTLE OUTFITS FOR BIG ADVENTURES',
  heroHeadlineLittle: 'The',
  heroHeadlineStyles: 'Little',
  heroHeadlineBigSmiles: 'Placket',
  heroSupportingText: 'Little outfits for big adventures.',
  heroImage: '/images/the-little-placket-banner.png',
  boysCardTitle: 'BOYS',
  boysCardSubtitle: 'Collection',
  boysCardDescription: 'Trendy outfits for every occasion',
  boysCardImage: '/images/products/boy-check-shirt.jpg',
  girlsCardTitle: 'GIRLS',
  girlsCardSubtitle: 'Collection',
  girlsCardDescription: 'Pretty outfits for every little star',
  girlsCardImage: '/images/products/girl-floral-bow-frock.jpg',
  quickCard1Title: 'NEW ARRIVALS',
  quickCard1Desc: 'Fresh 2026 Styles',
  quickCard2Title: 'BEST SELLERS',
  quickCard2Desc: 'Loved by Parents',
  quickCard3Title: 'OFFERS',
  quickCard3Desc: 'Special Boutique Bundles',
  whatsappNumber: '919876543210',
  email: 'hello@thelittleplacket.com',
  phone: '+91 98765 43210',
  instagramUrl: 'https://instagram.com/thelittleplacket',
  facebookUrl: 'https://facebook.com/thelittleplacket',
  address: 'Shop 14, Lilac Arcade, Blossom Street, Bandra West, Mumbai 400050',
  announcementText: '✨ Exclusive Catalogue Platform — Handcrafted Kids & Baby Outfits — Direct WhatsApp Assistance',
  footerContent: '© 2026 THE LITTLE PLACKET. Little Outfits for Big Adventures. All rights reserved.',
};

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 2500): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const separator = url.includes('?') ? '&' : '?';
    const freshUrl = `${url}${separator}_t=${Date.now()}`;
    const res = await fetch(freshUrl, {
      ...options,
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        ...(options.headers || {}),
      },
      signal: controller.signal,
    });
    clearTimeout(id);
    return res;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export async function fetchProducts(filters: Record<string, any> = {}): Promise<Product[]> {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '' && val !== 'all') {
        params.append(key, String(val));
      }
    });

    const res = await fetchWithTimeout(`${getApiBase()}/products?${params.toString()}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    return [];
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await fetchWithTimeout(`${getApiBase()}/products/${slug}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    return null;
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const res = await fetchWithTimeout(`${getApiBase()}/products/id/${id}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    return null;
  }
}

export async function fetchAges(): Promise<AgeOption[]> {
  try {
    const res = await fetchWithTimeout(`${getApiBase()}/ages?active=true`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    return [];
  }
}

export async function fetchCollections(): Promise<Collection[]> {
  try {
    const res = await fetchWithTimeout(`${getApiBase()}/collections?active=true`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    return [];
  }
}

export async function fetchSettings(): Promise<BusinessSettings> {
  try {
    const res = await fetchWithTimeout(`${getApiBase()}/settings`);
    if (!res.ok) return DEFAULT_SETTINGS;
    const json = await res.json();
    return { ...DEFAULT_SETTINGS, ...(json.data || {}) };
  } catch (error) {
    return DEFAULT_SETTINGS;
  }
}
