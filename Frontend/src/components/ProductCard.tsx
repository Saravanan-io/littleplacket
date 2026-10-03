'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  whatsappNumber?: string;
}

export default function ProductCard({ product }: ProductCardProps) {
  const coverImage = product.images?.[0]?.url || '/images/hero-banner.jpg';
  const displayPrice = product.startingPrice || (product.price ? `₹${product.price}+` : '₹699+');



  return (
    <Link
      href={`/product/${product.slug || product.id}`}
      className="group flex flex-col bg-white rounded-3xl p-2.5 sm:p-3 border border-cream-200/90 shadow-soft hover:shadow-soft-lg hover:border-purple-200/70 transition-all duration-300 relative select-none"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-cream-100 border border-cream-200/40">
        <Image
          src={coverImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {product.availability === 'out_of_stock' && (
          <div className="absolute top-2 left-2 pointer-events-none">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-900/80 text-white backdrop-blur-sm shadow-xs">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="pt-2.5 pb-1 px-1 flex flex-col flex-1 justify-between space-y-1.5">
        <div>
          <h3 className="font-bold text-xs sm:text-sm text-charcoal-900 line-clamp-1 group-hover:text-purple-700 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs sm:text-sm font-extrabold text-[#1B2A4A] tracking-tight mt-0.5">
            {displayPrice}
          </p>
        </div>

      </div>
    </Link>
  );
}
