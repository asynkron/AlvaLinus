import { useEffect, useState } from "react";
import { ArrowRight, Printer, RotateCcw } from "lucide-react";
import { Button } from "../components/ui/button";
import { drivewayTotal, formatMoney, formatNumber, vatStatusLabel } from "../lib/quote";
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

export function QuotePage() {
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
  const email = `mailto:kontakt@svardentreprenad.se?subject=${encodeURIComponent("Offertförfrågan – uppfart")}&body=${encodeURIComponent(`Hej! Jag önskar en offert för uppfart.\n\nYta: ${number(area)} m²\nAntal lass: ${number(loads)}\nAsfalt: ${includeAsphalt ? "Ja" : "Nej"}\nPreliminär summa: ${money(total)} (${vatStatusLabel.toLowerCase()}).\nOmfattning behöver bekräftas.\n\nProjekt / plats / kontaktuppgifter:\n${notes}`)}`;
  function quantity(key: keyof Values, label: string, unit: string, min: string, step: string) {
    return <label className="quote-field"><span>{label}</span><span className="quote-input"><input type="number" min={min} max={maximumQuantity} step={step} value={values[key]} onChange={event => setValues({ ...values, [key]: event.target.value })} aria-invalid={!valid} aria-describedby="quote-quantity-help" /><span>{unit}</span></span></label>;
  }
  return <>
    <section className="quote-intro">
      <img className="quote-hero-image" src="/page-visuals/quote-hero.png" alt="" aria-hidden="true" fetchPriority="high" onError={event => { event.currentTarget.style.display = "none"; }} />
      <div className="quote-wrap"><a href="/">Hem</a><span aria-hidden="true"> / </span><span>Offertberäkning</span><h1>Räkna på ditt projekt</h1><p>Välj vad du vill ha hjälp med för att få en preliminär kostnadsbild.</p></div>
    </section>
    <div className="quote-wrap quote-layout">
      <section aria-label="Projektets förutsättningar" className="quote-form">
        <div className="quote-choice" hidden={kind === "uppfart"}>
          <h2>Vad gäller din offertförfrågan?</h2>
          <p>Välj vilken kalkyl du vill använda.</p>
          <div className="choice-buttons">
            <a href="/draneringsberakning/">Räkna på husdränering<ArrowRight size={16} aria-hidden="true" /></a>
            <a href={uppfartHash}>Räkna på uppfart<ArrowRight size={16} aria-hidden="true" /></a>
          </div>
        </div>
        {kind === "uppfart" ? <a className="quote-back-choice" href={quotePath}>← Välj annan kalkyl</a> : null}
        <div className="quote-work" hidden={kind !== "uppfart"}>
          <h2>Uppfart</h2><p>Asfalterad uppfart med markarbete och transport.</p>
          <div className="quote-fields">{quantity("area", "Uppfartens yta", "m²", "0.1", "any")}{quantity("loads", "Antal lass", "st", "0", "1")}</div>
          <p id="quote-quantity-help" className="quote-help">Ange en yta större än noll och ett helt antal lass.</p>
          <label className="quote-check"><input type="checkbox" checked={includeAsphalt} onChange={event => setIncludeAsphalt(event.target.checked)} /><span>Inkludera asfalt<span className="quote-help">Avmarkera för att bara beräkna markarbete.</span></span></label>
          <label className="quote-field"><span>Om ditt projekt <small>(valfritt)</small></span><textarea rows={3} maxLength={1500} placeholder="Plats, nuvarande underlag och önskad tid för arbetet…" value={notes} onChange={event => setNotes(event.target.value)} /></label>
          <button className="quote-reset" onClick={() => { setValues(defaults); setIncludeAsphalt(true); setNotes(""); }}><RotateCcw size={16} aria-hidden="true" />Återställ exempel</button>
        </div>
      </section>
      <aside className="quote-result" aria-label="Din beräkning" hidden={kind !== "uppfart"}>
        <h2>Din kostnadsbild</h2>
        <p className="quote-result-caption">Preliminärt underlag</p>
        <div aria-live="polite" aria-atomic="true">
          {valid
            ? <div className="quote-total"><span>Beräknad totalsumma</span><strong>{money(total)}</strong><span>{vatStatusLabel}</span></div>
            : <p role="alert" className="quote-error">Ange en yta större än 0, ett helt antal lass och högst 100 000.</p>}
        </div>
        <p className="quote-disclaimer">Detta är en uppskattning, inte en bindande offert. Markförhållanden, åtkomst och omfattning bedöms innan slutpris lämnas. Eventuellt ROT-avdrag och betalningsvillkor specificeras i den verkliga offerten.</p>
        <Button asChild disabled={!valid} className="quote-send">{valid ? <a href={email}>Begär offert på underlaget<ArrowRight size={18} aria-hidden="true" /></a> : <button disabled>Kontrollera dina uppgifter</button>}</Button>
        <p className="quote-mail-help">Öppnar ditt e-postprogram. Inget skickas automatiskt.</p>
        <button className="quote-print" onClick={() => window.print()} disabled={!valid}><Printer size={16} aria-hidden="true" />Skriv ut / spara som PDF</button>
      </aside>
    </div>
  </>;
}
