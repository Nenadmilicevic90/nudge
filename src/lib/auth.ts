import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "fallback-secret-change-in-production"
);
const COOKIE_NAME = "nudge_session";

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
}

export async function createSession(user: SessionUser): Promise<string> {
  return new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(SECRET);
}

export async function verifySession(
  token: string
): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return (payload.user as SessionUser) || null;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
