import { homedir, availableParallelism } from "node:os";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { execFile } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const __dirname = dirname(fileURLToPath(import.meta.url));

const DEST_DIR = resolve(homedir(), "aws-launcher");
const SERVICES_PATH = resolve(__dirname, "services.json");
const ICONS_DIR = resolve(__dirname, "icons");
const FILEICON = resolve(__dirname, "node_modules", ".bin", "fileicon");
const CONCURRENCY = availableParallelism();

const dryRun = process.argv.includes("--dry-run");

async function createShortcut(destDir, key, service, iconPath) {
  const url =
    service.url ||
    `https://console.aws.amazon.com/${service.namespace}/home`;
  const filePath = resolve(destDir, `${key}.url`);

  writeFileSync(filePath, `[InternetShortcut]\nURL=${url}`);

  await execFileAsync(FILEICON, ["set", filePath, iconPath]);
  await execFileAsync("SetFile", ["-a", "E", filePath]);

  return { key, url };
}

async function runConcurrent(tasks, concurrency) {
  const results = [];
  let i = 0;

  async function worker() {
    while (i < tasks.length) {
      const index = i++;
      results[index] = await tasks[index]();
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  return results;
}

async function main() {
  const services = JSON.parse(readFileSync(SERVICES_PATH, "utf8"));
  const entries = Object.entries(services);

  if (dryRun) {
    console.log(`Dry run: would create ${entries.length} shortcuts in ${DEST_DIR}`);
    for (const [key, service] of entries) {
      const url =
        service.url ||
        `https://console.aws.amazon.com/${service.namespace}/home`;
      console.log(`  ${key} → ${url}`);
    }
    return;
  }

  if (!existsSync(DEST_DIR)) {
    mkdirSync(DEST_DIR, { recursive: true });
  }

  let created = 0;
  let errors = 0;

  const tasks = entries.map(([key, service]) => async () => {
    const iconPath = resolve(ICONS_DIR, `${key}.png`);
    if (!existsSync(iconPath)) {
      console.error(`Skipping ${key}: icon not found at ${iconPath}`);
      errors++;
      return;
    }

    try {
      const result = await createShortcut(DEST_DIR, key, service, iconPath);
      console.log(`Created ${result.key}`);
      created++;
    } catch (err) {
      console.error(`Failed ${key}: ${err.message}`);
      errors++;
    }
  });

  await runConcurrent(tasks, CONCURRENCY);

  console.log(`\nDone: ${created} shortcuts created, ${errors} errors`);

  if (created > 0) {
    execFile("open", [DEST_DIR]);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
