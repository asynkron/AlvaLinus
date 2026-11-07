import { ArrowRight } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";

import { Button } from "../components/ui/button";
import { siteContent } from "../data/siteContent";
import type { SiteInquiry } from "../types/site";
import "./InquiryPage.css";

const inquiry: SiteInquiry = siteContent.inquiry;

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
  const messages = inquiry.validation;

  if (values.company.trim() === "") {
    errors.company = messages.companyRequired;
  }

  if (values.person.trim() === "") {
    errors.person = messages.personRequired;
  }

  if (values.email.trim() === "") {
    errors.email = messages.emailRequired;
  } else if (!inquiryEmailPattern.test(values.email.trim())) {
    errors.email = messages.emailInvalid;
  }

  if (values.work.trim() === "") {
    errors.work = messages.workRequired;
  }

  if (values.rate.trim() === "") {
    errors.rate = messages.rateRequired;
  } else if (!Number.isFinite(Number(values.rate))) {
    errors.rate = messages.rateNotAmount;
  } else if (Number(values.rate) < 0) {
    errors.rate = messages.rateNegative;
  }

  if (values.duration.trim() === "") {
    errors.duration = messages.durationRequired;
  }

  if (values.description.trim() === "") {
    errors.description = messages.descriptionRequired;
  }

  return errors;
}

export function inquiryMailtoHref(
  values: InquiryValues,
  recipient: string = siteContent.contact.form.recipientEmail,
): string {
  const mail = inquiry.mail;
  const orDash = (value: string) => (value.trim() === "" ? mail.emptyValue : value.trim());
  const filled: Record<InquiryFieldKey, string> = {
    company: values.company.trim(),
    person: values.person.trim(),
    email: values.email.trim(),
    phone: orDash(values.phone),
    org: orDash(values.org),
    work: values.work.trim(),
    rate: values.rate.trim(),
    duration: values.duration.trim(),
    description: values.description.trim(),
  };
  const body = mail.bodyTemplate.replace(/\{(\w+)\}/g, (placeholder, key: string) =>
    key in filled ? filled[key as InquiryFieldKey] : placeholder,
  );

  return `mailto:${recipient}?subject=${encodeURIComponent(mail.subject)}&body=${encodeURIComponent(body)}`;
}

type InquiryFieldSpec = {
  readonly key: InquiryFieldKey;
  readonly optional?: boolean;
  readonly type?: "email" | "tel" | "number";
  readonly autoComplete?: string;
  readonly inputMode?: "decimal";
  readonly min?: string;
  readonly step?: string;
  readonly rows?: number;
};

const inquiryFields: Record<InquiryFieldKey, InquiryFieldSpec> = {
  company: { key: "company", autoComplete: "organization" },
  person: { key: "person", autoComplete: "name" },
  email: { key: "email", type: "email", autoComplete: "email" },
  phone: { key: "phone", optional: true, type: "tel", autoComplete: "tel" },
  org: { key: "org", optional: true },
  work: { key: "work" },
  rate: { key: "rate", type: "number", inputMode: "decimal", min: "0", step: "any" },
  duration: { key: "duration" },
  description: { key: "description", rows: 6 },
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
    const fieldText = inquiry.fields[field.key];
    const error = errors[field.key];
    const describedBy = [
      fieldText.hint ? `inquiry-${field.key}-hint` : "",
      error ? `inquiry-${field.key}-error` : "",
    ]
      .filter(Boolean)
      .join(" ");
    const shared = {
      id: `inquiry-${field.key}`,
      name: field.key,
      required: !field.optional,
      placeholder: fieldText.placeholder,
      value: values[field.key],
      onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateValue(field.key, event),
      "aria-invalid": error ? true : undefined,
      "aria-describedby": describedBy === "" ? undefined : describedBy,
      className: error ? "inquiry-invalid" : undefined,
    };

    return (
      <div className="inquiry-field" key={field.key}>
        <label htmlFor={`inquiry-${field.key}`}>
          {fieldText.label}
          {field.optional ? <small> {inquiry.optionalMark}</small> : null}
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
        {fieldText.hint ? (
          <small id={`inquiry-${field.key}-hint`} className="inquiry-hint">
            {fieldText.hint}
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
            <span>{inquiry.breadcrumbLabel}</span>
          </nav>
          <h1>{inquiry.heading}</h1>
          <p>{inquiry.intro}</p>
        </div>
      </section>
      <div className="inquiry-wrap inquiry-layout">
        <section aria-labelledby="inquiry-form-heading">
          <h2 id="inquiry-form-heading">{inquiry.formHeading}</h2>
          <p className="inquiry-form-note">{inquiry.formNote}</p>
          <form aria-label={inquiry.formAriaLabel} noValidate onSubmit={handleSubmit}>
            {Object.keys(errors).length > 0 ? (
              <p role="alert" className="inquiry-alert" tabIndex={-1}>
                {inquiry.errorSummary}
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
              {inquiry.submitLabel}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
            <p className="inquiry-help">{inquiry.mailHelpTemplate.replace("{recipient}", recipient)}</p>
            {draftHref ? (
              <div role="status" className="inquiry-confirmation">
                <p>{inquiry.confirmationTemplate.replace("{recipient}", recipient)}</p>
                <p>
                  {inquiry.reopenPrompt}{" "}
                  <a href={draftHref}>{inquiry.reopenLinkLabel}</a>.
                </p>
              </div>
            ) : null}
          </form>
        </section>
        <aside className="inquiry-side" aria-label={inquiry.asideAriaLabel}>
          <h2>{inquiry.asideHeading}</h2>
          <p>{inquiry.asideSummary}</p>
          <ul>
            {inquiry.asideItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
}
