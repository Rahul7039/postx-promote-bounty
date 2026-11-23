import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const botDir: string = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir: string = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const sourcePath: string = join(botDir, "POST.json");
const destPath: string = join(outputDir, "POST.json");

if (!existsSync(sourcePath)) {
  console.error(`Error: POST.json not found in bot directory: ${sourcePath}`);
  process.exit(1);
}

try {
  mkdirSync(outputDir, { recursive: true });
  copyFileSync(sourcePath, destPath);
} catch (err) {
  console.error(
    `Error: failed to copy POST.json from ${sourcePath} to ${destPath}: ${
      err instanceof Error ? err.message : String(err)
    }`,
  );
  process.exit(1);
}

// Verify the copied file: it must parse as JSON with a non-empty url string.
try {
  const parsed: unknown = JSON.parse(readFileSync(destPath, "utf8"));
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    typeof (parsed as { url?: unknown }).url !== "string" ||
    (parsed as { url: string }).url.length === 0
  ) {
    console.error(
      `Error: copied POST.json at ${destPath} does not contain a valid url string`,
    );
    process.exit(1);
  }
} catch (err) {
  console.error(
    `Error: copied POST.json at ${destPath} is not valid JSON: ${
      err instanceof Error ? err.message : String(err)
    }`,
  );
  process.exit(1);
}

console.log(`Copied POST.json from ${sourcePath} to ${destPath}`);
