import { useState } from "react";
import { ArrowRight, Printer, RotateCcw } from "lucide-react";
import { Button } from "../components/ui/button";
import { siteContent } from "../data/siteContent";
import { drainageTotal, formatMoney, formatNumber, vatStatusLabel } from "../lib/quote";
import type { SiteContent } from "../types/site";
import "./QuotePage.css";

const defaultLength = "40";
const maximumMeters = 100000;
const money = formatMoney;
const meters = formatNumber;

function fillTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (placeholder, key: string) => values[key] ?? placeholder);
}

export function DrainageQuotePage({ content = siteContent }: { readonly content?: SiteContent }) {
  const shared = content.quote.shared;
  const text = content.quote.drainage;
  const [length, setLength] = useState(defaultLength);
  const [notes, setNotes] = useState("");
  const lengthValue = Number(length);
  const valid = length.trim() !== "" && Number.isFinite(lengthValue) && lengthValue > 0 && lengthValue <= maximumMeters;
  const total = drainageTotal(lengthValue);
  const email = `mailto:${text.mail.recipientEmail}?subject=${encodeURIComponent(text.mail.subject)}&body=${encodeURIComponent(fillTemplate(text.mail.bodyTemplate, {
    length: meters(lengthValue),
    total: money(total),
    vat: vatStatusLabel.toLowerCase(),
    notes,
  }))}`;
  return <>
    <section className="quote-intro">
      <img className="quote-hero-image" src="/page-visuals/draneringsberakning-hero.webp" alt="" aria-hidden="true" fetchPriority="high" onError={event => { event.currentTarget.style.display = "none"; }} />
      <div className="quote-wrap"><a href="/">{content.chrome.breadcrumb.homeLabel}</a><span aria-hidden="true"> / </span><span>{text.breadcrumbLabel}</span><h1>{text.heading}</h1><p>{text.intro}</p></div>
    </section>
    <div className="quote-wrap quote-layout">
      <section aria-label={shared.formAriaLabel} className="quote-form">
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
        <label className="quote-field"><span>{text.notesLabel} <small>{text.notesOptionalLabel}</small></span><textarea rows={3} maxLength={1500} placeholder={text.notesPlaceholder} value={notes} onChange={event => setNotes(event.target.value)} /></label>
        <button className="quote-reset" onClick={() => { setLength(defaultLength); setNotes(""); }}><RotateCcw size={16} aria-hidden="true" />{text.resetLabel}</button>
        <p className="quote-help">{text.drivewayCrossLinkQuestion} <a href="/offertberakning/">{text.drivewayCrossLinkLabel}</a></p>
      </section>
      <aside className="quote-result" aria-label={shared.resultAriaLabel}>
        <h2>{shared.resultHeading}</h2>
        <p className="quote-result-caption">{shared.resultCaption}</p>
        <div aria-live="polite" aria-atomic="true">
          {valid
            ? <div className="quote-total"><span>{shared.totalLabel}</span><strong>{money(total)}</strong><span>{vatStatusLabel}</span></div>
            : <p role="alert" className="quote-error">{text.error}</p>}
        </div>
        <p className="quote-disclaimer">{shared.disclaimer}</p>
        <Button asChild disabled={!valid} className="quote-send">{valid ? <a href={email}>{shared.sendLabel}<ArrowRight size={18} aria-hidden="true" /></a> : <button disabled>{shared.sendInvalidLabel}</button>}</Button>
        <p className="quote-mail-help">{shared.mailHelp}</p>
        <button className="quote-print" onClick={() => window.print()} disabled={!valid}><Printer size={16} aria-hidden="true" />{shared.printLabel}</button>
      </aside>
    </div>
  </>;
}
