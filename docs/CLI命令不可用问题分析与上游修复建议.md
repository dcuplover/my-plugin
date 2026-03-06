# CLI 命令不可用问题分析与修复状态

> 更新时间：2026-03-06
> 适用项目：`my-plugin`
> 当前状态：该问题已随新版框架适配器同步修复，本文保留为历史记录和验收说明。

## 一、历史问题

旧版适配器曾错误地把 `registerCli` 当作 `commands` 数组收集器，导致框架内定义的 command 无法映射为真实的 CLI 命令。

## 二、当前实现

当前文件 `src/framework/openclaw/adapter.ts` 中，`registerCommand` 已改为直接桥接宿主的 Commander 风格 API：

```ts
registerCommand(command: HostCommandRegistration): void {
  api.registerCli(
    ({ program, logger: cliLogger }) => {
      program
        .command(command.name)
        .description(command.description)
        .action(async (...actionArgs: unknown[]) => {
          const normalizedArgs = normalizeCliArgs(actionArgs);
          const result = await command.execute(normalizedArgs);
          emitCommandResult(result, cliLogger ?? logger);
        });
    },
    { commands: [command.name] }
  );
}
```

这意味着：

1. 可以继续使用 `defineCommand(...)` 编写 CLI 命令。
2. 框架会负责把命令注册到 `program.command(...)`。
3. 命令返回值会通过 `emitCommandResult(...)` 输出到 CLI 日志。

## 三、当前项目中的验证链路

当前命令文件和注册链路如下：

1. `src/app/commands/hello.command.ts`
2. `src/generated/registry.ts`
3. `src/framework/core/kernel.ts`
4. `src/framework/openclaw/adapter.ts`

项目已经按这条链路接入新版框架，不再需要在 `src/app/index.ts` 中手写 `api.registerCli(...)` 作为绕行方案。

## 四、保留本文的原因

保留这份文档是为了说明：

1. 为什么仓库里会存在关于 CLI 注册失败的历史记录。
2. 新版框架修复了哪些关键点。
3. 后续排查时应优先检查是否仍在使用旧版适配器代码。

## 五、一句话结论

当前 `my-plugin` 已经可以按照新版框架的 `defineCommand -> registerCommand -> registerCli(({ program }) => ...)` 模型实现 CLI 命令。
