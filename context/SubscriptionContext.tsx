import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SubscriptionTier } from '@/types';
import { FeatureKey, isFeatureFree } from '@/constants/Features';
import { purchaseProduct, restorePurchases, initPurchases } from '@/lib/purchases';

interface SubscriptionContextType {
  tier: SubscriptionTier;
  isPremium: boolean;
  canAccess: (feature: FeatureKey) => boolean;
  upgrade: (productId?: string) => Promise<void>;
  restore: () => Promise<void>;
  isLoaded: boolean;
}

const STORAGE_KEY = '@peacezense_subscription';

const SubscriptionContext = createContext<SubscriptionContextType>({
  tier: 'free',
  isPremium: false,
  canAccess: () => false,
  upgrade: async () => {},
  restore: async () => {},
  isLoaded: false,
});

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    initPurchases();
    restorePurchases().then((premium) => {
      if (premium) setTier('premium');
      setIsLoaded(true);
    });
  }, []);

  const canAccess = useCallback(
    (feature: FeatureKey) => tier === 'premium' || isFeatureFree(feature),
    [tier],
  );

  const upgrade = useCallback(async (productId = 'peacezense_yearly') => {
    const result = await purchaseProduct(productId);
    if (result.success) {
      setTier('premium');
      await AsyncStorage.setItem(STORAGE_KEY, 'premium');
    }
  }, []);

  const restore = useCallback(async () => {
    const premium = await restorePurchases();
    if (premium) {
      setTier('premium');
      await AsyncStorage.setItem(STORAGE_KEY, 'premium');
    }
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{
        tier,
        isPremium: tier === 'premium',
        canAccess,
        upgrade,
        restore,
        isLoaded,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  return useContext(SubscriptionContext);
}
