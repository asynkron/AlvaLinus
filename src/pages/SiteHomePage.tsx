import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronDown,
  Handshake,
  Mail,
  MapPinned,
  Menu,
  PhoneCall,
  Send,
  ShieldCheck,
  X,
} from "lucide-react";
import { Fragment, type KeyboardEvent, lazy, Suspense, useRef, useState } from "react";

import { StaticState } from "../components/StaticState";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { siteContent } from "../data/siteContent";
import { inquiryContactHref, resolveInquiryServiceOption } from "../lib/inquiry-service";
import type { ServiceArea, ServiceQuoteCalculator, SiteBreadcrumb, SiteChrome, SiteContent, SiteRoute } from "../types/site";

const InquiryPage = lazy(() => import("./InquiryPage").then((module) => ({ default: module.InquiryPage })));
const QuotePage = lazy(() => import("./QuotePage").then((module) => ({ default: module.QuotePage })));
const DrainageQuotePage = lazy(() => import("./DrainageQuotePage").then((module) => ({ default: module.DrainageQuotePage })));

const HERO_PHOTO_SRC = "/page-visuals/hero-photo.webp";

// Canvas-synced service imagery. Trädgårdsplanering uses an AI-generated
// illustration. Failing photos fall back to the route SVG;
// a failing SVG removes the image while retaining the card content.
const SERVICE_PHOTOS: Record<string, string> = {
  stensattning: "/page-visuals/stensattning-photo.webp",
  markarbete: "/page-visuals/markarbete-photo.webp",
  dranering: "/page-visuals/dranering-photo.webp",
  gravjobb: "/page-visuals/gravjobb-photo.webp",
  tradgard: "/page-visuals/tradgard-generated.webp",
};

function responsiveImageSrcSet(src: string | undefined): string | undefined {
  if (!src?.endsWith(".webp")) return undefined;
  const base = src.slice(0, -5);
  if (src.endsWith("-generated.webp")) {
    return `${base}-640.webp 640w, ${base}-960.webp 960w, ${src} 1568w`;
  }
  if (src === HERO_PHOTO_SRC) {
    return `${base}-640.webp 640w, ${base}-960.webp 960w, ${src} 1600w`;
  }
  if (Object.values(SERVICE_PHOTOS).includes(src)) {
    return `${base}-400.webp 400w, ${base}-640.webp 640w, ${src} 900w`;
  }
  return undefined;
}


type SiteHomePageProps = {
  readonly currentPath?: string;
  readonly inquiryServiceId?: string;
  readonly content?: SiteContent;
};

export function SiteHomePage({ currentPath = "/", inquiryServiceId, content = siteContent }: SiteHomePageProps) {
  // The skip link, sticky header and root footer are siblings around the
  // content main element: descendants of main would lose their banner and
  // contentinfo landmark roles in browsers (ARIA in HTML main-descendant
  // suppression), leaving screen readers without page landmarks.
  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {content.chrome.skipLinkLabel}
      </a>
      <Header currentPath={currentPath} chrome={content.chrome} />
      <ContentSurface currentPath={currentPath} inquiryServiceId={inquiryServiceId} content={content} />
    </div>
  );
}

// Header (desktop and mobile) and footer navigation derive from the typed
// route registry in src/data/siteContent.ts: each destination's Swedish label,
// href and order is declared once in that registry. The header and mobile menu
// render the page routes except the calculator pages, which the registry's
// chrome.calcMenu groups under a Kalkyler disclosure; the footer keeps the
// full page route list.
const PAGE_NAV: readonly SiteRoute[] = siteContent.routes.filter((route) => route.kind !== "service");
const HEADER_PAGE_NAV: readonly SiteRoute[] = PAGE_NAV.filter((route) => route.kind !== "quote");
const SERVICE_NAV: readonly SiteRoute[] = siteContent.routes.filter((route) => route.kind === "service");
const CALC_MENU = siteContent.chrome.calcMenu;

