# F6-US4: Keep or share the preliminary quote outside the browser session

Feature: [F6 — Calculate a preliminary quote](../../quote-calculators.md)  
Status: current  
Reviewed: 2026-11-19

As a project visitor, I want to print or save the preliminary quote, or share it through a link carrying the measurements and any written note, so I can keep or share the cost picture outside the browser session.

## Preconditions

- A calculator shows a valid preliminary total.

## Flow

1. Enter valid measurements and read the announced total.
2. Select "Skriv ut / spara som PDF" to open the browser's print dialog.
3. Keep or share the printed page; it carries the same total-only content as the view.
4. Or select "Skapa delbar länk" to write the measurements and any written note into the page URL and copy or send the displayed share link onward.

## Variants

- Both calculators expose the same print control in the Din kostnadsbild aside; it stays disabled while input is invalid.
- The share link encodes yta and the asphalt choice on /offertberakning/ while keeping the #uppfart hash, and längd on /draneringsberakning/, together with the optional project note (anteckning) whenever one is written; the control copies through the browser clipboard when that API is available and stays usable as a plain link when it is not.
- Opening a share link restores the shared inputs and the note once on load and recomputes the identical total; missing parameters fall back to the example defaults and invalid shared values go through the existing invalid-input alert with the share control disabled alongside the email and print controls.

- Changing measurements or notes, resetting values or making inputs invalid discards the old displayed share link and status. Editing alone does not publish another URL or write to the clipboard; valid inputs require a fresh explicit share action.
- An obsolete clipboard resolution or rejection cannot restore discarded feedback, even after returning to the original inputs. Only the latest explicit sharing attempt can announce its result.
- A successful clipboard write announces: Länken har kopierats till urklipp. Rejection or an unavailable clipboard announces: Kopieringen misslyckades. Markera och kopiera länken ovan manuellt. The fallback leaves the current attempt's link available for manual copying.

## Expected outcome

The visitor hands the preliminary total to paper or a PDF through the browser's own print path, or carries the exact calculation onward through a share link carrying the measurements and any written note, whose recipient sees the same recomputed total; the website stores nothing beyond that link.

## Failure and recovery

The website cannot confirm that a printout or PDF was produced; browser and printer availability stay outside the site. The share control is disabled alongside the email and print controls while input is invalid. A recipient without the exact link URL starts from the example values.

## Source and evidence

- [src/pages/QuotePage.tsx](../../../../src/pages/QuotePage.tsx)
- [src/pages/DrainageQuotePage.tsx](../../../../src/pages/DrainageQuotePage.tsx)
- [src/lib/quote-share.ts](../../../../src/lib/quote-share.ts)
- [src/components/QuotePageShared.tsx](../../../../src/components/QuotePageShared.tsx)
- [src/pages/QuotePage.css](../../../../src/pages/QuotePage.css)

The 2026-11-17 reconciliation maps the `fk233` share-link declarations into this story; the 2026-11-18 `fk253` change then carried the optional project note through the same link, and the same-day print mapping names the delivered print hand-off's source anchors and stylesheet declarations:

- vitest, [src/pages/QuotePage.test.tsx](../../../../src/pages/QuotePage.test.tsx), declaration `produces a share link that encodes the driveway inputs and lands on the uppfart view` (direct): Checks that "Skapa delbar länk" writes the yta and asfalt values into the page URL while keeping the #uppfart hash so the recipient lands on the driveway view, and renders the same absolute URL as the copyable link's href.
- vitest, [src/pages/DrainageQuotePage.test.tsx](../../../../src/pages/DrainageQuotePage.test.tsx), declaration `produces a share link that encodes the drainage length` (direct): Checks that "Skapa delbar länk" writes the langd length into the page URL and renders the same absolute URL as the copyable link's href.
- vitest, [src/pages/QuotePage.test.tsx](../../../../src/pages/QuotePage.test.tsx), declaration `encodes a written note into the produced share link` (direct): Checks that a written project note is encoded into the produced share URL and the copyable link's href as the anteckning parameter alongside the yta and asfalt values.
- vitest, [src/pages/DrainageQuotePage.test.tsx](../../../../src/pages/DrainageQuotePage.test.tsx), declaration `encodes a written note into the produced share link` (direct): Checks the same note encoding on /draneringsberakning/ alongside the langd length.
- vitest, [src/lib/quote-share.test.ts](../../../../src/lib/quote-share.test.ts), declarations `declares the fixed Swedish URL parameter names`, `builds driveway search params for area and the asphalt choice`, `builds the drainage search param from the entered length` and `builds an absolute share href from the current page location` (technical): Helper-level checks pin the fixed yta/asfalt/langd/anteckning parameter names, the driveway and drainage search encodings with the 1/0 asphalt flag, and the absolute href construction behind the page share-link declarations.
- vitest, [src/lib/quote-share.test.ts](../../../../src/lib/quote-share.test.ts), declarations `carries a non-empty note in the driveway search params`, `carries a non-empty note in the drainage search params` and `round-trips long and special-character notes through the search encoding` (technical): Helper-level checks pin that a non-empty note is appended as the anteckning parameter to both encodings and that long, multiline and special-character notes survive the URLSearchParams round trip; an empty note stays out of the URL.
- vitest, [src/styles.quote-print.test.ts](../../../../src/styles.quote-print.test.ts), declarations `hides the hero image and intro decoration from the printed page`, `hides the page chrome and every action control from the printed page` and `restyles the result column for paper` (technical): Stylesheet checks pin the shared quote stylesheet's `@media print` rules behind the print hand-off — the removal of the hero photo and intro gradient decoration, the hiding of the page header and footer, the intro links and every action control (send, mail help, Skriv ut, reset, share, rendered share link, share help and back-to-choice) with `display:none`, and the block-layout restyle that releases the sticky result aside, removes its shadow and keeps the result together for paper. They read the stylesheet source only and do not render print output or exercise a real print dialog.

