import { useEffect, useState } from "react";
import { ArrowRight, Printer, RotateCcw } from "lucide-react";
import { Button } from "../components/ui/button";
import { siteContent } from "../data/siteContent";
import { drivewayTotal, formatMoney, formatNumber, vatStatusLabel } from "../lib/quote";
import type { SiteContent } from "../types/site";
import "./QuotePage.css";

const defaults = { area: "100", loads: "1" };
type Values = typeof defaults;
const maximumQuantity = 100000;
const quotePath = "/offertberakning/";
const uppfartHash = "#uppfart";
const money = formatMoney;
const number = formatNumber;

function selectedKind(): "choice" | "uppfart" {
  return window.location.hash === uppfartHash ? "uppfart" : "choice";
}

function fillTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (placeholder, key: string) => values[key] ?? placeholder);
}

export function QuotePage({ content = siteContent }: { readonly content?: SiteContent }) {
  const shared = content.quote.shared;
  const text = content.quote.uppfart;
  const [kind, setKind] = useState(selectedKind);
  const [values, setValues] = useState<Values>(defaults);
  const [includeAsphalt, setIncludeAsphalt] = useState(true);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const syncKind = () => setKind(selectedKind());
    window.addEventListener("hashchange", syncKind);
    return () => window.removeEventListener("hashchange", syncKind);
  }, []);

  const area = Number(values.area);
  const loads = Number(values.loads);
  const valid = values.area.trim() !== "" && values.loads.trim() !== "" && Number.isFinite(area) && area > 0 && area <= maximumQuantity && Number.isFinite(loads) && loads >= 0 && Number.isInteger(loads) && loads <= maximumQuantity;
  const total = drivewayTotal(area, loads, includeAsphalt);
  const email = `mailto:${text.mail.recipientEmail}?subject=${encodeURIComponent(text.mail.subject)}&body=${encodeURIComponent(fillTemplate(text.mail.bodyTemplate, {
    area: number(area),
    loads: number(loads),
    asphalt: includeAsphalt ? text.asphaltYesLabel : text.asphaltNoLabel,
    total: money(total),
    vat: vatStatusLabel.toLowerCase(),
    notes,
  }))}`;
  function quantity(key: keyof Values, label: string, unit: string, min: string, step: string) {
    return <label className="quote-field"><span>{label}</span><span className="quote-input"><input type="number" min={min} max={maximumQuantity} step={step} value={values[key]} onChange={event => setValues({ ...values, [key]: event.target.value })} aria-invalid={!valid} aria-describedby="quote-quantity-help" /><span>{unit}</span></span></label>;
  }
  return <>
    <section className="quote-intro">
      <img className="quote-hero-image" src="/page-visuals/quote-hero.webp" srcSet="/page-visuals/quote-hero-640.webp 640w, /page-visuals/quote-hero-960.webp 960w, /page-visuals/quote-hero.webp 1672w" sizes="100vw" alt="" aria-hidden="true" fetchPriority="high" onError={event => { event.currentTarget.style.display = "none"; }} />
      <div className="quote-wrap"><a href="/">{content.chrome.breadcrumb.homeLabel}</a><span aria-hidden="true"> / </span><span>{text.breadcrumbLabel}</span><h1>{text.heading}</h1><p>{text.intro}</p></div>
    </section>
    <div className="quote-wrap quote-layout">
      <section aria-label={shared.formAriaLabel} className="quote-form">
        <div className="quote-choice" hidden={kind === "uppfart"}>
          <h2>{text.choiceHeading}</h2>
          <p>{text.choiceSummary}</p>
          <div className="choice-buttons">
            <a href="/draneringsberakning/">{text.drainageChoiceLabel}<ArrowRight size={16} aria-hidden="true" /></a>
            <a href={uppfartHash}>{text.drivewayChoiceLabel}<ArrowRight size={16} aria-hidden="true" /></a>
          </div>
        </div>
        {kind === "uppfart" ? <a className="quote-back-choice" href={quotePath}>{text.backLinkLabel}</a> : null}
        <div className="quote-work" hidden={kind !== "uppfart"}>
          <h2>{text.workHeading}</h2><p>{text.workSummary}</p>
          <div className="quote-fields">{quantity("area", text.areaLabel, text.areaUnit, "0.1", "any")}{quantity("loads", text.loadsLabel, text.loadsUnit, "0", "1")}</div>
          <p id="quote-quantity-help" className="quote-help">{text.quantityHelp}</p>
          <label className="quote-check"><input type="checkbox" checked={includeAsphalt} onChange={event => setIncludeAsphalt(event.target.checked)} /><span>{text.asphaltLabel}<span className="quote-help">{text.asphaltHelp}</span></span></label>
          <label className="quote-field"><span>{text.notesLabel} <small>{text.notesOptionalLabel}</small></span><textarea rows={3} maxLength={1500} placeholder={text.notesPlaceholder} value={notes} onChange={event => setNotes(event.target.value)} /></label>
          <button className="quote-reset" onClick={() => { setValues(defaults); setIncludeAsphalt(true); setNotes(""); }}><RotateCcw size={16} aria-hidden="true" />{text.resetLabel}</button>
        </div>
      </section>
      <aside className="quote-result" aria-label={shared.resultAriaLabel} hidden={kind !== "uppfart"}>
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
