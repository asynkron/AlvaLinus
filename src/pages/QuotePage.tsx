import { useState } from "react";
import { ArrowRight, RotateCcw, Printer } from "lucide-react";
import { Button } from "../components/ui/button";
import "./QuotePage.css";

const defaults = { area: "100", loads: "1", groundwork: "950", asphalt: "667", setup: "4900", loadPrice: "2000" };
type Values = typeof defaults;
const money = (value: number) => new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value);

export function QuotePage() {
  const [values, setValues] = useState<Values>(defaults);
  const [includeAsphalt, setIncludeAsphalt] = useState(true);
  const [vat, setVat] = useState("unknown");
  const [notes, setNotes] = useState("");
  const valid = Object.entries(values).every(([key, value]) => value.trim() !== "" && Number.isFinite(Number(value)) && Number(value) >= 0 && Number(value) <= (key === "area" || key === "loads" ? 100000 : 10000000)) && Number(values.area) > 0 && Number.isInteger(Number(values.loads));
  const n = (key: keyof Values) => Number(values[key]);
  const rows = [
    { label: "Markarbete", detail: `${values.area} m² × ${money(n("groundwork"))}`, amount: n("area") * n("groundwork") },
    ...(includeAsphalt ? [{ label: "Asfalt", detail: `${values.area} m² × ${money(n("asphalt"))}`, amount: n("area") * n("asphalt") }] : []),
    { label: "Etablering", detail: "Fast kostnad", amount: n("setup") },
    { label: "Transport / lass", detail: `${values.loads} lass × ${money(n("loadPrice"))}`, amount: n("loads") * n("loadPrice") },
  ];
  const subtotal = rows.reduce((sum, row) => sum + row.amount, 0);
  const total = vat === "exclusive" ? subtotal * 1.25 : subtotal;
  const vatLabel = vat === "unknown" ? "Momsstatus ej bekräftad" : "Inklusive 25 % moms";
  const email = `mailto:kontakt@svardentreprenad.se?subject=${encodeURIComponent("Offertförfrågan – asfalterad uppfart")}&body=${encodeURIComponent(`Hej! Jag önskar en offert för min uppfart.\n\n${rows.map(row => `${row.label}: ${row.detail} = ${money(row.amount)}`).join("\n")}\nPreliminär summa: ${money(total)} (${vatLabel}).\nExempelpriser och omfattning behöver bekräftas.\n\nProjekt / plats / kontaktuppgifter:\n${notes}`)}`;
  function field(key: keyof Values, label: string, unit: string) {
    return <label className="quote-field" key={key}><span>{label}</span><span className="quote-input"><input type="number" min={key === "area" ? "0.1" : "0"} max={key === "area" || key === "loads" ? "100000" : "10000000"} step={key === "loads" ? "1" : "0.1"} value={values[key]} onChange={event => setValues({ ...values, [key]: event.target.value })} /><span>{unit}</span></span></label>;
  }
  return <>
    <section className="quote-intro">
      <img className="quote-hero-image" src="/page-visuals/quote-hero.png" alt="" aria-hidden="true" fetchPriority="high" onError={event => { event.currentTarget.style.display = "none"; }} />
      <div className="quote-wrap"><a href="/">Hem</a><span aria-hidden="true"> / </span><span>Offertberäkning</span><h1>Vad kostar din nya uppfart?</h1><p>Från kvadratmeter till kostnadsbild. Fyll i dina mått och få ett preliminärt underlag att prata vidare om.</p></div>
    </section>
    <div className="quote-wrap quote-layout">
      <section aria-label="Projektets förutsättningar" className="quote-form">
        <h2>Räkna på ditt projekt</h2><p>Asfalterad uppfart med markarbete och transport.</p>
        <div className="quote-fields">{field("area", "Uppfartens yta", "m²")}{field("loads", "Antal lass", "st")}</div>
        <label className="quote-check"><input type="checkbox" checked={includeAsphalt} onChange={event => setIncludeAsphalt(event.target.checked)} /><span>Inkludera asfalt<span className="quote-help">Avmarkera för att bara beräkna markarbete.</span></span></label>
        <details className="quote-prices" open><summary>Priser och beräkningsgrund</summary><p>Exempelpriser från kundunderlaget. Vi tolkar 950 kr/m² som markarbete och 667 kr/m² som tillkommande asfalt. Ändra priserna vid behov.</p><div className="quote-fields">{field("groundwork", "Markarbete", "kr/m²")}{field("asphalt", "Asfalt", "kr/m²")}{field("setup", "Etablering", "kr")}{field("loadPrice", "Pris per lass", "kr/st")}</div><label className="quote-field"><span>Hur är priserna angivna?</span><select value={vat} onChange={event => setVat(event.target.value)}><option value="unknown">Momsstatus ej bekräftad</option><option value="inclusive">Inklusive 25 % moms</option><option value="exclusive">Exklusive 25 % moms</option></select></label><p>Välj momsstatus först när prisunderlaget är bekräftat. Inget ROT-avdrag ingår i kalkylen.</p></details>
        <label className="quote-field"><span>Om ditt projekt <small>(valfritt)</small></span><textarea rows={3} maxLength={1500} placeholder="Plats, nuvarande underlag och önskad tid för arbetet…" value={notes} onChange={event => setNotes(event.target.value)} /></label>
        <button className="quote-reset" onClick={() => { setValues(defaults); setIncludeAsphalt(true); setVat("unknown"); setNotes(""); }}><RotateCcw size={16} aria-hidden="true" />Återställ exempel</button>
      </section>
      <aside className="quote-result" aria-label="Din beräkning"><h2>Din kostnadsbild</h2><p className="quote-result-caption">Preliminärt underlag · exempelpriser</p><div aria-live="polite" aria-atomic="true">{valid ? <><dl className="quote-lines">{rows.map(row => <div key={row.label}><dt>{row.label}<small>{row.detail}</small></dt><dd>{money(row.amount)}</dd></div>)}{vat === "exclusive" && <div><dt>Moms 25 %</dt><dd>{money(subtotal * .25)}</dd></div>}</dl><div className="quote-total"><span>Beräknad totalsumma</span><strong>{money(total)}</strong><span>{vatLabel}</span></div>{vat === "inclusive" && <p>Varav moms: {money(subtotal / 5)}</p>}</> : <p role="alert" className="quote-error">Ange en yta större än 0, ett helt antal lass och giltiga, icke-negativa priser. Yta och antal lass får vara högst 100 000.</p>}</div><p className="quote-disclaimer">Detta är en uppskattning, inte en bindande offert. Markförhållanden, åtkomst och arbetets omfattning behöver bedömas innan ett slutpris kan lämnas.</p><Button asChild disabled={!valid} className="quote-send">{valid ? <a href={email}>Begär offert på underlaget<ArrowRight size={18} aria-hidden="true" /></a> : <button disabled>Kontrollera dina uppgifter</button>}</Button><p className="quote-mail-help">Öppnar ditt e-postprogram. Inget skickas automatiskt.</p><button className="quote-print" onClick={() => window.print()} disabled={!valid}><Printer size={16} aria-hidden="true" />Skriv ut / spara som PDF</button></aside>
    </div>
  </>;
}
