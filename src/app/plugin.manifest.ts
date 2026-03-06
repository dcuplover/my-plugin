import { definePlugin } from "../framework/plugin/manifest";
import {
  DEFAULT_MY_PLUGIN_CONFIG,
  type MyPluginConfig,
} from "./plugin-config";

const configSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    age: {
      type: "integer",
      description: "Optional age value provided from openclaw.json.",
      minimum: 0,
      default: DEFAULT_MY_PLUGIN_CONFIG.age,
    },
    greetingPrefix: {
      type: "string",
      description: "Greeting prefix used by framework commands.",
      default: DEFAULT_MY_PLUGIN_CONFIG.greetingPrefix,
    },
    defaultTitle: {
      type: "string",
      description: "Fallback title used by the call_you tool when none is supplied.",
      default: DEFAULT_MY_PLUGIN_CONFIG.defaultTitle,
    },
  },
} as const;

export default definePlugin<MyPluginConfig>({
  id: "my-plugin",
  name: "My Plugin",
  version: "0.1.0",
  description: "Framework-backed OpenClaw plugin sample",
  configSchema,
  openclaw: {
    runtime: "node",
    entry: "./app/index.js",
    displayName: "My Plugin",
  },
  app: {
    root: "src/app",
    registryPath: "src/generated/registry.ts",
    defaultConfig: DEFAULT_MY_PLUGIN_CONFIG,
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
