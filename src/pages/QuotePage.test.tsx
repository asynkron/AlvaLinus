import { fireEvent, render, screen } from "@testing-library/react";
import { QuotePage } from "./QuotePage";

describe("QuotePage", () => {
  it("recalculates the supplied example and includes the same breakdown in the email", () => {
    render(<QuotePage />);
    const area = screen.getByRole("spinbutton", { name: /Uppfartens yta/ });
    fireEvent.change(area, { target: { value: "50" } });
    const link = screen.getByRole("link", { name: /Begär offert/ });
    expect(decodeURIComponent(link.getAttribute("href") ?? "")).toContain("87 750");
    fireEvent.click(screen.getByRole("checkbox", { name: /Inkludera asfalt/ }));
    expect(decodeURIComponent(link.getAttribute("href") ?? "")).toContain("54 400");
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "exclusive" } });
    expect(decodeURIComponent(link.getAttribute("href") ?? "")).toContain("68 000");
  });
  it("blocks invalid quantities and resets the full calculator", () => {
    render(<QuotePage />);
    fireEvent.change(screen.getByRole("spinbutton", { name: /Antal lass/ }), { target: { value: "1.5" } });
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Begär offert/ })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Återställ exempel/ }));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByRole("spinbutton", { name: /Antal lass/ })).toHaveValue(1);
  });
});
