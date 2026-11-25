import { fireEvent, render, screen, within } from "@testing-library/react";
import { QuotePage } from "./QuotePage";
import { DrainageQuotePage } from "./DrainageQuotePage";

const notes = "Åvägen & <grind> + 50% {total}\nRing: Örjan? #2";
const calculators = [
  { name: "driveway", path: "/offertberakning/#uppfart", Page: QuotePage, subject: "Offertförfrågan – uppfart", scope: "100", inclusive: "166 600", exclusive: "133 280", project: "uppfart", measurements: "Yta: 100 m²\nAsfalt: Ja", large: "Yta: 101 m²\nAsfalt: Ja" },
  { name: "drainage", path: "/draneringsberakning/", Page: DrainageQuotePage, subject: "Offertförfrågan – husdränering", scope: "40", inclusive: "146 900", exclusive: "117 520", project: "husdränering", measurements: "Längd: 40 löpmeter", large: "Längd: 101 löpmeter" },
] as const;

const draftHelp = "Markera och kopiera mottagare, ämne och meddelande till din webmail. Inget skickas eller kopieras automatiskt. Ändrar du uppgifterna behöver du visa utkastet igen.";

function prepare() {
  fireEvent.click(screen.getByRole("button", { name: "Visa e-postutkast" }));
  for (const label of ["Mottagare", "Ämne", "Meddelande"]) {
    expect(screen.getByRole("textbox", { name: label })).toHaveAccessibleDescription(draftHelp);
  }
}

function body() {
  return (screen.getByRole("textbox", { name: "Meddelande" }) as HTMLTextAreaElement).value.replace(/[\u00a0\u202f]/g, " ");
}

it("associates each calculator draft with its own copy guidance", () => {
  window.history.replaceState(null, "", "/offertberakning/#uppfart");
  render(<><QuotePage /><DrainageQuotePage /></>);
  for (const button of screen.getAllByRole("button", { name: "Visa e-postutkast" })) {
    fireEvent.click(button);
  }
  const drafts = screen.getAllByRole("region", { name: "Visa e-postutkast" });
  expect(drafts).toHaveLength(2);
  const helps = drafts.map(draft => within(draft).getByText(draftHelp));
  expect(new Set(helps.map(help => help.id)).size).toBe(2);
  for (const [index, draft] of drafts.entries()) {
    for (const label of ["Mottagare", "Ämne", "Meddelande"]) {
      const field = within(draft).getByRole("textbox", { name: label });
      expect(field).toHaveAccessibleDescription(draftHelp);
      expect(document.getElementById(field.getAttribute("aria-describedby") ?? "")).toBe(helps[index]);
    }
  }
});

