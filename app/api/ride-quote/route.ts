import { calculateRidePrice } from "@/lib/ride-pricing";

export const runtime = "nodejs";

const DEFAULT_OPENROUTESERVICE_BASE_URL =
  "https://api.heigit.org/openrouteservice";
const DEFAULT_OPENROUTESERVICE_PROFILE = "driving-car";

type RideQuotePayload = {
  from?: unknown;
  to?: unknown;
  distanceKm?: unknown;
};

type ResolvedLocation = {
  label: string;
  coordinates: [number, number];
};

type OpenRouteServiceConfig = {
  apiKey: string;
  baseUrl: string;
  profile: string;
};

function readOptionalString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readOptionalDistance(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    return value;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed >= 0) {
      return parsed;
    }
  }

  return null;
}

function createServiceUrl(baseUrl: string, path: string) {
  return new URL(path, baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
}

function readServiceConfig(): OpenRouteServiceConfig | null {
  const apiKey = process.env.OPENROUTESERVICE_API_KEY?.trim();

  if (!apiKey) {
    return null;
  }

  return {
    apiKey,
    baseUrl:
      process.env.OPENROUTESERVICE_BASE_URL?.trim() ||
      DEFAULT_OPENROUTESERVICE_BASE_URL,
    profile:
      process.env.OPENROUTESERVICE_PROFILE?.trim() ||
      DEFAULT_OPENROUTESERVICE_PROFILE,
  };
}

async function geocodeLocation(
  config: OpenRouteServiceConfig,
  query: string,
): Promise<ResolvedLocation> {
  const url = createServiceUrl(config.baseUrl, "geocode/search");
  url.searchParams.set("api_key", config.apiKey);
  url.searchParams.set("text", query);
  url.searchParams.set("size", "1");

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: config.apiKey,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Could not geocode "${query}".`);
  }

  const payload = (await response.json()) as {
    features?: Array<{
      geometry?: { coordinates?: unknown };
      properties?: { label?: unknown; name?: unknown };
    }>;
  };

  const feature = payload.features?.[0];
  const coordinates = feature?.geometry?.coordinates;
  const label =
    typeof feature?.properties?.label === "string"
      ? feature.properties.label
      : typeof feature?.properties?.name === "string"
        ? feature.properties.name
        : query;

  if (
    !Array.isArray(coordinates) ||
    coordinates.length < 2 ||
    typeof coordinates[0] !== "number" ||
    typeof coordinates[1] !== "number"
  ) {
    throw new Error(`No route point found for "${query}".`);
  }

  return {
    label,
    coordinates: [coordinates[0], coordinates[1]],
  };
}

async function getRouteDistanceKm(
  config: OpenRouteServiceConfig,
  from: ResolvedLocation,
  to: ResolvedLocation,
) {
  const url = createServiceUrl(config.baseUrl, `v2/directions/${config.profile}`);
  url.searchParams.set("api_key", config.apiKey);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: config.apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      coordinates: [from.coordinates, to.coordinates],
      instructions: false,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Could not calculate the trip distance.");
  }

  const payload = (await response.json()) as {
    routes?: Array<{ summary?: { distance?: unknown } }>;
  };

  const distanceMeters = payload.routes?.[0]?.summary?.distance;

  if (typeof distanceMeters !== "number" || !Number.isFinite(distanceMeters)) {
    throw new Error("The route service did not return a valid distance.");
  }

  return distanceMeters / 1000;
}

export async function POST(request: Request) {
  let payload: RideQuotePayload;

  try {
    payload = (await request.json()) as RideQuotePayload;
  } catch {
    return Response.json({ message: "Invalid request body." }, { status: 400 });
  }

  const from = readOptionalString(payload.from);
  const to = readOptionalString(payload.to);
  const manualDistanceKm = readOptionalDistance(payload.distanceKm);

  if (manualDistanceKm !== null && !from && !to) {
    try {
      return Response.json({
        quote: calculateRidePrice(manualDistanceKm),
      });
    } catch (error) {
      return Response.json(
        {
          message:
            error instanceof Error
              ? error.message
              : "Distance could not be priced.",
        },
        { status: 400 },
      );
    }
  }

  if (!from || !to) {
    return Response.json(
      { message: "Enter both pickup and destination to calculate a route." },
      { status: 400 },
    );
  }

  const config = readServiceConfig();

  if (!config) {
    return Response.json(
      {
        message:
          "OpenRouteService is not configured. Add OPENROUTESERVICE_API_KEY to your server environment.",
      },
      { status: 500 },
    );
  }

  try {
    const [resolvedFrom, resolvedTo] = await Promise.all([
      geocodeLocation(config, from),
      geocodeLocation(config, to),
    ]);
    const distanceKm = await getRouteDistanceKm(config, resolvedFrom, resolvedTo);

    return Response.json({
      from: resolvedFrom.label,
      to: resolvedTo.label,
      quote: calculateRidePrice(distanceKm),
    });
  } catch (error) {
    console.error("ride quote lookup failed", error);

    return Response.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "The ride quote could not be calculated.",
      },
      { status: 500 },
    );
  }
}
