# WeChat API Rules

Use this when touching `wx.*`, routing, network, storage, auth, privacy, media, payment, plugins, or platform capability code.

## API Compatibility

- Check API availability against the target base library. Guard newer APIs with `wx.canIUse` or a documented fallback.
- Keep user-facing feature behavior graceful when an API is missing. Avoid silent no-ops.
- Do not use browser-only globals in miniapp runtime code: `window`, `document`, `localStorage`, `sessionStorage`, DOM events, CSSOM, or direct canvas DOM APIs.
- For framework projects, keep web-only code behind platform guards and validate the generated miniapp output.

## Permissions And Privacy

- Before using location, camera, microphone, album, Bluetooth, contacts, clipboard, or sensitive profile data, confirm the project has the required permission/privacy declarations and user-facing rationale.
- Prefer explicit user action before requesting sensitive permission. Avoid permission prompts on cold page load unless the feature cannot render otherwise.
- Handle denial paths. The UI must explain how to proceed or retry without trapping the user.

## Network And Auth

- Use the project's existing request wrapper when present. Preserve token injection, refresh, base URL, error normalization, loading state, retry rules, and telemetry.
- Validate domain constraints: production requests must use configured HTTPS domains; local/dev exceptions must stay development-only.
- Do not put secrets, private keys, long-lived tokens, or admin credentials in miniapp code.
- Handle `401`, session expiry, timeout, offline, and backend business errors distinctly.

## Routing And Data Passing

- Keep route paths in sync with `app.json`, subpackage roots, and framework route generation.
- Use `wx.navigateTo` only within stack limits and for normal pages. Use `redirectTo`, `switchTab`, `reLaunch`, or `navigateBack` deliberately.
- Avoid passing large objects in query strings. Use IDs plus store/cache, or event channel when supported.
- Validate route params in `onLoad`; never assume all entry points are internal.

## Storage

- Treat `wx.setStorageSync` as blocking. Avoid writing large payloads or frequent updates on scroll/input paths.
- Version cached shapes and tolerate missing/stale values.
- Keep sensitive data minimal and clear it on logout when required by the product.

## Failure Signals

Block completion when console logs show missing permission declarations, undefined `wx.*`, failed required network calls, unhandled promise rejections, route-not-found errors, missing assets, plugin load failures, or privacy authorization errors.
