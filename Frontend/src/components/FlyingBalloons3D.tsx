'use client';

import React from 'react';

interface BalloonConfig {
  id: string;
  colorGrad1: string;
  colorGrad2: string;
  knotColor: string;
  size: number;
  width: number;
  height: number;
  animationClass: string;
  style: React.CSSProperties;
}

const leftBalloons: BalloonConfig[] = [
  {
    id: 'l1',
    colorGrad1: '#FF7597',
    colorGrad2: '#FF3B6B',
    knotColor: '#E61C4F',
    size: 76,
    width: 76,
    height: 95,
    animationClass: 'animate-balloon-left-1',
    style: { top: '-20px', left: '-30px', zIndex: 20 },
  },
  {
    id: 'l2',
    colorGrad1: '#38BDF8',
    colorGrad2: '#0284C7',
    knotColor: '#0369A1',
    size: 64,
    width: 64,
    height: 80,
    animationClass: 'animate-balloon-left-2',
    style: { top: '80px', left: '-75px', zIndex: 15 },
  },
  {
    id: 'l3',
    colorGrad1: '#FACC15',
    colorGrad2: '#EAB308',
    knotColor: '#CA8A04',
    size: 58,
    width: 58,
    height: 72,
    animationClass: 'animate-balloon-left-3',
    style: { bottom: '20px', left: '-45px', zIndex: 25 },
  },
  {
    id: 'l4',
    colorGrad1: '#C084FC',
    colorGrad2: '#9333EA',
    knotColor: '#7E22CE',
    size: 48,
    width: 48,
    height: 60,
    animationClass: 'animate-balloon-left-1',
    style: { top: '180px', left: '-100px', zIndex: 10, opacity: 0.9 },
  },
];

const rightBalloons: BalloonConfig[] = [
  {
    id: 'r1',
    colorGrad1: '#F472B6',
    colorGrad2: '#DB2777',
    knotColor: '#BE185D',
    size: 74,
    width: 74,
    height: 92,
    animationClass: 'animate-balloon-right-1',
    style: { top: '-15px', right: '-35px', zIndex: 20 },
  },
  {
    id: 'r2',
    colorGrad1: '#4ADE80',
    colorGrad2: '#16A34A',
    knotColor: '#15803D',
    size: 66,
    width: 66,
    height: 82,
    animationClass: 'animate-balloon-right-2',
    style: { top: '90px', right: '-78px', zIndex: 15 },
  },
  {
    id: 'r3',
    colorGrad1: '#FB923C',
    colorGrad2: '#EA580C',
    knotColor: '#C2410C',
    size: 56,
    width: 56,
    height: 70,
    animationClass: 'animate-balloon-right-3',
    style: { bottom: '15px', right: '-48px', zIndex: 25 },
  },
  {
    id: 'r4',
    colorGrad1: '#60A5FA',
    colorGrad2: '#2563EB',
    knotColor: '#1D4ED8',
    size: 50,
    width: 50,
    height: 62,
    animationClass: 'animate-balloon-right-1',
    style: { top: '190px', right: '-105px', zIndex: 10, opacity: 0.9 },
  },
];

function BalloonItem({ balloon }: { balloon: BalloonConfig }) {
  const gradId = `balloon-grad-${balloon.id}`;
  const shineId = `balloon-shine-${balloon.id}`;

  return (
    <div
      className={`absolute transition-transform duration-300 hover:scale-110 pointer-events-auto cursor-pointer drop-shadow-xl ${balloon.animationClass}`}
      style={balloon.style}
    >
      <svg
        width={balloon.width}
        height={balloon.height + 45}
        viewBox={`0 0 ${balloon.width} ${balloon.height + 45}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* 3D Spherical Radial Gradient for Balloon Body */}
          <radialGradient
            id={gradId}
            cx="35%"
            cy="30%"
            r="65%"
            fx="30%"
            fy="25%"
          >
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="25%" stopColor={balloon.colorGrad1} />
            <stop offset="85%" stopColor={balloon.colorGrad2} />
            <stop offset="100%" stopColor={balloon.knotColor} />
          </radialGradient>

          {/* 3D Glossy Highlight Gradient */}
          <linearGradient id={shineId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 3D Balloon Body */}
        <ellipse
          cx={balloon.width / 2}
          cy={balloon.height / 2 - 2}
          rx={balloon.width / 2 - 2}
          ry={balloon.height / 2 - 2}
          fill={`url(#${gradId})`}
        />

        {/* Glossy 3D Top Reflection Highlight */}
        <ellipse
          cx={balloon.width * 0.35}
          cy={balloon.height * 0.28}
          rx={balloon.width * 0.2}
          ry={balloon.height * 0.14}
          fill={`url(#${shineId})`}
          transform={`rotate(-20 ${balloon.width * 0.35} ${balloon.height * 0.28})`}
        />

        {/* Tiny secondary glossy accent dot */}
        <circle
          cx={balloon.width * 0.25}
          cy={balloon.height * 0.22}
          r={balloon.width * 0.04}
          fill="#FFFFFF"
          opacity="0.85"
        />

        {/* Balloon Bottom Knot */}
        <polygon
          points={`${balloon.width / 2 - 4},${balloon.height - 5} ${balloon.width / 2 + 4},${balloon.height - 5} ${balloon.width / 2},${balloon.height + 2}`}
          fill={balloon.knotColor}
        />

        {/* Curved Organic Balloon String */}
        <path
          d={`M ${balloon.width / 2} ${balloon.height + 2} Q ${balloon.width / 2 + 8} ${balloon.height + 20} ${balloon.width / 2 - 4} ${balloon.height + 42}`}
          stroke="rgba(100, 116, 139, 0.45)"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

export default function FlyingBalloons3D() {
  return (
    <>
      {/* LEFT FLYING BALLOONS CLUSTER */}
      <div className="absolute left-0 top-0 bottom-0 pointer-events-none z-20 hidden sm:block">
        {leftBalloons.map((balloon) => (
          <BalloonItem key={balloon.id} balloon={balloon} />
        ))}
      </div>

      {/* RIGHT FLYING BALLOONS CLUSTER */}
      <div className="absolute right-0 top-0 bottom-0 pointer-events-none z-20 hidden sm:block">
        {rightBalloons.map((balloon) => (
          <BalloonItem key={balloon.id} balloon={balloon} />
        ))}
      </div>
    </>
  );
}
