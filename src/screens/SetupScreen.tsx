import React from 'react';
import { Check, Droplets, Leaf, Moon, ShieldAlert, Sun, User } from 'lucide-react';
import { Toggle } from '../components/Toggle';
import { useApp } from '../context/AppContext';
import { ManagementCondition, SeverityMode } from '../types';

interface ConditionOption {
  id: ManagementCondition;
  title: string;
  activeSubtext: string;
  inactiveSubtext: string;
  icon: React.ReactNode;
  accentColor: string;
}

const OPTIONS: ConditionOption[] = [
  {
    id: 'diabetes',
    title: 'Diabetes',
    activeSubtext: 'Low-GI, sugar ceiling on',
    inactiveSubtext: 'Filter out high-glycemic spikes',
    icon: <Droplets className="w-5 h-5" />,
    accentColor: 'text-[#C0392B] dark:text-[#F27A6E]',
  },
  {
    id: 'jain',
    title: 'Jain / Religious',
    activeSubtext: 'No root vegetables · Pure veg',
    inactiveSubtext: 'Exclude onion, garlic & root veggies',
    icon: <Leaf className="w-5 h-5" />,
    accentColor: 'text-[#0E6B5C] dark:text-[#5FD4BC]',
  },
  {
    id: 'allergies',
    title: 'Allergies',
    activeSubtext: 'Nut, dairy & soy flags on',
    inactiveSubtext: 'Highlight common kitchen allergens',
    icon: <ShieldAlert className="w-5 h-5" />,
    accentColor: 'text-[#B8791B] dark:text-[#F0B24A]',
  },
];

const SEVERITY_OPTIONS: { id: SeverityMode; label: string }[] = [
  { id: 'strict', label: 'Strict guardrails' },
  { id: 'flexible', label: 'Flexible balance' },
];

