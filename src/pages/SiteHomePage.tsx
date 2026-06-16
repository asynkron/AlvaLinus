import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ExternalLink,
  Handshake,
  MapPinned,
  PhoneCall,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";

import { StaticState } from "../components/StaticState";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { loadSiteContent } from "../lib/site-content";
import type { ServiceArea, SiteContent, SiteRoute } from "../types/site";

const BRAND_NAME = "Svärd Entreprenad";
const BRAND_LOGO_SRC = "/svard-entreprenad-logo.png";

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
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <ContentSurface currentPath={currentPath} state={state} />
      </main>
      <SiteFooter />
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-secondary/30">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-12 sm:px-8 md:flex-row md:items-start md:justify-between lg:px-10">
        <div className="max-w-sm">
          <img
            src={BRAND_LOGO_SRC}
            alt=""
            aria-hidden="true"
            className="h-9 w-auto max-w-[12rem] object-contain"
          />
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Statisk AlvaLinus-replik av {BRAND_NAME} — mark, bygg och anläggning med fokus på kvalitet och en nöjd kund.
          </p>
        </div>
        <nav aria-label="Sidfotsnavigation" className="grid grid-cols-2 gap-x-12 gap-y-2.5 text-sm">
          <a className="text-muted-foreground transition-colors hover:text-foreground" href="/tjanster/">
            Tjänster
          </a>
          <a className="text-muted-foreground transition-colors hover:text-foreground" href="/#process">
            Process
          </a>
          <a className="text-muted-foreground transition-colors hover:text-foreground" href="/referenser/">
            Referenser
          </a>
          <a className="text-muted-foreground transition-colors hover:text-foreground" href="/kontakt/">
            Kontakt
          </a>
        </nav>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto w-full max-w-7xl px-5 py-5 text-xs text-muted-foreground sm:px-8 lg:px-10">
          © {new Date().getFullYear()} {BRAND_NAME}
        </div>
      </div>
    </footer>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 shadow-[0_1px_0_0_hsl(var(--border)/0.6),0_12px_30px_-24px_rgb(15_23_42/0.35)] backdrop-blur-xl supports-[backdrop-filter]:bg-background/65">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
        <a
          href="/"
          className="flex min-w-0 items-center gap-3 rounded-lg outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={`${BRAND_NAME} startsida`}
        >
          <img
            src={BRAND_LOGO_SRC}
            alt={`${BRAND_NAME} logotyp`}
            className="h-9 w-auto max-w-[11rem] object-contain sm:h-10 sm:max-w-[14rem]"
          />
          <span className="sr-only">{BRAND_NAME}</span>
        </a>
        <div className="flex items-center gap-2 sm:gap-5">
          <nav
            aria-label="Huvudnavigation"
            className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex"
          >
            <a className="relative transition-colors hover:text-foreground" href="/tjanster/">
              Tjänster
            </a>
            <a className="relative transition-colors hover:text-foreground" href="/#process">
              Process
            </a>
            <a className="relative transition-colors hover:text-foreground" href="/referenser/">
              Referenser
            </a>
            <a className="relative transition-colors hover:text-foreground" href="/kontakt/">
              Kontakt
            </a>
          </nav>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <a href="/kontakt/">
              Begär offert
              <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" aria-hidden="true" />
            </a>
          </Button>
        </div>
      </div>
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

  if (route.kind === "service") {
    const service = content.services.find((item) => item.id === route.sourceId);

    return service ? <ServicePage content={content} route={route} service={service} /> : <NotFound content={content} currentPath={route.href} />;
  }

  if (route.kind === "references") {
    return <ReferencesPage content={content} route={route} />;
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
      <References content={content} />
      <Contact content={content} />
    </>
  );
}

