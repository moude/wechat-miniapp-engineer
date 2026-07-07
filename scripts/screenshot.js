#!/usr/bin/env node
/*
 * Capture miniapp page screenshots through miniprogram-automator.
 * Requires WeChat DevTools CLI and miniprogram-automator in the target project.
 */

const fs = require("fs");
const path = require("path");
const { createRequire } = require("module");

const DEVICE_PROFILES = {
  narrow: { name: "iPhone SE", width: 375, height: 667, dpr: 2 },
  common: { name: "iPhone 12", width: 390, height: 844, dpr: 3 },
  large: { name: "Pixel 7 Pro", width: 412, height: 915, dpr: 3 },
};

function parseArgs(argv) {
  const args = {
    project: process.cwd(),
    cli: process.env.WECHAT_DEVTOOLS_CLI || "",
    pages: "",
    output: path.join(process.cwd(), "miniapp-screenshots"),
    devices: "narrow,common",
    wait: "1000",
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith("--")) {
        throw new Error(`Missing value for ${arg}`);
      }
      args[key] = next;
      i += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

function printHelp() {
  console.log(`Usage:
  node screenshot.js --project <miniapp-root> --pages pages/index/index,pages/detail/index [--output <dir>] [--devices narrow,common,large] [--cli <path>] [--wait 1000]

Environment:
  WECHAT_DEVTOOLS_CLI=/path/to/cli`);
}

function resolveDependency(projectPath, name) {
  const localRequire = createRequire(path.join(projectPath, "package.json"));
  try {
    return localRequire(name);
  } catch (localError) {
    try {
      return require(name);
    } catch (globalError) {
      const err = new Error(
        `Cannot resolve ${name}. Install it in the target project: npm i -D ${name}`
      );
      err.cause = localError;
      throw err;
    }
  }
}

function findCli(explicit) {
  if (explicit && fs.existsSync(explicit)) return explicit;
  if (explicit && explicit === "cli") return explicit;

  const roots =
    process.platform === "win32"
      ? [process.env.ProgramFiles, process.env["ProgramFiles(x86)"], process.env.LOCALAPPDATA].filter(Boolean)
      : [];

  const candidates = [];
  if (process.env.WECHAT_DEVTOOLS_CLI) candidates.push(process.env.WECHAT_DEVTOOLS_CLI);
  for (const root of roots) {
    candidates.push(path.join(root, "Tencent", "微信开发者工具", "cli.bat"));
    candidates.push(path.join(root, "Tencent", "WeChat DevTools", "cli.bat"));
    candidates.push(path.join(root, "微信开发者工具", "cli.bat"));
  }
  if (process.platform === "darwin") {
    candidates.push(
      "/Applications/wechatwebdevtools.app/Contents/MacOS/cli",
      "/Applications/微信开发者工具.app/Contents/MacOS/cli"
    );
  }

  for (const candidate of candidates) {
    if (candidate && fs.existsSync(candidate)) return candidate;
  }

  throw new Error("Cannot find WeChat DevTools CLI. Set WECHAT_DEVTOOLS_CLI or pass --cli.");
}

function normalizePage(page) {
  const trimmed = page.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function safeName(value) {
  return value.replace(/^\/+/, "").replace(/[\\/:*?"<>|]+/g, "_").replace(/\//g, "__");
}

async function screenshotPage(page, filePath) {
  if (typeof page.screenshot !== "function") {
    throw new Error("Current miniprogram-automator Page object has no screenshot() method.");
  }

  const result = await page.screenshot({ path: filePath });
  if (!fs.existsSync(filePath) && Buffer.isBuffer(result)) {
    fs.writeFileSync(filePath, result);
  }
}

async function main() {
  const options = parseArgs(process.argv);
  if (options.help) {
    printHelp();
    return;
  }

  const project = path.resolve(options.project);
  const output = path.resolve(options.output);
  const waitMs = Number(options.wait);
  const pages = options.pages.split(",").map(normalizePage).filter(Boolean);
  const devices = options.devices.split(",").map((name) => name.trim()).filter(Boolean);

  if (!pages.length) {
    throw new Error("No pages provided. Use --pages pages/index/index[,pages/...]");
  }

  fs.mkdirSync(output, { recursive: true });

  const automator = resolveDependency(project, "miniprogram-automator");
  const cliPath = findCli(options.cli);
  const miniProgram = await automator.launch({ cliPath, projectPath: project });

  try {
    for (const deviceName of devices) {
      const device = DEVICE_PROFILES[deviceName];
      if (!device) {
        throw new Error(`Unknown device profile: ${deviceName}`);
      }

      if (typeof miniProgram.setDevice === "function") {
        await miniProgram.setDevice(device.name);
      }
      if (typeof miniProgram.setViewport === "function") {
        await miniProgram.setViewport({
          width: device.width,
          height: device.height,
          deviceScaleFactor: device.dpr,
        });
      }

      for (const pagePath of pages) {
        const page = await miniProgram.reLaunch(pagePath);
        await page.waitFor(waitMs);
        const filePath = path.join(output, `${deviceName}-${safeName(pagePath)}.png`);
        await screenshotPage(page, filePath);
        console.log(`[wechat-miniapp-engineer] screenshot ${filePath}`);
      }
    }
  } finally {
    await miniProgram.close();
  }
}

main().catch((error) => {
  console.error("[wechat-miniapp-engineer] screenshot failed");
  console.error(error && error.stack ? error.stack : error);
  process.exit(1);
});
