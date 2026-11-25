import {
  ComputedDishProfile,
  Dish,
  ManagementCondition,
  SafetyTier,
  SeverityMode,
} from '../types';

export function computeDishProfile(
  dish: Dish,
  customizationIds: string[],
  conditions: ManagementCondition[],
  severity: SeverityMode
): ComputedDishProfile {
  const activeCustomizations = dish.customizations.filter((c) =>
    customizationIds.includes(c.id)
  );

  const sugarDelta = activeCustomizations.reduce((s, c) => s + c.sugarDelta, 0);
  const giDelta = activeCustomizations.reduce((s, c) => s + c.giDelta, 0);
  const fiberDelta = activeCustomizations.reduce((s, c) => s + c.fiberDelta, 0);
  const priceDelta = activeCustomizations.reduce((s, c) => s + c.priceDelta, 0);

  const effectiveSugar = Math.max(1, dish.sugarGrams + sugarDelta);
  const effectiveGi = Math.max(18, dish.giScore + giDelta);
  const effectiveFiber = Math.max(1, dish.fiberGrams + fiberDelta);
  const effectivePrice = Math.max(49, dish.price + priceDelta);

  const hasJainConflict = conditions.includes('jain') && !dish.jainFriendly;
  const hasAllergyWarning =
    conditions.includes('allergies') && dish.allergens.length > 0;

  let conflictReason: string | null = null;
  if (hasJainConflict) {
    conflictReason = 'Contains non-Jain ingredients (onion, garlic, or soy/root base)';
  } else if (hasAllergyWarning) {
    conflictReason = `Contains flagged allergen: ${dish.allergens.join(', ')}`;
  }

  let effectiveTier: SafetyTier = 'safe';

  if (severity === 'strict') {
    if (effectiveGi >= 70 || effectiveSugar >= 30 || hasJainConflict) {
      effectiveTier = 'unsafe';
    } else if (effectiveGi >= 48 || effectiveSugar >= 15 || hasAllergyWarning) {
      effectiveTier = 'borderline';
    } else {
      effectiveTier = 'safe';
    }
  } else {
    if (effectiveGi >= 75 || effectiveSugar >= 36 || hasJainConflict) {
      effectiveTier = 'unsafe';
    } else if (effectiveGi >= 55 || effectiveSugar >= 19 || hasAllergyWarning) {
      effectiveTier = 'borderline';
    } else {
      effectiveTier = 'safe';
    }
  }

  // Compute Safety Confidence Score (15 - 99%)
  let rawScore =
    99 -
    Math.max(0, effectiveGi - 34) * 1.15 -
    Math.max(0, effectiveSugar - 10) * 1.35 +
    Math.min(6, effectiveFiber * 0.45);

  if (severity === 'strict' && effectiveSugar > 14) {
    rawScore -= 6;
  }
  if (hasJainConflict) {
    rawScore -= 35;
  } else if (hasAllergyWarning) {
    rawScore -= 14;
  }

  const confidenceScore = Math.max(15, Math.min(99, Math.round(rawScore)));

  const verdict =
    effectiveTier === 'safe'
      ? 'Safe to order'
      : effectiveTier === 'borderline'
      ? 'Check with restaurant'
      : 'High spike risk — avoid';

  const statusLabel =
    effectiveTier === 'safe'
      ? '✓ SAFE FOR YOUR SUGAR'
      : effectiveTier === 'borderline'
      ? '⚠ BORDERLINE'
      : hasJainConflict
      ? '✕ JAIN / DIETARY BLOCK'
      : '✕ HIGH GLYCEMIC LOAD';

  return {
    effectiveSugar,
    effectiveGi,
    effectiveFiber,
    effectivePrice,
    confidenceScore,
    effectiveTier,
    verdict,
    statusLabel,
    conflictReason,
  };
}
