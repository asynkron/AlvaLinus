import type { SiteContent } from "../types/site";

export const siteContent = {
  inventory: {
    checkedAt: "2026-06-16T10:05:00Z",
    source: "Current route inventory and owner-approved service structure",
    pageCount: 58,
    routeDecision:
      "Den publika strukturen är uppdaterad efter ägarens önskemål: Hem, Tjänster, Om oss, Dränering och Kontakt är primära vägar. Pool och referensjobb är borttagna som egna ytor.",
    primaryRoutes: [
      { label: "Hem", href: "/" },
      { label: "Tjänster", href: "/tjanster/" },
      { label: "Om oss", href: "/om-oss/" },
      { label: "Dränering", href: "/dranering/" },
      { label: "Kontakt", href: "/kontakt/" },
    ],
  },
  routes: [
    {
      id: "home",
      kind: "home",
      label: "Hem",
      href: "/",
      summary: "Startsida med översikt över tjänster, arbetsprocess och offertkontakt.",
    },
    {
      id: "services",
      kind: "services",
      label: "Tjänster",
      href: "/tjanster/",
      summary: "Samlad sida för de huvudsakliga mark-, bygg- och anläggningstjänsterna.",
    },
    {
      id: "about",
      kind: "about",
      label: "Om oss",
      href: "/om-oss/",
      summary:
        "Läs om Svärd Entreprenads arbetssätt, erfarenhet och ansvar från första spadtag till färdigt resultat.",
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
      summary: "Egen tjänstesida för maskin- och grävarbeten, inklusive poolgrävning.",
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
      id: "tradgard",
      kind: "service",
      sourceId: "tradgard",
      label: "Trädgårdsplanering",
      href: "/tradgardsplanering/",
      summary: "Egen tjänstesida för tomt- och trädgårdsplanering.",
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
      "Välkommen till Svärd Entreprenad\n\nVi erbjuder professionella mark- och anläggningsarbeten för privatpersoner, företag och fastighetsägare. Med fokus på kvalitet, noggrannhet och pålitlighet levererar vi hållbara lösningar inom schaktning, dränering, VA-arbeten, grundläggning och tomtplanering.\n\nDin trygga partner från första spadtag till färdigt resultat.",
    primaryAction: {
      label: "Våra tjänster",
      href: "/tjanster/",
    },
    secondaryAction: {
      label: "Kontakta oss för offert",
      href: "/kontakt/",
    },
    stats: [
      { value: "Kvalitet", label: "noggrant utförda markarbeten" },
      { value: "Trygghet", label: "tydliga överenskommelser och ansvar" },
      { value: "Hållbart", label: "lösningar som håller över tid" },
    ],
  },
  about: {
    title: "Om oss",
    summary:
      "På Svärd Entreprenad brinner vi för att skapa hållbara och välutförda mark- och anläggningsarbeten.",
    body: [
      "På Svärd Entreprenad brinner vi för att skapa hållbara och välutförda mark- och anläggningsarbeten. Med erfarenhet, kompetens och ett stort engagemang hjälper vi privatpersoner, företag och fastighetsägare att genomföra projekt av alla storlekar.",
      "Vi erbjuder tjänster inom markarbeten, schaktning, dränering, VA-arbeten, grundläggning, tomtplanering, stenläggning och övriga anläggningsarbeten. Oavsett om det handlar om att förbereda marken för ett nybygge, anlägga en uppfart eller genomföra större entreprenader arbetar vi alltid med samma mål – att leverera ett resultat som håller över tid.",
      "För oss är kvalitet, noggrannhet och pålitlighet självklara delar av varje uppdrag. Vi tror på god kommunikation, tydliga överenskommelser och ett professionellt bemötande genom hela projektet. Genom att kombinera modern utrustning med gedigen yrkeskunskap kan vi erbjuda effektiva lösningar anpassade efter varje kunds behov.",
      "När du väljer Svärd Entreprenad får du en trygg samarbetspartner som tar ansvar från första spadtag till färdigt resultat.",
    ],
  },
  services: [
    {
      id: "stensattning",
      title: "Stensättning",
      summary:
        "Planerade stenytor, marksten och murar för entréer, gångar och gårdar där finish och bärighet behöver hålla över tid.",
      href: "/stensattning/",
      tags: ["Marksten Örebro", "Stenmurar", "Finplanering"],
    },
    {
      id: "markarbete",
      title: "Markarbete",
      summary:
        "Bredden i mark och anläggning samlad i ett erbjudande för privatpersoner, företag och kommunala projekt.",
      href: "/markarbete/",
      tags: ["Schakt", "Tomt", "Anläggning"],
    },
    {
      id: "gravjobb",
      title: "Grävjobb",
      summary:
        "Maskin- och grävarbeten för husgrunder, avlopp, VA, tomter och poolgrävning där rätt förarbete avgör slutresultatet.",
      href: "/gravjobb/",
      tags: ["Grävning", "Husgrund", "Poolgrävning"],
    },
    {
      id: "dranering",
      title: "Dränering",
      summary:
        "Dräneringar och fuktsäkra markarbeten runt hus, murar och tomter med ansvar för hela arbetskedjan.",
      href: "/dranering/",
      tags: ["Dränering", "Mur", "Fuktskydd"],
    },
    {
      id: "tradgard",
      title: "Trädgårdsplanering",
      summary:
        "Tomt- och trädgårdsplanering som binder ihop höjder, ytor, planteringar och praktisk användning.",
      href: "/tradgardsplanering/",
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
        "Husgrunder, stensättning, stenmurar, enskilt avlopp, VA, dräneringar, poolgrävning och relaterade markjobb samlas under samma kompetens.",
    },
    {
      title: "Noggrant utförande",
      summary:
        "Kvalitet, noggrannhet och pålitlighet är självklara delar från första genomgång till färdigt resultat.",
    },
    {
      title: "Mångårig erfarenhet",
      summary:
        "Teamen beskrivs som certifierade och erfarna, med bred kompetens som används för att hålla hög standard i varje uppdrag.",
    },
  ],
  partners: [],
  contact: {
    title: "Kontakta oss för offert",
    summary: "Skicka en förfrågan om ditt projekt så återkommer Svärd Entreprenad med nästa steg.",
    offertLabel: "Boka ett kostnadsfritt besök eller be om offert",
    form: {
      ariaLabel: "Offertförfrågan via e-post",
      recipientEmail: "kontakt@svardentreprenad.se",
      subject: "Offertförfrågan från alvalinus.se",
      submitLabel: "Skicka offertförfrågan",
      nameField: {
        label: "Namn",
        name: "name",
        placeholder: "Ditt namn",
      },
      customerTypeField: {
        label: "Kundtyp",
        name: "customerType",
        options: ["Privatperson", "Företag", "BRF eller fastighetsägare"],
      },
      serviceField: {
        label: "Tjänst",
        name: "service",
        options: ["Stensättning", "Markarbete", "Grävjobb", "Dränering", "Trädgårdsplanering", "Annat"],
      },
      messageField: {
        label: "Meddelande",
        name: "message",
        placeholder: "Beskriv projektet, platsen och önskad tid.",
        rows: 5,
      },
    },
    items: [
      { label: "E-post", value: "kontakt@svardentreprenad.se", href: "mailto:kontakt@svardentreprenad.se" },
    ],
  },
} satisfies SiteContent;
