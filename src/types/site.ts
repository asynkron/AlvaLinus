export type SiteSection = {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
};

export type SiteLink = {
  readonly label: string;
  readonly href: string;
};

export type SiteContent = {
  readonly hero: {
    readonly title: string;
    readonly intro: string;
    readonly primaryAction: SiteLink;
    readonly secondaryAction: SiteLink;
  };
  readonly sections: readonly SiteSection[];
};
