import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { siteContent } from "../data/siteContent";
import {
  InquiryPage,
  inquiryFieldOrder,
  validateInquiry,
  type InquiryFieldKey,
} from "./InquiryPage";

const text = siteContent.inquiry;
const recipient = "linus.svardd@outlook.com";

const openMailDraftSpy = vi.fn();

const optionalFields: readonly InquiryFieldKey[] = ["phone", "org"];

const validValues: Record<InquiryFieldKey, string> = {
  company: "Mark & Bygg AB",
  person: "Anna Andersson",
  email: "anna@markbygg.se",
  phone: "070-123 45 67",
  org: "556677-8899",
  work: "Grävmaskinist",
  rate: "650",
  duration: "3 veckor från vecka 12",
  description: "Vi söker en grävmaskinist till ett bostadsbygge i Örebro.",
};

function fieldLabel(key: InquiryFieldKey): string {
  const label = text.fields[key].label;
  return optionalFields.includes(key) ? `${label} ${text.optionalMark}` : label;
}

function rateHint(): string {
  const hint = text.fields.rate.hint;

  if (hint === undefined) {
    throw new Error("Missing registry rate hint");
  }

  return hint;
}

function rateBasisLabel(): string {
  return `${text.rateBasis.label} ${text.optionalMark}`;
}

function statedRateBasis(): string {
  const option = text.rateBasis.options[1];

  if (option === undefined) {
    throw new Error("Missing registry momsstatus option");
  }

  return option;
}

function draftBody(values: Record<InquiryFieldKey, string>): string {
  return [
    "Förfrågan om inhyrning via webbplatsen.",
    "",
    `Företag: ${values.company}`,
    `Kontaktperson: ${values.person}`,
    `E-post: ${values.email}`,
    `Telefon: ${values.phone}`,
    `Organisationsnummer: ${values.org}`,
    `Behov av inhyrning: ${values.work}`,
    `Erbjudet timpris: ${values.rate} kr/timme`,
    `Uppdragets längd: ${values.duration}`,
    "Beskriv ärendet:",
    values.description,
  ].join("\n");
}

function fillField(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}

function fillValidForm(overrides: Partial<Record<InquiryFieldKey, string>> = {}) {
  for (const key of inquiryFieldOrder) {
    const value = key in overrides ? overrides[key] : validValues[key];
    if (value !== undefined) fillField(fieldLabel(key), value);
  }
}

function submit() {
  fireEvent.click(screen.getByRole("button", { name: text.submitLabel }));
}

function renderPage() {
  render(<InquiryPage openDraft={openMailDraftSpy} />);
}

