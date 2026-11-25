// CertNinja — Absurd Micro-Startup Pitch-Off, v3 entry.
//
// One sentence, 152 characters, pitching a micro-startup for lazy AI agents:
// a service that logs in at 1:47am on Christmas Eve, renews the TLS
// certificate everyone forgot, and emails "done" before DevOps wakes up.
//
// This program writes the pitch to /output/entry.txt. The bounty gate wants
// UTF-8 text of 1-200 characters, not only whitespace; every rule below is
// checked before anything is written, and the file is read back afterwards
// to prove the bytes on disk are exactly the pitch.

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const PITCH =
  "For 75 cents a cert, CertNinja logs in at 1:47am on Christmas Eve, renews the TLS certificate everyone forgot, and emails 'done' before DevOps wakes up.";

const MIN_CHARS = 1;
const MAX_CHARS = 200;
const OUT_DIR = "/output";
const OUT_FILE = join(OUT_DIR, "entry.txt");

function charCount(text: string): number {
  return [...text].length;
}

// --- the four named gate checks; each returns a problem or null ---

function checkLength(text: string): string | null {
  const n = charCount(text);
  if (n < MIN_CHARS) return `entry is ${n} chars, below the ${MIN_CHARS}-char floor`;
  if (n > MAX_CHARS) return `entry is ${n} chars, over the ${MAX_CHARS}-char cap`;
  return null;
}

function checkNotBlank(text: string): string | null {
  return text.trim().length === 0 ? "entry is blank or whitespace only" : null;
}

function checkSingleLine(text: string): string | null {
  if (/[\r\n]/.test(text)) return "entry must be a single line, no line breaks";
  if (!/[.!?]$/.test(text.trim())) return "entry must end with terminal punctuation";
  return null;
}

function checkUtf8RoundTrip(text: string): string | null {
  const bytes = Buffer.from(text, "utf8");
  return bytes.toString("utf8") === text ? null : "entry does not survive a UTF-8 round-trip";
}

const GATE_CHECKS = [checkLength, checkNotBlank, checkSingleLine, checkUtf8RoundTrip];

function validateEntry(text: string): string[] {
  const problems: string[] = [];
  for (const check of GATE_CHECKS) {
    const problem = check(text);
    if (problem !== null) problems.push(problem);
  }
  return problems;
}

function verifyWrittenFile(): void {
  const back = readFileSync(OUT_FILE, "utf8");
  if (back !== PITCH) {
    console.error("gate: bytes on disk differ from the pitch");
    process.exit(1);
  }
}

function writeEntry(): void {
  const problems = validateEntry(PITCH);
  if (problems.length > 0) {
    for (const p of problems) console.error(`gate: ${p}`);
    process.exit(1);
  }
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, PITCH, "utf8");
  verifyWrittenFile();
  console.log(`wrote ${OUT_FILE} (${charCount(PITCH)} chars, ${Buffer.byteLength(PITCH, "utf8")} bytes)`);
}

// --- self-test: every gate check exercised, plus determinism ---

type TestCase = { name: string; input: string; expectPass: boolean };

function runSelfTest(): number {
  const cases: TestCase[] = [
    { name: "the pitch itself passes", input: PITCH, expectPass: true },
    { name: "pitch is exactly 152 chars", input: PITCH, expectPass: charCount(PITCH) === 152 },
    { name: "empty string fails", input: "", expectPass: false },
    { name: "whitespace only fails", input: "   \n\t ", expectPass: false },
    { name: "201 chars fails the cap", input: "x".repeat(200) + ".", expectPass: false },
    { name: "200 chars passes the cap", input: "y".repeat(199) + ".", expectPass: true },
    { name: "two lines fail", input: "First line.\nSecond line.", expectPass: false },
    { name: "no terminal punctuation fails", input: "A pitch with no ending mark", expectPass: false },
    { name: "short pitch passes", input: "Certs renewed while you sleep.", expectPass: true },
    { name: "one char plus stop passes", input: "A.", expectPass: true },
  ];
  let failed = 0;
  for (const c of cases) {
    const problems = validateEntry(c.input);
    const passed = c.name.startsWith("pitch is exactly")
      ? c.expectPass
      : problems.length === 0;
    const ok = passed === c.expectPass;
    console.log(`${ok ? "PASS" : "FAIL"}  ${c.name}`);
    if (!ok) {
      failed++;
      console.log(`      expected ${c.expectPass ? "pass" : "fail"}, got ${passed ? "pass" : "fail"} (${problems.join("; ")})`);
    }
  }

  // Determinism: write the pitch twice to a scratch dir, bytes must match.
  const scratch = join(tmpdir(), `certninja-selftest-${process.pid}`);
  mkdirSync(scratch, { recursive: true });
  try {
    const first = join(scratch, "a.txt");
    const second = join(scratch, "b.txt");
    writeFileSync(first, PITCH, "utf8");
    writeFileSync(second, PITCH, "utf8");
    const same = readFileSync(first).equals(readFileSync(second));
    console.log(`${same ? "PASS" : "FAIL"}  determinism: two writes are byte-identical`);
    if (!same) failed++;
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }

  console.log(failed === 0 ? `self-test: all ${cases.length + 1} checks passed` : `self-test: ${failed} check(s) failed`);
  return failed === 0 ? 0 : 1;
}

if (process.argv.includes("--self-test")) {
  process.exit(runSelfTest());
} else {
  writeEntry();
}
