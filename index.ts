export default function register(api) {
  api.logger.info(`${api.name} loaded from ${api.source}`);

  api.registerCommand({
    name: "hello",
    description: "Say hello from my plugin",
    handler: () => ({ text: "Hello from My Plugin!" }),
  });
}
