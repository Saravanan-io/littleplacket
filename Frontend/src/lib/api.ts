import { collection, doc, getDocs, getDoc, onSnapshot } from 'firebase/firestore';
import { ref, get, onValue } from 'firebase/database';
import { db, rtdb } from './firebase';
import { Product, AgeOption, Collection, BusinessSettings } from '../types';

export const DEFAULT_SETTINGS: BusinessSettings = {
  address: 'Shop 14, Lilac Arcade, Blossom Street, Bandra West, Mumbai 400050',
  whatsappNumber: '919876543210',
  phone: '+91 98765 43210',
};

/**
 * Subscribe to Real-time Product updates from Firebase
 */
export function subscribeProducts(callback: (products: Product[]) => void): () => void {
  try {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const products: Product[] = snapshot.docs.map((docSnap) => ({
        ...(docSnap.data() as Product),
        id: docSnap.id,
      }));
      callback(products);
    }, (err) => {
      console.warn('Firestore real-time products warning, subscribing to RTDB fallback:', err);
      onValue(ref(rtdb, 'products'), (rtdbSnap) => {
        if (rtdbSnap.exists()) {
          const prods = Object.entries(rtdbSnap.val()).map(([id, p]: [string, any]) => ({ ...p, id }));
          callback(prods);
        }
      });
    });
    return unsubscribe;
  } catch (err) {
    return () => {};
  }
}

/**
 * Subscribe to Real-time Settings updates from Firebase
 */
export function subscribeSettings(callback: (settings: BusinessSettings) => void): () => void {
  try {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'business'), (docSnap) => {
      if (docSnap.exists()) {
        callback({ ...DEFAULT_SETTINGS, ...(docSnap.data() as BusinessSettings) });
      }
    }, (err) => {
      console.warn('Firestore real-time settings warning:', err);
      onValue(ref(rtdb, 'settings/business'), (rtdbSnap) => {
        if (rtdbSnap.exists()) {
          callback({ ...DEFAULT_SETTINGS, ...rtdbSnap.val() });
        }
      });
    });
    return unsubscribe;
  } catch (err) {
    return () => {};
  }
}

export async function fetchProducts(filters: Record<string, any> = {}): Promise<Product[]> {
  try {
    // 1. Fetch from Firestore
    const snapshot = await getDocs(collection(db, 'products'));
    let products: Product[] = snapshot.docs.map((docSnap) => ({
      ...(docSnap.data() as Product),
      id: docSnap.id,
    }));

    // 2. Realtime DB fallback if Firestore empty
    if (!products.length) {
      const rtdbSnapshot = await get(ref(rtdb, 'products'));
      if (rtdbSnapshot.exists()) {
        const data = rtdbSnapshot.val();
        products = Object.entries(data).map(([id, p]: [string, any]) => ({
          ...p,
          id,
        }));
      }
    }

    // In-memory filter & sort
    const { category, availability, onlyAvailable, ageGroup, search, sortBy = 'featured' } = filters;

    if (category && category !== 'all') {
      products = products.filter((p) => p.category === category);
    }
    if (onlyAvailable === 'true' || availability === 'available') {
      products = products.filter((p) => p.availability === 'available');
    }
    if (ageGroup) {
      products = products.filter((p) => p.availableAges?.includes(ageGroup) || p.ageGroup === ageGroup);
    }
    if (search) {
      const q = search.toLowerCase().trim();
      products = products.filter((p) => p.name?.toLowerCase().includes(q) || p.dressType?.toLowerCase().includes(q));
    }

    products.sort((a, b) => {
      if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
      if (sortBy === 'a-z') return (a.name || '').localeCompare(b.name || '');
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

    return products;
  } catch (error) {
    console.warn('fetchProducts Firebase error:', error);
    return [];
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const products = await fetchProducts();
    const cleanSlug = decodeURIComponent(slug).toLowerCase();
    return (
      products.find((p) => {
        if (!p) return false;
        const pSlug = p.slug?.toLowerCase();
        const pId = p.id?.toLowerCase();
        const nameSlug = p.name ? p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : '';
        return pSlug === cleanSlug || pId === cleanSlug || nameSlug === cleanSlug;
      }) || null
    );
  } catch (error) {
    return null;
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const docSnap = await getDoc(doc(db, 'products', id));
    if (docSnap.exists()) {
      return { ...(docSnap.data() as Product), id: docSnap.id };
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function fetchAges(): Promise<AgeOption[]> {
  try {
    const snapshot = await getDocs(collection(db, 'ages'));
    let ages: AgeOption[] = snapshot.docs.map((d) => ({ ...(d.data() as AgeOption), id: d.id }));
    if (!ages.length) {
      const rtdbSnap = await get(ref(rtdb, 'ages'));
      if (rtdbSnap.exists()) {
        ages = Object.entries(rtdbSnap.val()).map(([id, a]: [string, any]) => ({ ...a, id }));
      }
    }
    return ages.filter((a) => a.active).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  } catch (error) {
    return [];
  }
}

export async function fetchCollections(): Promise<Collection[]> {
  try {
    const snapshot = await getDocs(collection(db, 'collections'));
    let cols: Collection[] = snapshot.docs.map((d) => ({ ...(d.data() as Collection), id: d.id }));
    if (!cols.length) {
      const rtdbSnap = await get(ref(rtdb, 'collections'));
      if (rtdbSnap.exists()) {
        cols = Object.entries(rtdbSnap.val()).map(([id, c]: [string, any]) => ({ ...c, id }));
      }
    }
    return cols.filter((c) => c.active);
  } catch (error) {
    return [];
  }
}

export async function fetchSettings(): Promise<BusinessSettings> {
  try {
    const docSnap = await getDoc(doc(db, 'settings', 'business'));
    if (docSnap.exists()) {
      return { ...DEFAULT_SETTINGS, ...(docSnap.data() as BusinessSettings) };
    }
    const rtdbSnap = await get(ref(rtdb, 'settings/business'));
    if (rtdbSnap.exists()) {
      return { ...DEFAULT_SETTINGS, ...rtdbSnap.val() };
    }
    return DEFAULT_SETTINGS;
  } catch (error) {
    return DEFAULT_SETTINGS;
  }
}
