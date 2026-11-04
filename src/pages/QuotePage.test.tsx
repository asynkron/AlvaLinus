import { fireEvent, render, screen } from "@testing-library/react";
import { QuotePage } from "./QuotePage";

const money = (value: number) => new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value).replace(/[\u00a0\u202f]/g, " ");

function chooseUppfart() {
  window.location.hash = "uppfart";
  fireEvent(window, new Event("hashchange"));
}

function areaInput() {
  return screen.getByRole("spinbutton", { name: /Uppfartens yta/ });
}

function loadsInput() {
  return screen.getByRole("spinbutton", { name: /Antal lass/ });
}

function decodedEmailHref(): string {
  const link = screen.getByRole("link", { name: /Begär offert/ });

  expect(link.getAttribute("href") ?? "").toContain("mailto:kontakt@svardentreprenad.se");

  return decodeURIComponent(link.getAttribute("href") ?? "").replace(/[\u00a0\u202f]/g, " ");
}

beforeEach(() => {
  window.location.hash = "";
});

describe("QuotePage", () => {
  it("starts with two calculator choice buttons before any calculator fields", () => {
    render(<QuotePage />);

    expect(screen.getByRole("heading", { name: "Vad gäller din offertförfrågan?" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Räkna på husdränering" })).toHaveAttribute("href", "/draneringsberakning/");
    expect(screen.getByRole("link", { name: "Räkna på uppfart" })).toHaveAttribute("href", "#uppfart");

    expect(screen.queryByRole("spinbutton", { name: /Uppfartens yta/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("spinbutton", { name: /Antal lass/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("checkbox", { name: /Inkludera asfalt/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Din kostnadsbild" })).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("reveals only the uppfart calculator after choosing uppfart", () => {
    render(<QuotePage />);
    chooseUppfart();

    expect(areaInput()).toHaveValue(100);
    expect(loadsInput()).toHaveValue(1);
    expect(screen.getByRole("checkbox", { name: /Inkludera asfalt/ })).toBeChecked();
    expect(screen.getByRole("heading", { name: "Din kostnadsbild" })).toBeInTheDocument();
    expect(screen.getByText("Preliminärt underlag")).toBeInTheDocument();
    expect(screen.getByText(money(168600))).toBeInTheDocument();
    expect(screen.getByText("Momsstatus ej bekräftad")).toBeInTheDocument();
    expect(screen.getByText(/inte en bindande offert/)).toBeInTheDocument();

    expect(screen.queryByRole("link", { name: "Räkna på husdränering" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Räkna på uppfart" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Välj annan kalkyl/ })).toHaveAttribute("href", "/offertberakning/");
  });

  it("recalculates the reused driveway calculation into a preliminary total", () => {
    render(<QuotePage />);
    chooseUppfart();
    fireEvent.change(areaInput(), { target: { value: "50" } });

    expect(screen.getByText(money(87750))).toBeInTheDocument();

    fireEvent.click(screen.getByRole("checkbox", { name: /Inkludera asfalt/ }));

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

    expect(href).toContain("Offertförfrågan – uppfart");
    expect(href).toContain("Yta: 50 m²");
    expect(href).toContain("Antal lass: 1");
    expect(href).toContain("Asfalt: Ja");
    expect(href).toContain(`Preliminär summa: ${money(87750)} (momsstatus ej bekräftad)`);
    expect(href).toContain("Omfattning behöver bekräftas");
    expect(href).not.toMatch(/kr\/m|Fast kostnad|950|667/);

    fireEvent.click(screen.getByRole("checkbox", { name: /Inkludera asfalt/ }));

    expect(decodedEmailHref()).toContain("Asfalt: Nej");
  });

  it("blocks invalid quantities without a misleading result and resets the calculator", () => {
    render(<QuotePage />);
    chooseUppfart();

    fireEvent.change(loadsInput(), { target: { value: "1.5" } });

    expect(screen.getByRole("alert")).toHaveTextContent("Ange en yta större än 0, ett helt antal lass och högst 100 000.");
    expect(screen.queryByRole("link", { name: /Begär offert/ })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Kontrollera dina uppgifter/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Skriv ut/ })).toBeDisabled();
    expect(screen.queryByText(/Beräknad totalsumma/)).not.toBeInTheDocument();

    fireEvent.change(areaInput(), { target: { value: "-5" } });
    fireEvent.change(loadsInput(), { target: { value: "1" } });
    expect(screen.getByRole("alert")).toBeInTheDocument();

    fireEvent.change(areaInput(), { target: { value: "" } });
    expect(screen.getByRole("alert")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Återställ exempel/ }));

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(areaInput()).toHaveValue(100);
    expect(loadsInput()).toHaveValue(1);
    expect(screen.getByRole("checkbox", { name: /Inkludera asfalt/ })).toBeChecked();
    expect(screen.getByText(money(168600))).toBeInTheDocument();
  });

  it("describes the quantity fields and announces updates in a polite live region", () => {
    render(<QuotePage />);
    chooseUppfart();

    const help = screen.getByText("Ange en yta större än noll och ett helt antal lass.");

    expect(help).toHaveAttribute("id", "quote-quantity-help");
    expect(areaInput()).toHaveAttribute("aria-describedby", "quote-quantity-help");
    expect(loadsInput()).toHaveAttribute("aria-describedby", "quote-quantity-help");

    const liveRegion = document.querySelector('[aria-live="polite"]');
    expect(liveRegion).not.toBeNull();
    expect(liveRegion).toHaveAttribute("aria-atomic", "true");

    fireEvent.change(loadsInput(), { target: { value: "2" } });

    expect(liveRegion).toHaveTextContent("Beräknad totalsumma");
    expect(liveRegion).toHaveTextContent(money(170600));
  });
});
