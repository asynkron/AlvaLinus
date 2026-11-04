import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { siteContent } from "../data/siteContent";
import { InquiryPage, inquiryMailtoHref, validateInquiry } from "./InquiryPage";

const openMailDraftSpy = vi.fn();

const validValues = {
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

const fieldLabels = [
  "Företagets namn",
  "Kontaktperson",
  "E-post",
  "Telefon (valfritt)",
  "Organisationsnummer (valfritt)",
  "Vad behöver ni inhyrd hjälp med?",
  "Erbjudet timpris",
  "Hur länge gäller uppdraget?",
  "Beskriv ärendet",
];

function fillField(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}

function fillValidForm(overrides: Partial<Record<string, string>> = {}) {
  for (const [key, label] of [
    ["company", "Företagets namn"],
    ["person", "Kontaktperson"],
    ["email", "E-post"],
    ["phone", "Telefon (valfritt)"],
    ["org", "Organisationsnummer (valfritt)"],
    ["work", "Vad behöver ni inhyrd hjälp med?"],
    ["rate", "Erbjudet timpris"],
    ["duration", "Hur länge gäller uppdraget?"],
    ["description", "Beskriv ärendet"],
  ] as const) {
    const value = key in overrides ? overrides[key] : validValues[key];
    if (value !== undefined) fillField(label, value);
  }
}

function submit() {
  fireEvent.click(screen.getByRole("button", { name: "Skicka förfrågan" }));
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

    const company = screen.getByLabelText("Företagets namn");
    const description = screen.getByLabelText("Beskriv ärendet");
    expect(company.compareDocumentPosition(description) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByRole("form", { name: "Förfrågan om inhyrning" })).toBeInTheDocument();

    const requiredLabels = fieldLabels.filter((label) => !label.includes("valfritt"));
    expect(requiredLabels).toHaveLength(7);
    for (const label of requiredLabels) {
      expect(screen.getByLabelText(label)).toHaveAttribute("required");
    }

    expect(screen.getByLabelText("Telefon (valfritt)")).not.toHaveAttribute("required");
    expect(screen.getByLabelText("Organisationsnummer (valfritt)")).not.toHaveAttribute("required");
    expect(screen.getByLabelText("Företagets namn")).toHaveAttribute("autocomplete", "organization");
    expect(screen.getByLabelText("Kontaktperson")).toHaveAttribute("autocomplete", "name");
    expect(screen.getByLabelText("E-post")).toHaveAttribute("type", "email");
    expect(screen.getByLabelText("Telefon (valfritt)")).toHaveAttribute("type", "tel");
    expect(screen.getByLabelText("Erbjudet timpris")).toHaveAttribute("min", "0");

    const rateHint = screen.getByText("Ange gärna i beskrivningen om priset är inklusive eller exklusive moms.");
    expect(rateHint).toHaveAttribute("id", "inquiry-rate-hint");
    expect(screen.getByLabelText("Erbjudet timpris")).toHaveAttribute("aria-describedby", "inquiry-rate-hint");
    expect(screen.getByText("Skicka en förfrågan")).toBeInTheDocument();
    expect(screen.getByText("En tydlig start")).toBeInTheDocument();
    expect(screen.getByText(/Inget skickas automatiskt/)).toHaveTextContent(
      siteContent.contact.form.recipientEmail,
    );
  });

  it("explains every missing required field in Swedish and focuses the first invalid field", () => {
    renderPage();
    submit();

    expect(openMailDraftSpy).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent("Formuläret kan inte skickas än");
    expect(screen.getByText("Ange företagets namn.")).toBeInTheDocument();
    expect(screen.getByText("Ange en kontaktperson.")).toBeInTheDocument();
    expect(screen.getByText("Ange en e-postadress så att vi kan återkomma till er.")).toBeInTheDocument();
    expect(screen.getByText("Beskriv vad ni behöver inhyrd hjälp med.")).toBeInTheDocument();
    expect(screen.getByText("Ange erbjudet timpris som ett belopp i kronor.")).toBeInTheDocument();
    expect(screen.getByText("Ange hur länge uppdraget gäller.")).toBeInTheDocument();
    expect(screen.getByText("Beskriv ärendet.")).toBeInTheDocument();

    const company = screen.getByLabelText("Företagets namn");
    expect(company).toHaveFocus();
    expect(company).toHaveAttribute("aria-invalid", "true");
    expect(company).toHaveAttribute("aria-describedby", "inquiry-company-error");
    expect(screen.getByLabelText("Telefon (valfritt)")).not.toHaveAttribute("aria-invalid");
    expect(screen.getByLabelText("Organisationsnummer (valfritt)")).not.toHaveAttribute("aria-invalid");
  });

  it("explains an invalid email address and clears the error when the address is corrected", () => {
    renderPage();
    fillValidForm({ email: "anna@markbygg" });
    submit();

    expect(openMailDraftSpy).not.toHaveBeenCalled();
    expect(screen.getByText("Ange en giltig e-postadress, till exempel namn@foretag.se.")).toBeInTheDocument();

    fillField("E-post", "anna@markbygg.se");
    expect(screen.queryByText("Ange en giltig e-postadress, till exempel namn@foretag.se.")).not.toBeInTheDocument();
  });

  it("rejects a negative offered hourly rate with a Swedish message", () => {
    renderPage();
    fillValidForm({ rate: "-50" });
    submit();

    expect(openMailDraftSpy).not.toHaveBeenCalled();
    expect(screen.getByText("Timpriset kan inte vara ett negativt belopp.")).toBeInTheDocument();
    expect(screen.getByLabelText("Erbjudet timpris")).toHaveAttribute("aria-invalid", "true");
  });

  it("opens a mail draft to the existing contact address with every supplied detail and explains the manual send", () => {
    renderPage();
    fillValidForm();
    submit();

    const expected = inquiryMailtoHref(validValues);
    expect(expected).toContain(`mailto:${siteContent.contact.form.recipientEmail}?`);
    expect(openMailDraftSpy).toHaveBeenCalledTimes(1);
    expect(openMailDraftSpy).toHaveBeenCalledWith(expected);

    const decoded = decodeURIComponent(expected);
    expect(decoded).toContain("subject=Förfrågan om inhyrning");
    expect(decoded).toContain("Företag: Mark & Bygg AB");
    expect(decoded).toContain("Kontaktperson: Anna Andersson");
    expect(decoded).toContain("E-post: anna@markbygg.se");
    expect(decoded).toContain("Telefon: 070-123 45 67");
    expect(decoded).toContain("Organisationsnummer: 556677-8899");
    expect(decoded).toContain("Behov av inhyrning: Grävmaskinist");
    expect(decoded).toContain("Erbjudet timpris: 650 kr/timme");
    expect(decoded).toContain("Uppdragets längd: 3 veckor från vecka 12");
    expect(decoded).toContain("Beskriv ärendet:");
    expect(decoded).toContain("bostadsbygge i Örebro");

    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Granska utkastet och skicka mejlet själv");
    expect(status).toHaveTextContent(siteContent.contact.form.recipientEmail);
    const reopen = screen.getByRole("link", { name: "Öppna utkastet igen" });
    expect(reopen).toHaveAttribute("href", expected);
  });

  it("marks empty optional fields with a dash in the mail draft without blocking the handoff", () => {
    renderPage();
    fillValidForm({ phone: "", org: "" });
    submit();

    expect(openMailDraftSpy).toHaveBeenCalledTimes(1);
    const decoded = decodeURIComponent(openMailDraftSpy.mock.calls[0]?.[0] ?? "");
    expect(decoded).toContain("Telefon: –");
    expect(decoded).toContain("Organisationsnummer: –");
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
      "company",
      "person",
      "email",
      "work",
      "rate",
      "duration",
      "description",
    ]);
    expect(empty.rate).toBe("Ange erbjudet timpris som ett belopp i kronor.");
    expect(validateInquiry({ ...validValues, rate: "abc" }).rate).toBe(
      "Timpriset ska vara ett belopp i kronor, till exempel 650.",
    );
    expect(validateInquiry({ ...validValues, email: "foretag@" }).email).toBe(
      "Ange en giltig e-postadress, till exempel namn@foretag.se.",
    );
  });
});
