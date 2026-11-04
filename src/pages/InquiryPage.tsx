import { ArrowRight } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";

import { Button } from "../components/ui/button";
import { siteContent } from "../data/siteContent";
import "./InquiryPage.css";

const inquiryDefaults = {
  company: "",
  person: "",
  email: "",
  phone: "",
  org: "",
  work: "",
  rate: "",
  duration: "",
  description: "",
};

export type InquiryValues = typeof inquiryDefaults;
export type InquiryFieldKey = keyof InquiryValues;

export const inquiryFieldOrder: readonly InquiryFieldKey[] = [
  "company",
  "person",
  "email",
  "phone",
  "org",
  "work",
  "rate",
  "duration",
  "description",
];

export const inquiryEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type InquiryErrors = Partial<Record<InquiryFieldKey, string>>;

export function validateInquiry(values: InquiryValues): InquiryErrors {
  const errors: InquiryErrors = {};

  if (values.company.trim() === "") {
    errors.company = "Ange företagets namn.";
  }

  if (values.person.trim() === "") {
    errors.person = "Ange en kontaktperson.";
  }

  if (values.email.trim() === "") {
    errors.email = "Ange en e-postadress så att vi kan återkomma till er.";
  } else if (!inquiryEmailPattern.test(values.email.trim())) {
    errors.email = "Ange en giltig e-postadress, till exempel namn@foretag.se.";
  }

  if (values.work.trim() === "") {
    errors.work = "Beskriv vad ni behöver inhyrd hjälp med.";
  }

  if (values.rate.trim() === "") {
    errors.rate = "Ange erbjudet timpris som ett belopp i kronor.";
  } else if (!Number.isFinite(Number(values.rate))) {
    errors.rate = "Timpriset ska vara ett belopp i kronor, till exempel 650.";
  } else if (Number(values.rate) < 0) {
    errors.rate = "Timpriset kan inte vara ett negativt belopp.";
  }

  if (values.duration.trim() === "") {
    errors.duration = "Ange hur länge uppdraget gäller.";
  }

  if (values.description.trim() === "") {
    errors.description = "Beskriv ärendet.";
  }

  return errors;
}

