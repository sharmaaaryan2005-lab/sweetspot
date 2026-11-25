import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { DishImage } from '../components/DishImage';
import { ScoreCard } from '../components/ScoreCard';
import { useApp } from '../context/AppContext';
import { DISHES } from '../data/mockData';

export const DishDetailScreen: React.FC = () => {
  const {
    currentDish,
    cart,
    goBackFromDetail,
    addToCart,
    openCart,
    openDish,
    cartItemCount,
    getDishProfile,
    remainingSugarAfterCart,
  } = useApp();

  const existingCartItem = cart.find((i) => i.dishId === currentDish.id);

  const [quantity, setQuantity] = useState(1);
  const [selectedCustomizations, setSelectedCustomizations] = useState<string[]>(
    existingCartItem?.customizationIds ?? []
  );
  const [cookingRequest, setCookingRequest] = useState(
    existingCartItem?.cookingRequest ?? ''
  );

  // Sync local state when switching between dishes
  useEffect(() => {
    const found = cart.find((i) => i.dishId === currentDish.id);
    setSelectedCustomizations(found?.customizationIds ?? []);
    setCookingRequest(found?.cookingRequest ?? '');
    setQuantity(1);
  }, [currentDish.id]);

  const liveProfile = useMemo(
    () => getDishProfile(currentDish, selectedCustomizations),
    [currentDish, selectedCustomizations, getDishProfile]
  );

  const isSafe = liveProfile.effectiveTier === 'safe';
  const isUnsafe = liveProfile.effectiveTier === 'unsafe';

  const toggleCustomization = (id: string) => {
    setSelectedCustomizations((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const applyAllSafeCustomizations = () => {
    const helpfulIds = currentDish.customizations
      .filter((c) => c.sugarDelta <= 0 || c.giDelta < 0)
      .map((c) => c.id);
    setSelectedCustomizations(helpfulIds);
  };

  const swapDish = currentDish.swapDishId
    ? DISHES.find((d) => d.id === currentDish.swapDishId)
    : undefined;

  const addedSugarTotal = liveProfile.effectiveSugar * quantity;
  const wouldExceedBudget = addedSugarTotal > remainingSugarAfterCart;

  const handleAdd = () => {
    if (isUnsafe) return;
    addToCart(
      currentDish.id,
      quantity,
      selectedCustomizations,
      cookingRequest,
      false
    );
    openCart();
  };

  return (
    <div className="flex flex-col h-full bg-[#FAF7F0] dark:bg-[#0F1917] transition-colors">
      {/* Top Bar */}
      <header className="px-5 pt-4 pb-3 flex items-center justify-between bg-[#FAF7F0] dark:bg-[#0F1917] shrink-0">
        <button
          type="button"
          onClick={goBackFromDetail}
          aria-label="Back to menu"
          className="w-10 h-10 rounded-full bg-white dark:bg-[#162421] border border-[#E6E1D6] dark:border-[#273934] flex items-center justify-center text-[#162420] dark:text-[#EEF5F2] hover:bg-[#E3F2EE] dark:hover:bg-[#20312D] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <span className="font-display text-[13px] font-bold text-[#0E6B5C] dark:text-[#5FD4BC] tracking-wide tabular-nums">
          GLYCEMIC CHECK · GI {liveProfile.effectiveGi}
        </span>

        <button
          type="button"
          onClick={openCart}
          aria-label={`View cart (${cartItemCount} items)`}
          className="relative w-10 h-10 rounded-full bg-white dark:bg-[#162421] border border-[#E6E1D6] dark:border-[#273934] flex items-center justify-center text-[#162420] dark:text-[#EEF5F2] hover:bg-[#E3F2EE] dark:hover:bg-[#20312D] transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#0E6B5C] text-white text-[10px] font-bold tabular-nums flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </button>
      </header>

      {/* Scrollable Body */}
      <main className="flex-1 overflow-y-auto px-5 pb-6 space-y-5">
        {/* Hero Dish Photo */}
        <div className="rounded-3xl overflow-hidden border border-[#E6E1D6] dark:border-[#273934] bg-white dark:bg-[#162421] shadow-sm">
          <DishImage
            picsumSeed={currentDish.picsumSeed}
            artworkId={currentDish.artworkId}
            alt={currentDish.name}
            className="w-full aspect-[4/3]"
          />
        </div>

        {/* Title, Tag & Description */}
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className="w-5 h-5 rounded-md border-2 border-[#0E6B5C] dark:border-[#5FD4BC] flex items-center justify-center shrink-0"
                title="Dietary marker"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#0E6B5C] dark:bg-[#5FD4BC]" />
              </span>
              <h1 className="font-display text-[22px] font-extrabold text-[#162420] dark:text-[#EEF5F2] leading-tight">
                {currentDish.name}
              </h1>
            </div>
            <span className="font-display text-[19px] font-extrabold text-[#162420] dark:text-[#EEF5F2] tabular-nums shrink-0">
              ₹{liveProfile.effectivePrice}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-[12px] font-semibold text-[#4C5C56] dark:text-[#B3C5BE]">
            {currentDish.highlyReordered && (
              <span className="inline-flex items-center gap-1.5 text-[#0E6B5C] dark:text-[#5FD4BC]">
                <span className="w-5 h-1 rounded-full bg-[#0E6B5C] dark:bg-[#5FD4BC]" aria-hidden="true" />
                <span>Highly Reordered</span>
              </span>
            )}
            <span className="tabular-nums">
              {liveProfile.effectiveSugar}g sugar · {liveProfile.effectiveFiber}g fiber
            </span>
          </div>

          <p className="mt-3 text-[14px] leading-relaxed text-[#4C5C56] dark:text-[#B3C5BE]">
            {currentDish.description}
          </p>
        </div>

        {/* Live Safety Confidence Score Card */}
        <ScoreCard
          dish={currentDish}
          profile={liveProfile}
          selectedCustomizations={selectedCustomizations}
        />

        {/* Inline Customizations (Recalculates Score Live) */}
        {currentDish.customizations.length > 0 && (
          <section
            aria-label="Customize to lower blood sugar impact"
            className="rounded-2xl bg-white dark:bg-[#162421] border border-[#E6E1D6] dark:border-[#273934] p-4 space-y-3"
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-[15px] font-bold text-[#162420] dark:text-[#EEF5F2]">
                  Make it lower-GI
                </h2>
                <p className="text-[12px] text-[#5F6F69] dark:text-[#899E96]">
                  Live recalculates your Safety Confidence Score
                </p>
              </div>
              {!isSafe && (
                <button
                  type="button"
                  onClick={applyAllSafeCustomizations}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#E3F2EE] dark:bg-[#1E3B34] text-[#0E6B5C] dark:text-[#5FD4BC] font-display text-[11px] font-bold shrink-0"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Auto-optimize</span>
                </button>
              )}
            </div>

            <div className="space-y-2">
              {currentDish.customizations.map((opt) => {
                const checked = selectedCustomizations.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleCustomization(opt.id)}
                    aria-pressed={checked}
                    className={`w-full text-left p-3 rounded-xl border flex items-start justify-between gap-3 transition-colors ${
                      checked
                        ? 'bg-[#E3F2EE] dark:bg-[#12332C] border-[#0E6B5C] dark:border-[#5FD4BC]'
                        : 'bg-[#FAF7F0] dark:bg-[#20312D] border-[#E6E1D6] dark:border-[#273934] hover:border-[#0E6B5C]/40'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="font-display text-[13px] font-bold text-[#162420] dark:text-[#EEF5F2]">
                        {opt.label}
                      </div>
                      <div className="text-[12px] text-[#4C5C56] dark:text-[#B3C5BE] mt-0.5">
                        {opt.description}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] font-bold tabular-nums text-[#0E6B5C] dark:text-[#5FD4BC]">
                        {opt.sugarDelta < 0 && <span>{opt.sugarDelta}g sugar</span>}
                        {opt.giDelta < 0 && <span>{opt.giDelta} GI</span>}
                        {opt.fiberDelta > 0 && <span>+{opt.fiberDelta}g fiber</span>}
                        <span className="text-[#4C5C56] dark:text-[#B3C5BE]">
                          {opt.priceDelta > 0 ? `+₹${opt.priceDelta}` : 'Free'}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                        checked
                          ? 'bg-[#0E6B5C] border-[#0E6B5C] text-white'
                          : 'bg-white dark:bg-[#162421] border-[#CBD4D0] dark:border-[#3A524B] text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" strokeWidth={3} />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Cooking Request */}
        {!isUnsafe && (
          <section className="rounded-2xl bg-white dark:bg-[#162421] border border-[#E6E1D6] dark:border-[#273934] p-4">
            <label
              htmlFor="cooking-request-input"
              className="block font-display text-[14px] font-bold text-[#162420] dark:text-[#EEF5F2]"
            >
              Add a cooking request (optional)
            </label>
            <p className="text-[12px] text-[#5F6F69] dark:text-[#899E96] mt-0.5">
              The restaurant will try its best to fulfill your requests.
            </p>
            <div className="relative mt-2.5">
              <textarea
                id="cooking-request-input"
                rows={3}
                maxLength={100}
                value={cookingRequest}
                onChange={(e) => setCookingRequest(e.target.value)}
                placeholder="e.g. Dressing on the side, no added sugar"
                className="w-full rounded-xl bg-[#FAF7F0] dark:bg-[#20312D] border border-[#DFD9CC] dark:border-[#273934] p-3 text-[13px] text-[#162420] dark:text-[#EEF5F2] placeholder:text-[#7A8A84] resize-none focus:outline-none focus:border-[#0E6B5C]"
              />
              <span className="absolute right-3 bottom-2.5 text-[11px] font-medium text-[#6B7B75] dark:text-[#899E96] tabular-nums">
                {100 - cookingRequest.length}
              </span>
            </div>
          </section>
        )}
      </main>

      {/* Bottom Sticky Bar */}
      <footer className="px-5 py-3.5 bg-white dark:bg-[#162421] border-t border-[#E6E1D6] dark:border-[#273934] shrink-0 space-y-2">
        {!isUnsafe && wouldExceedBudget && (
          <div className="text-center text-[11px] font-bold text-[#B8791B] dark:text-[#F0B24A] tabular-nums">
            Heads up: +{addedSugarTotal}g sugar exceeds your remaining {Math.max(0, remainingSugarAfterCart)}g budget today
          </div>
        )}

        {isUnsafe ? (
          <div className="space-y-2">
            <div className="text-center text-[12px] font-bold text-[#C0392B] dark:text-[#F27A6E]">
              {liveProfile.conflictReason
                ? `Blocked: ${liveProfile.conflictReason}`
                : `Blocked by Sweet Spot — High Glycemic Load (${liveProfile.effectiveSugar}g sugar)`}
            </div>
            {swapDish ? (
              <button
                type="button"
                onClick={() => openDish(swapDish.id)}
                className="w-full h-12 rounded-2xl bg-[#0E6B5C] hover:bg-[#0A5448] text-white font-display font-bold text-[14px] transition-colors"
              >
                Try Safe Swap: {swapDish.name}
              </button>
            ) : (
              <button
                type="button"
                onClick={goBackFromDetail}
                className="w-full h-12 rounded-2xl bg-[#EAE6DC] dark:bg-[#20312D] text-[#162420] dark:text-[#EEF5F2] font-display font-bold text-[15px]"
              >
                Back to safe menu
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="h-12 px-1.5 rounded-2xl bg-[#EAE6DC] dark:bg-[#20312D] flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="w-9 h-9 rounded-xl flex items-center justify-center text-[#162420] dark:text-[#EEF5F2] hover:bg-white/70 dark:hover:bg-[#162421] transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-7 text-center font-display text-[15px] font-bold text-[#162420] dark:text-[#EEF5F2] tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
                className="w-9 h-9 rounded-xl flex items-center justify-center text-[#162420] dark:text-[#EEF5F2] hover:bg-white/70 dark:hover:bg-[#162421] transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className={`flex-1 h-12 px-4 rounded-2xl font-display font-bold text-[14px] text-white shadow-md transition-all active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E6B5C] ${
                isSafe
                  ? 'bg-[#0E6B5C] hover:bg-[#0A5448] shadow-[#0E6B5C]/20'
                  : 'bg-[#B8791B] hover:bg-[#9C6615] shadow-[#B8791B]/20'
              }`}
            >
              {isSafe
                ? 'Add to cart — safe for you'
                : `Add borderline · ₹${liveProfile.effectivePrice * quantity}`}
            </button>
          </div>
        )}
      </footer>
    </div>
  );
};