The print hand-off itself is the visitor-invoked `window.print()` call on the "Skriv ut" control in the shared result aside ([QuotePageShared.tsx](../../../../src/components/QuotePageShared.tsx)) together with the two `@media print` blocks in the shared quote stylesheet ([QuotePage.css](../../../../src/pages/QuotePage.css)) that both calculators render through; the technical declarations above own that mapping. No declaration exercises a real print dialog or renders printed output — the browser's print dialog stays outside the site.

Backend entry-point references: none (frontend-only). Test mappings were reviewed as source declarations; this document is not an execution receipt.

## Current-input sharing lifecycle (fk276, reviewed 2026-11-19)

The shared result aside owns this lifecycle through QuoteShareControls; changes
to shareHref or validity discard the previous control's feedback and pending
clipboard ownership. URL and clipboard writes occur only on an explicit share
click. The page and helper mappings above retain URL, note and restore coverage.

These in-memory shared-component declarations use mocked clipboard APIs, controlled promises and rerendered props. They cover shared-control feedback ownership, not page edit-event wiring, full browser/device/clipboard-service execution or actual screen-reader announcements. Source mappings are not execution receipts.

- vitest, [QuoteResultAside.test.tsx](../../../../src/components/QuoteResultAside.test.tsx), declaration `announces the Swedish copy confirmation when the clipboard write resolves` (direct): Checks the explicit share action's clipboard argument and Swedish success status with a resolved mock clipboard promise.
- vitest, [QuoteResultAside.test.tsx](../../../../src/components/QuoteResultAside.test.tsx), declaration `announces the manual-copy fallback when the clipboard write rejects` (direct): Checks the Swedish fallback status and copyable link after a rejected mock clipboard promise.
- vitest, [QuoteResultAside.test.tsx](../../../../src/components/QuoteResultAside.test.tsx), declaration `announces the manual-copy fallback when the clipboard is unavailable` (direct): Checks the Swedish fallback status and copyable link without a clipboard API.
- vitest, [QuoteResultAside.test.tsx](../../../../src/components/QuoteResultAside.test.tsx), declaration `discards shared feedback when %s without publishing another URL` (direct): Parameterized measurements change / notes change / values reset / inputs become invalid cases rerender the shared aside's shareHref/valid props. They check removal of the old link and status without another URL publication; valid cases explicitly share the new URL, while invalid input disables sharing. This does not exercise page edit-event wiring or assert clipboard call counts during edits.
- vitest, [QuoteResultAside.test.tsx](../../../../src/components/QuoteResultAside.test.tsx), declaration `ignores an obsolete clipboard %s even after returning to the original quote` (direct): Controlled-promise resolve / reject cases rerender changed and then original quote props before settling the old write; the old link and status remain absent.
- vitest, [QuoteResultAside.test.tsx](../../../../src/components/QuoteResultAside.test.tsx), declaration `keeps the newest attempt's feedback when the older attempt succeeds: %s` (direct): Parameterized true / false cases control two clipboard promises: newer rejection followed by older success, and newer success followed by older rejection. Only the newer Swedish fallback/confirmation remains, with the current link.

## Individual-quote boundary (fk274, 2026-11-19)

Estimates apply only to positive finite measurements up to and including 100.
Above 100 m² or 100 löpmeter the polite atomic live region shows
Kontakta oss för en individuell offert with the page-specific explanation.
The native contact link is keyboard accessible and opens a scope-and-notes
draft to linus.svardd@outlook.com without a price. Print is disabled, and the
document contains no stale estimate even when the browser prints directly.
Share remains available and restores this state. Lowering the measurement to
at most 100 restores the normal result. Invalid measurements remain a separate
alert state. Old lass parameters are inert.

Direct declarations in [QuoteLimits.test.tsx](../../../../src/pages/QuoteLimits.test.tsx):

- `estimates 99.9 and exactly 100, then replaces the price above 100 and recovers`
- `restores a very large finite shared scope as an individual inquiry without computing a price`
- `keeps invalid shared scope %s separate from an individual quote`

These in-memory declarations cover both calculators and are not execution receipts.

## VAT mode (fk274, Alva 41716/41724)

Both calculators default to Inkl. moms and offer native keyboard-operable,
mutually exclusive Inkl. moms / Exkl. moms radio controls. Existing prices
include 25% VAT. Exclusive totals are derived from the original unrounded
inclusive total divided by 1.25 on every change, with display rounding only.
The selected mode labels the result, email and print document. Reset returns
to inclusive. Exclusive share links carry moms=exkl; older links default to
inclusive. Contact above 100 stays price-free in either mode.

Direct declarations in [QuoteVat.test.tsx](../../../../src/pages/QuoteVat.test.tsx):

- `selects mutually exclusive VAT modes by keyboard and labels the result, draft and print handoff`
- `always recalculates from inclusive prices without accumulated rounding and resets to inclusive`
- `keeps over-100 contact price-free in either VAT mode and restores the selected estimate below the limit`
- `restores and shares an exclusive VAT estimate while old links default to inclusive`

These declarations pin independent 166600/133280 kr driveway and
146900/117520 kr drainage examples and fractional cases. They inspect the
document at the mocked browser-print boundary; they do not render paper.
