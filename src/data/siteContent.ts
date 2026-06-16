import type { SiteContent } from "../types/site";

export const siteContent = {
  inventory: {
    checkedAt: "2026-06-16T10:05:00Z",
    source: "https://www.erikssonsvard.se/page-sitemap.xml",
    pageCount: 58,
    routeDecision:
      "Sitemappen visar många publika undersidor. Den här statiska repliken gör de begärda huvudsidorna till primär struktur: Hem, Tjänster, Dränering, Pool, Referensobjekt och Kontakt.",
    primaryRoutes: [
      { label: "Hem", href: "/" },
      { label: "Tjänster", href: "/tjanster/" },
      { label: "Dränering", href: "/dranering/" },
      { label: "Pool", href: "/pool/" },
      { label: "Referensobjekt", href: "/referenser/" },
      { label: "Kontakt", href: "/kontakt/" },
    ],
  },
  routes: [
    {
      id: "home",
      kind: "home",
      label: "Hem",
      href: "/",
      summary: "Startsida med översikt över tjänster, process, referensobjekt och offertkontakt.",
    },
    {
      id: "services",
      kind: "services",
      label: "Tjänster",
      href: "/tjanster/",
      summary: "Samlad sida för de huvudsakliga mark-, bygg- och anläggningstjänsterna.",
    },
    {
      id: "stensattning",
      kind: "service",
      sourceId: "stensattning",
      label: "Stensättning",
      href: "/stensattning/",
      summary: "Egen tjänstesida för stensättning, marksten och stenmurar.",
    },
    {
      id: "markarbete",
      kind: "service",
      sourceId: "markarbete",
      label: "Markarbete",
      href: "/markarbete/",
      summary: "Egen tjänstesida för mark och anläggning.",
    },
    {
      id: "gravjobb",
      kind: "service",
      sourceId: "gravjobb",
      label: "Grävjobb",
      href: "/gravjobb/",
      summary: "Egen tjänstesida för maskin- och grävarbeten.",
    },
    {
      id: "dranering",
      kind: "service",
      sourceId: "dranering",
      label: "Dränering",
      href: "/dranering/",
      summary:
        "Toppsida för dränering med fuktsäkra markarbeten, schakt, återfyllnad och trygg hantering runt husgrund och mur.",
    },
    {
      id: "pool",
      kind: "service",
      sourceId: "pool",
      label: "Pool",
      href: "/pool/",
      summary:
        "Toppsida för poolprojekt med markförberedelser, installation, glasfiberpool, thermopool och samordnad utemiljö.",
    },
    {
      id: "tradgard",
      kind: "service",
      sourceId: "tradgard",
      label: "Trädgårdsplanering",
      href: "/tradgardsplanering/",
      summary: "Egen tjänstesida för tomt- och trädgårdsplanering.",
    },
    {
      id: "references",
      kind: "references",
      label: "Referensobjekt",
      href: "/referenser/",
      summary: "Egen sida för referensobjekt från dränering, pool, markarbete och större entreprenaduppdrag.",
    },
    {
      id: "contact",
      kind: "contact",
      label: "Kontakt",
      href: "/kontakt/",
      summary: "Egen kontaktsida för offertförfrågningar, platsbesök och nästa steg.",
    },
  ],
  hero: {
    eyebrow: "Mark & anläggning i Örebro",
    title: "Svärd Entreprenad",
    intro:
      "En statisk AlvaLinus-replik av den inventerade entreprenadytan: tjänster, arbetsprocess, trygghetssignaler, referenser, samarbetspartners och offertkontakt med korrekt svensk text.",
    primaryAction: {
      label: "Våra tjänster",
      href: "/tjanster/",
    },
    secondaryAction: {
      label: "Kontakta oss för offert",
      href: "/kontakt/",
    },
    stats: [
      { value: "58", label: "inventerade sitemap-URL:er" },
      { value: "9", label: "huvudtjänster på startsidan" },
      { value: "100%", label: "nöjd-kund-garanti som trust-signal" },
    ],
  },
  services: [
    {
      id: "stensattning",
      title: "Stensättning",
      summary:
        "Planerade stenytor, marksten och murar för entréer, gångar och gårdar där finish och bärighet behöver hålla över tid.",
      href: "/stensattning/",
      sourceHref: "https://www.erikssonsvard.se/stensattning/",
      tags: ["Marksten Örebro", "Stenmurar", "Finplanering"],
    },
    {
      id: "markarbete",
      title: "Markarbete",
      summary:
        "Bredden i mark och anläggning samlad i ett erbjudande för privatpersoner, företag och kommunala projekt.",
      href: "/markarbete/",
      sourceHref: "https://www.erikssonsvard.se/markarbete/",
      tags: ["Schakt", "Tomt", "Anläggning"],
    },
    {
      id: "gravjobb",
      title: "Grävjobb",
      summary:
        "Maskin- och grävarbeten för husgrunder, avlopp, VA och tomter där rätt förarbete avgör slutresultatet.",
      href: "/gravjobb/",
      sourceHref: "https://www.erikssonsvard.se/gravjobb/",
      tags: ["Grävning", "Husgrund", "VA"],
    },
    {
      id: "dranering",
      title: "Dränering",
      summary:
        "Dräneringar och fuktsäkra markarbeten runt hus, murar och tomter med ansvar för hela arbetskedjan.",
      href: "/dranering/",
      sourceHref: "https://www.erikssonsvard.se/dranering/",
      tags: ["Dränering", "Mur", "Fuktskydd"],
    },
    {
      id: "pool",
      title: "Pool",
      summary:
        "Poolprojekt från markarbete till installation, inklusive glasfiberpool, thermopool och MAGIclassic-spår.",
      href: "/pool/",
      sourceHref: "https://www.erikssonsvard.se/pool/",
      tags: ["Glasfiberpool", "Thermopool", "MAGIclassic"],
    },
    {
      id: "tradgard",
      title: "Trädgårdsplanering",
      summary:
        "Tomt- och trädgårdsplanering som binder ihop höjder, ytor, planteringar och praktisk användning.",
      href: "/tradgardsplanering/",
      sourceHref: "https://www.erikssonsvard.se/tradgardsplanering/",
      tags: ["Tomtplanering", "Utemiljö", "Finish"],
    },
  ],
  process: [
    {
      title: "Första kontakt",
      summary: "Behov, plats och tidsbild samlas in så rätt kompetens kan kopplas på från start.",
    },
    {
      title: "Genomgång",
      summary: "Projektet gås igenom på plats med förutsättningar, ansvar och offertunderlag.",
    },
    {
      title: "Utförande",
      summary: "Certifierade team genomför mark-, bygg- eller anläggningsarbetet med löpande avstämning.",
    },
    {
      title: "Slutfört arbete",
      summary: "Arbetet lämnas över med fokus på kvalitet, miljö och en nöjd kund.",
    },
  ],
  trust: [
    {
      title: "Allt inom mark & anläggning",
      summary:
        "Husgrunder, stensättning, stenmurar, pooler, enskilt avlopp, VA, dräneringar och relaterade markjobb samlas under samma kompetens.",
    },
    {
      title: "100% nöjd-kund-garanti",
      summary:
        "Startsidan lyfter garantin som ett tydligt löfte om att arbetet ska avslutas först när kunden är nöjd.",
    },
    {
      title: "Mångårig erfarenhet",
      summary:
        "Teamen beskrivs som certifierade och erfarna, med bred kompetens som används för att hålla hög standard i varje uppdrag.",
    },
  ],
  references: [
    {
      title: "Boman Svahn ÖBO",
      category: "Referensobjekt",
      href: "/referenser/",
      sourceHref: "https://www.erikssonsvard.se/boman-svahn-obo/",
    },
    {
      title: "Byggpart Örebro",
      category: "Referensobjekt",
      href: "/referenser/",
      sourceHref: "https://www.erikssonsvard.se/byggpart-orebro/",
    },
    {
      title: "Dränering av mur",
      category: "Dränering",
      href: "/referenser/",
      sourceHref: "https://www.erikssonsvard.se/dranering-av-mur-hackgravning/",
    },
    {
      title: "Pool Gällersta Örebro",
      category: "Pool",
      href: "/referenser/",
      sourceHref: "https://www.erikssonsvard.se/pool-gallersta-orebro/",
    },
  ],
  partners: [
    { name: "UC Brons", kind: "Utmärkelse" },
    { name: "Benders", kind: "Samarbetspartner" },
    { name: "Ahlsell", kind: "Samarbetspartner" },
    { name: "SGC Installatör", kind: "Certifiering" },
    { name: "NCC", kind: "Partner/referens" },
    { name: "Wasa Kredit", kind: "Finansiering" },
  ],
  contact: {
    title: "Kontakta oss för offert",
    summary:
      "Den inventerade startsidan avslutar med en tydlig offertväg. Den här statiska ytan gör samma kontaktsteg synligt utan att bygga ett formulär eller backendflöde.",
    offertLabel: "Boka ett kostnadsfritt besök eller be om offert",
    items: [
      { label: "Kontaktsida", value: "Gå till kontakt", href: "/kontakt/" },
      { label: "Källa", value: "Eriksson & Svärd", href: "https://www.erikssonsvard.se/kontakt/" },
    ],
  },
} satisfies SiteContent;
