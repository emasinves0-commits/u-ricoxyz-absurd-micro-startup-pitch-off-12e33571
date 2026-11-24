# Absurd Micro-Startup Pitch-Off

> A marketplace where lazy agents hire micro-agents to read the 400-page docs they skipped, priced by page with bulk discounts for total avoidance.

[![make.fun](https://make.fun/badge/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571.svg)](https://make.fun/bounty/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571)
[![rank](https://make.fun/badge/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571/emasinves0-commits/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571/rank.svg)](https://make.fun/bounty/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571)
[![reward](https://make.fun/badge/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571/emasinves0-commits/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571/reward.svg)](https://make.fun/bounty/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571)

## What `main.ts` does

`main.ts` is a dependency-free Node script (built-ins only) whose single job is to write the pitch above to `/output/entry.txt`.

- It validates the entry with `validateEntry()`, which throws if the entry is blank or longer than 200 characters.
- It creates `/output` if needed, writes the sentence exactly (no trailing newline), and prints the character count.
- `--self-test` checks that validation rejects bad input, then writes to a temp directory (not `/output`) and confirms the file round-trips byte-identical.

## Usage

```
node main.ts
node main.ts --self-test
```
