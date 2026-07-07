---
name: wechat-miniapp-engineer
description: Use when creating, modifying, reviewing, debugging, compiling, testing, screenshotting, or releasing WeChat Mini Program projects, including WXML/WXSS/JS/TS/JSON, Taro/uni-app/mpvue outputs, WeChat DevTools, miniprogram-ci, miniprogram-automator, lifecycle, API limits, components, subpackages, performance, and multi-device UI checks.
---

# WeChat Miniapp Engineer

## Overview

Act like a senior WeChat Mini Program engineer: preserve miniapp runtime constraints, use mature tooling first, and finish with compile, DevTools, console, screenshot, and UI evidence whenever the local project makes that possible.

## Tool Preference

Prefer mature ecosystem tools over custom emulation:

| Need | Prefer |
| --- | --- |
| Compile, preview, upload, npm pack, quality checks | `miniprogram-ci` |
| Real DevTools automation, console, page interaction, screenshots | `miniprogram-automator` or WeChat DevTools CLI |
| Component unit tests | `miniprogram-simulate` |
| API type safety | `miniprogram-api-typings` |
| Cross-framework source projects | Project's own build first, then validate generated miniapp output |

If a tool is missing, report the exact missing dependency and continue with the strongest available static checks. Do not pretend a static scan replaces WeChat runtime validation.

## Delivery Workflow

1. Identify the project type and miniapp root. Look for `project.config.json`, `app.json`, `miniprogramRoot`, `src/app.config.*`, `pages.json`, or framework build scripts.
2. Read the relevant references only when needed:
   - API, permissions, privacy, storage, network, routing: `references/wx-api.md`
   - Page/app/component lifecycles and async cleanup: `references/lifecycle.md`
   - Custom components, slots, relations, behaviors: `references/component-rule.md`
   - Subpackages, package size, `setData`, assets, startup: `references/performance.md`
   - Visual quality, responsive layout, screenshots: `references/ui-checklist.md`
3. Before editing, inspect existing conventions: state shape, page lifecycle placement, component style, routing, request wrapper, auth/session handling, design tokens, and build scripts.
4. Make the smallest coherent change. Avoid introducing web-only APIs, DOM assumptions, browser globals, oversized `setData`, or unverified plugins.
5. Run project tests/lint/build if present. Then run this skill's scripts where possible:
   - `node <skill>/scripts/build.js --project <miniapp-root>`
   - `node <skill>/scripts/devtools-cli.js --project <miniapp-root> --preview`
   - `node <skill>/scripts/screenshot.js --project <miniapp-root> --pages pages/index/index`
6. Inspect console/runtime output. Treat compile errors, page load errors, unhandled promise rejections, failed required requests, privacy permission errors, and missing assets as blockers.
7. Inspect screenshots on at least one narrow and one wide phone profile when UI changed. Check no clipping, overlap, tiny tap targets, distorted images, unsafe-area issues, or unreadable text.
8. Final response must state what was changed, which validations ran, which were unavailable, and where screenshot artifacts were written.

## Verification Gates

For code changes, do not call the task complete until these are addressed:

| Gate | Pass condition |
| --- | --- |
| Static | JSON parses, imports resolve, no obvious unsupported `wx.*` usage, no web DOM API in miniapp runtime code |
| Build | Project build or `miniprogram-ci` compile succeeds |
| Runtime | DevTools/automator opens target page without console errors |
| UI | Screenshots reviewed for the changed pages and target devices |
| Performance | Large lists, images, package size, and `setData` changes checked |

When local credentials, private keys, DevTools, or appid are unavailable, degrade honestly and name the missing prerequisite.

## Mature Sources

No high-star, complete Codex Skill for this domain is assumed. This skill is intentionally composed from the mature WeChat miniapp toolchain and official docs:

- WeChat DevTools CI docs: `https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html`
- WeChat DevTools automation docs: `https://developers.weixin.qq.com/miniprogram/dev/devtools/auto/`
- WeChat DevTools CLI docs: `https://developers.weixin.qq.com/miniprogram/dev/devtools/cli.html`
- Subpackages docs: `https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages.html`
- Performance docs: `https://developers.weixin.qq.com/miniprogram/dev/framework/performance/tips.html`
- `wechat-miniprogram/api-typings`: `https://github.com/wechat-miniprogram/api-typings`
- `wechat-miniprogram/miniprogram-simulate`: `https://github.com/wechat-miniprogram/miniprogram-simulate`

Refresh docs before changing release, privacy, or platform policy behavior because WeChat platform rules drift.
