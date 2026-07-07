# wechat-miniapp-engineer

面向微信小程序开发的组合 Codex Skill。目标不是只让 Codex 生成代码，而是让它在小程序场景里更像一位高级工程师：理解微信运行时规则，优先使用成熟工具链，并在交付前尽量完成编译、开发者工具、Console、截图、性能和 UI 质量检查。

## English Entry

This repository provides a composite Codex Skill for WeChat Mini Program engineering. It guides Codex through WeChat runtime rules, mature miniapp tooling, compile checks, DevTools automation, screenshots, performance review, and UI quality gates.

Start from [`SKILL.md`](./SKILL.md). The current README is written in Chinese first; an expanded English README can be added later if needed.

## 解决什么问题

微信小程序开发里，问题通常不只在代码生成阶段，而是在这些交付细节里暴露：

- 微信 API 限制、权限、隐私、网络域名、路由栈、存储策略。
- `App`、`Page`、`Component` 生命周期和异步清理。
- 自定义组件的属性、事件、插槽、behaviors、relations、样式隔离。
- 分包策略、包体积、首屏启动、`setData`、长列表、图片性能。
- 微信开发者工具编译、预览、上传、Console 错误、页面截图。
- 多设备适配、布局溢出、安全区、图片比例、交互状态。

这个 Skill 把这些检查沉到可复用流程里，避免每次都靠临场提醒。

## 目录结构

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

说明：

- `SKILL.md`：Codex 触发和执行小程序工程任务时读取的主流程。
- `references/`：按需读取的细分规则，避免主 Skill 过长。
- `scripts/`：编译、微信开发者工具 CLI、截图验证入口。
- `agents/openai.yaml`：Codex UI 展示元数据。

## 安装

最简单的方式是直接 clone 到 Codex skills 目录：

```bash
git clone https://github.com/moude/wechat-miniapp-engineer.git ~/.codex/skills/wechat-miniapp-engineer
```

Windows 上也可以把仓库放在常用代码目录，再用 junction 挂到 Codex：

```powershell
git clone https://github.com/moude/wechat-miniapp-engineer.git D:\code\personal\wechat-miniapp-engineer
cmd /c mklink /J "%USERPROFILE%\.codex\skills\wechat-miniapp-engineer" "D:\code\personal\wechat-miniapp-engineer"
```

安装后重启 Codex，或开启新线程，让 Skill 元数据重新加载。

## 脚本用法

脚本不内置依赖，会优先从目标小程序项目里解析工具。这样 Skill 可以跨电脑同步，而各项目仍然使用自己的工具版本。

```bash
node ~/.codex/skills/wechat-miniapp-engineer/scripts/build.js --project path/to/miniprogram
node ~/.codex/skills/wechat-miniapp-engineer/scripts/devtools-cli.js --project path/to/miniprogram --preview
node ~/.codex/skills/wechat-miniapp-engineer/scripts/screenshot.js --project path/to/miniprogram --pages pages/index/index
```

按需在小程序项目里安装工具：

```bash
npm i -D miniprogram-ci miniprogram-automator miniprogram-simulate miniprogram-api-typings
```

常用环境变量：

```bash
WECHAT_APPID=your-appid
WECHAT_PRIVATE_KEY_PATH=/path/to/private.key
WECHAT_DEVTOOLS_CLI=/path/to/wechat-devtools/cli
```

## 推荐工作流

当 Codex 处理小程序代码时，应优先：

1. 识别项目类型和小程序根目录，例如原生小程序、Taro、uni-app、mpvue 或其他生成产物。
2. 读取项目已有约定，包括构建脚本、请求封装、路由、状态、组件样式和设计 token。
3. 按需读取 `references/` 里的规则文件。
4. 做最小但完整的代码改动。
5. 运行项目自带 lint/test/build。
6. 尽量运行 `miniprogram-ci` 编译或微信开发者工具 CLI 预览。
7. UI 变更要截图检查窄屏和常见机型。
8. 最终说明已运行的验证，以及因为缺少 appid、私钥、开发者工具或项目依赖而无法运行的验证。

## 成熟方案来源

这个 Skill 不是照搬某个低星社区 Skill，而是组合成熟的小程序工程工具和官方文档：

- 微信 DevTools CI：https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html
- 微信 DevTools 自动化：https://developers.weixin.qq.com/miniprogram/dev/devtools/auto/
- 微信 DevTools CLI：https://developers.weixin.qq.com/miniprogram/dev/devtools/cli.html
- 分包文档：https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages.html
- 性能文档：https://developers.weixin.qq.com/miniprogram/dev/framework/performance/tips.html
- API typings：https://github.com/wechat-miniprogram/api-typings
- 组件测试：https://github.com/wechat-miniprogram/miniprogram-simulate

涉及发布、隐私、平台策略、审核规则时，应重新确认微信官方文档，因为平台规则可能变化。
