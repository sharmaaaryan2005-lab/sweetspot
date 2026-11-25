import React, { useState } from 'react';
import { AlertTriangle, Check, Droplets, Minus, Pencil, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface BudgetBarProps {
  compact?: boolean;
}

export const BudgetBar: React.FC<BudgetBarProps> = ({ compact = false }) => {
  const {
    dailySugarCeiling,
    sugarLoggedToday,
    cartSugarGrams,
    projectedTotalSugar,
    remainingSugarAfterCart,
    isOverSugarBudget,
    setDailySugarCeiling,
  } = useApp();

  const [editingCeiling, setEditingCeiling] = useState(false);

  const loggedPercent = Math.min(100, (sugarLoggedToday / dailySugarCeiling) * 100);
  const cartPercent = Math.min(
    100 - loggedPercent,
    (cartSugarGrams / dailySugarCeiling) * 100
  );

  const nearLimit = !isOverSugarBudget && remainingSugarAfterCart <= 8;

  return (
    <section
      aria-label="Daily sugar budget tracker"
      className={`rounded-2xl border transition-colors ${
        isOverSugarBudget
          ? 'bg-[#FBECEB] dark:bg-[#331715] border-[#C0392B]/35'
          : nearLimit
          ? 'bg-[#FDF4E7] dark:bg-[#2E2212] border-[#B8791B]/35'
          : 'bg-white dark:bg-[#162421] border-[#E6E1D6] dark:border-[#273934]'
      } ${compact ? 'px-3.5 py-2.5' : 'p-3.5'}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Droplets
            className={`w-4 h-4 shrink-0 ${
              isOverSugarBudget
                ? 'text-[#C0392B] dark:text-[#F27A6E]'
                : nearLimit
                ? 'text-[#B8791B] dark:text-[#F0B24A]'
                : 'text-[#0E6B5C] dark:text-[#5FD4BC]'
            }`}
          />
          <span className="font-display text-[12px] font-bold text-[#162420] dark:text-[#EEF5F2] truncate">
            Daily sugar budget
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[12px] font-bold tabular-nums text-[#162420] dark:text-[#EEF5F2]">
            {projectedTotalSugar}g{' '}
            <span className="font-medium text-[#5F6F69] dark:text-[#899E96]">
              / {dailySugarCeiling}g
            </span>
          </span>
          <button
            type="button"
            onClick={() => setEditingCeiling((e) => !e)}
            aria-label={editingCeiling ? 'Done editing sugar ceiling' : 'Edit daily sugar ceiling'}
            className="w-7 h-7 rounded-lg bg-[#FAF7F0] dark:bg-[#20312D] border border-[#E6E1D6] dark:border-[#273934] flex items-center justify-center text-[#4C5C56] dark:text-[#B3C5BE] hover:text-[#0E6B5C] transition-colors"
          >
            {editingCeiling ? <Check className="w-3.5 h-3.5" /> : <Pencil className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Progress Track */}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={dailySugarCeiling}
        aria-valuenow={projectedTotalSugar}
        aria-label="Daily sugar used and in cart"
        className="mt-2 h-2.5 w-full rounded-full bg-[#EAE6DC] dark:bg-[#20312D] overflow-hidden flex"
      >
        <div
          style={{ width: `${loggedPercent}%` }}
          className="h-full bg-[#0E6B5C] transition-all duration-300"
          title={`Logged today: ${sugarLoggedToday}g`}
        />
        {cartSugarGrams > 0 && (
          <div
            style={{ width: `${cartPercent}%` }}
            className={`h-full transition-all duration-300 ${
              isOverSugarBudget
                ? 'bg-[#C0392B]'
                : nearLimit
                ? 'bg-[#B8791B]'
                : 'bg-[#56B8A3]'
            }`}
            title={`In cart: ${cartSugarGrams}g`}
          />
        )}
      </div>

      {/* Status caption & breakdown */}
      <div className="mt-2 flex items-center justify-between gap-2 text-[11px] tabular-nums">
        <span className="text-[#4C5C56] dark:text-[#B3C5BE]">
          Logged {sugarLoggedToday}g · Cart +{cartSugarGrams}g
        </span>
        {isOverSugarBudget ? (
          <span className="font-bold text-[#C0392B] dark:text-[#F27A6E] inline-flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Over by {Math.abs(remainingSugarAfterCart)}g
          </span>
        ) : (
          <span className="font-bold text-[#0E6B5C] dark:text-[#5FD4BC]">
            {remainingSugarAfterCart}g left today
          </span>
        )}
      </div>

      {/* Inline ceiling editor */}
      {editingCeiling && (
        <div className="mt-2.5 pt-2.5 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-2">
          <span className="text-[12px] font-medium text-[#4C5C56] dark:text-[#B3C5BE]">
            Adjust daily ceiling
          </span>
          <div className="inline-flex items-center gap-1 bg-[#FAF7F0] dark:bg-[#20312D] border border-[#DFD9CC] dark:border-[#273934] rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => setDailySugarCeiling(dailySugarCeiling - 5)}
              aria-label="Decrease daily sugar ceiling by 5 grams"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#162420] dark:text-[#EEF5F2] hover:bg-[#E3F2EE] dark:hover:bg-[#162421]"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-11 text-center text-[12px] font-bold tabular-nums text-[#162420] dark:text-[#EEF5F2]">
              {dailySugarCeiling}g
            </span>
            <button
              type="button"
              onClick={() => setDailySugarCeiling(dailySugarCeiling + 5)}
              aria-label="Increase daily sugar ceiling by 5 grams"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#162420] dark:text-[#EEF5F2] hover:bg-[#E3F2EE] dark:hover:bg-[#162421]"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
