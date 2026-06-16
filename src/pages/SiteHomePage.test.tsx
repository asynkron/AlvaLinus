import { render, screen } from "@testing-library/react";

import { siteContent } from "../data/siteContent";
import type { SiteContent } from "../types/site";
import { SiteHomePage } from "./SiteHomePage";

const content: SiteContent = siteContent;

describe("SiteHomePage", () => {
  it("renders target-inspired service, process, trust, reference, partner, and contact areas", () => {
    render(<SiteHomePage initialState={{ status: "ready", content }} />);

    expect(screen.getByRole("heading", { name: "Eriksson & Svärd" })).toBeInTheDocument();
    expect(screen.getAllByText("Våra tjänster").length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: "En pålitlig partner inom mark, bygg och anläggning" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Från första kontakt till slutfört arbete" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Trygghetssignalerna från startsidan" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Projekt och uppdrag som ger substans" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Partnerfältet från källsidan" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Kontakta oss för offert" })).toBeInTheDocument();
  });

  it("preserves Swedish UTF-8 characters in representative user-facing copy", () => {
    render(<SiteHomePage initialState={{ status: "ready", content }} />);

    expect(screen.getByText("Mark & anläggning i Örebro")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Dränering" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Grävjobb" })).toBeInTheDocument();
    expect(screen.getByText("Trädgårdsplanering")).toBeInTheDocument();
    expect(screen.getByText("Mångårig erfarenhet")).toBeInTheDocument();
  });

  it("documents the sitemap inventory and route decision in the rendered page", () => {
    render(<SiteHomePage initialState={{ status: "ready", content }} />);

    expect(screen.getByText(/58 publika sid-URL:er kontrollerade/)).toBeInTheDocument();
    expect(screen.getByText(/flera navigerbara sid-URL:er/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Referensobjekt" })).toHaveAttribute("href", "/referenser/");
  });

  it("links from the home page to real static subpage paths", () => {
    render(<SiteHomePage initialState={{ status: "ready", content }} />);

    expect(screen.getByRole("link", { name: "Våra tjänster" })).toHaveAttribute("href", "/tjanster/");
    expect(screen.getByRole("link", { name: "Kontakta oss för offert" })).toHaveAttribute("href", "/kontakt/");
    expect(screen.getByRole("link", { name: "Stensättning" })).toHaveAttribute("href", "/stensattning/");
  });

  it("shows an empty state when static data has no services", () => {
    render(<SiteHomePage initialState={{ status: "ready", content: { ...content, services: [] } }} />);

    expect(screen.getByRole("heading", { name: "Inget innehåll ännu" })).toBeInTheDocument();
  });

  it("shows an error state", () => {
    render(<SiteHomePage initialState={{ status: "error", message: "Kunde inte läsa statisk data." }} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Kunde inte läsa statisk data.");
  });

  it("starts with a loading state before static content resolves", () => {
    render(<SiteHomePage />);

    expect(screen.getByLabelText("Laddar innehåll")).toBeInTheDocument();
  });

  it("renders representative service tags", () => {
    render(<SiteHomePage initialState={{ status: "ready", content }} />);

    expect(screen.getByText("Marksten Örebro")).toBeInTheDocument();
    expect(screen.getByText("Glasfiberpool")).toBeInTheDocument();
  });

  it("renders a dedicated service page for a sitemap path", () => {
    render(<SiteHomePage currentPath="/stensattning/" initialState={{ status: "ready", content }} />);

    expect(screen.getByRole("heading", { name: "Stensättning", level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/egen URL i den statiska strukturen/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Visa källsida" })).toHaveAttribute(
      "href",
      "https://www.erikssonsvard.se/stensattning/",
    );
  });

  it("renders dedicated references and contact paths", () => {
    const { rerender } = render(<SiteHomePage currentPath="/referenser/" initialState={{ status: "ready", content }} />);

    expect(screen.getByRole("heading", { name: "Referensobjekt", level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Projekt och uppdrag som ger substans" })).toBeInTheDocument();

    rerender(<SiteHomePage currentPath="/kontakt/" initialState={{ status: "ready", content }} />);

    expect(screen.getByRole("heading", { name: "Kontakt", level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Kontakta oss för offert" })).toBeInTheDocument();
  });

  it("fails unknown paths gracefully", () => {
    render(<SiteHomePage currentPath="/saknas/" initialState={{ status: "ready", content }} />);

    expect(screen.getByRole("heading", { name: /Sidan finns inte/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Startsida" })).toHaveAttribute("href", "/");
  });
});
