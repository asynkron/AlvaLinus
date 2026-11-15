import {
  buildDrainageShareSearch,
  buildDrivewayShareSearch,
  buildQuoteShareHref,
  quoteShareParams,
  readDrainageShareValue,
  readDrivewayShareValues,
} from "./quote-share";

describe("quote-share lib URL encoding", () => {
  it("declares the fixed Swedish URL parameter names", () => {
    expect(quoteShareParams).toEqual({ area: "yta", loads: "lass", asphalt: "asfalt", length: "langd" });
  });

  it("builds driveway search params for area, loads and the asphalt choice", () => {
    expect(buildDrivewayShareSearch({ area: "50", loads: "2", includeAsphalt: true })).toBe("?yta=50&lass=2&asfalt=1");
    expect(buildDrivewayShareSearch({ area: "50", loads: "2", includeAsphalt: false })).toBe("?yta=50&lass=2&asfalt=0");
  });

  it("builds the drainage search param from the entered length", () => {
    expect(buildDrainageShareSearch("62.5")).toBe("?langd=62.5");
  });

  it("reads driveway share values and leaves missing params undefined", () => {
    expect(readDrivewayShareValues("")).toEqual({});
    expect(readDrivewayShareValues("?yta=50&lass=2&asfalt=0")).toEqual({ area: "50", loads: "2", asphalt: false });
    expect(readDrivewayShareValues("?yta=50&lass=2&asfalt=1")).toEqual({ area: "50", loads: "2", asphalt: true });
  });

  it("reads the drainage length only when present", () => {
    expect(readDrainageShareValue("?langd=62.5")).toBe("62.5");
    expect(readDrainageShareValue("")).toBeUndefined();
  });

  it("builds an absolute share href from the current page location", () => {
    expect(buildQuoteShareHref("?yta=50", "#uppfart")).toBe(`${window.location.origin}${window.location.pathname}?yta=50#uppfart`);
    expect(buildQuoteShareHref("?langd=40")).toBe(`${window.location.origin}${window.location.pathname}?langd=40`);
  });
});
