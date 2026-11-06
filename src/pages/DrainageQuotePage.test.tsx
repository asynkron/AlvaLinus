import { fireEvent, render, screen } from "@testing-library/react";
import { siteContent } from "../data/siteContent";
import { formatNumber, vatStatusLabel } from "../lib/quote";
import { DrainageQuotePage } from "./DrainageQuotePage";

const shared = siteContent.quote.shared;
const text = siteContent.quote.drainage;

const money = (value: number) => new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value).replace(/[\u00a0\u202f]/g, " ");

function labelPattern(label: string): RegExp {
  return new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
}

function draftBody(values: Record<string, string>): string {
  return text.mail.bodyTemplate.replace(/\{(\w+)\}/g, (placeholder, key: string) => values[key] ?? placeholder);
}

function firstIncludedParagraph(): string {
  const paragraph = text.includedParagraphs[0];

  if (paragraph === undefined) {
    throw new Error("Missing registry included paragraph");
  }

  return paragraph;
}

function lengthInput() {
  return screen.getByRole("spinbutton", { name: labelPattern(text.lengthLabel) });
}

function decodedEmailHref(): string {
  const link = screen.getByRole("link", { name: labelPattern(shared.sendLabel) });

  expect(link.getAttribute("href") ?? "").toContain(`mailto:${text.mail.recipientEmail}`);

  return decodeURIComponent(link.getAttribute("href") ?? "").replace(/[\u00a0\u202f]/g, " ");
}

describe("DrainageQuotePage", () => {
  it("presents the drainage estimate without internal prices or part amounts", () => {
    render(<DrainageQuotePage />);

    expect(screen.getByRole("heading", { name: text.heading, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: text.workHeading })).toBeInTheDocument();
    expect(screen.getByText(shared.resultCaption)).toBeInTheDocument();
    expect(screen.getByText(text.includedHeading)).toBeInTheDocument();
    expect(screen.getByText(firstIncludedParagraph())).toBeInTheDocument();
    expect(screen.getByText(vatStatusLabel)).toBeInTheDocument();
    expect(screen.getByText(shared.disclaimer)).toBeInTheDocument();
    expect(screen.getByText(shared.mailHelp)).toBeInTheDocument();

    expect(screen.queryByText(/Priser och beräkningsgrund/)).not.toBeInTheDocument();
    expect(screen.queryByText(/kr\/m/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Schakt och markarbete/)).not.toBeInTheDocument();
    expect(document.querySelector(".quote-lines")).toBeNull();
    expect(document.querySelector(".quote-prices")).toBeNull();
  });

  it.each([
    { meters: "40", expected: 146900 },
    { meters: "55", expected: 199400 },
    { meters: "60", expected: 214400 },
  ])("calculates $meters löpmeter to $expected kr on the page and in the email", ({ meters, expected }) => {
    render(<DrainageQuotePage />);
    fireEvent.change(lengthInput(), { target: { value: meters } });

    expect(screen.getByText(money(expected))).toBeInTheDocument();

    const href = decodedEmailHref();

    expect(href).toContain(text.mail.subject);
    expect(href).toContain(draftBody({ length: formatNumber(Number(meters)), total: money(expected), vat: vatStatusLabel.toLowerCase(), notes: "" }));
    expect(href).not.toMatch(/kr\/m|Schakt och markarbete/);
  });

  it("supports decimal lengths and keeps the same precision in the email", () => {
    render(<DrainageQuotePage />);
    fireEvent.change(lengthInput(), { target: { value: "40.5" } });

    const href = decodedEmailHref();

    expect(href).toContain(draftBody({ length: formatNumber(40.5), total: money(148650), vat: vatStatusLabel.toLowerCase(), notes: "" }));
    expect(screen.getByText(money(148650))).toBeInTheDocument();
  });

  it.each(["", "0", "-5", "100001"])("blocks the invalid length %s without a misleading result", (invalid) => {
    render(<DrainageQuotePage />);
    fireEvent.change(lengthInput(), { target: { value: invalid } });

    expect(screen.getByRole("alert")).toHaveTextContent(text.error);
    expect(screen.queryByRole("link", { name: labelPattern(shared.sendLabel) })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: shared.sendInvalidLabel })).toBeDisabled();
    expect(screen.getByRole("button", { name: shared.printLabel })).toBeDisabled();
    expect(lengthInput()).toHaveAttribute("aria-invalid", "true");
    expect(screen.queryByText(shared.totalLabel)).not.toBeInTheDocument();
  });

  it("describes the length field and announces updates in a polite live region", () => {
    render(<DrainageQuotePage />);

    const help = screen.getByText(text.lengthHelp);

    expect(help).toHaveAttribute("id", "meter-help");
    expect(lengthInput()).toHaveAttribute("aria-describedby", "meter-help");

    const liveRegion = document.querySelector('[aria-live="polite"]');
    expect(liveRegion).not.toBeNull();
    expect(liveRegion).toHaveAttribute("aria-atomic", "true");

    fireEvent.change(lengthInput(), { target: { value: "10" } });

    expect(liveRegion).toHaveTextContent(shared.totalLabel);
    expect(liveRegion).toHaveTextContent(money(41900));
  });

  it("restores the example and clears the project description", () => {
    render(<DrainageQuotePage />);
    fireEvent.change(lengthInput(), { target: { value: "-5" } });
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Villa i Örebro" } });

    expect(screen.getByRole("alert")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: text.resetLabel }));

    expect(lengthInput()).toHaveValue(40);
    expect(screen.getByRole("textbox")).toHaveValue("");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(decodedEmailHref()).toContain(draftBody({ length: formatNumber(40), total: money(146900), vat: vatStatusLabel.toLowerCase(), notes: "" }));
  });

  it("links visitors with a driveway project back to the quote calculator", () => {
    render(<DrainageQuotePage />);

    const link = screen.getByRole("link", { name: text.drivewayCrossLinkLabel });

    expect(link).toHaveAttribute("href", "/offertberakning/");
  });
});
