# AthleType 運動人格遊戲

28 題運動情境測驗，找出你屬於 16 種運動人格中的哪一種。純前端專案，沒有後端，作答資料只存在瀏覽器本機。

線上版本：https://mbtisports.sportsmedicine.tw/

## 功能

- 28 題運動情境選擇題，每個維度 7 題，約 5 分鐘完成
- 16 種運動人格結果頁，含四維度分析圖
- 運動員模式與教練模式雙視角建議
- 結果可下載成 1080x1080 分享圖
- 16 種類型完整介紹頁（/types）

## 技術

- Next.js（App Router）+ React + TypeScript
- Tailwind CSS
- Zustand 狀態管理，localStorage 持久化
- Vitest 單元測試
- 純前端靜態內容，無後端，無資料庫

## 開發指令

```bash
npm install      # 安裝依賴
npm run dev      # 本機開發（localhost:3000）
npm run build    # 建置
npm run start    # 啟動建置後版本
npm run lint     # ESLint
npm run test:run # 跑 Vitest 測試
```

## 商標與非關聯聲明

MBTI and Myers-Briggs are trademarks of The Myers & Briggs Foundation. This project is an independent, free educational tool based on publicly described type theory and is not affiliated with, endorsed by, or sponsored by The Myers & Briggs Foundation.

本測驗基於公開的類型理論製作，是獨立的免費教育工具，並非官方 MBTI 評估。

## 醫療免責聲明

本測驗結果僅供參考，不代表專業心理評估或醫療診斷。如有任何疑慮，請諮詢專業人士。

## 作者

吳易澄醫師（運動醫學科）

## License

MIT，全文見 [LICENSE](LICENSE)。
