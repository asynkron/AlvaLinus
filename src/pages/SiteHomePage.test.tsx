import { render, screen, within } from "@testing-library/react";

import { siteContent } from "../data/siteContent";
import type { SiteContent } from "../types/site";
import { SiteHomePage } from "./SiteHomePage";

const content: SiteContent = siteContent;

describe("SiteHomePage", () => {
  it("renders owner-approved home content, service, process, partner, and contact areas", () => {
    render(<SiteHomePage initialState={{ status: "ready", content }} />);

    expect(screen.getByRole("link", { name: "Svärd Entreprenad startsida" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("img", { name: "Svärd Entreprenad logotyp" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Svärd Entreprenad" })).toBeInTheDocument();
    expect(screen.getByText(/Välkommen till Svärd Entreprenad/)).toBeInTheDocument();
    expect(screen.getByText(/Din trygga partner från första spadtag till färdigt resultat/)).toBeInTheDocument();
    expect(screen.getAllByText("Våra tjänster").length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: "En pålitlig partner inom mark, bygg och anläggning" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Från första kontakt till slutfört arbete" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Trygghetssignalerna från startsidan" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Samarbetspartner" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Kontakta oss för offert" })).toBeInTheDocument();
  });

  it("preserves Swedish UTF-8 characters in representative user-facing copy", () => {
    render(<SiteHomePage initialState={{ status: "ready", content }} />);

    expect(screen.getByText("Mark & anläggning i Örebro")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Dränering" }).length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: "Grävjobb" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Trädgårdsplanering" })).toBeInTheDocument();
    expect(screen.getByText("Mångårig erfarenhet")).toBeInTheDocument();
  });

  it("shows the requested primary navigation labels as real route links", () => {
    render(<SiteHomePage initialState={{ status: "ready", content }} />);

    expect(screen.getAllByRole("link", { name: "Hem" })[0]).toHaveAttribute("href", "/");
    expect(screen.getAllByRole("link", { name: "Tjänster" })[0]).toHaveAttribute("href", "/tjanster/");
    expect(screen.getAllByRole("link", { name: "Om oss" })[0]).toHaveAttribute("href", "/om-oss/");
    expect(screen.getAllByRole("link", { name: "Dränering" })[0]).toHaveAttribute("href", "/dranering/");
    expect(screen.getAllByRole("link", { name: "Kontakt" })[0]).toHaveAttribute("href", "/kontakt/");
    expect(screen.queryByRole("link", { name: "Pool" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Referensobjekt" })).not.toBeInTheDocument();
  });

  it("presents the updated route decision as customer-facing service guidance", () => {
    render(<SiteHomePage initialState={{ status: "ready", content }} />);

    expect(screen.getByRole("heading", { name: "Tydliga vägar för rätt uppdrag" })).toBeInTheDocument();
    expect(screen.getByText(/Hitta snabbt till företagets viktigaste information/)).toBeInTheDocument();
    expect(screen.getByText(/Pool och referensjobb är borttagna som egna ytor/)).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Om oss" })[0]).toHaveAttribute("href", "/om-oss/");
  });

  it("links from the home page to active static subpage paths only", () => {
    render(<SiteHomePage initialState={{ status: "ready", content }} />);

    expect(screen.getByRole("link", { name: "Våra tjänster" })).toHaveAttribute("href", "/tjanster/");
    expect(screen.getByRole("link", { name: "Kontakta oss för offert" })).toHaveAttribute("href", "/kontakt/");
    expect(screen.getAllByRole("link", { name: "Dränering" })[0]).toHaveAttribute("href", "/dranering/");
    expect(content.routes.map((route) => route.href)).not.toContain("/pool/");
    expect(content.routes.map((route) => route.href)).not.toContain("/referenser/");
  });

  it("keeps every current route aligned with a page-specific visual asset", () => {
    const expectedVisualsByRoute = new Map([
      ["home", "/page-visuals/svard-entreprenad-home.svg"],
      ["services", "/page-visuals/svard-entreprenad-services.svg"],
      ["about", "/page-visuals/svard-entreprenad-about.svg"],
      ["stensattning", "/page-visuals/svard-entreprenad-stensattning.svg"],
      ["markarbete", "/page-visuals/svard-entreprenad-markarbete.svg"],
      ["gravjobb", "/page-visuals/svard-entreprenad-gravjobb.svg"],
      ["dranering", "/page-visuals/svard-entreprenad-dranering.svg"],
      ["tradgard", "/page-visuals/svard-entreprenad-tradgardsplanering.svg"],
      ["contact", "/page-visuals/svard-entreprenad-contact.svg"],
    ]);

    expect(content.routes).toHaveLength(9);

    for (const route of content.routes) {
      expect(route.visual.assetPath).toBe(expectedVisualsByRoute.get(route.id));
      expect(route.visual.alt.trim()).not.toHaveLength(0);
      expect(route.visual.intent.trim()).not.toHaveLength(0);
      expect(route.visual.alt).not.toMatch(/Alva|Linus|Svärdlinus/i);
      expect(route.visual.intent).not.toMatch(/Alva|Linus|Svärdlinus/i);
    }
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

  it("renders representative service tags including pool digging under Grävjobb", () => {
    render(<SiteHomePage initialState={{ status: "ready", content }} />);

    expect(screen.getByText("Marksten Örebro")).toBeInTheDocument();
    expect(screen.getByText("Poolgrävning")).toBeInTheDocument();
  });

  it("renders a dedicated service page with customer-facing guidance", () => {
    render(<SiteHomePage currentPath="/stensattning/" initialState={{ status: "ready", content }} />);

    expect(screen.getByRole("heading", { name: "Stensättning", level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "När tjänsten passar" })).toBeInTheDocument();
    expect(screen.getByText(/markförutsättningar och nästa steg/)).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Visa källsida" })).not.toBeInTheDocument();
  });

  it("renders dedicated Dränering and Grävjobb pages", () => {
    const { rerender } = render(<SiteHomePage currentPath="/dranering/" initialState={{ status: "ready", content }} />);

    expect(screen.getByRole("heading", { name: "Dränering", level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/fuktsäkring runt husgrund/)).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Visa källsida" })).not.toBeInTheDocument();

    rerender(<SiteHomePage currentPath="/gravjobb/" initialState={{ status: "ready", content }} />);

    expect(screen.getByRole("heading", { name: "Grävjobb", level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/poolgrävning där rätt förarbete avgör slutresultatet/)).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Visa källsida" })).not.toBeInTheDocument();
  });

  it("renders dedicated about and contact paths", () => {
    const { rerender } = render(<SiteHomePage currentPath="/om-oss/" initialState={{ status: "ready", content }} />);

    expect(screen.getByRole("heading", { name: "Om oss", level: 1 })).toBeInTheDocument();
    expect(screen.getAllByText(/På Svärd Entreprenad brinner vi/).length).toBeGreaterThan(0);
    expect(screen.getByText(/modern utrustning med gedigen yrkeskunskap/)).toBeInTheDocument();

    rerender(<SiteHomePage currentPath="/kontakt/" initialState={{ status: "ready", content }} />);

    expect(screen.getByRole("heading", { name: "Kontakt", level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Kontakta oss för offert" })).toBeInTheDocument();
  });

  it("hides partner content when no current collaborator is configured", () => {
    render(<SiteHomePage initialState={{ status: "ready", content }} />);

    expect(screen.queryByRole("heading", { name: "Samarbetspartner" })).not.toBeInTheDocument();
    expect(screen.queryByText("UC Brons")).not.toBeInTheDocument();
    expect(screen.queryByText("Benders")).not.toBeInTheDocument();
    expect(screen.queryByText("Ahlsell")).not.toBeInTheDocument();
    expect(screen.queryByText("Wasa Kredit")).not.toBeInTheDocument();
  });

  it("renders a static email handoff form and footer contact email", () => {
    render(<SiteHomePage currentPath="/kontakt/" initialState={{ status: "ready", content }} />);

    const form = screen.getByRole("form", { name: "Offertförfrågan via e-post" });
    const formScope = within(form);

    expect(form).toHaveAttribute("method", "post");
    expect(form).toHaveAttribute(
      "action",
      `mailto:${content.contact.form.recipientEmail}?subject=${encodeURIComponent(content.contact.form.subject)}`,
    );
    expect(form).toHaveAttribute("enctype", "text/plain");
    expect(formScope.getByLabelText("Namn")).toHaveAttribute("name", "name");
    expect(formScope.getByLabelText("Kundtyp")).toHaveAttribute("name", "customerType");
    expect(formScope.getByLabelText("Tjänst")).toHaveAttribute("name", "service");
    expect(formScope.getByLabelText("Meddelande")).toHaveAttribute("name", "message");
    expect(formScope.getByRole("button", { name: "Skicka offertförfrågan" })).toHaveAttribute("type", "submit");
    expect(formScope.queryByRole("option", { name: "Pool" })).not.toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "kontakt@svardentreprenad.se" })[0]).toHaveAttribute(
      "href",
      "mailto:kontakt@svardentreprenad.se",
    );
    expect(screen.queryByRole("link", { name: /Källa/ })).not.toBeInTheDocument();
  });

  it("fails unknown paths gracefully", () => {
    render(<SiteHomePage currentPath="/saknas/" initialState={{ status: "ready", content }} />);

    expect(screen.getByRole("heading", { name: "Sidan finns inte" })).toBeInTheDocument();
    expect(screen.getByText(/matchar ingen aktuell sida/)).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Hem" })[0]).toHaveAttribute("href", "/");
  });
});
