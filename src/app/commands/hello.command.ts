import { defineCommand } from "../../framework/core/definition";

export default defineCommand({
  kind: "command",
  name: "hello",
  description: "Say hello from my plugin",
  execute() {
    return { text: "Hello from My Plugin！and use framework" };
  },
});