import { act, fireEvent, render, screen } from "@testing-library/react";
import { siteContent } from "../data/siteContent";
import { quoteShareParams } from "../lib/quote-share";
import { QuotePage } from "./QuotePage";

const shared = siteContent.quote.shared;
const text = siteContent.quote.uppfart;

const money = (value: number) => new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value).replace(/[\u00a0\u202f]/g, " ");

function labelPattern(label: string): RegExp {
  return new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
}

function chooseUppfart() {
  window.location.hash = "uppfart";
  fireEvent(window, new Event("hashchange"));
}

function areaInput() {
  return screen.getByRole("spinbutton", { name: labelPattern(text.areaLabel) });
}

function asphaltCheckbox() {
  return screen.getByRole("checkbox", { name: labelPattern(text.asphaltLabel) });
}

function decodedEmailHref(): string {
  const link = screen.getByRole("link", { name: labelPattern(shared.sendLabel) });

  expect(link.getAttribute("href") ?? "").toContain("mailto:linus.svardd@outlook.com");

  return decodeURIComponent(link.getAttribute("href") ?? "").replace(/[\u00a0\u202f]/g, " ");
}

beforeEach(() => {
  window.history.replaceState(null, "", "/offertberakning/");
  window.location.hash = "";
});

describe("QuotePage", () => {
  it("starts with two calculator choice buttons before any calculator fields", () => {
    render(<QuotePage />);

    expect(screen.getByRole("heading", { name: text.choiceHeading })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: text.drainageChoiceLabel })).toHaveAttribute("href", "/draneringsberakning/");
    expect(screen.getByRole("link", { name: text.drivewayChoiceLabel })).toHaveAttribute("href", "#uppfart");

    expect(screen.queryByRole("spinbutton", { name: labelPattern(text.areaLabel) })).not.toBeInTheDocument();
    expect(screen.queryByRole("checkbox", { name: labelPattern(text.asphaltLabel) })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: shared.resultHeading })).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("reveals only the uppfart calculator after choosing uppfart", () => {
    render(<QuotePage />);
    chooseUppfart();

    expect(areaInput()).toHaveValue(100);
    expect(asphaltCheckbox()).toBeChecked();
    expect(screen.getAllByRole("spinbutton")).toHaveLength(1);
    expect(screen.queryByText(/antal lass/i)).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: shared.resultHeading })).toBeInTheDocument();
    expect(screen.getByText(shared.resultCaption)).toBeInTheDocument();
    expect(screen.getByText(money(166600))).toBeInTheDocument();
    expect(screen.getByRole("complementary")).toHaveTextContent("Inkl. moms");
    expect(screen.getByText(shared.disclaimer)).toBeInTheDocument();

    expect(screen.queryByRole("link", { name: text.drainageChoiceLabel })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: text.drivewayChoiceLabel })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: text.backLinkLabel })).toHaveAttribute("href", "/offertberakning/");
  });

  it("moves keyboard focus to the revealed view heading on hash switches", () => {
    render(<QuotePage />);

    expect(document.activeElement).toBe(document.body);

    chooseUppfart();

    expect(screen.getByRole("heading", { name: text.workHeading })).toHaveFocus();

    window.location.hash = "";
    fireEvent(window, new Event("hashchange"));

    expect(screen.getByRole("heading", { name: text.choiceHeading })).toHaveFocus();
  });

  it("recalculates the reused driveway calculation into a preliminary total", () => {
    render(<QuotePage />);
    chooseUppfart();
    fireEvent.change(areaInput(), { target: { value: "50" } });

    expect(screen.getByText(money(85750))).toBeInTheDocument();

    fireEvent.click(asphaltCheckbox());

    expect(screen.getByText(money(52400))).toBeInTheDocument();
    expect(screen.queryByText(money(85750))).not.toBeInTheDocument();
    expect(document.querySelector(".quote-lines")).toBeNull();
    expect(document.querySelector(".quote-prices")).toBeNull();
    expect(screen.queryByText(/Priser och beräkningsgrund/)).not.toBeInTheDocument();
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });

  it("keeps the email handoff about the uppfart without internal prices", () => {
    render(<QuotePage />);
    chooseUppfart();
    fireEvent.change(areaInput(), { target: { value: "50" } });
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Villa & garage" } });

    const href = decodedEmailHref();

    expect(href).toContain(text.mail.subject);
    expect(href).toContain("Yta: 50 m\u00b2\nAsfalt: Ja\nPrelimin\u00e4r summa: 85 750 kr");
    expect(href).not.toMatch(/lass/i);
    expect(href).toContain("Villa & garage");
    expect(href).toContain("Inkl. moms");
    expect(href).toContain("Omfattning behöver bekräftas");
    expect(href).not.toMatch(/kr\/m|Fast kostnad|950|667/);

    fireEvent.click(asphaltCheckbox());

    expect(decodedEmailHref()).toContain("Asfalt: Nej\nPrelimin\u00e4r summa: 52 400 kr");
    fireEvent.change(areaInput(), { target: { value: "100" } });
    expect(screen.getByText(money(99900))).toBeInTheDocument();
    expect(decodedEmailHref()).toContain("99 900 kr");
  });

  it("blocks invalid quantities without a misleading result and resets the calculator", () => {
    render(<QuotePage />);
    chooseUppfart();

    fireEvent.change(areaInput(), { target: { value: "0" } });

    expect(screen.getByRole("alert")).toHaveTextContent(text.error);
    expect(screen.queryByRole("link", { name: labelPattern(shared.sendLabel) })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: shared.sendInvalidLabel })).toBeDisabled();
    expect(screen.getByRole("button", { name: shared.printLabel })).toBeDisabled();
    expect(screen.queryByText(shared.totalLabel)).not.toBeInTheDocument();

    fireEvent.change(areaInput(), { target: { value: "-5" } });
    expect(screen.getByRole("alert")).toBeInTheDocument();

    fireEvent.change(areaInput(), { target: { value: "" } });
    expect(screen.getByRole("alert")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: text.resetLabel }));

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(areaInput()).toHaveValue(100);
    expect(asphaltCheckbox()).toBeChecked();
    expect(screen.getByText(money(166600))).toBeInTheDocument();
  });

  it("describes the quantity fields and announces updates in a polite live region", () => {
    render(<QuotePage />);
    chooseUppfart();

    const help = screen.getByText(text.quantityHelp);

    expect(help).toHaveAttribute("id", "quote-quantity-help");
    expect(areaInput()).toHaveAttribute("aria-describedby", "quote-quantity-help");

    const liveRegion = document.querySelector('[aria-live="polite"]');
    expect(liveRegion).not.toBeNull();
    expect(liveRegion).toHaveAttribute("aria-atomic", "true");

    fireEvent.change(areaInput(), { target: { value: "50" } });

    expect(liveRegion).toHaveTextContent(shared.totalLabel);
    expect(liveRegion).toHaveTextContent(money(85750));
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

  it.each(["resolved", "unavailable"] as const)("discards driveway share feedback on actual edits and explicitly shares current inputs (%s)", async clipboard => {
    const writeText = vi.fn(() => Promise.resolve());
    const previousClipboard = Object.getOwnPropertyDescriptor(navigator, "clipboard");
    Object.defineProperty(navigator, "clipboard", {
      value: clipboard === "resolved" ? { writeText } : undefined,
      configurable: true,
    });

    try {
      render(<QuotePage />);
      chooseUppfart();

      const replaceState = vi.spyOn(window.history, "replaceState");
      const pushState = vi.spyOn(window.history, "pushState");
      let publications = 0;
      let publishedHref = window.location.href;

      function expectUnpublished() {
        expect(screen.queryByRole("link", { name: /^https?:/ })).not.toBeInTheDocument();
        expect(screen.getByRole("status")).toBeEmptyDOMElement();
        expect(window.location.href).toBe(publishedHref);
        expect(pushState).not.toHaveBeenCalled();
        expect(replaceState).toHaveBeenCalledTimes(publications);
        expect(writeText).toHaveBeenCalledTimes(clipboard === "resolved" ? publications : 0);
      }

      async function publish(search: string) {
        const href = `${window.location.origin}/offertberakning/?${search}#uppfart`;
        await act(async () => {
          fireEvent.click(screen.getByRole("button", { name: shared.shareLabel }));
        });
        publications += 1;
        publishedHref = href;

        expect(window.location.href).toBe(href);
        expect(pushState).not.toHaveBeenCalled();
        expect(replaceState).toHaveBeenCalledTimes(publications);
        expect(replaceState).toHaveBeenLastCalledWith(null, "", href);
        expect(screen.getByRole("link", { name: href })).toHaveAttribute("href", href);
        expect(screen.getByRole("status")).toHaveTextContent(
          clipboard === "resolved" ? shared.shareCopiedMessage : shared.shareFallbackMessage,
        );
        if (clipboard === "resolved") {
          expect(writeText).toHaveBeenCalledTimes(publications);
          expect(writeText).toHaveBeenLastCalledWith(href);
        } else {
          expect(writeText).not.toHaveBeenCalled();
        }
      }

      expectUnpublished();
      await publish("yta=100&asfalt=1");

      // Each edit starts with feedback, so another field cannot mask missing wiring.
      fireEvent.change(areaInput(), { target: { value: "50" } });
      expectUnpublished();
      await publish("yta=50&asfalt=1");

      fireEvent.click(asphaltCheckbox());
      expectUnpublished();
      await publish("yta=50&asfalt=0");

      fireEvent.change(screen.getByRole("textbox"), { target: { value: "Villa i Örebro" } });
      expectUnpublished();
      await publish("yta=50&asfalt=0&anteckning=Villa+i+%C3%96rebro");

      fireEvent.click(screen.getByRole("radio", { name: shared.vatExclusiveLabel }));
      expectUnpublished();
      await publish("yta=50&asfalt=0&anteckning=Villa+i+%C3%96rebro&moms=exkl");

      fireEvent.click(screen.getByRole("button", { name: text.resetLabel }));
      expectUnpublished();
      expect(areaInput()).toHaveValue(100);
      expect(screen.getByRole("textbox")).toHaveValue("");
      expect(screen.getByRole("radio", { name: shared.vatInclusiveLabel })).toBeChecked();
      expect(asphaltCheckbox()).toBeChecked();
      await publish("yta=100&asfalt=1");

      fireEvent.change(areaInput(), { target: { value: "0" } });
      expectUnpublished();
      expect(screen.getByRole("button", { name: shared.shareLabel })).toBeDisabled();
      fireEvent.click(screen.getByRole("button", { name: shared.shareLabel }));
      expectUnpublished();

      fireEvent.change(areaInput(), { target: { value: "100" } });
      expectUnpublished();
      expect(screen.getByRole("button", { name: shared.shareLabel })).toBeEnabled();
      await publish("yta=100&asfalt=1");
    } finally {
      vi.restoreAllMocks();
      if (previousClipboard) Object.defineProperty(navigator, "clipboard", previousClipboard);
      else delete (navigator as { clipboard?: unknown }).clipboard;
    }
  });

  it("restores the shared driveway inputs and recomputes the same total on load", () => {
    window.history.replaceState(null, "", `/offertberakning/?${quoteShareParams.area}=50&lass=invalid&${quoteShareParams.asphalt}=0#uppfart`);
    render(<QuotePage />);

    expect(document.activeElement).toBe(document.body);
    expect(areaInput()).toHaveValue(50);
    expect(asphaltCheckbox()).not.toBeChecked();
    expect(screen.getByText(money(52400))).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveValue("");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("restores the shared note into the project description on load", () => {
    window.history.replaceState(null, "", `/offertberakning/?${quoteShareParams.area}=50&${quoteShareParams.asphalt}=0&${quoteShareParams.notes}=Villa+i+%C3%96rebro#uppfart`);
    render(<QuotePage />);

    expect(document.activeElement).toBe(document.body);
    expect(areaInput()).toHaveValue(50);
    expect(screen.getByRole("textbox")).toHaveValue("Villa i Örebro");
    expect(screen.getByText(money(52400))).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("degrades invalid shared inputs through the existing invalid-input path", () => {
    window.history.replaceState(null, "", `/offertberakning/?${quoteShareParams.area}=-5#uppfart`);
    render(<QuotePage />);

    expect(screen.getByRole("alert")).toHaveTextContent(text.error);
    expect(screen.queryByText(shared.totalLabel)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: shared.sendInvalidLabel })).toBeDisabled();
    expect(screen.getByRole("button", { name: shared.printLabel })).toBeDisabled();
    expect(screen.getByRole("button", { name: shared.shareLabel })).toBeDisabled();
  });
});
