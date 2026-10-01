import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CategoryCards() {
  return (
    <section className="py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream-200 text-charcoal-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3 h-3 text-gold-500 fill-gold-500" />
            <span>Signature Collections</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 tracking-tight">
            Curated Baby Fashion By Gender
          </h2>
          <p className="text-charcoal-600 mt-2 text-sm sm:text-base">
            Every piece is tailor-inspected with pure organic fibers and adjustable snaps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Baby Boys */}
          <Link
            href="/boys"
            className="group relative rounded-4xl overflow-hidden bg-gradient-baby-boy border border-blue-100 shadow-soft-lg hover:shadow-soft-xl transition-all duration-300 transform hover:-translate-y-1 p-6 sm:p-8 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between relative z-10">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-white/80 text-blue-700 text-xs font-bold tracking-wide uppercase shadow-sm">
                  Little Gentleman
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 mt-3 group-hover:text-blue-700 transition-colors">
                  Baby Boys Collection
                </h3>
                <p className="text-charcoal-600 text-sm mt-2 max-w-sm">
                  Cozy fleece rompers, linen button-downs, suspender sets, and heirloom velvet tuxedos.
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white shadow-soft flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                👦
              </div>
            </div>

            {/* Visual thumbnail previews */}
            <div className="relative mt-8 mb-4 h-56 rounded-3xl overflow-hidden shadow-soft border border-white/60 bg-white/40">
              <Image
                src="/images/products/boy-bear-romper.jpg"
                alt="Baby Boys Collection"
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 via-transparent to-transparent flex items-end p-4">
                <span className="text-white text-xs font-medium bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
                  Rompers • Linen Sets • Tuxedos
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-semibold text-charcoal-600">
                0 to 36 Months Available
              </span>
              <div className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 group-hover:translate-x-1 transition-transform">
                <span>Browse Boys Collection</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Card 2: Baby Girls */}
          <Link
            href="/girls"
            className="group relative rounded-4xl overflow-hidden bg-gradient-baby-girl border border-pink-100 shadow-soft-lg hover:shadow-soft-xl transition-all duration-300 transform hover:-translate-y-1 p-6 sm:p-8 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between relative z-10">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-white/80 text-baby-pink-dark text-xs font-bold tracking-wide uppercase shadow-sm">
                  Little Princess
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 mt-3 group-hover:text-baby-pink-dark transition-colors">
                  Baby Girls Collection
                </h3>
                <p className="text-charcoal-600 text-sm mt-2 max-w-sm">
                  Lace-embroidered tulle frocks, watercolor sundresses, knitted playsuits, and chiffon gowns.
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white shadow-soft flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                👧
              </div>
            </div>

            {/* Visual thumbnail previews */}
            <div className="relative mt-8 mb-4 h-56 rounded-3xl overflow-hidden shadow-soft border border-white/60 bg-white/40">
              <Image
                src="/images/products/girl-angel-frock.jpg"
                alt="Baby Girls Collection"
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 via-transparent to-transparent flex items-end p-4">
                <span className="text-white text-xs font-medium bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
                  Frocks • Gowns • Playsuits
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-semibold text-charcoal-600">
                0 to 36 Months Available
              </span>
              <div className="inline-flex items-center gap-2 text-sm font-bold text-baby-pink-dark group-hover:translate-x-1 transition-transform">
                <span>Browse Girls Collection</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
