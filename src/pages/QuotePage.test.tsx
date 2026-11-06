import { fireEvent, render, screen } from "@testing-library/react";
import { siteContent } from "../data/siteContent";
import { vatStatusLabel } from "../lib/quote";
import { QuotePage } from "./QuotePage";

const shared = siteContent.quote.shared;
const text = siteContent.quote.uppfart;

const money = (value: number) => new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value).replace(/[\u00a0\u202f]/g, " ");

function labelPattern(label: string): RegExp {
  return new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
}

function draftBody(values: Record<string, string>): string {
  return text.mail.bodyTemplate.replace(/\{(\w+)\}/g, (placeholder, key: string) => values[key] ?? placeholder);
}

function chooseUppfart() {
  window.location.hash = "uppfart";
  fireEvent(window, new Event("hashchange"));
}

function areaInput() {
  return screen.getByRole("spinbutton", { name: labelPattern(text.areaLabel) });
}

function loadsInput() {
  return screen.getByRole("spinbutton", { name: labelPattern(text.loadsLabel) });
}

function asphaltCheckbox() {
  return screen.getByRole("checkbox", { name: labelPattern(text.asphaltLabel) });
}

function decodedEmailHref(): string {
  const link = screen.getByRole("link", { name: labelPattern(shared.sendLabel) });

  expect(link.getAttribute("href") ?? "").toContain(`mailto:${text.mail.recipientEmail}`);

  return decodeURIComponent(link.getAttribute("href") ?? "").replace(/[\u00a0\u202f]/g, " ");
}

beforeEach(() => {
  window.location.hash = "";
});

describe("QuotePage", () => {
  it("starts with two calculator choice buttons before any calculator fields", () => {
    render(<QuotePage />);

    expect(screen.getByRole("heading", { name: text.choiceHeading })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: text.drainageChoiceLabel })).toHaveAttribute("href", "/draneringsberakning/");
    expect(screen.getByRole("link", { name: text.drivewayChoiceLabel })).toHaveAttribute("href", "#uppfart");

    expect(screen.queryByRole("spinbutton", { name: labelPattern(text.areaLabel) })).not.toBeInTheDocument();
    expect(screen.queryByRole("spinbutton", { name: labelPattern(text.loadsLabel) })).not.toBeInTheDocument();
    expect(screen.queryByRole("checkbox", { name: labelPattern(text.asphaltLabel) })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: shared.resultHeading })).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("reveals only the uppfart calculator after choosing uppfart", () => {
    render(<QuotePage />);
    chooseUppfart();

    expect(areaInput()).toHaveValue(100);
    expect(loadsInput()).toHaveValue(1);
    expect(asphaltCheckbox()).toBeChecked();
    expect(screen.getByRole("heading", { name: shared.resultHeading })).toBeInTheDocument();
    expect(screen.getByText(shared.resultCaption)).toBeInTheDocument();
    expect(screen.getByText(money(168600))).toBeInTheDocument();
    expect(screen.getByText(vatStatusLabel)).toBeInTheDocument();
    expect(screen.getByText(shared.disclaimer)).toBeInTheDocument();

    expect(screen.queryByRole("link", { name: text.drainageChoiceLabel })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: text.drivewayChoiceLabel })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: text.backLinkLabel })).toHaveAttribute("href", "/offertberakning/");
  });

  it("recalculates the reused driveway calculation into a preliminary total", () => {
    render(<QuotePage />);
    chooseUppfart();
    fireEvent.change(areaInput(), { target: { value: "50" } });

    expect(screen.getByText(money(87750))).toBeInTheDocument();

    fireEvent.click(asphaltCheckbox());

    expect(screen.getByText(money(54400))).toBeInTheDocument();
    expect(screen.queryByText(money(87750))).not.toBeInTheDocument();
    expect(document.querySelector(".quote-lines")).toBeNull();
    expect(document.querySelector(".quote-prices")).toBeNull();
    expect(screen.queryByText(/Priser och beräkningsgrund/)).not.toBeInTheDocument();
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });

  it("keeps the email handoff about the uppfart without internal prices", () => {
    render(<QuotePage />);
    chooseUppfart();
    fireEvent.change(areaInput(), { target: { value: "50" } });

    const href = decodedEmailHref();

    expect(href).toContain(text.mail.subject);
    expect(href).toContain(draftBody({ area: "50", loads: "1", asphalt: text.asphaltYesLabel, total: money(87750), vat: vatStatusLabel.toLowerCase(), notes: "" }));
    expect(href).not.toMatch(/kr\/m|Fast kostnad|950|667/);

    fireEvent.click(asphaltCheckbox());

    expect(decodedEmailHref()).toContain(draftBody({ area: "50", loads: "1", asphalt: text.asphaltNoLabel, total: money(54400), vat: vatStatusLabel.toLowerCase(), notes: "" }));
  });

  it("blocks invalid quantities without a misleading result and resets the calculator", () => {
    render(<QuotePage />);
    chooseUppfart();

    fireEvent.change(loadsInput(), { target: { value: "1.5" } });

    expect(screen.getByRole("alert")).toHaveTextContent(text.error);
    expect(screen.queryByRole("link", { name: labelPattern(shared.sendLabel) })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: shared.sendInvalidLabel })).toBeDisabled();
    expect(screen.getByRole("button", { name: shared.printLabel })).toBeDisabled();
    expect(screen.queryByText(shared.totalLabel)).not.toBeInTheDocument();

    fireEvent.change(areaInput(), { target: { value: "-5" } });
    fireEvent.change(loadsInput(), { target: { value: "1" } });
    expect(screen.getByRole("alert")).toBeInTheDocument();

    fireEvent.change(areaInput(), { target: { value: "" } });
    expect(screen.getByRole("alert")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: text.resetLabel }));

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(areaInput()).toHaveValue(100);
    expect(loadsInput()).toHaveValue(1);
    expect(asphaltCheckbox()).toBeChecked();
    expect(screen.getByText(money(168600))).toBeInTheDocument();
  });

  it("describes the quantity fields and announces updates in a polite live region", () => {
    render(<QuotePage />);
    chooseUppfart();

    const help = screen.getByText(text.quantityHelp);

    expect(help).toHaveAttribute("id", "quote-quantity-help");
    expect(areaInput()).toHaveAttribute("aria-describedby", "quote-quantity-help");
    expect(loadsInput()).toHaveAttribute("aria-describedby", "quote-quantity-help");

    const liveRegion = document.querySelector('[aria-live="polite"]');
    expect(liveRegion).not.toBeNull();
    expect(liveRegion).toHaveAttribute("aria-atomic", "true");

    fireEvent.change(loadsInput(), { target: { value: "2" } });

    expect(liveRegion).toHaveTextContent(shared.totalLabel);
    expect(liveRegion).toHaveTextContent(money(170600));
  });

  it("serves the decorative hero from responsive WebP variants of the registry asset", () => {
    render(<QuotePage />);

    const hero = document.querySelector("img.quote-hero-image") as HTMLImageElement;

    expect(hero).toHaveAttribute("src", "/page-visuals/quote-hero.webp");
    expect(hero).toHaveAttribute(
      "srcSet",
      "/page-visuals/quote-hero-640.webp 640w, /page-visuals/quote-hero-960.webp 960w, /page-visuals/quote-hero.webp 1672w",
    );
    expect(hero).toHaveAttribute("sizes", "100vw");
    expect(hero).toHaveAttribute("alt", "");
    expect(hero).toHaveAttribute("aria-hidden", "true");
    expect(hero).toHaveAttribute("fetchpriority", "high");
  });
});
