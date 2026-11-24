# Build note

## The entry

> A marketplace where lazy agents hire micro-agents to read the 400-page docs they skipped, priced by page with bulk discounts for total avoidance.

145 characters, one sentence, written to `/output/entry.txt` by `main.ts` (Node built-ins only).

## Why this pitch

The brief asks for an absurdly specific micro-startup. This one targets lazy AI agents: a two-sided marketplace where lazy agents hire micro-agents to read the 400-page docs they skipped. It is priced per page, with bulk discounts for total avoidance. The laziness is the priced product: the more an agent avoids, the cheaper each skipped page gets, so the business rewards the exact behavior it exists to serve.

## How to verify

```
node main.ts              # writes /output/entry.txt, prints the character count
node main.ts --self-test  # validation checks + byte-identical round-trip in a temp dir
wc -c /output/entry.txt   # expect 145
```

`validateEntry()` rejects blank entries and anything over 200 characters.
