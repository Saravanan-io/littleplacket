'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Heart, Star, Cloud } from 'lucide-react';
import { BusinessSettings } from '../types';

import FlyingBalloons3D from './FlyingBalloons3D';

interface HeroProps {
  settings?: BusinessSettings;
  whatsappNumber?: string;
}

export default function Hero() {
  const littleWord = 'The';
  const stylesWord = 'Little';
  const bigSmilesWord = 'Placket';
  const supportingText = 'Little outfits for big adventures.';
  const heroImg = '/images/the-little-placket-banner.png';

  return (
    <section className="relative overflow-hidden pt-6 pb-6 sm:pt-10 sm:pb-10">
      {/* Subtle decorative background elements: hearts, tiny stars, soft clouds, tiny sparkles */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-60">
        <Heart className="absolute top-4 left-6 w-4 h-4 text-pink-300 fill-pink-200 animate-pulse" />
        <Star className="absolute top-12 right-10 w-3.5 h-3.5 text-yellow-300 fill-yellow-200 animate-pulse" />
        <Cloud className="absolute top-28 left-4 w-7 h-7 text-blue-200/60" />
        <Sparkles className="absolute top-1/2 right-6 w-4 h-4 text-purple-300" />
        <Star className="absolute bottom-16 left-12 w-3 h-3 text-yellow-300 fill-yellow-200" />
        <Heart className="absolute bottom-8 right-16 w-3.5 h-3.5 text-pink-300 fill-pink-200" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col items-center text-center">

          {/* Headline:
              The — dark navy
              Little — pink
              Placket — dark navy */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight max-w-4xl">
            <span className="text-[#1B2A4A] inline-block">{littleWord}&nbsp;</span>
            <span className="text-[#EC4899] inline-block font-black">{stylesWord}&nbsp;</span>
            {bigSmilesWord && <span className="text-[#1B2A4A] inline-block">{bigSmilesWord}</span>}
          </h1>

          {/* Supporting Text */}
          <p className="mt-3.5 sm:mt-4 text-base sm:text-xl font-medium text-charcoal-600 max-w-xl mx-auto">
            {supportingText}
          </p>

          {/* Hero Visual: The Little Placket banner with 3D Flying Balloons */}
          <div className="mt-6 sm:mt-8 w-full max-w-4xl relative">
            {/* 3D Flying Balloons Effect on Left and Right sides */}
            <FlyingBalloons3D />

            <div className="relative rounded-3xl sm:rounded-4xl overflow-hidden shadow-soft-xl border-4 border-white bg-white aspect-[1024/422] z-10">
              <Image
                src={heroImg}
                alt="The Little Placket - Little Outfits for Big Adventures"
                fill
                priority
                className="object-contain sm:object-cover object-center transition-transform duration-700 hover:scale-[1.01]"
                sizes="(max-width: 768px) 100vw, 1100px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
