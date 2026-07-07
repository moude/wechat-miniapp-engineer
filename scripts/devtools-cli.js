#!/usr/bin/env node
/*
 * Thin wrapper around the WeChat DevTools CLI.
 * It discovers common Windows/macOS paths and accepts WECHAT_DEVTOOLS_CLI.
 */

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

function parseArgs(argv) {
  const args = {
    project: process.cwd(),
    cli: process.env.WECHAT_DEVTOOLS_CLI || "",
    open: false,
    preview: false,
    upload: false,
    buildNpm: false,
    autoPort: false,
    extra: [],
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else if (arg === "--open") {
      args.open = true;
    } else if (arg === "--preview") {
      args.preview = true;
    } else if (arg === "--upload") {
      args.upload = true;
    } else if (arg === "--build-npm") {
      args.buildNpm = true;
    } else if (arg === "--auto-port") {
      args.autoPort = true;
    } else if (arg === "--") {
      args.extra = argv.slice(i + 1);
      break;
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
  node devtools-cli.js --project <miniapp-root> [--open] [--preview] [--build-npm] [--auto-port] [--cli <path>] [-- <extra cli args>]

Environment:
  WECHAT_DEVTOOLS_CLI=/path/to/cli

Examples:
  node devtools-cli.js --project dist --open
  node devtools-cli.js --project dist --preview -- --compile-condition pathName=pages/index/index`);
}

function candidateCliPaths() {
  const candidates = [];
  if (process.env.WECHAT_DEVTOOLS_CLI) {
    candidates.push(process.env.WECHAT_DEVTOOLS_CLI);
  }

  if (process.platform === "win32") {
    const roots = [
      process.env.ProgramFiles,
      process.env["ProgramFiles(x86)"],
      process.env.LOCALAPPDATA,
    ].filter(Boolean);
    for (const root of roots) {
      candidates.push(path.join(root, "Tencent", "微信开发者工具", "cli.bat"));
      candidates.push(path.join(root, "Tencent", "WeChat DevTools", "cli.bat"));
      candidates.push(path.join(root, "微信web开发者工具", "cli.bat"));
      candidates.push(path.join(root, "微信开发者工具", "cli.bat"));
    }
  } else if (process.platform === "darwin") {
    candidates.push(
      "/Applications/wechatwebdevtools.app/Contents/MacOS/cli",
      "/Applications/微信开发者工具.app/Contents/MacOS/cli"
    );
  } else {
    candidates.push("cli");
  }

  return candidates;
}

function findCli(explicit) {
  const candidates = explicit ? [explicit] : candidateCliPaths();
  for (const candidate of candidates) {
    if (!candidate) continue;
    if (candidate === "cli" || fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error(
    [
      "Cannot find WeChat DevTools CLI.",
      "Set WECHAT_DEVTOOLS_CLI or pass --cli <path>.",
      "Also ensure DevTools service port/CLI automation is enabled in WeChat DevTools security settings when required.",
    ].join("\n")
  );
}

function run(cli, args) {
  console.log(`[wechat-miniapp-engineer] ${cli} ${args.join(" ")}`);
  const result = spawnSync(cli, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`DevTools CLI exited with ${result.status}`);
  }
}

function main() {
  const options = parseArgs(process.argv);
  if (options.help) {
    printHelp();
    return;
  }

  const project = path.resolve(options.project);
  if (!fs.existsSync(project)) {
    throw new Error(`Project path does not exist: ${project}`);
  }

  const cli = findCli(options.cli);
  const commands = [];

  if (!options.open && !options.preview && !options.upload && !options.buildNpm) {
    options.open = true;
  }

  if (options.open) commands.push(["--open", project]);
  if (options.buildNpm) commands.push(["--build-npm", "--project", project]);
  if (options.preview) commands.push(["--preview", project]);
  if (options.upload) commands.push(["--upload", project]);
  if (options.autoPort) commands.unshift(["--auto", project]);

  for (const command of commands) {
    run(cli, command.concat(options.extra));
  }
}

try {
  main();
} catch (error) {
  console.error("[wechat-miniapp-engineer] DevTools CLI failed");
  console.error(error && error.stack ? error.stack : error);
  process.exit(1);
}
