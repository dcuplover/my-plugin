import { defineModule } from "../../framework/core/definition";
import type { MyPluginConfig } from "../plugin-config";
import {
  MY_PLUGIN_CONFIG_SERVICE,
  storeMyPluginConfig,
  type ResolvedMyPluginConfig,
} from "../plugin-config";

export interface MyPluginRuntimeState {
  bootedAt: string;
  config: ResolvedMyPluginConfig;
}

export const MY_PLUGIN_RUNTIME_SERVICE = "my-plugin.runtime";

export default defineModule<MyPluginConfig>({
  kind: "module",
  name: "runtime-module",
  description: "Prepare shared services for commands and tools.",
  phase: "bootstrap",
  provides: [MY_PLUGIN_CONFIG_SERVICE, MY_PLUGIN_RUNTIME_SERVICE],
  setup(context) {
    const config = storeMyPluginConfig(context.container, context.config);
    const runtimeState: MyPluginRuntimeState = {
      bootedAt: new Date().toISOString(),
      config,
    };

    context.container.register(MY_PLUGIN_RUNTIME_SERVICE, runtimeState);
    context.logger.info("Prepared plugin runtime module", {
      age: config.age,
      greetingPrefix: config.greetingPrefix,
      defaultTitle: config.defaultTitle,
    });
  },
  start(context) {
    const runtimeState = context.container.resolve<MyPluginRuntimeState>(MY_PLUGIN_RUNTIME_SERVICE);
    context.logger.info("Started plugin runtime module", {
      bootedAt: runtimeState.bootedAt,
    });
  },
  shutdown(context) {
    context.logger.info("Stopped plugin runtime module", { module: "runtime-module" });
  },
});
