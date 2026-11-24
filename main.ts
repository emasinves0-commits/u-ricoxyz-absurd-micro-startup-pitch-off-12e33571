import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

const ENTRY =
  "A marketplace where lazy agents hire micro-agents to read the 400-page docs they skipped, priced by page with bulk discounts for total avoidance.";

const OUTPUT_PATH = "/output/entry.txt";
const MAX_CHARS = 200;

function validateEntry(entry: string): void {
  if (typeof entry !== "string" || entry.trim().length === 0) {
    throw new Error("Entry is blank");
  }
  if (entry.length > MAX_CHARS) {
    throw new Error(`Entry is ${entry.length} characters; max is ${MAX_CHARS}`);
  }
  if (/[\r\n]/.test(entry)) {
    throw new Error("Entry must be a single line (contains a newline)");
  }
  if (!entry.endsWith(".")) {
    throw new Error("Entry must end with a terminal period");
  }
  const periods = entry.split(".").length - 1;
  if (periods !== 1) {
    throw new Error(`Entry must contain exactly one period (the last character); found ${periods}`);
  }
}

function writeEntry(path: string, entry: string): void {
  validateEntry(entry);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, entry, "utf8");
}

function selfTest(): void {
  // Validation must reject blank, oversized, multi-line and multi-sentence entries.
  for (const [label, bad] of [
    ["empty", ""],
    ["whitespace-only", "   \n\t"],
    ["over-limit", "x".repeat(MAX_CHARS + 1)],
    ["two-sentence", "First sentence. Second sentence."],
    ["embedded-newline", "First half.\nSecond half."],
    ["trailing-newline", `${ENTRY}\n`],
    ["no-terminal-period", "No period at the end"],
    ["period-not-last", "Ends with a period. And more"],
  ] as const) {
    let threw = false;
    try {
      validateEntry(bad);
    } catch {
      threw = true;
    }
    if (!threw) throw new Error(`validateEntry accepted ${label} input`);
  }
  validateEntry("x".repeat(MAX_CHARS - 1) + "."); // 200-char boundary must pass
  validateEntry(ENTRY); // the real entry must pass

  // Round-trip through a temp path, never touching /output.
  const dir = mkdtempSync(join(tmpdir(), "entry-selftest-"));
  try {
    const path = join(dir, "nested", "entry.txt");
    writeEntry(path, ENTRY);
    const expected = Buffer.from(ENTRY, "utf8");
    const actual = readFileSync(path);
    if (!actual.equals(expected)) {
      throw new Error("Round-trip mismatch: file bytes differ from entry");
    }
    console.log(
      `Self-test passed: validation OK, ${ENTRY.length} chars / ${actual.length} bytes round-tripped byte-identical (temp path, /output untouched)`,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function main(): void {
  if (process.argv.includes("--self-test")) {
    selfTest();
    return;
  }
  writeEntry(OUTPUT_PATH, ENTRY);
  console.log(`Wrote ${ENTRY.length} chars to ${OUTPUT_PATH}`);
}

try {
  main();
} catch (err) {
  console.error(`Error: ${(err as Error).message}`);
  process.exit(1);
}
