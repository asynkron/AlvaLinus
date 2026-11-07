export type SiteLink = {
  readonly label: string;
  readonly href: string;
};

export type SiteRouteKind = "home" | "services" | "about" | "service" | "contact" | "quote" | "inquiry";

export type SiteRouteVisual = {
  readonly assetPath: string;
  readonly alt: string;
  readonly intent: string;
};

export type SiteRoute = SiteLink & {
  readonly id: string;
  readonly kind: SiteRouteKind;
  readonly sourceId?: string;
  readonly summary: string;
  readonly heroPhotoAssetPath: string;
  readonly visual: SiteRouteVisual;
};

export type SiteStat = {
  readonly label: string;
  readonly value: string;
};

export type SiteSectionHeading = {
  readonly eyebrow: string;
  readonly title: string;
  readonly summary: string;
};

export type ServiceArea = {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly detail?: string;
  readonly guidance: string;
  readonly photoSrc?: string;
  readonly photoObjectPosition?: string;
  readonly href: string;
  readonly tags: readonly string[];
  readonly quoteCalculator?: ServiceQuoteCalculator;
};

export type ServiceQuoteCalculator = {
  readonly href: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly description: string;
  readonly cta: string;
};

export type ProcessStep = {
  readonly title: string;
  readonly summary: string;
};

export type TrustSignal = {
  readonly title: string;
  readonly summary: string;
};

export type PartnerItem = {
  readonly name: string;
  readonly kind: string;
};

export type ContactItem = {
  readonly label: string;
  readonly value: string;
  readonly href: string;
};

export type ContactSelectField = {
  readonly label: string;
  readonly name: string;
  readonly options: readonly string[];
};

export type ContactTextField = {
  readonly label: string;
  readonly name: string;
  readonly placeholder: string;
};

export type ContactForm = {
  readonly ariaLabel: string;
  readonly recipientEmail: string;
  readonly subject: string;
  readonly submitLabel: string;
  readonly handoffNote: string;
  readonly nameField: ContactTextField;
  readonly customerTypeField: ContactSelectField;
  readonly serviceField: ContactSelectField;
  readonly messageField: ContactTextField & {
    readonly rows: number;
  };
};

export type SiteQuoteMail = {
  readonly recipientEmail: string;
  readonly subject: string;
  readonly bodyTemplate: string;
};

export type SiteQuoteShared = {
  readonly formAriaLabel: string;
  readonly resultAriaLabel: string;
  readonly resultHeading: string;
  readonly resultCaption: string;
  readonly totalLabel: string;
  readonly disclaimer: string;
  readonly sendLabel: string;
  readonly sendInvalidLabel: string;
  readonly mailHelp: string;
  readonly printLabel: string;
};

export type SiteQuoteUppfart = {
  readonly breadcrumbLabel: string;
  readonly heading: string;
  readonly intro: string;
  readonly choiceHeading: string;
  readonly choiceSummary: string;
  readonly drainageChoiceLabel: string;
  readonly drivewayChoiceLabel: string;
  readonly backLinkLabel: string;
  readonly workHeading: string;
  readonly workSummary: string;
  readonly areaLabel: string;
  readonly areaUnit: string;
  readonly loadsLabel: string;
  readonly loadsUnit: string;
  readonly quantityHelp: string;
  readonly asphaltLabel: string;
  readonly asphaltHelp: string;
  readonly asphaltYesLabel: string;
  readonly asphaltNoLabel: string;
  readonly notesLabel: string;
  readonly notesOptionalLabel: string;
  readonly notesPlaceholder: string;
  readonly resetLabel: string;
  readonly error: string;
  readonly mail: SiteQuoteMail;
};

export type SiteQuoteDrainage = {
  readonly breadcrumbLabel: string;
  readonly heading: string;
  readonly intro: string;
  readonly workHeading: string;
  readonly workSummary: string;
  readonly lengthLabel: string;
  readonly lengthUnit: string;
  readonly lengthHelp: string;
  readonly includedHeading: string;
  readonly includedParagraphs: readonly string[];
  readonly notesLabel: string;
  readonly notesOptionalLabel: string;
  readonly notesPlaceholder: string;
  readonly resetLabel: string;
  readonly error: string;
  readonly drivewayCrossLinkQuestion: string;
  readonly drivewayCrossLinkLabel: string;
  readonly mail: SiteQuoteMail;
};

export type SiteQuote = {
  readonly shared: SiteQuoteShared;
  readonly uppfart: SiteQuoteUppfart;
  readonly drainage: SiteQuoteDrainage;
};

