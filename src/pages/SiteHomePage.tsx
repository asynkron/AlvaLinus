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
import { useEffect, useState } from "react";

import { StaticState } from "../components/StaticState";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { loadSiteContent } from "../lib/site-content";
import type { ServiceArea, SiteContent, SiteRoute } from "../types/site";

const BRAND_NAME = "Svärd Entreprenad";
const BRAND_LOGO_SRC = "/svard-entreprenad-logo.png";
const HERO_PHOTO_SRC = "/page-visuals/hero-photo.webp";

// Real photographs used in the presentation layer. Keys are service ids.
// Files that are not present yet fall back to the SVG placeholder via onError.
const SERVICE_PHOTOS: Record<string, string> = {
  stensattning: "/page-visuals/stensattning-photo.webp",
  markarbete: "/page-visuals/markarbete-photo.webp",
  dranering: "/page-visuals/dranering-photo.webp",
  gravjobb: "/page-visuals/gravjobb-photo.webp",
  tradgard: "/page-visuals/tradgard-photo.webp",
};

// Background photo for each subpage hero, keyed by route id. Missing files
// degrade gracefully to the plain navy hero (the <img> hides on error).
const PAGE_HERO_PHOTOS: Record<string, string> = {
  services: "/page-visuals/services-hero.webp",
  about: "/page-visuals/about-hero.webp",
  contact: "/page-visuals/contact-hero.webp",
  stensattning: "/page-visuals/stensattning-photo.webp",
  markarbete: "/page-visuals/markarbete-photo.webp",
  gravjobb: "/page-visuals/gravjobb-photo.webp",
  dranering: "/page-visuals/dranering-photo.webp",
  tradgard: "/page-visuals/tradgard-photo.webp",
};

type LoadState =
  | { readonly status: "loading" }
  | { readonly status: "error"; readonly message: string }
  | { readonly status: "ready"; readonly content: SiteContent };

type SiteHomePageProps = {
  readonly currentPath?: string;
  readonly initialState?: LoadState;
};

