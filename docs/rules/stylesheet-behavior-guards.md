# Stylesheet behavior guards

From fk281: use installed PostCSS parsing for CSS rule and declaration boundaries
instead of matching minified selector-plus-brace strings. Match each owned
selector independently of selector-list order and whitespace; a neighboring
selector must not satisfy an absent target.

Assert the meaningful behavior (such as at least 3:1 boundary contrast), not the
current hex value or number of grouped rules. Use independent in-memory passing,
missing and failing examples to protect the guard itself. Preserve catalog test
paths and declaration names or update their references with an intentional rename.

Keep source-level claims bounded: the field-border guard checks explicit base
rules using positive pixel widths, solid borders and opaque three/six-digit hex
colors. It does not evaluate browser cascade, conditional overrides or rendered
accessibility. Revisit that boundary if production starts using other border
representations; do not silently skip unsupported values.
