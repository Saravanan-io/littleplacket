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
  price: number; // FIXED Price (e.g. 749)
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
  businessName: string;
  tagline: string;
  whatsappNumber: string;
  email: string;
  phone: string;
  instagramUrl: string;
  facebookUrl: string;
  address: string;
  logoUrl?: string;
  faviconUrl?: string;
  heroHeadlineLittle?: string;
  heroHeadlineStyles?: string;
  heroHeadlineBigSmiles?: string;
  heroSupportingText?: string;
  heroImage?: string;
  heroImages?: string[];
  boysCardTitle?: string;
  boysCardSubtitle?: string;
  boysCardDescription?: string;
  boysCardImage?: string;
  girlsCardTitle?: string;
  girlsCardSubtitle?: string;
  girlsCardDescription?: string;
  girlsCardImage?: string;
  quickCard1Title?: string;
  quickCard1Desc?: string;
  quickCard2Title?: string;
  quickCard2Desc?: string;
  quickCard3Title?: string;
  quickCard3Desc?: string;
  announcementText?: string;
  homepageContent?: string;
  footerContent?: string;
  updatedAt?: string;
}

export interface ProductFilters {
  category?: Category | 'all';
  collection?: string;
  dressType?: string;
  availability?: Availability | 'all';
  ageGroup?: string;
  size?: string;
  priceRange?: string; // 'below-500' | '500-750' | '750-1000' | '1000-plus' | ''
  color?: string;
  onlyAvailable?: boolean;
  minPrice?: number;
  maxPrice?: number;
  ageId?: string;
  search?: string;
  sortBy?: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'a-z';
}

export interface EnquiryItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  size: string;
  color: string;
  price: number;
  quantity?: number;
}
