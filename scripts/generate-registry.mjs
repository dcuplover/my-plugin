import { promises as fs } from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const appDir = path.join(rootDir, "src", "app");
const generatedDir = path.join(rootDir, "src", "generated");
const registryFile = path.join(generatedDir, "registry.ts");

const sections = [
  { key: "modules", dir: "modules", suffix: ".module.ts" },
  { key: "tools", dir: "tools", suffix: ".tool.ts" },
  { key: "hooks", dir: "hooks", suffix: ".hook.ts" },
  { key: "commands", dir: "commands", suffix: ".command.ts" },
];

async function listMatchingFiles(dirPath, suffix) {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(suffix))
      .map((entry) => entry.name)
      .sort((left, right) => left.localeCompare(right));
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

function renderImport(sectionDir, fileName) {
  const baseName = fileName.replace(/\.ts$/, "");
  return `() => import("../app/${sectionDir}/${baseName}")`;
}

async function main() {
  await fs.mkdir(generatedDir, { recursive: true });

  const renderedSections = await Promise.all(
    sections.map(async (section) => {
      const files = await listMatchingFiles(path.join(appDir, section.dir), section.suffix);
      const imports = files.map((fileName) => `    ${renderImport(section.dir, fileName)}`);
      return `  ${section.key}: [\n${imports.join(",\n")}\n  ]`;
    })
  );

  const content = `import type { DefinitionRegistry } from "../framework/core/types";
import type { MyPluginConfig } from "../app/plugin-config";

export const registry: DefinitionRegistry<MyPluginConfig> = {
${renderedSections.join(",\n")}
};
`;

  await fs.writeFile(registryFile, content, "utf8");
  console.log(`Generated ${path.relative(rootDir, registryFile)}`);
}

main().catch((error) => {
  console.error("Failed to generate registry", error);
  process.exitCode = 1;
});