# My Plugin

A minimal OpenClaw test plugin rebuilt on top of the latest `openclaw-plugin-famework` scaffold.

## Included features

- `call_you` tool
- `hello` CLI command
- `runtime-module` bootstrap module for normalized plugin config

## Config fields

The generated plugin manifest exposes these config keys:

- `age`
- `greetingPrefix`
- `defaultTitle`

## Build

```bash
npm install
npm run build
```

Build output is staged under `artifacts/my-plugin/`.
Use that directory as the plugin root for OpenClaw loading.

## Test

```bash
npm test
```

## Source layout

```text
src/
  app/
    commands/
    modules/
    tools/
    index.ts
    plugin-config.ts
    plugin.manifest.ts
  framework/
  generated/
```
