import { siteContent } from "../data/siteContent";
import type { SiteContent } from "../types/site";

export async function loadSiteContent(): Promise<SiteContent> {
  return siteContent;
}
