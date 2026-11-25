import React from 'react';
import { ArrowRight, Minus, Plus, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DISHES } from '../data/mockData';
import { BudgetBar } from './BudgetBar';
import { SafetyTag } from './SafetyTag';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setCartDrawerOpen,
    cart,
    cartTotal,
    cartItemCount,
    cartRestaurantName,
    getDishProfile,
    updateCartQuantity,
    openCart,
  } = useApp();

  if (!isCartDrawerOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Quick cart preview"
      className="absolute inset-0 z-40 bg-black/50 backdrop-blur-[2px] flex items-end"
    >
      <div className="w-full rounded-t-3xl bg-[#FAF7F0] dark:bg-[#0F1917] p-5 space-y-4 max-h-[82%] flex flex-col shadow-2xl border-t border-[#E6E1D6] dark:border-[#273934]">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-display text-[18px] font-extrabold text-[#162420] dark:text-[#EEF5F2]">
              Quick Cart ({cartItemCount})
            </h2>
            <p className="text-[12px] text-[#4C5C56] dark:text-[#B3C5BE]">
              {cartRestaurantName}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCartDrawerOpen(false)}
            aria-label="Close quick cart"
            className="w-9 h-9 rounded-full bg-white dark:bg-[#162421] border border-[#E6E1D6] dark:border-[#273934] flex items-center justify-center text-[#162420] dark:text-[#EEF5F2]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <BudgetBar compact />

        <div className="flex-1 overflow-y-auto space-y-2.5">
          {cart.map((item) => {
            const dish = DISHES.find((d) => d.id === item.dishId);
            if (!dish) return null;
            const profile = getDishProfile(dish, item.customizationIds);

            return (
              <div
                key={dish.id}
                className="rounded-2xl bg-white dark:bg-[#162421] border border-[#E6E1D6] dark:border-[#273934] p-3 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <SafetyTag tier={profile.effectiveTier} compact />
                  <div className="font-display text-[14px] font-bold text-[#162420] dark:text-[#EEF5F2] truncate mt-0.5">
                    {dish.name}
                  </div>
                  <div className="text-[12px] text-[#4C5C56] dark:text-[#B3C5BE] tabular-nums">
                    ₹{profile.effectivePrice * item.quantity} · {profile.effectiveSugar * item.quantity}g sugar
                  </div>
                </div>

                <div className="inline-flex items-center bg-[#FAF7F0] dark:bg-[#20312D] border border-[#DFD9CC] dark:border-[#273934] rounded-xl h-8 px-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => updateCartQuantity(dish.id, -1)}
                    aria-label={`Decrease quantity of ${dish.name}`}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-[#162420] dark:text-[#EEF5F2]"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center text-[13px] font-bold tabular-nums text-[#162420] dark:text-[#EEF5F2]">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateCartQuantity(dish.id, 1)}
                    aria-label={`Increase quantity of ${dish.name}`}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-[#162420] dark:text-[#EEF5F2]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={openCart}
          className="w-full h-12 rounded-2xl bg-[#0E6B5C] hover:bg-[#0A5448] text-white font-display font-bold text-[15px] tabular-nums flex items-center justify-center gap-2 shrink-0"
        >
          <span>Review Cart &amp; Checkout · ₹{cartTotal}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
