/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CartDrawer } from './components/CartDrawer';
import { AppProvider, useApp } from './context/AppContext';
import { CartScreen } from './screens/CartScreen';
import { DishDetailScreen } from './screens/DishDetailScreen';
import { HomeScreen } from './screens/HomeScreen';
import { MenuScreen } from './screens/MenuScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SetupScreen } from './screens/SetupScreen';

const ScreenRouter: React.FC = () => {
  const { screen, toast } = useApp();

  return (
    <div className="min-h-dvh w-full bg-[#EFECE3] dark:bg-[#09100E] sm:py-8 sm:px-4 flex items-center justify-center transition-colors">
      {/* Centered mobile-first frame on desktop, full-bleed on mobile */}
      <div className="w-full h-dvh sm:h-[844px] sm:max-h-[92dvh] sm:max-w-[420px] bg-[#FAF7F0] dark:bg-[#0F1917] sm:rounded-[36px] sm:border sm:border-black/10 dark:sm:border-white/10 sm:shadow-[0_24px_60px_-15px_rgba(14,107,92,0.22)] overflow-hidden flex flex-col relative">
        {screen === 'setup' && <SetupScreen />}
        {screen === 'home' && <HomeScreen />}
        {screen === 'menu' && <MenuScreen />}
        {screen === 'detail' && <DishDetailScreen />}
        {screen === 'cart' && <CartScreen />}
        {screen === 'profile' && <ProfileScreen />}

        <CartDrawer />

        {toast && (
          <div
            role="status"
            aria-live="polite"
            className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#162420] dark:bg-[#EEF5F2] text-white dark:text-[#162420] text-[12px] font-semibold shadow-lg flex items-center gap-3 whitespace-nowrap"
          >
            <span>{toast.message}</span>
            {toast.undoLabel && toast.onUndo && (
              <button
                type="button"
                onClick={toast.onUndo}
                className="font-bold underline underline-offset-2 text-[#5FD4BC] dark:text-[#0E6B5C]"
              >
                {toast.undoLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <ScreenRouter />
    </AppProvider>
  );
}
