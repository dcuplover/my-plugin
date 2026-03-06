import { definePlugin } from "../framework/plugin/manifest";
import type { MyPluginConfig } from "./plugin-config";

const configSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    age: {
      type: "integer",
      description: "Required age value provided from openclaw.json.",
      minimum: 0,
    },
  },
  required: ["age"],
} as const;

export default definePlugin<MyPluginConfig>({
  id: "my-plugin",
  name: "My Plugin",
  version: "0.1.0",
  description: "My custom OpenClaw test plugin",
  configSchema,
  openclaw: {
    runtime: "node",
    entry: "./app/index.js",
    displayName: "My Plugin",
  },
  app: {
    root: "src/app",
    registryPath: "src/generated/registry.ts",
  },
  package: {
    packageName: "my-plugin",
    private: true,
  },
  build: {
    entrySource: "src/app/index.ts",
    outputDir: "dist",
    registryOutput: "src/generated/registry.ts",
    packageJsonOutput: "dist/package.json",
    pluginManifestOutput: "dist/openclaw.plugin.json",
  },
});
