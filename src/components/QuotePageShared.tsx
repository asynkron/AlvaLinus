import { ArrowRight, Printer, RotateCcw } from "lucide-react";
import type { ChangeEvent, ReactNode } from "react";
import { vatStatusLabel } from "../lib/quote";
import type { SiteQuoteShared } from "../types/site";
import { Button } from "./ui/button";

type QuoteHeroImage = {
  readonly src: string;
  readonly srcSet?: string;
  readonly sizes?: string;
};

type QuotePageShellProps = {
  readonly homeLabel: string;
  readonly formAriaLabel: string;
  readonly hero: QuoteHeroImage;
  readonly breadcrumbLabel: string;
  readonly heading: string;
  readonly intro: string;
  readonly resultAside: ReactNode;
  readonly children: ReactNode;
};

export function QuotePageShell({ homeLabel, formAriaLabel, hero, breadcrumbLabel, heading, intro, resultAside, children }: QuotePageShellProps) {
  return <>
    <section className="quote-intro">
      <img className="quote-hero-image" src={hero.src} srcSet={hero.srcSet} sizes={hero.sizes} alt="" aria-hidden="true" fetchPriority="high" onError={event => { event.currentTarget.style.display = "none"; }} />
      <div className="quote-wrap"><a href="/">{homeLabel}</a><span aria-hidden="true"> / </span><span>{breadcrumbLabel}</span><h1>{heading}</h1><p>{intro}</p></div>
    </section>
    <div className="quote-wrap quote-layout">
      <section aria-label={formAriaLabel} className="quote-form">{children}</section>
      {resultAside}
    </div>
  </>;
}

type QuoteResultAsideProps = {
  readonly shared: SiteQuoteShared;
  readonly error: string;
  readonly valid: boolean;
  readonly total: string;
  readonly email: string;
  readonly hidden?: boolean;
};

export function QuoteResultAside({ shared, error, valid, total, email, hidden }: QuoteResultAsideProps) {
  return <aside className="quote-result" aria-label={shared.resultAriaLabel} hidden={hidden}>
    <h2>{shared.resultHeading}</h2>
    <p className="quote-result-caption">{shared.resultCaption}</p>
    <div aria-live="polite" aria-atomic="true">
      {valid
        ? <div className="quote-total"><span>{shared.totalLabel}</span><strong>{total}</strong><span>{vatStatusLabel}</span></div>
        : <p role="alert" className="quote-error">{error}</p>}
    </div>
    <p className="quote-disclaimer">{shared.disclaimer}</p>
    <Button asChild disabled={!valid} className="quote-send">{valid ? <a href={email}>{shared.sendLabel}<ArrowRight size={18} aria-hidden="true" /></a> : <button disabled>{shared.sendInvalidLabel}</button>}</Button>
    <p className="quote-mail-help">{shared.mailHelp}</p>
    <button className="quote-print" onClick={() => window.print()} disabled={!valid}><Printer size={16} aria-hidden="true" />{shared.printLabel}</button>
  </aside>;
}

type QuoteNotesFieldProps = {
  readonly label: string;
  readonly optionalLabel: string;
  readonly placeholder: string;
  readonly value: string;
  readonly onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
};

export function QuoteNotesField({ label, optionalLabel, placeholder, value, onChange }: QuoteNotesFieldProps) {
  return <label className="quote-field"><span>{label} <small>{optionalLabel}</small></span><textarea rows={3} maxLength={1500} placeholder={placeholder} value={value} onChange={onChange} /></label>;
}

type QuoteResetButtonProps = {
  readonly label: string;
  readonly onReset: () => void;
};

export function QuoteResetButton({ label, onReset }: QuoteResetButtonProps) {
  return <button className="quote-reset" onClick={onReset}><RotateCcw size={16} aria-hidden="true" />{label}</button>;
}
