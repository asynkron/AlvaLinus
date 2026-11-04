import { fireEvent, render, screen } from "@testing-library/react";
import { DrainageQuotePage } from "./DrainageQuotePage";

const money = (value: number) => new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value);

function lengthInput() {
  return screen.getByRole("spinbutton", { name: /Dräneringens längd/ });
}

function decodedEmailHref(): string {
  const link = screen.getByRole("link", { name: /Begär offert/ });

  expect(link.getAttribute("href") ?? "").toContain("mailto:kontakt@svardentreprenad.se");

  return decodeURIComponent(link.getAttribute("href") ?? "");
}

describe("DrainageQuotePage", () => {
  it("presents the approved example with example prices marked as an estimate, not a binding quote", () => {
    render(<DrainageQuotePage />);

    expect(screen.getByRole("heading", { name: "Vad kostar din dränering?", level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/Exempelpriser inklusive moms/)).toBeInTheDocument();
    expect(screen.getByText(/Totalt 4 500 kr per löpmeter/)).toBeInTheDocument();
    expect(screen.getByText("Preliminärt underlag · exempelpriser")).toBeInTheDocument();
    expect(screen.getByText(/inte en bindande offert/)).toBeInTheDocument();
    expect(screen.getByText(/Det här ingår/)).toBeInTheDocument();
    expect(screen.getByText(/Öppnar ditt e-postprogram. Inget skickas automatiskt./)).toBeInTheDocument();
  });

  it("recalculates part amounts and the preliminary total per löpmeter into the email handoff", () => {
    render(<DrainageQuotePage />);
    fireEvent.change(lengthInput(), { target: { value: "25" } });

    const href = decodedEmailHref();

    expect(href).toContain("Offertförfrågan – dränering");
    expect(href).toContain("Längd: 25 löpmeter");
    expect(href).toContain(`Schakt och markarbete: ${money(25 * 2125)}`);
    expect(href).toContain(`Dränering och fuktskydd: ${money(25 * 1750)}`);
    expect(href).toContain(`Återfyllning och borttransport: ${money(25 * 625)}`);
    expect(href).toContain(`Preliminär summa: ${money(112500)} inklusive moms`);
    expect(href).toContain("Exempelpriser och omfattning behöver bekräftas");
  });

  it("shows the calculated part amounts and total on the page", () => {
    render(<DrainageQuotePage />);
    fireEvent.change(lengthInput(), { target: { value: "25" } });

    expect(screen.getByText(`25 m × ${money(2125)}`)).toBeInTheDocument();
    expect(screen.getByText(money(25 * 2125))).toBeInTheDocument();
    expect(screen.getByText(`25 m × ${money(1750)}`)).toBeInTheDocument();
    expect(screen.getByText(money(25 * 1750))).toBeInTheDocument();
    expect(screen.getByText(`25 m × ${money(625)}`)).toBeInTheDocument();
    expect(screen.getByText(money(25 * 625))).toBeInTheDocument();
    expect(screen.getByText(money(112500))).toBeInTheDocument();
    expect(screen.getByText("Inklusive moms")).toBeInTheDocument();
  });

  it("supports decimal lengths and keeps the same precision in the email", () => {
    render(<DrainageQuotePage />);
    fireEvent.change(lengthInput(), { target: { value: "40.5" } });

    const href = decodedEmailHref();

    expect(href).toContain("Längd: 40,5 löpmeter");
    expect(href).toContain(`Preliminär summa: ${money(40.5 * 4500)} inklusive moms`);
    expect(screen.getByText(money(40.5 * 4500))).toBeInTheDocument();
  });

  it.each(["", "0", "-5", "100001"])("blocks the invalid length %s without a misleading result", (invalid) => {
    render(<DrainageQuotePage />);
    fireEvent.change(lengthInput(), { target: { value: invalid } });

    expect(screen.getByRole("alert")).toHaveTextContent("Ange en längd större än 0 och högst 100 000 meter.");
    expect(screen.queryByRole("link", { name: /Begär offert/ })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Kontrollera dina uppgifter/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Skriv ut/ })).toBeDisabled();
    expect(lengthInput()).toHaveAttribute("aria-invalid", "true");
    expect(screen.queryByText(/Beräknad totalsumma/)).not.toBeInTheDocument();
  });

  it("describes the length field and announces updates in a polite live region", () => {
    render(<DrainageQuotePage />);

    const help = screen.getByText("Ange en längd större än noll.");

    expect(help).toHaveAttribute("id", "meter-help");
    expect(lengthInput()).toHaveAttribute("aria-describedby", "meter-help");

    const liveRegion = document.querySelector('[aria-live="polite"]');
    expect(liveRegion).not.toBeNull();
    expect(liveRegion).toHaveAttribute("aria-atomic", "true");

    fireEvent.change(lengthInput(), { target: { value: "10" } });

    expect(liveRegion).toHaveTextContent("Beräknad totalsumma");
    expect(liveRegion).toHaveTextContent(money(45000));
  });

  it("restores the approved example and clears the project description", () => {
    render(<DrainageQuotePage />);
    fireEvent.change(lengthInput(), { target: { value: "-5" } });
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Villa i Örebro" } });

    expect(screen.getByRole("alert")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Återställ exempel/ }));

    expect(lengthInput()).toHaveValue(40);
    expect(screen.getByRole("textbox")).toHaveValue("");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(decodedEmailHref()).toContain("Längd: 40 löpmeter");
  });
});