export type SiteInquiryFieldKey =
  | "company"
  | "person"
  | "email"
  | "phone"
  | "org"
  | "work"
  | "rate"
  | "duration"
  | "description";

export type SiteInquiryFieldText = {
  readonly label: string;
  readonly placeholder: string;
  readonly hint?: string;
};

export type SiteInquiryMail = {
  readonly subject: string;
  readonly emptyValue: string;
  readonly bodyTemplate: string;
};

export type SiteInquiry = {
  readonly breadcrumbLabel: string;
  readonly heading: string;
  readonly intro: string;
  readonly formHeading: string;
  readonly formNote: string;
  readonly formAriaLabel: string;
  readonly errorSummary: string;
  readonly submitLabel: string;
  readonly mailHelpTemplate: string;
  readonly confirmationTemplate: string;
  readonly reopenPrompt: string;
  readonly reopenLinkLabel: string;
  readonly asideAriaLabel: string;
  readonly asideHeading: string;
  readonly asideSummary: string;
  readonly asideItems: readonly string[];
  readonly optionalMark: string;
  readonly fields: Readonly<Record<SiteInquiryFieldKey, SiteInquiryFieldText>>;
  readonly validation: {
    readonly companyRequired: string;
    readonly personRequired: string;
    readonly emailRequired: string;
    readonly emailInvalid: string;
    readonly workRequired: string;
    readonly rateRequired: string;
    readonly rateNotAmount: string;
    readonly rateNegative: string;
    readonly durationRequired: string;
    readonly descriptionRequired: string;
  };
  readonly mail: SiteInquiryMail;
};

export type SiteBrand = {
  readonly name: string;
  readonly logoSrc: string;
};

export type SiteBreadcrumb = {
  readonly ariaLabel: string;
  readonly homeLabel: string;
};

export type SiteCalcMenu = {
  readonly label: string;
  readonly links: readonly SiteLink[];
};

export type SiteChrome = {
  readonly brand: SiteBrand;
  readonly skipLinkLabel: string;
  readonly navAriaLabel: string;
  readonly mobileNavAriaLabel: string;
  readonly menuOpenLabel: string;
  readonly menuCloseLabel: string;
  readonly emptyStateTitle: string;
  readonly emptyStateMessage: string;
  readonly quoteFallback: string;
  readonly inquiryFallback: string;
  readonly breadcrumb: SiteBreadcrumb;
  readonly contactBand: {
    readonly eyebrow: string;
    readonly ctaLabel: string;
  };
  readonly calcMenu: SiteCalcMenu;
  readonly footer: {
    readonly tagline: string;
    readonly pageHeading: string;
    readonly servicesHeading: string;
    readonly contactHeading: string;
    readonly pageNavAriaLabel: string;
    readonly servicesNavAriaLabel: string;
  };
  readonly notFound: {
    readonly title: string;
    readonly eyebrow: string;
    readonly summaryTemplate: string;
    readonly shortcutsLabel: string;
  };
  readonly service: {
    readonly heroEyebrow: string;
    readonly guidanceHeading: string;
  };
};

export type SiteContent = {
  readonly inventory: {
    readonly eyebrow: string;
    readonly heading: string;
    readonly helper: string;
    readonly checkedAt: string;
    readonly source: string;
    readonly pageCount: number;
    readonly routeDecision: string;
    readonly primaryRoutes: readonly SiteLink[];
  };
  readonly routes: readonly SiteRoute[];
  readonly hero: {
    readonly title: string;
    readonly eyebrow: string;
    readonly intro: string;
    readonly primaryAction: SiteLink;
    readonly secondaryAction: SiteLink;
    readonly stats: readonly SiteStat[];
  };
  readonly about: {
    readonly title: string;
    readonly summary: string;
    readonly body: readonly string[];
  };
  readonly services: readonly ServiceArea[];
  readonly process: readonly ProcessStep[];
  readonly trust: readonly TrustSignal[];
  readonly partners: readonly PartnerItem[];
  readonly sectionHeadings: {
    readonly services: SiteSectionHeading & {
      readonly readMoreLabel: string;
      readonly readMoreAriaPrefix: string;
    };
    readonly process: SiteSectionHeading;
    readonly trust: SiteSectionHeading;
    readonly partners: SiteSectionHeading;
  };
  readonly contact: {
    readonly title: string;
    readonly summary: string;
    readonly offertLabel: string;
    readonly form: ContactForm;
    readonly items: readonly ContactItem[];
  };
  readonly quote: SiteQuote;
  readonly inquiry: SiteInquiry;
  readonly chrome: SiteChrome;
};
