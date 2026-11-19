# Asynchronous UI feedback

Scope action feedback to the inputs and action attempt that produced it. Clear
obsolete links and status when inputs change or become invalid, and ignore late
completions from older attempts. Returning to previous inputs must not resurrect
discarded feedback. Keep URL and clipboard writes behind explicit user actions.

For quote sharing, the shared controls reset through React identity when the
validity or share URL changes; only the latest attempt can update its status.
Protect this behavior with rendered component assertions and controlled promises,
without sleeps or duplicate coverage at each calculator page (fk276).
