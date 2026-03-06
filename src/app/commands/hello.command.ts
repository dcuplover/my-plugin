import { defineCommand } from "../../framework/core/definition";
import type { MyPluginConfig } from "../plugin-config";
import { readMyPluginConfig } from "../plugin-config";

export default defineCommand<MyPluginConfig>({
  kind: "command",
  name: "hello",
  description: "Print a greeting from the framework-backed plugin",
  execute(args, context) {
    const config = readMyPluginConfig(context);
    const target = args.map((arg) => arg.trim()).find((arg) => arg.length > 0) ?? "OpenClaw";

    context.logger.info("hello command invoked", {
      target,
      argsCount: args.length,
    });

    return {
      content: [
        {
          type: "text",
          text: `${config.greetingPrefix}, ${target}. This command is registered through the framework adapter.`,
        },
      ],
    };
  },
});