import {
  Product,
  AgeOption,
  Collection,
  BusinessSettings,
  AdminUser,
} from '../types';
import {
  uploadToFirebaseStorage,
  syncProductToFirebase,
  deleteProductFromFirebase,
  syncSettingsToFirebase,
  verifyFirebaseAdmin,
  syncAdminToFirebase,
} from './firebaseService';

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';


class ApiService {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('kiddy_admin_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('kiddy_admin_token', token);
      } else {
        localStorage.removeItem('kiddy_admin_token');
      }
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    return data;
  }

  // Auth
  async login(email: string, password: string): Promise<{ token: string; admin: AdminUser }> {
    // 1. Sync & Verify through Firebase Firestore / Realtime Database
    try {
      const fbRes = await verifyFirebaseAdmin(email, password);
      if (fbRes.success) {
        try {
          const res = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
          });
          this.setToken(res.data.token);
          return res.data;
        } catch (e) {
          const fallbackToken = 'fb_admin_session_' + Date.now();
          this.setToken(fallbackToken);
          return {
            token: fallbackToken,
            admin: fbRes.admin,
          };
        }
      }
    } catch (fbErr: any) {
      if (fbErr.message === 'Invalid email or password') {
        throw fbErr;
      }
      console.warn('Firebase login verification fallback:', fbErr);
    }

    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(res.data.token);
    return res.data;
  }

  async getMe(): Promise<AdminUser> {
    const res = await this.request('/auth/me');
    return res.data;
  }

  logout() {
    this.setToken(null);
  }

  // Dashboard Stats
  async getStats(): Promise<{ stats: any; recentProducts: Product[] }> {
    const res = await this.request('/products/admin/stats');
    return res.data;
  }

  // Products CRUD
  async getProducts(params: Record<string, any> = {}): Promise<Product[]> {
    const qs = new URLSearchParams(params).toString();
    const res = await this.request(`/products?${qs}`);
    return res.data || [];
  }

  async getProductById(id: string): Promise<Product> {
    const res = await this.request(`/products/id/${id}`);
    return res.data;
  }

  async createProduct(product: Partial<Product>): Promise<Product> {
    const res = await this.request('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
    const created = res.data;
    try {
      await syncProductToFirebase(created);
    } catch (fbErr) {
      console.warn('Firebase sync warning:', fbErr);
    }
    return created;
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const res = await this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
    const updated = res.data;
    try {
      await syncProductToFirebase(updated);
    } catch (fbErr) {
      console.warn('Firebase sync warning:', fbErr);
    }
    return updated;
  }

  async deleteProduct(id: string): Promise<void> {
    let product: Product | null = null;
    try {
      product = await this.getProductById(id);
    } catch (e) {}

    await this.request(`/products/${id}`, {
      method: 'DELETE',
    });
    try {
      await deleteProductFromFirebase(id, product?.images);
    } catch (fbErr) {
      console.warn('Firebase delete sync warning:', fbErr);
    }
  }

  // Image Upload using Firebase Storage
  async uploadImage(file: File): Promise<{ url: string; storagePath: string; publicId: string }> {
    try {
      // 1. Primary: Upload to Firebase Storage bucket (little-placket.firebasestorage.app)
      const fbRes = await uploadToFirebaseStorage(file);
      // Also upload to local server for local redundancy
      try {
        const formData = new FormData();
        formData.append('image', file);
        await this.request('/products/upload/image', {
          method: 'POST',
          body: formData,
        });
      } catch (e) {
        // local backend fallback ignore if offline
      }
      return fbRes;
    } catch (err) {
      console.warn('Firebase storage upload fallback to local backend:', err);
      const formData = new FormData();
      formData.append('image', file);
      const res = await this.request('/products/upload/image', {
        method: 'POST',
        body: formData,
      });
      return res.data;
    }
  }


  // Ages CRUD
  async getAges(): Promise<AgeOption[]> {
    const res = await this.request('/ages');
    return res.data || [];
  }

  async createAge(age: Partial<AgeOption>): Promise<AgeOption> {
    const res = await this.request('/ages', {
      method: 'POST',
      body: JSON.stringify(age),
    });
    return res.data;
  }

  async updateAge(id: string, age: Partial<AgeOption>): Promise<AgeOption> {
    const res = await this.request(`/ages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(age),
    });
    return res.data;
  }

  async deleteAge(id: string): Promise<void> {
    await this.request(`/ages/${id}`, {
      method: 'DELETE',
    });
  }

  // Collections CRUD
  async getCollections(): Promise<Collection[]> {
    const res = await this.request('/collections');
    return res.data || [];
  }

  async createCollection(collection: Partial<Collection>): Promise<Collection> {
    const res = await this.request('/collections', {
      method: 'POST',
      body: JSON.stringify(collection),
    });
    return res.data;
  }

  async updateCollection(id: string, collection: Partial<Collection>): Promise<Collection> {
    const res = await this.request(`/collections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(collection),
    });
    return res.data;
  }

  async deleteCollection(id: string): Promise<void> {
    await this.request(`/collections/${id}`, {
      method: 'DELETE',
    });
  }

  // Settings
  async getSettings(): Promise<BusinessSettings> {
    const res = await this.request('/settings');
    return res.data;
  }

  async updateSettings(settings: Partial<BusinessSettings>): Promise<BusinessSettings> {
    const res = await this.request('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });

    try {
      await syncSettingsToFirebase(res.data || settings);
    } catch (firebaseErr) {
      console.warn('Firebase settings sync warning:', firebaseErr);
    }

    return res.data;
  }
}

export const api = new ApiService();
