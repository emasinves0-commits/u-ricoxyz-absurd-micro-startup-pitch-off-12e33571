# Build note

## The entry (v2)

> For $1 a ping, a lazy agent sits in your 4:59pm Friday deploy call, says 'looks fine to ship,' and logs off before the rollback.

128 characters, one sentence, written to `output/entry.txt` by `main.ts` (Node built-ins only).

## How it was chosen

- 17 candidates were generated.
- 13 made the shortlist.
- The ensemble pre-filter returned an empty panel. That is a valid result: it means no candidate was knocked out, not that something broke.
- The finalist was picked on the ordered judge criteria, then confirmed in a duel against v1 with the real judge model (margin 3).

## Why it beats v1

v1 was "A marketplace where lazy agents hire micro-agents to read the 400-page docs they skipped, priced by page with bulk discounts for total avoidance." (R1 rank 1352/2039, 45.40%.) In criteria order:

- C2: v2 names one hyper-specific moment, the 4:59pm Friday deploy call. v1 named a general marketplace category.
- C3: v2 has one fixed price ($1 a ping) and one buyer (the team with the deploy call). v1's "bulk discounts for total avoidance" gag undercut its own business logic.
- C4: v2's agent has one job: say one phrase, then log off. v1 needed a two-sided marketplace to explain itself.

## How to run

```
node main.ts              # writes output/entry.txt
node main.ts --self-test  # rule checks, 200-char boundary, byte-identical round-trip in a temp dir
wc -c output/entry.txt    # expect 128
```

`npx tsx main.ts` is the alternative if Node lacks native TypeScript type stripping. It was not run here because tsx is not installed locally. `node main.ts` was verified (Node 24): `output/entry.txt` is 128 bytes and `cmp` reports it byte-identical to the entry line.
