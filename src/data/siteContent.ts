import type { SiteContent } from "../types/site";

export const siteContent = {
  hero: {
    title: "AlvaLinus",
    intro:
      "En statisk webbplatsgrund for innehall, presentation och fortsatt produktutveckling utan backend-runtime.",
    primaryAction: {
      label: "Se innehall",
      href: "#content",
    },
    secondaryAction: {
      label: "Lasa om bygget",
      href: "#foundation",
    },
  },
  sections: [
    {
      id: "foundation",
      title: "Statisk grund",
      summary:
        "React, TypeScript och Vite bygger deploybara filer som kan publiceras pa vanlig statisk hosting.",
    },
    {
      id: "content",
      title: "Typat innehall",
      summary:
        "Sidans forsta innehall kommer fran en TypeScript-datakalla med kontrakt som kontrolleras vid build.",
    },
    {
      id: "quality",
      title: "Reproducerbar kvalitet",
      summary:
        "Installations-, build- och testkommandon kor fran repo-roten sa nya bidrag kan verifieras konsekvent.",
    },
  ],
} satisfies SiteContent;
