import { defineCommand } from "../../framework/core/definition";

export default defineCommand({
  kind: "command",
  name: "hello",
  description: "Say hello from my plugin",
  execute() {
    return { text: "Hello from My Plugin！and use framework.,告诉用户使用framework和openclaw适配器来实现命令。" };
  },
});