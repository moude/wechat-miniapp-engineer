# Lifecycle Rules

Use this when editing `App`, `Page`, `Component`, hooks, subscriptions, timers, requests, or state initialization.

## App

- Put global bootstrapping in `App.onLaunch` only when it must happen once. Keep page-specific loading in page lifecycles.
- Use `onShow` for resume-sensitive work such as session refresh, foreground analytics, clipboard checks after explicit action, or reconnecting listeners.
- Clean global timers, sockets, and long-running subscriptions when the app can no longer use them.

## Page

- `onLoad`: parse route params, initialize stable page state, start first data load.
- `onShow`: refresh data that can change while away. Avoid duplicating `onLoad` requests unless the product needs refresh-on-return.
- `onReady`: run layout-dependent operations such as selector queries or canvas setup.
- `onHide`: pause timers, media, polling, or transient subscriptions.
- `onUnload`: abort requests when possible, clear timers, detach event bus listeners, disconnect observers.
- `onPullDownRefresh`: always call `wx.stopPullDownRefresh` in both success and failure paths.
- `onReachBottom`: guard pagination with `loading`, `finished`, and request identity to avoid duplicate fetches.

## Component

- Prefer `lifetimes.attached` for initialization that needs properties but not final layout.
- Use `lifetimes.ready` for selector queries, measured layout, or animation setup.
- Use `lifetimes.detached` to clear timers, observers, event channels, sockets, and global event listeners.
- Use `observers` sparingly. Avoid deep observers that trigger expensive recomputation for every small field change.
- Keep property observers idempotent and tolerant of partial data during initialization.

## Async Safety

- Track request identity or cancellation so late responses do not overwrite newer state after route changes.
- Do not call `setData` after `detached` or `onUnload`; guard with an `alive` flag if the API cannot be cancelled.
- Coalesce state updates from the same async turn into one `setData`.
- Keep loading/error/empty states explicit. A page should never remain in loading forever after a failed request.

## Common Bugs

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Duplicate API calls after navigation back | Same refresh in `onLoad` and `onShow` | Gate first show or use a refresh policy |
| Page updates after leaving | Late async response | Abort, identity-check, or `alive` guard |
| Component memory leak | Timer/listener not cleared | Clean in `detached` |
| Pull-down spinner never stops | Missing finally path | Stop refresh in `finally` |
| Infinite pagination | Missing `loading`/`finished` gate | Add gates and page cursor checks |
