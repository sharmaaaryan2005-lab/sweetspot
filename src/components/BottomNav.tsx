import React from 'react';
import { ShieldCheck, ShoppingBag, Truck, Utensils } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BottomTab } from '../types';

export const BottomNav: React.FC = () => {
  const { activeTab, selectBottomTab, cartItemCount } = useApp();

  const items: { id: BottomTab; label: string; icon: React.ReactNode }[] = [
    { id: 'delivery', label: 'Delivery', icon: <Truck className="w-5 h-5" strokeWidth={2} /> },
    { id: 'dining', label: 'Dining', icon: <Utensils className="w-5 h-5" strokeWidth={2} /> },
    { id: 'mode', label: 'Mode', icon: <ShieldCheck className="w-5 h-5" strokeWidth={2} /> },
    { id: 'cart', label: 'Cart', icon: <ShoppingBag className="w-5 h-5" strokeWidth={2} /> },
  ];

  return (
    <nav
      aria-label="Primary navigation"
      className="shrink-0 bg-white/95 dark:bg-[#162421]/95 backdrop-blur-md border-t border-[#E6E1D6] dark:border-[#273934] px-2 pb-2 pt-1.5"
    >
      <div className="grid grid-cols-4 items-center">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => selectBottomTab(item.id)}
              className={`relative min-h-[48px] flex flex-col items-center justify-center gap-1 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E6B5C] ${
                isActive
                  ? 'text-[#0E6B5C] dark:text-[#5FD4BC]'
                  : 'text-[#5F6F69] dark:text-[#899E96] hover:text-[#162420] dark:hover:text-[#EEF5F2]'
              }`}
            >
              <div className="relative flex items-center justify-center">
                {item.icon}
                {item.id === 'cart' && cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#0E6B5C] text-white text-[10px] font-bold tabular-nums flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] tracking-tight whitespace-nowrap ${
                  isActive ? 'font-bold' : 'font-medium'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
