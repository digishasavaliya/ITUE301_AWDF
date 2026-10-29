# Practical 8 Performance Optimization

## Before Optimization

- Build command: `npm run build`
- Initial JavaScript bundle size: `252.05 kB` (`dist/assets/index-CBHRqI-E.js`)
- Other generated JS sizes: `dist/assets/index-CREsPhPz.css` was `12.72 kB`
- Network observations: The app shipped a single JavaScript bundle for the full app, so the initial route loaded all route code together.
- Initial page load observations: The first production build showed a single main JavaScript bundle without separate route chunks. The home page and navigation routes were all included in the initial bundle.

## After Optimization

- Build command: `npm run build`
- Initial JavaScript bundle size: `236.34 kB` (`dist/assets/index-RrCWXsjF.js`)
- Additional lazy-loaded chunks:
  - `dist/assets/Home-0ojHLGuO.js` = `2.56 kB`
  - `dist/assets/Contact-Bmqeqw-N.js` = `2.11 kB`
  - `dist/assets/Projects-FONgQW_z.js` = `7.97 kB`
  - `dist/assets/Login-Cv34CF50.js` = `1.71 kB`
  - `dist/assets/Register-71RFWnkb.js` = `1.66 kB`
  - `dist/assets/NotFound-qnBnBFvb.js` = `0.62 kB`
  - `dist/assets/api-BeZNZzJF.js` = `0.87 kB`
- Network observations: The production build now emits separate lazy chunks for route and API-related components. These chunks are fetched on demand when the route is used.
- Initial page load observations: The main app bundle is smaller and route modules are loaded only when accessed. This reduces the JavaScript required at initial route load while the total downloaded code across a full session may still be similar.

## Comparison Table

| Metric | Before | After |
|---|---:|---:|
| Initial JS bundle | 252.05 kB | 236.34 kB |
| Home chunk | N/A | 2.56 kB |
| Projects chunk | N/A | 7.97 kB |
| Contact chunk | N/A | 2.11 kB |
| Initial page loading | One large bundled JS file | Smaller initial bundle with lazy route chunks |
| Network observation | All route code loaded upfront | Route code downloaded on demand |

## Chrome DevTools Network Testing

1. Start frontend: `npm run dev`
2. Open Chrome DevTools > Network.
3. Filter by JS.
4. Reload the Home page and note the initial JavaScript files.
5. Navigate to `/projects` and confirm the `Projects` chunk downloads.
6. Navigate to `/contact` and confirm the `Contact` chunk downloads.
7. Set throttling to Slow 3G.
8. Reload or navigate again and confirm the `Loading page...` fallback appears.

## React DevTools Profiler

- Component: Route-level page components loaded through `React.lazy()`
- Reason for re-render: No definite unnecessary re-render was identified during this practical session.
- Observed behavior: The route transitions remained stable and no duplicated render loop was observed in the app shell.
- Possible optimization: Keep route-level lazy loading and avoid expanding the route list unnecessarily. No extra optimization was required for this project.

## Heavy Component Note

No existing heavy third-party charting or analytics component was present in this application, so no additional heavy component was lazy-loaded beyond the route-based pages required for Practical 8.

## Manual Fill-in Section

- Actual Chrome Network measurements: ________________
- Actual Slow 3G timing observation: ________________
- DevTools screenshot references: ________________
