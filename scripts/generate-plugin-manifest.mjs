import path from "node:path";
import { pathToFileURL } from "node:url";
import { promises as fs } from "node:fs";

function unwrapDefaultExport(moduleNamespace) {
  if (moduleNamespace && typeof moduleNamespace === "object" && "default" in moduleNamespace) {
    const candidate = moduleNamespace.default;
    if (candidate && typeof candidate === "object" && "default" in candidate) {
      return candidate.default;
    }
    return candidate;
  }

  return moduleNamespace;
}

function unwrapModuleExports(moduleNamespace) {
  if (moduleNamespace && typeof moduleNamespace === "object" && "default" in moduleNamespace) {
    const candidate = moduleNamespace.default;
    if (candidate && typeof candidate === "object") {
      return candidate;
    }
  }

  return moduleNamespace;
}

const [, , manifestModuleArg, outputArg] = process.argv;

if (!manifestModuleArg) {
  console.error("Usage: node generate-plugin-manifest.mjs <compiled-manifest-module> [output-file]");
  process.exit(1);
}

const cwd = process.cwd();
const manifestModulePath = path.resolve(cwd, manifestModuleArg);
const frameworkModulePath = path.resolve(cwd, "./dist/index.js");
const manifestModule = await import(pathToFileURL(manifestModulePath).href);
const frameworkModule = await import(pathToFileURL(frameworkModulePath).href);
const pluginManifest = unwrapDefaultExport(manifestModule);
const frameworkExports = unwrapModuleExports(frameworkModule);
const toOpenClawPluginJson = frameworkExports.toOpenClawPluginJson;

if (!pluginManifest || typeof pluginManifest !== "object") {
  throw new Error(`Compiled module does not export a default plugin manifest: ${manifestModulePath}`);
}

if (typeof toOpenClawPluginJson !== "function") {
  throw new Error(`Compiled framework does not export toOpenClawPluginJson(): ${frameworkModulePath}`);
}

const resolvedOutput = outputArg
  ? path.resolve(cwd, outputArg)
  : path.resolve(cwd, pluginManifest.build?.pluginManifestOutput ?? "openclaw.plugin.json");
const openClawPluginJson = toOpenClawPluginJson(pluginManifest);

await fs.mkdir(path.dirname(resolvedOutput), { recursive: true });
await fs.writeFile(resolvedOutput, `${JSON.stringify(openClawPluginJson, null, 2)}\n`, "utf8");

console.log(`Generated OpenClaw plugin manifest at ${resolvedOutput}`);
