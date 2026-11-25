import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  DELIVERY_AND_OTHER_CHARGES,
  DISHES,
  INITIAL_ORDER_HISTORY,
  RESTAURANTS,
} from '../data/mockData';
import {
  BottomTab,
  CartItem,
  ComputedDishProfile,
  Dish,
  ManagementCondition,
  MenuFilterMode,
  OrderHistoryEntry,
  Restaurant,
  ScreenName,
  SeverityMode,
} from '../types';
import { computeDishProfile } from '../utils/glycemicEngine';

interface ToastState {
  message: string;
  undoLabel?: string;
  onUndo?: () => void;
}

interface PersistedState {
  selectedConditions: ManagementCondition[];
  severityMode: SeverityMode;
  dailySugarCeiling: number;
  sugarLoggedToday: number;
  darkMode: boolean;
  hasSeenMenuOnboarding: boolean;
  cart: CartItem[];
  orderHistory: OrderHistoryEntry[];
}

const STORAGE_KEY = 'sweetspot_app_state_v2';

const DEFAULT_PERSISTED: PersistedState = {
  selectedConditions: ['diabetes'],
  severityMode: 'strict',
  dailySugarCeiling: 50,
  sugarLoggedToday: 14,
  darkMode: false,
  hasSeenMenuOnboarding: false,
  cart: [
    { dishId: 'harvest-grain-bowl', quantity: 1, customizationIds: [] },
    { dishId: 'teriyaki-rice-bowl', quantity: 1, customizationIds: [] },
  ],
  orderHistory: INITIAL_ORDER_HISTORY,
};

function loadPersistedState(): PersistedState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PERSISTED;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      selectedConditions:
        Array.isArray(parsed.selectedConditions) && parsed.selectedConditions.length > 0
          ? parsed.selectedConditions
          : DEFAULT_PERSISTED.selectedConditions,
      severityMode: parsed.severityMode === 'flexible' ? 'flexible' : 'strict',
      dailySugarCeiling:
        typeof parsed.dailySugarCeiling === 'number' && parsed.dailySugarCeiling >= 25
          ? parsed.dailySugarCeiling
          : DEFAULT_PERSISTED.dailySugarCeiling,
      sugarLoggedToday:
        typeof parsed.sugarLoggedToday === 'number' && parsed.sugarLoggedToday >= 0
          ? parsed.sugarLoggedToday
          : DEFAULT_PERSISTED.sugarLoggedToday,
      darkMode: Boolean(parsed.darkMode),
      hasSeenMenuOnboarding: Boolean(parsed.hasSeenMenuOnboarding),
      cart: Array.isArray(parsed.cart) ? parsed.cart : DEFAULT_PERSISTED.cart,
      orderHistory:
        Array.isArray(parsed.orderHistory) && parsed.orderHistory.length > 0
          ? parsed.orderHistory
          : DEFAULT_PERSISTED.orderHistory,
    };
  } catch {
    return DEFAULT_PERSISTED;
  }
}

interface AppContextValue {
  screen: ScreenName;
  activeTab: BottomTab;
  selectedConditions: ManagementCondition[];
  severityMode: SeverityMode;
  dailySugarCeiling: number;
  sugarLoggedToday: number;
  darkMode: boolean;
  hasSeenMenuOnboarding: boolean;
  selectedRestaurantId: string;
  selectedDishId: string;
  menuFilter: MenuFilterMode;
  searchQuery: string;
  cart: CartItem[];
  orderHistory: OrderHistoryEntry[];
  isLoading: boolean;
  feedError: string | null;
  isCartDrawerOpen: boolean;
  orderConfirmed: OrderHistoryEntry | null;
  toast: ToastState | null;

  toggleCondition: (condition: ManagementCondition) => void;
  setSeverityMode: (mode: SeverityMode) => void;
  setDailySugarCeiling: (grams: number) => void;
  resetSugarLoggedToday: () => void;
  toggleDarkMode: () => void;
  dismissMenuOnboarding: () => void;
  replayMenuOnboarding: () => void;
  setMenuFilter: (mode: MenuFilterMode) => void;
  setSearchQuery: (q: string) => void;
  setCartDrawerOpen: (open: boolean) => void;
  retryLoadFeed: () => void;
  simulateNetworkErrorTest: () => void;

