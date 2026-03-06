import {
  bootstrapMicrokernel,
  createConsoleLogger,
  createOpenClawAdapter,
} from "./src/framework/index";
import type { OpenClawLikeApi } from "./src/framework/openclaw/adapter";
import type { MyPluginConfig } from "./src/app/plugin-config";
import { registry } from "./src/generated/registry";

const plugin = {
  id: "my-plugin",
  name: "My Plugin",
  description: "A minimal custom plugin",
  version: "0.1.0",
  register(api: OpenClawLikeApi & {
    name: string;
    source: string;
    pluginConfig?: Record<string, unknown>;
    logger?: {
      info?: (message: string) => void;
    };
  }) {
    api.logger?.info?.(`${api.name} loaded from ${api.source}`);

    return bootstrapMicrokernel<MyPluginConfig>({
      appId: "my-plugin",
      config: (api.pluginConfig ?? {}) as MyPluginConfig,
      registry,
      host: createOpenClawAdapter(api, createConsoleLogger("my-plugin-host")),
      logger: createConsoleLogger("my-plugin"),
    });
  },
};

export default plugin;
