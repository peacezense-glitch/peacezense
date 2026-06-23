# PeaceZense

**PeaceZense** 是一個綜合命理／靈性導航 iOS / Android App，採用 **Expo + React Native** 單一 codebase。

參考 [FateTell](https://fatetell.com/zh-TW)、[八字 Lab](https://www.bazi-lab.com/)、[测测 CeCe](https://www.cece.com/) 的產品模式，採用 **免費分析 + 會員付費** 商業架構。

## 商業模式

| 層級 | 功能 |
|------|------|
| **免費** | 八字命盤、十神、喜用神、五大人生專題、每日運勢、易經占卜 |
| **會員** | 大運流年、流年運勢、紫微全盤、AI 命理師對話、命書 PDF 匯出 |

## 功能模組

### 人生層面
- **八字** — 專業排盤（節氣換月）、十神、納音、喜用神、命之書五大專題
- **紫微斗數** — 十二宮位星曜
- **人類圖** — 能量類型與內在權威
- **占星** — 太陽／月亮／上升星座
- **瑪雅曆法** — Tzolkin Kin 印記

### 事件層面
- **易經占卜** — 完整六十四卦
- **奇門遁甲** — 時空九宮盤

## 技術架構

- Expo SDK 56 + React Native 0.85 + TypeScript
- `lunar-javascript` — 專業農曆／八字排盤引擎
- 真太陽時校正（出生地經度）
- AI 命理師（規則引擎 + 可選 OpenAI）
- `expo-print` — 命書 PDF 匯出
- 會員系統（預留 RevenueCat 整合）

## 開始使用

```bash
npm install
npm start
```

## 專案結構

```
lib/bazi/          # 八字引擎（排盤、喜用神、命之書分析）
lib/iching/        # 六十四卦資料
context/           # 使用者資料、會員狀態
constants/Features.ts  # 免費/付費功能定義
app/modules/       # 七大命理模組
app/subscribe.tsx  # 會員訂閱頁
```

## 授權

MIT License
