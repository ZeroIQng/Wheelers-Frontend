const LOCALHOST_FALLBACK = "http://localhost:3000";

function normalizeSiteUrl(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return LOCALHOST_FALLBACK;
  }

  const withProtocol =
    trimmed.startsWith("http://") || trimmed.startsWith("https://")
      ? trimmed
      : `https://${trimmed}`;

  return withProtocol.replace(/\/+$/, "");
}

export function getSiteUrl() {
  const explicitSiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;

  if (explicitSiteUrl) {
    return normalizeSiteUrl(explicitSiteUrl);
  }

  if (process.env.VERCEL_URL) {
    return normalizeSiteUrl(process.env.VERCEL_URL);
  }

  return LOCALHOST_FALLBACK;
}
