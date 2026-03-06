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

const [, , manifestModuleArg, packageJsonArg] = process.argv;

if (!manifestModuleArg) {
  console.error("Usage: node sync-package-json.mjs <compiled-manifest-module> [package-json-file]");
  process.exit(1);
}

const cwd = process.cwd();
const manifestModulePath = path.resolve(cwd, manifestModuleArg);
const packageJsonPath = packageJsonArg ? path.resolve(cwd, packageJsonArg) : undefined;

const manifestModule = await import(pathToFileURL(manifestModulePath).href);
const frameworkModule = await import(pathToFileURL(path.resolve(cwd, "./dist/index.js")).href);
const pluginManifest = unwrapDefaultExport(manifestModule);
const frameworkExports = unwrapModuleExports(frameworkModule);
const toPackageJsonFields = frameworkExports.toPackageJsonFields;

if (!pluginManifest || typeof pluginManifest !== "object") {
  throw new Error(`Compiled module does not export a default plugin manifest: ${manifestModulePath}`);
}

if (typeof toPackageJsonFields !== "function") {
  throw new Error("Compiled framework does not export toPackageJsonFields(). Check dist/index.js");
}

const nextFields = toPackageJsonFields(pluginManifest);
const resolvedPackageJsonPath =
  packageJsonPath ?? path.resolve(cwd, pluginManifest.build?.packageJsonOutput ?? "./package.json");

let existingPackageJson = {};
try {
  existingPackageJson = JSON.parse(await fs.readFile(resolvedPackageJsonPath, "utf8"));
} catch (error) {
  if (!(error && typeof error === "object" && "code" in error && error.code === "ENOENT")) {
    throw error;
  }
}

const mergedPackageJson = {
  ...existingPackageJson,
  ...nextFields,
};

await fs.mkdir(path.dirname(resolvedPackageJsonPath), { recursive: true });
await fs.writeFile(resolvedPackageJsonPath, `${JSON.stringify(mergedPackageJson, null, 2)}\n`, "utf8");
console.log(`Synchronized package.json from plugin manifest at ${resolvedPackageJsonPath}`);
