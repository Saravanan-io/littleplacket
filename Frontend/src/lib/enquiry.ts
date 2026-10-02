import { EnquiryItem } from '../types';
import { formatWhatsAppNumber } from './whatsapp';

const ENQUIRY_STORAGE_KEY = 'kiddy_selection_items';
const WISHLIST_STORAGE_KEY = 'kiddy_wishlist_ids';

export function getEnquiryItems(): EnquiryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ENQUIRY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveEnquiryItems(items: EnquiryItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ENQUIRY_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('kiddy_enquiry_updated'));
  } catch (e) {
    console.error('Failed to save enquiry items:', e);
  }
}

export function addItemToEnquiry(item: Omit<EnquiryItem, 'id'>): EnquiryItem[] {
  const current = getEnquiryItems();
  const newItem: EnquiryItem = {
    ...item,
    id: `${item.productId}-${item.size}-${item.color}-${Date.now()}`,
  };
  const updated = [newItem, ...current];
  saveEnquiryItems(updated);
  return updated;
}

export function removeItemFromEnquiry(id: string): EnquiryItem[] {
  const current = getEnquiryItems();
  const updated = current.filter((it) => it.id !== id);
  saveEnquiryItems(updated);
  return updated;
}

export function clearEnquiry(): void {
  saveEnquiryItems([]);
}

export function buildWhatsAppEnquiryUrl(
  items: EnquiryItem[],
  whatsappNumber: string = '919876543210'
): string {
  const cleanPhone = formatWhatsAppNumber(whatsappNumber);

  if (items.length === 0) {
    const defaultText = `Hi The Little Placket! 👋 I'm browsing your kids clothing catalogue and would like some assistance.`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultText)}`;
  }

  const itemsListText = items
    .map((item, idx) => {
      return `${idx + 1}. ${item.name}
   Size: ${item.size}
   Colour: ${item.color}
   Price: ₹${item.price}`;
    })
    .join('\n\n');

  const message = `Hi,

I'm interested in the following items:

${itemsListText}

Please share availability.

Thank you!`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function buildSingleProductWhatsAppUrl(
  productName: string,
  size: string,
  color: string = '',
  price: number,
  whatsappNumber: string = '919876543210'
): string {
  const cleanPhone = formatWhatsAppNumber(whatsappNumber);
  const colorLine = color ? `\n   Colour: ${color}` : '';
  const message = `Hi,

I'm interested in the following item:

1. ${productName}
   Size: ${size}${colorLine}
   Price: ₹${price}

Please share availability.

Thank you!`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

// Wishlist Helpers
export function getWishlist(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleWishlist(productId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const list = getWishlist();
    const exists = list.includes(productId);
    const updated = exists ? list.filter((id) => id !== productId) : [...list, productId];
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('kiddy_wishlist_updated'));
    return !exists;
  } catch {
    return false;
  }
}