  goToSetup: () => void;
  goToHome: (tab?: 'delivery' | 'dining') => void;
  openRestaurant: (restaurantId: string) => void;
  openDish: (dishId: string) => void;
  openCart: () => void;
  openProfile: () => void;
  goBackFromDetail: () => void;
  selectBottomTab: (tab: BottomTab) => void;

  getDishProfile: (dish: Dish, customizationIds?: string[]) => ComputedDishProfile;
  addToCart: (
    dishId: string,
    quantity?: number,
    customizationIds?: string[],
    cookingRequest?: string,
    acknowledgedRisk?: boolean
  ) => void;
  updateCartQuantity: (dishId: string, delta: number) => void;
  swapCartItem: (oldDishId: string, newDishId: string) => void;
  updateItemNote: (dishId: string, note: string) => void;
  acknowledgeCartItemRisk: (dishId: string) => void;
  reorderFromHistory: (entry: OrderHistoryEntry) => void;
  checkout: () => void;
  dismissOrderConfirmation: () => void;

  currentRestaurant: Restaurant;
  currentDish: Dish;
  cartItemCount: number;
  cartSubtotal: number;
  cartCharges: number;
  cartTotal: number;
  cartSugarGrams: number;
  projectedTotalSugar: number;
  remainingSugarAfterCart: number;
  isOverSugarBudget: boolean;
  cartRestaurantName: string;
  unresolvedUnsafeCartItems: CartItem[];
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initial = useMemo(() => loadPersistedState(), []);

