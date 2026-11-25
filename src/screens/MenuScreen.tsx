import React, { useMemo } from 'react';
import { ArrowLeft, Info, ShieldCheck, ShoppingBag, X } from 'lucide-react';
import { BudgetBar } from '../components/BudgetBar';
import { ProductCard } from '../components/ProductCard';
import { MenuSkeleton } from '../components/Skeletons';
import { Toggle } from '../components/Toggle';
import { useApp } from '../context/AppContext';
import { DISHES } from '../data/mockData';
import { MenuFilterMode } from '../types';

const FILTER_OPTIONS: { id: MenuFilterMode; label: string }[] = [
  { id: 'safe-first', label: 'Safe first' },
  { id: 'all', label: 'All' },
  { id: 'show-unsafe', label: 'Show unsafe' },
];

export const MenuScreen: React.FC = () => {
  const {
    currentRestaurant,
    menuFilter,
    setMenuFilter,
    severityMode,
    hasSeenMenuOnboarding,
    dismissMenuOnboarding,
    isLoading,
    goToHome,
    openCart,
    setCartDrawerOpen,
    cartItemCount,
    cartTotal,
    getDishProfile,
  } = useApp();

  const restaurantDishes = useMemo(
    () => DISHES.filter((d) => d.restaurantId === currentRestaurant.id),
    [currentRestaurant.id]
  );

  const safeAndBorderline = useMemo(() => {
    const safe = restaurantDishes.filter(
      (d) => getDishProfile(d).effectiveTier === 'safe'
    );
    const borderline = restaurantDishes.filter(
      (d) => getDishProfile(d).effectiveTier === 'borderline'
    );
    return [...safe, ...borderline];
  }, [restaurantDishes, getDishProfile]);

  const unsafeDishes = useMemo(
    () =>
      restaurantDishes.filter(
        (d) => getDishProfile(d).effectiveTier === 'unsafe'
      ),
    [restaurantDishes, getDishProfile]
  );

  return (
    <div className="flex flex-col h-full bg-[#FAF7F0] dark:bg-[#0F1917] transition-colors">
      {/* Sticky Header */}
      <header className="px-5 pt-5 pb-3.5 bg-[#FAF7F0] dark:bg-[#0F1917] border-b border-[#E6E1D6] dark:border-[#273934] shrink-0 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => goToHome('delivery')}
              aria-label="Back to restaurants"
              className="w-10 h-10 rounded-full bg-white dark:bg-[#162421] border border-[#E6E1D6] dark:border-[#273934] flex items-center justify-center text-[#162420] dark:text-[#EEF5F2] hover:bg-[#E3F2EE] dark:hover:bg-[#20312D] transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E6B5C]"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="min-w-0">
              <h1 className="font-display text-[19px] font-extrabold text-[#162420] dark:text-[#EEF5F2] leading-tight truncate">
                {currentRestaurant.name}
              </h1>
              <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#0E6B5C] dark:text-[#5FD4BC] mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>
                  Sweet Spot active · {severityMode === 'strict' ? 'Strict' : 'Flexible'}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setCartDrawerOpen(true)}
            aria-label={`Preview cart (${cartItemCount} items)`}
            className="relative w-10 h-10 rounded-full bg-[#0E6B5C] text-white flex items-center justify-center hover:bg-[#0A5448] transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E6B5C]"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#162420] text-white text-[10px] font-bold tabular-nums flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>

        {/* 3-Way Toggle */}
        <Toggle
          options={FILTER_OPTIONS}
          value={menuFilter}
          onChange={setMenuFilter}
          ariaLabel="Menu glycemic safety filter"
        />
      </header>

      {/* Scrollable Menu Body */}
      <main className="flex-1 overflow-y-auto px-5 py-4 space-y-3.5">
        {/* First-use Onboarding Tooltip */}
        {!hasSeenMenuOnboarding && (
          <div
            role="note"
            className="rounded-2xl bg-[#0E6B5C] text-white p-4 space-y-2 shadow-md"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 font-display text-[13px] font-bold">
                <Info className="w-4 h-4 shrink-0" />
                <span>How Safe-First ordering works</span>
              </div>
              <button
                type="button"
                onClick={dismissMenuOnboarding}
                aria-label="Dismiss menu guide"
                className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[12px] leading-relaxed text-[#E3F2EE]">
              Safe low-GI dishes sit at the top. High-glycemic meals stay dimmed below the spike line with Add disabled—tap any dish to swap rice or remove sugar glazes live.
            </p>
            <button
              type="button"
              onClick={dismissMenuOnboarding}
              className="text-[12px] font-bold underline underline-offset-2 text-white"
            >
              Got it, hide tip
            </button>
          </div>
        )}

        {/* Daily Sugar Budget Tracker */}
        <BudgetBar compact />

        {isLoading ? (
          <MenuSkeleton />
        ) : (
          <>
            {menuFilter === 'safe-first' && (
              <div className="space-y-3">
                {safeAndBorderline.map((dish) => (
                  <ProductCard key={dish.id} dish={dish} />
                ))}

                {unsafeDishes.length > 0 && (
                  <>
                    <div className="py-2 flex items-center gap-3">
                      <div className="flex-1 h-px bg-[#DFD9CC] dark:bg-[#273934]" />
                      <span className="text-[11px] font-medium text-[#6B7B75] dark:text-[#899E96] text-center">
                        below this line — these will spike your sugar
                      </span>
                      <div className="flex-1 h-px bg-[#DFD9CC] dark:bg-[#273934]" />
                    </div>

                    {unsafeDishes.map((dish) => (
                      <ProductCard key={dish.id} dish={dish} dimmedOverride />
                    ))}
                  </>
                )}
              </div>
            )}

            {menuFilter === 'all' && (
              <div className="space-y-3">
                {restaurantDishes.map((dish) => (
                  <ProductCard key={dish.id} dish={dish} />
                ))}
              </div>
            )}

            {menuFilter === 'show-unsafe' && (
              <div className="space-y-3">
                <div className="py-1 flex items-center gap-3">
                  <div className="flex-1 h-px bg-[#DFD9CC] dark:bg-[#273934]" />
                  <span className="text-[11px] font-semibold text-[#C0392B] dark:text-[#F27A6E] text-center">
                    below this line — these will spike your sugar
                  </span>
                  <div className="flex-1 h-px bg-[#DFD9CC] dark:bg-[#273934]" />
                </div>

                {unsafeDishes.length > 0 ? (
                  unsafeDishes.map((dish) => (
                    <ProductCard key={dish.id} dish={dish} dimmedOverride={false} />
                  ))
                ) : (
                  <div className="rounded-2xl bg-white dark:bg-[#162421] border border-[#E6E1D6] dark:border-[#273934] p-5 text-center space-y-3">
                    <p className="font-display text-[15px] font-bold text-[#162420] dark:text-[#EEF5F2]">
                      No high-glycemic dishes flagged here
                    </p>
                    <p className="text-[13px] text-[#5F6F69] dark:text-[#899E96]">
                      All meals at {currentRestaurant.name} fall within your active limits.
                    </p>
                    <button
                      type="button"
                      onClick={() => setMenuFilter('safe-first')}
                      className="h-9 px-4 rounded-xl bg-[#0E6B5C] text-white font-display text-[12px] font-bold"
                    >
                      Switch to Safe first
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Bottom Cart Bar */}
      {cartItemCount > 0 && (
        <footer className="px-5 py-3 bg-[#FAF7F0] dark:bg-[#0F1917] border-t border-[#E6E1D6] dark:border-[#273934] shrink-0 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCartDrawerOpen(true)}
            className="h-12 px-4 rounded-2xl bg-white dark:bg-[#162421] border border-[#E6E1D6] dark:border-[#273934] text-[#162420] dark:text-[#EEF5F2] font-display font-bold text-[13px] shrink-0"
          >
            Quick Edit
          </button>
          <button
            type="button"
            onClick={openCart}
            className="flex-1 h-12 px-4 rounded-2xl bg-[#0E6B5C] hover:bg-[#0A5448] text-white flex items-center justify-between font-display font-bold text-[14px] shadow-md shadow-[#0E6B5C]/15 transition-colors tabular-nums"
          >
            <span>
              {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} · ₹{cartTotal}
            </span>
            <span>View Cart →</span>
          </button>
        </footer>
      )}
    </div>
  );
};
