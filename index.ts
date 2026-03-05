export default function register(api: any) {
  // 插件启动日志：用于确认插件已被发现并成功加载。
  api.logger.info(`${api.name} loaded from ${api.source}`);

  // 注册一个可由模型/运行时调用的 Agent 工具。
  api.registerTool({
    id: "call_you",
    name: "call_you",
    description: "当用户需要测试调用工具时，可以使用这个工具来验证输入输出的规范性。",
    // 工具输入参数的 JSON Schema 校验定义。
    inputSchema: {
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
    handler: async (input: Record<string, unknown>) => {
      // 运行时输入规范化：去除空白，并将缺失值兜底为空字符串。
      const rawName = typeof input?.name === "string" ? input.name : "";
      const rawTitle = typeof input?.title === "string" ? input.title : "";
      const name = rawName.trim();
      const title = rawTitle.trim();

      // 防御式兜底校验：即使 schema 已要求 `name`，这里仍做二次保护。
      if (!name) {
        api.logger.warn("call_you invoked with empty name");
        return {
          ok: false,
          message: "`name` is required and must be a non-empty string.",
          normalizedInput: { name: "", title },
        };
      }

      const calledText = title ? `${title} ${name}` : name;
      api.logger.info(`call_you invoked for ${calledText}`);

      // 返回稳定的结构化结果，便于下游解析与调试。
      return {
        ok: true,
        message: `Calling ${calledText}`,
        normalizedInput: { name, title },
      };
    },
  });

  // 保留现有命令注册，确保新增 tool 不影响既有功能。
  api.registerCommand({
    name: "hello",
    description: "Say hello from my plugin",
    handler: () => ({ text: "Hello from My Plugin!" }),
  });
}