describe("InquiryPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("collects the nine fields in mockup order with required and optional marks", () => {
    renderPage();

    const company = screen.getByLabelText(fieldLabel("company"));
    const description = screen.getByLabelText(fieldLabel("description"));
    expect(company.compareDocumentPosition(description) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByRole("form", { name: text.formAriaLabel })).toBeInTheDocument();

    for (const key of inquiryFieldOrder) {
      if (optionalFields.includes(key)) {
        expect(screen.getByLabelText(fieldLabel(key))).not.toHaveAttribute("required");
      } else {
        expect(screen.getByLabelText(fieldLabel(key))).toHaveAttribute("required");
      }
    }

    expect(screen.getByLabelText(fieldLabel("company"))).toHaveAttribute("autocomplete", "organization");
    expect(screen.getByLabelText(fieldLabel("person"))).toHaveAttribute("autocomplete", "name");
    expect(screen.getByLabelText(fieldLabel("email"))).toHaveAttribute("type", "email");
    expect(screen.getByLabelText(fieldLabel("phone"))).toHaveAttribute("type", "tel");
    expect(screen.getByLabelText(fieldLabel("rate"))).toHaveAttribute("min", "0");

    const hint = screen.getByText(rateHint());
    expect(hint).toHaveAttribute("id", "inquiry-rate-hint");
    expect(screen.getByLabelText(fieldLabel("rate"))).toHaveAttribute("aria-describedby", "inquiry-rate-hint");
    expect(screen.getByText(text.formHeading)).toBeInTheDocument();
    expect(screen.getByText(text.asideHeading)).toBeInTheDocument();
    expect(screen.getByText(text.mailHelpTemplate.replace("{recipient}", recipient))).toBeInTheDocument();
  });

  it("explains every missing required field in Swedish and focuses the first invalid field", () => {
    renderPage();
    submit();

    expect(openMailDraftSpy).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent(text.errorSummary);
    expect(screen.getByText(text.validation.companyRequired)).toBeInTheDocument();
    expect(screen.getByText(text.validation.personRequired)).toBeInTheDocument();
    expect(screen.getByText(text.validation.emailRequired)).toBeInTheDocument();
    expect(screen.getByText(text.validation.workRequired)).toBeInTheDocument();
    expect(screen.getByText(text.validation.rateRequired)).toBeInTheDocument();
    expect(screen.getByText(text.validation.durationRequired)).toBeInTheDocument();
    expect(screen.getByText(text.validation.descriptionRequired)).toBeInTheDocument();

    const company = screen.getByLabelText(fieldLabel("company"));
    expect(company).toHaveFocus();
    expect(company).toHaveAttribute("aria-invalid", "true");
    expect(company).toHaveAttribute("aria-describedby", "inquiry-company-error");
    expect(screen.getByLabelText(fieldLabel("phone"))).not.toHaveAttribute("aria-invalid");
    expect(screen.getByLabelText(fieldLabel("org"))).not.toHaveAttribute("aria-invalid");
  });

  it("explains an invalid email address and clears the error when the address is corrected", () => {
    renderPage();
    fillValidForm({ email: "anna@markbygg" });
    submit();

    expect(openMailDraftSpy).not.toHaveBeenCalled();
    expect(screen.getByText(text.validation.emailInvalid)).toBeInTheDocument();

    fillField(fieldLabel("email"), validValues.email);
    expect(screen.queryByText(text.validation.emailInvalid)).not.toBeInTheDocument();
  });

  it("rejects a negative offered hourly rate with a Swedish message", () => {
    renderPage();
    fillValidForm({ rate: "-50" });
    submit();

    expect(openMailDraftSpy).not.toHaveBeenCalled();
    expect(screen.getByText(text.validation.rateNegative)).toBeInTheDocument();
    expect(screen.getByLabelText(fieldLabel("rate"))).toHaveAttribute("aria-invalid", "true");
  });

  it("opens a mail draft to the existing contact address with every supplied detail and explains the manual send", () => {
    renderPage();
    fillValidForm();
    submit();

    expect(openMailDraftSpy).toHaveBeenCalledTimes(1);
    const href = openMailDraftSpy.mock.calls[0]?.[0] ?? "";
    expect(href).toContain(`mailto:${recipient}?`);

    const decoded = decodeURIComponent(href);
    expect(decoded).toContain(`subject=${text.mail.subject}`);
    expect(decoded).toContain(draftBody(validValues));

    const status = screen.getByRole("status");
    expect(status).toHaveTextContent(text.confirmationTemplate.replace("{recipient}", recipient));
    const reopen = screen.getByRole("link", { name: text.reopenLinkLabel });
    expect(reopen).toHaveAttribute("href", href);
  });

  it.each<{ key: InquiryFieldKey; value: string }>([
    { key: "company", value: "Nybygg & Söner AB" },
    { key: "person", value: "Erik Eriksson" },
    { key: "email", value: "erik@nybygg.se" },
    { key: "phone", value: "070-987 65 43" },
    { key: "org", value: "559988-7766" },
    { key: "work", value: "Hjullastarförare" },
    { key: "rate", value: "725" },
    { key: "duration", value: "6 veckor från vecka 20" },
    { key: "description", value: "Lastning vid ett vägbygge i Västerås." },
  ])("discards the prepared draft after editing $key and resubmits current details", ({ key, value }) => {
    renderPage();
    fillValidForm();
    submit();
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: text.reopenLinkLabel })).toBeInTheDocument();

    fillField(fieldLabel(key), value);

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: text.reopenLinkLabel })).not.toBeInTheDocument();
    expect(openMailDraftSpy).toHaveBeenCalledTimes(1);
    const updated = { ...validValues, [key]: value };
    for (const field of inquiryFieldOrder) {
      expect(screen.getByLabelText(fieldLabel(field))).toHaveValue(field === "rate" ? Number(updated[field]) : updated[field]);
    }

    submit();

    expect(openMailDraftSpy).toHaveBeenCalledTimes(2);
    const href = openMailDraftSpy.mock.calls[1]?.[0] ?? "";
    expect(decodeURIComponent(href)).toContain(draftBody(updated));
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: text.reopenLinkLabel })).toHaveAttribute("href", href);
  });

  it.each(["", statedRateBasis()])("discards the prepared draft when momsstatus changes to '%s'", (basis) => {
    renderPage();
    fillValidForm();
    fillField(rateBasisLabel(), basis === "" ? statedRateBasis() : "");
    submit();
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: text.reopenLinkLabel })).toBeInTheDocument();

    fillField(rateBasisLabel(), basis);

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: text.reopenLinkLabel })).not.toBeInTheDocument();
    expect(openMailDraftSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText(rateBasisLabel())).toHaveValue(basis);
    for (const field of inquiryFieldOrder) {
      expect(screen.getByLabelText(fieldLabel(field))).toHaveValue(field === "rate" ? Number(validValues[field]) : validValues[field]);
    }

    submit();

    expect(openMailDraftSpy).toHaveBeenCalledTimes(2);
    const href = openMailDraftSpy.mock.calls[1]?.[0] ?? "";
    expect(decodeURIComponent(href)).toContain(draftBody({
      ...validValues,
      rate: basis === "" ? "650" : `650 (${basis})`,
    }));
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: text.reopenLinkLabel })).toHaveAttribute("href", href);
  });

  it("keeps discarded feedback hidden through invalid submission and restoring the previous value", () => {
    renderPage();
    fillValidForm();
    submit();

    fillField(fieldLabel("email"), "invalid");
    submit();

    expect(openMailDraftSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText(fieldLabel("email"))).toHaveFocus();
    expect(screen.getByRole("alert")).toHaveTextContent(text.errorSummary);
    expect(screen.getByText(text.validation.emailInvalid)).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: text.reopenLinkLabel })).not.toBeInTheDocument();

    fillField(fieldLabel("email"), validValues.email);

    expect(screen.queryByText(text.validation.emailInvalid)).not.toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: text.reopenLinkLabel })).not.toBeInTheDocument();
    expect(openMailDraftSpy).toHaveBeenCalledTimes(1);

    submit();
    expect(openMailDraftSpy).toHaveBeenCalledTimes(2);
    expect(decodeURIComponent(openMailDraftSpy.mock.calls[1]?.[0] ?? "")).toContain(draftBody(validValues));
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("marks empty optional fields with a dash in the mail draft without blocking the handoff", () => {
    renderPage();
    fillValidForm({ phone: "", org: "" });
    submit();

    expect(openMailDraftSpy).toHaveBeenCalledTimes(1);
    const decoded = decodeURIComponent(openMailDraftSpy.mock.calls[0]?.[0] ?? "");
    expect(decoded).toContain(draftBody({ ...validValues, phone: text.mail.emptyValue, org: text.mail.emptyValue }));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("renders the declared optional momsstatus select after the rate field with registry copy", () => {
    renderPage();

    const rate = screen.getByLabelText(fieldLabel("rate"));
    const select = screen.getByLabelText(rateBasisLabel());
    expect(rate.compareDocumentPosition(select) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(select.tagName).toBe("SELECT");
    expect(select).not.toHaveAttribute("required");
    expect(select).toHaveValue("");
    expect(screen.getByRole("option", { name: text.rateBasis.emptyOption })).toBeInTheDocument();
    for (const option of text.rateBasis.options) {
      expect(screen.getByRole("option", { name: option })).toBeInTheDocument();
    }
    expect(screen.getByText(rateHint())).toHaveAttribute("id", "inquiry-rate-hint");
  });

  it("keeps validation in helper functions so optional fields stay out of the error set", () => {
    expect(Object.keys(validateInquiry(validValues))).toHaveLength(0);

    const empty = validateInquiry({
      company: "",
      person: "",
      email: "",
      phone: "",
      org: "",
      work: "",
      rate: "",
      duration: "",
      description: "",
    });
    expect(Object.keys(empty)).toEqual([
      ...inquiryFieldOrder.filter((key) => !optionalFields.includes(key)),
    ]);
    expect(empty.rate).toBe(text.validation.rateRequired);
    expect(validateInquiry({ ...validValues, rate: "abc" }).rate).toBe(text.validation.rateNotAmount);
    expect(validateInquiry({ ...validValues, email: "foretag@" }).email).toBe(text.validation.emailInvalid);
  });
});
