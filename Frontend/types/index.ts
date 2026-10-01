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

export interface ProductFilters {
  category?: Category | 'all';
  collection?: string;
  dressType?: string;
  availability?: Availability | 'all';
  minPrice?: number;
  maxPrice?: number;
  ageId?: string;
  search?: string;
  sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'newest';
}
