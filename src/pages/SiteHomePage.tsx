import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Handshake,
  Mail,
  MapPinned,
  PhoneCall,
  Send,
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
        <a href="/" className="flex min-w-0 items-center gap-3" aria-label={`${BRAND_NAME} startsida`}>
          <img
            src={BRAND_LOGO_SRC}
            alt={`${BRAND_NAME} logotyp`}
            className="h-9 w-auto max-w-[11rem] object-contain sm:h-10 sm:max-w-[14rem]"
          />
          <span className="sr-only">{BRAND_NAME}</span>
        </a>
        <nav
          aria-label="Huvudnavigation"
          className="hidden items-center gap-5 text-sm text-muted-foreground md:flex"
        >
          <a className="transition-colors hover:text-foreground" href="/">
            Hem
          </a>
          <a className="transition-colors hover:text-foreground" href="/tjanster/">
            Tjänster
          </a>
          <a className="transition-colors hover:text-foreground" href="/om-oss/">
            Om oss
          </a>
          <a className="transition-colors hover:text-foreground" href="/dranering/">
            Dränering
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
    <section className="border-b bg-foreground text-background">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1fr_0.78fr] md:items-center lg:px-10 lg:py-20">
        <div className="max-w-3xl">
          <img
            src={BRAND_LOGO_SRC}
            alt=""
            aria-hidden="true"
            className="mb-7 h-auto w-full max-w-[18rem] object-contain sm:max-w-[24rem]"
          />
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">{content.hero.eyebrow}</p>
          <h1 className="mt-4 text-5xl font-semibold leading-tight tracking-normal text-background sm:text-6xl">
            {content.hero.title}
          </h1>
          <p className="mt-6 whitespace-pre-line text-lg leading-8 text-background sm:text-xl">{content.hero.intro}</p>
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
        <div className="grid gap-3 rounded-lg border border-background/20 bg-background/10 p-4 shadow-sm">
          {content.hero.stats.map((stat) => (
            <div key={stat.label} className="rounded-md bg-background p-5 text-foreground">
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
          <p className="text-sm font-semibold text-primary">Tjänsteöversikt</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-normal">Tydliga vägar för rätt uppdrag</h2>
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
      <PageHero title={route.label} summary={route.summary} />
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
      <PageHero title={route.label} summary={route.summary} />
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
      <PageHero title={service.title} summary={route.summary} />
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_0.72fr] lg:px-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">Tjänstesida</p>
          <h2 className="mt-2 text-4xl font-semibold tracking-normal text-foreground">{service.title}</h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">{service.summary}</p>
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
        <aside className="rounded-lg border bg-card p-5">
          <h2 className="text-xl font-semibold">När tjänsten passar</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {service.title} passar när du vill ha en tydlig genomgång av behov, markförutsättningar och nästa steg
            innan arbetet planeras.
          </p>
        </aside>
      </section>
      <Process content={content} />
      <ContactLinkBand content={content} />
    </>
  );
}

function ContactPage({ content, route }: { readonly content: SiteContent; readonly route: SiteRoute }) {
  return (
    <>
      <PageHero title={route.label} summary={route.summary} />
      <Contact content={content} />
      <Footer content={content} />
    </>
  );
}

function NotFound({ content, currentPath }: { readonly content: SiteContent; readonly currentPath: string }) {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
      <div className="rounded-lg border bg-card p-6">
        <p className="text-sm font-semibold uppercase tracking-normal text-primary">Okänd sida</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal">Sidan finns inte</h1>
        <p className="mt-3 leading-7 text-muted-foreground">
          {currentPath} matchar ingen aktuell sida. Välj en av genvägarna nedan för att komma vidare.
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
        summary="Svärd Entreprenad hjälper privatpersoner, företag och fastighetsägare med markarbeten, dränering, grundläggning, stenläggning och andra anläggningsuppdrag."
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

function About({ content }: { readonly content: SiteContent }) {
  return (
    <section id="om-oss" className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeading eyebrow="Om oss" title={content.about.title} summary={content.about.summary} />
        <div className="grid gap-5 text-base leading-8 text-muted-foreground">
          {content.about.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
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
          summary="Varje uppdrag drivs med tydlig dialog, planering på plats och noggrant utförande hela vägen till färdigt resultat."
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
    <footer className="border-t bg-foreground text-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-5 py-8 text-sm sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
        <p className="font-medium">{BRAND_NAME}</p>
        <a href={`mailto:${email}`} className="inline-flex items-center gap-2 hover:text-primary">
          <Mail className="h-4 w-4" aria-hidden="true" />
          {email}
        </a>
      </div>
    </footer>
  );
}

function Contact({ content }: { readonly content: SiteContent }) {
  const form = content.contact.form;
  const emailAction = `mailto:${form.recipientEmail}?subject=${encodeURIComponent(form.subject)}`;

  return (
    <section id="kontakt" className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
      <div className="grid gap-8 rounded-lg border bg-card p-6 lg:grid-cols-[0.9fr_1.1fr] md:p-8">
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-primary">Kontakt</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-normal">{content.contact.title}</h2>
          <p className="mt-4 leading-7 text-muted-foreground">{content.contact.summary}</p>
          <div className="mt-6 inline-flex max-w-max items-center rounded-md bg-accent px-4 py-3 text-sm font-medium text-accent-foreground">
            <MapPinned className="mr-2 h-4 w-4" aria-hidden="true" />
            {content.contact.offertLabel}
          </div>
          <div className="mt-6 grid gap-3">
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
        <form
          aria-label={form.ariaLabel}
          action={emailAction}
          method="post"
          encType="text/plain"
          className="grid gap-4 rounded-lg border bg-background p-5"
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
      <p className="text-sm font-semibold uppercase tracking-normal text-primary">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-normal text-foreground">{title}</h2>
      <p className="mt-3 leading-7 text-muted-foreground">{summary}</p>
    </div>
  );
}
