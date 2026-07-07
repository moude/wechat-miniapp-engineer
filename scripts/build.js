#!/usr/bin/env node
/*
 * Compile a WeChat Mini Program with miniprogram-ci when available.
 * The script intentionally resolves dependencies from the target project first
 * so this skill can be synced across machines without vendoring node_modules.
 */

const fs = require("fs");
const path = require("path");
const { createRequire } = require("module");

function parseArgs(argv) {
  const args = {
    project: process.cwd(),
    privateKeyPath: process.env.WECHAT_PRIVATE_KEY_PATH || "",
    appid: process.env.WECHAT_APPID || "",
    type: "miniProgram",
    output: "",
    quiet: false,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else if (arg === "--quiet") {
      args.quiet = true;
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
  node build.js --project <miniapp-root> [--appid <appid>] [--privateKeyPath <key>] [--output <dir>]

Environment fallbacks:
  WECHAT_APPID
  WECHAT_PRIVATE_KEY_PATH

Notes:
  - Installs nothing. Add miniprogram-ci to the target project or provide it in NODE_PATH.
  - Uses compile/build APIs only; upload/preview should be explicit release steps.`);
}

function findProjectConfig(projectPath) {
  const configPath = path.join(projectPath, "project.config.json");
  if (!fs.existsSync(configPath)) {
    throw new Error(`project.config.json not found at ${configPath}`);
  }
  return JSON.parse(fs.readFileSync(configPath, "utf8"));
}

function resolveDependency(projectPath, name) {
  const localRequire = createRequire(path.join(projectPath, "package.json"));
  try {
    return localRequire(name);
  } catch (localError) {
    try {
      return require(name);
    } catch (globalError) {
      const msg = [
        `Cannot resolve ${name}.`,
        `Install it in the target project: npm i -D ${name}`,
        `Project: ${projectPath}`,
      ].join("\n");
      const err = new Error(msg);
      err.cause = localError;
      throw err;
    }
  }
}

function createProject(ci, options, projectConfig) {
  const appid = options.appid || projectConfig.appid;
  if (!appid) {
    throw new Error("Missing appid. Set project.config.json appid, --appid, or WECHAT_APPID.");
  }

  const projectOptions = {
    appid,
    type: options.type,
    projectPath: options.project,
    ignores: ["node_modules/**/*"],
  };

  if (options.privateKeyPath) {
    projectOptions.privateKeyPath = options.privateKeyPath;
  }

  return new ci.Project(projectOptions);
}

async function tryCompile(ci, project, options) {
  if (typeof ci.compile === "function") {
    return ci.compile({
      project,
      desc: "wechat-miniapp-engineer compile",
      setting: {},
      onProgressUpdate: options.quiet ? undefined : console.log,
    });
  }

  if (typeof ci.getCompiledResult === "function") {
    return ci.getCompiledResult({
      project,
      compileType: "miniprogram",
    });
  }

  if (typeof ci.preview === "function") {
    const qrcodeFormat = options.output ? "image" : "terminal";
    const qrcodeOutputDest = options.output
      ? path.join(options.output, "preview-qrcode.jpg")
      : undefined;
    return ci.preview({
      project,
      desc: "wechat-miniapp-engineer preview compile check",
      qrcodeFormat,
      qrcodeOutputDest,
      setting: {},
      onProgressUpdate: options.quiet ? undefined : console.log,
    });
  }

  throw new Error(
    "Loaded miniprogram-ci but found no supported compile/getCompiledResult/preview API."
  );
}

async function main() {
  const options = parseArgs(process.argv);
  if (options.help) {
    printHelp();
    return;
  }

  options.project = path.resolve(options.project);
  if (options.privateKeyPath) {
    options.privateKeyPath = path.resolve(options.privateKeyPath);
  }
  if (options.output) {
    options.output = path.resolve(options.output);
    fs.mkdirSync(options.output, { recursive: true });
  }

  const projectConfig = findProjectConfig(options.project);
  const ci = resolveDependency(options.project, "miniprogram-ci");
  const project = createProject(ci, options, projectConfig);
  const start = Date.now();
  const result = await tryCompile(ci, project, options);
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);

  console.log(`[wechat-miniapp-engineer] compile finished in ${elapsed}s`);
  if (result && !options.quiet) {
    const printable =
      typeof result === "string" ? result : JSON.stringify(result, null, 2);
    console.log(printable.slice(0, 4000));
  }
}

main().catch((error) => {
  console.error("[wechat-miniapp-engineer] build failed");
  console.error(error && error.stack ? error.stack : error);
  process.exit(1);
});
