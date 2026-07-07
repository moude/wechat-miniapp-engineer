# wechat-miniapp-engineer

A composite Codex Skill for WeChat Mini Program work. It helps Codex behave more like a senior miniapp engineer: understand WeChat runtime rules, prefer mature ecosystem tooling, and finish changes with compile, DevTools, console, screenshot, performance, and UI checks when the local project supports them.

## What It Covers

- WeChat API limits, permission/privacy rules, request/auth handling, routing, and storage.
- App, page, and component lifecycle rules.
- Custom component contracts, slots, behaviors, relations, and style isolation.
- Subpackage strategy, package size, startup, `setData`, list, and image performance.
- Multi-device UI review, screenshots, layout, safe-area, image ratio, and interaction checks.
- Automation entry points for `miniprogram-ci`, WeChat DevTools CLI, and `miniprogram-automator`.

## Layout

```text
wechat-miniapp-engineer/
  SKILL.md
  agents/
    openai.yaml
  references/
    wx-api.md
    lifecycle.md
    component-rule.md
    performance.md
    ui-checklist.md
  scripts/
    build.js
    devtools-cli.js
    screenshot.js
```

## Install

Clone this repository into your Codex skills directory:

```bash
git clone https://github.com/moude/wechat-miniapp-engineer.git ~/.codex/skills/wechat-miniapp-engineer
```

On Windows, you can also keep the repository in a normal code directory and junction it into Codex:

```powershell
git clone https://github.com/moude/wechat-miniapp-engineer.git D:\code\personal\wechat-miniapp-engineer
cmd /c mklink /J "%USERPROFILE%\.codex\skills\wechat-miniapp-engineer" "D:\code\personal\wechat-miniapp-engineer"
```

Restart Codex or start a new thread after installation so the skill metadata is loaded.

## Script Usage

Run scripts from any WeChat Mini Program project by passing the miniapp root:

```bash
node ~/.codex/skills/wechat-miniapp-engineer/scripts/build.js --project path/to/miniprogram
node ~/.codex/skills/wechat-miniapp-engineer/scripts/devtools-cli.js --project path/to/miniprogram --preview
node ~/.codex/skills/wechat-miniapp-engineer/scripts/screenshot.js --project path/to/miniprogram --pages pages/index/index
```

The scripts do not vendor dependencies. They resolve tools from the target project first. Add the relevant tools to the miniapp project when needed:

```bash
npm i -D miniprogram-ci miniprogram-automator miniprogram-simulate miniprogram-api-typings
```

Useful environment variables:

```bash
WECHAT_APPID=your-appid
WECHAT_PRIVATE_KEY_PATH=/path/to/private.key
WECHAT_DEVTOOLS_CLI=/path/to/wechat-devtools/cli
```

## Source Basis

This skill is composed from mature WeChat Mini Program tooling and official documentation rather than a single low-star community skill:

- WeChat DevTools CI: https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html
- WeChat DevTools automation: https://developers.weixin.qq.com/miniprogram/dev/devtools/auto/
- WeChat DevTools CLI: https://developers.weixin.qq.com/miniprogram/dev/devtools/cli.html
- Subpackages: https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages.html
- Performance: https://developers.weixin.qq.com/miniprogram/dev/framework/performance/tips.html
- API typings: https://github.com/wechat-miniprogram/api-typings
- Component testing: https://github.com/wechat-miniprogram/miniprogram-simulate

Refresh official docs before changing release, privacy, or platform policy behavior because WeChat platform rules change over time.
