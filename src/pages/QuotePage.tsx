import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { QuoteNotesField, QuotePageShell, QuoteResetButton, QuoteResultAside } from "../components/QuotePageShared";
import { siteContent } from "../data/siteContent";
import { buildQuoteMailto, drivewayTotal, formatMoney, formatNumber, vatStatusLabel } from "../lib/quote";
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

export function QuotePage({ content = siteContent }: { readonly content?: SiteContent }) {
  const shared = content.quote.shared;
  const text = content.quote.uppfart;
  const quoteRoute = content.routes.find((route) => route.href === quotePath);
  const [kind, setKind] = useState(selectedKind);
  const [values, setValues] = useState<Values>(defaults);
  const [includeAsphalt, setIncludeAsphalt] = useState(true);
  const [notes, setNotes] = useState("");

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

  const area = Number(values.area);
  const loads = Number(values.loads);
  const valid = values.area.trim() !== "" && values.loads.trim() !== "" && Number.isFinite(area) && area > 0 && area <= maximumQuantity && Number.isFinite(loads) && loads >= 0 && Number.isInteger(loads) && loads <= maximumQuantity;
  const total = drivewayTotal(area, loads, includeAsphalt);
  const email = buildQuoteMailto(text.mail, {
    area: number(area),
    loads: number(loads),
    asphalt: includeAsphalt ? text.asphaltYesLabel : text.asphaltNoLabel,
    total: money(total),
    vat: vatStatusLabel.toLowerCase(),
    notes,
  });
  function quantity(key: keyof Values, label: string, unit: string, min: string, step: string) {
    return <label className="quote-field"><span>{label}</span><span className="quote-input"><input type="number" min={min} max={maximumQuantity} step={step} value={values[key]} onChange={event => setValues({ ...values, [key]: event.target.value })} aria-invalid={!valid} aria-describedby="quote-quantity-help" /><span>{unit}</span></span></label>;
  }
  return <QuotePageShell homeLabel={content.chrome.breadcrumb.homeLabel} formAriaLabel={shared.formAriaLabel} hero={{ src: "/page-visuals/quote-hero.webp", srcSet: quoteRoute?.heroPhotoSrcSet, sizes: quoteRoute?.heroPhotoSizes }} breadcrumbLabel={text.breadcrumbLabel} heading={text.heading} intro={text.intro} resultAside={<QuoteResultAside shared={shared} error={text.error} valid={valid} total={money(total)} email={email} hidden={kind !== "uppfart"} />}>
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
      <div className="quote-fields">{quantity("area", text.areaLabel, text.areaUnit, "0.1", "any")}{quantity("loads", text.loadsLabel, text.loadsUnit, "0", "1")}</div>
      <p id="quote-quantity-help" className="quote-help">{text.quantityHelp}</p>
      <label className="quote-check"><input type="checkbox" checked={includeAsphalt} onChange={event => setIncludeAsphalt(event.target.checked)} /><span>{text.asphaltLabel}<span className="quote-help">{text.asphaltHelp}</span></span></label>
      <QuoteNotesField label={text.notesLabel} optionalLabel={text.notesOptionalLabel} placeholder={text.notesPlaceholder} value={notes} onChange={event => setNotes(event.target.value)} />
      <QuoteResetButton label={text.resetLabel} onReset={() => { setValues(defaults); setIncludeAsphalt(true); setNotes(""); }} />
    </div>
  </QuotePageShell>;
}
