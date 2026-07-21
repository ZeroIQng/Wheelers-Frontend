const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://http://app.wheelersng.com";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("wheelers_admin_token");
}

export async function adminFetch(path: string, init?: RequestInit): Promise<Response> {
  const token = getToken();
  const headers: Record<string, string> = {
    "ngrok-skip-browser-warning": "1",
    ...(init?.headers as Record<string, string> ?? {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  });
}
