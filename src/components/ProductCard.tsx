import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RESTAURANTS } from '../data/mockData';
import { Dish } from '../types';
import { DishImage } from './DishImage';
import { SafetyTag } from './SafetyTag';

interface ProductCardProps {
  dish: Dish;
  dimmedOverride?: boolean;
  showRestaurantName?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  dish,
  dimmedOverride,
  showRestaurantName = false,
}) => {
  const { cart, getDishProfile, openDish, addToCart, updateCartQuantity } = useApp();

  const cartItem = cart.find((item) => item.dishId === dish.id);
  const qtyInCart = cartItem?.quantity ?? 0;
  const profile = getDishProfile(dish, cartItem?.customizationIds ?? []);
  const isUnsafe = profile.effectiveTier === 'unsafe';
  const isDimmed = dimmedOverride ?? isUnsafe;

  const restaurantName = showRestaurantName
    ? RESTAURANTS.find((r) => r.id === dish.restaurantId)?.name
    : undefined;

  return (
    <div
      className={`rounded-2xl bg-white dark:bg-[#162421] border border-[#E6E1D6] dark:border-[#273934] p-3.5 transition-all ${
        isDimmed
          ? 'opacity-45'
          : 'hover:border-[#0E6B5C]/45 dark:hover:border-[#5FD4BC]/40'
      }`}
    >
      <div className="flex items-start gap-3.5">
        <button
          type="button"
          onClick={() => openDish(dish.id)}
          className="flex-1 min-w-0 flex items-start gap-3.5 text-left rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E6B5C]"
        >
          <DishImage
            picsumSeed={dish.picsumSeed}
            artworkId={dish.artworkId}
            alt={dish.name}
            className="w-20 h-20 rounded-xl shrink-0"
          />

          <div className="flex-1 min-w-0 py-0.5">
            <SafetyTag
              tier={profile.effectiveTier}
              label={profile.statusLabel.replace(/^[✓⚠✕]\s*/, '')}
              compact
            />

            <h3 className="font-display text-[15px] font-bold text-[#162420] dark:text-[#EEF5F2] leading-snug mt-1">
              {dish.name}
            </h3>

            {restaurantName && (
              <div className="text-[11px] font-medium text-[#5F6F69] dark:text-[#899E96] mt-0.5 truncate">
                {restaurantName}
              </div>
            )}

            <div className="mt-1.5 text-[12px] font-medium text-[#4C5C56] dark:text-[#B3C5BE] tabular-nums flex flex-wrap items-center gap-1.5">
              <span className="font-bold text-[#162420] dark:text-[#EEF5F2]">
                ₹{profile.effectivePrice}
              </span>
              <span aria-hidden="true">·</span>
              <span>GI {profile.effectiveGi}</span>
              <span aria-hidden="true">·</span>
              <span>{profile.effectiveSugar}g sugar</span>
            </div>

            {profile.conflictReason && (
              <p className="mt-1 text-[11px] font-semibold text-[#C0392B] dark:text-[#F27A6E] line-clamp-1">
                {profile.conflictReason}
              </p>
            )}
          </div>
        </button>

        {!isUnsafe && (
          <div className="shrink-0 self-center">
            {qtyInCart === 0 ? (
              <button
                type="button"
                onClick={() => addToCart(dish.id, 1, [])}
                aria-label={`Add ${dish.name} to cart`}
                className="min-h-[40px] px-4 rounded-xl bg-[#E3F2EE] dark:bg-[#1E3B34] hover:bg-[#0E6B5C] text-[#0E6B5C] dark:text-[#5FD4BC] hover:text-white border border-[#0E6B5C]/25 dark:border-[#5FD4BC]/25 font-display text-[13px] font-bold tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E6B5C]"
              >
                ADD
              </button>
            ) : (
              <div className="inline-flex items-center bg-[#0E6B5C] text-white rounded-xl h-10 px-1 shadow-sm">
                <button
                  type="button"
                  onClick={() => updateCartQuantity(dish.id, -1)}
                  aria-label={`Decrease quantity of ${dish.name}`}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/15 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center text-[13px] font-bold tabular-nums">
                  {qtyInCart}
                </span>
                <button
                  type="button"
                  onClick={() => updateCartQuantity(dish.id, 1)}
                  aria-label={`Increase quantity of ${dish.name}`}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/15 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
