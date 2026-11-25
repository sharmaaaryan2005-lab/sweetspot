export type ManagementCondition = 'diabetes' | 'jain' | 'allergies';

export type SeverityMode = 'strict' | 'flexible';

export type ScreenName = 'setup' | 'home' | 'menu' | 'detail' | 'cart' | 'profile';

export type BottomTab = 'delivery' | 'dining' | 'mode' | 'cart';

export type SafetyTier = 'safe' | 'borderline' | 'unsafe';

export type MenuFilterMode = 'safe-first' | 'all' | 'show-unsafe';

export interface IngredientCheck {
  name: string;
  note: string;
  status: 'safe' | 'caution' | 'spike';
  removedByCustomizationId?: string;
}

export interface DishCustomization {
  id: string;
  label: string;
  description: string;
  sugarDelta: number;
  giDelta: number;
  fiberDelta: number;
  priceDelta: number;
}

export interface Dish {
  id: string;
  restaurantId: string;
  name: string;
  price: number;
  safetyTier: SafetyTier;
  giLabel: string;
  giScore: number;
  sugarGrams: number;
  netCarbsGrams: number;
  fiberGrams: number;
  statusBadgeText: string;
  cartStatusText: string;
  highlyReordered?: boolean;
  description: string;
  safetyBoxTitle: string;
  confidenceScore: number;
  verdict: string;
  safetySummary: string;
  ingredients: IngredientCheck[];
  customizations: DishCustomization[];
  picsumSeed: string;
  artworkId:
    | 'harvest-grain-bowl'
    | 'teriyaki-rice-bowl'
    | 'mango-sticky-rice'
    | 'cauliflower-herb-bowl'
    | 'tandoori-paneer-salad'
    | 'berry-chia-parfait';
  swapDishId?: string;
  jainFriendly: boolean;
  allergens: string[];
}

export interface Restaurant {
  id: string;
  name: string;
  lowGiCount: number;
  deliveryMinutes: number;
  cuisine: string;
  rating: string;
  trusted: boolean;
  diningAvailable: boolean;
  distanceKm: string;
  picsumSeed: string;
  artworkId: 'green-bowl-hero' | 'protein-house-hero';
}

export interface CartItem {
  dishId: string;
  quantity: number;
  customizationIds: string[];
  cookingRequest?: string;
  acknowledgedRisk?: boolean;
}

export interface OrderHistoryEntry {
  id: string;
  dateLabel: string;
  restaurantId: string;
  restaurantName: string;
  items: { dishId: string; dishName: string; quantity: number; customizationIds: string[] }[];
  totalAmount: number;
  totalSugarGrams: number;
}

export interface ComputedDishProfile {
  effectiveSugar: number;
  effectiveGi: number;
  effectiveFiber: number;
  effectivePrice: number;
  confidenceScore: number;
  effectiveTier: SafetyTier;
  verdict: string;
  statusLabel: string;
  conflictReason: string | null;
}
