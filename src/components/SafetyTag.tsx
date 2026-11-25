import React from 'react';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { SafetyTier } from '../types';

interface SafetyTagProps {
  tier: SafetyTier;
  label?: string;
  compact?: boolean;
}

export const SafetyTag: React.FC<SafetyTagProps> = ({ tier, label, compact = false }) => {
  const defaultLabel =
    tier === 'safe'
      ? 'SAFE FOR YOUR SUGAR'
      : tier === 'borderline'
      ? 'BORDERLINE'
      : 'HIGH GLYCEMIC LOAD';

  const text = label ?? defaultLabel;

  const colorClasses =
    tier === 'safe'
      ? 'text-[#0E6B5C] dark:text-[#5FD4BC]'
      : tier === 'borderline'
      ? 'text-[#B8791B] dark:text-[#F0B24A]'
      : 'text-[#C0392B] dark:text-[#F27A6E]';

  const Icon =
    tier === 'safe'
      ? CheckCircle2
      : tier === 'borderline'
      ? AlertTriangle
      : XCircle;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-display font-extrabold tracking-wide uppercase ${
        compact ? 'text-[10px]' : 'text-[11px]'
      } ${colorClasses}`}
    >
      <Icon className={compact ? 'w-3 h-3 shrink-0' : 'w-3.5 h-3.5 shrink-0'} aria-hidden="true" />
      <span>{text}</span>
    </span>
  );
};
