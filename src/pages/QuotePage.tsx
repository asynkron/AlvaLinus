import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { QuoteNotesField, QuotePageShell, QuoteResetButton, QuoteResultAside } from "../components/QuotePageShared";
import { siteContent } from "../data/siteContent";
import { buildQuoteMailto, drivewayTotal, formatMoney, formatNumber, vatStatusLabel } from "../lib/quote";
import { buildDrivewayShareSearch, buildQuoteShareHref, readDrivewayShareValues } from "../lib/quote-share";
import type { SiteContent } from "../types/site";
import "./QuotePage.css";

const defaultArea = "100";
const estimateLimit = 100;
const quotePath = "/offertberakning/";
const uppfartHash = "#uppfart";
const money = formatMoney;
const number = formatNumber;

function selectedKind(): "choice" | "uppfart" {
  return window.location.hash === uppfartHash ? "uppfart" : "choice";
}

export function QuotePage({ content = siteContent }: { readonly content?: SiteContent }) {
  const shared = content.quote.shared;
  const text = content.quote.uppfart;
  const quoteRoute = content.routes.find((route) => route.href === quotePath);
  const [kind, setKind] = useState(selectedKind);
  const share = readDrivewayShareValues(window.location.search);
  const [area, setArea] = useState(() => share.area ?? defaultArea);
  const [includeAsphalt, setIncludeAsphalt] = useState(share.asphalt ?? true);
  const [notes, setNotes] = useState(share.notes ?? "");

  useEffect(() => {
    const syncKind = () => setKind(selectedKind());
    window.addEventListener("hashchange", syncKind);
    return () => window.removeEventListener("hashchange", syncKind);
  }, []);

  const previousKind = useRef(kind);
  useEffect(() => {
    if (previousKind.current === kind) return;
    previousKind.current = kind;
    document.getElementById(kind === "uppfart" ? "quote-work-heading" : "quote-choice-heading")?.focus();
  }, [kind]);

  const areaValue = Number(area);
  const valid = area.trim() !== "" && Number.isFinite(areaValue) && areaValue > 0;
  const individualQuote = valid && areaValue > estimateLimit;
  const total = valid && !individualQuote ? money(drivewayTotal(areaValue, includeAsphalt, text.pricing)) : "";
  const email = valid ? buildQuoteMailto(individualQuote ? { ...text.mail, bodyTemplate: text.individualQuote.bodyTemplate } : text.mail, {
    area: number(areaValue),
    asphalt: includeAsphalt ? text.asphaltYesLabel : text.asphaltNoLabel,
    total,
    vat: vatStatusLabel.toLowerCase(),
    notes,
  }) : "";
  return <QuotePageShell homeLabel={content.chrome.breadcrumb.homeLabel} formAriaLabel={shared.formAriaLabel} hero={{ src: "/page-visuals/quote-hero.webp", srcSet: quoteRoute?.heroPhotoSrcSet, sizes: quoteRoute?.heroPhotoSizes }} breadcrumbLabel={text.breadcrumbLabel} heading={text.heading} intro={text.intro} resultAside={<QuoteResultAside shared={shared} error={text.error} valid={valid} total={total} individualQuote={individualQuote ? text.individualQuote.description : undefined} email={email} hidden={kind !== "uppfart"} shareHref={buildQuoteShareHref(buildDrivewayShareSearch({ area, includeAsphalt, notes }), uppfartHash)} />}>
    <div className="quote-choice" hidden={kind === "uppfart"}>
      <h2 id="quote-choice-heading" tabIndex={-1}>{text.choiceHeading}</h2>
      <p>{text.choiceSummary}</p>
      <div className="choice-buttons">
        <a href="/draneringsberakning/">{text.drainageChoiceLabel}<ArrowRight size={16} aria-hidden="true" /></a>
        <a href={uppfartHash}>{text.drivewayChoiceLabel}<ArrowRight size={16} aria-hidden="true" /></a>
      </div>
    </div>
    {kind === "uppfart" ? <a className="quote-back-choice" href={quotePath}>{text.backLinkLabel}</a> : null}
    <div className="quote-work" hidden={kind !== "uppfart"}>
      <h2 id="quote-work-heading" tabIndex={-1}>{text.workHeading}</h2><p>{text.workSummary}</p>
      <label className="quote-field"><span>{text.areaLabel}</span><span className="quote-input"><input type="number" min="0.1" step="any" value={area} onChange={event => setArea(event.target.value)} aria-invalid={!valid} aria-describedby="quote-quantity-help" /><span>{text.areaUnit}</span></span></label>
      <p id="quote-quantity-help" className="quote-help">{text.quantityHelp}</p>
      <label className="quote-check"><input type="checkbox" checked={includeAsphalt} onChange={event => setIncludeAsphalt(event.target.checked)} /><span>{text.asphaltLabel}<span className="quote-help">{text.asphaltHelp}</span></span></label>
      <QuoteNotesField label={text.notesLabel} optionalLabel={text.notesOptionalLabel} placeholder={text.notesPlaceholder} value={notes} onChange={event => setNotes(event.target.value)} />
      <QuoteResetButton label={text.resetLabel} onReset={() => { setArea(defaultArea); setIncludeAsphalt(true); setNotes(""); }} />
    </div>
  </QuotePageShell>;
}
