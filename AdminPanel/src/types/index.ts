export type Category = 'boys' | 'girls';
export type Availability = 'available' | 'limited' | 'out_of_stock' | 'coming_soon';

export interface AgePriceEntry {
  ageId: string;
  ageLabel: string;
  minMonths: number;
  maxMonths: number;
  price: number;
  available: boolean;
}

export interface ProductImage {
  url: string;
  publicId?: string;
  order: number;
  storagePath?: string;
}

export interface Product {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  category: Category;
  description: string;
  dressType: string;
  collection: string;
  images: ProductImage[];
  agePrices: AgePriceEntry[];
  availability: Availability;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AgeOption {
  id: string;
  label: string;
  minMonths: number;
  maxMonths: number;
  active: boolean;
  sortOrder: number;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  active: boolean;
}

export interface BusinessSettings {
  businessName: string;
  whatsappNumber: string;
  email: string;
  phone: string;
  instagramUrl: string;
  facebookUrl: string;
  address: string;
  logoUrl?: string;
  faviconUrl?: string;
  heroImages?: string[];
  homepageContent?: string;
  footerContent?: string;
}

export interface AdminUser {
  _id: string;
  email: string;
  name: string;
  role: string;
}

export type ScreenName =
  | 'dashboard'
  | 'products'
  | 'product-add'
  | 'product-edit'
  | 'ages'
  | 'collections'
  | 'settings';