export const SetupScreen: React.FC = () => {
  const {
    selectedConditions,
    severityMode,
    dailySugarCeiling,
    darkMode,
    toggleCondition,
    setSeverityMode,
    setDailySugarCeiling,
    toggleDarkMode,
    goToHome,
    openProfile,
  } = useApp();

  return (
    <div className="flex flex-col h-full bg-[#FAF7F0] dark:bg-[#0F1917] transition-colors">
      {/* Top header */}
      <header className="px-6 pt-5 pb-3 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 bg-[#E3F2EE] dark:bg-[#162421] border border-[#0E6B5C]/15 dark:border-[#273934] px-3.5 py-2 rounded-xl">
          <span className="font-display text-lg font-extrabold tracking-tight text-[#162420] dark:text-[#EEF5F2]">
            Sweet<span className="text-[#0E6B5C] dark:text-[#5FD4BC]">Spot</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-10 h-10 rounded-full bg-white dark:bg-[#162421] border border-[#E6E1D6] dark:border-[#273934] text-[#162420] dark:text-[#EEF5F2] flex items-center justify-center hover:bg-[#E3F2EE] dark:hover:bg-[#20312D] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E6B5C]"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={openProfile}
            aria-label="Open profile and order history"
            className="w-10 h-10 rounded-full bg-[#0E6B5C] text-white flex items-center justify-center shadow-sm hover:bg-[#0A5448] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E6B5C]"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto px-6 pt-3 pb-6 space-y-5">
        <div>
          <h1 className="font-display text-[26px] leading-[1.2] font-extrabold text-[#162420] dark:text-[#EEF5F2] tracking-tight text-balance">
            What are you managing?
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-[#4C5C56] dark:text-[#B3C5BE]">
            We&apos;ll preset safe defaults. Fine-tune later — you don&apos;t have to configure anything to start.
          </p>
        </div>

        {/* Selectable Condition Cards */}
        <div className="space-y-3" role="group" aria-label="Health and dietary filters">
          {OPTIONS.map((option) => {
            const isSelected = selectedConditions.includes(option.id);
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => toggleCondition(option.id)}
                aria-pressed={isSelected}
                className={`w-full min-h-[70px] px-4 py-3.5 rounded-2xl text-left flex items-center justify-between gap-3 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E6B5C] ${
                  isSelected
                    ? 'bg-[#0E6B5C] text-white shadow-md shadow-[#0E6B5C]/15'
                    : 'bg-[#E3F2EE] dark:bg-[#162421] text-[#162420] dark:text-[#EEF5F2] border border-transparent dark:border-[#273934] hover:bg-[#D5EBE5] dark:hover:bg-[#20312D]'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-white/15 text-white'
                        : `bg-white/85 dark:bg-[#20312D] ${option.accentColor}`
                    }`}
                  >
                    {option.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="font-display text-[16px] font-bold leading-snug">
                      {option.title}
                    </div>
                    <div
                      className={`text-[13px] leading-snug mt-0.5 ${
                        isSelected
                          ? 'text-[#D7EFE8]'
                          : 'text-[#445C54] dark:text-[#B3C5BE]'
                      }`}
                    >
                      {isSelected ? option.activeSubtext : option.inactiveSubtext}
                    </div>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                    isSelected
                      ? 'bg-white text-[#0E6B5C] border-white'
                      : 'border-[#0E6B5C]/25 dark:border-[#5FD4BC]/30 bg-white/60 dark:bg-[#20312D] text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Severity Mode & Daily Sugar Ceiling */}
        <section className="rounded-2xl bg-white dark:bg-[#162421] border border-[#E6E1D6] dark:border-[#273934] p-4 space-y-3.5">
          <div>
            <h2 className="font-display text-[14px] font-bold text-[#162420] dark:text-[#EEF5F2]">
              Filtering severity
            </h2>
            <p className="text-[12px] text-[#5F6F69] dark:text-[#899E96] mt-0.5">
              {severityMode === 'strict'
                ? 'Strict flags any meal with GI ≥ 48 or > 14g sugar as borderline.'
                : 'Flexible permits moderate-GI meals (up to GI 54 / 18g sugar) as safe.'}
            </p>
          </div>

          <Toggle
            options={SEVERITY_OPTIONS}
            value={severityMode}
            onChange={setSeverityMode}
            ariaLabel="Glycemic filtering severity"
            size="sm"
          />

          <div className="pt-2 border-t border-[#EFECE4] dark:border-[#273934] flex items-center justify-between gap-2">
            <div>
              <div className="font-display text-[13px] font-bold text-[#162420] dark:text-[#EEF5F2]">
                Daily sugar ceiling
              </div>
              <div className="text-[11px] text-[#5F6F69] dark:text-[#899E96]">
                Tracked live across menus &amp; cart
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {[40, 50, 65].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setDailySugarCeiling(preset)}
                  className={`h-8 px-2.5 rounded-lg font-display text-[12px] font-bold tabular-nums transition-colors ${
                    dailySugarCeiling === preset
                      ? 'bg-[#0E6B5C] text-white'
                      : 'bg-[#FAF7F0] dark:bg-[#20312D] text-[#4C5C56] dark:text-[#B3C5BE] border border-[#E6E1D6] dark:border-[#273934]'
                  }`}
                >
                  {preset}g
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Primary action CTA */}
      <footer className="px-6 pb-6 pt-3 bg-gradient-to-t from-[#FAF7F0] via-[#FAF7F0] dark:from-[#0F1917] dark:via-[#0F1917] to-transparent shrink-0">
        <button
          type="button"
          onClick={() => goToHome('delivery')}
          className="w-full h-[52px] rounded-2xl bg-[#0E6B5C] hover:bg-[#0A5448] active:scale-[0.99] text-white font-display font-bold text-[16px] shadow-lg shadow-[#0E6B5C]/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E6B5C]"
        >
          Start ordering safely
        </button>
      </footer>
    </div>
  );
};
