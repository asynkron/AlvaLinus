export const quoteShareParams = {
  area: "yta",
  loads: "lass",
  asphalt: "asfalt",
  length: "langd",
} as const;

export type DrivewayShareValues = {
  readonly area?: string;
  readonly loads?: string;
  readonly asphalt?: boolean;
};

export function buildDrivewayShareSearch(values: { readonly area: string; readonly loads: string; readonly includeAsphalt: boolean }): string {
  const params = new URLSearchParams({
    [quoteShareParams.area]: values.area,
    [quoteShareParams.loads]: values.loads,
    [quoteShareParams.asphalt]: values.includeAsphalt ? "1" : "0",
  });

  return `?${params.toString()}`;
}

export function buildDrainageShareSearch(length: string): string {
  return `?${new URLSearchParams({ [quoteShareParams.length]: length }).toString()}`;
}

export function readDrivewayShareValues(search: string): DrivewayShareValues {
  const params = new URLSearchParams(search);
  const asphalt = params.get(quoteShareParams.asphalt);

  return {
    area: params.get(quoteShareParams.area) ?? undefined,
    loads: params.get(quoteShareParams.loads) ?? undefined,
    asphalt: asphalt === null ? undefined : asphalt !== "0",
  };
}

export function readDrainageShareValue(search: string): string | undefined {
  return new URLSearchParams(search).get(quoteShareParams.length) ?? undefined;
}

export function buildQuoteShareHref(search: string, hash = ""): string {
  return `${window.location.origin}${window.location.pathname}${search}${hash}`;
}
