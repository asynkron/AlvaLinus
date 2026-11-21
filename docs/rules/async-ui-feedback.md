# Asynchronous UI feedback

Scope action feedback to the inputs and action attempt that produced it. Clear
obsolete links and status when inputs change or become invalid, and ignore late
completions from older attempts. Returning to previous inputs must not resurrect
discarded feedback. Keep URL and clipboard writes behind explicit user actions.

For quote sharing, the shared controls reset through React identity when the
validity or share URL changes; only the latest attempt can update its status.
Protect shared attempt ownership with rendered component assertions and
controlled promises, without sleeps or duplicate race cases at each calculator
page (fk276). Use actual page interactions for the distinct event-wiring
boundary: share before each field edit, assert feedback removal without URL or
clipboard publication, then explicitly share independently expected current
values. Include reset from changed values and invalid-to-valid recovery (fk292).

For inquiry email drafts, clear the prepared confirmation and recovery link on
every field edit, including optional fields and the separate momsstatus select.
Clear the selectable plain-text recovery draft in the same prepared state;
derive it and the mailto handoff from one composition (fk304).
Keep form values intact and open a new draft only on explicit valid submission.
Cover each control through rendered form interactions and inspect the actual
mail output against independently expected details (fk298).