const SERVICE_PATHS = new Set(
  siteContent.routes
    .filter((route) => route.kind === "services" || route.kind === "service")
    .map((route) => normalizePath(route.href)),
);

const CALC_MENU_PATHS = new Set(CALC_MENU.links.map((link) => normalizePath(link.href)));

function Header({ currentPath = "/", chrome }: { readonly currentPath?: string; readonly chrome: SiteChrome }) {
  const { brand } = chrome;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const active = normalizePath(currentPath);
  const servicesActive = SERVICE_PATHS.has(active);

  function handleMenuKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (menuOpen && event.key === "Escape") {
      event.preventDefault();
      setMenuOpen(false);
      menuToggleRef.current?.focus();
    }
  }

  return (
    <header className="sticky top-0 z-30 bg-foreground text-background shadow-sm">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
        <a href="/" className="flex min-w-0 items-center gap-3" aria-label={`${brand.name} startsida`}>
          <img
            src={brand.logoSrc}
            alt={`${brand.name} logotyp`}
            className="h-9 w-auto max-w-[11rem] object-contain brightness-0 invert sm:h-10 sm:max-w-[14rem]"
          />
          <span className="sr-only">{brand.name}</span>
        </a>
        <nav aria-label={chrome.navAriaLabel} className="hidden items-center gap-6 text-sm font-medium md:flex">
          {HEADER_PAGE_NAV.map((route) => {
            const isActive = normalizePath(route.href) === active;

            if (route.kind === "services") {
              return (
                <Fragment key={route.href}>
                  <div className="group relative">
                    <a
                      className={`inline-flex items-center gap-1 ${
                        servicesActive ? "text-primary" : "text-background/75 transition-colors hover:text-primary"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                      aria-haspopup="true"
                      href={route.href}
                    >
                      {route.label}
                      <ChevronDown
                        className="h-4 w-4 transition-transform group-hover:rotate-180 group-focus-within:rotate-180"
                        aria-hidden="true"
                      />
                    </a>
                    <div className="invisible absolute left-1/2 top-full z-40 w-56 -translate-x-1/2 pt-3 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                      <div className="overflow-hidden rounded-lg border bg-card py-1 text-foreground shadow-soft">
                        {SERVICE_NAV.map((service) => {
                          const serviceActive = normalizePath(service.href) === active;

                          return (
                            <a
                              key={service.href}
                              className={`block px-4 py-2 text-sm transition-colors hover:bg-secondary ${
                                serviceActive ? "font-semibold text-primary" : "text-foreground"
                              }`}
                              aria-current={serviceActive ? "page" : undefined}
                              href={service.href}
                            >
                              {service.label}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <CalcMenu variant="desktop" activePath={active} />
                </Fragment>
              );
            }

            return (
              <a
                key={route.href}
                className={isActive ? "text-primary" : "text-background/75 transition-colors hover:text-primary"}
                aria-current={isActive ? "page" : undefined}
                href={route.href}
              >
                {route.label}
              </a>
            );
          })}
        </nav>
        <button
          ref={menuToggleRef}
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-background transition-colors hover:bg-background/10 md:hidden"
          aria-label={menuOpen ? chrome.menuCloseLabel : chrome.menuOpenLabel}
          aria-expanded={menuOpen}
          aria-controls="mobil-meny"
          onClick={() => setMenuOpen((open) => !open)}
          onKeyDown={handleMenuKeyDown}
        >
          {menuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
        </button>
      </div>
      {menuOpen ? (
        <nav
          id="mobil-meny"
          aria-label={chrome.mobileNavAriaLabel}
          className="border-t border-background/10 px-5 pb-4 pt-2 sm:px-8 md:hidden"
          onKeyDown={handleMenuKeyDown}
        >
          {HEADER_PAGE_NAV.map((route) => {
            const isActive = normalizePath(route.href) === active;

            return (
              <Fragment key={route.href}>
                <a
                  className={`block rounded-md px-3 py-3 text-base font-medium transition-colors ${
                    isActive ? "bg-background/10 text-primary" : "text-background/80 hover:bg-background/10"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                  href={route.href}
                >
                  {route.label}
                </a>
                {route.kind === "services" ? (
                  <>
                    <div className="ml-3 border-l border-background/15 pl-3">
                      {SERVICE_NAV.map((service) => {
                        const serviceActive = normalizePath(service.href) === active;

                        return (
                          <a
                            key={service.href}
                            className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                              serviceActive ? "bg-background/10 text-primary" : "text-background/70 hover:bg-background/10"
                            }`}
                            aria-current={serviceActive ? "page" : undefined}
                            href={service.href}
                          >
                            {service.label}
                          </a>
                        );
                      })}
                    </div>
                    <CalcMenu variant="mobile" activePath={active} />
                  </>
                ) : null}
              </Fragment>
            );
          })}
        </nav>
      ) : null}
    </header>
  );
}

function CalcMenu({ variant, activePath }: { readonly variant: "desktop" | "mobile"; readonly activePath: string }) {
  const groupActive = CALC_MENU_PATHS.has(activePath);
  const desktop = variant === "desktop";

  return (
    <details className="group relative">
      <summary
        className={`cursor-pointer list-none [&::-webkit-details-marker]:hidden ${
          desktop
            ? `inline-flex items-center gap-1 ${
                groupActive ? "text-primary" : "text-background/75 transition-colors hover:text-primary"
              }`
            : `flex w-full items-center gap-1 rounded-md px-3 py-3 text-base font-medium ${
                groupActive ? "bg-background/10 text-primary" : "text-background/80 hover:bg-background/10"
              }`
        }`}
      >
        {CALC_MENU.label}
        <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div
        className={
          desktop ? "absolute left-1/2 top-full z-40 w-56 -translate-x-1/2 pt-3" : "ml-3 border-l border-background/15 pl-3"
        }
      >
        <div className={desktop ? "overflow-hidden rounded-lg border bg-card py-1 text-foreground shadow-soft" : undefined}>
          {CALC_MENU.links.map((link) => {
            const linkActive = normalizePath(link.href) === activePath;

            return (
              <a
                key={link.href}
                aria-current={linkActive ? "page" : undefined}
                href={link.href}
                className={
                  desktop
                    ? `block px-4 py-2 text-sm transition-colors hover:bg-secondary ${
                        linkActive ? "font-semibold text-primary" : "text-foreground"
                      }`
                    : `block rounded-md px-3 py-2 text-sm transition-colors ${
                        linkActive ? "bg-background/10 text-primary" : "text-background/70 hover:bg-background/10"
                      }`
                }
              >
                {link.label}
              </a>
            );
          })}
        </div>
      </div>
    </details>
  );
}

function ContentSurface({
  currentPath,
  inquiryServiceId,
  content,
}: {
  readonly currentPath: string;
  readonly inquiryServiceId?: string;
  readonly content: SiteContent;
}) {
  const route = getRouteForPath(content, currentPath);

  if (routeDependsOnServices(route) && content.services.length === 0) {
    return (
      <main id="content" className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <StaticState title={content.chrome.emptyStateTitle} message={content.chrome.emptyStateMessage} />
      </main>
    );
  }

  return (
    <>
      <main id="content" tabIndex={-1} className="scroll-mt-20 focus:outline-none">
        {route ? (
          <RoutedPage content={content} inquiryServiceId={inquiryServiceId} route={route} />
        ) : (
          <NotFound content={content} currentPath={currentPath} />
        )}
      </main>
      <Footer content={content} />
    </>
  );
}

function getRouteForPath(content: SiteContent, currentPath: string): SiteRoute | undefined {
  const normalizedPath = normalizePath(currentPath);

  return content.routes.find((route) => normalizePath(route.href) === normalizedPath);
}

function routeDependsOnServices(route: SiteRoute | undefined): boolean {
  return route?.kind === "home" || route?.kind === "services";
}

function normalizePath(path: string) {
  const withoutQuery = path.split(/[?#]/)[0] || "/";

  if (withoutQuery === "/") {
    return "/";
  }

  return withoutQuery.endsWith("/") ? withoutQuery : `${withoutQuery}/`;
}

function renderNotFoundSummary(template: string, currentPath: string) {
  return template.replace("{path}", () => currentPath);
}

function RoutedPage({
  content,
  inquiryServiceId,
  route,
}: {
  readonly content: SiteContent;
  readonly inquiryServiceId?: string;
  readonly route: SiteRoute;
}) {

  if (route.kind === "quote") {
    const QuoteView = route.id === "drainage-quote" ? DrainageQuotePage : QuotePage;

    return (
      <Suspense fallback={<p role="status" className="px-5 py-16">{content.chrome.quoteFallback}</p>}>
        <QuoteView />
      </Suspense>
    );
  }
  if (route.kind === "inquiry") {
    return (
      <Suspense fallback={<p role="status" className="px-5 py-16">{content.chrome.inquiryFallback}</p>}>
        <InquiryPage />
      </Suspense>
    );
  }
  if (route.kind === "services") {
    return <ServicesIndexPage content={content} route={route} />;
  }

  if (route.kind === "about") {
    return <AboutPage content={content} route={route} />;
  }

  if (route.kind === "service") {
    const service = content.services.find((item) => item.id === route.sourceId);

    return service ? (
      <ServicePage content={content} route={route} service={service} />
    ) : (
      <NotFound content={content} currentPath={route.href} />
    );
  }

  if (route.kind === "contact") {
    return <ContactPage content={content} inquiryServiceId={inquiryServiceId} route={route} />;
  }

  return (
    <>
      <Hero content={content} imageSrc={route.heroPhotoAssetPath} />
      <Inventory content={content} />
      <Services content={content} />
      <Process content={content} />
      <Trust content={content} />
      <Partners content={content} />
      <Contact content={content} />
    </>
  );
}

function Hero({ content, imageSrc }: { readonly content: SiteContent; readonly imageSrc: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-foreground text-background">
      <img
        src={imageSrc}
        srcSet={responsiveImageSrcSet(imageSrc)}
        sizes="100vw"
        width={1600}
        height={905}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/55"
      />
      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{content.hero.eyebrow}</p>
          <h1 className="mt-4 font-display text-5xl font-bold uppercase leading-[0.95] tracking-wide text-background sm:text-6xl lg:text-7xl">
            {content.hero.title}
          </h1>
          <p className="mt-6 whitespace-pre-line text-lg leading-8 text-background/85 sm:text-xl">
            {content.hero.intro}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href={content.hero.primaryAction.href}>
                {content.hero.primaryAction.label}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-background/40 bg-transparent text-background hover:bg-background/10 hover:text-background"
            >
              <a href={content.hero.secondaryAction.href}>{content.hero.secondaryAction.label}</a>
            </Button>
          </div>
          <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
            {content.hero.stats.map((stat) => (
              <div key={stat.label} className="max-w-[14rem]">
                <dt className="text-base font-semibold text-primary">{stat.value}</dt>
                <dd className="mt-0.5 text-sm leading-5 text-background/70">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function Inventory({ content }: { readonly content: SiteContent }) {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
      <div className="grid gap-6 rounded-lg border bg-card p-5 md:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-semibold text-primary">{content.inventory.eyebrow}</p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-wide">{content.inventory.heading}</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{content.inventory.routeDecision}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{content.inventory.helper}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {content.inventory.primaryRoutes.map((route) => (
              <a
                key={route.label}
                href={route.href}
                className="rounded-full border bg-background px-3 py-1 text-sm text-foreground transition-colors hover:border-primary"
              >
                {route.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesIndexPage({ content, route }: { readonly content: SiteContent; readonly route: SiteRoute }) {
  return (
    <>
      <PageHero title={route.label} summary={route.summary} imageSrc={route.heroPhotoAssetPath} breadcrumb={content.chrome.breadcrumb} />
      <Services content={content} />
      <Trust content={content} />
      <Partners content={content} />
      <ContactLinkBand content={content} />
    </>
  );
}

function AboutPage({ content, route }: { readonly content: SiteContent; readonly route: SiteRoute }) {
  return (
    <>
      <PageHero title={route.label} summary={route.summary} imageSrc={route.heroPhotoAssetPath} breadcrumb={content.chrome.breadcrumb} />
      <About content={content} />
      <ContactLinkBand content={content} />
    </>
  );
}

function ServicePage({
  content,
  route,
  service,
}: {
  readonly content: SiteContent;
  readonly route: SiteRoute;
  readonly service: ServiceArea;
}) {
  return (
    <>
      <PageHero
        title={service.title}
        summary={route.summary}
        eyebrow={content.chrome.service.heroEyebrow}
        imageSrc={route.heroPhotoAssetPath}
        breadcrumb={content.chrome.breadcrumb}
      />
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_0.72fr] lg:px-10">
        <div>
          <p className="text-lg leading-8 text-foreground">{service.summary}</p>
          {service.detail ? (
            <p className="mt-4 leading-7 text-muted-foreground">{service.detail}</p>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-2">
            {service.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <aside className="rounded-lg border bg-card p-5 shadow-soft">
          <h2 className="text-xl font-semibold">{content.chrome.service.guidanceHeading}</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{service.guidance}</p>
        </aside>
      </section>
      <Process content={content} />
      {service.quoteCalculator ? <QuoteCalculatorBand calculator={service.quoteCalculator} /> : null}
      <ContactLinkBand content={content} serviceId={service.id} />
    </>
  );
}

function QuoteCalculatorBand({ calculator }: { readonly calculator: ServiceQuoteCalculator }) {
  return (
    <section aria-label={calculator.heading} className="border-y bg-secondary">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-12 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            {calculator.eyebrow}
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-wide text-foreground">{calculator.heading}</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{calculator.description}</p>
        </div>
        <Button asChild size="lg" className="shrink-0">
          <a href={calculator.href}>
            {calculator.cta}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </a>
        </Button>
      </div>
    </section>
  );
}

function ContactPage({
  content,
  inquiryServiceId,
  route,
}: {
  readonly content: SiteContent;
  readonly inquiryServiceId?: string;
  readonly route: SiteRoute;
}) {
  return (
    <>
      <PageHero title={route.label} summary={route.summary} imageSrc={route.heroPhotoAssetPath} breadcrumb={content.chrome.breadcrumb} />
      <Contact content={content} serviceOption={resolveInquiryServiceOption(content, inquiryServiceId)} />
    </>
  );
}

function NotFound({ content, currentPath }: { readonly content: SiteContent; readonly currentPath: string }) {
  const chrome = content.chrome;

  return (
    <>
      <PageHero
        title={chrome.notFound.title}
        eyebrow={chrome.notFound.eyebrow}
        summary={renderNotFoundSummary(chrome.notFound.summaryTemplate, currentPath)}
        breadcrumb={chrome.breadcrumb}
      />
      <section className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{chrome.notFound.shortcutsLabel}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {content.routes.map((route) => (
            <a
              key={route.id}
              href={route.href}
              className="rounded-full border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {route.label}
            </a>
          ))}
        </div>
      </section>
    </>
  );
}

function PageHero({
  title,
  summary,
  eyebrow,
  imageSrc,
  breadcrumb,
}: {
  readonly title: string;
  readonly summary: string;
  readonly eyebrow?: string;
  readonly imageSrc?: string;
  readonly breadcrumb: SiteBreadcrumb;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-background/10 bg-foreground text-background">
      {imageSrc ? (
        <img
          src={imageSrc}
          srcSet={responsiveImageSrcSet(imageSrc)}
          sizes="100vw"
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ) : null}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-foreground via-foreground/92 to-foreground/60"
      />
      <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <nav aria-label={breadcrumb.ariaLabel} className="text-sm font-medium text-background/70">
          <a href="/" className="transition-colors hover:text-primary">
            {breadcrumb.homeLabel}
          </a>
          <span className="mx-2 text-background/40" aria-hidden="true">
            /
          </span>
          <span className="text-primary">{title}</span>
        </nav>
        {eyebrow ? (
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
        ) : null}
        <h1 className="mt-3 font-display text-3xl font-bold uppercase leading-tight tracking-wide text-background break-words sm:text-5xl lg:text-6xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-background/80">{summary}</p>
      </div>
    </section>
  );
}

function ContactLinkBand({
  content,
  serviceId,
}: {
  readonly content: SiteContent;
  readonly serviceId?: string;
}) {
  return (
    <section className="border-y bg-secondary">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-12 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            {content.chrome.contactBand.eyebrow}
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-wide text-foreground">{content.contact.title}</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{content.contact.summary}</p>
        </div>
        <Button asChild size="lg" className="shrink-0">
          <a href={serviceId ? inquiryContactHref(serviceId) : "/kontakt/"}>
            {content.chrome.contactBand.ctaLabel}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </a>
        </Button>
      </div>
    </section>
  );
}

type ServiceCardImageStage = "photo" | "fallback" | "hidden";

function ServiceCardImage({
  photoSrc,
  objectPosition,
  fallbackSrc,
  alt,
}: {
  readonly photoSrc: string;
  readonly objectPosition?: string;
  readonly fallbackSrc?: string;
  readonly alt: string;
}) {
  const [stage, setStage] = useState<ServiceCardImageStage>("photo");

  if (stage === "hidden") {
    return null;
  }

  const src = stage === "photo" || !fallbackSrc ? photoSrc : fallbackSrc;

  return (
    <img
      src={src}
      srcSet={stage === "photo" ? responsiveImageSrcSet(photoSrc) : undefined}
      sizes="(min-width: 1280px) 384px, (min-width: 1024px) calc((100vw - 128px) / 3), (min-width: 768px) calc((100vw - 88px) / 2), (min-width: 640px) calc(100vw - 64px), calc(100vw - 40px)"
      alt={alt}
      className="aspect-[16/10] w-full border-b object-cover"
      style={stage === "photo" && objectPosition ? { objectPosition } : undefined}
      loading="lazy"
      decoding="async"
      width={800}
      height={500}
      onError={() => {
        setStage((current) =>
          current === "photo" && fallbackSrc && fallbackSrc !== photoSrc ? "fallback" : "hidden",
        );
      }}
    />
  );
}

function Services({ content }: { readonly content: SiteContent }) {
  const section = content.sectionHeadings.services;

  return (
    <section id="tjanster" className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
      <SectionHeading eyebrow={section.eyebrow} title={section.title} summary={section.summary} />
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {content.services.map((service) => {
          const visual = content.routes.find(
            (route) => route.kind === "service" && route.sourceId === service.id,
          )?.visual;
          const photo = service.photoSrc ?? visual?.assetPath;

          return (
            <Card key={service.id} id={service.id} className="flex flex-col overflow-hidden">
              {photo ? (
                <ServiceCardImage
                  photoSrc={photo}
                  objectPosition={service.photoObjectPosition}
                  fallbackSrc={visual?.assetPath}
                  alt={visual?.alt ?? service.title}
                />
              ) : null}
              <CardHeader>
                <CardTitle className="font-display text-xl font-bold tracking-wide">{service.title}</CardTitle>
                <CardDescription>{service.summary}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto grid gap-4">
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href={service.href}
                  aria-label={`${section.readMoreAriaPrefix} ${service.title}`}
                  className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80"
                >
                  {section.readMoreLabel}
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

function About({ content }: { readonly content: SiteContent }) {
  const [lead, ...rest] = content.about.body;

  return (
    <section id="om-oss" className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-8 lg:px-10">
      {lead ? <p className="text-xl leading-8 text-foreground">{lead}</p> : null}
      <div className="mt-6 grid gap-5 text-base leading-8 text-muted-foreground">
        {rest.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

function Process({ content }: { readonly content: SiteContent }) {
  const heading = content.sectionHeadings.process;

  return (
    <section id="process" className="bg-foreground text-background">
      <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{heading.eyebrow}</p>
          <h2 className="mt-2 font-display text-4xl font-bold tracking-wide text-background">{heading.title}</h2>
          <p className="mt-3 leading-7 text-background/70">{heading.summary}</p>
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-4">
          {content.process.map((step, index) => (
            <div key={step.title}>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground">
                {index + 1}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-background">
                {index + 1}. {step.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-background/65">{step.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Trust({ content }: { readonly content: SiteContent }) {
  const icons = [ShieldCheck, BadgeCheck, CheckCircle2];
  const heading = content.sectionHeadings.trust;

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{heading.eyebrow}</p>
        <h2 className="mt-2 font-display text-4xl font-bold tracking-wide text-foreground">{heading.title}</h2>
        <p className="mt-3 leading-7 text-muted-foreground">{heading.summary}</p>
      </div>
      <div className="mt-12 grid gap-10 md:grid-cols-3">
        {content.trust.map((item, index) => {
          const Icon = icons[index] ?? CheckCircle2;

          return (
            <div key={item.title} className="flex flex-col items-center text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-7 w-7" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">{item.summary}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Partners({ content }: { readonly content: SiteContent }) {
  if (content.partners.length === 0) {
    return null;
  }

  const heading = content.sectionHeadings.partners;

  return (
    <section id="samarbetspartner" className="border-y bg-muted/70">
      <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="max-w-2xl">
          <SectionHeading eyebrow={heading.eyebrow} title={heading.title} summary={heading.summary} />
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {content.partners.map((partner) => (
            <div key={partner.name} className="rounded-lg border bg-card p-4">
              <Handshake className="h-5 w-5 text-primary" aria-hidden="true" />
              <p className="mt-3 font-medium">{partner.name}</p>
              <p className="text-sm text-muted-foreground">{partner.kind}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer({ content }: { readonly content: SiteContent }) {
  const email = content.contact.form.recipientEmail;
  const chrome = content.chrome;

  return (
    <footer className="border-t border-background/10 bg-foreground text-background">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-12 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-10">
        <div className="max-w-sm">
          <p className="font-display text-2xl font-bold uppercase tracking-wide text-background">{chrome.brand.name}</p>
          <p className="mt-3 text-sm leading-6 text-background/65">{chrome.footer.tagline}</p>
        </div>
        <nav aria-label={chrome.footer.pageNavAriaLabel} className="text-sm">
          <p className="font-semibold text-background">{chrome.footer.pageHeading}</p>
          <ul className="mt-3 grid gap-2">
            {PAGE_NAV.map((route) => (
              <li key={route.href}>
                <a href={route.href} className="text-background/70 transition-colors hover:text-primary">
                  {route.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label={chrome.footer.servicesNavAriaLabel} className="text-sm">
          <p className="font-semibold text-background">{chrome.footer.servicesHeading}</p>
          <ul className="mt-3 grid gap-2">
            {SERVICE_NAV.map((route) => (
              <li key={route.href}>
                <a href={route.href} className="text-background/70 transition-colors hover:text-primary">
                  {route.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="text-sm">
          <p className="font-semibold text-background">{chrome.footer.contactHeading}</p>
          <a
            href={`mailto:${email}`}
            className="mt-3 inline-flex items-center gap-2 text-background/70 transition-colors hover:text-primary"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            {email}
          </a>
        </div>
      </div>
      <div className="border-t border-background/10">
        <div className="mx-auto w-full max-w-7xl px-5 py-5 text-xs text-background/50 sm:px-8 lg:px-10">
          © {chrome.brand.name}
        </div>
      </div>
    </footer>
  );
}

const CONTACT_FIELD_BASE_CLASS =
  "rounded-md border bg-card px-3 py-2 text-base font-normal text-foreground outline-none transition-colors focus:border-primary focus-visible:ring-2 focus-visible:ring-ring sm:text-sm";

function Contact({
  content,
  serviceOption,
}: {
  readonly content: SiteContent;
  readonly serviceOption?: string;
}) {
  const form = content.contact.form;
  const emailAction = `mailto:${form.recipientEmail}?subject=${encodeURIComponent(form.subject)}`;

  return (
    <section id="kontakt" className="bg-foreground text-background">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
        <div className="flex flex-col">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Kontakt</p>
          <h2 className="mt-2 font-display text-4xl font-bold tracking-wide text-background">{content.contact.title}</h2>
          <p className="mt-4 leading-7 text-background/75">{content.contact.summary}</p>
          <div className="mt-6 inline-flex max-w-max items-center rounded-md bg-primary/15 px-4 py-3 text-sm font-medium text-primary">
            <MapPinned className="mr-2 h-4 w-4" aria-hidden="true" />
            {content.contact.offertLabel}
          </div>
          <div className="mt-6 grid gap-3">
            {content.contact.items.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-lg border border-background/15 bg-background/5 p-4 transition-colors hover:border-primary"
              >
                <span className="flex items-center gap-2 text-sm text-background/70">
                  <PhoneCall className="h-4 w-4 text-primary" aria-hidden="true" />
                  {item.label}
                </span>
                <span className="mt-2 block font-medium text-background">{item.value}</span>
              </a>
            ))}
          </div>
        </div>
        <form
          aria-label={form.ariaLabel}
          aria-describedby="kontakt-handoff-note"
          action={emailAction}
          method="post"
          encType="text/plain"
          className="grid gap-4 rounded-lg border bg-card p-6 text-foreground"
        >
          <input type="hidden" name="subject" value={form.subject} />
          <label className="grid gap-2 text-sm font-medium text-foreground">
            {form.nameField.label}
            <input
              name={form.nameField.name}
              placeholder={form.nameField.placeholder}
              required
              className={`min-h-11 ${CONTACT_FIELD_BASE_CLASS} placeholder:text-muted-foreground`}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-foreground">
              {form.customerTypeField.label}
              <select
                name={form.customerTypeField.name}
                required
                className={`min-h-11 ${CONTACT_FIELD_BASE_CLASS}`}
              >
                {form.customerTypeField.options.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-foreground">
              {form.serviceField.label}
              <select
                name={form.serviceField.name}
                required
                defaultValue={serviceOption}
                className={`min-h-11 ${CONTACT_FIELD_BASE_CLASS}`}
              >
                {form.serviceField.options.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="grid gap-2 text-sm font-medium text-foreground">
            {form.messageField.label}
            <textarea
              name={form.messageField.name}
              placeholder={form.messageField.placeholder}
              required
              rows={form.messageField.rows}
              className={`min-h-32 resize-y ${CONTACT_FIELD_BASE_CLASS} placeholder:text-muted-foreground`}
            />
          </label>
          <p id="kontakt-handoff-note" className="text-sm leading-6 text-muted-foreground">
            {form.handoffNote}{" "}
            <a
              href={emailAction}
              className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary"
            >
              {form.recipientEmail}
            </a>
            .
          </p>
          <Button type="submit" className="justify-self-start">
            <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
            {form.submitLabel}
            <Send className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
        </form>
      </div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  summary,
}: {
  readonly eyebrow: string;
  readonly title: string;
  readonly summary: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
      <h2 className="mt-2 font-display text-4xl font-bold tracking-wide text-foreground">{title}</h2>
      <p className="mt-3 leading-7 text-muted-foreground">{summary}</p>
    </div>
  );
}
