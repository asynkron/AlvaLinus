export type SiteLink = {
  readonly label: string;
  readonly href: string;
};

export type SiteRouteKind = "home" | "services" | "about" | "service" | "contact";

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
  readonly visual: SiteRouteVisual;
};

export type SiteStat = {
  readonly label: string;
  readonly value: string;
};

export type ServiceArea = {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly href: string;
  readonly tags: readonly string[];
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
  readonly nameField: ContactTextField;
  readonly customerTypeField: ContactSelectField;
  readonly serviceField: ContactSelectField;
  readonly messageField: ContactTextField & {
    readonly rows: number;
  };
};

export type SiteContent = {
  readonly inventory: {
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
  readonly contact: {
    readonly title: string;
    readonly summary: string;
    readonly offertLabel: string;
    readonly form: ContactForm;
    readonly items: readonly ContactItem[];
  };
};
