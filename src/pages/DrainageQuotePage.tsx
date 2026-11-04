import { useState } from "react";
import { ArrowRight, Printer, RotateCcw } from "lucide-react";
import { Button } from "../components/ui/button";
import { drainageTotal, formatMoney, formatNumber, vatStatusLabel } from "../lib/quote";
import "./QuotePage.css";

const defaultLength = "40";
const maximumMeters = 100000;
const money = formatMoney;
const meters = formatNumber;

export function DrainageQuotePage() {
  const [length, setLength] = useState(defaultLength);
  const [notes, setNotes] = useState("");
  const lengthValue = Number(length);
  const valid = length.trim() !== "" && Number.isFinite(lengthValue) && lengthValue > 0 && lengthValue <= maximumMeters;
  const total = drainageTotal(lengthValue);
  const email = `mailto:kontakt@svardentreprenad.se?subject=${encodeURIComponent("Offertförfrågan – husdränering")}&body=${encodeURIComponent(`Hej! Jag önskar en offert för husdränering.\n\nLängd: ${meters(lengthValue)} löpmeter\nPreliminär summa: ${money(total)} (${vatStatusLabel.toLowerCase()}).\nOmfattning behöver bekräftas.\n\nProjekt / plats / kontaktuppgifter:\n${notes}`)}`;
  return <>
    <section className="quote-intro">
      <img className="quote-hero-image" src="/page-visuals/draneringsberakning-hero.webp" alt="" aria-hidden="true" fetchPriority="high" onError={event => { event.currentTarget.style.display = "none"; }} />
      <div className="quote-wrap"><a href="/">Hem</a><span aria-hidden="true"> / </span><span>Dräneringsberäkning</span><h1>Vad kostar din dränering?</h1><p>Fyll i längden runt huset och få ett preliminärt underlag att prata vidare om.</p></div>
    </section>
    <div className="quote-wrap quote-layout">
      <section aria-label="Projektets förutsättningar" className="quote-form">
        <h2>Husdränering</h2><p>Dränering runt husgrund med schaktning, fuktskydd och återfyllning.</p>
        <label className="quote-field">
          <span>Dräneringens längd</span>
          <span className="quote-input">
            <input type="number" min="0.1" max={maximumMeters} step="any" value={length} onChange={event => setLength(event.target.value)} aria-invalid={!valid} aria-describedby="meter-help" />
            <span>löpmeter</span>
          </span>
          <small id="meter-help">Ange en längd större än noll.</small>
        </label>
        <h2>Det här ingår</h2>
        <p>Etablering och schaktning längs husgrund, dräneringsrör och dränerande material, fuktskydd, återfyllning och grovåterställning samt borttransport av överblivna massor.</p>
        <p>Exemplet utgår från normal åtkomst och markförhållanden. Eventuella tilläggsarbeten stäms av innan de utförs.</p>
        <label className="quote-field"><span>Om ditt projekt <small>(valfritt)</small></span><textarea rows={3} maxLength={1500} placeholder="Plats, förutsättningar och önskad tid för arbetet…" value={notes} onChange={event => setNotes(event.target.value)} /></label>
        <button className="quote-reset" onClick={() => { setLength(defaultLength); setNotes(""); }}><RotateCcw size={16} aria-hidden="true" />Återställ exempel</button>
        <p className="quote-help">Ska du istället bygga en uppfart? <a href="/offertberakning/">Räkna på uppfart</a></p>
      </section>
      <aside className="quote-result" aria-label="Din beräkning">
        <h2>Din kostnadsbild</h2>
        <p className="quote-result-caption">Preliminärt underlag</p>
        <div aria-live="polite" aria-atomic="true">
          {valid
            ? <div className="quote-total"><span>Beräknad totalsumma</span><strong>{money(total)}</strong><span>{vatStatusLabel}</span></div>
            : <p role="alert" className="quote-error">Ange en längd större än 0 och högst 100 000 meter.</p>}
        </div>
        <p className="quote-disclaimer">Detta är en uppskattning, inte en bindande offert. Markförhållanden, åtkomst och omfattning bedöms innan slutpris lämnas. Eventuellt ROT-avdrag och betalningsvillkor specificeras i den verkliga offerten.</p>
        <Button asChild disabled={!valid} className="quote-send">{valid ? <a href={email}>Begär offert på underlaget<ArrowRight size={18} aria-hidden="true" /></a> : <button disabled>Kontrollera dina uppgifter</button>}</Button>
        <p className="quote-mail-help">Öppnar ditt e-postprogram. Inget skickas automatiskt.</p>
        <button className="quote-print" onClick={() => window.print()} disabled={!valid}><Printer size={16} aria-hidden="true" />Skriv ut / spara som PDF</button>
      </aside>
    </div>
  </>;
}