describe.each(calculators)("$name manual email draft", ({ name, path, Page, subject, scope, inclusive, exclusive, project, measurements, large }) => {
  beforeEach(() => {
    window.history.replaceState(null, "", path);
    Object.defineProperty(navigator, "clipboard", { value: undefined, configurable: true });
  });
  afterEach(() => {
    delete (navigator as { clipboard?: unknown }).clipboard;
    vi.restoreAllMocks();
  });

  it("explicitly prepares the complete selectable addressed estimate with literal multiline notes", () => {
    const open = vi.spyOn(window, "open").mockReturnValue(null);
    render(<Page />);
    expect(screen.queryByRole("textbox", { name: "Meddelande" })).not.toBeInTheDocument();
    fireEvent.change(screen.getByRole("textbox", { name: /Om ditt projekt/ }), { target: { value: notes } });
    const originalUrl = window.location.href;
    for (const [mode, total] of [["Inkl. moms", inclusive], ["Exkl. moms", exclusive]] as const) {
      fireEvent.click(screen.getByRole("radio", { name: mode }));
      prepare();
      expect(screen.getByRole("textbox", { name: "Mottagare" })).toHaveValue("linus.svardd@outlook.com");
      expect(screen.getByRole("textbox", { name: "Ämne" })).toHaveValue(subject);
      expect(body()).toBe(`Hej! Jag önskar en offert för ${project}.\n\n${measurements}\nPreliminär summa: ${total} kr (${mode}).\nOmfattning behöver bekräftas.\n\nProjekt / plats / kontaktuppgifter:\n${notes}`);
      for (const label of ["Mottagare", "Ämne", "Meddelande"]) {
        const field = screen.getByRole("textbox", { name: label });
        expect(field).toHaveAttribute("readonly");
        expect(field).toBeEnabled();
      }
      const mail = new URL(screen.getByRole("link", { name: "Begär offert på underlaget" }).getAttribute("href") ?? "");
      expect(screen.getByRole("textbox", { name: "Meddelande" })).toHaveValue(mail.searchParams.get("body"));
    }
    expect(window.location.href).toBe(originalUrl);
    expect(screen.queryByRole("link", { name: /^https?:/ })).not.toBeInTheDocument();
    expect(open).not.toHaveBeenCalled();
  });

  it("discards drafts on every relevant edit, return, reset and invalidation without copying or publishing", () => {
    const writeText = vi.fn();
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    render(<Page />);
    const originalUrl = window.location.href;
    const quantity = screen.getByRole("spinbutton");
    const note = screen.getByRole("textbox", { name: /Om ditt projekt/ });
    const changes = [
      () => fireEvent.change(quantity, { target: { value: "60" } }),
      () => fireEvent.change(quantity, { target: { value: scope } }),
      () => fireEvent.change(note, { target: { value: notes } }),
      () => fireEvent.change(note, { target: { value: "" } }),
      () => fireEvent.click(screen.getByRole("radio", { name: "Exkl. moms" })),
      () => fireEvent.click(screen.getByRole("radio", { name: "Inkl. moms" })),
      ...(name === "driveway" ? [() => fireEvent.click(screen.getByRole("checkbox", { name: /Inkludera asfalt/ }))] : []),
      () => fireEvent.change(note, { target: { value: "Reset me" } }),
      () => fireEvent.click(screen.getByRole("button", { name: "Återställ exempel" })),
      () => fireEvent.change(quantity, { target: { value: "" } }),
    ];
    for (const change of changes) {
      prepare();
      expect(screen.getByRole("textbox", { name: "Meddelande" })).toBeVisible();
      change();
      expect(screen.queryByRole("textbox", { name: "Meddelande" })).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Visa e-postutkast" })).toHaveAttribute("aria-expanded", "false");
    }
    expect(screen.getByRole("button", { name: "Visa e-postutkast" })).toBeDisabled();
    expect(screen.queryByRole("link", { name: /Begär offert/ })).not.toBeInTheDocument();
    fireEvent.change(quantity, { target: { value: scope } });
    expect(screen.queryByRole("textbox", { name: "Meddelande" })).not.toBeInTheDocument();
    prepare();
    expect(body()).toContain(`${inclusive} kr (Inkl. moms)`);
    expect(body()).not.toContain("Reset me");
    expect(writeText).not.toHaveBeenCalled();
    expect(window.location.href).toBe(originalUrl);
  });

  it("prepares only current scope above 100 and requires preparation after price-free VAT edits", () => {
    render(<Page />);
    prepare();
    const quantity = screen.getByRole("spinbutton");
    fireEvent.change(quantity, { target: { value: "101" } });
    expect(screen.queryByRole("textbox", { name: "Meddelande" })).not.toBeInTheDocument();
    fireEvent.change(screen.getByRole("textbox", { name: /Om ditt projekt/ }), { target: { value: notes } });
    const expected = `Hej! Jag önskar en individuell offert för ${project}.\n\n${large}\n\nProjekt / plats / kontaktuppgifter:\n${notes}`;
    prepare();
    expect(body()).toBe(expected);
    expect(screen.getByRole("button", { name: "Skriv ut / spara som PDF" })).toBeDisabled();
    for (const mode of ["Exkl. moms", "Inkl. moms"]) {
      fireEvent.click(screen.getByRole("radio", { name: mode }));
      expect(screen.queryByRole("textbox", { name: "Meddelande" })).not.toBeInTheDocument();
      prepare();
      expect(body()).toBe(expected);
    }
    fireEvent.change(quantity, { target: { value: scope } });
    expect(screen.queryByRole("textbox", { name: "Meddelande" })).not.toBeInTheDocument();
    prepare();
    expect(body()).toContain(`${inclusive} kr (Inkl. moms)`);
  });
});
