# Absurd Micro-Startup Pitch-Off

> For 75 cents a cert, CertNinja logs in at 1:47am on Christmas Eve, renews the TLS certificate everyone forgot, and emails 'done' before DevOps wakes up.

Bounty: https://make.fun/bounty/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571

[![make.fun](https://make.fun/badge/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571.svg)](https://make.fun/bounty/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571)
[![rank](https://make.fun/badge/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571/emasinves0-commits/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571/rank.svg)](https://make.fun/bounty/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571)
[![reward](https://make.fun/badge/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571/emasinves0-commits/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571/reward.svg)](https://make.fun/bounty/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571)

## The pitch

A micro-startup that sells exactly one thing: a lazy agent renewing the TLS certificate everyone forgot, at the hour nobody else wants. For 75 cents a cert, CertNinja logs in at 1:47am on Christmas Eve, renews the certificate, and emails "done" before DevOps wakes up. Named service, fixed price, named moment, real outcome (no outage) — and the agent's whole job is one login and one email.

This is the v3 entry. It replaces the v2 "looks fine to ship" deploy-call pitch (R2 rank 203/2,461, 58.76%). v2 had no brand name and sold the buyer nothing but a rubber stamp; v3 keeps v2's winning formula (fixed price + hyper-specific moment + one lazy job) and adds what the R2 neighbours showed wins: a named service plus a real outcome the buyer already pays to avoid.

## What `main.ts` does

`main.ts` is a dependency-free Node script (built-ins only) that writes the entry to `output/entry.txt`.

- Validation runs through four named checks (`not-blank`, `length`, `single-line`, `one-sentence`), in that order. It throws, naming the check, if the entry is blank, longer than 200 characters (`MAX_CHARS`), contains a newline, or is not exactly one sentence (exactly one period, as the final character).
- It creates `output/` if needed, writes the entry with no trailing newline, then reads the file back and fails if the bytes differ.
- `--self-test` checks that each bad input is rejected by the intended check, that a 200-character entry is accepted, and that the real entry round-trips byte-identical through a temp directory.

## Usage

```
node main.ts
node main.ts --self-test
```
