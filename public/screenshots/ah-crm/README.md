# AH-CRM screenshots

Drop product screenshots here. They are referenced by `image` paths in
`lib/case-studies.ts` → `AH_CRM.idea.systemBuild.screens` and rendered by the
sticky-scroll walkthrough (`components/case/SystemBuildScroll.tsx`).

Expected files (add as you go):

- `dashboard.png` — Admin Dashboard (already wired up)

Until a file exists, the stage shows a labelled placeholder with the missing
path, so the layout never breaks. To add another screen, save its image here
and append a new entry to the `screens` array with a matching `image` path.

Tip: capture at a wide ratio (~16:10). The frame uses `object-cover` from the
top, so the top of the screen is always shown.
