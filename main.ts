import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

/**
 * v3 entry — "CertNinja".
 *
 * A lazy agent that earns its keep by doing exactly one job, once a year,
 * at the hour nobody else wants: it logs in at 1:47am on Christmas Eve,
 * renews the one TLS certificate the whole team forgot, and emails "done"
 * before DevOps wakes up. Named service, fixed price, named moment, real
 * outcome (no outage), one login and one email of work. Chosen over v2
 * ("Looks Fine to Ship", R2 203/2461, 58.76%) in two glm-5.3-flash duels:
 * CertNinja beat v2 2-0 (margin 3+3) and beat the runner-up PagerWhisperer
 * 2-0 (margin 3+3); TicketGraveyard split 1-1 with v2 and was dropped.
 */
export const ENTRY =
  "For 75 cents a cert, CertNinja logs in at 1:47am on Christmas Eve, renews the TLS certificate everyone forgot, and emails 'done' before DevOps wakes up.";

export const MAX_CHARS = 200;

const OUT_PATH = join("output", "entry.txt");

/** One validation check: returns an error string, or null when the text passes. */
type Check = (text: string) => string | null;

function checkNotBlank(text: string): string | null {
  return text.trim().length === 0 ? "entry is blank or whitespace only" : null;
}

function checkLength(text: string): string | null {
  // No minimum branch: a too-short entry is already caught by checkNotBlank,
  // which runs first, so length only enforces the hard 200-character gate.
  if (text.length > MAX_CHARS) return `entry is ${text.length} characters, over the ${MAX_CHARS} limit`;
  return null;
}

function checkSingleLine(text: string): string | null {
  return /[\r\n]/.test(text) ? "entry must be a single line (no newline or carriage return)" : null;
}

function checkOneSentence(text: string): string | null {
  let periods = 0;
  for (const ch of text) if (ch === ".") periods += 1;
  if (periods !== 1) return `entry must be exactly one sentence; found ${periods} period(s)`;
  if (!text.endsWith(".")) return "entry must end with its single period";
  return null;
}

/** Checks run in this order; the first failure decides, like the judge's criteria. */
const CHECKS: Array<{ name: string; run: Check }> = [
  { name: "not-blank", run: checkNotBlank },
  { name: "length", run: checkLength },
  { name: "single-line", run: checkSingleLine },
  { name: "one-sentence", run: checkOneSentence },
];

export function validateEntry(text: string): void {
  for (const { name, run } of CHECKS) {
    const problem = run(text);
    if (problem !== null) throw new Error(`[${name}] ${problem}`);
  }
}

/** Writes the entry with no trailing newline and proves the bytes round-trip. */
export function writeEntry(path: string, text: string): number {
  validateEntry(text);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text, "utf8");
  const written = readFileSync(path);
  const expected = Buffer.from(text, "utf8");
  if (!written.equals(expected)) {
    throw new Error(`[read-back] ${path} differs from the entry after writing`);
  }
  return expected.length;
}

function rejection(text: string): string | null {
  try {
    validateEntry(text);
    return null;
  } catch (err) {
    return err instanceof Error ? err.message : String(err);
  }
}

function selfTest(): void {
  const badCases: Array<{ label: string; input: string; rule: string }> = [
    { label: "empty", input: "", rule: "not-blank" },
    { label: "spaces only", input: "   ", rule: "not-blank" },
    { label: "201 chars", input: "x".repeat(199) + "yy.", rule: "length" },
    { label: "embedded newline", input: "First line\nsecond line.", rule: "single-line" },
    { label: "trailing newline", input: ENTRY + "\n", rule: "single-line" },
    { label: "two sentences", input: "One thing. Two things.", rule: "one-sentence" },
    { label: "no final period", input: "A pitch with no ending", rule: "one-sentence" },
    { label: "period in the middle", input: "Stops early. then keeps going", rule: "one-sentence" },
  ];
  for (const { label, input, rule } of badCases) {
    const message = rejection(input);
    if (message === null) throw new Error(`self-test: ${label} was accepted, expected [${rule}]`);
    if (!message.startsWith(`[${rule}]`)) {
      throw new Error(`self-test: ${label} rejected by the wrong check: ${message}`);
    }
  }

  // Boundary: exactly 200 characters is valid; the real entry must pass too.
  const atLimit = "y".repeat(MAX_CHARS - 1) + ".";
  if (atLimit.length !== MAX_CHARS) throw new Error("self-test: boundary fixture is not 200 chars");
  validateEntry(atLimit);
  validateEntry(ENTRY);

  const workDir = mkdtempSync(join(tmpdir(), "certninja-selftest-"));
  try {
    const target = join(workDir, "nested", "entry.txt");
    const bytes = writeEntry(target, ENTRY);
    const back = readFileSync(target, "utf8");
    if (back !== ENTRY) throw new Error("self-test: round-trip text differs from ENTRY");
    if (!existsSync(target)) throw new Error("self-test: output file missing after write");
    console.log(
      `self-test ok: ${badCases.length} rejections by the right check, 200-char boundary accepted, ${bytes} bytes round-tripped identical`,
    );
  } finally {
    rmSync(workDir, { recursive: true, force: true });
  }
}

function main(): void {
  if (process.argv.includes("--self-test")) {
    selfTest();
    return;
  }
  const bytes = writeEntry(OUT_PATH, ENTRY);
  console.log(`wrote ${bytes} bytes (${ENTRY.length} chars) to ${OUT_PATH}`);
}

try {
  main();
} catch (err) {
  console.error(`error: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
}
