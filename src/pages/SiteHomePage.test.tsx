import { fireEvent, render, screen, within } from "@testing-library/react";

import { siteContent } from "../data/siteContent";
import type { ServiceArea, SiteContent } from "../types/site";
import { SiteHomePage } from "./SiteHomePage";

const content: SiteContent = siteContent;
const emptyServicesContent: SiteContent = { ...content, services: [] };

const chrome = content.chrome;
const skipLinkLabel = chrome.skipLinkLabel;
const desktopNavLabel = chrome.navAriaLabel;
const mobileNavLabel = chrome.mobileNavAriaLabel;
const menuOpenLabel = chrome.menuOpenLabel;
const menuCloseLabel = chrome.menuCloseLabel;
const emptyStateTitle = chrome.emptyStateTitle;

function readMoreName(service: ServiceArea): string {
  return `${content.sectionHeadings.services.readMoreAriaPrefix} ${service.title}`;
}

function registryService(id: string): ServiceArea {
  const service = content.services.find((item) => item.id === id);

  if (!service) {
    throw new Error(`Missing registry service ${id}`);
  }

  return service;
}

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

function heroImage(src: string): HTMLImageElement {
  const image = document.querySelector<HTMLImageElement>(`img[src="${src}"]`);

  if (!image) {
    throw new Error(`Missing rendered hero image ${src}`);
  }

  return image;
}

function notFoundSummary(path: string): string {
  return siteContent.chrome.notFound.summaryTemplate.replace("{path}", path);
}

