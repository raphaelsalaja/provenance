const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://raphaelsalaja.com/provenance";

export const siteUrl = new URL(
  configuredSiteUrl.endsWith("/") ? configuredSiteUrl : `${configuredSiteUrl}/`,
);
