import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

export const ENTRY =
  "For $1 a ping, a lazy agent sits in your 4:59pm Friday deploy call, says 'looks fine to ship,' and logs off before the rollback.";

export const MAX_ENTRY_CHARS = 200;

const OUTPUT_FILE = join("output", "entry.txt");

type Rule = { name: string; problem: (text: string) => string | null };

const RULES: Rule[] = [
  {
    name: "not-blank",
    problem: (t) => (t.trim().length === 0 ? "entry is blank" : null),
  },
  {
    name: "max-length",
    problem: (t) =>
      t.length > MAX_ENTRY_CHARS
        ? `entry is ${t.length} characters, over the ${MAX_ENTRY_CHARS} limit`
        : null,
  },
  {
    name: "single-line",
    problem: (t) => (/[\r\n]/.test(t) ? "entry contains a newline" : null),
  },
  {
    name: "one-sentence",
    problem: (t) => {
      const periods = [...t].filter((c) => c === ".").length;
      if (periods === 1 && t.endsWith(".")) return null;
      return `entry must be exactly one sentence (one period, as the last character); found ${periods} period(s)`;
    },
  },
];

export function validateEntry(text: string): void {
  for (const rule of RULES) {
    const problem = rule.problem(text);
    if (problem !== null) throw new Error(`[${rule.name}] ${problem}`);
  }
}

export function writeEntryFile(path: string, text: string): number {
  validateEntry(text);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text, "utf8");
  // Read-back guard: the file on disk must be exactly the validated entry.
  const expected = Buffer.from(text, "utf8");
  if (!readFileSync(path).equals(expected)) {
    throw new Error(`[read-back] ${path} does not match the entry after writing`);
  }
  return expected.length;
}

/** Returns the message validateEntry throws, or null if the text is accepted. */
function rejection(text: string): string | null {
  try {
    validateEntry(text);
    return null;
  } catch (err) {
    return err instanceof Error ? err.message : String(err);
  }
}

function selfTest(): void {
  // [label, input, rule that must be the one to reject it]
  const mustReject: Array<[string, string, string]> = [
    ["empty string", "", "not-blank"],
    ["whitespace only", "  \t\n ", "not-blank"],
    ["201 characters", "a".repeat(MAX_ENTRY_CHARS) + ".", "max-length"],
    ["two sentences", "One. Two.", "one-sentence"],
    ["inner newline", "Line one\nline two.", "single-line"],
    ["trailing newline", ENTRY + "\n", "single-line"],
    ["carriage return", "Line one\rline two.", "single-line"],
    ["no period", "No terminal period here", "one-sentence"],
    ["period mid-text", "Ends fine. but not last", "one-sentence"],
  ];
  for (const [label, text, rule] of mustReject) {
    const message = rejection(text);
    if (message === null) throw new Error(`self-test: accepted bad input (${label})`);
    if (!message.startsWith(`[${rule}]`)) {
      throw new Error(`self-test: ${label} rejected by wrong rule: ${message}`);
    }
  }

  const boundary = "a".repeat(MAX_ENTRY_CHARS - 1) + ".";
  if (boundary.length !== MAX_ENTRY_CHARS) throw new Error("self-test: bad boundary fixture");
  validateEntry(boundary);
  validateEntry(ENTRY);

  const dir = mkdtempSync(join(tmpdir(), "pitch-selftest-"));
  try {
    const target = join(dir, "out", "entry.txt");
    const bytes = writeEntryFile(target, ENTRY);
    if (!readFileSync(target).equals(Buffer.from(ENTRY, "utf8"))) {
      throw new Error("self-test: round-trip bytes differ from entry");
    }
    console.log(
      `self-test ok: ${mustReject.length} rejections, ${MAX_ENTRY_CHARS}-char boundary accepted, ${bytes} bytes round-tripped identical`,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function run(): void {
  if (process.argv.includes("--self-test")) return selfTest();
  const bytes = writeEntryFile(OUTPUT_FILE, ENTRY);
  console.log(`wrote ${bytes} bytes (${ENTRY.length} chars) to ${OUTPUT_FILE}`);
}

try {
  run();
} catch (err) {
  console.error(`error: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
}