describe("SiteHomePage", () => {
  it("offers a Swedish skip link before header navigation that targets the stable page content", () => {
    render(<SiteHomePage content={content} />);

    const skipLink = screen.getByRole("link", { name: skipLinkLabel });
    expect(skipLink).toHaveAttribute("href", "#content");

    const header = screen.getByRole("banner");
    const main = screen.getByRole("main");
    const footer = screen.getByRole("contentinfo");
    const target = contentTarget();

    expect(skipLink.compareDocumentPosition(header) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(header.compareDocumentPosition(main) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    // JSDOM resolves banner/contentinfo roles even inside main, so pin the
    // browser-visible landmark structure through DOM containment instead.
    expect(main.contains(header)).toBe(false);
    expect(main.contains(footer)).toBe(false);

    expect(target).toBe(main);
    expect(target).toHaveAttribute("tabindex", "-1");
    expect(header.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it.each([
    { focusable: true, label: "ready home", element: <SiteHomePage content={content} /> },
    {
      focusable: true,
      label: "ready subpage",
      element: <SiteHomePage currentPath="/dranering/" content={content} />,
    },
    {
      focusable: true,
      label: "unknown route",
      element: <SiteHomePage currentPath="/saknas/" content={content} />,
    },
    {
      focusable: false,
      label: "empty",
      element: <SiteHomePage content={emptyServicesContent} />,
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

      const skipLink = screen.getByRole("link", { name: skipLinkLabel });
      expect(skipLink).toHaveAttribute("href", `#${target.id}`);
      expect(target).toBe(screen.getByRole("main"));

      const header = screen.getByRole("banner");
      const footer = screen.queryByRole("contentinfo");
      expect(target.contains(header)).toBe(false);

      if (footer) {
        expect(target.contains(footer)).toBe(false);
      }

      if (focusable) {
        expect(target).toHaveAttribute("tabindex", "-1");
      }
    },
  );

  it.each(["link", "toggle"] as const)("dismisses mobile navigation with Escape from its %s and allows reopening", (focusOrigin) => {
    render(<SiteHomePage currentPath="/dranering/" content={content} />);

    const toggle = screen.getByRole("button", { name: menuOpenLabel });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("navigation", { name: mobileNavLabel })).not.toBeInTheDocument();

    fireEvent.click(toggle);
    expect(toggle).toHaveAccessibleName(menuCloseLabel);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    const navigation = screen.getByRole("navigation", { name: mobileNavLabel });
    const link = within(navigation).getAllByRole("link", { name: "Dränering" })[0];

    if (!link) {
      throw new Error("Missing mobile Dränering link");
    }

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
    expect(screen.queryByRole("navigation", { name: mobileNavLabel })).not.toBeInTheDocument();
    expect(toggle).toHaveAccessibleName(menuOpenLabel);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();

    fireEvent.click(toggle);
    const reopenedNavigation = screen.getByRole("navigation", { name: mobileNavLabel });
    const reopenedLink = within(reopenedNavigation).getAllByRole("link", { name: "Dränering" })[0];
    expect(reopenedLink).toHaveAttribute("href", "/dranering/");
    expect(reopenedLink).toHaveAttribute("aria-current", "page");
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(toggle);
    expect(screen.queryByRole("navigation", { name: mobileNavLabel })).not.toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
  });

  it("keeps mobile navigation open and preserves focus when Escape is pressed elsewhere in the header", () => {
    render(<SiteHomePage content={content} />);

    const toggle = screen.getByRole("button", { name: menuOpenLabel });
    fireEvent.click(toggle);
    const navigation = screen.getByRole("navigation", { name: mobileNavLabel });
    const homeLink = screen.getByRole("link", { name: `${content.chrome.brand.name} startsida` });
    homeLink.focus();
    expect(homeLink).toHaveFocus();

    fireEvent.keyDown(homeLink, { key: "Escape" });

    expect(navigation).toBeInTheDocument();
    expect(toggle).toHaveAccessibleName(menuCloseLabel);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(homeLink).toHaveFocus();
  });

  it("keeps the desktop Tjänster dropdown trigger focusable with its five registry-ordered service links", () => {
    render(<SiteHomePage content={content} />);

    const headerNav = within(screen.getByRole("banner")).getByRole("navigation", { name: desktopNavLabel });
    const serviceRoutes = content.routes.filter((route) => route.kind === "service");
    const serviceHrefs = new Set(serviceRoutes.map((route) => route.href));
    const trigger = within(headerNav).getByRole("link", { name: "Tjänster" });
    const dropdownLinks = within(headerNav)
      .getAllByRole("link")
      .filter((link) => serviceHrefs.has(link.getAttribute("href") ?? ""));

    expect(trigger).toHaveAttribute("href", "/tjanster/");
    expect(trigger).toHaveAttribute("aria-haspopup", "true");

    trigger.focus();
    expect(trigger).toHaveFocus();

    for (const shiftKey of [false, true]) {
      // JSDOM does not move focus on Tab; check that the browser's default
      // forward/backward navigation is not cancelled by the dropdown trigger.
      expect(fireEvent.keyDown(trigger, { key: "Tab", shiftKey })).toBe(true);
    }
    expect(trigger).toHaveFocus();

    expect(dropdownLinks).toHaveLength(serviceRoutes.length);
    expect(dropdownLinks.map((link) => link.getAttribute("href"))).toEqual(serviceRoutes.map((route) => route.href));
    expect(new Set(dropdownLinks.map((link) => link.parentElement)).size).toBe(1);

    const group = trigger.parentElement;

    if (!group) {
      throw new Error("Missing rendered desktop dropdown group wrapper");
    }

    for (const [index, route] of serviceRoutes.entries()) {
      const link = dropdownLinks[index];
      const previous = index > 0 ? dropdownLinks[index - 1] : undefined;

      if (!link || (index > 0 && !previous)) {
        throw new Error(`Missing rendered desktop dropdown service link for ${route.label}`);
      }

      expect(group.contains(link)).toBe(true);
      expect(link).toHaveAccessibleName(route.label);

      if (previous) {
        expect(previous.compareDocumentPosition(link) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      }
    }
  });

  it("opens the desktop Kalkyler disclosure straight to the drainage and driveway calculators", () => {
    render(<SiteHomePage content={content} />);

    const headerNav = within(screen.getByRole("banner")).getByRole("navigation", { name: desktopNavLabel });
    const summary = within(headerNav).getByText(content.chrome.calcMenu.label);
    const menu = summary.closest("details");

    if (!menu) {
      throw new Error("Missing rendered desktop Kalkyler details element");
    }

    expect(summary.tagName).toBe("SUMMARY");
    expect(menu).not.toHaveAttribute("open");

    fireEvent.click(summary);
    expect(menu).toHaveAttribute("open");

    const links = within(menu).getAllByRole("link");
    expect(links.map((link) => link.textContent?.trim())).toEqual(["Dränering", "Uppfart"]);
    expect(links.map((link) => link.getAttribute("href"))).toEqual(["/draneringsberakning/", "/offertberakning/#uppfart"]);

    for (const link of links) {
      const routeHrefs = content.routes.map((route) => route.href);
      expect(routeHrefs).toContain((link.getAttribute("href") ?? "").split("#")[0]);
    }
  });

  it("keeps the same Kalkyler calculator links inside the mobile menu disclosure", () => {
    render(<SiteHomePage content={content} />);

    fireEvent.click(screen.getByRole("button", { name: menuOpenLabel }));
    const navigation = screen.getByRole("navigation", { name: mobileNavLabel });
    const summary = within(navigation).getByText(content.chrome.calcMenu.label);
    const menu = summary.closest("details");

    if (!menu) {
      throw new Error("Missing rendered mobile Kalkyler details element");
    }

    expect(summary.tagName).toBe("SUMMARY");
    expect(menu).not.toHaveAttribute("open");

    fireEvent.click(summary);
    expect(menu).toHaveAttribute("open");

    const links = within(menu).getAllByRole("link");
    expect(links.map((link) => link.textContent?.trim())).toEqual(["Dränering", "Uppfart"]);
    expect(links.map((link) => link.getAttribute("href"))).toEqual(["/draneringsberakning/", "/offertberakning/#uppfart"]);
  });

  it("marks the active calculator link inside Kalkyler and highlights the group only on calculator pages", () => {
    const headerNav = () => within(screen.getByRole("banner")).getByRole("navigation", { name: desktopNavLabel });
    const summary = () => within(headerNav()).getByText(content.chrome.calcMenu.label);
    const menuFor = (currentSummary: HTMLElement) => {
      const menu = currentSummary.closest("details");

      if (!menu) {
        throw new Error("Missing rendered Kalkyler details element");
      }

      return menu;
    };

    const { rerender } = render(<SiteHomePage currentPath="/draneringsberakning/" content={content} />);

    const drainageMenu = menuFor(summary());
    expect(within(drainageMenu).getByRole("link", { name: "Dränering" })).toHaveAttribute("aria-current", "page");
    expect(within(drainageMenu).getByRole("link", { name: "Uppfart" })).not.toHaveAttribute("aria-current");
    expect(summary()).toHaveClass("text-primary-onDark");

    rerender(<SiteHomePage currentPath="/offertberakning/" content={content} />);

    const drivewayMenu = menuFor(summary());
    expect(within(drivewayMenu).getByRole("link", { name: "Uppfart" })).toHaveAttribute("aria-current", "page");
    expect(within(drivewayMenu).getByRole("link", { name: "Dränering" })).not.toHaveAttribute("aria-current");
    expect(summary()).toHaveClass("text-primary-onDark");

    rerender(<SiteHomePage currentPath="/" content={content} />);

    expect(summary()).toHaveClass("text-background/75");
  });

  it("renders owner-approved home content, service, process, partner, and contact areas", () => {
    render(<SiteHomePage content={content} />);

    expect(screen.getByRole("link", { name: `${content.chrome.brand.name} startsida` })).toHaveAttribute("href", "/");
    expect(screen.getByRole("img", { name: `${content.chrome.brand.name} logotyp` })).toHaveAttribute(
      "src",
      content.chrome.brand.logoSrc,
    );
    expect(screen.getByRole("heading", { name: "Svärd Entreprenad" })).toBeInTheDocument();
    expect(screen.getByText(/Välkommen till Svärd Entreprenad/)).toBeInTheDocument();
    expect(screen.getByText(/Din trygga partner från första spadtag till färdigt resultat/)).toBeInTheDocument();
    expect(screen.getAllByText(content.sectionHeadings.services.eyebrow).length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: content.sectionHeadings.services.title })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: content.sectionHeadings.process.title })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: content.sectionHeadings.trust.title })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: content.sectionHeadings.partners.title })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Kontakta oss för offert" })).toBeInTheDocument();
  });

  it("preserves Swedish UTF-8 characters in representative user-facing copy", () => {
    render(<SiteHomePage content={content} />);

    expect(screen.getByText("Mark & anläggning i Örebro")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Dränering" }).length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: "Grävjobb" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Trädgårdsplanering" })).toBeInTheDocument();
    expect(screen.getByText("Mångårig erfarenhet")).toBeInTheDocument();
  });

  it("shows the requested primary navigation labels as real route links", () => {
    render(<SiteHomePage content={content} />);

    expect(screen.getAllByRole("link", { name: "Hem" })[0]).toHaveAttribute("href", "/");
    expect(screen.getAllByRole("link", { name: "Tjänster" })[0]).toHaveAttribute("href", "/tjanster/");
    expect(screen.getAllByRole("link", { name: "Om oss" })[0]).toHaveAttribute("href", "/om-oss/");
    expect(screen.getAllByRole("link", { name: "Dränering" })[0]).toHaveAttribute("href", "/dranering/");
    expect(screen.getAllByRole("link", { name: "Kontakt" })[0]).toHaveAttribute("href", "/kontakt/");
    expect(screen.queryByRole("link", { name: "Pool" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Referensobjekt" })).not.toBeInTheDocument();
  });

  it("derives header, mobile menu and footer navigation from the typed route registry", () => {
    render(<SiteHomePage content={content} />);

    const pageRoutes = content.routes.filter((route) => route.kind !== "service");
    const headerRoutes = pageRoutes.filter((route) => route.kind !== "quote");
    const serviceRoutes = content.routes.filter((route) => route.kind === "service");
    const calcLinks = content.chrome.calcMenu.links;
    const headerNav = headerRoutes.flatMap((route) =>
      route.kind === "services"
        ? [
            { label: route.label, href: route.href },
            ...serviceRoutes.map((service) => ({ label: service.label, href: service.href })),
            ...calcLinks.map((link) => ({ label: link.label, href: link.href })),
          ]
        : [{ label: route.label, href: route.href }],
    );
    const renderedNav = (scope: HTMLElement) =>
      within(scope)
        .getAllByRole("link")
        .map((link) => ({ label: link.textContent?.trim(), href: link.getAttribute("href") }));

    const header = screen.getByRole("banner");
    expect(renderedNav(within(header).getByRole("navigation", { name: desktopNavLabel }))).toEqual(headerNav);

    fireEvent.click(screen.getByRole("button", { name: menuOpenLabel }));
    expect(renderedNav(screen.getByRole("navigation", { name: mobileNavLabel }))).toEqual(headerNav);

    const footer = screen.getByRole("contentinfo");
    expect(
      renderedNav(within(footer).getByRole("navigation", { name: content.chrome.footer.pageNavAriaLabel })),
    ).toEqual(pageRoutes.map((route) => ({ label: route.label, href: route.href })));
    expect(renderedNav(within(footer).getByRole("navigation", { name: content.chrome.footer.servicesNavAriaLabel }))).toEqual(
      serviceRoutes.map((route) => ({ label: route.label, href: route.href })),
    );

    for (const route of [...pageRoutes, ...serviceRoutes]) {
      expect(screen.getAllByRole("link", { name: route.label }).length).toBeGreaterThan(0);
    }
  });

  it("renders the shared page chrome from the typed registry", () => {
    const { rerender } = render(<SiteHomePage currentPath="/saknas/" content={content} />);

    const header = screen.getByRole("banner");
    expect(within(header).getByRole("link", { name: `${chrome.brand.name} startsida` })).toHaveAttribute("href", "/");
    expect(within(header).getByRole("img", { name: `${chrome.brand.name} logotyp` })).toHaveAttribute(
      "src",
      chrome.brand.logoSrc,
    );

    expect(screen.getByRole("heading", { name: chrome.notFound.title, level: 1 })).toBeInTheDocument();
    expect(screen.getByText(chrome.notFound.eyebrow)).toBeInTheDocument();
    expect(screen.getByText(notFoundSummary("/saknas/"))).toBeInTheDocument();
    expect(screen.getByText(chrome.notFound.shortcutsLabel)).toBeInTheDocument();

    rerender(<SiteHomePage currentPath="/stensattning/" content={content} />);

    const breadcrumb = screen.getByRole("navigation", { name: chrome.breadcrumb.ariaLabel });
    expect(within(breadcrumb).getByRole("link", { name: chrome.breadcrumb.homeLabel })).toHaveAttribute("href", "/");
    expect(screen.getByText(chrome.service.heroEyebrow)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: chrome.service.guidanceHeading })).toBeInTheDocument();
    expect(screen.getByText(chrome.contactBand.eyebrow)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: chrome.contactBand.ctaLabel })).toHaveAttribute(
      "href",
      "/kontakt/?tjanst=stensattning",
    );

    const footer = screen.getByRole("contentinfo");
    expect(within(footer).getByText(chrome.brand.name)).toBeInTheDocument();
    expect(within(footer).getByText(chrome.footer.tagline)).toBeInTheDocument();
    const pageNav = within(footer).getByRole("navigation", { name: chrome.footer.pageNavAriaLabel });
    expect(within(pageNav).getByText(chrome.footer.pageHeading)).toBeInTheDocument();
    const servicesNav = within(footer).getByRole("navigation", { name: chrome.footer.servicesNavAriaLabel });
    expect(within(servicesNav).getByText(chrome.footer.servicesHeading)).toBeInTheDocument();
    expect(within(footer).getAllByText(chrome.footer.contactHeading).length).toBeGreaterThan(0);
    expect(within(footer).getByText(`© ${chrome.brand.name}`)).toBeInTheDocument();
  });

  it("presents the updated route decision as customer-facing service guidance", () => {
    render(<SiteHomePage content={content} />);

    expect(screen.getByRole("heading", { name: content.inventory.heading })).toBeInTheDocument();
    expect(screen.getByText(content.inventory.helper)).toBeInTheDocument();
    expect(screen.getByText(content.inventory.routeDecision)).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Om oss" })[0]).toHaveAttribute("href", "/om-oss/");
  });

  it("links from the home page to active static subpage paths only", () => {
    render(<SiteHomePage content={content} />);

    expect(screen.getByRole("link", { name: "Våra tjänster" })).toHaveAttribute("href", "/tjanster/");
    expect(screen.getByRole("link", { name: "Kontakta oss för offert" })).toHaveAttribute("href", "/kontakt/");
    expect(screen.getAllByRole("link", { name: "Dränering" })[0]).toHaveAttribute("href", "/dranering/");
    expect(content.routes.map((route) => route.href)).not.toContain("/pool/");
    expect(content.routes.map((route) => route.href)).not.toContain("/referenser/");
  });

  it.each(["/", "/tjanster/"])("names every service-card link by its destination on %s", (currentPath) => {
    render(<SiteHomePage currentPath={currentPath} content={content} />);

    for (const service of content.services) {
      const link = screen.getByRole("link", { name: readMoreName(service) });
      expect(link).toHaveAttribute("href", service.href);
      expect(link).toHaveTextContent(content.sectionHeadings.services.readMoreLabel);
    }
  });

  it("keeps every current route aligned with a page-specific visual asset", () => {
    const expectedVisualsByRoute = new Map([
      ["quote", "/page-visuals/svard-entreprenad-quote.svg"],
      ["drainage-quote", "/page-visuals/svard-entreprenad-draneringsberakning.svg"],
      ["home", "/page-visuals/svard-entreprenad-home.svg"],
      ["services", "/page-visuals/svard-entreprenad-services.svg"],
      ["about", "/page-visuals/svard-entreprenad-about.svg"],
      ["inhyrning", "/page-visuals/svard-entreprenad-inhyrning.svg"],
      ["stensattning", "/page-visuals/svard-entreprenad-stensattning.svg"],
      ["markarbete", "/page-visuals/svard-entreprenad-markarbete.svg"],
      ["gravjobb", "/page-visuals/svard-entreprenad-gravjobb.svg"],
      ["dranering", "/page-visuals/svard-entreprenad-dranering.svg"],
      ["tradgard", "/page-visuals/svard-entreprenad-tradgardsplanering.svg"],
      ["contact", "/page-visuals/svard-entreprenad-contact.svg"],
    ]);

    expect(content.routes).toHaveLength(12);

    for (const route of content.routes) {
      expect(route.visual.assetPath).toBe(expectedVisualsByRoute.get(route.id));
      expect(route.visual.alt.trim()).not.toHaveLength(0);
      expect(route.visual.intent.trim()).not.toHaveLength(0);
      expect(route.visual.alt).not.toMatch(/Alva|Linus|Svärdlinus/i);
      expect(route.visual.intent).not.toMatch(/Alva|Linus|Svärdlinus/i);
    }
  });

  it("keeps every current route aligned with a registry-owned hero photo asset", () => {
    const expectedHeroPhotosByRoute = new Map([
      ["quote", "/page-visuals/quote-hero.webp"],
      ["drainage-quote", "/page-visuals/draneringsberakning-hero.webp"],
      ["home", "/page-visuals/hero-photo.webp"],
      ["services", "/page-visuals/services-hero.webp"],
      ["about", "/page-visuals/svard-entreprenad-about.svg"],
      ["inhyrning", "/page-visuals/inhyrning-hero.svg"],
      ["stensattning", "/page-visuals/stensattning-photo.webp"],
      ["markarbete", "/page-visuals/markarbete-photo.webp"],
      ["gravjobb", "/page-visuals/gravjobb-photo.webp"],
      ["dranering", "/page-visuals/dranering-photo.webp"],
      ["tradgard", "/page-visuals/tradgard-generated.webp"],
      ["contact", "/page-visuals/svard-entreprenad-contact.svg"],
    ]);

    expect(content.routes).toHaveLength(12);
    expect(new Set(content.routes.map((route) => route.heroPhotoAssetPath)).size).toBe(12);

    for (const route of content.routes) {
      expect(route.heroPhotoAssetPath).toBe(expectedHeroPhotosByRoute.get(route.id));
    }

    const declaredHeroSrcSetsByRoute = new Map([
      ["quote", "/page-visuals/quote-hero-640.webp 640w, /page-visuals/quote-hero-960.webp 960w, /page-visuals/quote-hero.webp 1672w"],
      ["drainage-quote", "/page-visuals/dranering-photo-400.webp 400w, /page-visuals/dranering-photo-640.webp 640w, /page-visuals/draneringsberakning-hero.webp 900w"],
      ["home", "/page-visuals/hero-photo-640.webp 640w, /page-visuals/hero-photo-960.webp 960w, /page-visuals/hero-photo.webp 1600w"],
      ["services", "/page-visuals/services-hero-640.webp 640w, /page-visuals/services-hero-960.webp 960w, /page-visuals/services-hero.webp 1672w"],
      ["stensattning", "/page-visuals/stensattning-photo-400.webp 400w, /page-visuals/stensattning-photo-640.webp 640w, /page-visuals/stensattning-photo.webp 900w"],
      ["markarbete", "/page-visuals/markarbete-photo-400.webp 400w, /page-visuals/markarbete-photo-640.webp 640w, /page-visuals/markarbete-photo.webp 900w"],
      ["gravjobb", "/page-visuals/gravjobb-photo-400.webp 400w, /page-visuals/gravjobb-photo-640.webp 640w, /page-visuals/gravjobb-photo.webp 900w"],
      ["dranering", "/page-visuals/dranering-photo-400.webp 400w, /page-visuals/dranering-photo-640.webp 640w, /page-visuals/dranering-photo.webp 900w"],
      ["tradgard", "/page-visuals/tradgard-generated-640.webp 640w, /page-visuals/tradgard-generated-960.webp 960w, /page-visuals/tradgard-generated.webp 1568w"],
    ]);

    expect(declaredHeroSrcSetsByRoute.size).toBe(9);

    for (const route of content.routes) {
      const declaredSrcSet = declaredHeroSrcSetsByRoute.get(route.id);

      if (declaredSrcSet === undefined) {
        expect(route.heroPhotoSrcSet).toBeUndefined();
        expect(route.heroPhotoSizes).toBeUndefined();
      } else {
        expect(route.heroPhotoSrcSet).toBe(declaredSrcSet);
        expect(route.heroPhotoSizes).toBe("100vw");
      }
    }
  });

  it("fetches above-the-fold hero images at high priority while service card images stay lazy", () => {
    const { rerender } = render(<SiteHomePage content={content} />);

    const homeHero = heroImage("/page-visuals/hero-photo.webp");
    expect(homeHero).toHaveAttribute("fetchpriority", "high");
    expect(homeHero).toHaveAttribute("alt", "");
    expect(homeHero).toHaveAttribute("aria-hidden", "true");
    expect(homeHero).not.toHaveAttribute("loading");
    expect(homeHero).toHaveAttribute(
      "srcset",
      "/page-visuals/hero-photo-640.webp 640w, /page-visuals/hero-photo-960.webp 960w, /page-visuals/hero-photo.webp 1600w",
    );
    expect(homeHero).toHaveAttribute("sizes", "100vw");

    const serviceImage = within(serviceCard("stensattning")).getByRole("img");
    expect(serviceImage).toHaveAttribute("loading", "lazy");
    expect(serviceImage).not.toHaveAttribute("fetchpriority");

    rerender(<SiteHomePage currentPath="/om-oss/" content={content} />);

    const pageHero = heroImage("/page-visuals/svard-entreprenad-about.svg");
    expect(pageHero).toHaveAttribute("fetchpriority", "high");
    expect(pageHero).toHaveAttribute("alt", "");
    expect(pageHero).toHaveAttribute("aria-hidden", "true");
    expect(pageHero).not.toHaveAttribute("srcset");

    fireEvent.error(pageHero);
    expect(pageHero).toHaveStyle({ display: "none" });

    rerender(<SiteHomePage currentPath="/stensattning/" content={content} />);

    const serviceHero = heroImage("/page-visuals/stensattning-photo.webp");
    expect(serviceHero).toHaveAttribute("fetchpriority", "high");
    expect(serviceHero).toHaveAttribute("alt", "");
    expect(serviceHero).toHaveAttribute("aria-hidden", "true");
    expect(serviceHero).toHaveAttribute(
      "srcset",
      "/page-visuals/stensattning-photo-400.webp 400w, /page-visuals/stensattning-photo-640.webp 640w, /page-visuals/stensattning-photo.webp 900w",
    );
    expect(serviceHero).toHaveAttribute("sizes", "100vw");

    rerender(<SiteHomePage currentPath="/tradgardsplanering/" content={content} />);

    const tradgardHero = heroImage("/page-visuals/tradgard-generated.webp");
    expect(tradgardHero).toHaveAttribute("fetchpriority", "high");
    expect(tradgardHero).toHaveAttribute("alt", "");
    expect(tradgardHero).toHaveAttribute("aria-hidden", "true");
    expect(tradgardHero).toHaveAttribute(
      "srcset",
      "/page-visuals/tradgard-generated-640.webp 640w, /page-visuals/tradgard-generated-960.webp 960w, /page-visuals/tradgard-generated.webp 1568w",
    );
    expect(tradgardHero).toHaveAttribute("sizes", "100vw");

    rerender(<SiteHomePage currentPath="/tjanster/" content={content} />);

    const servicesHero = heroImage("/page-visuals/services-hero.webp");
    expect(servicesHero).toHaveAttribute("fetchpriority", "high");
    expect(servicesHero).toHaveAttribute("alt", "");
    expect(servicesHero).toHaveAttribute("aria-hidden", "true");
    expect(servicesHero).toHaveAttribute(
      "srcset",
      "/page-visuals/services-hero-640.webp 640w, /page-visuals/services-hero-960.webp 960w, /page-visuals/services-hero.webp 1672w",
    );
    expect(servicesHero).toHaveAttribute("sizes", "100vw");
  });

  it("falls back to the route SVG on the first photo error and removes the image when the fallback also fails", () => {
    render(<SiteHomePage content={content} />);

    const stensattning = registryService("stensattning");
    const stensattningCard = within(serviceCard("stensattning"));
    const fallbackSrc = "/page-visuals/svard-entreprenad-stensattning.svg";
    const image = stensattningCard.getByRole("img");

    expect(image).toHaveAttribute("src", "/page-visuals/stensattning-photo.webp");
    expect(image).toHaveAttribute("alt", "Stenmur längs en trädgård under anläggningsarbete");
    expect(image).toHaveAttribute("loading", "lazy");

    fireEvent.error(image);

    const fallbackImage = stensattningCard.getByRole("img");
    expect(fallbackImage).toHaveAttribute("src", fallbackSrc);
    expect(fallbackImage).toHaveAttribute("alt", "Stenmur längs en trädgård under anläggningsarbete");
    expect(fallbackImage).toHaveAttribute("loading", "lazy");

    fireEvent.error(image);

    expect(stensattningCard.queryByRole("img")).not.toBeInTheDocument();
    expect(stensattningCard.getByRole("heading", { name: stensattning.title })).toBeInTheDocument();
    expect(stensattningCard.getByText(stensattning.summary)).toBeInTheDocument();
    expect(stensattningCard.getByRole("link", { name: readMoreName(stensattning) })).toHaveAttribute("href", "/stensattning/");

    fireEvent.error(image);

    expect(stensattningCard.queryByRole("img")).not.toBeInTheDocument();
    expect(stensattningCard.getByRole("heading", { name: stensattning.title })).toBeInTheDocument();
    expect(stensattningCard.getByRole("link", { name: readMoreName(stensattning) })).toHaveAttribute("href", "/stensattning/");
  });

  it("keeps neighboring service cards and their successful images untouched when one card image fails twice", () => {
    render(<SiteHomePage content={content} />);

    const failingCard = within(serviceCard("stensattning"));
    fireEvent.error(failingCard.getByRole("img"));
    fireEvent.error(failingCard.getByRole("img"));
    expect(failingCard.queryByRole("img")).not.toBeInTheDocument();

    const markarbete = registryService("markarbete");
    const markarbeteCard = within(serviceCard("markarbete"));
    const markarbeteImage = markarbeteCard.getByRole("img");
    expect(markarbeteImage).toHaveAttribute("src", "/page-visuals/markarbete-photo.webp");
    expect(markarbeteImage).toHaveAttribute("alt", "Planerad jordyta och stenlagd gång vid markarbete");
    expect(markarbeteImage).toHaveAttribute("loading", "lazy");
    expect(markarbeteCard.getByRole("heading", { name: markarbete.title })).toBeInTheDocument();
    expect(markarbeteCard.getByRole("link", { name: readMoreName(markarbete) })).toHaveAttribute("href", "/markarbete/");

    const gravjobbCard = within(serviceCard("gravjobb"));
    expect(gravjobbCard.getByRole("img")).toHaveAttribute("src", "/page-visuals/gravjobb-photo.webp");
    expect(gravjobbCard.getByRole("heading", { name: "Grävjobb" })).toBeInTheDocument();
  });

  it("keeps the decorative home hero photo on the success path", () => {
    render(<SiteHomePage content={content} />);

    const image = heroImage("/page-visuals/hero-photo.webp");

    expect(image).toHaveAttribute("src", "/page-visuals/hero-photo.webp");
    expect(image).toHaveAttribute("alt", "");
    expect(image).toHaveAttribute("aria-hidden", "true");
    expect(image.style.display).not.toBe("none");
  });

  it("hides a failing home hero photo without a retry loop and keeps the hero intact", () => {
    render(<SiteHomePage content={content} />);

    const image = heroImage("/page-visuals/hero-photo.webp");

    fireEvent.error(image);

    expect(image).toHaveStyle({ display: "none" });
    expect(document.querySelectorAll("img[alt='']")).toHaveLength(1);

    fireEvent.error(image);

    expect(image).toHaveStyle({ display: "none" });
    expect(document.querySelectorAll("img[alt='']")).toHaveLength(1);
    expect(screen.getByRole("heading", { name: "Svärd Entreprenad", level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/Välkommen till Svärd Entreprenad/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Våra tjänster" })).toHaveAttribute("href", "/tjanster/");
    expect(screen.getByRole("link", { name: "Kontakta oss för offert" })).toHaveAttribute("href", "/kontakt/");
    expect(screen.getByText("noggrant utförda markarbeten")).toBeInTheDocument();
  });

  it.each([
    { label: "home", path: "/" },
    { label: "services index", path: "/tjanster/" },
  ])("keeps $label empty-services feedback when services are empty", ({ path }) => {
    render(<SiteHomePage currentPath={path} content={emptyServicesContent} />);

    expect(screen.getByRole("heading", { name: emptyStateTitle })).toBeInTheDocument();
    expect(screen.queryByRole("form", { name: "Offertförfrågan via e-post" })).not.toBeInTheDocument();
  });

  it("keeps about and contact bodies available when services are empty", () => {
    const { rerender } = render(
      <SiteHomePage currentPath="/om-oss/" content={emptyServicesContent} />,
    );

    expect(screen.getByRole("heading", { name: "Om oss", level: 1 })).toBeInTheDocument();
    expect(screen.getAllByText(/På Svärd Entreprenad brinner vi/).length).toBeGreaterThan(0);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(document.querySelectorAll("#content")).toHaveLength(1);
    expect(contentTarget()).toHaveAttribute("tabindex", "-1");

    rerender(<SiteHomePage currentPath="/kontakt/" content={emptyServicesContent} />);

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
      <SiteHomePage currentPath="/stensattning/" content={emptyServicesContent} />,
    );

    expect(screen.getByRole("heading", { name: content.chrome.notFound.title })).toBeInTheDocument();
    expect(screen.getByText(notFoundSummary("/stensattning/"))).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: emptyStateTitle })).not.toBeInTheDocument();

    rerender(
      <SiteHomePage currentPath="/saknas/" content={emptyServicesContent} />,
    );

    expect(screen.getByRole("heading", { name: content.chrome.notFound.title })).toBeInTheDocument();
    expect(screen.getByText(notFoundSummary("/saknas/"))).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: emptyStateTitle })).not.toBeInTheDocument();
  });

  it("renders ready bundled content on the first paint without a loading skeleton", () => {
    render(<SiteHomePage />);

    expect(screen.queryByLabelText("Laddar innehåll")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Svärd Entreprenad", level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/Välkommen till Svärd Entreprenad/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Våra tjänster" })).toHaveAttribute("href", "/tjanster/");
  });

  it("renders representative service tags including pool digging under Grävjobb", () => {
    render(<SiteHomePage content={content} />);

    expect(screen.getByText("Marksten Örebro")).toBeInTheDocument();
    expect(screen.getByText("Poolgrävning")).toBeInTheDocument();
  });

  it("renders a dedicated service page with customer-facing guidance", () => {
    const stensattning = content.services.find((service) => service.id === "stensattning")!;
    const dranering = content.services.find((service) => service.id === "dranering")!;
    expect(stensattning.guidance).not.toEqual(dranering.guidance);
    expect(stensattning.detail).toBeUndefined();

    const { rerender } = render(
      <SiteHomePage currentPath="/stensattning/" content={content} />,
    );

    expect(screen.getByRole("heading", { name: "Stensättning", level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: content.chrome.service.guidanceHeading })).toBeInTheDocument();
    expect(screen.getByText(stensattning.guidance)).toBeInTheDocument();
    expect(screen.queryByText(/fuktsäkring runt husgrund/)).not.toBeInTheDocument();
    expect(screen.queryByText(/markförutsättningar och nästa steg/)).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Visa källsida" })).not.toBeInTheDocument();

    rerender(<SiteHomePage currentPath="/dranering/" content={content} />);

    expect(screen.getByRole("heading", { name: "Dränering", level: 1 })).toBeInTheDocument();
    expect(screen.getByText(dranering.guidance)).toBeInTheDocument();
    expect(screen.queryByText(/markförutsättningar och nästa steg/)).not.toBeInTheDocument();
  });

  it("renders dedicated Dränering and Grävjobb pages", () => {
    const dranering = content.services.find((service) => service.id === "dranering")!;

    const { rerender } = render(<SiteHomePage currentPath="/dranering/" content={content} />);

    expect(screen.getByRole("heading", { name: "Dränering", level: 1 })).toBeInTheDocument();
    expect(screen.getByText(dranering.detail!)).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Visa källsida" })).not.toBeInTheDocument();

    rerender(<SiteHomePage currentPath="/gravjobb/" content={content} />);

    expect(screen.getByRole("heading", { name: "Grävjobb", level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/poolgrävning där rätt förarbete avgör slutresultatet/)).toBeInTheDocument();
    expect(screen.queryByText(dranering.detail!)).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Visa källsida" })).not.toBeInTheDocument();
  });

  it("links the drainage service page to its drainage calculator while other services stay calculator-free", () => {
    const { rerender } = render(<SiteHomePage currentPath="/dranering/" content={content} />);

    const dranering = content.services.find((service) => service.id === "dranering")!;
    const calculator = dranering.quoteCalculator;
    expect(calculator).toBeDefined();

    const band = screen.getByRole("region", { name: calculator!.heading });
    expect(within(band).getByRole("heading", { name: calculator!.heading })).toBeInTheDocument();
    expect(within(band).getByText(calculator!.description)).toBeInTheDocument();

    const cta = within(band).getByRole("link", { name: calculator!.cta });
    expect(cta).toHaveAttribute("href", "/draneringsberakning/");

    rerender(<SiteHomePage currentPath="/stensattning/" content={content} />);

    expect(screen.queryByRole("link", { name: calculator!.cta })).not.toBeInTheDocument();
    expect(screen.queryByRole("region", { name: calculator!.heading })).not.toBeInTheDocument();
  });

  it("routes the drainage calculator path to the drainage quote page", async () => {
    render(<SiteHomePage currentPath="/draneringsberakning/" content={content} />);

    expect(await screen.findByRole("heading", { name: "Vad kostar din dränering?", level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("spinbutton", { name: /Dräneringens längd/ })).toHaveValue(40);
    expect(screen.getByText(/inte en bindande offert/)).toBeInTheDocument();
  });

  it("renders dedicated about and contact paths", () => {
    const { rerender } = render(<SiteHomePage currentPath="/om-oss/" content={content} />);

    expect(screen.getByRole("heading", { name: "Om oss", level: 1 })).toBeInTheDocument();
    expect(screen.getAllByText(/På Svärd Entreprenad brinner vi/).length).toBeGreaterThan(0);
    expect(screen.getByText(/modern utrustning med gedigen yrkeskunskap/)).toBeInTheDocument();

    rerender(<SiteHomePage currentPath="/kontakt/" content={content} />);

    expect(screen.getByRole("heading", { name: "Kontakt", level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Kontakta oss för offert" })).toBeInTheDocument();
  });

  it("hides partner content when no current collaborator is configured", () => {
    render(<SiteHomePage content={content} />);

    expect(screen.queryByRole("heading", { name: content.sectionHeadings.partners.title })).not.toBeInTheDocument();
    expect(screen.queryByText("UC Brons")).not.toBeInTheDocument();
    expect(screen.queryByText("Benders")).not.toBeInTheDocument();
    expect(screen.queryByText("Ahlsell")).not.toBeInTheDocument();
    expect(screen.queryByText("Wasa Kredit")).not.toBeInTheDocument();
  });

  it("renders the dedicated staffing inquiry page with the nav link from the registry", async () => {
    const { rerender } = render(<SiteHomePage content={content} />);

    const nav = within(screen.getByRole("banner")).getByRole("navigation", { name: desktopNavLabel });
    const inquiryLink = within(nav).getByRole("link", { name: "Inhyrning" });
    expect(inquiryLink).toHaveAttribute("href", "/inhyrning/");
    const omOssLink = within(nav).getByRole("link", { name: "Om oss" });
    expect(inquiryLink.compareDocumentPosition(omOssLink) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    rerender(<SiteHomePage currentPath="/inhyrning/" content={content} />);

    expect(
      await screen.findByRole("heading", { name: "Söker ni en F-skattare?", level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByRole("form", { name: "Förfrågan om inhyrning" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: content.chrome.breadcrumb.ariaLabel })).toBeInTheDocument();
  });

  it("renders a static email handoff form and footer contact email", () => {
    render(<SiteHomePage currentPath="/kontakt/" content={content} />);

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

  it.each([
    { id: "stensattning", path: "/stensattning/" },
    { id: "markarbete", path: "/markarbete/" },
    { id: "gravjobb", path: "/gravjobb/" },
    { id: "dranering", path: "/dranering/" },
    { id: "tradgard", path: "/tradgardsplanering/" },
  ])("carries the stable $id service identity in the $path inquiry action", ({ id, path }) => {
    render(<SiteHomePage currentPath={path} content={content} />);

    expect(screen.getByRole("link", { name: content.chrome.contactBand.ctaLabel })).toHaveAttribute(
      "href",
      `/kontakt/?tjanst=${id}`,
    );
  });

  it("keeps the index and about inquiry actions generic while service pages carry service identity", () => {
    const { rerender } = render(
      <SiteHomePage currentPath="/tjanster/" content={content} />,
    );

    expect(screen.getByRole("link", { name: content.chrome.contactBand.ctaLabel })).toHaveAttribute("href", "/kontakt/");

    rerender(<SiteHomePage currentPath="/om-oss/" content={content} />);

    expect(screen.getByRole("link", { name: content.chrome.contactBand.ctaLabel })).toHaveAttribute("href", "/kontakt/");
  });

  it("follows a service page inquiry action into contact, selects that service and preserves a later manual change", () => {
    const { rerender } = render(
      <SiteHomePage currentPath="/dranering/" content={content} />,
    );

    const inquiryHref = screen.getByRole("link", { name: content.chrome.contactBand.ctaLabel }).getAttribute("href");
    expect(inquiryHref).not.toBeNull();

    const url = new URL(inquiryHref as string, "https://alvalinus.example");
    expect(url.pathname).toBe("/kontakt/");

    rerender(
      <SiteHomePage
        currentPath={url.pathname}
        content={content}
        inquiryServiceId={url.searchParams.get("tjanst") ?? undefined}
      />,
    );

    const form = screen.getByRole("form", { name: "Offertförfrågan via e-post" });
    const serviceSelect = within(form).getByLabelText("Tjänst");

    expect(serviceSelect).toHaveAttribute("name", "service");
    expect(serviceSelect).toHaveValue("Dränering");

    fireEvent.change(serviceSelect, { target: { value: "Annat" } });

    expect(serviceSelect).toHaveValue("Annat");
    expect(serviceSelect).toHaveDisplayValue("Annat");
  });

  it("keeps the typed default service selection on home and direct contact without inquiry context", () => {
    const { rerender } = render(<SiteHomePage content={content} />);

    const homeForm = screen.getByRole("form", { name: "Offertförfrågan via e-post" });
    expect(within(homeForm).getByLabelText("Tjänst")).toHaveValue(content.contact.form.serviceField.options[0]);

    rerender(<SiteHomePage currentPath="/kontakt/" content={content} />);

    const contactForm = screen.getByRole("form", { name: "Offertförfrågan via e-post" });
    expect(within(contactForm).getByLabelText("Tjänst")).toHaveValue(content.contact.form.serviceField.options[0]);
  });

  it.each(["pool", "Stensättning", "dranering/", "<script>alert(1)</script>"])(
    "retains the default service selection for unrecognized inquiry context $context",
    (serviceId) => {
      render(
        <SiteHomePage currentPath="/kontakt/" content={content} inquiryServiceId={serviceId} />,
      );

      const form = screen.getByRole("form", { name: "Offertförfrågan via e-post" });
      const serviceSelect = within(form).getByLabelText("Tjänst");

      expect(serviceSelect).toHaveValue(content.contact.form.serviceField.options[0]);
      expect(
        within(serviceSelect)
          .getAllByRole("option")
          .map((option) => option.textContent),
      ).toEqual([...content.contact.form.serviceField.options]);
      expect(form.querySelectorAll("script")).toHaveLength(0);
    },
  );

  it("retains the default service selection when a recognized service has no matching typed option", () => {
    const optionsWithoutDrainage = content.contact.form.serviceField.options.filter(
      (option) => option !== "Dränering",
    );
    const adjustedContent: SiteContent = {
      ...content,
      contact: {
        ...content.contact,
        form: {
          ...content.contact.form,
          serviceField: { ...content.contact.form.serviceField, options: optionsWithoutDrainage },
        },
      },
    };

    render(
      <SiteHomePage currentPath="/kontakt/" content={adjustedContent} inquiryServiceId="dranering" />,
    );

    const form = screen.getByRole("form", { name: "Offertförfrågan via e-post" });
    const serviceSelect = within(form).getByLabelText("Tjänst");

    expect(serviceSelect).toHaveValue(content.contact.form.serviceField.options[0]);
    expect(
      within(serviceSelect)
        .getAllByRole("option")
        .map((option) => option.textContent),
    ).toEqual(optionsWithoutDrainage);
  });

  it("fails unknown paths gracefully", () => {
    render(<SiteHomePage currentPath="/saknas/" content={content} />);

    expect(screen.getByRole("heading", { name: content.chrome.notFound.title })).toBeInTheDocument();
    expect(screen.getByText(notFoundSummary("/saknas/"))).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Hem" })[0]).toHaveAttribute("href", "/");
  });
});
