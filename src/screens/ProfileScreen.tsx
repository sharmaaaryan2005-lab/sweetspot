import React from 'react';
import {
  ArrowLeft,
  Check,
  HelpCircle,
  Moon,
  RotateCcw,
  Sun,
} from 'lucide-react';
import { BudgetBar } from '../components/BudgetBar';
import { Toggle } from '../components/Toggle';
import { useApp } from '../context/AppContext';
import { ManagementCondition, SeverityMode } from '../types';

const CONDITION_LABELS: { id: ManagementCondition; label: string }[] = [
  { id: 'diabetes', label: 'Diabetes (Low-GI)' },
  { id: 'jain', label: 'Jain / Pure Veg' },
  { id: 'allergies', label: 'Allergies' },
];

const SEVERITY_OPTIONS: { id: SeverityMode; label: string }[] = [
  { id: 'strict', label: 'Strict' },
  { id: 'flexible', label: 'Flexible' },
];

export const ProfileScreen: React.FC = () => {
  const {
    selectedConditions,
    severityMode,
    darkMode,
    orderHistory,
    sugarLoggedToday,
    toggleCondition,
    setSeverityMode,
    toggleDarkMode,
    resetSugarLoggedToday,
    replayMenuOnboarding,
    reorderFromHistory,
    goToHome,
  } = useApp();

  return (
    <div className="flex flex-col h-full bg-[#FAF7F0] dark:bg-[#0F1917] transition-colors">
      <header className="px-5 pt-5 pb-3.5 flex items-center justify-between border-b border-[#E6E1D6] dark:border-[#273934] shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => goToHome('delivery')}
            aria-label="Back to home"
            className="w-10 h-10 rounded-full bg-white dark:bg-[#162421] border border-[#E6E1D6] dark:border-[#273934] flex items-center justify-center text-[#162420] dark:text-[#EEF5F2] hover:bg-[#E3F2EE] dark:hover:bg-[#20312D]"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display text-[19px] font-extrabold text-[#162420] dark:text-[#EEF5F2]">
              Sweet Spot Settings
            </h1>
            <p className="text-[12px] text-[#5F6F69] dark:text-[#899E96]">
              Conditions, sugar ceiling &amp; safe history
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleDarkMode}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          className="w-10 h-10 rounded-full bg-white dark:bg-[#162421] border border-[#E6E1D6] dark:border-[#273934] text-[#162420] dark:text-[#EEF5F2] flex items-center justify-center"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Editable Daily Sugar Budget */}
        <div className="space-y-2">
          <BudgetBar />
          {sugarLoggedToday > 0 && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={resetSugarLoggedToday}
                className="text-[12px] font-semibold text-[#0E6B5C] dark:text-[#5FD4BC] hover:underline"
              >
                Reset today&apos;s {sugarLoggedToday}g log
              </button>
            </div>
          )}
        </div>

        {/* Conditions & Severity */}
        <section className="rounded-2xl bg-white dark:bg-[#162421] border border-[#E6E1D6] dark:border-[#273934] p-4 space-y-4">
          <div>
            <h2 className="font-display text-[14px] font-bold text-[#162420] dark:text-[#EEF5F2]">
              Active guardrails
            </h2>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {CONDITION_LABELS.map((item) => {
                const active = selectedConditions.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleCondition(item.id)}
                    className={`h-9 px-3 rounded-xl text-[12px] font-bold inline-flex items-center gap-1.5 transition-colors ${
                      active
                        ? 'bg-[#0E6B5C] text-white'
                        : 'bg-[#FAF7F0] dark:bg-[#20312D] text-[#4C5C56] dark:text-[#B3C5BE] border border-[#E6E1D6] dark:border-[#273934]'
                    }`}
                  >
                    {active && <Check className="w-3.5 h-3.5" />}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-[#EFECE4] dark:border-[#273934] space-y-2">
            <div className="font-display text-[14px] font-bold text-[#162420] dark:text-[#EEF5F2]">
              Severity mode
            </div>
            <Toggle
              options={SEVERITY_OPTIONS}
              value={severityMode}
              onChange={setSeverityMode}
              ariaLabel="Severity mode"
            />
          </div>
        </section>

        {/* Safe Order History */}
        <section className="space-y-2.5">
          <h2 className="font-display text-[15px] font-bold text-[#162420] dark:text-[#EEF5F2]">
            Safe order history
          </h2>

          {orderHistory.map((entry) => (
            <div
              key={entry.id}
              className="rounded-2xl bg-white dark:bg-[#162421] border border-[#E6E1D6] dark:border-[#273934] p-3.5 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-[#0E6B5C] dark:text-[#5FD4BC]">
                  {entry.dateLabel} · {entry.totalSugarGrams}g sugar
                </div>
                <div className="font-display text-[14px] font-bold text-[#162420] dark:text-[#EEF5F2] truncate mt-0.5">
                  {entry.items.map((i) => i.dishName).join(', ')}
                </div>
                <div className="text-[12px] text-[#5F6F69] dark:text-[#899E96] tabular-nums">
                  {entry.restaurantName} · ₹{entry.totalAmount}
                </div>
              </div>

              <button
                type="button"
                onClick={() => reorderFromHistory(entry)}
                className="h-9 px-3 rounded-xl bg-[#E3F2EE] dark:bg-[#1E3B34] hover:bg-[#0E6B5C] text-[#0E6B5C] dark:text-[#5FD4BC] hover:text-white font-display text-[12px] font-bold inline-flex items-center gap-1.5 shrink-0 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reorder</span>
              </button>
            </div>
          ))}
        </section>

        {/* Menu Guide Replay */}
        <button
          type="button"
          onClick={replayMenuOnboarding}
          className="w-full h-11 rounded-2xl bg-white dark:bg-[#162421] border border-[#E6E1D6] dark:border-[#273934] text-[#162420] dark:text-[#EEF5F2] font-display text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#E3F2EE] dark:hover:bg-[#20312D] transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-[#0E6B5C] dark:text-[#5FD4BC]" />
          <span>Replay Safe-First menu guide</span>
        </button>
      </main>
    </div>
  );
};
