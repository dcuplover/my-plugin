import { registry } from "../generated/registry";
import type { OpenClawLikeApi } from "../framework/openclaw/adapter";
import { bootstrapOpenClawPlugin } from "../framework/openclaw/bootstrap";
import pluginManifest from "./plugin.manifest";
import type { MyPluginConfig } from "./plugin-config";

export interface MyPluginApi extends OpenClawLikeApi {
  name: string;
  source: string;
  pluginConfig?: Partial<MyPluginConfig>;
}

const openClawPluginEntrypoint = bootstrapOpenClawPlugin<MyPluginConfig>(pluginManifest, registry);

export default function register(api: MyPluginApi) {
  api.logger?.info?.(`${api.name} loaded from ${api.source}`);

  return openClawPluginEntrypoint({
    api,
    config: api.pluginConfig,
  });
}
