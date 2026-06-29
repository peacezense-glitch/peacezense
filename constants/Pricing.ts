export type CurrencyCode = 'HKD' | 'USD' | 'TWD';

export interface CurrencyOption {
  code: CurrencyCode;
  symbol: string;
  label: string;
}

export const CURRENCIES: CurrencyOption[] = [
  { code: 'HKD', symbol: 'HK$', label: '港幣' },
  { code: 'USD', symbol: 'US$', label: '美金' },
  { code: 'TWD', symbol: 'NT$', label: '新台幣' },
];

export interface PlanPricing {
  monthly: number;
  yearly: number;
}

export const PLAN_PRICES: Record<CurrencyCode, PlanPricing> = {
  HKD: { monthly: 68, yearly: 488 },
  USD: { monthly: 8.99, yearly: 59.99 },
  TWD: { monthly: 299, yearly: 1999 },
};

export function formatPrice(amount: number, currency: CurrencyCode): string {
  const opt = CURRENCIES.find((c) => c.code === currency)!;
  if (currency === 'USD') {
    return `${opt.symbol}${amount.toFixed(2)}`;
  }
  return `${opt.symbol}${amount}`;
}

export function getPlanFeatures(currency: CurrencyCode): {
  monthly: string[];
  yearly: string[];
} {
  const saveLabel =
    currency === 'HKD' ? '省 HK$328' : currency === 'USD' ? 'Save US$48' : '省 NT$1,589';

  return {
    monthly: [
      '完整大運流年分析',
      '八字擇日（全事件類型）',
      '紫微斗數全盤解讀',
      '西洋占星本命盤',
      'AI 命理師對話',
      '奇門遁甲擇日',
    ],
    yearly: [
      '包含月度會員所有功能',
      '完整命書 PDF 匯出',
      '八字擇日進階分析',
      '優先體驗新功能',
      saveLabel,
    ],
  };
}
