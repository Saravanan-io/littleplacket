import { Product, AgePriceEntry } from '../types';

export function formatWhatsAppNumber(phone: string): string {
  return phone.replace(/[^\d]/g, '');
}

export function createProductEnquiryUrl(
  phone: string,
  product: Product,
  selectedAge?: AgePriceEntry | null,
  pageUrl?: string
): string {
  const cleanPhone = formatWhatsAppNumber(phone || '919876543210');
  const url = pageUrl || (typeof window !== 'undefined' ? window.location.href : '');

  let message = `Hi The Little Placket team! 👋\n\n`;
  message += `I would love to enquire about this outfit from your catalogue:\n`;
  message += `✨ *${product.name}*\n`;
  message += `🏷️ Category: ${product.category === 'boys' ? 'Baby Boy 👦' : 'Baby Girl 👧'}\n`;
  if (product.dressType) message += `👗 Style: ${product.dressType}\n`;

  if (selectedAge) {
    message += `📏 Age Size: *${selectedAge.ageLabel}*\n`;
    message += `💰 Catalogue Price: *₹${selectedAge.price.toLocaleString('en-IN')}*\n`;
  } else if (product.agePrices && product.agePrices.length > 0) {
    const minPrice = Math.min(...product.agePrices.map((p) => p.price));
    message += `💰 Pricing: Starts from ₹${minPrice.toLocaleString('en-IN')}\n`;
  }

  if (url) {
    message += `🔗 View on Catalogue: ${url}\n`;
  }

  message += `\nCould you please let me know availability and delivery options? Thank you! 💕`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function createGeneralEnquiryUrl(phone: string, customTopic?: string): string {
  const cleanPhone = formatWhatsAppNumber(phone || '919876543210');
  let message = `Hi The Little Placket team! 👋\n\n`;
  if (customTopic) {
    message += `I have a question about: *${customTopic}*.\n`;
  } else {
    message += `I'm browsing your baby clothing catalogue and have a few questions.\n`;
  }
  message += `Could you please assist me? Thank you! 💕`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
