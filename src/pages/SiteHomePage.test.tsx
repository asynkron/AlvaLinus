import { fireEvent, render, screen, within } from "@testing-library/react";

import { siteContent } from "../data/siteContent";
import type { SiteContent } from "../types/site";
import { SiteHomePage } from "./SiteHomePage";

const content: SiteContent = siteContent;
const emptyServicesContent: SiteContent = { ...content, services: [] };

function serviceCard(id: string): HTMLElement {
  const card = document.getElementById(id);

  if (!card) {
    throw new Error(`Missing rendered service card #${id}`);
  }

  return card;
}

function contentTarget(): HTMLElement {
  const target = document.getElementById("content");

  if (!target) {
    throw new Error("Missing rendered #content target");
  }

  return target;
}

describe("SiteHomePage", () => {
  it("offers a Swedish skip link before header navigation that targets the stable page content", () => {
    render(<SiteHomePage initialState={{ status: "ready", content }} />);

    const skipLink = screen.getByRole("link", { name: "Hoppa till innehåll" });
    expect(skipLink).toHaveAttribute("href", "#content");

    const main = screen.getByRole("main");
    expect(main.firstElementChild).toBe(skipLink);

    const brandLink = screen.getByRole("link", { name: "Svärd Entreprenad startsida" });
    expect(skipLink.compareDocumentPosition(brandLink) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    const header = screen.getByRole("banner");
    const target = contentTarget();
    expect(target).toHaveAttribute("tabindex", "-1");
    expect(header.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it.each([
    { focusable: true, label: "ready home", element: <SiteHomePage initialState={{ status: "ready", content }} /> },
    {
      focusable: true,
      label: "ready subpage",
      element: <SiteHomePage currentPath="/dranering/" initialState={{ status: "ready", content }} />,
    },
    {
      focusable: true,
      label: "unknown route",
      element: <SiteHomePage currentPath="/saknas/" initialState={{ status: "ready", content }} />,
    },
    { focusable: false, label: "loading", element: <SiteHomePage /> },
    {
      focusable: false,
      label: "error",
      element: <SiteHomePage initialState={{ status: "error", message: "Kunde inte läsa statisk data." }} />,
    },
    {
      focusable: false,
      label: "empty",
      element: <SiteHomePage initialState={{ status: "ready", content: emptyServicesContent }} />,
    },
  ])(
    "keeps exactly one stable content target in the $label state",
    ({ element, focusable }) => {
      render(element);

      const targets = document.querySelectorAll("#content");
      expect(targets).toHaveLength(1);

      const target = targets.item(0);

      if (!target) {
        throw new Error("Missing rendered #content target");
      }

      const skipLink = screen.getByRole("link", { name: "Hoppa till innehåll" });
      expect(skipLink).toHaveAttribute("href", `#${target.id}`);

      if (focusable) {
        expect(target).toHaveAttribute("tabindex", "-1");
      }
    },
  );

  it.each(["link", "toggle"] as const)("dismisses mobile navigation with Escape from its %s and allows reopening", (focusOrigin) => {
    render(<SiteHomePage currentPath="/dranering/" initialState={{ status: "ready", content }} />);

    const toggle = screen.getByRole("button", { name: "Öppna meny" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("navigation", { name: "Mobilnavigation" })).not.toBeInTheDocument();

    fireEvent.click(toggle);
    expect(toggle).toHaveAccessibleName("Stäng meny");
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    const navigation = screen.getByRole("navigation", { name: "Mobilnavigation" });
    const link = within(navigation).getByRole("link", { name: "Dränering" });
    const focusedControl = focusOrigin === "link" ? link : toggle;
    focusedControl.focus();
    expect(focusedControl).toHaveFocus();

    for (const shiftKey of [false, true]) {
      // JSDOM does not move focus on Tab; check that the browser's default
      // forward/backward navigation is not cancelled by the menu handler.
      expect(fireEvent.keyDown(focusedControl, { key: "Tab", shiftKey })).toBe(true);
      expect(navigation).toBeInTheDocument();
    }

    fireEvent.keyDown(focusedControl, { key: "Escape" });
    expect(screen.queryByRole("navigation", { name: "Mobilnavigation" })).not.toBeInTheDocument();
    expect(toggle).toHaveAccessibleName("Öppna meny");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();

    fireEvent.click(toggle);
    const reopenedNavigation = screen.getByRole("navigation", { name: "Mobilnavigation" });
    const reopenedLink = within(reopenedNavigation).getByRole("link", { name: "Dränering" });
    expect(reopenedLink).toHaveAttribute("href", "/dranering/");
    expect(reopenedLink).toHaveAttribute("aria-current", "page");
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(toggle);
    expect(screen.queryByRole("navigation", { name: "Mobilnavigation" })).not.toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
  });

  it("keeps mobile navigation open and preserves focus when Escape is pressed elsewhere in the header", () => {
    render(<SiteHomePage initialState={{ status: "ready", content }} />);

    const toggle = screen.getByRole("button", { name: "Öppna meny" });
    fireEvent.click(toggle);
    const navigation = screen.getByRole("navigation", { name: "Mobilnavigation" });
    const homeLink = screen.getByRole("link", { name: "Svärd Entreprenad startsida" });
    homeLink.focus();
    expect(homeLink).toHaveFocus();

    fireEvent.keyDown(homeLink, { key: "Escape" });

    expect(navigation).toBeInTheDocument();
    expect(toggle).toHaveAccessibleName("Stäng meny");
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(homeLink).toHaveFocus();
  });

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
    expect(screen.getByRole("heading", { name: "Därför väljer kunder oss" })).toBeInTheDocument();
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
    expect(screen.getByText(/från första kontakt till färdigt resultat/)).toBeInTheDocument();
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

  it("falls back to the route SVG on the first photo error and removes the image when the fallback also fails", () => {
    render(<SiteHomePage initialState={{ status: "ready", content }} />);

    const stensattningCard = within(serviceCard("stensattning"));
    const fallbackSrc = "/page-visuals/svard-entreprenad-stensattning.svg";
    const image = stensattningCard.getByRole("img");

    expect(image).toHaveAttribute("src", "/page-visuals/stensattning-photo.webp");
    expect(image).toHaveAttribute("alt", "Noggrant lagd marksten och låg stenmur vid entré");
    expect(image).toHaveAttribute("loading", "lazy");

    fireEvent.error(image);

    const fallbackImage = stensattningCard.getByRole("img");
    expect(fallbackImage).toHaveAttribute("src", fallbackSrc);
    expect(fallbackImage).toHaveAttribute("alt", "Noggrant lagd marksten och låg stenmur vid entré");
    expect(fallbackImage).toHaveAttribute("loading", "lazy");

    fireEvent.error(image);

    expect(stensattningCard.queryByRole("img")).not.toBeInTheDocument();
    expect(stensattningCard.getByRole("heading", { name: "Stensättning" })).toBeInTheDocument();
    expect(stensattningCard.getByText(/Planerade stenytor/)).toBeInTheDocument();
    expect(stensattningCard.getByRole("link", { name: "Läs mer" })).toHaveAttribute("href", "/stensattning/");

    fireEvent.error(image);

    expect(stensattningCard.queryByRole("img")).not.toBeInTheDocument();
    expect(stensattningCard.getByRole("heading", { name: "Stensättning" })).toBeInTheDocument();
    expect(stensattningCard.getByRole("link", { name: "Läs mer" })).toHaveAttribute("href", "/stensattning/");
  });

  it("keeps neighboring service cards and their successful images untouched when one card image fails twice", () => {
    render(<SiteHomePage initialState={{ status: "ready", content }} />);

    const failingCard = within(serviceCard("stensattning"));
    fireEvent.error(failingCard.getByRole("img"));
    fireEvent.error(failingCard.getByRole("img"));
    expect(failingCard.queryByRole("img")).not.toBeInTheDocument();

    const markarbeteCard = within(serviceCard("markarbete"));
    const markarbeteImage = markarbeteCard.getByRole("img");
    expect(markarbeteImage).toHaveAttribute("src", "/page-visuals/markarbete-photo.webp");
    expect(markarbeteImage).toHaveAttribute("alt", "Schaktad tomt med maskin och förberedd markbädd");
    expect(markarbeteImage).toHaveAttribute("loading", "lazy");
    expect(markarbeteCard.getByRole("heading", { name: "Markarbete" })).toBeInTheDocument();
    expect(markarbeteCard.getByRole("link", { name: "Läs mer" })).toHaveAttribute("href", "/markarbete/");

    const gravjobbCard = within(serviceCard("gravjobb"));
    expect(gravjobbCard.getByRole("img")).toHaveAttribute("src", "/page-visuals/gravjobb-photo.webp");
    expect(gravjobbCard.getByRole("heading", { name: "Grävjobb" })).toBeInTheDocument();
  });

  it.each([
    { label: "home", path: "/" },
    { label: "services index", path: "/tjanster/" },
  ])("keeps $label empty-services feedback when services are empty", ({ path }) => {
    render(<SiteHomePage currentPath={path} initialState={{ status: "ready", content: emptyServicesContent }} />);

    expect(screen.getByRole("heading", { name: "Inget innehåll ännu" })).toBeInTheDocument();
    expect(screen.queryByRole("form", { name: "Offertförfrågan via e-post" })).not.toBeInTheDocument();
  });

  it("keeps about and contact bodies available when services are empty", () => {
    const { rerender } = render(
      <SiteHomePage currentPath="/om-oss/" initialState={{ status: "ready", content: emptyServicesContent }} />,
    );

    expect(screen.getByRole("heading", { name: "Om oss", level: 1 })).toBeInTheDocument();
    expect(screen.getAllByText(/På Svärd Entreprenad brinner vi/).length).toBeGreaterThan(0);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(document.querySelectorAll("#content")).toHaveLength(1);
    expect(contentTarget()).toHaveAttribute("tabindex", "-1");

    rerender(<SiteHomePage currentPath="/kontakt/" initialState={{ status: "ready", content: emptyServicesContent }} />);

    expect(screen.getByRole("heading", { name: "Kontakt", level: 1 })).toBeInTheDocument();
    const form = screen.getByRole("form", { name: "Offertförfrågan via e-post" });
    const formScope = within(form);
    expect(formScope.getByLabelText("Namn")).toHaveAttribute("name", "name");
    const note = formScope.getByText(/öppnas i ditt eget e-postprogram/);
    expect(note).toHaveAttribute("id", "kontakt-handoff-note");
    expect(formScope.getByRole("link", { name: content.contact.form.recipientEmail })).toHaveAttribute(
      "href",
      `mailto:${content.contact.form.recipientEmail}?subject=${encodeURIComponent(content.contact.form.subject)}`,
    );
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(document.querySelectorAll("#content")).toHaveLength(1);
  });

  it("keeps service and unknown routes on not-found recovery when services are empty", () => {
    const { rerender } = render(
      <SiteHomePage currentPath="/stensattning/" initialState={{ status: "ready", content: emptyServicesContent }} />,
    );

    expect(screen.getByRole("heading", { name: "Sidan finns inte" })).toBeInTheDocument();
    expect(screen.getByText(/matchar ingen aktuell sida/)).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Inget innehåll ännu" })).not.toBeInTheDocument();

    rerender(
      <SiteHomePage currentPath="/saknas/" initialState={{ status: "ready", content: emptyServicesContent }} />,
    );

    expect(screen.getByRole("heading", { name: "Sidan finns inte" })).toBeInTheDocument();
    expect(screen.getByText(/matchar ingen aktuell sida/)).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Inget innehåll ännu" })).not.toBeInTheDocument();
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
    expect(form).toHaveAttribute("aria-describedby", "kontakt-handoff-note");
    const note = formScope.getByText(/öppnas i ditt eget e-postprogram/);
    expect(note).toHaveAttribute("id", "kontakt-handoff-note");
    expect(note).toHaveTextContent("Webbplatsen kan inte bekräfta att meddelandet har levererats");
    const fallback = formScope.getByRole("link", { name: content.contact.form.recipientEmail });
    expect(fallback).toHaveAttribute(
      "href",
      `mailto:${content.contact.form.recipientEmail}?subject=${encodeURIComponent(content.contact.form.subject)}`,
    );
    const submit = formScope.getByRole("button", { name: "Skicka offertförfrågan" });
    expect(note.compareDocumentPosition(submit) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.queryByText(/tack för din förfrågan|meddelandet har skickats/i)).not.toBeInTheDocument();
    expect(formScope.queryByRole("option", { name: "Pool" })).not.toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: content.contact.form.recipientEmail })).toHaveLength(2);
    const footerScope = within(screen.getByRole("contentinfo"));
    expect(footerScope.getByRole("link", { name: content.contact.form.recipientEmail })).toHaveAttribute(
      "href",
      `mailto:${content.contact.form.recipientEmail}`,
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
