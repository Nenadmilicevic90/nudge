import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";
import { createSession, setSessionCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "E-post och lösenord krävs" },
      { status: 400 }
    );
  }

  const users = await sql`SELECT * FROM users WHERE email = ${email}`;
  const user = users[0];

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json(
      { error: "Fel e-post eller lösenord" },
      { status: 401 }
    );
  }

  const token = await createSession({
    id: user.id,
    email: user.email,
    name: user.name,
  });
  await setSessionCookie(token);

  return NextResponse.json({ success: true });
}
