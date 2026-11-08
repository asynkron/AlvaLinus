import type { SiteContent } from "../types/site";

export const siteContent = {
  inventory: {
    eyebrow: "Tjänsteöversikt",
    heading: "Tydliga vägar för rätt uppdrag",
    helper: "Hitta snabbt till företagets viktigaste information, tjänster och offertkontakt.",
    checkedAt: "2026-06-16T10:05:00Z",
    source: "Current route inventory and owner-approved service structure",
    pageCount: 58,
    routeDecision:
      "Mark, schakt, dränering, grundläggning och tomtplanering – vi hjälper dig hela vägen från första kontakt till färdigt resultat. Använd genvägarna för att hitta rätt tjänst eller begära en offert.",
    primaryRoutes: [
      { label: "Offertberäkning", href: "/offertberakning/" },
      { label: "Hem", href: "/" },
      { label: "Tjänster", href: "/tjanster/" },
      { label: "Om oss", href: "/om-oss/" },
      { label: "Dränering", href: "/dranering/" },
      { label: "Kontakt", href: "/kontakt/" },
    ],
  },
  routes: [
    {
      id: "quote", kind: "quote", label: "Offertberäkning", href: "/offertberakning/",
      heroPhotoAssetPath: "/page-visuals/quote-hero.webp",
      summary: "Välj kalkyl för husdränering eller uppfart och få en preliminär totalsumma att prata vidare om.",
      visual: { assetPath: "/page-visuals/svard-entreprenad-quote.svg", alt: "Måttsatt uppfart", intent: "Visar ytan som ligger till grund för kalkylen." },
    },
    {
      id: "drainage-quote", kind: "quote", label: "Dräneringsberäkning", href: "/draneringsberakning/",
      heroPhotoAssetPath: "/page-visuals/draneringsberakning-hero.webp",
      summary: "Preliminär dräneringskalkyl per löpmeter med direkt totalsumma och e-postförfrågan.",
      visual: {
        assetPath: "/page-visuals/svard-entreprenad-draneringsberakning.svg",
        alt: "Uppmätt dräneringslängd runt husgrund med schakt och rör",
        intent: "Visar löpmeterlängden som ligger till grund för dräneringskalkylen.",
      },
    },
    {
      id: "home",
      kind: "home",
      label: "Hem",
      href: "/",
      summary: "Startsida med översikt över tjänster, arbetsprocess och offertkontakt.",
      heroPhotoAssetPath: "/page-visuals/hero-photo.webp",
      visual: {
        assetPath: "/page-visuals/svard-entreprenad-home.svg",
        alt: "Entreprenadmaskin vid färdigplanerad tomt för Svärd Entreprenads startsida",
        intent: "Etablerar helhetsintrycket för mark- och anläggningsarbeten i Örebro.",
      },
    },
    {
      id: "services",
      kind: "services",
      label: "Tjänster",
      href: "/tjanster/",
      summary: "Samlad sida för de huvudsakliga mark-, bygg- och anläggningstjänsterna.",
      heroPhotoAssetPath: "/page-visuals/services-hero.webp",
      heroPhotoSrcSet:
        "/page-visuals/services-hero-640.webp 640w, /page-visuals/services-hero-960.webp 960w, /page-visuals/services-hero.webp 1672w",
      heroPhotoSizes: "100vw",
      visual: {
        assetPath: "/page-visuals/svard-entreprenad-services.svg",
        alt: "Samlad vy över markarbeten, stensättning och dräneringstjänster",
        intent: "Visar bredden i tjänsteutbudet utan att prioritera en enskild kategori.",
      },
    },
    {
      id: "inhyrning",
      kind: "inquiry",
      label: "Inhyrning",
      href: "/inhyrning/",
      summary: "Förfrågan för företag som söker inhyrd hjälp med F-skattad personal.",
      heroPhotoAssetPath: "/page-visuals/inhyrning-hero.svg",
      visual: {
        assetPath: "/page-visuals/svard-entreprenad-inhyrning.svg",
        alt: "Företagsförfrågan om inhyrd personal med uppdragsbeskrivning och timpris",
        intent: "Kopplar inhyrningssidan till företag som söker F-skattad hjälp med tydliga uppdragsuppgifter.",
      },
    },
    {
      id: "about",
      kind: "about",
      label: "Om oss",
      href: "/om-oss/",
      summary:
        "Läs om Svärd Entreprenads arbetssätt, erfarenhet och ansvar från första spadtag till färdigt resultat.",
      heroPhotoAssetPath: "/page-visuals/svard-entreprenad-about.svg",
      visual: {
        assetPath: "/page-visuals/svard-entreprenad-about.svg",
        alt: "Arbetslag som planerar ett markprojekt vid arbetsplatsen",
        intent: "Stärker berättelsen om ansvar, erfarenhet och tydlig arbetsprocess.",
      },
    },
    {
      id: "stensattning",
      kind: "service",
      sourceId: "stensattning",
      label: "Stensättning",
      href: "/stensattning/",
      summary: "Egen tjänstesida för stensättning, marksten och stenmurar.",
      heroPhotoAssetPath: "/page-visuals/stensattning-photo.webp",
      visual: {
        assetPath: "/page-visuals/svard-entreprenad-stensattning.svg",
        alt: "Stenmur längs en trädgård under anläggningsarbete",
        intent: "Lyfter precision, finish och hållbara stenytor för stensättningssidan.",
      },
    },
    {
      id: "markarbete",
      kind: "service",
      sourceId: "markarbete",
      label: "Markarbete",
      href: "/markarbete/",
      summary: "Egen tjänstesida för mark och anläggning.",
      heroPhotoAssetPath: "/page-visuals/markarbete-photo.webp",
      visual: {
        assetPath: "/page-visuals/svard-entreprenad-markarbete.svg",
        alt: "Planerad jordyta och stenlagd gång vid markarbete",
        intent: "Förankrar sidan i breda mark- och anläggningsarbeten från grund till yta.",
      },
    },
    {
      id: "gravjobb",
      kind: "service",
      sourceId: "gravjobb",
      label: "Grävjobb",
      href: "/gravjobb/",
      summary: "Egen tjänstesida för maskin- och grävarbeten, inklusive poolgrävning.",
      heroPhotoAssetPath: "/page-visuals/gravjobb-photo.webp",
      visual: {
        assetPath: "/page-visuals/svard-entreprenad-gravjobb.svg",
        alt: "Grävmaskin vid pågående markarbete intill en byggnad",
        intent: "Kommunicerar maskinkapacitet och korrekt förarbete för grävsidan.",
      },
    },
    {
      id: "dranering",
      kind: "service",
      sourceId: "dranering",
      label: "Dränering",
      href: "/dranering/",
      summary:
        "Toppsida för dränering med fuktsäkra markarbeten, schakt, återfyllnad och trygg hantering runt husgrund och mur.",
      heroPhotoAssetPath: "/page-visuals/dranering-photo.webp",
      visual: {
        assetPath: "/page-visuals/svard-entreprenad-dranering.svg",
        alt: "Dräneringsschakt intill husgrund med rör och återfyllnad",
        intent: "Gör fuktskydd, schakt och trygg grundhantering visuellt tydligt.",
      },
    },
    {
      id: "tradgard",
      kind: "service",
      sourceId: "tradgard",
      label: "Trädgårdsplanering",
      href: "/tradgardsplanering/",
      summary: "Egen tjänstesida för tomt- och trädgårdsplanering.",
      heroPhotoAssetPath: "/page-visuals/tradgard-generated.webp",
      visual: {
        assetPath: "/page-visuals/svard-entreprenad-tradgardsplanering.svg",
        alt: "Planerad trädgård med nivåer, gångar och färdiga utemiljöer",
        intent: "Visar hur tomtplanering binder ihop höjder, planteringar och användbara ytor.",
      },
    },
    {
      id: "contact",
      kind: "contact",
      label: "Kontakt",
      href: "/kontakt/",
      summary: "Egen kontaktsida för offertförfrågningar, platsbesök och nästa steg.",
      heroPhotoAssetPath: "/page-visuals/svard-entreprenad-contact.svg",
      visual: {
        assetPath: "/page-visuals/svard-entreprenad-contact.svg",
        alt: "Anteckningar och offertunderlag inför platsbesök för markprojekt",
        intent: "Sätter kontaktflödet i ett konkret offert- och platsbesökssammanhang.",
      },
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
      guidance:
        "Stensättning passar när entréer, gångar eller gårdar ska få stenytor, marksten eller murar med noggrant underarbete, rätt fall och fogar så finish och bärighet håller över tid.",
      photoSrc: "/page-visuals/stensattning-photo.webp",
      photoObjectPosition: "50% 55%",
      href: "/stensattning/",
      tags: ["Marksten Örebro", "Stenmurar", "Finplanering"],
    },
    {
      id: "markarbete",
      title: "Markarbete",
      summary:
        "Bredden i mark och anläggning samlad i ett erbjudande för privatpersoner, företag och kommunala projekt.",
      guidance:
        "Markarbete passar när uppdraget samlar flera delar av mark och anläggning, från schakt och tomtförberedelse till kompletterande anläggningsarbeten för privatpersoner, företag och större projekt.",
      photoSrc: "/page-visuals/markarbete-photo.webp",
      href: "/markarbete/",
      tags: ["Schakt", "Tomt", "Anläggning"],
    },
    {
      id: "gravjobb",
      title: "Grävjobb",
      summary:
        "Maskin- och grävarbeten för husgrunder, avlopp, VA, tomter och poolgrävning där rätt förarbete avgör slutresultatet.",
      guidance:
        "Grävjobb passar när arbetet kräver maskin och schakt, till exempel husgrunder, avlopp och VA, tomter eller poolgrävning, och förarbetet behöver göras rätt direkt på plats.",
      photoSrc: "/page-visuals/gravjobb-photo.webp",
      photoObjectPosition: "50% 55%",
      href: "/gravjobb/",
      tags: ["Grävning", "Husgrund", "Poolgrävning"],
    },
    {
      id: "dranering",
      title: "Dränering",
      summary:
        "Dräneringar och fuktsäkra markarbeten runt hus, murar och tomter med ansvar för hela arbetskedjan.",
      detail:
        "Dräneringssidan är en egen toppnivå för besökare som behöver fuktsäkring runt husgrund, mur eller källarvägg. Innehållet lyfter helheten från bedömning och grävning till återställning.",
      guidance:
        "Dränering passar när fukt hotar husgrund, murar eller tomtytor och hela arbetskedjan från bedömning och grävning till återställning ska tas om hand av samma utförare.",
      photoSrc: "/page-visuals/dranering-photo.webp",
      href: "/dranering/",
      tags: ["Dränering", "Mur", "Fuktskydd"],
      quoteCalculator: {
        href: "/draneringsberakning/",
        eyebrow: "Kostnadsberäkning",
        heading: "Räkna på din dränering",
        description:
          "Ange dräneringens längd i löpmeter och få direkt en preliminär totalsumma.",
        cta: "Öppna dräneringsberäkningen",
      },
    },
    {
      id: "tradgard",
      title: "Trädgårdsplanering",
      summary:
        "Tomt- och trädgårdsplanering som binder ihop höjder, ytor, planteringar och praktisk användning.",
      guidance:
        "Trädgårdsplanering passar när tomten behöver en helhet där höjder, ytor, planteringar och praktisk användning planeras ihop innan markarbetet sätts.",
      photoSrc: "/page-visuals/tradgard-generated.webp",
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
  sectionHeadings: {
    services: {
      eyebrow: "Våra tjänster",
      title: "En pålitlig partner inom mark, bygg och anläggning",
      summary:
        "Svärd Entreprenad hjälper privatpersoner, företag och fastighetsägare med markarbeten, dränering, grundläggning, stenläggning och andra anläggningsuppdrag.",
      readMoreLabel: "Läs mer",
      readMoreAriaPrefix: "Läs mer om",
    },
    process: {
      eyebrow: "Arbetsprocess",
      title: "Från första kontakt till slutfört arbete",
      summary:
        "Varje uppdrag drivs med tydlig dialog, planering på plats och noggrant utförande hela vägen till färdigt resultat.",
    },
    trust: {
      eyebrow: "Varför välja oss",
      title: "Därför väljer kunder oss",
      summary: "Garantier, certifieringar och bred erfarenhet ligger bakom varje uppdrag vi tar oss an.",
    },
    partners: {
      eyebrow: "Samarbetspartner",
      title: "Samarbetspartner",
      summary:
        "Partnerfältet är uppdaterat enligt ägarens önskemål och visar endast aktuell samarbetspartner.",
    },
  },
  contact: {
    title: "Kontakta oss för offert",
    summary: "Skicka en förfrågan om ditt projekt så återkommer Svärd Entreprenad med nästa steg.",
    offertLabel: "Boka ett kostnadsfritt besök eller be om offert",
    form: {
      ariaLabel: "Offertförfrågan via e-post",
      recipientEmail: "kontakt@svardentreprenad.se",
      subject: "Offertförfrågan från alvalinus.se",
      submitLabel: "Skicka offertförfrågan",
      handoffNote:
        "Din förfrågan öppnas i ditt eget e-postprogram för granskning och utskick. Webbplatsen kan inte bekräfta att meddelandet har levererats. Fungerar inte överlämningen når du oss direkt på",
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
  quote: {
    shared: {
      formAriaLabel: "Projektets förutsättningar",
      resultAriaLabel: "Din beräkning",
      resultHeading: "Din kostnadsbild",
      resultCaption: "Preliminärt underlag",
      totalLabel: "Beräknad totalsumma",
      disclaimer:
        "Detta är en uppskattning, inte en bindande offert. Markförhållanden, åtkomst och omfattning bedöms innan slutpris lämnas. Eventuellt ROT-avdrag och betalningsvillkor specificeras i den verkliga offerten.",
      sendLabel: "Begär offert på underlaget",
      sendInvalidLabel: "Kontrollera dina uppgifter",
      mailHelp: "Öppnar ditt e-postprogram. Inget skickas automatiskt.",
      printLabel: "Skriv ut / spara som PDF",
    },
    uppfart: {
      breadcrumbLabel: "Offertberäkning",
      heading: "Räkna på ditt projekt",
      intro: "Välj vad du vill ha hjälp med för att få en preliminär kostnadsbild.",
      choiceHeading: "Vad gäller din offertförfrågan?",
      choiceSummary: "Välj vilken kalkyl du vill använda.",
      drainageChoiceLabel: "Räkna på husdränering",
      drivewayChoiceLabel: "Räkna på uppfart",
      backLinkLabel: "← Välj annan kalkyl",
      workHeading: "Uppfart",
      workSummary: "Asfalterad uppfart med markarbete och transport.",
      areaLabel: "Uppfartens yta",
      areaUnit: "m²",
      loadsLabel: "Antal lass",
      loadsUnit: "st",
      quantityHelp: "Ange en yta större än noll och ett helt antal lass.",
      asphaltLabel: "Inkludera asfalt",
      asphaltHelp: "Avmarkera för att bara beräkna markarbete.",
      asphaltYesLabel: "Ja",
      asphaltNoLabel: "Nej",
      notesLabel: "Om ditt projekt",
      notesOptionalLabel: "(valfritt)",
      notesPlaceholder: "Plats, nuvarande underlag och önskad tid för arbetet…",
      resetLabel: "Återställ exempel",
      error: "Ange en yta större än 0, ett helt antal lass och högst 100 000.",
      mail: {
        recipientEmail: "kontakt@svardentreprenad.se",
        subject: "Offertförfrågan – uppfart",
        bodyTemplate:
          "Hej! Jag önskar en offert för uppfart.\n\nYta: {area} m²\nAntal lass: {loads}\nAsfalt: {asphalt}\nPreliminär summa: {total} ({vat}).\nOmfattning behöver bekräftas.\n\nProjekt / plats / kontaktuppgifter:\n{notes}",
      },
    },
    drainage: {
      breadcrumbLabel: "Dräneringsberäkning",
      heading: "Vad kostar din dränering?",
      intro: "Fyll i längden runt huset och få ett preliminärt underlag att prata vidare om.",
      workHeading: "Husdränering",
      workSummary: "Dränering runt husgrund med schaktning, fuktskydd och återfyllning.",
      lengthLabel: "Dräneringens längd",
      lengthUnit: "löpmeter",
      lengthHelp: "Ange en längd större än noll.",
      includedHeading: "Det här ingår",
      includedParagraphs: [
        "Etablering och schaktning längs husgrund, dräneringsrör och dränerande material, fuktskydd, återfyllning och grovåterställning samt borttransport av överblivna massor.",
        "Exemplet utgår från normal åtkomst och markförhållanden. Eventuella tilläggsarbeten stäms av innan de utförs.",
      ],
      notesLabel: "Om ditt projekt",
      notesOptionalLabel: "(valfritt)",
      notesPlaceholder: "Plats, förutsättningar och önskad tid för arbetet…",
      resetLabel: "Återställ exempel",
      error: "Ange en längd större än 0 och högst 100 000 meter.",
      drivewayCrossLinkQuestion: "Ska du istället bygga en uppfart?",
      drivewayCrossLinkLabel: "Räkna på uppfart",
      mail: {
        recipientEmail: "kontakt@svardentreprenad.se",
        subject: "Offertförfrågan – husdränering",
        bodyTemplate:
          "Hej! Jag önskar en offert för husdränering.\n\nLängd: {length} löpmeter\nPreliminär summa: {total} ({vat}).\nOmfattning behöver bekräftas.\n\nProjekt / plats / kontaktuppgifter:\n{notes}",
      },
    },
  },
  inquiry: {
    breadcrumbLabel: "Inhyrning",
    heading: "Söker ni en F-skattare?",
    intro: "Berätta om ert företag och uppdrag, så får vi ett bra underlag för att återkomma till er.",
    formHeading: "Skicka en förfrågan",
    formNote: "Fyll i uppgifterna nedan. Alla fält är obligatoriska om inget annat anges.",
    formAriaLabel: "Förfrågan om inhyrning",
    errorSummary: "Formuläret kan inte skickas än. Kontrollera fälten med felmeddelanden nedan och försök igen.",
    submitLabel: "Skicka förfrågan",
    mailHelpTemplate:
      "Öppnar ett utkast i ditt e-postprogram till {recipient}. Inget skickas automatiskt – ni skickar mejlet själva.",
    confirmationTemplate:
      "Webbplatsen har bett ditt e-postprogram öppna ett utkast till {recipient} med uppgifterna ifyllda. Granska utkastet och skicka mejlet själv – webbplatsen kan inte skicka eller bekräfta att mejlet har levererats.",
    reopenPrompt: "Öppnas inte ditt e-postprogram?",
    reopenLinkLabel: "Öppna utkastet igen",
    asideAriaLabel: "Bra att veta inför förfrågan",
    asideHeading: "En tydlig start",
    asideSummary:
      "Med information om företaget, uppdraget och tidsperioden kan vi ta ställning till förfrågan och kontakta er för en genomgång.",
    asideItems: [
      "Beskriv vilken hjälp ni behöver",
      "Ange erbjudet timpris och tidsperiod",
      "Lämna kontaktuppgifter så vi kan återkomma",
    ],
    optionalMark: "(valfritt)",
    fields: {
      company: { label: "Företagets namn", placeholder: "Företagets namn" },
      person: { label: "Kontaktperson", placeholder: "För- och efternamn" },
      email: { label: "E-post", placeholder: "namn@foretag.se" },
      phone: { label: "Telefon", placeholder: "Telefonnummer" },
      org: { label: "Organisationsnummer", placeholder: "Organisationsnummer" },
      work: {
        label: "Vad behöver ni inhyrd hjälp med?",
        placeholder: "Till exempel grävmaskinist eller markarbete",
      },
      rate: {
        label: "Erbjudet timpris",
        placeholder: "Belopp i kr per timme",
        hint: "Ange gärna i beskrivningen om priset är inklusive eller exklusive moms.",
      },
      duration: {
        label: "Hur länge gäller uppdraget?",
        placeholder: "Till exempel 3 veckor eller april–juni",
      },
      description: {
        label: "Beskriv ärendet",
        placeholder: "Beskriv uppdraget, platsen och övrigt som är bra för oss att veta.",
      },
    },
    validation: {
      companyRequired: "Ange företagets namn.",
      personRequired: "Ange en kontaktperson.",
      emailRequired: "Ange en e-postadress så att vi kan återkomma till er.",
      emailInvalid: "Ange en giltig e-postadress, till exempel namn@foretag.se.",
      workRequired: "Beskriv vad ni behöver inhyrd hjälp med.",
      rateRequired: "Ange erbjudet timpris som ett belopp i kronor.",
      rateNotAmount: "Timpriset ska vara ett belopp i kronor, till exempel 650.",
      rateNegative: "Timpriset kan inte vara ett negativt belopp.",
      durationRequired: "Ange hur länge uppdraget gäller.",
      descriptionRequired: "Beskriv ärendet.",
    },
    mail: {
      subject: "Förfrågan om inhyrning",
      emptyValue: "–",
      bodyTemplate:
        "Förfrågan om inhyrning via webbplatsen.\n\nFöretag: {company}\nKontaktperson: {person}\nE-post: {email}\nTelefon: {phone}\nOrganisationsnummer: {org}\nBehov av inhyrning: {work}\nErbjudet timpris: {rate} kr/timme\nUppdragets längd: {duration}\nBeskriv ärendet:\n{description}",
    },
  },
  chrome: {
    brand: {
      name: "Svärd Entreprenad",
      logoSrc: "/svard-entreprenad-logo.svg",
    },
    skipLinkLabel: "Hoppa till innehåll",
    navAriaLabel: "Huvudnavigation",
    mobileNavAriaLabel: "Mobilnavigation",
    menuOpenLabel: "Öppna meny",
    menuCloseLabel: "Stäng meny",
    emptyStateTitle: "Inget innehåll ännu",
    emptyStateMessage: "Lägg till statiska dataposter i src/data.",
    quoteFallback: "Laddar offertberäkningen…",
    inquiryFallback: "Laddar förfrågan om inhyrning…",
    breadcrumb: {
      ariaLabel: "Brödsmulor",
      homeLabel: "Hem",
    },
    contactBand: {
      eyebrow: "Nästa steg",
      ctaLabel: "Kontakta oss",
    },
    calcMenu: {
      label: "Kalkyler",
      links: [
        { label: "Dränering", href: "/draneringsberakning/" },
        { label: "Uppfart", href: "/offertberakning/#uppfart" },
      ],
    },
    footer: {
      tagline: "Din lokala partner för mark, schakt, dränering och anläggning.",
      pageHeading: "Sidor",
      servicesHeading: "Tjänster",
      contactHeading: "Kontakt",
      pageNavAriaLabel: "Sidfotsnavigation",
      servicesNavAriaLabel: "Tjänster",
    },
    notFound: {
      title: "Sidan finns inte",
      eyebrow: "Okänd sida",
      summaryTemplate:
        "{path} matchar ingen aktuell sida. Välj en av genvägarna nedan för att komma vidare.",
      shortcutsLabel: "Genvägar",
    },
    service: {
      heroEyebrow: "Tjänst",
      guidanceHeading: "När tjänsten passar",
    },
  },
} satisfies SiteContent;
