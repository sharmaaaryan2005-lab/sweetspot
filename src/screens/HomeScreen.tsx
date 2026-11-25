import React, { useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Clock,
  MapPin,
  Moon,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  User,
  X,
} from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { BudgetBar } from '../components/BudgetBar';
import { DishImage } from '../components/DishImage';
import { ProductCard } from '../components/ProductCard';
import { ErrorStateCard, FeedSkeleton } from '../components/Skeletons';
import { useApp } from '../context/AppContext';
import { DISHES, RESTAURANTS } from '../data/mockData';

export const HomeScreen: React.FC = () => {
  const {
    activeTab,
    searchQuery,
    setSearchQuery,
    selectedConditions,
    severityMode,
    darkMode,
    toggleDarkMode,
    orderHistory,
    isLoading,
    feedError,
    retryLoadFeed,
    openRestaurant,
    openProfile,
    goToSetup,
    getDishProfile,
    reorderFromHistory,
  } = useApp();

  const [locationExpanded, setLocationExpanded] = useState(false);
  const [selectedArea, setSelectedArea] = useState('GK1, Delhi');

  const isDining = activeTab === 'dining';
  const normalizedQuery = searchQuery.trim().toLowerCase();

  // Smart Search: filters matching dishes and sorts SAFE results first
  const matchingDishes = useMemo(() => {
    if (!normalizedQuery) return [];
    const tierOrder = { safe: 0, borderline: 1, unsafe: 2 };
    return DISHES.filter((dish) => {
      const profile = getDishProfile(dish);
      return (
        dish.name.toLowerCase().includes(normalizedQuery) ||
        dish.description.toLowerCase().includes(normalizedQuery) ||
        dish.giLabel.toLowerCase().includes(normalizedQuery) ||
        profile.verdict.toLowerCase().includes(normalizedQuery)
      );
    }).sort((a, b) => {
      const pa = getDishProfile(a);
      const pb = getDishProfile(b);
      return tierOrder[pa.effectiveTier] - tierOrder[pb.effectiveTier];
    });
  }, [normalizedQuery, getDishProfile]);

  const activeFiltersLabel = useMemo(() => {
    const labels: string[] = [];
    if (selectedConditions.includes('diabetes')) labels.push('Low-GI');
    if (selectedConditions.includes('jain')) labels.push('Jain');
    if (selectedConditions.includes('allergies')) labels.push('Allergies');
    return `${labels.join(' · ')} (${severityMode === 'strict' ? 'Strict' : 'Flexible'})`;
  }, [selectedConditions, severityMode]);

  const safeDishCount = useMemo(
    () => DISHES.filter((d) => getDishProfile(d).effectiveTier === 'safe').length,
    [getDishProfile]
  );

  return (
    <div className="flex flex-col h-full bg-[#FAF7F0] dark:bg-[#0F1917] transition-colors">
      {/* Location, Dark Mode & Profile Header */}
      <header className="px-5 pt-5 pb-3 flex items-center justify-between gap-2 shrink-0">
        <div className="relative">
          <button
            type="button"
            onClick={() => setLocationExpanded((prev) => !prev)}
            className="min-h-[44px] pl-3 pr-3.5 py-2 rounded-2xl bg-[#E3F2EE] dark:bg-[#162421] border border-transparent dark:border-[#273934] hover:bg-[#D5EBE5] dark:hover:bg-[#20312D] flex items-center gap-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E6B5C]"
          >
            <MapPin className="w-4 h-4 text-[#0E6B5C] dark:text-[#5FD4BC] shrink-0" />
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#0E6B5C] dark:text-[#5FD4BC] leading-none">
                {isDining ? 'DINING NEAR' : 'HOME'}
              </div>
              <div className="font-display text-[14px] font-bold text-[#162420] dark:text-[#EEF5F2] leading-tight flex items-center gap-1 mt-0.5">
                <span className="whitespace-nowrap">{selectedArea}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#4C5C56] dark:text-[#B3C5BE]" />
              </div>
            </div>
          </button>

          {locationExpanded && (
            <div className="absolute left-0 mt-1.5 w-52 rounded-2xl bg-white dark:bg-[#162421] border border-[#E6E1D6] dark:border-[#273934] shadow-lg p-1.5 z-20">
              {['GK1, Delhi', 'GK2, Delhi', 'Hauz Khas, Delhi'].map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => {
                    setSelectedArea(area);
                    setLocationExpanded(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors ${
                    selectedArea === area
                      ? 'bg-[#E3F2EE] dark:bg-[#20312D] text-[#0E6B5C] dark:text-[#5FD4BC] font-semibold'
                      : 'text-[#162420] dark:text-[#EEF5F2] hover:bg-[#FAF7F0] dark:hover:bg-[#20312D]'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-10 h-10 rounded-full bg-white dark:bg-[#162421] border border-[#E6E1D6] dark:border-[#273934] text-[#162420] dark:text-[#EEF5F2] flex items-center justify-center hover:bg-[#E3F2EE] dark:hover:bg-[#20312D] transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={openProfile}
            aria-label="Open Sweet Spot settings and safe order history"
            className="w-10 h-10 rounded-full bg-[#0E6B5C] text-white flex items-center justify-center shadow-sm hover:bg-[#0A5448] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E6B5C]"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Scrollable Feed */}
      <main className="flex-1 overflow-y-auto px-5 pb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#5F6F69] dark:text-[#899E96] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search low-sugar meals"
            aria-label="Search low-sugar meals"
            className="w-full h-12 pl-11 pr-10 rounded-2xl bg-white dark:bg-[#162421] border border-[#E6E1D6] dark:border-[#273934] text-[14px] text-[#162420] dark:text-[#EEF5F2] placeholder:text-[#6B7B75] dark:placeholder:text-[#899E96] focus:outline-none focus:border-[#0E6B5C] focus:ring-2 focus:ring-[#0E6B5C]/15 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="w-9 h-9 flex items-center justify-center rounded-full text-[#5F6F69] dark:text-[#899E96] hover:text-[#162420] dark:hover:text-white absolute right-1.5 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Bar: Sweet Spot ON · Low-GI */}
        <button
          type="button"
          onClick={goToSetup}
          className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl bg-[#E3F2EE] dark:bg-[#12332C] hover:bg-[#D5EBE5] dark:hover:bg-[#184239] flex items-center justify-between transition-colors text-left"
        >
          <span className="flex items-center gap-2 font-display text-[13px] font-bold text-[#0E6B5C] dark:text-[#5FD4BC] truncate">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="truncate">Sweet Spot ON · {activeFiltersLabel}</span>
          </span>
          <span className="text-[12px] font-semibold text-[#0E6B5C] dark:text-[#5FD4BC] shrink-0 ml-2">
            Edit
          </span>
        </button>

        {/* Daily Sugar Budget Tracker (Signature Feature) */}
        <BudgetBar />

        {feedError ? (
          <ErrorStateCard message={feedError} onRetry={retryLoadFeed} />
        ) : isLoading ? (
          <FeedSkeleton />
        ) : normalizedQuery ? (
          /* Smart Search Results (sorted safe-first) */
          <section aria-label="Matching safe meals" className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-[15px] font-bold text-[#162420] dark:text-[#EEF5F2]">
                Safe-first results ({matchingDishes.length})
              </h2>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[12px] font-semibold text-[#0E6B5C] dark:text-[#5FD4BC]"
              >
                Clear
              </button>
            </div>

            {matchingDishes.length === 0 ? (
              <div className="rounded-2xl bg-white dark:bg-[#162421] border border-[#E6E1D6] dark:border-[#273934] p-5 text-center space-y-3">
                <p className="text-[14px] font-semibold text-[#162420] dark:text-[#EEF5F2]">
                  No meals matched &ldquo;{searchQuery}&rdquo;
                </p>
                <p className="text-[12px] text-[#5F6F69] dark:text-[#899E96]">
                  Try searching &ldquo;paneer&rdquo;, &ldquo;dosa&rdquo;, &ldquo;khichdi&rdquo;, or &ldquo;low gi&rdquo;.
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="h-9 px-4 rounded-xl bg-[#0E6B5C] text-white font-display text-[12px] font-bold"
                >
                  Show all safe meals
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {matchingDishes.map((dish) => (
                  <ProductCard key={dish.id} dish={dish} showRestaurantName />
                ))}
              </div>
            )}
          </section>
        ) : (
          <>
            {/* Highlight Banner */}
            <div className="rounded-2xl bg-[#0E6B5C] px-5 py-4 text-white shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-display text-[17px] font-bold leading-snug">
                    {isDining
                      ? '18 dine-in tables with low-GI menus'
                      : `47 dishes safe nearby (${safeDishCount} featured)`}
                  </p>
                  <p className="text-[13px] text-[#D7EFE8] mt-0.5">
                    {isDining
                      ? `Sugar-ceiling verified kitchens in ${selectedArea}`
                      : 'Ranked by post-meal glucose steadiness'}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            {/* Order Again Quick Reorder Shortcut */}
            {orderHistory.length > 0 && (
              <section aria-labelledby="order-again-heading">
                <div className="flex items-center justify-between mb-2.5">
                  <h2
                    id="order-again-heading"
                    className="font-display text-[16px] font-bold text-[#162420] dark:text-[#EEF5F2]"
                  >
                    Order again
                  </h2>
                  <button
                    type="button"
                    onClick={openProfile}
                    className="text-[12px] font-semibold text-[#0E6B5C] dark:text-[#5FD4BC]"
                  >
                    History
                  </button>
                </div>

                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                  {orderHistory.slice(0, 3).map((entry) => (
                    <div
                      key={entry.id}
                      className="min-w-[235px] max-w-[235px] rounded-2xl bg-white dark:bg-[#162421] border border-[#E6E1D6] dark:border-[#273934] p-3 flex flex-col justify-between gap-2.5 shrink-0"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-bold text-[#0E6B5C] dark:text-[#5FD4BC]">
                          <span>SAFE REORDER</span>
                          <span className="tabular-nums">{entry.totalSugarGrams}g sugar</span>
                        </div>
                        <div className="font-display text-[14px] font-bold text-[#162420] dark:text-[#EEF5F2] mt-1 truncate">
                          {entry.items.map((i) => i.dishName).join(' + ')}
                        </div>
                        <div className="text-[11px] text-[#5F6F69] dark:text-[#899E96] mt-0.5 truncate">
                          {entry.restaurantName} · ₹{entry.totalAmount}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => reorderFromHistory(entry)}
                        className="w-full h-9 rounded-xl bg-[#E3F2EE] dark:bg-[#1E3B34] hover:bg-[#0E6B5C] text-[#0E6B5C] dark:text-[#5FD4BC] hover:text-white font-display text-[12px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reorder safely</span>
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Verified Low-GI Restaurant Carousel */}
            <section aria-labelledby="verified-low-gi-heading">
              <div className="flex items-center justify-between mb-2.5">
                <h2
                  id="verified-low-gi-heading"
                  className="font-display text-[17px] font-bold text-[#162420] dark:text-[#EEF5F2]"
                >
                  Verified low-GI
                </h2>
                <button
                  type="button"
                  onClick={() => openRestaurant('the-green-bowl')}
                  className="text-[13px] font-semibold text-[#0E6B5C] dark:text-[#5FD4BC] hover:underline"
                >
                  Explore all
                </button>
              </div>

              <div className="space-y-3">
                {RESTAURANTS.map((restaurant) => (
                  <button
                    key={restaurant.id}
                    type="button"
                    onClick={() => openRestaurant(restaurant.id)}
                    className="w-full text-left rounded-2xl bg-white dark:bg-[#162421] border border-[#E6E1D6] dark:border-[#273934] p-3.5 flex items-center gap-3.5 hover:border-[#0E6B5C]/45 dark:hover:border-[#5FD4BC]/40 hover:shadow-sm transition-all active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E6B5C]"
                  >
                    <DishImage
                      picsumSeed={restaurant.picsumSeed}
                      artworkId={restaurant.artworkId}
                      alt={restaurant.name}
                      className="w-20 h-20 rounded-xl shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {restaurant.trusted && (
                          <span className="text-[11px] font-extrabold tracking-wider text-[#0E6B5C] dark:text-[#5FD4BC] uppercase">
                            TRUSTED
                          </span>
                        )}
                        <span className="text-[#9AA8A3]" aria-hidden="true">
                          ·
                        </span>
                        <span className="text-[12px] font-medium text-[#4C5C56] dark:text-[#B3C5BE] tabular-nums">
                          ★ {restaurant.rating}
                        </span>
                      </div>

                      <h3 className="font-display text-[17px] font-bold text-[#162420] dark:text-[#EEF5F2] leading-snug mt-0.5 truncate">
                        {restaurant.name}
                      </h3>

                      <div className="text-[12px] text-[#5F6F69] dark:text-[#899E96] truncate">
                        {restaurant.cuisine}
                      </div>

                      <p className="text-[13px] font-semibold text-[#0E6B5C] dark:text-[#5FD4BC] mt-1 flex items-center gap-1.5 tabular-nums">
                        <span>{restaurant.lowGiCount} low-GI dishes</span>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1 text-[#4C5C56] dark:text-[#B3C5BE] font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          {isDining ? restaurant.distanceKm : `${restaurant.deliveryMinutes} min`}
                        </span>
                      </p>
                    </div>

                    <ChevronRight className="w-5 h-5 text-[#7A8A84] shrink-0" />
                  </button>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
};
