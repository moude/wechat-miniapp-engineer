# Performance And Package Rules

Use this when changing startup, package layout, list rendering, images, requests, `setData`, media, map/canvas, or large dependencies.

## Subpackages

- Keep first-screen code in the main package only when required at startup.
- Move feature pages, heavy components, large assets, and optional flows into subpackages.
- Keep route paths and `app.json` subpackage roots consistent.
- Use independent subpackages only for flows that truly do not need main-package code.
- Preload subpackages only when user intent is clear. Avoid preloading everything on launch.

## Package Size

- Check `project.config.json` and framework build output for `miniprogramRoot`.
- Avoid bundling unused demos, test data, screenshots, source maps, design assets, or large JSON.
- Prefer CDN/cloud storage for large media when product and offline constraints allow.
- Keep third-party libraries justified; small helper code can be better than pulling a web-oriented dependency.

## `setData`

- Send only changed fields. Prefer `list[index].field` updates over replacing large lists.
- Batch related updates into one call.
- Avoid `setData` in high-frequency scroll/touch/input loops. Throttle or move state to WXS/native components when needed.
- Keep non-rendering data outside `data`.
- Do not store huge raw API responses in page data when only a few display fields are needed.

## Lists And Images

- Use pagination or virtualization-style rendering for long lists.
- Use stable keys and avoid re-rendering entire lists after a small item change.
- Set image dimensions or aspect-ratio wrappers to avoid layout shift.
- Preserve image aspect ratio unless intentional cropping is specified.
- Lazy-load below-the-fold images when appropriate.

## Startup And Requests

- Make first screen render with the minimum required data.
- Defer secondary requests until visible or user-intended.
- Avoid blocking startup on analytics, optional config, or non-critical media.
- Cache carefully; stale data must be acceptable or visibly refreshed.

## Required Checks

- For UI/data changes, inspect whether the first page payload and `setData` payload grew materially.
- For new pages/assets, inspect package placement and route registration.
- For image-heavy pages, verify aspect ratio, file size, lazy loading, and placeholder behavior.
