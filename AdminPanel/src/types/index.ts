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

export interface ProductColor {
  name: string;
  hex: string;
  thumbnail?: string;
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
  price: number;
  startingPrice?: string;
  sizes?: string[];
  ageGroup?: string;
  availableAges?: string[]; // e.g. ["2-3yr", "3-4yr", "4-5yr", "5-6yr", "6-7yr", "7-8yr", "8-9yr", "9-10yr", "10-11yr", "11-12yr"]
  whatsappNumber?: string;
  colors?: (string | ProductColor)[];
  images: ProductImage[];
  agePrices?: AgePriceEntry[];
  availability: Availability;
  featured?: boolean;
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
  address: string;
  whatsappNumber: string;
  phone: string;
  updatedAt?: string;
}

export interface AdminUser {
  id?: string;
  _id?: string;
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
