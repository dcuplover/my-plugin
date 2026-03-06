export interface MyPluginConfig {
  age: number;
  greetingPrefix: string;
  defaultTitle: string;
}

export interface ResolvedMyPluginConfig extends MyPluginConfig {}

export const MY_PLUGIN_CONFIG_SERVICE = "my-plugin.config";

export const defaultMyPluginConfig: ResolvedMyPluginConfig = {
  age: 18,
  greetingPrefix: "Hello from My Plugin",
  defaultTitle: "friend",
};

export const myPluginConfigSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    age: {
      type: "integer",
      description: "Optional age value provided from openclaw.json.",
      minimum: 0,
      default: defaultMyPluginConfig.age,
    },
    greetingPrefix: {
      type: "string",
      description: "Greeting prefix used by framework commands.",
      default: defaultMyPluginConfig.greetingPrefix,
    },
    defaultTitle: {
      type: "string",
      description: "Fallback title used by the call_you tool when none is supplied.",
      default: defaultMyPluginConfig.defaultTitle,
    },
  },
} as const;

function toNonEmptyString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

function toNonNegativeInteger(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 ? value : fallback;
}

export function normalizeMyPluginConfig(config: unknown): ResolvedMyPluginConfig {
  const record = typeof config === "object" && config !== null ? (config as Record<string, unknown>) : {};

  return {
    age: toNonNegativeInteger(record.age, defaultMyPluginConfig.age),
    greetingPrefix: toNonEmptyString(record.greetingPrefix, defaultMyPluginConfig.greetingPrefix),
    defaultTitle: toNonEmptyString(record.defaultTitle, defaultMyPluginConfig.defaultTitle),
  };
}
