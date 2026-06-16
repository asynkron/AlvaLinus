import { render, screen, waitFor } from "@testing-library/react";

import { SiteHomePage } from "./SiteHomePage";
import type { SiteContent } from "../types/site";

const content: SiteContent = {
  hero: {
    title: "Testad statisk data",
    intro: "Intro fran testdata.",
    primaryAction: { label: "Primar", href: "#content" },
    secondaryAction: { label: "Sekundar", href: "#foundation" },
  },
  sections: [
    {
      id: "one",
      title: "Forsta sektionen",
      summary: "Renderas fran ett typat objekt.",
    },
  ],
};

describe("SiteHomePage", () => {
  it("renders static typed data", async () => {
    render(<SiteHomePage initialState={{ status: "ready", content }} />);

    expect(screen.getByRole("heading", { name: "Testad statisk data" })).toBeInTheDocument();
    expect(screen.getByText("Renderas fran ett typat objekt.")).toBeInTheDocument();
  });

  it("shows an empty state when static data has no sections", () => {
    render(<SiteHomePage initialState={{ status: "ready", content: { ...content, sections: [] } }} />);

    expect(screen.getByRole("heading", { name: "Inget innehall annu" })).toBeInTheDocument();
  });

  it("shows an error state", () => {
    render(<SiteHomePage initialState={{ status: "error", message: "Kunde inte lasa statisk data." }} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Kunde inte lasa statisk data.");
  });

  it("starts with a loading state before static content resolves", async () => {
    render(<SiteHomePage />);

    expect(screen.getByLabelText("Laddar innehall")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole("heading", { name: "AlvaLinus" })).toBeInTheDocument());
  });
});