  const [screen, setScreen] = useState<ScreenName>('setup');
  const [activeTab, setActiveTab] = useState<BottomTab>('delivery');
  const [selectedConditions, setSelectedConditions] = useState<ManagementCondition[]>(
    initial.selectedConditions
  );
  const [severityMode, setSeverityMode] = useState<SeverityMode>(initial.severityMode);
  const [dailySugarCeiling, setDailySugarCeilingState] = useState<number>(
    initial.dailySugarCeiling
  );
  const [sugarLoggedToday, setSugarLoggedToday] = useState<number>(
    initial.sugarLoggedToday
  );
  const [darkMode, setDarkMode] = useState<boolean>(initial.darkMode);
  const [hasSeenMenuOnboarding, setHasSeenMenuOnboarding] = useState<boolean>(
    initial.hasSeenMenuOnboarding
  );
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>('the-green-bowl');
  const [selectedDishId, setSelectedDishId] = useState<string>('harvest-grain-bowl');
  const [menuFilter, setMenuFilter] = useState<MenuFilterMode>('safe-first');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>(initial.cart);
  const [orderHistory, setOrderHistory] = useState<OrderHistoryEntry[]>(initial.orderHistory);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feedError, setFeedError] = useState<string | null>(null);
  const [isCartDrawerOpen, setCartDrawerOpen] = useState<boolean>(false);
  const [orderConfirmed, setOrderConfirmed] = useState<OrderHistoryEntry | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [detailOrigin, setDetailOrigin] = useState<'home' | 'menu' | 'cart'>('menu');

  // Sync dark mode class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Persist user preferences, cart, budget & history
  useEffect(() => {
    try {
      const payload: PersistedState = {
        selectedConditions,
        severityMode,
        dailySugarCeiling,
        sugarLoggedToday,
        darkMode,
        hasSeenMenuOnboarding,
        cart,
        orderHistory,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage quota errors
    }
  }, [
    selectedConditions,
    severityMode,
    dailySugarCeiling,
    sugarLoggedToday,
    darkMode,
    hasSeenMenuOnboarding,
    cart,
    orderHistory,
  ]);

  const showToast = useCallback((nextToast: ToastState) => {
    setToast(nextToast);
    window.setTimeout(() => {
      setToast((prev) => (prev?.message === nextToast.message ? null : prev));
    }, 3400);
  }, []);

  const triggerBriefSkeleton = useCallback((ms = 180) => {
    setIsLoading(true);
    window.setTimeout(() => setIsLoading(false), ms);
  }, []);

  const toggleCondition = (condition: ManagementCondition) => {
    setSelectedConditions((prev) => {
      if (prev.includes(condition)) {
        if (prev.length === 1) return prev;
        return prev.filter((item) => item !== condition);
      }
      return [...prev, condition];
    });
  };

  const setDailySugarCeiling = (grams: number) => {
    const clamped = Math.max(25, Math.min(120, grams));
    setDailySugarCeilingState(clamped);
  };

  const resetSugarLoggedToday = () => {
    setSugarLoggedToday(0);
    showToast({ message: 'Daily sugar log reset to 0g' });
  };

  const toggleDarkMode = () => setDarkMode((d) => !d);

  const dismissMenuOnboarding = () => setHasSeenMenuOnboarding(true);
  const replayMenuOnboarding = () => {
    setHasSeenMenuOnboarding(false);
    setScreen('menu');
  };

  const retryLoadFeed = () => {
    setFeedError(null);
    triggerBriefSkeleton(260);
  };

  const simulateNetworkErrorTest = () => {
    setFeedError('Unable to sync live kitchen GI scores. Check connection and retry.');
  };

  const goToSetup = () => {
    setScreen('setup');
    setActiveTab('mode');
  };

  const goToHome = (tab: 'delivery' | 'dining' = 'delivery') => {
    setActiveTab(tab);
    setScreen('home');
    triggerBriefSkeleton(160);
  };

  const openRestaurant = (restaurantId: string) => {
    setSelectedRestaurantId(restaurantId);
    setScreen('menu');
    triggerBriefSkeleton(180);
  };

  const openDish = (dishId: string) => {
    const dish = DISHES.find((d) => d.id === dishId);
    if (dish) {
      setSelectedRestaurantId(dish.restaurantId);
    }
    setDetailOrigin(screen === 'home' ? 'home' : screen === 'cart' ? 'cart' : 'menu');
    setSelectedDishId(dishId);
    setScreen('detail');
  };

  const openCart = () => {
    setCartDrawerOpen(false);
    setActiveTab('cart');
    setScreen('cart');
  };

  const openProfile = () => {
    setCartDrawerOpen(false);
    setScreen('profile');
  };

  const goBackFromDetail = () => {
    if (detailOrigin === 'home') {
      setScreen('home');
    } else if (detailOrigin === 'cart') {
      setScreen('cart');
    } else {
      setScreen('menu');
    }
  };

  const selectBottomTab = (tab: BottomTab) => {
    setActiveTab(tab);
    if (tab === 'delivery' || tab === 'dining') {
      setScreen('home');
    } else if (tab === 'mode') {
      setScreen('setup');
    } else if (tab === 'cart') {
      setScreen('cart');
    }
  };

  const getDishProfile = useCallback(
    (dish: Dish, customizationIds: string[] = []) =>
      computeDishProfile(dish, customizationIds, selectedConditions, severityMode),
    [selectedConditions, severityMode]
  );

  const addToCart = (
    dishId: string,
    quantity = 1,
    customizationIds: string[] = [],
    cookingRequest?: string,
    acknowledgedRisk = false
  ) => {
    const dish = DISHES.find((d) => d.id === dishId);
    if (!dish) return;
    const profile = getDishProfile(dish, customizationIds);
    if (profile.effectiveTier === 'unsafe' && !acknowledgedRisk) return;

    const prevCart = cart;
    setCart((current) => {
      const existing = current.find((item) => item.dishId === dishId);
      if (existing) {
        return current.map((item) =>
          item.dishId === dishId
            ? {
                ...item,
                quantity: item.quantity + quantity,
                customizationIds:
                  customizationIds.length > 0 ? customizationIds : item.customizationIds,
                cookingRequest: cookingRequest?.trim() || item.cookingRequest,
                acknowledgedRisk: acknowledgedRisk || item.acknowledgedRisk,
              }
            : item
        );
      }
      return [
        ...current,
        {
          dishId,
          quantity,
          customizationIds,
          cookingRequest: cookingRequest?.trim() || undefined,
          acknowledgedRisk,
        },
      ];
    });

    showToast({
      message: `Added ${dish.name}`,
      undoLabel: 'Undo',
      onUndo: () => setCart(prevCart),
    });
  };

  const updateCartQuantity = (dishId: string, delta: number) => {
    const prevCart = cart;
    const targetDish = DISHES.find((d) => d.id === dishId);
    setCart((current) =>
      current
        .map((item) =>
          item.dishId === dishId ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );

    if (delta < 0 && targetDish) {
      const currentQty = prevCart.find((i) => i.dishId === dishId)?.quantity ?? 0;
      if (currentQty + delta <= 0) {
        showToast({
          message: `Removed ${targetDish.name}`,
          undoLabel: 'Undo',
          onUndo: () => setCart(prevCart),
        });
      }
    }
  };

  const swapCartItem = (oldDishId: string, newDishId: string) => {
    const newDish = DISHES.find((d) => d.id === newDishId);
    if (!newDish) return;

    const prevCart = cart;
    setCart((current) => {
      const oldItem = current.find((i) => i.dishId === oldDishId);
      if (!oldItem) return current;

      const existingNew = current.find((i) => i.dishId === newDishId);
      if (existingNew) {
        return current
          .filter((i) => i.dishId !== oldDishId)
          .map((i) =>
            i.dishId === newDishId
              ? { ...i, quantity: i.quantity + oldItem.quantity }
              : i
          );
      }

      return current.map((i) =>
        i.dishId === oldDishId
          ? {
              ...i,
              dishId: newDishId,
              customizationIds: [],
              acknowledgedRisk: false,
            }
          : i
      );
    });

    showToast({
      message: `Swapped to ${newDish.name}`,
      undoLabel: 'Undo',
      onUndo: () => setCart(prevCart),
    });
  };

  const updateItemNote = (dishId: string, note: string) => {
    setCart((current) =>
      current.map((item) =>
        item.dishId === dishId ? { ...item, cookingRequest: note.trim() || undefined } : item
      )
    );
    showToast({ message: 'Kitchen request saved' });
  };

  const acknowledgeCartItemRisk = (dishId: string) => {
    setCart((current) =>
      current.map((item) =>
        item.dishId === dishId ? { ...item, acknowledgedRisk: true } : item
      )
    );
  };

  const reorderFromHistory = (entry: OrderHistoryEntry) => {
    const nextCart: CartItem[] = entry.items.map((i) => ({
      dishId: i.dishId,
      quantity: i.quantity,
      customizationIds: i.customizationIds,
    }));
    const prevCart = cart;
    setCart(nextCart);
    setSelectedRestaurantId(entry.restaurantId);
    setActiveTab('cart');
    setScreen('cart');
    showToast({
      message: `Loaded safe order from ${entry.restaurantName}`,
      undoLabel: 'Undo',
      onUndo: () => setCart(prevCart),
    });
  };

  const currentRestaurant = useMemo(
    () => RESTAURANTS.find((r) => r.id === selectedRestaurantId) ?? RESTAURANTS[0],
    [selectedRestaurantId]
  );

  const currentDish = useMemo(
    () => DISHES.find((d) => d.id === selectedDishId) ?? DISHES[0],
    [selectedDishId]
  );

  const cartItemCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const dish = DISHES.find((d) => d.id === item.dishId);
      if (!dish) return sum;
      const profile = getDishProfile(dish, item.customizationIds);
      return sum + profile.effectivePrice * item.quantity;
    }, 0);
  }, [cart, getDishProfile]);

  const cartSugarGrams = useMemo(() => {
    return cart.reduce((sum, item) => {
      const dish = DISHES.find((d) => d.id === item.dishId);
      if (!dish) return sum;
      const profile = getDishProfile(dish, item.customizationIds);
      return sum + profile.effectiveSugar * item.quantity;
    }, 0);
  }, [cart, getDishProfile]);

  const projectedTotalSugar = sugarLoggedToday + cartSugarGrams;
  const remainingSugarAfterCart = dailySugarCeiling - projectedTotalSugar;
  const isOverSugarBudget = projectedTotalSugar > dailySugarCeiling;

  const cartCharges = cart.length > 0 ? DELIVERY_AND_OTHER_CHARGES : 0;
  const cartTotal = cartSubtotal + cartCharges;

  const cartRestaurantName = useMemo(() => {
    if (cart.length === 0) return currentRestaurant.name;
    const restaurantIds = new Set(
      cart
        .map((item) => DISHES.find((d) => d.id === item.dishId)?.restaurantId)
        .filter(Boolean)
    );
    if (restaurantIds.size > 1) return 'Multiple Kitchens';
    const firstId = Array.from(restaurantIds)[0];
    return RESTAURANTS.find((r) => r.id === firstId)?.name ?? 'The Green Bowl';
  }, [cart, currentRestaurant.name]);

  const unresolvedUnsafeCartItems = useMemo(() => {
    return cart.filter((item) => {
      const dish = DISHES.find((d) => d.id === item.dishId);
      if (!dish) return false;
      const profile = getDishProfile(dish, item.customizationIds);
      return profile.effectiveTier === 'unsafe' && !item.acknowledgedRisk;
    });
  }, [cart, getDishProfile]);

  const checkout = () => {
    if (cart.length === 0) return;

    const firstRestId =
      DISHES.find((d) => d.id === cart[0].dishId)?.restaurantId ?? currentRestaurant.id;

    const entry: OrderHistoryEntry = {
      id: `ORD-${Math.floor(5000 + Math.random() * 4999)}`,
      dateLabel: 'Just now',
      restaurantId: firstRestId,
      restaurantName: cartRestaurantName,
      items: cart.map((item) => {
        const dish = DISHES.find((d) => d.id === item.dishId);
        return {
          dishId: item.dishId,
          dishName: dish?.name ?? 'Meal',
          quantity: item.quantity,
          customizationIds: item.customizationIds,
        };
      }),
      totalAmount: cartTotal,
      totalSugarGrams: cartSugarGrams,
    };

    setSugarLoggedToday((prev) => prev + cartSugarGrams);
    setOrderHistory((prev) => [entry, ...prev]);
    setOrderConfirmed(entry);
    setCart([]);
  };

  const dismissOrderConfirmation = () => {
    setOrderConfirmed(null);
    setActiveTab('delivery');
    setScreen('home');
  };

  return (
    <AppContext.Provider
      value={{
        screen,
        activeTab,
        selectedConditions,
        severityMode,
        dailySugarCeiling,
        sugarLoggedToday,
        darkMode,
        hasSeenMenuOnboarding,
        selectedRestaurantId,
        selectedDishId,
        menuFilter,
        searchQuery,
        cart,
        orderHistory,
        isLoading,
        feedError,
        isCartDrawerOpen,
        orderConfirmed,
        toast,
        toggleCondition,
        setSeverityMode,
        setDailySugarCeiling,
        resetSugarLoggedToday,
        toggleDarkMode,
        dismissMenuOnboarding,
        replayMenuOnboarding,
        setMenuFilter,
        setSearchQuery,
        setCartDrawerOpen,
        retryLoadFeed,
        simulateNetworkErrorTest,
        goToSetup,
        goToHome,
        openRestaurant,
        openDish,
        openCart,
        openProfile,
        goBackFromDetail,
        selectBottomTab,
        getDishProfile,
        addToCart,
        updateCartQuantity,
        swapCartItem,
        updateItemNote,
        acknowledgeCartItemRisk,
        reorderFromHistory,
        checkout,
        dismissOrderConfirmation,
        currentRestaurant,
        currentDish,
        cartItemCount,
        cartSubtotal,
        cartCharges,
        cartTotal,
        cartSugarGrams,
        projectedTotalSugar,
        remainingSugarAfterCart,
        isOverSugarBudget,
        cartRestaurantName,
        unresolvedUnsafeCartItems,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }
  return ctx;
}
