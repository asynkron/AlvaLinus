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
  it("presents the drainage estimate without internal prices or part amounts", () => {
    render(<DrainageQuotePage />);

    expect(screen.getByRole("heading", { name: "Vad kostar din dränering?", level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Husdränering" })).toBeInTheDocument();
    expect(screen.getByText("Preliminärt underlag")).toBeInTheDocument();
    expect(screen.getByText(/Det här ingår/)).toBeInTheDocument();
    expect(screen.getByText(/Etablering och schaktning längs husgrund/)).toBeInTheDocument();
    expect(screen.getByText("Momsstatus ej bekräftad")).toBeInTheDocument();
    expect(screen.getByText(/inte en bindande offert/)).toBeInTheDocument();
    expect(screen.getByText(/Öppnar ditt e-postprogram. Inget skickas automatiskt./)).toBeInTheDocument();

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

    expect(href).toContain("Offertförfrågan – husdränering");
    expect(href).toContain(`Längd: ${meters} löpmeter`);
    expect(href).toContain(`Preliminär summa: ${money(expected)} (momsstatus ej bekräftad)`);
    expect(href).toContain("Omfattning behöver bekräftas");
    expect(href).not.toMatch(/kr\/m|Schakt och markarbete/);
  });

  it("supports decimal lengths and keeps the same precision in the email", () => {
    render(<DrainageQuotePage />);
    fireEvent.change(lengthInput(), { target: { value: "40.5" } });

    const href = decodedEmailHref();

    expect(href).toContain("Längd: 40,5 löpmeter");
    expect(href).toContain(`Preliminär summa: ${money(148650)} (momsstatus ej bekräftad)`);
    expect(screen.getByText(money(148650))).toBeInTheDocument();
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
    expect(liveRegion).toHaveTextContent(money(41900));
  });

  it("restores the example and clears the project description", () => {
    render(<DrainageQuotePage />);
    fireEvent.change(lengthInput(), { target: { value: "-5" } });
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Villa i Örebro" } });

    expect(screen.getByRole("alert")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Återställ exempel/ }));

    expect(lengthInput()).toHaveValue(40);
    expect(screen.getByRole("textbox")).toHaveValue("");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(decodedEmailHref()).toContain("Längd: 40 löpmeter");
    expect(decodedEmailHref()).toContain(`Preliminär summa: ${money(146900)}`);
  });

  it("links visitors with a driveway project back to the quote calculator", () => {
    render(<DrainageQuotePage />);

    const link = screen.getByRole("link", { name: "Räkna på uppfart" });

    expect(link).toHaveAttribute("href", "/offertberakning/");
  });
});
