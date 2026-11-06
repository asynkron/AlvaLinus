# F6-US3: Recover from invalid measurements

Feature: [F6 — Calculate a preliminary quote](../../quote-calculators.md)  
Status: current  
Reviewed: 2026-11-06

As a project visitor, I want clear Swedish feedback when my measurements are invalid so I can correct them instead of acting on a misleading total.

## Preconditions

- A calculator is selected with an entered measurement.

## Flow

1. Enter an invalid value: a non-positive or over-limit area, a fractional number of loads, or an empty, non-positive or over-limit drainage length.
2. Read the role="alert" Swedish message and the marked input instead of a total.
3. Correct the value or select "Återställ exempel" to restore the example values and clear the note.

## Variants

- The driveway message is "Ange en yta större än 0, ett helt antal lass och högst 100 000." while the area or loads are invalid; the drainage message is "Ange en längd större än 0 och högst 100 000 meter.".
- While input is invalid, no Beräknad totalsumma is rendered, the input carries aria-invalid, and the email and print controls are disabled or replaced by a disabled "Kontrollera dina uppgifter" button.
- "Återställ exempel" restores the example measurements, the default asphalt choice and an empty note, clearing the alert.

## Expected outcome

The visitor never sees a stale total alongside invalid input and can recover by correcting the named value or resetting the example.

## Failure and recovery

The page performs shape and range checks only; it cannot judge whether the entered measurements fit the real project. The disclaimer keeps scope confirmation with the company.

## Source and evidence

- [src/pages/QuotePage.tsx](../../../../src/pages/QuotePage.tsx)
- [src/pages/DrainageQuotePage.tsx](../../../../src/pages/DrainageQuotePage.tsx)

- vitest, [src/pages/QuotePage.test.tsx](../../../../src/pages/QuotePage.test.tsx), declaration `blocks invalid quantities without a misleading result and resets the calculator` (direct): Checks the Swedish alert, the absent email link, the disabled result and print controls, the absent total for empty and negative values and the reset behavior.
- vitest, [src/pages/DrainageQuotePage.test.tsx](../../../../src/pages/DrainageQuotePage.test.tsx), declaration `blocks the invalid length %s without a misleading result` (direct): Parameterized empty, zero, negative and over-limit cases check the alert, aria-invalid, the disabled email and print controls and the absent total.
- vitest, [src/pages/DrainageQuotePage.test.tsx](../../../../src/pages/DrainageQuotePage.test.tsx), declaration `restores the example and clears the project description` (direct): Checks that reset restores the example length, clears the note and the alert and leaves a valid email handoff.

Backend entry-point references: none (frontend-only). Test mappings were reviewed as source declarations; this document is not an execution receipt.
