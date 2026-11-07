import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { siteContent } from "../data/siteContent";
import {
  InquiryPage,
  inquiryFieldOrder,
  inquiryMailtoHref,
  validateInquiry,
  type InquiryFieldKey,
} from "./InquiryPage";

const text = siteContent.inquiry;
const recipient = siteContent.contact.form.recipientEmail;

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

function draftBody(values: Record<InquiryFieldKey, string>): string {
  return text.mail.bodyTemplate.replace(/\{(\w+)\}/g, (placeholder, key: string) =>
    key in values ? values[key as InquiryFieldKey] : placeholder,
  );
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

    const expected = inquiryMailtoHref(validValues);
    expect(expected).toContain(`mailto:${recipient}?`);
    expect(openMailDraftSpy).toHaveBeenCalledTimes(1);
    expect(openMailDraftSpy).toHaveBeenCalledWith(expected);

    const decoded = decodeURIComponent(expected);
    expect(decoded).toContain(`subject=${text.mail.subject}`);
    expect(decoded).toContain(draftBody(validValues));

    const status = screen.getByRole("status");
    expect(status).toHaveTextContent(text.confirmationTemplate.replace("{recipient}", recipient));
    const reopen = screen.getByRole("link", { name: text.reopenLinkLabel });
    expect(reopen).toHaveAttribute("href", expected);
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
