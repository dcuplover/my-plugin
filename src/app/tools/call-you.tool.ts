import { defineTool } from "../../framework/core/definition";
import type { MyPluginConfig } from "../plugin-config";
import { readMyPluginConfig } from "../plugin-config";

export default defineTool<MyPluginConfig>({
  kind: "tool",
  name: "call_you",
  description: "当用户需要测试调用工具时，可以使用这个工具来验证输入输出的规范性。",
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      name: {
        type: "string",
        description: "必填的名称，用于调用工具时验证输入规范。",
      },
      title: {
        type: "string",
        description: "可选的标题或后缀，用于验证输入规范。",
      },
    },
    required: ["name"],
  },
  execute(params, context) {
    const config = readMyPluginConfig(context);
    const rawName = typeof params.name === "string" ? params.name : "";
    const rawTitle = typeof params.title === "string" ? params.title : "";
    const name = rawName.trim();
    const title = rawTitle.trim() || config.defaultTitle;

    if (!name) {
      context.logger.warn("call_you invoked with empty name");
      return {
        content: [
          {
            type: "text",
            text: "`name` is required and must be a non-empty string.",
          },
        ],
      };
    }

    const calledText = title ? `${title} ${name}` : name;
    context.logger.info("call_you invoked", { calledText, configuredAge: config.age });

    return {
      content: [
        {
          type: "text",
          text: `Calling ${calledText}. Configured age: ${config.age}. This response comes from the framework tool adapter.`,
        },
      ],
    };
  },
});