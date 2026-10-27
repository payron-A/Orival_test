/**
 * PROTOTYPE AUTHENTICATION.
 * Sign-in tries the existing Backend (`/auth/login`). When it is unreachable, or rejects the
 * credentials, local browser-only accounts are checked. Local accounts live in localStorage,
 * hashed with SHA-256 + salt — that is NOT production security and does not sync across devices.
 * Registration has no known Backend endpoint, so it creates a local account only.
 */
import { api, ApiError } from "./api";
import { loadJSON, saveJSON } from "./storage";
import type { User } from "../types/user";

const ACCOUNTS_KEY = "orival.accounts.v1";
const PROFILES_KEY = "orival.profiles.v1";

interface LocalAccount {
  name: string;
  email: string;
  salt: string;
  hash: string;
  createdAt: string;
}
type ProfileExtras = Pick<User, "role" | "creatorApplication" | "avatarUrl" | "location" | "name">;

export type AuthErrorCode = "EMAIL_TAKEN" | "INVALID_CREDENTIALS";
export class AuthError extends Error {
  code: AuthErrorCode;
  constructor(code: AuthErrorCode) {
    super(code);
    this.name = "AuthError";
    this.code = code;
  }
}

const isAccounts = (v: unknown): v is LocalAccount[] => Array.isArray(v);
const isProfiles = (v: unknown): v is Record<string, ProfileExtras> => typeof v === "object" && v !== null && !Array.isArray(v);

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

const avatarFor = (name: string) =>
  "https://ui-avatars.com/api/?name=" + encodeURIComponent(name) + "&background=111111&color=ffffff";

function accounts(): LocalAccount[] {
  return loadJSON<LocalAccount[]>(ACCOUNTS_KEY, [], isAccounts);
}
function profiles(): Record<string, ProfileExtras> {
  return loadJSON<Record<string, ProfileExtras>>(PROFILES_KEY, {}, isProfiles);
}

/** Persists the role/application state for an email so it survives sign-out (browser only). */
export function persistProfile(user: User): void {
  const all = profiles();
  all[user.email.toLowerCase()] = {
    role: user.role,
    creatorApplication: user.creatorApplication,
    avatarUrl: user.avatarUrl,
    location: user.location,
    name: user.name,
  };
  saveJSON(PROFILES_KEY, all);
}

function buildUser(base: { name: string; email: string; avatarUrl?: string; location?: string; providerId?: string; joinedAt?: string }): User {
  const extras = profiles()[base.email.toLowerCase()] ?? {};
  return {
    name: extras.name ?? base.name,
    handle: "@" + base.email.split("@")[0],
    email: base.email,
    avatarUrl: extras.avatarUrl ?? base.avatarUrl ?? avatarFor(base.name),
    location: extras.location ?? base.location ?? "",
    joinedAt: base.joinedAt ?? new Date().toISOString().slice(0, 10),
    providerId: base.providerId,
    role: extras.role ?? (base.providerId ? "creator" : "member"),
    creatorApplication: extras.creatorApplication,
  };
}

export async function signUp(input: { name: string; email: string; password: string }): Promise<User> {
  const email = input.email.trim().toLowerCase();
  const list = accounts();
  if (list.some((a) => a.email === email)) throw new AuthError("EMAIL_TAKEN");
  const salt = crypto.randomUUID();
  const hash = await sha256(salt + input.password);
  const createdAt = new Date().toISOString().slice(0, 10);
  saveJSON(ACCOUNTS_KEY, [...list, { name: input.name.trim(), email, salt, hash, createdAt }]);
  return buildUser({ name: input.name.trim(), email, joinedAt: createdAt });
}

interface ApiLoginUser {
  name: string;
  email: string;
  avatarUrl?: string;
  location?: string;
  providerId?: string;
}

export async function signIn(input: { email: string; password: string }): Promise<User> {
  const email = input.email.trim().toLowerCase();
  try {
    const { token, user } = await api<{ token: string; user: ApiLoginUser }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password: input.password }),
    });
    localStorage.setItem("token", token);
    return buildUser(user);
  } catch (err) {
    if (!(err instanceof ApiError)) throw err;
    // Backend unreachable or rejected → try local prototype accounts.
  }
  const acct = accounts().find((a) => a.email === email);
  if (acct && (await sha256(acct.salt + input.password)) === acct.hash) {
    return buildUser({ name: acct.name, email: acct.email, joinedAt: acct.createdAt });
  }
  throw new AuthError("INVALID_CREDENTIALS");
}
