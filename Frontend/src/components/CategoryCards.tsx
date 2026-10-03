'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { BusinessSettings } from '../types';

interface CategoryCardsProps {
  settings?: BusinessSettings;
}

export default function CategoryCards() {
  const boysTitle = 'BOYS';
  const boysSubtitle = 'Collection';
  const boysDesc = 'Trendy outfits for every occasion';
  const boysImage = '/images/products/boy-check-shirt.jpg';

  const girlsTitle = 'GIRLS';
  const girlsSubtitle = 'Collection';
  const girlsDesc = 'Pretty outfits for every little star';
  const girlsImage = '/images/products/girl-floral-bow-frock.jpg';

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      {/* TWO LARGE CATEGORY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* BOYS CARD: Pastel Blue */}
        <Link
          href="/boys"
          className="group relative overflow-hidden rounded-3xl sm:rounded-4xl p-6 sm:p-8 bg-[#D8EEFE] border-2 border-white shadow-soft hover:shadow-soft-xl transition-all duration-300 transform active:scale-98 flex items-center justify-between min-h-[180px] sm:min-h-[220px]"
        >
          {/* Left Text */}
          <div className="z-10 max-w-[60%] space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 text-xs font-bold uppercase tracking-wider">
              {boysSubtitle}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1B2A4A] tracking-tight leading-tight">
              {boysTitle}
              <span className="block text-xl sm:text-2xl font-bold text-blue-600">
                {boysSubtitle}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-700 font-medium line-clamp-2">
              {boysDesc}
            </p>
            <div className="pt-2">
              <div className="w-11 h-11 rounded-full bg-white text-[#1B2A4A] flex items-center justify-center shadow-sm group-hover:bg-[#1B2A4A] group-hover:text-white group-hover:translate-x-1 transition-all">
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </div>
            </div>
          </div>

          {/* Right Baby Boy Image */}
          <div className="relative w-36 h-40 sm:w-48 sm:h-52 shrink-0 rounded-2xl overflow-hidden shadow-soft border-2 border-white/80 group-hover:scale-105 transition-transform duration-500">
            <Image
              src={boysImage}
              alt="Baby Boy Collection"
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 150px, 220px"
            />
          </div>
        </Link>

        {/* GIRLS CARD: Pastel Pink */}
        <Link
          href="/girls"
          className="group relative overflow-hidden rounded-3xl sm:rounded-4xl p-6 sm:p-8 bg-[#FFE5EC] border-2 border-white shadow-soft hover:shadow-soft-xl transition-all duration-300 transform active:scale-98 flex items-center justify-between min-h-[180px] sm:min-h-[220px]"
        >
          {/* Left Text */}
          <div className="z-10 max-w-[60%] space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-pink-500/10 text-pink-700 text-xs font-bold uppercase tracking-wider">
              {girlsSubtitle}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1B2A4A] tracking-tight leading-tight">
              {girlsTitle}
              <span className="block text-xl sm:text-2xl font-bold text-pink-600">
                {girlsSubtitle}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-700 font-medium line-clamp-2">
              {girlsDesc}
            </p>
            <div className="pt-2">
              <div className="w-11 h-11 rounded-full bg-white text-[#1B2A4A] flex items-center justify-center shadow-sm group-hover:bg-[#EC4899] group-hover:text-white group-hover:translate-x-1 transition-all">
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </div>
            </div>
          </div>

          {/* Right Baby Girl Image */}
          <div className="relative w-36 h-40 sm:w-48 sm:h-52 shrink-0 rounded-2xl overflow-hidden shadow-soft border-2 border-white/80 group-hover:scale-105 transition-transform duration-500">
            <Image
              src={girlsImage}
              alt="Baby Girl Collection"
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 150px, 220px"
            />
          </div>
        </Link>
      </div>
    </section>
  );
}
