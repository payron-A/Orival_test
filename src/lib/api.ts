/**
 * Existing integration with the separate Backend project (not modified here).
 * When the server is not reachable the app falls back to local prototype data.
 */
const API_URL = "http://localhost:4000";

export class ApiError extends Error {
  status: number;
  network: boolean;
  constructor(message: string, status: number, network = false) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.network = network;
  }
}

export function getToken() {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  let res: Response;
  try {
    res = await fetch(API_URL + path, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError("Network error", 0, true);
  }
  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    /* non-JSON body */
  }
  if (!res.ok) {
    const msg = (data as { error?: string } | null)?.error ?? "Request failed";
    throw new ApiError(msg, res.status);
  }
  return data as T;
}
