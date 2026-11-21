import { act, fireEvent, render, screen } from "@testing-library/react";
import { siteContent } from "../data/siteContent";
import { QuoteResultAside } from "./QuotePageShared";

const shared = siteContent.quote.shared;
const shareHref = `${window.location.origin}/offertberakning/?yta=50&asfalt=1`;

function renderAside() {
  const props = { shared, error: "", valid: true, total: "1 234 kr", vatLabel: "Inkl. moms", email: "mailto:test@example.se", shareHref };
  const view = render(<QuoteResultAside {...props} />);
  return (href: string, valid = true) => view.rerender(<QuoteResultAside {...props} shareHref={href} valid={valid} />);
}

function pendingWrite() {
  let resolve!: () => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<void>((onResolve, onReject) => {
    resolve = onResolve;
    reject = onReject;
  });
  return { promise, resolve, reject };
}

function useClipboard(writeText?: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, "clipboard", { value: writeText ? { writeText } : undefined, configurable: true });
}

afterEach(() => {
  delete (navigator as { clipboard?: unknown }).clipboard;
  window.history.replaceState(null, "", "/");
});

describe("QuoteResultAside", () => {
  it("discloses shared notes and recipient access before sharing", () => {
    const writeText = vi.fn(() => Promise.resolve());
    useClipboard(writeText);
    const originalUrl = window.location.href;
    const update = renderAside();

    function expectDisclosure() {
      const help = screen.getByText(/alla som får länken kan läsa/i);
      expect(help).toBeVisible();
      expect(help).toHaveTextContent(/mått/i);
      expect(help).toHaveTextContent(/tillval och moms/i);
      expect(help).toHaveTextContent(/projektanteckningar/i);
      expect(screen.getByRole("button", { name: shared.shareLabel })).toBeEnabled();
      expect(screen.queryByRole("link", { name: /^https?:/ })).not.toBeInTheDocument();
      expect(writeText).not.toHaveBeenCalled();
      expect(window.location.href).toBe(originalUrl);
    }

    expectDisclosure();
    update(`${shareHref}&anteckning=Privat%20projektanteckning`);
    expectDisclosure();
  });

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

  it.each([
    ["measurements change", `${window.location.origin}/offertberakning/?yta=80&asfalt=1`, true],
    ["notes change", `${shareHref}&anteckning=Ny%20anteckning`, true],
    ["values reset", `${window.location.origin}/offertberakning/`, true],
    ["inputs become invalid", shareHref, false],
  ] as const)("discards shared feedback when %s without publishing another URL", (_change, nextHref, valid) => {
    useClipboard();
    const update = renderAside();
    fireEvent.click(screen.getByRole("button", { name: shared.shareLabel }));
    expect(screen.getByRole("status")).toHaveTextContent(shared.shareFallbackMessage);
    const publishedHref = window.location.href;

    update(nextHref, valid);

    expect(screen.queryByRole("link", { name: shareHref })).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
    expect(window.location.href).toBe(publishedHref);
    if (valid) {
      fireEvent.click(screen.getByRole("button", { name: shared.shareLabel }));
      expect(screen.getByRole("link", { name: nextHref })).toHaveAttribute("href", nextHref);
      expect(screen.getByRole("status")).toHaveTextContent(shared.shareFallbackMessage);
      expect(window.location.href).toBe(nextHref);
    } else {
      expect(screen.getByRole("button", { name: shared.shareLabel })).toBeDisabled();
    }
  });

  it.each(["resolve", "reject"] as const)("ignores an obsolete clipboard %s even after returning to the original quote", async settlement => {
    const write = pendingWrite();
    useClipboard(() => write.promise);
    const update = renderAside();
    fireEvent.click(screen.getByRole("button", { name: shared.shareLabel }));
    update(`${shareHref}&anteckning=Changed`);
    update(shareHref);

    await act(async () => {
      if (settlement === "resolve") write.resolve();
      else write.reject(new Error("clipboard denied"));
    });

    expect(screen.queryByRole("link", { name: shareHref })).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });

  it.each([
    [true, true],
    [true, false],
    [false, true],
    [false, false],
  ])("keeps feedback owned by the newest attempt (older succeeds: %s, older settles first: %s)", async (olderSucceeds, olderSettlesFirst) => {
    const older = pendingWrite();
    const newer = pendingWrite();
    useClipboard(vi.fn().mockReturnValueOnce(older.promise).mockReturnValueOnce(newer.promise));
    renderAside();
    fireEvent.click(screen.getByRole("button", { name: shared.shareLabel }));
    fireEvent.click(screen.getByRole("button", { name: shared.shareLabel }));

    async function settleOlder() {
      await act(async () => {
        if (olderSucceeds) older.resolve();
        else older.reject(new Error("clipboard denied"));
      });
    }

    if (olderSettlesFirst) {
      await settleOlder();
      expect(screen.getByRole("status")).toBeEmptyDOMElement();
      expect(screen.getByRole("link", { name: shareHref })).toHaveAttribute("href", shareHref);
    }

    await act(async () => {
      if (olderSucceeds) newer.reject(new Error("clipboard denied"));
      else newer.resolve();
    });
    const newestMessage = olderSucceeds ? shared.shareFallbackMessage : shared.shareCopiedMessage;
    expect(screen.getByRole("status")).toHaveTextContent(newestMessage);

    if (!olderSettlesFirst) await settleOlder();

    expect(screen.getByRole("status")).toHaveTextContent(newestMessage);
    expect(screen.getByRole("link", { name: shareHref })).toHaveAttribute("href", shareHref);
  });
});
