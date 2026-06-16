# PeaceZense

**PeaceZense** 是一個綜合命理／靈性導航 iOS / Android App，採用 **Expo + React Native** 單一 codebase，同時支援兩個平台。

## 功能模組

### 人生層面
| 模組 | 說明 |
|------|------|
| 八字 (Bazi) | 四柱命理，先天命格與五行分析 |
| 紫微斗數 (Zi Wei) | 十二宮位星曜命盤 |
| 人類圖 (Human Design) | 能量類型、策略與內在權威 |
| 占星 (Astrology) | 太陽、月亮、上升星座 |
| 瑪雅曆法 (Mayan Calendar) | Tzolkin 神聖曆 Kin 印記 |

### 事件層面
| 模組 | 說明 |
|------|------|
| 易經占卜 (I Ching) | 六十四卦擲卦指引 |
| 奇門遁甲 (Qi Men) | 時空九宮盤與吉方分析 |

## 技術架構

- **框架**: Expo SDK 56 + React Native 0.85
- **語言**: TypeScript
- **路由**: Expo Router (file-based)
- **狀態**: React Context + AsyncStorage（本機儲存出生資料）
- **UI**: 自訂靈性主題（紫／金配色）、LinearGradient、SF Symbols

## 專案結構

```
app/
  (tabs)/          # 底部導航：首頁、人生、事件、我的
  modules/         # 七大命理模組畫面
components/        # 共用 UI 元件
constants/         # 主題色彩、模組定義
context/           # 使用者出生資料 Context
lib/               # 各命理體系計算邏輯
types/             # TypeScript 型別定義
```

## 開始使用

### 安裝依賴

```bash
npm install
```

### 啟動開發伺服器

```bash
npm start
```

### 在裝置上執行

```bash
# iOS（需 macOS 或 Expo Go）
npm run ios

# Android
npm run android

# Web 預覽
npm run web
```

## 使用說明

1. 開啟 App 後，前往「我的」分頁設定出生日期、時間、地點與性別
2. 出生資料會儲存於本機，不會上傳至伺服器
3. 在「人生」分頁瀏覽先天命格相關模組
4. 在「事件」分頁使用易經占卜或奇門遁甲進行當下決策

## 授權

MIT License