export function inquiryMailtoHref(
  values: InquiryValues,
  recipient: string = siteContent.contact.form.recipientEmail,
): string {
  const subject = "Förfrågan om inhyrning";
  const orDash = (value: string) => (value.trim() === "" ? "–" : value.trim());
  const body = [
    "Förfrågan om inhyrning via webbplatsen.",
    "",
    `Företag: ${values.company.trim()}`,
    `Kontaktperson: ${values.person.trim()}`,
    `E-post: ${values.email.trim()}`,
    `Telefon: ${orDash(values.phone)}`,
    `Organisationsnummer: ${orDash(values.org)}`,
    `Behov av inhyrning: ${values.work.trim()}`,
    `Erbjudet timpris: ${values.rate.trim()} kr/timme`,
    `Uppdragets längd: ${values.duration.trim()}`,
    "Beskriv ärendet:",
    values.description.trim(),
  ].join("\n");

  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

type InquiryFieldSpec = {
  readonly key: InquiryFieldKey;
  readonly label: string;
  readonly optional?: boolean;
  readonly type?: "email" | "tel" | "number";
  readonly autoComplete?: string;
  readonly placeholder: string;
  readonly hint?: string;
  readonly inputMode?: "decimal";
  readonly min?: string;
  readonly step?: string;
  readonly rows?: number;
};

const inquiryFields: Record<InquiryFieldKey, InquiryFieldSpec> = {
  company: { key: "company", label: "Företagets namn", autoComplete: "organization", placeholder: "Företagets namn" },
  person: { key: "person", label: "Kontaktperson", autoComplete: "name", placeholder: "För- och efternamn" },
  email: { key: "email", label: "E-post", type: "email", autoComplete: "email", placeholder: "namn@foretag.se" },
  phone: { key: "phone", label: "Telefon", optional: true, type: "tel", autoComplete: "tel", placeholder: "Telefonnummer" },
  org: { key: "org", label: "Organisationsnummer", optional: true, placeholder: "Organisationsnummer" },
  work: {
    key: "work",
    label: "Vad behöver ni inhyrd hjälp med?",
    placeholder: "Till exempel grävmaskinist eller markarbete",
  },
  rate: {
    key: "rate",
    label: "Erbjudet timpris",
    type: "number",
    inputMode: "decimal",
    min: "0",
    step: "any",
    placeholder: "Belopp i kr per timme",
    hint: "Ange gärna i beskrivningen om priset är inklusive eller exklusive moms.",
  },
  duration: { key: "duration", label: "Hur länge gäller uppdraget?", placeholder: "Till exempel 3 veckor eller april–juni" },
  description: {
    key: "description",
    label: "Beskriv ärendet",
    placeholder: "Beskriv uppdraget, platsen och övrigt som är bra för oss att veta.",
    rows: 6,
  },
};

const inquiryPairFields: readonly InquiryFieldKey[] = ["person", "email", "phone", "org"];

type InquiryPageProps = {
  readonly openDraft?: (href: string) => void;
};

function openDefaultMailDraft(href: string) {
  location.href = href;
}

export function InquiryPage({ openDraft = openDefaultMailDraft }: InquiryPageProps) {
  const [values, setValues] = useState<InquiryValues>(inquiryDefaults);
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [draftHref, setDraftHref] = useState("");
  const recipient = siteContent.contact.form.recipientEmail;

  function updateValue(key: InquiryFieldKey, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const value = event.target.value;
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!(key in current)) {
        return current;
      }

      const remaining = { ...current };
      delete remaining[key];
      return remaining;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateInquiry(values);
    setErrors(nextErrors);
    setDraftHref("");

    const firstInvalid = inquiryFieldOrder.find((key) => key in nextErrors);

    if (firstInvalid !== undefined) {
      document.getElementById(`inquiry-${firstInvalid}`)?.focus();
      return;
    }

    const href = inquiryMailtoHref(values);
    setDraftHref(href);
    openDraft(href);
  }

  function renderField(field: InquiryFieldSpec) {
    const error = errors[field.key];
    const describedBy = [
      field.hint ? `inquiry-${field.key}-hint` : "",
      error ? `inquiry-${field.key}-error` : "",
    ]
      .filter(Boolean)
      .join(" ");
    const shared = {
      id: `inquiry-${field.key}`,
      name: field.key,
      required: !field.optional,
      placeholder: field.placeholder,
      value: values[field.key],
      onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateValue(field.key, event),
      "aria-invalid": error ? true : undefined,
      "aria-describedby": describedBy === "" ? undefined : describedBy,
      className: error ? "inquiry-invalid" : undefined,
    };

    return (
      <div className="inquiry-field" key={field.key}>
        <label htmlFor={`inquiry-${field.key}`}>
          {field.label}
          {field.optional ? <small> (valfritt)</small> : null}
        </label>
        {field.rows !== undefined ? (
          <textarea {...shared} rows={field.rows} />
        ) : (
          <input
            {...shared}
            type={field.type}
            autoComplete={field.autoComplete}
            inputMode={field.inputMode}
            min={field.min}
            step={field.step}
          />
        )}
        {field.hint ? (
          <small id={`inquiry-${field.key}-hint`} className="inquiry-hint">
            {field.hint}
          </small>
        ) : null}
        {error ? (
          <span id={`inquiry-${field.key}-error`} className="inquiry-error">
            {error}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <>
      <section className="inquiry-intro">
        <img
          className="inquiry-hero-image"
          src={siteContent.routes.find((route) => route.kind === "inquiry")?.heroPhotoAssetPath}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
        <div className="inquiry-wrap">
          <nav aria-label={siteContent.chrome.breadcrumb.ariaLabel} className="inquiry-crumb">
            <a href="/">{siteContent.chrome.breadcrumb.homeLabel}</a>
            <span className="inquiry-crumb-separator" aria-hidden="true">
              /
            </span>
            <span>För företag</span>
          </nav>
          <h1>Söker ni en F-skattare?</h1>
          <p>Berätta om ert företag och uppdrag, så får vi ett bra underlag för att återkomma till er.</p>
        </div>
      </section>
      <div className="inquiry-wrap inquiry-layout">
        <section aria-labelledby="inquiry-form-heading">
          <h2 id="inquiry-form-heading">Skicka en förfrågan</h2>
          <p className="inquiry-form-note">
            Fyll i uppgifterna nedan. Alla fält är obligatoriska om inget annat anges.
          </p>
          <form aria-label="Förfrågan om inhyrning" noValidate onSubmit={handleSubmit}>
            {Object.keys(errors).length > 0 ? (
              <p role="alert" className="inquiry-alert" tabIndex={-1}>
                Formuläret kan inte skickas än. Kontrollera fälten med felmeddelanden nedan och försök igen.
              </p>
            ) : null}
            {renderField(inquiryFields.company)}
            <div className="inquiry-fields">
              {inquiryPairFields.map((key) => renderField(inquiryFields[key]))}
            </div>
            {renderField(inquiryFields.work)}
            {renderField(inquiryFields.rate)}
            {renderField(inquiryFields.duration)}
            {renderField(inquiryFields.description)}
            <Button type="submit" className="inquiry-send">
              Skicka förfrågan
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
            <p className="inquiry-help">
              Öppnar ett utkast i ditt e-postprogram till {recipient}. Inget skickas automatiskt – ni skickar mejlet
              själva.
            </p>
            {draftHref ? (
              <div role="status" className="inquiry-confirmation">
                <p>
                  Webbplatsen har bett ditt e-postprogram öppna ett utkast till {recipient} med uppgifterna ifyllda.
                  Granska utkastet och skicka mejlet själv – webbplatsen kan inte skicka eller bekräfta att mejlet har
                  levererats.
                </p>
                <p>
                  Öppnas inte ditt e-postprogram? <a href={draftHref}>Öppna utkastet igen</a>.
                </p>
              </div>
            ) : null}
          </form>
        </section>
        <aside className="inquiry-side" aria-label="Bra att veta inför förfrågan">
          <h2>En tydlig start</h2>
          <p>
            Med information om företaget, uppdraget och tidsperioden kan vi ta ställning till förfrågan och kontakta er
            för en genomgång.
          </p>
          <ul>
            <li>Beskriv vilken hjälp ni behöver</li>
            <li>Ange erbjudet timpris och tidsperiod</li>
            <li>Lämna kontaktuppgifter så vi kan återkomma</li>
          </ul>
        </aside>
      </div>
    </>
  );
}
