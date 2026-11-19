import {
  buildDrainageShareSearch,
  buildDrivewayShareSearch,
  buildQuoteShareHref,
  quoteShareParams,
  readDrainageShareValues,
  readDrivewayShareValues,
} from "./quote-share";

describe("quote-share lib URL encoding", () => {
  it("declares the fixed Swedish URL parameter names", () => {
    expect(quoteShareParams).toEqual({ area: "yta", asphalt: "asfalt", length: "langd", notes: "anteckning", vat: "moms" });
  });

  it("builds driveway search params for area and the asphalt choice", () => {
    expect(buildDrivewayShareSearch({ area: "50", includeAsphalt: true, notes: "" })).toBe("?yta=50&asfalt=1");
    expect(buildDrivewayShareSearch({ area: "50", includeAsphalt: false, notes: "" })).toBe("?yta=50&asfalt=0");
  });

  it("carries a non-empty note in the driveway search params", () => {
    expect(buildDrivewayShareSearch({ area: "50", includeAsphalt: true, notes: "Villa i Örebro" })).toBe("?yta=50&asfalt=1&anteckning=Villa+i+%C3%96rebro");
  });

  it("builds the drainage search param from the entered length", () => {
    expect(buildDrainageShareSearch({ length: "62.5", notes: "" })).toBe("?langd=62.5");
  });

  it("carries a non-empty note in the drainage search params", () => {
    expect(buildDrainageShareSearch({ length: "62.5", notes: "Grundvatten" })).toBe("?langd=62.5&anteckning=Grundvatten");
  });

  it("reads driveway share values and leaves missing params undefined", () => {
    expect(readDrivewayShareValues("")).toEqual({});
    expect(readDrivewayShareValues("?yta=50&asfalt=0")).toEqual({ area: "50", asphalt: false });
    expect(readDrivewayShareValues("?yta=50&asfalt=1&anteckning=Villa+i+%C3%96rebro")).toEqual({ area: "50", asphalt: true, notes: "Villa i Örebro" });
  });

  it("reads the drainage length only when present", () => {
    expect(readDrainageShareValues("?langd=62.5")).toEqual({ length: "62.5" });
    expect(readDrainageShareValues("")).toEqual({});
  });

  it("reads the shared note only when present", () => {
    expect(readDrainageShareValues("?langd=62.5&anteckning=Grundvatten")).toEqual({ length: "62.5", notes: "Grundvatten" });
    expect(readDrainageShareValues("?langd=62.5")).toEqual({ length: "62.5" });
  });

  it("round-trips long and special-character notes through the search encoding", () => {
    const note = "Villa i Örebro\n&= ?100% #hash — " + "x".repeat(1500);
    const driveway = readDrivewayShareValues(buildDrivewayShareSearch({ area: "50", includeAsphalt: true, notes: note }));
    const drainage = readDrainageShareValues(buildDrainageShareSearch({ length: "40", notes: note }));

    expect(driveway.notes).toBe(note);
    expect(drainage.notes).toBe(note);
  });

  it("builds an absolute share href from the current page location", () => {
    expect(buildQuoteShareHref("?yta=50", "#uppfart")).toBe(`${window.location.origin}${window.location.pathname}?yta=50#uppfart`);
    expect(buildQuoteShareHref("?langd=40")).toBe(`${window.location.origin}${window.location.pathname}?langd=40`);
  });
});
