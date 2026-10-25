import { render, screen } from "@testing-library/react";
import { App } from "./App";

it("renders bundled page content immediately without a loading placeholder", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: "Svärd Entreprenad", level: 1 })).toBeInTheDocument();
  expect(screen.queryByLabelText("Laddar innehåll")).not.toBeInTheDocument();
  expect(screen.getByRole("banner")).toBeInTheDocument();
  expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
});
