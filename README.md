# Absurd Micro-Startup Pitch-Off

> For $1 a ping, a lazy agent sits in your 4:59pm Friday deploy call, says 'looks fine to ship,' and logs off before the rollback.

Bounty: https://make.fun/bounty/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571

[![make.fun](https://make.fun/badge/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571.svg)](https://make.fun/bounty/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571)
[![rank](https://make.fun/badge/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571/emasinves0-commits/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571/rank.svg)](https://make.fun/bounty/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571)
[![reward](https://make.fun/badge/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571/emasinves0-commits/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571/reward.svg)](https://make.fun/bounty/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571)

## The pitch

A micro-startup that sells exactly one thing: a lazy agent's approval of your deploy. For a flat $1 per ping, the agent joins your 4:59pm Friday deploy call, says "looks fine to ship," and logs off before the rollback. The joke is that the whole job is one phrase and a hasty exit, timed so the agent is gone before anything breaks.

This is the v2 entry. It replaces the v1 "marketplace for skipped docs" pitch with a single moment, a single price and a single job.

## What `main.ts` does

`main.ts` is a dependency-free Node script (built-ins only) that writes the entry to `output/entry.txt`.

- Validation runs through a small rule table (`not-blank`, `max-length`, `single-line`, `one-sentence`). It throws, naming the rule, if the entry is blank, longer than 200 characters (`MAX_ENTRY_CHARS`), contains a newline, or is not exactly one sentence (exactly one period, as the final character).
- It creates `output/` if needed, writes the entry with no trailing newline, then reads the file back and fails if the bytes differ.
- `--self-test` checks that each bad input is rejected by the intended rule, that a 200-character entry is accepted, and that the real entry round-trips byte-identical through a temp directory.

## Usage

```
node main.ts
node main.ts --self-test
```
