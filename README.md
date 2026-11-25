# Giant Support Portal

捷安特售後服務入口的設計原型。這一版只有桌面畫面（目標寬度 1440px），範圍是服務 BOM 的列表與明細。沒有後端，畫面上的 BOM、料號、人員與日期都是模擬資料。

## 開發

```bash
npm install
npm run dev
```

開發伺服器：<http://127.0.0.1:43123>

## Storybook

```bash
npm run storybook
npm run build-storybook
```

Storybook 收錄色彩、字級、間距、圓角，以及按鈕、輸入、頁籤、狀態標籤、表格、篩選。

## 標誌

側欄字標的路徑來自捷安特官網頁首導覽列的 SVG（<https://www.giant-bicycles.com/tw>，`main-navigation-logo`，2026-11-25 取得），路徑資料未改，填色為黑色。分頁圖示使用官網檔案 <https://static.giant-bicycles.com/Icons/Giant/v8/favicon.svg>。`src/assets/giant-logo-blue.jpg` 是官網結構化資料中的標誌檔 <https://static.giant-bicycles.com/Images/Giant/Giant-Logo-Blue.jpg>，畫面目前使用向量字標。主色 `#06038D` 取自同一份 favicon 的填色。
