import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Trash2,
  MessageCircle,
  ArrowLeft,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { EnquiryItem } from '../types';
import {
  getEnquiryItems,
  removeItemFromEnquiry,
  clearEnquiry,
  buildWhatsAppEnquiryUrl,
} from '../lib/enquiry';
import { fetchSettings } from '../lib/api';

export default function SelectionPage() {
  const [items, setItems] = useState<EnquiryItem[]>([]);
  const [whatsappNumber, setWhatsappNumber] = useState('919876543210');

  useEffect(() => {
    setItems(getEnquiryItems());

    const loadSettings = async () => {
      try {
        const s = await fetchSettings();
        if (s?.whatsappNumber) setWhatsappNumber(s.whatsappNumber);
      } catch (e) {
        // fallback
      }
    };
    loadSettings();

    const handleUpdate = () => setItems(getEnquiryItems());
    window.addEventListener('kiddy_enquiry_updated', handleUpdate);
    return () => {
      window.removeEventListener('kiddy_enquiry_updated', handleUpdate);
    };
  }, []);

  const handleRemove = (id: string) => {
    const updated = removeItemFromEnquiry(id);
    setItems(updated);
  };

  const handleClearAll = () => {
    clearEnquiry();
    setItems([]);
  };

  const totalEstimate = items.reduce((acc, it) => acc + (it.price || 0), 0);
  const whatsAppUrl = buildWhatsAppEnquiryUrl(items, whatsappNumber);

  return (
    <div className="min-h-screen bg-cream-50/60 pb-28 lg:pb-16 pt-6 sm:pt-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-charcoal-700 hover:text-charcoal-900 font-bold text-sm min-h-[44px] px-2 rounded-xl active:bg-cream-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            <span>Continue Browsing</span>
          </Link>

          {items.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs font-bold text-rose-500 hover:text-rose-700"
            >
              Clear All Selection
            </button>
          )}
        </div>

        {/* Title Card */}
        <div className="p-6 rounded-3xl bg-white border border-cream-200/90 shadow-soft flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold mb-2">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Enquiry List</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1B2A4A] tracking-tight">
              My Selection ({items.length})
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-500 font-medium mt-1">
              Check sizes and send directly to our boutique WhatsApp concierge.
            </p>
          </div>
          <span className="text-4xl select-none hidden sm:block">🧸</span>
        </div>

        {/* Items List or Empty State */}
        {items.length === 0 ? (
          <div className="p-10 rounded-3xl bg-white border border-cream-200 text-center space-y-4">
            <span className="text-6xl select-none block">🧸</span>
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-[#1B2A4A]">
                No Outfits in Selection Yet
              </h2>
              <p className="text-sm text-charcoal-500 max-w-sm mx-auto">
                Explore our boys and girls collections, select available age, then add to your enquiry list.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-3">
              <Link
                to="/boys"
                className="px-5 py-2.5 rounded-full bg-[#D8EEFE] text-blue-900 font-bold text-sm shadow-soft hover:bg-blue-200 transition-all flex items-center gap-2"
              >
                <img
                  src="/images/nav/nav-boys.jpg"
                  alt="Boys"
                  className="w-5 h-5 rounded-full object-cover shrink-0"
                />
                <span>Boys Collection</span>
              </Link>
              <Link
                to="/girls"
                className="px-5 py-2.5 rounded-full bg-[#FFE5EC] text-pink-900 font-bold text-sm shadow-soft hover:bg-pink-200 transition-all flex items-center gap-2"
              >
                <img
                  src="/images/nav/nav-girls.jpg"
                  alt="Girls"
                  className="w-5 h-5 rounded-full object-cover shrink-0"
                />
                <span>Girls Collection</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="p-4 rounded-3xl bg-white border border-cream-200/90 shadow-soft flex items-center gap-4 hover:border-purple-200 transition-all"
                >
                  <div className="relative w-20 h-24 rounded-2xl overflow-hidden bg-cream-100 shrink-0 border border-cream-200">
                    <img
                      src={it.image || '/images/hero-banner.jpg'}
                      alt={it.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="font-extrabold text-sm sm:text-base text-charcoal-900 truncate">
                      {it.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-charcoal-600 font-bold">
                      <span className="px-2.5 py-0.5 rounded-full bg-cream-100 border border-cream-200">
                        Size: {it.size}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-cream-100 border border-cream-200">
                        Colour: {it.color}
                      </span>
                    </div>
                    <p className="text-base sm:text-lg font-black text-[#1B2A4A] pt-1">
                      ₹{it.price}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemove(it.id)}
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-charcoal-400 hover:text-rose-600 hover:bg-rose-50 active:scale-90 transition-all"
                    aria-label={`Remove ${it.name} from selection`}
                    title="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Total Card & WhatsApp Action */}
            <div className="p-6 rounded-3xl bg-white border border-cream-200/90 shadow-soft space-y-4">
              <div className="flex items-center justify-between text-base">
                <span className="font-bold text-charcoal-600">Total Price Estimate</span>
                <span className="font-black text-2xl text-[#1B2A4A]">₹{totalEstimate}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-cream-50 border border-cream-200 text-xs text-charcoal-600 space-y-1">
                <p className="font-bold text-charcoal-800">Direct WhatsApp Concierge</p>
                <p>
                  Clicking below will format your selection into a clean message and open WhatsApp directly. Our team will verify size stock, fabric details, and delivery options for you.
                </p>
              </div>

              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[54px] rounded-full bg-[#25D366] hover:bg-[#20ba59] active:scale-98 text-white font-extrabold text-base flex items-center justify-center gap-2.5 shadow-soft hover:shadow-glow-whatsapp transition-all"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Send Enquiry on WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
