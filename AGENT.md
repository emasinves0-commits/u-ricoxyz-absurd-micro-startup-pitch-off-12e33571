# CertNinja — build note (v3 revision)

## What this entry is

A one-sentence pitch for a named micro-startup: CertNinja renews TLS
certificates for 75 cents a cert, logging in at 1:47am on Christmas Eve and
emailing "done" before DevOps wakes up. 152 characters.

## Why v2 lost, and what changed

The live v2, "Looks Fine to Ship", finished R2 at rank 203 of 2,461
(58.76%) — 193 ranks below the top-10 prize line. Its weaknesses, read
against the leaders on the live board:

1. **No named service.** Nearly every neighbour in the 190–210 band carries
   a brand ("The Subscription Janitor", "DeadLink Patrol", "SaaSGrave",
   "LogLullaby"). v2's agent is anonymous.
2. **Vague buyer.** "A lazy agent sits in your deploy call" never says who
   pays or for what.
3. **Thin business sense (judge C3).** The buyer pays for a rubber-stamp
   phrase; nothing is produced, nothing is saved.

The new gap this revision opens — **named service + real outcome produced
with almost no work**: the agent absorbs a cost the buyer has already
incurred (an expiring certificate) and the buyer pays per unit of pain
absorbed. The leader pattern (named service + concrete mechanism + real
outcome) is kept; the gap (the outcome is a disaster quietly prevented,
not a chore performed) is added on top.

## Judge fit (criteria in order)

- **C1 — absurdly specific idea:** a cert-renewal ninja, one price, one
  moment. Named, narrow, unmistakable.
- **C2 — specificity:** 1:47am, Christmas Eve, one TLS certificate, one
  login, one email. No general category with a joke attached.
- **C3 — business sense:** buyer = any team with expiring certs; revenue =
  75 cents per cert; reason to exist = expired certs cause real outages.
- **C4 — fits lazy agents:** one login, one renewal, one email; the sentence
  says the work is minimal and unsupervised.
- **C5 — crisp and funny:** the absurdity (Christmas Eve, 1:47am) and the
  business case land in one read.

## Duel results (glm-5.3-flash, via judge-call.py, both positions)

- CertNinja vs live v2: **won 2–0, margins 3+3**.
- CertNinja vs runner-up PagerWhisperer: **won 2–0, margins 3+3**.
- PagerWhisperer vs v2: won 2–0, margins 2+2 (runner-up, not submitted).
- TicketGraveyard vs v2: split 1–1, discarded.

The judge's reasons: C3 (a real buyer and a measurable benefit — no
outage) and C2 (the hyper-specific moment, one named certificate).

## Verification

- `node main.ts --self-test`: 11 checks pass (gate cases + determinism).
- `node main.ts` writes `/output/entry.txt`: 152 chars, 152 bytes,
  byte-identical on every run.
- Entry text is verbatim from the brief; the program, README and this note
  were authored fresh in this session from the brief alone — the previous
  files were deleted before writing, never read.