function Hero({ content }: { readonly content: SiteContent }) {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_36rem_at_8%_-10%,hsl(var(--primary)/0.10),transparent_60%),radial-gradient(46rem_28rem_at_100%_0%,hsl(var(--accent)/0.10),transparent_55%),linear-gradient(180deg,hsl(var(--secondary)/0.45)_0%,hsl(var(--background))_70%)]"
      />
      <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1fr_0.78fr] md:items-center lg:px-10 lg:py-24">
        <div className="max-w-3xl">
          <img
            src={BRAND_LOGO_SRC}
            alt=""
            aria-hidden="true"
            className="mb-7 h-auto w-full max-w-[18rem] object-contain drop-shadow-sm sm:max-w-[24rem]"
          />
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
            {content.hero.eyebrow}
          </span>
          <h1 className="mt-5 text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
            {content.hero.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">{content.hero.intro}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href={content.hero.primaryAction.href}>
                {content.hero.primaryAction.label}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" aria-hidden="true" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={content.hero.secondaryAction.href}>{content.hero.secondaryAction.label}</a>
            </Button>
          </div>
          <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
            Certifierade team · 100% nöjd-kund-garanti
          </p>
        </div>
        <div className="relative rounded-2xl border border-border/70 bg-card/80 p-2.5 shadow-elevated backdrop-blur-sm">
          <div className="grid gap-2.5">
            {content.hero.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border/60 bg-gradient-to-br from-secondary/70 to-card p-5 transition-colors"
              >
                <p className="text-4xl font-semibold tracking-tight text-primary">{stat.value}</p>
                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Inventory({ content }: { readonly content: SiteContent }) {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
      <div className="grid gap-8 rounded-2xl border border-border/70 bg-card/80 p-6 shadow-elevated backdrop-blur-sm md:grid-cols-[0.8fr_1.2fr] md:p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Källinventering</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">Sitemap och synliga huvudspår</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{content.inventory.routeDecision}</p>
        </div>
        <div className="md:border-l md:border-border/60 md:pl-8">
          <p className="text-sm leading-6 text-muted-foreground">
            {content.inventory.pageCount} publika sid-URL:er kontrollerade från {content.inventory.source}.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {content.inventory.primaryRoutes.map((route) => (
              <a
                key={route.label}
                href={route.href}
                className="rounded-full border border-border/70 bg-background px-3.5 py-1.5 text-sm font-medium text-foreground transition-all duration-200 ease-premium hover:-translate-y-0.5 hover:border-primary/50 hover:bg-secondary hover:text-primary"
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
      <PageHero title={route.label} summary={route.summary} />
      <Services content={content} />
      <Trust content={content} />
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
      <PageHero title={service.title} summary={route.summary} />
      <section className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_0.72fr] lg:px-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Tjänstesida</p>
          <h2 className="mt-2 text-4xl font-semibold tracking-tight text-foreground">{service.title}</h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">{service.summary}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {service.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border/60 bg-secondary/70 px-3 py-1 text-sm font-medium text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <aside className="rounded-2xl border border-border/70 bg-card p-6 shadow-elevated">
          <h2 className="text-xl font-semibold tracking-tight">Sitemap-replik</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Den här sidan ger {service.title.toLowerCase()} en egen URL i den statiska strukturen och behåller källans
            tjänstespår som extern referens.
          </p>
          <a
            href={service.sourceHref}
            className="group/src mt-5 inline-flex items-center text-sm font-semibold text-primary transition-colors hover:text-foreground"
          >
            Visa källsida
            <ExternalLink
              className="ml-1.5 h-3.5 w-3.5 transition-transform duration-200 ease-premium group-hover/src:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        </aside>
      </section>
      <Process content={content} />
      <ContactLinkBand content={content} />
    </>
  );
}

function ReferencesPage({ content, route }: { readonly content: SiteContent; readonly route: SiteRoute }) {
  return (
    <>
      <PageHero title={route.label} summary={route.summary} />
      <References content={content} />
      <ContactLinkBand content={content} />
    </>
  );
}

function ContactPage({ content, route }: { readonly content: SiteContent; readonly route: SiteRoute }) {
  return (
    <>
      <PageHero title={route.label} summary={route.summary} />
      <Contact content={content} />
    </>
  );
}

function NotFound({ content, currentPath }: { readonly content: SiteContent; readonly currentPath: string }) {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
      <div className="rounded-2xl border border-border/70 bg-card p-8 shadow-elevated md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Okänd sida</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Sidan finns inte i den statiska replikens sitemap</h1>
        <p className="mt-3 leading-7 text-muted-foreground">
          {currentPath} matchar ingen av de replikerade undersidorna. Välj en publicerad sidväg nedan.
        </p>
        <div className="mt-7 flex flex-wrap gap-2">
          {content.routes.map((route) => (
            <a
              key={route.id}
              href={route.href}
              className="rounded-full border border-border/70 bg-background px-3.5 py-1.5 text-sm font-medium text-foreground transition-all duration-200 ease-premium hover:-translate-y-0.5 hover:border-primary/50 hover:bg-secondary hover:text-primary"
            >
              {route.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function PageHero({ title, summary }: { readonly title: string; readonly summary: string }) {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-secondary/40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(48rem_24rem_at_0%_-20%,hsl(var(--primary)/0.08),transparent_60%)]"
      />
      <div className="relative mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <a
          href="/"
          className="inline-flex items-center text-sm font-semibold text-primary transition-colors hover:text-foreground"
        >
          Startsida
        </a>
        <h1 className="mt-4 text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">{summary}</p>
      </div>
    </section>
  );
}

function ContactLinkBand({ content }: { readonly content: SiteContent }) {
  return (
    <section className="border-t border-border/60 bg-secondary/40">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-5 py-12 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Nästa steg</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">{content.contact.title}</h2>
        </div>
        <Button asChild size="lg">
          <a href="/kontakt/">
            Kontakta oss
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" aria-hidden="true" />
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
        summary="Startsidan och navigationen lyfter ett brett tjänsteutbud. Den statiska repliken samlar det i skannbara tjänstekort med länkar till källans undersidor."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {content.services.map((service) => (
          <Card
            key={service.id}
            id={service.id}
            className="group/card relative flex flex-col overflow-hidden hover:-translate-y-1 hover:border-primary/30 hover:shadow-soft"
          >
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-primary to-accent transition-transform duration-300 ease-premium group-hover/card:scale-x-100"
            />
            <CardHeader>
              <CardTitle className="text-xl transition-colors group-hover/card:text-primary">{service.title}</CardTitle>
              <CardDescription>{service.summary}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto grid gap-5">
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border/60 bg-secondary/70 px-3 py-1 text-xs font-medium text-secondary-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <a
                href={service.href}
                className="inline-flex items-center text-sm font-semibold text-primary transition-colors hover:text-foreground"
              >
                Läs mer
                <ArrowRight
                  className="ml-1.5 h-3.5 w-3.5 transition-transform duration-200 ease-premium group-hover/card:translate-x-1"
                  aria-hidden="true"
                />
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Process({ content }: { readonly content: SiteContent }) {
  return (
    <section id="process" className="relative border-y border-border/60 bg-secondary/40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(40rem_24rem_at_50%_-20%,hsl(var(--primary)/0.06),transparent_60%)]"
      />
      <div className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="Arbetsprocess"
          title="Från första kontakt till slutfört arbete"
          summary="Källsidan beskriver processen i fyra steg. Här är samma väg översatt till en tydlig statisk kundresa."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-4">
          {content.process.map((step, index) => (
            <div
              key={step.title}
              className="group/step relative rounded-xl border border-border/70 bg-card p-6 shadow-sm transition-all duration-300 ease-premium hover:-translate-y-1 hover:border-primary/30 hover:shadow-elevated"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-base font-semibold text-primary-foreground shadow-md shadow-primary/25">
                {index + 1}
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.summary}</p>
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
    <section className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
      <SectionHeading
        eyebrow="Varför välja oss"
        title="Trygghetssignalerna från startsidan"
        summary="Garantier, certifieringar och bred erfarenhet är centrala delar av källans förtroendeyta."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {content.trust.map((item, index) => {
          const Icon = icons[index] ?? CheckCircle2;

          return (
            <div
              key={item.title}
              className="group/trust rounded-xl border border-border/70 bg-card p-6 shadow-sm transition-all duration-300 ease-premium hover:-translate-y-1 hover:border-primary/30 hover:shadow-elevated"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/15 bg-primary/8 text-primary transition-colors group-hover/trust:bg-primary/12">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.summary}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function References({ content }: { readonly content: SiteContent }) {
  return (
    <section id="referenser" className="border-y border-border/60 bg-muted/40">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_1fr] lg:px-10">
        <div>
          <SectionHeading
            eyebrow="Referensobjekt"
            title="Projekt och uppdrag som ger substans"
            summary="Sitemappen innehåller referensobjekt och projektsidor. Repliken visar ett urval så besökaren ser att tjänsterna är förankrade i verkliga uppdrag."
          />
          <div className="mt-7 grid gap-3">
            {content.references.map((reference) => (
              <a
                key={reference.sourceHref}
                href={reference.href}
                className="group/ref flex items-center justify-between gap-4 rounded-xl border border-border/70 bg-card p-4 shadow-sm transition-all duration-200 ease-premium hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elevated"
              >
                <span>
                  <span className="block font-semibold tracking-tight">{reference.title}</span>
                  <span className="text-sm text-muted-foreground">{reference.category}</span>
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-background text-primary transition-colors group-hover/ref:border-primary/40 group-hover/ref:bg-primary/5">
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-200 ease-premium group-hover/ref:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </a>
            ))}
          </div>
        </div>
        <div>
          <SectionHeading
            eyebrow="Samarbetspartners & utmärkelser"
            title="Partnerfältet från källsidan"
            summary="Källan visar partner- och utmärkelseloggor. Här återges namnen textbaserat för att undvika externa bildberoenden i den statiska appen."
          />
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {content.partners.map((partner) => (
              <div
                key={partner.name}
                className="rounded-xl border border-border/70 bg-card p-4 shadow-sm transition-all duration-200 ease-premium hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-elevated"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/15 bg-primary/8 text-primary">
                  <Handshake className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="mt-3 font-semibold tracking-tight">{partner.name}</p>
                <p className="text-sm text-muted-foreground">{partner.kind}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact({ content }: { readonly content: SiteContent }) {
  return (
    <section id="kontakt" className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
      <div className="relative grid gap-10 overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-elevated md:grid-cols-[1fr_0.8fr] md:p-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(36rem_20rem_at_0%_0%,hsl(var(--primary)/0.08),transparent_60%),radial-gradient(28rem_18rem_at_100%_100%,hsl(var(--accent)/0.08),transparent_55%)]"
        />
        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Kontakt</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{content.contact.title}</h2>
          <p className="mt-4 leading-7 text-muted-foreground">{content.contact.summary}</p>
          <div className="mt-7 inline-flex items-center rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-sm shadow-accent/30">
            <MapPinned className="mr-2 h-4 w-4" aria-hidden="true" />
            {content.contact.offertLabel}
          </div>
        </div>
        <div className="relative grid gap-3">
          {content.contact.items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="group/contact rounded-xl border border-border/70 bg-background/80 p-4 backdrop-blur-sm transition-all duration-200 ease-premium hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elevated"
            >
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <PhoneCall className="h-4 w-4 text-primary" aria-hidden="true" />
                {item.label}
              </span>
              <span className="mt-2 flex items-center justify-between font-semibold tracking-tight">
                {item.value}
                <ArrowRight
                  className="h-4 w-4 text-primary opacity-0 transition-all duration-200 ease-premium group-hover/contact:translate-x-0.5 group-hover/contact:opacity-100"
                  aria-hidden="true"
                />
              </span>
            </a>
          ))}
        </div>
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
      <p className="flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.14em] text-primary">
        <span className="h-px w-7 bg-gradient-to-r from-primary to-accent" aria-hidden="true" />
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-[2rem]">{title}</h2>
      <p className="mt-3 leading-7 text-muted-foreground">{summary}</p>
    </div>
  );
}
