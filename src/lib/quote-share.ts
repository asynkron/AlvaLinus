export const quoteShareParams = {
  area: "yta",
  loads: "lass",
  asphalt: "asfalt",
  length: "langd",
  notes: "anteckning",
} as const;

export type DrivewayShareValues = {
  readonly area?: string;
  readonly loads?: string;
  readonly asphalt?: boolean;
  readonly notes?: string;
};

export type DrainageShareValues = {
  readonly length?: string;
  readonly notes?: string;
};

export function buildDrivewayShareSearch(values: { readonly area: string; readonly loads: string; readonly includeAsphalt: boolean; readonly notes: string }): string {
  const params = new URLSearchParams({
    [quoteShareParams.area]: values.area,
    [quoteShareParams.loads]: values.loads,
    [quoteShareParams.asphalt]: values.includeAsphalt ? "1" : "0",
  });

  if (values.notes !== "") params.append(quoteShareParams.notes, values.notes);

  return `?${params.toString()}`;
}

export function buildDrainageShareSearch(values: { readonly length: string; readonly notes: string }): string {
  const params = new URLSearchParams({ [quoteShareParams.length]: values.length });

  if (values.notes !== "") params.append(quoteShareParams.notes, values.notes);

  return `?${params.toString()}`;
}

export function readDrivewayShareValues(search: string): DrivewayShareValues {
  const params = new URLSearchParams(search);
  const asphalt = params.get(quoteShareParams.asphalt);

  return {
    area: params.get(quoteShareParams.area) ?? undefined,
    loads: params.get(quoteShareParams.loads) ?? undefined,
    asphalt: asphalt === null ? undefined : asphalt !== "0",
    notes: params.get(quoteShareParams.notes) ?? undefined,
  };
}

export function readDrainageShareValues(search: string): DrainageShareValues {
  const params = new URLSearchParams(search);

  return {
    length: params.get(quoteShareParams.length) ?? undefined,
    notes: params.get(quoteShareParams.notes) ?? undefined,
  };
}

export function buildQuoteShareHref(search: string, hash = ""): string {
  return `${window.location.origin}${window.location.pathname}${search}${hash}`;
}
