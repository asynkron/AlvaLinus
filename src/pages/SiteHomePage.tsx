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
      <Header />
      <ContentSurface currentPath={currentPath} state={state} />
    </main>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
        <a href="/" className="text-base font-semibold">
          AlvaLinus
        </a>
        <nav
          aria-label="Huvudnavigation"
          className="hidden items-center gap-5 text-sm text-muted-foreground md:flex"
        >
          <a className="transition-colors hover:text-foreground" href="/tjanster/">
            Tjänster
          </a>
          <a className="transition-colors hover:text-foreground" href="/#process">
            Process
          </a>
          <a className="transition-colors hover:text-foreground" href="/referenser/">
            Referenser
          </a>
          <a className="transition-colors hover:text-foreground" href="/kontakt/">
            Kontakt
          </a>
        </nav>
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
    <section className="border-b bg-[linear-gradient(135deg,hsl(var(--background))_0%,hsl(var(--secondary))_54%,hsl(var(--muted))_100%)]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1fr_0.78fr] md:items-center lg:px-10 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">{content.hero.eyebrow}</p>
          <h1 className="mt-4 text-5xl font-semibold leading-tight tracking-normal text-foreground sm:text-6xl">
            {content.hero.title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">{content.hero.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href={content.hero.primaryAction.href}>
                {content.hero.primaryAction.label}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={content.hero.secondaryAction.href}>{content.hero.secondaryAction.label}</a>
            </Button>
          </div>
        </div>
        <div className="grid gap-3 rounded-lg border bg-card p-4 shadow-sm">
          {content.hero.stats.map((stat) => (
            <div key={stat.label} className="rounded-md bg-secondary p-5">
              <p className="text-3xl font-semibold text-primary">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
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
          <p className="text-sm font-semibold text-primary">Källinventering</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-normal">Sitemap och synliga huvudspår</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{content.inventory.routeDecision}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            {content.inventory.pageCount} publika sid-URL:er kontrollerade från {content.inventory.source}.
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
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_0.72fr] lg:px-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">Tjänstesida</p>
          <h2 className="mt-2 text-4xl font-semibold tracking-normal text-foreground">{service.title}</h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">{service.summary}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {service.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <aside className="rounded-lg border bg-card p-5">
          <h2 className="text-xl font-semibold">Sitemap-replik</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Den här sidan ger {service.title.toLowerCase()} en egen URL i den statiska strukturen och behåller källans
            tjänstespår som extern referens.
          </p>
          <a
            href={service.sourceHref}
            className="mt-5 inline-flex items-center text-sm font-medium text-primary hover:text-foreground"
          >
            Visa källsida
            <ExternalLink className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" />
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
    <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
      <div className="rounded-lg border bg-card p-6">
        <p className="text-sm font-semibold uppercase tracking-normal text-primary">Okänd sida</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal">Sidan finns inte i den statiska replikens sitemap</h1>
        <p className="mt-3 leading-7 text-muted-foreground">
          {currentPath} matchar ingen av de replikerade undersidorna. Välj en publicerad sidväg nedan.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {content.routes.map((route) => (
            <a
              key={route.id}
              href={route.href}
              className="rounded-full border bg-background px-3 py-1 text-sm text-foreground transition-colors hover:border-primary"
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
    <section className="border-b bg-secondary/50">
      <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <a href="/" className="text-sm font-medium text-primary hover:text-foreground">
          Startsida
        </a>
        <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-normal text-foreground sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">{summary}</p>
      </div>
    </section>
  );
}

function ContactLinkBand({ content }: { readonly content: SiteContent }) {
  return (
    <section className="border-t bg-secondary/50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
        <div>
          <p className="text-sm font-semibold text-primary">Nästa steg</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-normal">{content.contact.title}</h2>
        </div>
        <Button asChild>
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
        summary="Startsidan och navigationen lyfter ett brett tjänsteutbud. Den statiska repliken samlar det i skannbara tjänstekort med länkar till källans undersidor."
      />
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {content.services.map((service) => (
          <Card key={service.id} id={service.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{service.title}</CardTitle>
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
                className="inline-flex items-center text-sm font-medium text-primary hover:text-foreground"
              >
                Läs mer
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" />
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
    <section id="process" className="border-y bg-secondary/60">
      <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="Arbetsprocess"
          title="Från första kontakt till slutfört arbete"
          summary="Källsidan beskriver processen i fyra steg. Här är samma väg översatt till en tydlig statisk kundresa."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {content.process.map((step, index) => (
            <div key={step.title} className="rounded-lg border bg-card p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {index + 1}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
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
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {content.trust.map((item, index) => {
          const Icon = icons[index] ?? CheckCircle2;

          return (
            <div key={item.title} className="rounded-lg border bg-card p-5">
              <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
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
    <section id="referenser" className="border-y bg-muted/70">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_1fr] lg:px-10">
        <div>
          <SectionHeading
            eyebrow="Referensobjekt"
            title="Projekt och uppdrag som ger substans"
            summary="Sitemappen innehåller referensobjekt och projektsidor. Repliken visar ett urval så besökaren ser att tjänsterna är förankrade i verkliga uppdrag."
          />
          <div className="mt-6 grid gap-3">
            {content.references.map((reference) => (
              <a
                key={reference.sourceHref}
                href={reference.href}
                className="flex items-center justify-between gap-4 rounded-lg border bg-card p-4 transition-colors hover:border-primary"
              >
                <span>
                  <span className="block font-medium">{reference.title}</span>
                  <span className="text-sm text-muted-foreground">{reference.category}</span>
                </span>
                <ArrowRight className="h-4 w-4 text-primary" aria-hidden="true" />
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
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {content.partners.map((partner) => (
              <div key={partner.name} className="rounded-lg border bg-card p-4">
                <Handshake className="h-5 w-5 text-primary" aria-hidden="true" />
                <p className="mt-3 font-medium">{partner.name}</p>
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
    <section id="kontakt" className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
      <div className="grid gap-8 rounded-lg border bg-card p-6 md:grid-cols-[1fr_0.8fr] md:p-8">
        <div>
          <p className="text-sm font-semibold text-primary">Kontakt</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-normal">{content.contact.title}</h2>
          <p className="mt-4 leading-7 text-muted-foreground">{content.contact.summary}</p>
          <div className="mt-6 inline-flex items-center rounded-md bg-accent px-4 py-3 text-sm font-medium text-accent-foreground">
            <MapPinned className="mr-2 h-4 w-4" aria-hidden="true" />
            {content.contact.offertLabel}
          </div>
        </div>
        <div className="grid gap-3">
          {content.contact.items.map((item) => (
            <a key={item.label} href={item.href} className="rounded-lg border bg-background p-4 hover:border-primary">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <PhoneCall className="h-4 w-4 text-primary" aria-hidden="true" />
                {item.label}
              </span>
              <span className="mt-2 block font-medium">{item.value}</span>
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
      <p className="text-sm font-semibold uppercase tracking-normal text-primary">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-normal text-foreground">{title}</h2>
      <p className="mt-3 leading-7 text-muted-foreground">{summary}</p>
    </div>
  );
}
