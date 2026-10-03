'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BusinessSettings } from '../types';

interface NavbarProps {
  settings?: BusinessSettings;
  whatsappNumber?: string;
  onOpenEnquiry?: () => void;
}

export default function Navbar({
  settings,
}: NavbarProps) {
  const pathname = usePathname();

  const businessName = 'THE LITTLE PLACKET';

  const navLinks = [
    { label: 'Home', href: '/', image: '/images/nav/nav-home.jpg' },
    { label: 'Boys Collection', href: '/boys', image: '/images/nav/nav-boys.jpg' },
    { label: 'Girls Collection', href: '/girls', image: '/images/nav/nav-girls.jpg' },
    { label: 'All Outfits', href: '/collections', image: '/images/nav/nav-all.jpg' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-cream-200/90 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group py-1">
              <img
                src="/images/logo.png"
                alt={businessName}
                className="h-10 sm:h-12 md:h-14 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* DESKTOP NAV: Navigation Links */}
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
        </div>
      </div>
    </header>
  );
}

