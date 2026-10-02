'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  Search,
  ShoppingBag,
  MessageCircle,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import { getEnquiryItems } from '../lib/enquiry';
import { formatWhatsAppNumber } from '../lib/whatsapp';
import { BusinessSettings } from '../types';

interface NavbarProps {
  settings?: BusinessSettings;
  whatsappNumber?: string;
  onOpenEnquiry?: () => void;
}

export default function Navbar({
  settings,
  whatsappNumber = '919876543210',
  onOpenEnquiry,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [enquiryCount, setEnquiryCount] = useState(0);

  const pathname = usePathname();
  const router = useRouter();

  const businessName = settings?.businessName || 'THE LITTLE PLACKET';
  const tagline = settings?.tagline || 'LITTLE OUTFITS FOR BIG ADVENTURES';
  const activeWhatsApp = settings?.whatsappNumber || whatsappNumber;
  const cleanPhone = formatWhatsAppNumber(activeWhatsApp);
  const announcement =
    settings?.announcementText ||
    '✨ Exclusive Catalogue Platform — Handcrafted Kids & Baby Outfits — Direct WhatsApp Assistance';

  const updateCounts = () => {
    setEnquiryCount(getEnquiryItems().length);
  };

  useEffect(() => {
    updateCounts();
    const handleEnquiry = () => updateCounts();
    window.addEventListener('kiddy_enquiry_updated', handleEnquiry);
    window.addEventListener('storage', handleEnquiry);

    return () => {
      window.removeEventListener('kiddy_enquiry_updated', handleEnquiry);
      window.removeEventListener('storage', handleEnquiry);
    };
  }, []);

  const navLinks = [
    { label: 'Home', href: '/', image: '/images/nav/nav-home.jpg' },
    { label: 'Boys Collection', href: '/boys', image: '/images/nav/nav-boys.jpg' },
    { label: 'Girls Collection', href: '/girls', image: '/images/nav/nav-girls.jpg' },
    { label: 'All Outfits', href: '/collections', image: '/images/nav/nav-all.jpg' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchOpen(false);
    router.push(`/collections?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const directWhatsAppUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hi ${businessName}! 👋 I'm browsing your baby fashion catalogue and would like some assistance.`
  )}`;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-cream-200/90 shadow-soft">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* MOBILE LEFT: Hamburger Menu Icon */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-charcoal-800 hover:bg-cream-100 active:scale-95 transition-all"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6 stroke-[2.2]" />
              </button>
            </div>

            {/* DESKTOP LEFT / MOBILE CENTER: Brand Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center group py-1">
                <img
                  src="/images/logo.png"
                  alt={businessName}
                  className="h-10 sm:h-12 md:h-14 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                />
              </Link>
            </div>

            {/* DESKTOP CENTER: Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1.5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2.5 ${
                      isActive
                        ? 'bg-charcoal-900 text-white shadow-sm'
                        : 'text-charcoal-700 hover:text-charcoal-900 hover:bg-cream-100'
                    }`}
                  >
                    <img
                      src={link.image}
                      alt={link.label}
                      className="w-6 h-6 rounded-full object-cover border border-white/40 shadow-xs shrink-0"
                    />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile balance spacer */}
            <div className="w-11 lg:hidden" aria-hidden="true" />
          </div>
        </div>
      </header>

      {/* MOBILE FULL DRAWER NAVIGATION */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-300">
            <div>
              {/* Drawer Header */}
              <div className="p-4 border-b border-cream-200 flex items-center justify-between bg-cream-50">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center">
                  <img
                    src="/images/logo.png"
                    alt={businessName}
                    className="h-10 w-auto object-contain"
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-charcoal-500 hover:bg-cream-200"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="p-4 space-y-1.5">
                <p className="text-xs font-bold uppercase tracking-wider text-charcoal-400 px-3 py-1">
                  Catalogue Menu
                </p>
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-base font-semibold transition-all ${
                        isActive
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'text-charcoal-800 hover:bg-cream-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={link.image}
                          alt={link.label}
                          className="w-7 h-7 rounded-full object-cover border border-white/50 shadow-xs shrink-0"
                        />
                        <span>{link.label}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-charcoal-400'}`} />
                    </Link>
                  );
                })}

                <Link
                  href="/selection"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3.5 rounded-2xl text-base font-semibold text-charcoal-800 hover:bg-cream-100 mt-2 border border-cream-200"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-5 h-5 text-purple-600" />
                    <span>My Selection</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
                    {enquiryCount}
                  </span>
                </Link>
              </div>

              {/* Boutique Info */}
              <div className="p-4 mx-4 rounded-2xl bg-cream-100/70 border border-cream-200/80 space-y-2.5 text-xs text-charcoal-600">
                <p className="font-bold text-charcoal-800 text-sm">Boutique Information</p>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>{settings?.phone || '+91 98765 43210'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>{settings?.email || 'hello@kiddycloset.com'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>{settings?.address || 'Lilac Arcade, Blossom Street, Mumbai'}</span>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA in drawer footer */}
            <div className="p-5 border-t border-cream-200 bg-cream-50">
              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] text-white py-3.5 rounded-2xl text-sm font-bold shadow-soft hover:bg-[#20ba59] active:scale-98 transition-all"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Enquire on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
