import { definePlugin } from "../framework/plugin/manifest";

export interface ExampleAppConfig {
  environment: string;
  greetingPrefix: string;
}

const configSchema = {
  type: "object",
  properties: {
    environment: { type: "string" },
    greetingPrefix: { type: "string" },
  },
  required: ["environment", "greetingPrefix"],
  additionalProperties: false,
} as const;

export default definePlugin<ExampleAppConfig>({
  id: "my-plugin",
  name: "@dcuplover/my-plugin",
  version: "0.1.0",
  description: "是一个测试用的插件",
  configSchema,
  app: {
    root: "src/app",
    registryPath: "src/generated/registry.ts",
    defaultConfig: {
      environment: "local-prototype",
      greetingPrefix: "Architect-grade hello",
    },
  },
  package: {
    packageName: "@dcuplover/my-plugin",
    private: true,
  },
  build: {
    entrySource: "src/app/index.ts",
    artifactEntry: "./index.js",
    outputDir: "artifacts",
    registryOutput: "src/generated/registry.ts",
  },
});
