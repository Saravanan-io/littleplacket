'use client';

import React, { useState } from 'react';
import { MessageCircle, X, Sparkles, Send } from 'lucide-react';
import { formatWhatsAppNumber, createGeneralEnquiryUrl } from '../lib/whatsapp';

interface WhatsAppFloatingButtonProps {
  whatsappNumber?: string;
  businessName?: string;
}

export default function WhatsAppFloatingButton({
  whatsappNumber = '919876543210',
  businessName = 'Kiddy Closet',
}: WhatsAppFloatingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const cleanPhone = formatWhatsAppNumber(whatsappNumber);

  const quickPrompts = [
    { label: '📏 Help with Sizing', query: 'I need guidance selecting the right size for my baby' },
    { label: '🌿 Organic Fabric Details', query: 'Can you tell me more about the fabric and baby skin safety?' },
    { label: '🚚 Delivery & Dispatch', query: 'What is the dispatch timeframe for outfits?' },
  ];

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMsg.trim()) return;
    const url = createGeneralEnquiryUrl(cleanPhone, customMsg.trim());
    window.open(url, '_blank');
    setCustomMsg('');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Pop-up Card */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-3xl glass-panel shadow-soft-xl border border-cream-200 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl">
                🧸
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">{businessName} Styling Desk</h4>
                <div className="flex items-center gap-1.5 text-[11px] text-white/90">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                  <span>Online • Quick WhatsApp Replies</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-white/95 space-y-3 text-charcoal-800">
            <p className="text-xs leading-relaxed text-charcoal-600">
              Welcome to <span className="font-semibold text-charcoal-900">{businessName}</span>! Looking for a specific size, festive party dress, or personalized recommendation for your baby?
            </p>

            {/* Quick Prompts */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-charcoal-500 uppercase tracking-wider block">
                Quick Enquiries
              </span>
              {quickPrompts.map((p, idx) => (
                <a
                  key={idx}
                  href={createGeneralEnquiryUrl(cleanPhone, p.query)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-xs font-medium p-2 rounded-xl bg-cream-100/70 hover:bg-cream-200 text-charcoal-800 hover:text-charcoal-900 border border-cream-200 transition-colors"
                >
                  {p.label}
                </a>
              ))}
            </div>

            {/* Direct Message Form */}
            <form onSubmit={handleSendCustom} className="pt-1 flex gap-2">
              <input
                type="text"
                placeholder="Type your question..."
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-cream-50 border border-cream-200 text-xs text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:ring-1 focus:ring-[#25D366]"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white transition-colors flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-glow-whatsapp hover:scale-105 transition-all duration-300 border-2 border-white"
        aria-label="Contact on WhatsApp"
      >
        <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping absolute -top-1 -right-1" />
        <MessageCircle className="w-6 h-6 fill-white" />
        <span className="hidden sm:inline font-bold text-sm tracking-wide">
          Enquire on WhatsApp
        </span>
      </button>
    </div>
  );
}
