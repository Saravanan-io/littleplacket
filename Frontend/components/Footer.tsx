import React from 'react';
import Link from 'next/link';
import { MessageCircle, Heart, MapPin, Mail, Phone, Instagram, Sparkles } from 'lucide-react';
import { formatWhatsAppNumber } from '../lib/whatsapp';

interface FooterProps {
  whatsappNumber?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export default function Footer({
  whatsappNumber = '919876543210',
  email = 'hello@kiddycloset.com',
  phone = '+91 98765 43210',
  address = 'Shop 14, Lilac Arcade, Blossom Street, Bandra West, Mumbai 400050',
}: FooterProps) {
  const cleanPhone = formatWhatsAppNumber(whatsappNumber);
  const waUrl = `https://wa.me/${cleanPhone}`;

  return (
    <footer className="relative bg-cream-100/90 border-t border-cream-200 pt-16 pb-12 overflow-hidden text-charcoal-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-cream-200/80">
          {/* Brand info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-baby-pink to-baby-blue flex items-center justify-center shadow-soft border border-white">
                <span className="text-xl">🧸</span>
              </div>
              <div>
                <span className="font-extrabold text-2xl tracking-tight text-charcoal-900">
                  KIDDY<span className="text-baby-pink-dark font-light ml-1">CLOSET</span>
                </span>
                <p className="text-[11px] font-medium tracking-wider uppercase text-charcoal-500">
                  Little Styles, Big Smiles
                </p>
              </div>
            </div>

            <p className="text-sm text-charcoal-600 leading-relaxed max-w-sm">
              A curated boutique catalogue for newborn and toddler fashion. Handcrafted with ultra-soft organic cotton, safe dyes, and timeless silhouettes.
            </p>

            {/* Catalogue Disclaimer Card */}
            <div className="p-3.5 rounded-2xl bg-white/80 border border-cream-200 text-xs text-charcoal-600 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-charcoal-800">
                <Sparkles className="w-3.5 h-3.5 text-gold-500 fill-gold-500" />
                <span>Catalogue-Only Platform</span>
              </div>
              <p>
                No online cart or payment gateways. Browse our catalogue and click <strong className="text-[#25D366]">Enquire on WhatsApp</strong> for direct styling support & orders.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-bold text-sm text-charcoal-900 uppercase tracking-wider">
              Explore Catalogue
            </h4>
            <ul className="space-y-2 text-sm text-charcoal-600">
              <li>
                <Link href="/boys" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                  <span>👦</span> Baby Boys Collection
                </Link>
              </li>
              <li>
                <Link href="/girls" className="hover:text-pink-600 transition-colors flex items-center gap-1.5">
                  <span>👧</span> Baby Girls Collection
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-charcoal-900 transition-colors flex items-center gap-1.5">
                  <span>✨</span> All Signature Outfits
                </Link>
              </li>
              <li>
                <a
                  href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hi Kiddy Closet, can you help me with baby sizing recommendations?')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#25D366] transition-colors flex items-center gap-1.5"
                >
                  <span>📏</span> Sizing Assistance
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-4 space-y-3">
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
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-purple-500 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-charcoal-900 text-xs sm:text-sm">
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal-500 gap-3">
          <p>© {new Date().getFullYear()} Kiddy Closet. All rights reserved.</p>
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
