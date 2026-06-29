import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SubscriptionTier } from '@/types';
import { FeatureKey, isFeatureFree } from '@/constants/Features';
import {
  initPurchases,
  purchasePackage,
  restorePurchases,
  loadOfferings,
  getCachedPackages,
  isPurchasesAvailable,
  SubscriptionPackage,
} from '@/lib/purchases';

interface SubscriptionContextType {
  tier: SubscriptionTier;
  isPremium: boolean;
  canAccess: (feature: FeatureKey) => boolean;
  upgrade: (packageId?: string) => Promise<{ success: boolean; error?: string }>;
  restore: () => Promise<boolean>;
  packages: SubscriptionPackage[];
  isLoaded: boolean;
  purchasesAvailable: boolean;
}

const STORAGE_KEY = '@peacezense_subscription';

const SubscriptionContext = createContext<SubscriptionContextType>({
  tier: 'free',
  isPremium: false,
  canAccess: () => false,
  upgrade: async () => ({ success: false }),
  restore: async () => false,
  packages: [],
  isLoaded: false,
  purchasesAvailable: false,
});

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [packages, setPackages] = useState<SubscriptionPackage[]>(getCachedPackages());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await initPurchases();
      const pkgs = await loadOfferings();
      setPackages(pkgs);
      const premium = await restorePurchases();
      if (premium) setTier('premium');
      setIsLoaded(true);
    })();
  }, []);

  const canAccess = useCallback(
    (feature: FeatureKey) => tier === 'premium' || isFeatureFree(feature),
    [tier],
  );

  const upgrade = useCallback(async (packageId = 'yearly') => {
    const result = await purchasePackage(packageId);
    if (result.success) {
      setTier('premium');
      await AsyncStorage.setItem(STORAGE_KEY, 'premium');
      return { success: true };
    }
    return { success: false, error: result.error };
  }, []);

  const restore = useCallback(async () => {
    const premium = await restorePurchases();
    if (premium) {
      setTier('premium');
      await AsyncStorage.setItem(STORAGE_KEY, 'premium');
    }
    return premium;
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{
        tier,
        isPremium: tier === 'premium',
        canAccess,
        upgrade,
        restore,
        packages,
        isLoaded,
        purchasesAvailable: isPurchasesAvailable(),
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  return useContext(SubscriptionContext);
}
