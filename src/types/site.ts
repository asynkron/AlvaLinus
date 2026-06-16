export type SiteLink = {
  readonly label: string;
  readonly href: string;
};

export type SiteRouteKind = "home" | "services" | "service" | "references" | "contact";

export type SiteRoute = SiteLink & {
  readonly id: string;
  readonly kind: SiteRouteKind;
  readonly sourceId?: string;
  readonly summary: string;
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
  readonly sourceHref: string;
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

export type ReferenceItem = {
  readonly title: string;
  readonly category: string;
  readonly href: string;
  readonly sourceHref: string;
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
  readonly services: readonly ServiceArea[];
  readonly process: readonly ProcessStep[];
  readonly trust: readonly TrustSignal[];
  readonly references: readonly ReferenceItem[];
  readonly partners: readonly PartnerItem[];
  readonly contact: {
    readonly title: string;
    readonly summary: string;
    readonly offertLabel: string;
    readonly items: readonly ContactItem[];
  };
};
