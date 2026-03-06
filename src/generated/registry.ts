import type { DefinitionRegistry } from "../framework/core/types";
import type { MyPluginConfig } from "../app/plugin-config";

export const registry: DefinitionRegistry<MyPluginConfig> = {
  modules: [

  ],
  tools: [
    () => import("../app/tools/call-you.tool")
  ],
  hooks: [

  ],
  commands: [
    () => import("../app/commands/hello.command")
  ]
};