export function SiteHomePage({ currentPath = "/", initialState }: SiteHomePageProps) {
  const [state, setState] = useState<LoadState>(initialState ?? { status: "loading" });

  useEffect(() => {
    if (initialState) {
      return;
    }

    let cancelled = false;

    loadSiteContent()
      .then((content) => {
        if (!cancelled) {
          setState({ status: "ready", content });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          const message = error instanceof Error ? error.message : "Innehållskällan kunde inte läsas.";
          setState({ status: "error", message });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [initialState]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header currentPath={currentPath} />
      <ContentSurface currentPath={currentPath} state={state} />
    </main>
  );
}

const SERVICE_NAV = [
  { label: "Stensättning", href: "/stensattning/" },
  { label: "Markarbete", href: "/markarbete/" },
  { label: "Grävjobb", href: "/gravjobb/" },
  { label: "Dränering", href: "/dranering/" },
  { label: "Trädgårdsplanering", href: "/tradgardsplanering/" },
];

const SERVICE_PATHS = new Set([...SERVICE_NAV.map((link) => normalizePath(link.href)), normalizePath("/tjanster/")]);

function Header({ currentPath = "/" }: { readonly currentPath?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const active = normalizePath(currentPath);
  const servicesActive = SERVICE_PATHS.has(active);

  return (
    <header className="sticky top-0 z-30 bg-foreground text-background shadow-sm">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
        <a href="/" className="flex min-w-0 items-center gap-3" aria-label={`${BRAND_NAME} startsida`}>
          <img
            src={BRAND_LOGO_SRC}
            alt={`${BRAND_NAME} logotyp`}
            className="h-9 w-auto max-w-[11rem] object-contain brightness-0 invert sm:h-10 sm:max-w-[14rem]"
          />
          <span className="sr-only">{BRAND_NAME}</span>
        </a>
        <nav aria-label="Huvudnavigation" className="hidden items-center gap-6 text-sm font-medium md:flex">
          <a
            className={active === "/" ? "text-primary" : "text-background/75 transition-colors hover:text-primary"}
            aria-current={active === "/" ? "page" : undefined}
            href="/"
          >
            Hem
          </a>
          <div className="group relative">
            <a
              className={`inline-flex items-center gap-1 ${
                servicesActive ? "text-primary" : "text-background/75 transition-colors hover:text-primary"
              }`}
              aria-current={active === "/tjanster/" ? "page" : undefined}
              aria-haspopup="true"
              href="/tjanster/"
            >
              Tjänster
              <ChevronDown
                className="h-4 w-4 transition-transform group-hover:rotate-180 group-focus-within:rotate-180"
                aria-hidden="true"
              />
            </a>
            <div className="invisible absolute left-1/2 top-full z-40 w-56 -translate-x-1/2 pt-3 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <div className="overflow-hidden rounded-lg border bg-card py-1 text-foreground shadow-soft">
                {SERVICE_NAV.map((link) => {
                  const isActive = normalizePath(link.href) === active;

                  return (
                    <a
                      key={link.href}
                      className={`block px-4 py-2 text-sm transition-colors hover:bg-secondary ${
                        isActive ? "font-semibold text-primary" : "text-foreground"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                      href={link.href}
                    >
                      {link.label}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
          <a
            className={
              active === "/om-oss/" ? "text-primary" : "text-background/75 transition-colors hover:text-primary"
            }
            aria-current={active === "/om-oss/" ? "page" : undefined}
            href="/om-oss/"
          >
            Om oss
          </a>
          <a
            className={
              active === "/kontakt/" ? "text-primary" : "text-background/75 transition-colors hover:text-primary"
            }
            aria-current={active === "/kontakt/" ? "page" : undefined}
            href="/kontakt/"
          >
            Kontakt
          </a>
        </nav>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-background transition-colors hover:bg-background/10 md:hidden"
          aria-label={menuOpen ? "Stäng meny" : "Öppna meny"}
          aria-expanded={menuOpen}
          aria-controls="mobil-meny"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
        </button>
      </div>
      {menuOpen ? (
        <nav
          id="mobil-meny"
          aria-label="Mobilnavigation"
          className="border-t border-background/10 px-5 pb-4 pt-2 sm:px-8 md:hidden"
        >
          <a
            className={`block rounded-md px-3 py-3 text-base font-medium transition-colors ${
              active === "/" ? "bg-background/10 text-primary" : "text-background/80 hover:bg-background/10"
            }`}
            aria-current={active === "/" ? "page" : undefined}
            href="/"
          >
            Hem
          </a>
          <a
            className={`block rounded-md px-3 py-3 text-base font-medium transition-colors ${
              active === "/tjanster/" ? "bg-background/10 text-primary" : "text-background/80 hover:bg-background/10"
            }`}
            aria-current={active === "/tjanster/" ? "page" : undefined}
            href="/tjanster/"
          >
            Tjänster
          </a>
          <div className="ml-3 border-l border-background/15 pl-3">
            {SERVICE_NAV.map((link) => {
              const isActive = normalizePath(link.href) === active;

              return (
                <a
                  key={link.href}
                  className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive ? "bg-background/10 text-primary" : "text-background/70 hover:bg-background/10"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                  href={link.href}
                >
                  {link.label}
                </a>
              );
            })}
          </div>
          <a
            className={`block rounded-md px-3 py-3 text-base font-medium transition-colors ${
              active === "/om-oss/" ? "bg-background/10 text-primary" : "text-background/80 hover:bg-background/10"
            }`}
            aria-current={active === "/om-oss/" ? "page" : undefined}
            href="/om-oss/"
          >
            Om oss
          </a>
          <a
            className={`block rounded-md px-3 py-3 text-base font-medium transition-colors ${
              active === "/kontakt/" ? "bg-background/10 text-primary" : "text-background/80 hover:bg-background/10"
            }`}
            aria-current={active === "/kontakt/" ? "page" : undefined}
            href="/kontakt/"
          >
            Kontakt
          </a>
        </nav>
      ) : null}
    </header>
  );
}

function ContentSurface({ currentPath, state }: { readonly currentPath: string; readonly state: LoadState }) {
  if (state.status === "loading") {
    return (
      <section id="content" className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <StaticState state="loading" />
      </section>
    );
  }

  if (state.status === "error") {
    return (
      <section id="content" className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <StaticState state="error" title="Innehåll kunde inte laddas" message={state.message} />
      </section>
    );
  }

  const { content } = state;
  const route = getRouteForPath(content, currentPath);

  if (content.services.length === 0) {
    return (
      <section id="content" className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <StaticState state="empty" title="Inget innehåll ännu" message="Lägg till statiska dataposter i src/data." />
      </section>
    );
  }

  return (
    <>
      {route ? <RoutedPage content={content} route={route} /> : <NotFound content={content} currentPath={currentPath} />}
    </>
  );
}

function getRouteForPath(content: SiteContent, currentPath: string): SiteRoute | undefined {
  const normalizedPath = normalizePath(currentPath);

  return content.routes.find((route) => normalizePath(route.href) === normalizedPath);
}

function normalizePath(path: string) {
  const withoutQuery = path.split(/[?#]/)[0] || "/";

  if (withoutQuery === "/") {
    return "/";
  }

  return withoutQuery.endsWith("/") ? withoutQuery : `${withoutQuery}/`;
}

function RoutedPage({ content, route }: { readonly content: SiteContent; readonly route: SiteRoute }) {
  if (route.kind === "services") {
    return <ServicesIndexPage content={content} route={route} />;
  }

  if (route.kind === "about") {
    return <AboutPage content={content} route={route} />;
  }

  if (route.kind === "service") {
    const service = content.services.find((item) => item.id === route.sourceId);

    return service ? <ServicePage content={content} route={route} service={service} /> : <NotFound content={content} currentPath={route.href} />;
  }

  if (route.kind === "contact") {
    return <ContactPage content={content} route={route} />;
  }

  return (
    <>
      <Hero content={content} />
      <Inventory content={content} />
      <Services content={content} />
      <Process content={content} />
      <Trust content={content} />
      <Partners content={content} />
      <Contact content={content} />
      <Footer content={content} />
    </>
  );
}

function Hero({ content }: { readonly content: SiteContent }) {
  return (
    <section className="relative isolate overflow-hidden bg-foreground text-background">
      <img
        src={HERO_PHOTO_SRC}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
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
          <p className="text-sm font-semibold text-primary">Tjänsteöversikt</p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-wide">Tydliga vägar för rätt uppdrag</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{content.inventory.routeDecision}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            Hitta snabbt till företagets viktigaste information, tjänster och offertkontakt.
          </p>
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
      <PageHero title={route.label} summary={route.summary} imageSrc={PAGE_HERO_PHOTOS[route.id]} />
      <Services content={content} />
      <Trust content={content} />
      <Partners content={content} />
      <ContactLinkBand content={content} />
      <Footer content={content} />
    </>
  );
}

function AboutPage({ content, route }: { readonly content: SiteContent; readonly route: SiteRoute }) {
  return (
    <>
      <PageHero title={route.label} summary={route.summary} imageSrc={PAGE_HERO_PHOTOS[route.id]} />
      <About content={content} />
      <ContactLinkBand content={content} />
      <Footer content={content} />
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
        eyebrow="Tjänst"
        imageSrc={PAGE_HERO_PHOTOS[route.id]}
      />
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_0.72fr] lg:px-10">
        <div>
          <p className="text-lg leading-8 text-foreground">{service.summary}</p>
          {service.id === "dranering" ? (
            <p className="mt-4 leading-7 text-muted-foreground">
              Dräneringssidan är en egen toppnivå för besökare som behöver fuktsäkring runt husgrund, mur eller
              källarvägg. Innehållet lyfter helheten från bedömning och grävning till återställning.
            </p>
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
          <h2 className="text-xl font-semibold">När tjänsten passar</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {service.title} passar när du vill ha en tydlig genomgång av behov, markförutsättningar och nästa steg
            innan arbetet planeras.
          </p>
        </aside>
      </section>
      <Process content={content} />
      <ContactLinkBand content={content} />
      <Footer content={content} />
    </>
  );
}

function ContactPage({ content, route }: { readonly content: SiteContent; readonly route: SiteRoute }) {
  return (
    <>
      <PageHero title={route.label} summary={route.summary} imageSrc={PAGE_HERO_PHOTOS[route.id]} />
      <Contact content={content} />
      <Footer content={content} />
    </>
  );
}

function NotFound({ content, currentPath }: { readonly content: SiteContent; readonly currentPath: string }) {
  return (
    <>
      <PageHero
        title="Sidan finns inte"
        eyebrow="Okänd sida"
        summary={`${currentPath} matchar ingen aktuell sida. Välj en av genvägarna nedan för att komma vidare.`}
      />
      <section className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Genvägar</p>
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
      <Footer content={content} />
    </>
  );
}

function PageHero({
  title,
  summary,
  eyebrow,
  imageSrc,
}: {
  readonly title: string;
  readonly summary: string;
  readonly eyebrow?: string;
  readonly imageSrc?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-background/10 bg-foreground text-background">
      {imageSrc ? (
        <img
          src={imageSrc}
          alt=""
          aria-hidden="true"
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
        <nav aria-label="Brödsmulor" className="text-sm font-medium text-background/70">
          <a href="/" className="transition-colors hover:text-primary">
            Hem
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

function ContactLinkBand({ content }: { readonly content: SiteContent }) {
  return (
    <section className="border-y bg-secondary">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-12 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Nästa steg</p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-wide text-foreground">{content.contact.title}</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{content.contact.summary}</p>
        </div>
        <Button asChild size="lg" className="shrink-0">
          <a href="/kontakt/">
            Kontakta oss
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </a>
        </Button>
      </div>
    </section>
  );
}

function Services({ content }: { readonly content: SiteContent }) {
  return (
    <section id="tjanster" className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
      <SectionHeading
        eyebrow="Våra tjänster"
        title="En pålitlig partner inom mark, bygg och anläggning"
        summary="Svärd Entreprenad hjälper privatpersoner, företag och fastighetsägare med markarbeten, dränering, grundläggning, stenläggning och andra anläggningsuppdrag."
      />
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {content.services.map((service) => {
          const visual = content.routes.find(
            (route) => route.kind === "service" && route.sourceId === service.id,
          )?.visual;
          const photo = SERVICE_PHOTOS[service.id] ?? visual?.assetPath;
          const fallback = visual?.assetPath;

          return (
            <Card key={service.id} id={service.id} className="flex flex-col overflow-hidden">
              {photo ? (
                <img
                  src={photo}
                  alt={visual?.alt ?? service.title}
                  className="aspect-[16/10] w-full border-b object-cover"
                  loading="lazy"
                  onError={(event) => {
                    const img = event.currentTarget;

                    if (fallback && !img.dataset.fellBack) {
                      img.dataset.fellBack = "true";
                      img.src = fallback;
                    }
                  }}
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
                  className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80"
                >
                  Läs mer
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
  return (
    <section id="process" className="bg-foreground text-background">
      <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Arbetsprocess</p>
          <h2 className="mt-2 font-display text-4xl font-bold tracking-wide text-background">
            Från första kontakt till slutfört arbete
          </h2>
          <p className="mt-3 leading-7 text-background/70">
            Varje uppdrag drivs med tydlig dialog, planering på plats och noggrant utförande hela vägen till färdigt
            resultat.
          </p>
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

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Varför välja oss</p>
        <h2 className="mt-2 font-display text-4xl font-bold tracking-wide text-foreground">
          Trygghetssignalerna från startsidan
        </h2>
        <p className="mt-3 leading-7 text-muted-foreground">
          Garantier, certifieringar och bred erfarenhet är centrala delar av företagets förtroendeyta.
        </p>
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

  return (
    <section id="samarbetspartner" className="border-y bg-muted/70">
      <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="max-w-2xl">
          <SectionHeading
            eyebrow="Samarbetspartner"
            title="Samarbetspartner"
            summary="Partnerfältet är uppdaterat enligt ägarens önskemål och visar endast aktuell samarbetspartner."
          />
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

  return (
    <footer className="border-t border-background/10 bg-foreground text-background">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-12 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-10">
        <div className="max-w-sm">
          <p className="font-display text-2xl font-bold uppercase tracking-wide text-background">{BRAND_NAME}</p>
          <p className="mt-3 text-sm leading-6 text-background/65">
            Din lokala partner för mark, schakt, dränering och anläggning.
          </p>
        </div>
        <nav aria-label="Sidfotsnavigation" className="text-sm">
          <p className="font-semibold text-background">Sidor</p>
          <ul className="mt-3 grid gap-2">
            {[
              { label: "Hem", href: "/" },
              { label: "Tjänster", href: "/tjanster/" },
              { label: "Om oss", href: "/om-oss/" },
              { label: "Kontakt", href: "/kontakt/" },
            ].map((route) => (
              <li key={route.href}>
                <a href={route.href} className="text-background/70 transition-colors hover:text-primary">
                  {route.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Tjänster" className="text-sm">
          <p className="font-semibold text-background">Tjänster</p>
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
          <p className="font-semibold text-background">Kontakt</p>
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
          © {BRAND_NAME}
        </div>
      </div>
    </footer>
  );
}

function Contact({ content }: { readonly content: SiteContent }) {
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
              className="min-h-11 rounded-md border bg-card px-3 py-2 text-base font-normal text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary sm:text-sm"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-foreground">
              {form.customerTypeField.label}
              <select
                name={form.customerTypeField.name}
                required
                className="min-h-11 rounded-md border bg-card px-3 py-2 text-base font-normal text-foreground outline-none transition-colors focus:border-primary sm:text-sm"
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
                className="min-h-11 rounded-md border bg-card px-3 py-2 text-base font-normal text-foreground outline-none transition-colors focus:border-primary sm:text-sm"
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
              className="min-h-32 resize-y rounded-md border bg-card px-3 py-2 text-base font-normal text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary sm:text-sm"
            />
          </label>
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
