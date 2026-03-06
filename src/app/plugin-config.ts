import type { ServiceContainer } from "../framework/core/types";

export interface MyPluginConfig {
  age?: number;
  greetingPrefix?: string;
  defaultTitle?: string;
}

export interface ResolvedMyPluginConfig {
  age: number;
  greetingPrefix: string;
  defaultTitle: string;
}

export const MY_PLUGIN_CONFIG_SERVICE = "my-plugin.config";

export const DEFAULT_MY_PLUGIN_CONFIG: ResolvedMyPluginConfig = {
  age: 18,
  greetingPrefix: "Hello from My Plugin",
  defaultTitle: "friend",
};

function normalizeNonNegativeInteger(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 ? value : fallback;
}

function normalizeText(value: unknown, fallback: string): string {
  if (typeof value !== "string") {
    return fallback;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : fallback;
}

export function normalizeMyPluginConfig(
  config?: Partial<MyPluginConfig>
): ResolvedMyPluginConfig {
  return {
    age: normalizeNonNegativeInteger(config?.age, DEFAULT_MY_PLUGIN_CONFIG.age),
    greetingPrefix: normalizeText(
      config?.greetingPrefix,
      DEFAULT_MY_PLUGIN_CONFIG.greetingPrefix
    ),
    defaultTitle: normalizeText(config?.defaultTitle, DEFAULT_MY_PLUGIN_CONFIG.defaultTitle),
  };
}

export function storeMyPluginConfig(
  container: ServiceContainer,
  config?: Partial<MyPluginConfig>
): ResolvedMyPluginConfig {
  const normalized = normalizeMyPluginConfig(config);
  container.register(MY_PLUGIN_CONFIG_SERVICE, normalized);
  return normalized;
}

export function readMyPluginConfig(source: {
  config?: Partial<MyPluginConfig>;
  container: ServiceContainer;
}): ResolvedMyPluginConfig {
  const cached = source.container.tryResolve<ResolvedMyPluginConfig>(MY_PLUGIN_CONFIG_SERVICE);
  if (cached) {
    return cached;
  }

  return storeMyPluginConfig(source.container, source.config);
}