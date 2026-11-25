import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const FeedSkeleton: React.FC = () => (
  <div className="space-y-3 animate-pulse" aria-busy="true" aria-label="Loading safe meals">
    <div className="h-20 rounded-2xl bg-[#EAE6DC] dark:bg-[#20312D]" />
    <div className="h-24 rounded-2xl bg-[#EAE6DC] dark:bg-[#20312D]" />
    <div className="h-24 rounded-2xl bg-[#EAE6DC] dark:bg-[#20312D]" />
  </div>
);

export const MenuSkeleton: React.FC = () => (
  <div className="space-y-3 animate-pulse" aria-busy="true" aria-label="Loading menu">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="rounded-2xl bg-white dark:bg-[#162421] border border-[#E6E1D6] dark:border-[#273934] p-3.5 flex items-center gap-3.5"
      >
        <div className="w-20 h-20 rounded-xl bg-[#EAE6DC] dark:bg-[#20312D] shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-28 rounded bg-[#EAE6DC] dark:bg-[#20312D]" />
          <div className="h-4 w-40 rounded bg-[#EAE6DC] dark:bg-[#20312D]" />
          <div className="h-3 w-24 rounded bg-[#EAE6DC] dark:bg-[#20312D]" />
        </div>
        <div className="w-14 h-9 rounded-xl bg-[#EAE6DC] dark:bg-[#20312D] shrink-0" />
      </div>
    ))}
  </div>
);

interface ErrorStateCardProps {
  message: string;
  onRetry: () => void;
}

export const ErrorStateCard: React.FC<ErrorStateCardProps> = ({ message, onRetry }) => (
  <div
    role="alert"
    className="rounded-2xl bg-[#FBECEB] dark:bg-[#331715] border border-[#C0392B]/30 p-5 text-center space-y-3"
  >
    <AlertCircle className="w-7 h-7 text-[#C0392B] dark:text-[#F27A6E] mx-auto" />
    <div>
      <h3 className="font-display text-[15px] font-bold text-[#162420] dark:text-[#EEF5F2]">
        Sync interrupted
      </h3>
      <p className="text-[13px] text-[#4C5C56] dark:text-[#B3C5BE] mt-1">{message}</p>
    </div>
    <button
      type="button"
      onClick={onRetry}
      className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-[#0E6B5C] hover:bg-[#0A5448] text-white font-display text-[13px] font-bold transition-colors"
    >
      <RefreshCw className="w-3.5 h-3.5" />
      <span>Retry sync</span>
    </button>
  </div>
);
