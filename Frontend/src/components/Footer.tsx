import React from 'react';
import { MessageCircle, Heart, MapPin, Phone } from 'lucide-react';
import { formatWhatsAppNumber } from '../lib/whatsapp';

interface FooterProps {
  whatsappNumber?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export default function Footer({
  whatsappNumber = '919876543210',
  phone = '+91 98765 43210',
  address = 'Shop 14, Lilac Arcade, Blossom Street, Bandra West, Mumbai 400050',
}: FooterProps) {
  const cleanPhone = formatWhatsAppNumber(whatsappNumber);
  const waUrl = `https://wa.me/${cleanPhone}`;

  return (
    <footer className="relative bg-cream-100/90 border-t border-cream-200 pt-12 pb-10 overflow-hidden text-charcoal-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 pb-10 border-b border-cream-200/80">
          {/* Logo & Title */}
          <div className="flex items-center">
            <img
              src="/images/logo.png"
              alt="THE LITTLE PLACKET"
              className="h-12 sm:h-14 w-auto object-contain"
            />
          </div>

          {/* Boutique & Enquiries */}
          <div className="space-y-3 max-w-md">
            <h4 className="font-bold text-sm text-charcoal-900 uppercase tracking-wider">
              Boutique & Enquiries
            </h4>
            <ul className="space-y-2.5 text-sm text-charcoal-600">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-baby-pink-dark shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm">{address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                <a href={`tel:${phone}`} className="hover:text-charcoal-900 text-xs sm:text-sm">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm font-semibold text-[#25D366] hover:underline"
                >
                  WhatsApp: +{cleanPhone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal-500 gap-3">
          <p>© {new Date().getFullYear()} The Little Placket. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-baby-pink-dark fill-baby-pink-dark" />
            <span>for your little miracles</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
