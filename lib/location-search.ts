const DEFAULT_NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org";
const DEFAULT_SEARCH_LIMIT = 5;
const FALLBACK_REGION_SUFFIX = "Lagos, Nigeria";

type NominatimResult = {
  display_name?: unknown;
  name?: unknown;
  lat?: unknown;
  lon?: unknown;
};

export type LocationSearchResult = {
  label: string;
  latitude: number;
  longitude: number;
};

function getNominatimBaseUrl() {
  return (
    process.env.NOMINATIM_BASE_URL?.trim() || DEFAULT_NOMINATIM_BASE_URL
  );
}

function createNominatimUrl(path: string) {
  return new URL(path, getNominatimBaseUrl());
}

function isValidCoordinate(value: unknown): value is string | number {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : Number.NaN;

  return Number.isFinite(parsed);
}

function normalizeCoordinate(value: string | number) {
  return typeof value === "number" ? value : Number(value);
}

function mapSearchResults(payload: unknown) {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload.flatMap((item) => {
    const candidate = item as NominatimResult;

    if (
      typeof candidate.display_name !== "string" ||
      !isValidCoordinate(candidate.lat) ||
      !isValidCoordinate(candidate.lon)
    ) {
      return [];
    }

    return [
      {
        label: candidate.display_name,
        latitude: normalizeCoordinate(candidate.lat),
        longitude: normalizeCoordinate(candidate.lon),
      } satisfies LocationSearchResult,
    ];
  });
}

function buildSearchQueries(query: string) {
  const trimmed = query.trim();

  if (!trimmed) {
    return [];
  }

  const lowered = trimmed.toLowerCase();
  const hasRegionHint =
    lowered.includes("lagos") || lowered.includes("nigeria");

  return hasRegionHint
    ? [trimmed]
    : [trimmed, `${trimmed}, ${FALLBACK_REGION_SUFFIX}`];
}

async function runNominatimSearch(query: string, limit: number) {
  const url = createNominatimUrl("/search");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("countrycodes", "ng");
  url.searchParams.set("q", query);

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "Accept-Language": "en",
      "User-Agent": "WheelersFrontend/1.0",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Location search failed for "${query}".`);
  }

  return mapSearchResults(await response.json());
}

export async function searchLocations(
  query: string,
  limit = DEFAULT_SEARCH_LIMIT,
) {
  const queries = buildSearchQueries(query);

  for (const candidateQuery of queries) {
    const results = await runNominatimSearch(candidateQuery, limit);

    if (results.length > 0) {
      return results;
    }
  }

  return [];
}

export async function geocodeLocation(query: string) {
  const [firstResult] = await searchLocations(query, 1);

  if (!firstResult) {
    throw new Error(`Could not find "${query}".`);
  }

  return firstResult;
}

export function haversineDistanceKm(
  from: { latitude: number; longitude: number },
  to: { latitude: number; longitude: number },
) {
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRadians(to.latitude - from.latitude);
  const dLon = toRadians(to.longitude - from.longitude);
  const fromLat = toRadians(from.latitude);
  const toLat = toRadians(to.latitude);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(fromLat) * Math.cos(toLat) * Math.sin(dLon / 2) ** 2;

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
