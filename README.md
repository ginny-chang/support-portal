# Giant Support Portal

Design prototype for the Giant After Sales Services portal. This slice is desktop only, at 1440px, and covers the Service BOM list and detail. There is no backend. BOM records, part IDs, people, and dates are mock data.

## Develop

```bash
npm install
npm run dev
```

Dev server: <http://127.0.0.1:43123>

Shareable preview: <https://ginny-chang.github.io/support-portal/>

## Storybook

```bash
npm run storybook
npm run build-storybook
```

Storybook includes color, type, spacing, radius, and the button, input, tab, status tag, table, and filter components.

## Logo

The sidebar wordmark paths come from the header SVG on <https://www.giant-bicycles.com/tw> (`main-navigation-logo`, retrieved 2026-11-25). The path data is unchanged and the fill is black. The favicon is the official file <https://static.giant-bicycles.com/Icons/Giant/v8/favicon.svg>. `src/assets/giant-logo-blue.jpg` is the logo file from the site schema, <https://static.giant-bicycles.com/Images/Giant/Giant-Logo-Blue.jpg>. The UI uses the vector wordmark. Primary `#06038D` is the fill from that favicon.
