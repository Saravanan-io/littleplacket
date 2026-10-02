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
  getProductsFromFirebase,
  getProductByIdFromFirebase,
  deleteProductFromFirebase,
  getAgesFromFirebase,
  saveAgeToFirebase,
  deleteAgeFromFirebase,
  getCollectionsFromFirebase,
  saveCollectionToFirebase,
  deleteCollectionFromFirebase,
  getSettingsFromFirebase,
  syncSettingsToFirebase,
  verifyFirebaseAdmin,
} from './firebaseService';

class ApiService {
  private token: string | null = null;
  private currentAdmin: AdminUser | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('kiddy_admin_token');
      const savedAdmin = localStorage.getItem('kiddy_admin_user');
      if (savedAdmin) {
        try {
          this.currentAdmin = JSON.parse(savedAdmin);
        } catch (e) {}
      }
    }
  }

  setToken(token: string | null, admin?: AdminUser | null) {
    this.token = token;
    this.currentAdmin = admin || null;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('kiddy_admin_token', token);
        if (admin) {
          localStorage.setItem('kiddy_admin_user', JSON.stringify(admin));
        }
      } else {
        localStorage.removeItem('kiddy_admin_token');
        localStorage.removeItem('kiddy_admin_user');
      }
    }
  }

  getToken(): string | null {
    return this.token;
  }

  // Auth
  async login(email: string, password: string): Promise<{ token: string; admin: AdminUser }> {
    const fbRes = await verifyFirebaseAdmin(email, password);
    if (fbRes.success) {
      const token = 'fb_admin_session_' + Date.now();
      this.setToken(token, fbRes.admin);
      return { token, admin: fbRes.admin };
    }
    throw new Error('Invalid email or password');
  }

  async getMe(): Promise<AdminUser> {
    if (this.currentAdmin) return this.currentAdmin;
    return {
      id: 'admin_main',
      email: 'admin@littleplacket.com',
      name: 'Little Placket Admin',
      role: 'superadmin',
    };
  }

  logout() {
    this.setToken(null, null);
  }

  // Dashboard Stats
  async getStats(): Promise<{ stats: any; recentProducts: Product[] }> {
    const products = await getProductsFromFirebase();
    const totalProducts = products.length;
    const boysCount = products.filter((p) => p.category === 'boys').length;
    const girlsCount = products.filter((p) => p.category === 'girls').length;
    const availableCount = products.filter((p) => p.availability === 'available').length;

    const recentProducts = [...products]
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 5);

    return {
      stats: {
        total: totalProducts,
        totalProducts,
        boys: boysCount,
        boysCount,
        girls: girlsCount,
        girlsCount,
        availableCount,
      },
      recentProducts,
    };
  }

  // Products CRUD
  async getProducts(params: Record<string, any> = {}): Promise<Product[]> {
    let products = await getProductsFromFirebase();
    const { category, availability, onlyAvailable, ageGroup, search, sortBy = 'featured' } = params;

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
  }

  async getProductById(id: string): Promise<Product> {
    return await getProductByIdFromFirebase(id);
  }

  async createProduct(product: Partial<Product>): Promise<Product> {
    return await syncProductToFirebase(product);
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    return await syncProductToFirebase({ ...product, id });
  }

  async deleteProduct(id: string): Promise<void> {
    let product: Product | null = null;
    try {
      product = await this.getProductById(id);
    } catch (e) {}
    await deleteProductFromFirebase(id, product?.images);
  }

  // Image Upload using Firebase Storage
  async uploadImage(file: File): Promise<{ url: string; storagePath: string; publicId: string }> {
    return await uploadToFirebaseStorage(file);
  }

  // Ages CRUD
  async getAges(): Promise<AgeOption[]> {
    return await getAgesFromFirebase();
  }

  async createAge(age: Partial<AgeOption>): Promise<AgeOption> {
    return await saveAgeToFirebase(age);
  }

  async updateAge(id: string, age: Partial<AgeOption>): Promise<AgeOption> {
    return await saveAgeToFirebase({ ...age, id });
  }

  async deleteAge(id: string): Promise<void> {
    await deleteAgeFromFirebase(id);
  }

  // Collections CRUD
  async getCollections(): Promise<Collection[]> {
    return await getCollectionsFromFirebase();
  }

  async createCollection(collection: Partial<Collection>): Promise<Collection> {
    return await saveCollectionToFirebase(collection);
  }

  async updateCollection(id: string, collection: Partial<Collection>): Promise<Collection> {
    return await saveCollectionToFirebase({ ...collection, id });
  }

  async deleteCollection(id: string): Promise<void> {
    await deleteCollectionFromFirebase(id);
  }

  // Settings
  async getSettings(): Promise<BusinessSettings> {
    return await getSettingsFromFirebase();
  }

  async updateSettings(settings: Partial<BusinessSettings>): Promise<BusinessSettings> {
    await syncSettingsToFirebase(settings);
    return await getSettingsFromFirebase();
  }
}

export const api = new ApiService();
