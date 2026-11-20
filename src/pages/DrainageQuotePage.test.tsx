import { act, fireEvent, render, screen } from "@testing-library/react";
import { siteContent } from "../data/siteContent";
import { formatNumber } from "../lib/quote";
import { quoteShareParams } from "../lib/quote-share";
import { DrainageQuotePage } from "./DrainageQuotePage";

const shared = siteContent.quote.shared;
const text = siteContent.quote.drainage;

const money = (value: number) => new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value).replace(/[\u00a0\u202f]/g, " ");

function labelPattern(label: string): RegExp {
  return new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
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

  expect(link.getAttribute("href") ?? "").toContain("mailto:linus.svardd@outlook.com");

  return decodeURIComponent(link.getAttribute("href") ?? "").replace(/[\u00a0\u202f]/g, " ");
}

beforeEach(() => {
  window.history.replaceState(null, "", "/draneringsberakning/");
});

describe("DrainageQuotePage", () => {
  it("presents the drainage estimate without internal prices or part amounts", () => {
    render(<DrainageQuotePage />);

    expect(screen.getByRole("heading", { name: text.heading, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: text.workHeading })).toBeInTheDocument();
    expect(screen.getByText(shared.resultCaption)).toBeInTheDocument();
    expect(screen.getByText(text.includedHeading)).toBeInTheDocument();
    expect(screen.getByText(firstIncludedParagraph())).toBeInTheDocument();
    expect(screen.getByRole("complementary")).toHaveTextContent("Inkl. moms");
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
    expect(href).toContain(`L\u00e4ngd: ${formatNumber(Number(meters))} l\u00f6pmeter\nPrelimin\u00e4r summa: ${money(expected)}`);
    expect(href).not.toMatch(/kr\/m|Schakt och markarbete/);
  });

  it("supports decimal lengths and keeps the same precision in the email", () => {
    render(<DrainageQuotePage />);
    fireEvent.change(lengthInput(), { target: { value: "40.5" } });

    const href = decodedEmailHref();

    expect(href).toContain("L\u00e4ngd: 40,5 l\u00f6pmeter\nPrelimin\u00e4r summa: 148 650 kr");
    expect(screen.getByText(money(148650))).toBeInTheDocument();
  });

  it.each(["", "0", "-5", "invalid"])("blocks the invalid length %s without a misleading result", (invalid) => {
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
    expect(decodedEmailHref()).toContain("L\u00e4ngd: 40 l\u00f6pmeter\nPrelimin\u00e4r summa: 146 900 kr");
  });

  it("links visitors with a driveway project back to the quote calculator", () => {
    render(<DrainageQuotePage />);

    const link = screen.getByRole("link", { name: text.drivewayCrossLinkLabel });

    expect(link).toHaveAttribute("href", "/offertberakning/");
  });

  it("serves the decorative hero from responsive WebP variants of the registry asset", () => {
    render(<DrainageQuotePage />);

    const hero = document.querySelector("img.quote-hero-image") as HTMLImageElement;

    expect(hero).toHaveAttribute("src", "/page-visuals/draneringsberakning-hero.webp");
    expect(hero).toHaveAttribute(
      "srcSet",
      "/page-visuals/dranering-photo-400.webp 400w, /page-visuals/dranering-photo-640.webp 640w, /page-visuals/draneringsberakning-hero.webp 900w",
    );
    expect(hero).toHaveAttribute("sizes", "100vw");
    expect(hero).toHaveAttribute("alt", "");
    expect(hero).toHaveAttribute("aria-hidden", "true");
    expect(hero).toHaveAttribute("fetchpriority", "high");
  });

  it.each(["resolved", "unavailable"] as const)("discards drainage share feedback on actual edits and explicitly shares current inputs (%s)", async clipboard => {
    const writeText = vi.fn(() => Promise.resolve());
    const previousClipboard = Object.getOwnPropertyDescriptor(navigator, "clipboard");
    Object.defineProperty(navigator, "clipboard", {
      value: clipboard === "resolved" ? { writeText } : undefined,
      configurable: true,
    });

    try {
      render(<DrainageQuotePage />);

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
        const href = `${window.location.origin}/draneringsberakning/?${search}`;
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
      await publish("langd=40");

      // Each edit starts with feedback, so another field cannot mask missing wiring.
      fireEvent.change(lengthInput(), { target: { value: "62.5" } });
      expectUnpublished();
      await publish("langd=62.5");

      fireEvent.change(screen.getByRole("textbox"), { target: { value: "Villa i Örebro" } });
      expectUnpublished();
      await publish("langd=62.5&anteckning=Villa+i+%C3%96rebro");

      fireEvent.click(screen.getByRole("radio", { name: shared.vatExclusiveLabel }));
      expectUnpublished();
      await publish("langd=62.5&anteckning=Villa+i+%C3%96rebro&moms=exkl");

      fireEvent.click(screen.getByRole("button", { name: text.resetLabel }));
      expectUnpublished();
      expect(lengthInput()).toHaveValue(40);
      expect(screen.getByRole("textbox")).toHaveValue("");
      expect(screen.getByRole("radio", { name: shared.vatInclusiveLabel })).toBeChecked();
      await publish("langd=40");

      fireEvent.change(lengthInput(), { target: { value: "0" } });
      expectUnpublished();
      expect(screen.getByRole("button", { name: shared.shareLabel })).toBeDisabled();
      fireEvent.click(screen.getByRole("button", { name: shared.shareLabel }));
      expectUnpublished();

      fireEvent.change(lengthInput(), { target: { value: "40" } });
      expectUnpublished();
      expect(screen.getByRole("button", { name: shared.shareLabel })).toBeEnabled();
      await publish("langd=40");
    } finally {
      vi.restoreAllMocks();
      if (previousClipboard) Object.defineProperty(navigator, "clipboard", previousClipboard);
      else delete (navigator as { clipboard?: unknown }).clipboard;
    }
  });

  it("restores the shared length and recomputes the same total on load", () => {
    window.history.replaceState(null, "", `/draneringsberakning/?${quoteShareParams.length}=62.5`);
    render(<DrainageQuotePage />);

    expect(lengthInput()).toHaveValue(62.5);
    expect(screen.getByText(money(221900))).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveValue("");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("restores the shared note into the project description on load", () => {
    window.history.replaceState(null, "", `/draneringsberakning/?${quoteShareParams.length}=62.5&${quoteShareParams.notes}=Villa+i+%C3%96rebro`);
    render(<DrainageQuotePage />);

    expect(lengthInput()).toHaveValue(62.5);
    expect(screen.getByRole("textbox")).toHaveValue("Villa i Örebro");
    expect(screen.getByText(money(221900))).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("degrades an invalid shared length through the existing invalid-input path", () => {
    window.history.replaceState(null, "", `/draneringsberakning/?${quoteShareParams.length}=-5`);
    render(<DrainageQuotePage />);

    expect(screen.getByRole("alert")).toHaveTextContent(text.error);
    expect(screen.queryByText(shared.totalLabel)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: shared.sendInvalidLabel })).toBeDisabled();
    expect(screen.getByRole("button", { name: shared.printLabel })).toBeDisabled();
    expect(screen.getByRole("button", { name: shared.shareLabel })).toBeDisabled();
  });
});
