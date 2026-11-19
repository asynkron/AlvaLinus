import { fireEvent, render, screen, within } from "@testing-library/react";
import { siteContent } from "../data/siteContent";
import { DrainageQuotePage } from "./DrainageQuotePage";
import { QuotePage } from "./QuotePage";

const shared = siteContent.quote.shared;
const calculators = [
  { name: "driveway", path: "/offertberakning/", parameter: "yta", hash: "#uppfart", Page: QuotePage, description: siteContent.quote.uppfart.individualQuote.description, scope: "Yta: 100,1 m²", below: "166 438,3 kr", boundary: "166 600 kr" },
  { name: "drainage", path: "/draneringsberakning/", parameter: "langd", hash: "", Page: DrainageQuotePage, description: siteContent.quote.drainage.individualQuote.description, scope: "Längd: 100,1 löpmeter", below: "334 100 kr", boundary: "334 400 kr" },
] as const;

function mailBody(label: string): string {
  const href = screen.getByRole("link", { name: label }).getAttribute("href") ?? "";
  expect(href).toMatch(/^mailto:linus\.svardd@outlook\.com\?/);
  return new URLSearchParams(href.split("?")[1]).get("body")?.replace(/[\u00a0\u202f]/g, " ") ?? "";
}

describe.each(calculators)("$name quote limit", ({ path, parameter, hash, Page, description, scope, below, boundary }) => {
  beforeEach(() => {
    window.history.replaceState(null, "", `${path}${hash}`);
  });

  it("estimates 99.9 and exactly 100, then replaces the price above 100 and recovers", () => {
    render(<Page />);
    const input = screen.getByRole("spinbutton");
    const liveRegion = document.querySelector('[aria-live="polite"]');
    expect(liveRegion).toHaveAttribute("aria-atomic", "true");

    for (const [value, amount] of [["99.9", below], ["100", boundary]] as const) {
      fireEvent.change(input, { target: { value } });
      expect(liveRegion).toHaveTextContent(amount);
      expect(mailBody(shared.sendLabel)).toContain(amount);
      expect(screen.getByRole("button", { name: shared.printLabel })).toBeEnabled();
    }

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Villa & garage" } });
    fireEvent.change(input, { target: { value: "100.1" } });
    expect(liveRegion).toHaveTextContent("Kontakta oss för en individuell offert");
    expect(liveRegion).toHaveTextContent(description);
    expect(screen.queryByText(shared.totalLabel)).not.toBeInTheDocument();
    expect(document.body).not.toHaveTextContent(boundary);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(input).toHaveAttribute("aria-invalid", "false");
    expect(screen.getByRole("button", { name: shared.printLabel })).toBeDisabled();

    const contact = screen.getByRole("link", { name: shared.individualQuoteSendLabel });
    contact.focus();
    expect(contact).toHaveFocus();
    const body = mailBody(shared.individualQuoteSendLabel);
    expect(body).toContain(scope);
    expect(body).toContain("Villa & garage");
    expect(body).not.toMatch(/kr|summa|moms|NaN|Infinity|lass/i);

    fireEvent.change(input, { target: { value: "99.9" } });
    expect(liveRegion).toHaveTextContent(below);
    expect(screen.queryByRole("heading", { name: shared.individualQuoteHeading })).not.toBeInTheDocument();
    expect(mailBody(shared.sendLabel)).toContain(below);
    expect(screen.getByRole("button", { name: shared.printLabel })).toBeEnabled();
  });

  it("restores a very large finite shared scope as an individual inquiry without computing a price", () => {
    window.history.replaceState(null, "", `${path}?${parameter}=1e300&anteckning=Stor+tomt${hash}`);
    render(<Page />);
    expect(screen.getByRole("heading", { name: shared.individualQuoteHeading })).toBeInTheDocument();
    expect(screen.queryByText(shared.totalLabel)).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    const body = mailBody(shared.individualQuoteSendLabel);
    expect(body).toContain("Stor tomt");
    expect(body).toMatch(/1[ 0]+/);
    expect(body).not.toMatch(/kr|summa|NaN|Infinity/i);
    expect(screen.getByRole("button", { name: shared.printLabel })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: shared.shareLabel }));
    expect(new URLSearchParams(window.location.search).get(parameter)).toBe("1e300");

    fireEvent.click(screen.getByRole("button", { name: /Återställ exempel/ }));
    expect(screen.queryByRole("heading", { name: shared.individualQuoteHeading })).not.toBeInTheDocument();
    expect(within(screen.getByRole("complementary")).getByText(shared.totalLabel)).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it.each(["invalid", "Infinity", "1e309"])("keeps invalid shared scope %s separate from an individual quote", value => {
    window.history.replaceState(null, "", `${path}?${parameter}=${value}${hash}`);
    render(<Page />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: shared.individualQuoteSendLabel })).not.toBeInTheDocument();
    expect(screen.queryByText(shared.totalLabel)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: shared.sendInvalidLabel })).toBeDisabled();
  });
});
