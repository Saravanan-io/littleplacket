'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle, ShieldCheck, Sparkles, Ruler } from 'lucide-react';
import { formatWhatsAppNumber } from '../lib/whatsapp';

interface HeroProps {
  whatsappNumber?: string;
}

export default function Hero({ whatsappNumber = '919876543210' }: HeroProps) {
  const cleanPhone = formatWhatsAppNumber(whatsappNumber);
  const directWhatsAppUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    "Hi Kiddy Closet! 👋 I'm visiting your catalogue website and would like to know more about your baby clothing collection!"
  )}`;

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cream-200/90 border border-white text-xs sm:text-sm font-semibold text-charcoal-700 shadow-sm animate-pulse-subtle">
              <span className="text-base">🧸</span>
              <span>Newborn to 3 Years Designer Catalogue</span>
              <Sparkles className="w-3.5 h-3.5 text-gold-500 fill-gold-500" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-charcoal-900 tracking-tight leading-[1.15]">
              Handcrafted Luxury for Your <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-baby-pink-dark via-purple-400 to-baby-blue-dark">
                Little Miracle
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-charcoal-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Explore timeless party frocks, dapper suits, and snug rompers made from ultra-soft organic fabrics. Discover age-wise pricing and connect directly with our styling team on WhatsApp.
            </p>

            {/* Value Pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 pb-4 text-left">
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/70 border border-cream-200 shadow-soft">
                <div className="w-8 h-8 rounded-xl bg-baby-mint flex items-center justify-center text-baby-mint-dark">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-xs font-semibold text-charcoal-800">
                  100% Organic & Gentle
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/70 border border-cream-200 shadow-soft">
                <div className="w-8 h-8 rounded-xl bg-baby-blue flex items-center justify-center text-baby-blue-dark">
                  <Ruler className="w-4 h-4" />
                </div>
                <div className="text-xs font-semibold text-charcoal-800">
                  Custom Age-Wise Fit
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 flex items-center gap-2.5 p-3 rounded-2xl bg-white/70 border border-cream-200 shadow-soft">
                <div className="w-8 h-8 rounded-xl bg-[#25D366]/20 flex items-center justify-center text-[#25D366]">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div className="text-xs font-semibold text-charcoal-800">
                  Direct WhatsApp Orders
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/boys"
                className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-blue-500 to-baby-blue-dark hover:from-blue-600 hover:to-blue-700 text-white font-semibold text-sm sm:text-base shadow-soft hover:shadow-glow-blue transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>Explore Baby Boys</span>
                <span className="text-lg">👦</span>
              </Link>

              <Link
                href="/girls"
                className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-pink-400 to-baby-pink-dark hover:from-pink-500 hover:to-pink-600 text-white font-semibold text-sm sm:text-base shadow-soft hover:shadow-glow-pink transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>Explore Baby Girls</span>
                <span className="text-lg">👧</span>
              </Link>

              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-cream-100 text-charcoal-800 font-semibold text-sm sm:text-base border border-cream-300 shadow-soft transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5 text-[#25D366] fill-[#25D366]" />
                <span>Quick WhatsApp Chat</span>
              </a>
            </div>
          </div>

          {/* Right Column: Hero Visual Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Backglow decoration */}
              <div className="absolute -inset-4 bg-gradient-to-r from-baby-pink via-baby-peach to-baby-blue rounded-5xl blur-2xl opacity-70 transform rotate-1" />

              <div className="relative rounded-4xl overflow-hidden bg-white p-3 shadow-soft-xl border border-white">
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-cream-100">
                  <Image
                    src="/images/hero-banner.jpg"
                    alt="Kiddy Closet Baby Collection"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  />
                  {/* Floating floating mini-badge on image */}
                  <div className="absolute bottom-4 left-4 right-4 glass-panel rounded-2xl p-3 flex items-center justify-between shadow-soft">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-baby-yellow flex items-center justify-center text-xl">
                        👑
                      </div>
                      <div>
                        <div className="text-xs font-bold text-charcoal-900">
                          Curated Festive & Daily Wear
                        </div>
                        <div className="text-[11px] text-charcoal-600">
                          Sizes 0M to 36M Available
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-baby-pink-dark bg-white/90 px-2.5 py-1 rounded-full shadow-sm">
                      New 2026
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
