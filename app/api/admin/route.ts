import { getWaitlistSubmissions } from "@/lib/waitlist-db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const adminKey = request.headers.get("x-admin-key");

  if (!process.env.ADMIN_API_KEY) {
    return Response.json(
      { message: "ADMIN_API_KEY is not configured." },
      { status: 500 },
    );
  }

  if (adminKey !== process.env.ADMIN_API_KEY) {
    return Response.json({ message: "Unauthorized." }, { status: 401 });
  }

  try {
    const submissions = await getWaitlistSubmissions();

    return Response.json({
      message: "Waitlist submissions fetched successfully.",
      count: submissions.length,
      submissions,
    });
  } catch (error) {
    console.error("waitlist admin fetch failed", error);

    return Response.json(
      { message: "Could not fetch waitlist submissions." },
      { status: 500 },
    );
  }
}