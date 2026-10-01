'use client';

import React from 'react';

export default function BabyDecorative3D() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {/* Soft glowing ambient pastel orbs */}
      <div className="absolute top-12 left-10 w-96 h-96 rounded-full bg-baby-pink/35 blur-3xl" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] rounded-full bg-baby-blue/35 blur-3xl" />
      <div className="absolute bottom-20 left-1/4 w-80 h-80 rounded-full bg-baby-yellow/30 blur-3xl" />

      {/* Floating baby icons */}
      <div className="absolute top-28 left-[8%] animate-float-gentle text-2xl opacity-40 select-none">
        ⭐
      </div>
      <div
        className="absolute top-48 right-[12%] animate-float-gentle text-2xl opacity-40 select-none"
        style={{ animationDelay: '1.5s' }}
      >
        ☁️
      </div>
      <div
        className="absolute top-[65%] left-[5%] animate-float-gentle text-2xl opacity-35 select-none"
        style={{ animationDelay: '2.5s' }}
      >
        🧸
      </div>
      <div
        className="absolute top-[75%] right-[8%] animate-float-gentle text-2xl opacity-40 select-none"
        style={{ animationDelay: '0.8s' }}
      >
        ✨
      </div>
    </div>
  );
}
