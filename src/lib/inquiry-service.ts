import type { SiteContent } from "../types/site";

export const INQUIRY_SERVICE_PARAM = "tjanst";
export const CONTACT_ROUTE = "/kontakt/";

export function inquiryContactHref(serviceId: string): string {
  return `${CONTACT_ROUTE}?${new URLSearchParams({ [INQUIRY_SERVICE_PARAM]: serviceId }).toString()}`;
}

export function readInquiryServiceParam(search: string): string | undefined {
  const value = new URLSearchParams(search).get(INQUIRY_SERVICE_PARAM);

  return value === null ? undefined : value;
}

export function resolveInquiryServiceOption(
  content: SiteContent,
  serviceId: string | undefined,
): string | undefined {
  if (!serviceId) {
    return undefined;
  }

  const service = content.services.find((item) => item.id === serviceId);

  if (!service) {
    return undefined;
  }

  return content.contact.form.serviceField.options.find((option) => option === service.title);
}
