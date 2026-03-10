import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    return NextResponse.json({ error: "Konfigurationsfel: ingen databasanslutning" }, { status: 500 });
  }

  let name: string, email: string, password: string;
  try {
    const body = await request.json();
    name = body.name;
    email = body.email;
    password = body.password;
  } catch (e) {
    return NextResponse.json({ error: "Ogiltig data" }, { status: 400 });
  }

  if (!email || !password) {
    return NextResponse.json(
      { error: "E-post och lösenord krävs" },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Lösenordet måste vara minst 6 tecken" },
      { status: 400 }
    );
  }

  let existing;
  try {
    existing = await sql`SELECT id FROM users WHERE email = ${email}`;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("DB query error:", msg);
    return NextResponse.json({ error: "Databasfel: " + msg }, { status: 500 });
  }
  if (existing.length > 0) {
    return NextResponse.json(
      { error: "E-postadressen är redan registrerad" },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await sql`
    INSERT INTO users (name, email, password)
    VALUES (${name || null}, ${email}, ${hashedPassword})
  `;

  return NextResponse.json({ success: true });
}
