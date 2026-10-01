import { Product, AgeOption, Collection, BusinessSettings } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 3000): Promise<Response> {
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

    const res = await fetchWithTimeout(`${API_BASE}/products?${params.toString()}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    return [];
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/products/${slug}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    return null;
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/products/id/${id}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    return null;
  }
}

export async function fetchAges(): Promise<AgeOption[]> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/ages?active=true`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    return [];
  }
}

export async function fetchCollections(): Promise<Collection[]> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/collections?active=true`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    return [];
  }
}

export async function fetchSettings(): Promise<BusinessSettings> {
  const fallbackSettings: BusinessSettings = {
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

  try {
    const res = await fetchWithTimeout(`${API_BASE}/settings`);
    if (!res.ok) return fallbackSettings;
    const json = await res.json();
    return json.data || fallbackSettings;
  } catch (error) {
    return fallbackSettings;
  }
}
