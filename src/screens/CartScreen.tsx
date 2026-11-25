import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRightLeft,
  CheckCircle2,
  MessageSquare,
  Minus,
  Plus,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import { BudgetBar } from '../components/BudgetBar';
import { DishImage } from '../components/DishImage';
import { SafetyTag } from '../components/SafetyTag';
import { useApp } from '../context/AppContext';
import { DISHES } from '../data/mockData';

const QUICK_REQUESTS = [
  'Serve glazed sauce on the side',
  'Use zero-sugar tamari instead of sweet glaze',
  'Half portion of rice, double steamed greens',
];

export const CartScreen: React.FC = () => {
  const {
    cart,
    cartItemCount,
    cartSubtotal,
    cartCharges,
    cartTotal,
    cartSugarGrams,
    dailySugarCeiling,
    sugarLoggedToday,
    isOverSugarBudget,
    remainingSugarAfterCart,
    cartRestaurantName,
    orderConfirmed,
    unresolvedUnsafeCartItems,
    getDishProfile,
    updateCartQuantity,
    swapCartItem,
    updateItemNote,
    acknowledgeCartItemRisk,
    checkout,
    dismissOrderConfirmation,
    goToHome,
    openRestaurant,
    openDish,
    openProfile,
  } = useApp();

  const [inlineSwapDishId, setInlineSwapDishId] = useState<string | null>(null);
  const [noteTargetDishId, setNoteTargetDishId] = useState<string | null>(null);
  const [draftNote, setDraftNote] = useState('');
  const [budgetAcknowledged, setBudgetAcknowledged] = useState(false);

  const openNoteModal = (dishId: string, existingNote?: string) => {
    setNoteTargetDishId(dishId);
    setDraftNote(existingNote ?? '');
  };

  if (orderConfirmed) {
    const remainingAfterOrder = Math.max(0, dailySugarCeiling - sugarLoggedToday);

    return (
      <div className="flex flex-col h-full bg-[#FAF7F0] dark:bg-[#0F1917] px-6 py-8 justify-between transition-colors">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#E3F2EE] dark:bg-[#12332C] text-[#0E6B5C] dark:text-[#5FD4BC] flex items-center justify-center mb-5">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0E6B5C] dark:text-[#5FD4BC]">
            Order {orderConfirmed.id} Confirmed
          </span>
          <h1 className="font-display text-[24px] font-extrabold text-[#162420] dark:text-[#EEF5F2] mt-1">
            Safe meal on the way
          </h1>
          <p className="mt-2 text-[14px] text-[#4C5C56] dark:text-[#B3C5BE] max-w-[300px]">
            {orderConfirmed.restaurantName} is preparing your meal. Estimated delivery in{' '}
            <strong className="text-[#162420] dark:text-[#EEF5F2]">25 mins</strong>.
          </p>

          <div className="mt-6 w-full rounded-2xl bg-white dark:bg-[#162421] border border-[#E6E1D6] dark:border-[#273934] p-4 text-left space-y-2.5">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#5F6F69] dark:text-[#899E96]">Total paid</span>
              <span className="font-display font-bold text-[#162420] dark:text-[#EEF5F2] tabular-nums">
                ₹{orderConfirmed.totalAmount}
              </span>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#5F6F69] dark:text-[#899E96]">Order sugar load</span>
              <span className="font-bold text-[#0E6B5C] dark:text-[#5FD4BC] tabular-nums">
                {orderConfirmed.totalSugarGrams}g sugar
              </span>
            </div>
            <div className="flex items-center justify-between text-[13px] pt-2 border-t border-[#EFECE4] dark:border-[#273934]">
              <span className="text-[#5F6F69] dark:text-[#899E96]">Daily budget status</span>
              <span className="font-bold text-[#162420] dark:text-[#EEF5F2] tabular-nums">
                {sugarLoggedToday}g / {dailySugarCeiling}g ({remainingAfterOrder}g left)
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={dismissOrderConfirmation}
          className="w-full h-12 rounded-2xl bg-[#0E6B5C] hover:bg-[#0A5448] text-white font-display font-bold text-[15px] transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  // Blocking check: unresolved unsafe items OR over sugar budget without acknowledgment
  const hasUnsafeBlocker = unresolvedUnsafeCartItems.length > 0;
  const hasBudgetBlocker = isOverSugarBudget && !budgetAcknowledged;
  const checkoutBlocked = hasUnsafeBlocker || hasBudgetBlocker;

  const safeSwapSuggestions = DISHES.filter(
    (d) => getDishProfile(d).effectiveTier === 'safe'
  );

  return (
    <div className="flex flex-col h-full bg-[#FAF7F0] dark:bg-[#0F1917] relative transition-colors">
      {/* Header */}
      <header className="px-5 pt-5 pb-3.5 flex items-center justify-between border-b border-[#E6E1D6] dark:border-[#273934] bg-[#FAF7F0] dark:bg-[#0F1917] shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => openRestaurant('the-green-bowl')}
            aria-label="Back to menu"
            className="w-10 h-10 rounded-full bg-white dark:bg-[#162421] border border-[#E6E1D6] dark:border-[#273934] flex items-center justify-center text-[#162420] dark:text-[#EEF5F2] hover:bg-[#E3F2EE] dark:hover:bg-[#20312D] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display text-[20px] font-extrabold text-[#162420] dark:text-[#EEF5F2] leading-tight">
              Your Cart
            </h1>
            {cartItemCount > 0 && (
              <p className="text-[13px] font-semibold text-[#4C5C56] dark:text-[#B3C5BE] mt-0.5 tabular-nums">
                {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} — {cartRestaurantName}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={openProfile}
          aria-label="Sweet Spot settings"
          className="w-10 h-10 rounded-full bg-[#0E6B5C] text-white flex items-center justify-center hover:bg-[#0A5448] transition-colors"
        >
          <ShieldCheck className="w-5 h-5" />
        </button>
      </header>

      {/* Main Cart Body */}
      <main className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Daily Sugar Budget Tracker */}
        <BudgetBar />

        {cart.length === 0 ? (
          <div className="rounded-3xl bg-white dark:bg-[#162421] border border-[#E6E1D6] dark:border-[#273934] p-8 text-center mt-2">
            <div className="w-14 h-14 rounded-2xl bg-[#E3F2EE] dark:bg-[#12332C] text-[#0E6B5C] dark:text-[#5FD4BC] flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h2 className="font-display text-[18px] font-bold text-[#162420] dark:text-[#EEF5F2]">
              Your cart is empty
            </h2>
            <p className="mt-1.5 text-[14px] text-[#5F6F69] dark:text-[#899E96]">
              Browse verified low-GI kitchens near GK1, Delhi to build a blood-sugar-steady meal.
            </p>
            <button
              type="button"
              onClick={() => goToHome('delivery')}
              className="mt-5 h-11 px-6 rounded-xl bg-[#0E6B5C] hover:bg-[#0A5448] text-white font-display font-bold text-[14px] transition-colors"
            >
              Browse safe restaurants
            </button>
          </div>
        ) : (
          <>
            {/* Cart Item Rows */}
            <div className="space-y-3">
              {cart.map((item) => {
                const dish = DISHES.find((d) => d.id === item.dishId);
                if (!dish) return null;

                const profile = getDishProfile(dish, item.customizationIds);
                const isSafe = profile.effectiveTier === 'safe';
                const isBorderline = profile.effectiveTier === 'borderline';
                const isUnsafe = profile.effectiveTier === 'unsafe';
                const swapOpen = inlineSwapDishId === dish.id;

                const sameKitchenSwaps = safeSwapSuggestions.filter(
                  (s) => s.id !== dish.id && s.restaurantId === dish.restaurantId
                );
                const fallbackSwaps =
                  sameKitchenSwaps.length > 0
                    ? sameKitchenSwaps
                    : safeSwapSuggestions.filter((s) => s.id !== dish.id).slice(0, 2);

                return (
                  <div
                    key={dish.id}
                    className={`rounded-2xl bg-white dark:bg-[#162421] border p-3.5 space-y-3 ${
                      isUnsafe && !item.acknowledgedRisk
                        ? 'border-[#C0392B] dark:border-[#F27A6E]'
                        : 'border-[#E6E1D6] dark:border-[#273934]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => openDish(dish.id)}
                        className="shrink-0 rounded-xl overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E6B5C]"
                      >
                        <DishImage
                          picsumSeed={dish.picsumSeed}
                          artworkId={dish.artworkId}
                          alt={dish.name}
                          className="w-16 h-16 rounded-xl"
                        />
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => openDish(dish.id)}
                            className="font-display text-[15px] font-bold text-[#162420] dark:text-[#EEF5F2] text-left leading-snug hover:text-[#0E6B5C] dark:hover:text-[#5FD4BC]"
                          >
                            {dish.name}
                          </button>
                          <span className="font-display text-[15px] font-bold text-[#162420] dark:text-[#EEF5F2] tabular-nums shrink-0">
                            ₹{profile.effectivePrice * item.quantity}
                          </span>
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <SafetyTag
                            tier={profile.effectiveTier}
                            label={
                              isSafe
                                ? 'Low-GI Verified'
                                : isBorderline
                                ? dish.cartStatusText
                                : profile.conflictReason ?? 'High Glycemic Spike Risk'
                            }
                            compact
                          />
                          <span className="text-[11px] font-semibold text-[#5F6F69] dark:text-[#899E96] tabular-nums">
                            · {profile.effectiveSugar * item.quantity}g sugar
                          </span>
                        </div>

                        {item.customizationIds.length > 0 && (
                          <div className="mt-1 text-[11px] font-semibold text-[#0E6B5C] dark:text-[#5FD4BC]">
                            Customized ({item.customizationIds.length} sugar-saving swaps applied)
                          </div>
                        )}

                        {item.cookingRequest && (
                          <p className="mt-1.5 text-[12px] text-[#4C5C56] dark:text-[#B3C5BE] bg-[#FAF7F0] dark:bg-[#20312D] rounded-lg px-2.5 py-1.5 border border-[#E6E1D6] dark:border-[#273934]">
                            Note: &ldquo;{item.cookingRequest}&rdquo;
                          </p>
                        )}

                        {/* In-cart quantity & edit controls */}
                        <div className="mt-2.5 flex items-center justify-between gap-2">
                          <div className="inline-flex items-center bg-[#FAF7F0] dark:bg-[#20312D] border border-[#DFD9CC] dark:border-[#273934] rounded-xl h-8 px-1">
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(dish.id, -1)}
                              aria-label={`Decrease quantity of ${dish.name}`}
                              className="w-7 h-7 flex items-center justify-center rounded-lg text-[#162420] dark:text-[#EEF5F2] hover:bg-[#E3F2EE] dark:hover:bg-[#162421]"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-6 text-center text-[13px] font-bold text-[#162420] dark:text-[#EEF5F2] tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(dish.id, 1)}
                              aria-label={`Increase quantity of ${dish.name}`}
                              className="w-7 h-7 flex items-center justify-center rounded-lg text-[#162420] dark:text-[#EEF5F2] hover:bg-[#E3F2EE] dark:hover:bg-[#162421]"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => openDish(dish.id)}
                            className="text-[12px] font-semibold text-[#0E6B5C] dark:text-[#5FD4BC] hover:underline"
                          >
                            Customize swaps
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons for Borderline or Unsafe Items */}
                    {!isSafe && (
                      <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#EFECE4] dark:border-[#273934]">
                        <button
                          type="button"
                          onClick={() =>
                            setInlineSwapDishId(swapOpen ? null : dish.id)
                          }
                          className="min-h-[42px] px-3 rounded-xl bg-[#E3F2EE] dark:bg-[#12332C] hover:bg-[#D5EBE5] text-[#0E6B5C] dark:text-[#5FD4BC] font-display text-[12px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5 shrink-0" />
                          <span>{swapOpen ? 'Hide Swaps' : 'See Low-GI Swap'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => openNoteModal(dish.id, item.cookingRequest)}
                          className="min-h-[42px] px-3 rounded-xl bg-[#FAF7F0] dark:bg-[#20312D] hover:bg-[#EFECE4] border border-[#DFD9CC] dark:border-[#273934] text-[#162420] dark:text-[#EEF5F2] font-display text-[12px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                          <span>Ask Restaurant</span>
                        </button>
                      </div>
                    )}

                    {/* Inline Safe-Swap Engine Tray */}
                    {swapOpen && (
                      <div className="rounded-xl bg-[#E3F2EE]/60 dark:bg-[#12332C]/80 border border-[#0E6B5C]/25 p-3 space-y-2.5">
                        <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#0E6B5C] dark:text-[#5FD4BC]">
                          Recommended Lower-GI Swaps
                        </div>
                        {fallbackSwaps.slice(0, 2).map((alt) => {
                          const altProfile = getDishProfile(alt);
                          return (
                            <div
                              key={alt.id}
                              className="rounded-xl bg-white dark:bg-[#162421] p-2.5 flex items-center justify-between gap-2.5 border border-[#E6E1D6] dark:border-[#273934]"
                            >
                              <div className="min-w-0">
                                <div className="font-display text-[13px] font-bold text-[#162420] dark:text-[#EEF5F2] truncate">
                                  {alt.name}
                                </div>
                                <div className="text-[11px] text-[#0E6B5C] dark:text-[#5FD4BC] font-semibold tabular-nums">
                                  GI {altProfile.effectiveGi} · {altProfile.effectiveSugar}g sugar · ₹{altProfile.effectivePrice}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  swapCartItem(dish.id, alt.id);
                                  setInlineSwapDishId(null);
                                }}
                                className="h-8 px-3 rounded-lg bg-[#0E6B5C] hover:bg-[#0A5448] text-white font-display text-[11px] font-bold shrink-0"
                              >
                                Replace
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Checkout Blocker / Conflict Resolution Banner */}
            {checkoutBlocked && (
              <section
                role="alert"
                aria-label="Checkout safety check"
                className="rounded-2xl bg-[#FBECEB] dark:bg-[#331715] border border-[#C0392B]/40 p-4 space-y-3"
              >
                <div className="flex items-start gap-2.5">
                  <ShieldAlert className="w-5 h-5 text-[#C0392B] dark:text-[#F27A6E] shrink-0 mt-0.5" />
                  <div>
                    <h2 className="font-display text-[14px] font-extrabold text-[#162420] dark:text-[#EEF5F2]">
                      Checkout paused for your safety
                    </h2>
                    <p className="text-[12px] text-[#4C5C56] dark:text-[#E2C2BF] mt-0.5">
                      {hasUnsafeBlocker
                        ? 'Your cart contains a dish that conflicts with your active profile guardrails.'
                        : `This order pushes you ${Math.abs(
                            remainingSugarAfterCart
                          )}g over your ${dailySugarCeiling}g daily sugar ceiling.`}
                    </p>
                  </div>
                </div>

                {hasUnsafeBlocker &&
                  unresolvedUnsafeCartItems.map((unsafeItem) => {
                    const dish = DISHES.find((d) => d.id === unsafeItem.dishId);
                    if (!dish) return null;
                    const fallback = safeSwapSuggestions[0];

                    return (
                      <div
                        key={dish.id}
                        className="rounded-xl bg-white/80 dark:bg-[#162421] p-3 space-y-2 border border-[#C0392B]/20"
                      >
                        <div className="text-[12px] font-bold text-[#162420] dark:text-[#EEF5F2]">
                          Resolve: {dish.name}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {fallback && (
                            <button
                              type="button"
                              onClick={() => swapCartItem(dish.id, fallback.id)}
                              className="h-8 px-3 rounded-lg bg-[#0E6B5C] text-white font-display text-[11px] font-bold"
                            >
                              Swap to {fallback.name}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(dish.id, -unsafeItem.quantity)
                            }
                            className="h-8 px-3 rounded-lg bg-[#EAE6DC] dark:bg-[#20312D] text-[#162420] dark:text-[#EEF5F2] font-display text-[11px] font-bold inline-flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => acknowledgeCartItemRisk(dish.id)}
                            className="h-8 px-3 rounded-lg border border-[#C0392B]/40 text-[#C0392B] dark:text-[#F27A6E] font-display text-[11px] font-bold"
                          >
                            Acknowledge risk
                          </button>
                        </div>
                      </div>
                    );
                  })}

                {!hasUnsafeBlocker && hasBudgetBlocker && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setBudgetAcknowledged(true)}
                      className="h-9 px-3.5 rounded-xl bg-[#B8791B] text-white font-display text-[12px] font-bold inline-flex items-center gap-1.5"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Acknowledge over-budget &amp; unlock checkout</span>
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* Bill Breakdown */}
            <section
              aria-label="Bill breakdown"
              className="rounded-2xl bg-white dark:bg-[#162421] border border-[#E6E1D6] dark:border-[#273934] p-4 space-y-2.5"
            >
              <div className="flex items-center justify-between text-[14px] text-[#4C5C56] dark:text-[#B3C5BE]">
                <span>Item total</span>
                <span className="font-semibold text-[#162420] dark:text-[#EEF5F2] tabular-nums">
                  ₹{cartSubtotal}
                </span>
              </div>

              <div className="flex items-center justify-between text-[14px] text-[#4C5C56] dark:text-[#B3C5BE]">
                <span>Delivery &amp; Other Charges</span>
                <span className="font-semibold text-[#162420] dark:text-[#EEF5F2] tabular-nums">
                  ₹{cartCharges}
                </span>
              </div>

              <div className="flex items-center justify-between text-[13px] text-[#0E6B5C] dark:text-[#5FD4BC]">
                <span>Total order sugar</span>
                <span className="font-bold tabular-nums">{cartSugarGrams}g</span>
              </div>

              <div className="pt-2.5 border-t border-[#EFECE4] dark:border-[#273934] flex items-center justify-between">
                <span className="font-display text-[16px] font-extrabold text-[#162420] dark:text-[#EEF5F2]">
                  Total
                </span>
                <span className="font-display text-[18px] font-extrabold text-[#162420] dark:text-[#EEF5F2] tabular-nums">
                  ₹{cartTotal}
                </span>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Bottom Sticky Checkout Bar */}
      {cart.length > 0 && (
        <footer className="px-5 py-3.5 bg-white dark:bg-[#162421] border-t border-[#E6E1D6] dark:border-[#273934] shrink-0">
          <button
            type="button"
            disabled={checkoutBlocked}
            onClick={checkout}
            className={`w-full h-[52px] rounded-2xl font-display font-bold text-[16px] tabular-nums transition-all ${
              checkoutBlocked
                ? 'bg-[#CBD4D0] dark:bg-[#20312D] text-[#5F6F69] dark:text-[#899E96] cursor-not-allowed'
                : 'bg-[#0E6B5C] hover:bg-[#0A5448] active:scale-[0.99] text-white shadow-lg shadow-[#0E6B5C]/20'
            }`}
          >
            {checkoutBlocked
              ? 'Resolve safety alert above to checkout'
              : `Checkout · ₹${cartTotal}`}
          </button>
        </footer>
      )}

      {/* Ask Restaurant Modal */}
      {noteTargetDishId && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Ask Restaurant"
          className="absolute inset-0 z-30 bg-black/45 backdrop-blur-[2px] flex items-end"
        >
          <div className="w-full rounded-t-3xl bg-[#FAF7F0] dark:bg-[#0F1917] border-t border-[#E6E1D6] dark:border-[#273934] p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-[18px] font-extrabold text-[#162420] dark:text-[#EEF5F2]">
                  Ask Restaurant
                </h2>
                <p className="text-[13px] text-[#4C5C56] dark:text-[#B3C5BE]">
                  Send a sugar-safe prep request to {cartRestaurantName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setNoteTargetDishId(null)}
                aria-label="Close kitchen request"
                className="w-9 h-9 rounded-full bg-white dark:bg-[#162421] border border-[#E6E1D6] dark:border-[#273934] flex items-center justify-center text-[#162420] dark:text-[#EEF5F2]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {QUICK_REQUESTS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setDraftNote(preset)}
                  className={`px-3 py-2 rounded-xl text-[12px] font-semibold border transition-colors ${
                    draftNote === preset
                      ? 'bg-[#0E6B5C] text-white border-[#0E6B5C]'
                      : 'bg-white dark:bg-[#162421] text-[#162420] dark:text-[#EEF5F2] border-[#DFD9CC] dark:border-[#273934] hover:bg-[#E3F2EE]'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            <textarea
              rows={2}
              maxLength={100}
              value={draftNote}
              onChange={(e) => setDraftNote(e.target.value)}
              placeholder="Write a custom kitchen note..."
              className="w-full rounded-xl bg-white dark:bg-[#162421] border border-[#DFD9CC] dark:border-[#273934] p-3 text-[13px] text-[#162420] dark:text-[#EEF5F2] resize-none focus:outline-none focus:border-[#0E6B5C]"
            />

            <button
              type="button"
              onClick={() => {
                updateItemNote(noteTargetDishId, draftNote);
                setNoteTargetDishId(null);
              }}
              className="w-full h-11 rounded-xl bg-[#0E6B5C] hover:bg-[#0A5448] text-white font-display font-bold text-[14px]"
            >
              Save kitchen request
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
