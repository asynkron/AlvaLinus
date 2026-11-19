import { ArrowRight, Link2, Printer, RotateCcw } from "lucide-react";
import { useId, useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
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
  readonly vatLabel: string;
  readonly shared: SiteQuoteShared;
  readonly error: string;
  readonly valid: boolean;
  readonly total: string;
  readonly email: string;
  readonly hidden?: boolean;
  readonly shareHref: string;
  readonly individualQuote?: string;
};

export function QuoteResultAside({ shared, error, valid, total, email, hidden, shareHref, individualQuote, vatLabel }: QuoteResultAsideProps) {
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  function share() {
    window.history.replaceState(null, "", shareHref);
    setShareLink(shareHref);
    const write = navigator.clipboard?.writeText(shareHref);
    if (write) {
      void write.then(() => setShareMessage(shared.shareCopiedMessage), () => setShareMessage(shared.shareFallbackMessage));
    } else {
      setShareMessage(shared.shareFallbackMessage);
    }
  }

  return <aside className="quote-result" aria-label={shared.resultAriaLabel} hidden={hidden}>
    <div aria-live="polite" aria-atomic="true">
      <h2>{individualQuote ? shared.individualQuoteHeading : shared.resultHeading}</h2>
      {!individualQuote ? <p className="quote-result-caption">{shared.resultCaption}</p> : null}
      {individualQuote
        ? <p className="quote-individual">{individualQuote}</p>
        : valid
        ? <div className="quote-total"><span>{shared.totalLabel}</span><strong>{total}</strong><span>{vatLabel}</span></div>
        : <p role="alert" className="quote-error">{error}</p>}
    </div>
    {!individualQuote ? <p className="quote-disclaimer">{shared.disclaimer}</p> : null}
    <Button asChild disabled={!valid} className="quote-send">{valid ? <a href={email}>{individualQuote ? shared.individualQuoteSendLabel : shared.sendLabel}<ArrowRight size={18} aria-hidden="true" /></a> : <button disabled>{shared.sendInvalidLabel}</button>}</Button>
    <p className="quote-mail-help">{shared.mailHelp}</p>
    <button className="quote-print" onClick={() => window.print()} disabled={!valid || Boolean(individualQuote)}><Printer size={16} aria-hidden="true" />{shared.printLabel}</button>
    <button className="quote-share" onClick={share} disabled={!valid}><Link2 size={16} aria-hidden="true" />{shared.shareLabel}</button>
    {shareLink ? <p className="quote-share-link"><a href={shareLink}>{shareLink}</a></p> : null}
    <p className="quote-share-help">{shared.shareHelp}</p>
    <p role="status" className="quote-share-status">{shareMessage}</p>
  </aside>;
}

export function QuoteVatField({ shared, includeVat, onChange }: {
  readonly shared: SiteQuoteShared;
  readonly includeVat: boolean;
  readonly onChange: (includeVat: boolean) => void;
}) {
  const name = useId();
  return <fieldset className="quote-vat">
    <legend>{shared.vatLegend}</legend>
    <div className="quote-vat-options">
      <label><input type="radio" name={name} value="inclusive" checked={includeVat} onChange={() => onChange(true)} />{shared.vatInclusiveLabel}</label>
      <label><input type="radio" name={name} value="exclusive" checked={!includeVat} onChange={() => onChange(false)} />{shared.vatExclusiveLabel}</label>
    </div>
  </fieldset>;
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
