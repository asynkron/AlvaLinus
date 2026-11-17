import { act, fireEvent, render, screen } from "@testing-library/react";
import { siteContent } from "../data/siteContent";
import { QuoteResultAside } from "./QuotePageShared";

const shared = siteContent.quote.shared;
const shareHref = `${window.location.origin}/offertberakning/?area=50&loads=2`;

function renderAside() {
  render(<QuoteResultAside shared={shared} error="" valid total="1 234 kr" email="mailto:test@example.se" shareHref={shareHref} />);
}

function useClipboard(writeText?: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, "clipboard", { value: writeText ? { writeText } : undefined, configurable: true });
}

afterEach(() => {
  delete (navigator as { clipboard?: unknown }).clipboard;
});

describe("QuoteResultAside", () => {
  it("announces the Swedish copy confirmation when the clipboard write resolves", async () => {
    const writeText = vi.fn(() => Promise.resolve());
    useClipboard(writeText);
    renderAside();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: shared.shareLabel }));
    });

    expect(writeText).toHaveBeenCalledWith(shareHref);
    expect(screen.getByRole("status")).toHaveTextContent(shared.shareCopiedMessage);
  });

  it("announces the manual-copy fallback when the clipboard write rejects", async () => {
    const writeText = vi.fn(() => Promise.reject(new Error("clipboard denied")));
    useClipboard(writeText);
    renderAside();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: shared.shareLabel }));
    });

    expect(screen.getByRole("status")).toHaveTextContent(shared.shareFallbackMessage);
    expect(screen.getByRole("link", { name: shareHref })).toHaveAttribute("href", shareHref);
  });

  it("announces the manual-copy fallback when the clipboard is unavailable", () => {
    useClipboard();
    renderAside();

    fireEvent.click(screen.getByRole("button", { name: shared.shareLabel }));

    expect(screen.getByRole("status")).toHaveTextContent(shared.shareFallbackMessage);
    expect(screen.getByRole("link", { name: shareHref })).toHaveAttribute("href", shareHref);
  });
});
