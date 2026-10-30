# AH-Website screenshots

Drop screenshots of the live Adventure Holidays website here. They are
referenced by `image` / `mockup` paths in `lib/data.ts` (`projects` →
`ah-website`) and rendered by the case-study hero (`components/case/CaseHero.tsx`).

Expected files:

- `hero.jpg` — full-page or homepage screenshot used as the hero background
- `homepage.jpg` — homepage screenshot used in the floating browser-frame mockup

Until these exist, the hero will show a broken image in place of the
background/mockup — everything else on the page renders normally. Capture at
a wide ratio; the hero background uses `object-cover` from the top and the
mockup frame uses a 16:10 crop.
