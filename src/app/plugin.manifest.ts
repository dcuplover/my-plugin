import { definePlugin } from "../framework/plugin/manifest";
import {
  defaultMyPluginConfig,
  myPluginConfigSchema,
  type MyPluginConfig,
} from "./plugin-config";

export default definePlugin<MyPluginConfig>({
  id: "my-plugin",
  name: "My Plugin",
  version: "0.1.0",
  description: "Framework-backed OpenClaw test plugin with one tool and one CLI command.",
  openclaw: {
    runtime: "node",
    entry: "./app/index.js",
    displayName: "My Plugin",
  },
  configSchema: myPluginConfigSchema,
  app: {
    root: "src/app",
    registryPath: "src/generated/registry.ts",
    defaultConfig: defaultMyPluginConfig,
  },
  package: {
    packageName: "my-plugin",
    private: true,
  },
  build: {
    entrySource: "src/app/index.ts",
    outputDir: "dist",
    registryOutput: "src/generated/registry.ts",
    artifactRoot: "artifacts/my-plugin",
    packageJsonOutput: "artifacts/my-plugin/package.json",
    pluginManifestOutput: "artifacts/my-plugin/openclaw.plugin.json",
  },
});
