import { useState } from "react";
import { QuoteNotesField, QuotePageShell, QuoteResetButton, QuoteResultAside, QuoteVatField } from "../components/QuotePageShared";
import { siteContent } from "../data/siteContent";
import { buildQuoteMailto, drainageTotal, formatMoney, formatNumber, quoteTotalForVat } from "../lib/quote";
import { buildDrainageShareSearch, buildQuoteShareHref, readDrainageShareValues } from "../lib/quote-share";
import type { SiteContent } from "../types/site";
import "./QuotePage.css";

const defaultLength = "40";
const estimateLimit = 100;
const money = formatMoney;
const meters = formatNumber;

export function DrainageQuotePage({ content = siteContent }: { readonly content?: SiteContent }) {
  const shared = content.quote.shared;
  const text = content.quote.drainage;
  const drainageRoute = content.routes.find((route) => route.id === "drainage-quote");
  const share = readDrainageShareValues(window.location.search);
  const [length, setLength] = useState(() => share.length ?? defaultLength);
  const [notes, setNotes] = useState(share.notes ?? "");
  const [includeVat, setIncludeVat] = useState(share.includeVat ?? true);
  const vatLabel = includeVat ? shared.vatInclusiveLabel : shared.vatExclusiveLabel;
  const lengthValue = Number(length);
  const valid = length.trim() !== "" && Number.isFinite(lengthValue) && lengthValue > 0;
  const individualQuote = valid && lengthValue > estimateLimit;
  const total = valid && !individualQuote ? money(quoteTotalForVat(drainageTotal(lengthValue, text.pricing), includeVat)) : "";
  const email = valid ? buildQuoteMailto(individualQuote ? { ...text.mail, bodyTemplate: text.individualQuote.bodyTemplate } : text.mail, {
    length: meters(lengthValue),
    total,
    vat: vatLabel,
    notes,
  }) : "";
  return <QuotePageShell homeLabel={content.chrome.breadcrumb.homeLabel} formAriaLabel={shared.formAriaLabel} hero={{ src: "/page-visuals/draneringsberakning-hero.webp", srcSet: drainageRoute?.heroPhotoSrcSet, sizes: drainageRoute?.heroPhotoSizes }} breadcrumbLabel={text.breadcrumbLabel} heading={text.heading} intro={text.intro} resultAside={<QuoteResultAside shared={shared} error={text.error} valid={valid} total={total} vatLabel={vatLabel} individualQuote={individualQuote ? text.individualQuote.description : undefined} email={email} shareHref={buildQuoteShareHref(buildDrainageShareSearch({ length, notes, includeVat }))} />}>
    <h2>{text.workHeading}</h2><p>{text.workSummary}</p>
    <label className="quote-field">
      <span>{text.lengthLabel}</span>
      <span className="quote-input">
        <input type="number" min="0.1" step="any" value={length} onChange={event => setLength(event.target.value)} aria-invalid={!valid} aria-describedby="meter-help" />
        <span>{text.lengthUnit}</span>
      </span>
      <small id="meter-help">{text.lengthHelp}</small>
    </label>
    <h2>{text.includedHeading}</h2>
    {text.includedParagraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
    <QuoteVatField shared={shared} includeVat={includeVat} onChange={setIncludeVat} />
    <QuoteNotesField label={text.notesLabel} optionalLabel={text.notesOptionalLabel} placeholder={text.notesPlaceholder} value={notes} onChange={event => setNotes(event.target.value)} />
    <QuoteResetButton label={text.resetLabel} onReset={() => { setLength(defaultLength); setNotes(""); setIncludeVat(true); }} />
    <p className="quote-help">{text.drivewayCrossLinkQuestion} <a href="/offertberakning/">{text.drivewayCrossLinkLabel}</a></p>
  </QuotePageShell>;
}
