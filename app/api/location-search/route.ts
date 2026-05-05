import { searchLocations } from "@/lib/location-search";

export const runtime = "nodejs";

function readQueryParam(value: string | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = readQueryParam(searchParams.get("q"));

  if (query.length < 2) {
    return Response.json({ results: [] });
  }

  try {
    const results = await searchLocations(query, 5);
    return Response.json({ results });
  } catch (error) {
    console.error("location search failed", error);

    return Response.json(
      { message: "Location search is unavailable right now." },
      { status: 500 },
    );
  }
}
