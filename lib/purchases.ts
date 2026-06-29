import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Purchases, {
  LOG_LEVEL,
  PurchasesPackage,
  CustomerInfo,
} from 'react-native-purchases';
import { CurrencyCode, PLAN_PRICES, formatPrice } from '@/constants/Pricing';

const IOS_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? '';
const ANDROID_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY ?? '';
const ENTITLEMENT_ID = 'premium';
const STORAGE_KEY = '@peacezense_subscription';

export const PRODUCT_IDS = {
  monthly: 'peacezense_monthly',
  yearly: 'peacezense_yearly',
} as const;

export interface PurchaseResult {
  success: boolean;
  productId?: string;
  error?: string;
  userCancelled?: boolean;
}

export interface SubscriptionPackage {
  id: string;
  title: string;
  price: string;
  period: string;
  rcPackage?: PurchasesPackage;
}

let initialized = false;
let cachedPackages: SubscriptionPackage[] = [];
let fallbackCurrency: CurrencyCode = 'HKD';

export function setFallbackCurrency(currency: CurrencyCode): void {
  fallbackCurrency = currency;
  if (!isPurchasesAvailable()) {
    cachedPackages = getFallbackPackages(currency);
  }
}

export function isPurchasesAvailable(): boolean {
  if (Platform.OS === 'web') return false;
  return Platform.OS === 'ios' ? !!IOS_KEY : !!ANDROID_KEY;
}

function hasPremiumEntitlement(info: CustomerInfo): boolean {
  return info.entitlements.active[ENTITLEMENT_ID] !== undefined;
}

export async function initPurchases(userId?: string): Promise<void> {
  if (initialized) return;

  if (!isPurchasesAvailable()) {
    initialized = true;
    return;
  }

  try {
    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    }

    const apiKey = Platform.OS === 'ios' ? IOS_KEY : ANDROID_KEY;
    Purchases.configure({ apiKey, appUserID: userId });

    initialized = true;
    await loadOfferings();
  } catch (e) {
    console.warn('[Purchases] init failed:', e);
    initialized = true;
  }
}

export async function loadOfferings(): Promise<SubscriptionPackage[]> {
  if (!isPurchasesAvailable()) {
    cachedPackages = getFallbackPackages(fallbackCurrency);
    return cachedPackages;
  }

  try {
    const offerings = await Purchases.getOfferings();
    const current = offerings.current;

    if (!current) {
      cachedPackages = getFallbackPackages(fallbackCurrency);
      return cachedPackages;
    }

    cachedPackages = current.availablePackages.map((pkg) => {
      const isYearly = pkg.packageType === 'ANNUAL' || pkg.identifier.includes('year');
      return {
        id: isYearly ? 'yearly' : 'monthly',
        title: isYearly ? '年度會員' : '月度會員',
        price: pkg.product.priceString,
        period: isYearly ? '/年' : '/月',
        rcPackage: pkg,
      };
    });

    if (cachedPackages.length === 0) {
      cachedPackages = getFallbackPackages(fallbackCurrency);
    }

    return cachedPackages;
  } catch (e) {
    console.warn('[Purchases] loadOfferings failed:', e);
    cachedPackages = getFallbackPackages(fallbackCurrency);
    return cachedPackages;
  }
}

export function getCachedPackages(): SubscriptionPackage[] {
  return cachedPackages.length > 0 ? cachedPackages : getFallbackPackages(fallbackCurrency);
}

function getFallbackPackages(currency: CurrencyCode = fallbackCurrency): SubscriptionPackage[] {
  const prices = PLAN_PRICES[currency];
  return [
    { id: 'monthly', title: '月度會員', price: formatPrice(prices.monthly, currency), period: '/月' },
    { id: 'yearly', title: '年度會員', price: formatPrice(prices.yearly, currency), period: '/年' },
  ];
}

export async function purchasePackage(packageId: string): Promise<PurchaseResult> {
  if (!isPurchasesAvailable()) {
    await AsyncStorage.setItem(STORAGE_KEY, 'premium');
    return { success: true, productId: packageId };
  }

  const pkg = cachedPackages.find((p) => p.id === packageId);
  if (!pkg?.rcPackage) {
    return { success: false, error: '找不到訂閱方案，請稍後再試' };
  }

  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg.rcPackage);
    const success = hasPremiumEntitlement(customerInfo);
    if (success) {
      await AsyncStorage.setItem(STORAGE_KEY, 'premium');
    }
    return { success, productId: packageId };
  } catch (e: unknown) {
    const err = e as { userCancelled?: boolean; message?: string };
    if (err.userCancelled) {
      return { success: false, userCancelled: true };
    }
    return { success: false, error: err.message ?? '購買失敗' };
  }
}

/** @deprecated Use purchasePackage instead */
export async function purchaseProduct(productId: string): Promise<PurchaseResult> {
  const packageId = productId.includes('year') ? 'yearly' : 'monthly';
  return purchasePackage(packageId);
}

export async function restorePurchases(): Promise<boolean> {
  if (!isPurchasesAvailable()) {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data === 'premium';
  }

  try {
    const info = await Purchases.restorePurchases();
    const premium = hasPremiumEntitlement(info);
    if (premium) {
      await AsyncStorage.setItem(STORAGE_KEY, 'premium');
    }
    return premium;
  } catch (e) {
    console.warn('[Purchases] restore failed:', e);
    return false;
  }
}

export async function checkPremiumStatus(): Promise<boolean> {
  if (!isPurchasesAvailable()) {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data === 'premium';
  }

  try {
    const info = await Purchases.getCustomerInfo();
    return hasPremiumEntitlement(info);
  } catch {
    return restorePurchases();
  }
}
