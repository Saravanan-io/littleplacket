import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home } from 'lucide-react';

export default function BottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Home',
      href: '/',
      icon: (active: boolean) => <Home className={`w-5 h-5 ${active ? 'text-purple-600' : 'text-charcoal-500'}`} />,
    },
    {
      label: 'Boys',
      href: '/boys',
      icon: (active: boolean) => (
        <img
          src="/images/nav/nav-boys.jpg"
          alt="Boys"
          className={`w-5 h-5 rounded-full object-cover transition-all ${
            active ? 'ring-2 ring-purple-600 scale-110' : 'opacity-80'
          }`}
        />
      ),
    },
    {
      label: 'Girls',
      href: '/girls',
      icon: (active: boolean) => (
        <img
          src="/images/nav/nav-girls.jpg"
          alt="Girls"
          className={`w-5 h-5 rounded-full object-cover transition-all ${
            active ? 'ring-2 ring-purple-600 scale-110' : 'opacity-80'
          }`}
        />
      ),
    },
    {
      label: 'All Outfits',
      href: '/collections',
      icon: (active: boolean) => (
        <img
          src="/images/nav/nav-all.jpg"
          alt="All Outfits"
          className={`w-5 h-5 rounded-full object-cover transition-all ${
            active ? 'ring-2 ring-purple-600 scale-110' : 'opacity-80'
          }`}
        />
      ),
    },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-cream-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] safe-area-bottom"
      aria-label="Mobile Navigation"
    >
      <div className="max-w-md mx-auto grid grid-cols-4 h-16 items-center px-1">
        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center justify-center py-1 select-none min-h-[48px] transition-all group"
            >
              <div
                className={`p-1.5 rounded-2xl transition-all duration-200 ${
                  isActive ? 'bg-purple-100/90' : 'group-hover:bg-cream-100'
                }`}
              >
                {item.icon(isActive)}
              </div>
              <span
                className={`text-[10px] font-bold tracking-tight mt-0.5 leading-none ${
                  isActive ? 'text-purple-700' : 'text-charcoal-500'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
