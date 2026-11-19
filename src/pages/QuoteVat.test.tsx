import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { siteContent } from "../data/siteContent";
import { DrainageQuotePage } from "./DrainageQuotePage";
import { QuotePage } from "./QuotePage";

const shared = siteContent.quote.shared;
const calculators = [
  { name: "driveway", path: "/offertberakning/", hash: "#uppfart", parameter: "yta", scope: "100", Page: QuotePage, inclusive: "166 600 kr", exclusive: "133 280 kr", fractionalInclusive: "6 896,29 kr", fractionalExclusive: "5 517,04 kr" },
  { name: "drainage", path: "/draneringsberakning/", hash: "", parameter: "langd", scope: "40", Page: DrainageQuotePage, inclusive: "146 900 kr", exclusive: "117 520 kr", fractionalInclusive: "11 220,98 kr", fractionalExclusive: "8 976,79 kr" },
] as const;

function mailBody(label = shared.sendLabel): string {
  const href = screen.getByRole("link", { name: label }).getAttribute("href") ?? "";
  return new URLSearchParams(href.split("?")[1]).get("body")?.replace(/[\u00a0\u202f]/g, " ") ?? "";
}

describe.each(calculators)("$name VAT selection", ({ path, hash, parameter, scope, Page, inclusive, exclusive, fractionalInclusive, fractionalExclusive }) => {
  beforeEach(() => window.history.replaceState(null, "", `${path}${hash}`));
  afterEach(() => vi.restoreAllMocks());

  it("selects mutually exclusive VAT modes by keyboard and labels the result, draft and print handoff", async () => {
    const user = userEvent.setup();
    render(<Page />);
    const result = screen.getByRole("complementary");
    const included = screen.getByRole("radio", { name: "Inkl. moms" });
    const excluded = screen.getByRole("radio", { name: "Exkl. moms" });
    expect(screen.getByRole("group", { name: "Moms" })).toContainElement(included);
    expect(included).toBeChecked();
    expect(excluded).not.toBeChecked();
    expect(result).toHaveTextContent(inclusive);
    expect(result).toHaveTextContent("Inkl. moms");
    expect(mailBody()).toContain(`${inclusive} (Inkl. moms)`);

    included.focus();
    await user.keyboard("{ArrowRight}");
    expect(excluded).toHaveFocus();
    expect(excluded).toBeChecked();
    expect(included).not.toBeChecked();
    expect(result).toHaveTextContent(exclusive);
    expect(result).toHaveTextContent("Exkl. moms");
    expect(mailBody()).toContain(`${exclusive} (Exkl. moms)`);
    expect(mailBody()).not.toContain(inclusive);

    const print = vi.spyOn(window, "print").mockImplementation(() => {
      expect(result).toHaveTextContent(exclusive);
      expect(within(result).getByText("Exkl. moms")).toBeVisible();
    });
    await user.click(screen.getByRole("button", { name: shared.printLabel }));
    expect(print).toHaveBeenCalled();
  });

  it("always recalculates from inclusive prices without accumulated rounding and resets to inclusive", async () => {
    const user = userEvent.setup();
    render(<Page />);
    fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "1.234567" } });
    const result = screen.getByRole("complementary");
    expect(result).toHaveTextContent(fractionalInclusive);
    screen.getByRole("radio", { name: "Inkl. moms" }).focus();
    for (let toggle = 0; toggle < 3; toggle += 1) {
      await user.keyboard("{ArrowRight}");
      expect(result).toHaveTextContent(fractionalExclusive);
      expect(mailBody()).toContain(`${fractionalExclusive} (Exkl. moms)`);
      await user.keyboard("{ArrowLeft}");
      expect(result).toHaveTextContent(fractionalInclusive);
    }
    await user.keyboard("{ArrowRight}");
    await user.click(screen.getByRole("button", { name: /Återställ exempel/ }));
    expect(screen.getByRole("radio", { name: "Inkl. moms" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Exkl. moms" })).not.toBeChecked();
    expect(result).toHaveTextContent(inclusive);
    expect(mailBody()).toContain(`${inclusive} (Inkl. moms)`);
  });

  it("keeps over-100 contact price-free in either VAT mode and restores the selected estimate below the limit", async () => {
    const user = userEvent.setup();
    render(<Page />);
    const result = screen.getByRole("complementary");
    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: "100.1" } });
    for (const mode of ["Inkl. moms", "Exkl. moms"]) {
      await user.click(screen.getByRole("radio", { name: mode }));
      expect(result).toHaveTextContent(shared.individualQuoteHeading);
      expect(result).not.toHaveTextContent(shared.totalLabel);
      expect(result).not.toHaveTextContent(/\bkr\b|Inkl\. moms|Exkl\. moms/);
      expect(mailBody(shared.individualQuoteSendLabel)).not.toMatch(/kr|summa|moms/i);
      expect(screen.getByRole("button", { name: shared.printLabel })).toBeDisabled();
    }
    fireEvent.change(input, { target: { value: scope } });
    expect(result).toHaveTextContent(exclusive);
    expect(mailBody()).toContain(`${exclusive} (Exkl. moms)`);
  });

  it("restores and shares an exclusive VAT estimate while old links default to inclusive", async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, "", `${path}?${parameter}=${scope}&moms=exkl${hash}`);
    render(<Page />);
    expect(screen.getByRole("radio", { name: "Exkl. moms" })).toBeChecked();
    expect(screen.getByRole("complementary")).toHaveTextContent(exclusive);
    await user.click(screen.getByRole("button", { name: shared.shareLabel }));
    expect(new URLSearchParams(window.location.search).get("moms")).toBe("exkl");
  });
});
