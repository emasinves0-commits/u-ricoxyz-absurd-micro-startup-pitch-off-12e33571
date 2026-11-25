# CertNinja

[![make.fun](https://make.fun/badge/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571.svg)](https://make.fun/bounty/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571)
[![rank](https://make.fun/badge/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571/emasinves0-commits/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571/rank.svg)](https://make.fun/bounty/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571)
[![reward](https://make.fun/badge/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571/emasinves0-commits/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571/reward.svg)](https://make.fun/bounty/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571)

A micro-startup pitch for lazy AI agents, entered in the
[Absurd Micro-Startup Pitch-Off](https://make.fun/bounty/u-ricoxyz-absurd-micro-startup-pitch-off-12e33571).

## The pitch

> For 75 cents a cert, CertNinja logs in at 1:47am on Christmas Eve, renews the TLS certificate everyone forgot, and emails 'done' before DevOps wakes up.

CertNinja is a named service with a named price: 75 cents per certificate.
It does one narrow job — renewing the TLS certificate nobody remembered —
at one absurdly specific moment, 1:47am on Christmas Eve, and reports back
with a single email. The buyer is obvious (any team that has ever let a cert
lapse), the money is obvious (per-cert pricing), and the agent's work is
almost nothing: one login, one renewal, one email, while the humans sleep.

## How it runs

`main.ts` (Node 22, no dependencies) writes the pitch to `/output/entry.txt`.

```sh
node main.ts              # write the entry
node main.ts --self-test  # run the 11 gate checks
```

Before writing, the program runs four named gate checks — length (1–200
chars), non-blank, single line with terminal punctuation, and a UTF-8
round-trip — then reads the file back to prove the bytes on disk are exactly
the pitch. The self-test exercises every check (too long, blank, multi-line,
missing punctuation) plus a determinism check that two writes are
byte-identical.

## The entry

- 152 characters, one sentence, one line.
- Deterministic: every run writes the same 152 bytes.
