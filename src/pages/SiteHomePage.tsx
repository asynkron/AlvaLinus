import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

import { StaticState } from "../components/StaticState";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { loadSiteContent } from "../lib/site-content";
import type { SiteContent } from "../types/site";

type LoadState =
  | { readonly status: "loading" }
  | { readonly status: "error"; readonly message: string }
  | { readonly status: "ready"; readonly content: SiteContent };

type SiteHomePageProps = {
  readonly initialState?: LoadState;
};

export function SiteHomePage({ initialState }: SiteHomePageProps) {
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
          const message = error instanceof Error ? error.message : "Innehallskallan kunde inte lasas.";
          setState({ status: "error", message });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [initialState]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <Header />
        <section className="grid gap-10 py-16 md:grid-cols-[1.05fr_0.95fr] md:items-center lg:py-20">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-semibold leading-tight tracking-normal text-foreground sm:text-6xl">
              AlvaLinus
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              En byggbar, statisk webbplatsgrund for React, TypeScript och typat innehall.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href="#content">
                  Se innehall
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#foundation">Lasa om bygget</a>
              </Button>
            </div>
          </div>
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Deploybar statisk frontend</CardTitle>
              <CardDescription>
                Inga API-rutter, databaser eller serverprocesser kravs for att publicera build-outputen.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {["React + Vite", "Strict TypeScript", "Shadcn UI-primitiver"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-md bg-secondary px-4 py-3 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span>{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
        <ContentSurface state={state} />
      </div>
    </main>
  );
}

function Header() {
  return (
    <header className="flex items-center justify-between border-b py-4">
      <a href="/" className="text-base font-semibold">
        AlvaLinus
      </a>
      <nav aria-label="Huvudnavigation" className="flex items-center gap-4 text-sm text-muted-foreground">
        <a className="transition-colors hover:text-foreground" href="#foundation">
          Grund
        </a>
        <a className="transition-colors hover:text-foreground" href="#content">
          Innehall
        </a>
      </nav>
    </header>
  );
}

function ContentSurface({ state }: { readonly state: LoadState }) {
  if (state.status === "loading") {
    return (
      <section id="content" className="pb-16">
        <StaticState state="loading" />
      </section>
    );
  }

  if (state.status === "error") {
    return (
      <section id="content" className="pb-16">
        <StaticState state="error" title="Innehall kunde inte laddas" message={state.message} />
      </section>
    );
  }

  const { content } = state;

  if (content.sections.length === 0) {
    return (
      <section id="content" className="pb-16">
        <StaticState state="empty" title="Inget innehall annu" message="Lagg till statiska dataposter i src/data." />
      </section>
    );
  }

  return (
    <section id="content" className="pb-16">
      <div className="mb-6 max-w-2xl">
        <h2 className="text-3xl font-semibold tracking-normal">{content.hero.title}</h2>
        <p className="mt-3 leading-7 text-muted-foreground">{content.hero.intro}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {content.sections.map((section) => (
          <Card key={section.id} id={section.id}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{section.summary}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
