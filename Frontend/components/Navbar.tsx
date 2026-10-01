'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, Menu, X, Sparkles, Heart } from 'lucide-react';
import { formatWhatsAppNumber } from '../lib/whatsapp';

interface NavbarProps {
  whatsappNumber?: string;
}

export default function Navbar({ whatsappNumber = '919876543210' }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Boys Collection', href: '/boys', badge: '👦' },
    { label: 'Girls Collection', href: '/girls', badge: '👧' },
    { label: 'All Outfits', href: '/collections', badge: '✨' },
  ];

  const cleanPhone = formatWhatsAppNumber(whatsappNumber);
  const directWhatsAppUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    "Hi Kiddy Closet! 👋 I'm browsing your baby fashion catalogue and would like some assistance."
  )}`;

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-cream-200/80 transition-all duration-300">
      {/* Top micro-announcement banner */}
      <div className="bg-gradient-to-r from-baby-peach/60 via-baby-pink/60 to-baby-blue/60 text-charcoal-700 py-1.5 px-4 text-xs font-medium text-center flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-gold-500 animate-spin" style={{ animationDuration: '6s' }} />
        <span>✨ Exclusive Catalogue Platform — Handcrafted Baby Outfits — Direct WhatsApp Assistance</span>
        <Heart className="w-3.5 h-3.5 text-baby-pink-dark fill-baby-pink-dark" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-baby-pink to-baby-blue flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform duration-300 border border-white">
              <span className="text-2xl select-none">🧸</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-2xl tracking-tight text-charcoal-900 group-hover:text-charcoal-700 transition-colors">
                  KIDDY<span className="text-baby-pink-dark font-light ml-1">CLOSET</span>
                </span>
              </div>
              <p className="text-[11px] font-medium tracking-wider uppercase text-charcoal-500">
                Little Styles, Big Smiles
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-cream-200/80 text-charcoal-900 shadow-sm font-semibold'
                      : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-cream-100/70'
                  }`}
                >
                  {link.badge && <span className="text-sm">{link.badge}</span>}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action: WhatsApp CTA button */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-soft hover:shadow-glow-whatsapp transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <div className="w-2 h-2 rounded-full bg-white animate-ping" />
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Enquire on WhatsApp</span>
            </a>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex sm:hidden items-center gap-2">
            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-[#25D366] text-white shadow-soft"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-white/80 text-charcoal-700 hover:bg-cream-200 border border-cream-200 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden glass-panel border-t border-cream-200 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-cream-200 text-charcoal-900 font-semibold'
                    : 'text-charcoal-700 hover:bg-cream-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{link.badge}</span>
                  <span>{link.label}</span>
                </div>
              </Link>
            );
          })}
          <div className="pt-2">
            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-2xl text-base font-semibold shadow-soft"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
