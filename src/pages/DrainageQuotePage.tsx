import { useState } from "react";
import { QuoteNotesField, QuotePageShell, QuoteResetButton, QuoteResultAside } from "../components/QuotePageShared";
import { siteContent } from "../data/siteContent";
import { buildQuoteMailto, drainageTotal, formatMoney, formatNumber, vatStatusLabel } from "../lib/quote";
import type { SiteContent } from "../types/site";
import "./QuotePage.css";

const defaultLength = "40";
const maximumMeters = 100000;
const money = formatMoney;
const meters = formatNumber;

export function DrainageQuotePage({ content = siteContent }: { readonly content?: SiteContent }) {
  const shared = content.quote.shared;
  const text = content.quote.drainage;
  const drainageRoute = content.routes.find((route) => route.id === "drainage-quote");
  const [length, setLength] = useState(defaultLength);
  const [notes, setNotes] = useState("");
  const lengthValue = Number(length);
  const valid = length.trim() !== "" && Number.isFinite(lengthValue) && lengthValue > 0 && lengthValue <= maximumMeters;
  const total = drainageTotal(lengthValue);
  const email = buildQuoteMailto(text.mail, {
    length: meters(lengthValue),
    total: money(total),
    vat: vatStatusLabel.toLowerCase(),
    notes,
  });
  return <QuotePageShell homeLabel={content.chrome.breadcrumb.homeLabel} formAriaLabel={shared.formAriaLabel} hero={{ src: "/page-visuals/draneringsberakning-hero.webp", srcSet: drainageRoute?.heroPhotoSrcSet, sizes: drainageRoute?.heroPhotoSizes }} breadcrumbLabel={text.breadcrumbLabel} heading={text.heading} intro={text.intro} resultAside={<QuoteResultAside shared={shared} error={text.error} valid={valid} total={money(total)} email={email} />}>
    <h2>{text.workHeading}</h2><p>{text.workSummary}</p>
    <label className="quote-field">
      <span>{text.lengthLabel}</span>
      <span className="quote-input">
        <input type="number" min="0.1" max={maximumMeters} step="any" value={length} onChange={event => setLength(event.target.value)} aria-invalid={!valid} aria-describedby="meter-help" />
        <span>{text.lengthUnit}</span>
      </span>
      <small id="meter-help">{text.lengthHelp}</small>
    </label>
    <h2>{text.includedHeading}</h2>
    {text.includedParagraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
    <QuoteNotesField label={text.notesLabel} optionalLabel={text.notesOptionalLabel} placeholder={text.notesPlaceholder} value={notes} onChange={event => setNotes(event.target.value)} />
    <QuoteResetButton label={text.resetLabel} onReset={() => { setLength(defaultLength); setNotes(""); }} />
    <p className="quote-help">{text.drivewayCrossLinkQuestion} <a href="/offertberakning/">{text.drivewayCrossLinkLabel}</a></p>
  </QuotePageShell>;
}
