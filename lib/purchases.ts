/**
 * 訂閱服務層 — 預留 RevenueCat 整合
 *
 * 正式上線步驟：
 * 1. npm install react-native-purchases
 * 2. 在 RevenueCat 建立 monthly / yearly 產品
 * 3. 設定 EXPO_PUBLIC_REVENUECAT_IOS_KEY / ANDROID_KEY
 * 4. 將 USE_MOCK 設為 false
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const USE_MOCK = true;
const STORAGE_KEY = '@peacezense_subscription';

export const PRODUCT_IDS = {
  monthly: 'peacezense_monthly',
  yearly: 'peacezense_yearly',
} as const;

export interface PurchaseResult {
  success: boolean;
  productId?: string;
  error?: string;
}

export async function initPurchases(): Promise<void> {
  if (USE_MOCK) return;
  // const Purchases = require('react-native-purchases').default;
  // await Purchases.configure({ apiKey: Platform.OS === 'ios' ? IOS_KEY : ANDROID_KEY });
}

export async function purchaseProduct(productId: string): Promise<PurchaseResult> {
  if (USE_MOCK) {
    await AsyncStorage.setItem(STORAGE_KEY, 'premium');
    return { success: true, productId };
  }
  // const Purchases = require('react-native-purchases').default;
  // const { customerInfo } = await Purchases.purchaseProduct(productId);
  // return { success: customerInfo.entitlements.active['premium'] !== undefined, productId };
  return { success: false, error: 'Purchases not configured' };
}

export async function restorePurchases(): Promise<boolean> {
  if (USE_MOCK) {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data === 'premium';
  }
  // const Purchases = require('react-native-purchases').default;
  // const info = await Purchases.restorePurchases();
  // return info.entitlements.active['premium'] !== undefined;
  return false;
}

export async function checkPremiumStatus(): Promise<boolean> {
  if (USE_MOCK) {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data === 'premium';
  }
  return restorePurchases();
}
