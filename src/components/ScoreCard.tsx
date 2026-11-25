import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldCheck, XCircle } from 'lucide-react';
import { ComputedDishProfile, Dish } from '../types';

interface ScoreCardProps {
  dish: Dish;
  profile: ComputedDishProfile;
  selectedCustomizations: string[];
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  dish,
  profile,
  selectedCustomizations,
}) => {
  const isSafe = profile.effectiveTier === 'safe';
  const isBorderline = profile.effectiveTier === 'borderline';

  const containerStyle = isSafe
    ? 'bg-[#E3F2EE] dark:bg-[#12332C] border-[#0E6B5C]/25 dark:border-[#5FD4BC]/25'
    : isBorderline
    ? 'bg-[#FDF4E7] dark:bg-[#2E2212] border-[#B8791B]/30 dark:border-[#F0B24A]/30'
    : 'bg-[#FBECEB] dark:bg-[#331715] border-[#C0392B]/30 dark:border-[#F27A6E]/30';

  const accentText = isSafe
    ? 'text-[#0E6B5C] dark:text-[#5FD4BC]'
    : isBorderline
    ? 'text-[#B8791B] dark:text-[#F0B24A]'
    : 'text-[#C0392B] dark:text-[#F27A6E]';

  const sugarImproved = profile.effectiveSugar < dish.sugarGrams;
  const giImproved = profile.effectiveGi < dish.giScore;

  return (
    <section
      aria-label="Safety Confidence Score"
      className={`rounded-2xl p-4 border transition-colors ${containerStyle}`}
    >
      {/* Score Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {isSafe ? (
            <ShieldCheck className={`w-5 h-5 shrink-0 ${accentText}`} />
          ) : isBorderline ? (
            <AlertTriangle className={`w-5 h-5 shrink-0 ${accentText}`} />
          ) : (
            <XCircle className={`w-5 h-5 shrink-0 ${accentText}`} />
          )}
          <div>
            <h2 className="font-display text-[15px] font-bold text-[#162420] dark:text-[#EEF5F2]">
              {isSafe ? 'Why we marked this safe' : dish.safetyBoxTitle}
            </h2>
            <div className={`text-[13px] font-bold ${accentText}`}>
              Verdict: {profile.verdict}
            </div>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className={`font-display text-[22px] font-extrabold leading-none tabular-nums ${accentText}`}>
            {profile.confidenceScore}%
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-[#4C5C56] dark:text-[#B3C5BE] mt-0.5">
            Safety Score
          </div>
        </div>
      </div>

      {/* Live Macro Metrics */}
      <div className="mt-3.5 grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-white/75 dark:bg-[#162421]/80 px-2.5 py-2 text-center">
          <div className="text-[10px] font-semibold uppercase text-[#5F6F69] dark:text-[#899E96]">
            Glycemic Index
          </div>
          <div className="font-display text-[14px] font-extrabold text-[#162420] dark:text-[#EEF5F2] tabular-nums mt-0.5">
            {giImproved ? (
              <>
                <span className="line-through text-[#7A8A84] text-[11px] mr-1">
                  {dish.giScore}
                </span>
                <span className="text-[#0E6B5C] dark:text-[#5FD4BC]">{profile.effectiveGi}</span>
              </>
            ) : (
              profile.effectiveGi
            )}
          </div>
        </div>

        <div className="rounded-xl bg-white/75 dark:bg-[#162421]/80 px-2.5 py-2 text-center">
          <div className="text-[10px] font-semibold uppercase text-[#5F6F69] dark:text-[#899E96]">
            Net Sugar
          </div>
          <div className="font-display text-[14px] font-extrabold text-[#162420] dark:text-[#EEF5F2] tabular-nums mt-0.5">
            {sugarImproved ? (
              <>
                <span className="line-through text-[#7A8A84] text-[11px] mr-1">
                  {dish.sugarGrams}g
                </span>
                <span className="text-[#0E6B5C] dark:text-[#5FD4BC]">
                  {profile.effectiveSugar}g
                </span>
              </>
            ) : (
              `${profile.effectiveSugar}g`
            )}
          </div>
        </div>

        <div className="rounded-xl bg-white/75 dark:bg-[#162421]/80 px-2.5 py-2 text-center">
          <div className="text-[10px] font-semibold uppercase text-[#5F6F69] dark:text-[#899E96]">
            Fiber Buffer
          </div>
          <div className="font-display text-[14px] font-extrabold text-[#162420] dark:text-[#EEF5F2] tabular-nums mt-0.5">
            {profile.effectiveFiber}g
          </div>
        </div>
      </div>

      {profile.conflictReason && (
        <div className="mt-3 rounded-xl bg-[#C0392B]/10 border border-[#C0392B]/25 px-3 py-2 text-[12px] font-bold text-[#C0392B] dark:text-[#F27A6E]">
          Profile conflict: {profile.conflictReason}
        </div>
      )}

      <p className="mt-3 text-[13px] leading-relaxed text-[#35443F] dark:text-[#C8D7D1]">
        {dish.safetySummary}
      </p>

      {/* Ingredient + GI Breakdown */}
      <ul className="mt-3.5 pt-3 border-t border-black/10 dark:border-white/10 space-y-2.5">
        {dish.ingredients.map((item) => {
          const isRemoved =
            item.removedByCustomizationId &&
            selectedCustomizations.includes(item.removedByCustomizationId);

          return (
            <li
              key={item.name}
              className={`flex items-start gap-2.5 text-[13px] transition-opacity ${
                isRemoved ? 'opacity-50 line-through' : ''
              }`}
            >
              {isRemoved || item.status === 'safe' ? (
                <CheckCircle2 className="w-4 h-4 text-[#0E6B5C] dark:text-[#5FD4BC] shrink-0 mt-0.5" />
              ) : item.status === 'caution' ? (
                <AlertTriangle className="w-4 h-4 text-[#B8791B] dark:text-[#F0B24A] shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-[#C0392B] dark:text-[#F27A6E] shrink-0 mt-0.5" />
              )}
              <div className="min-w-0">
                <span className="font-semibold text-[#162420] dark:text-[#EEF5F2]">
                  {item.name}
                </span>
                <span className="text-[#4C5C56] dark:text-[#B3C5BE]">
                  {' '}
                  — {isRemoved ? 'Swapped / Removed safely' : item.note}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
