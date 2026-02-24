import prisma from "./../../../../app/lib/prisma";
import bcrypt from "bcrypt";
import { generateToken } from "./../../../lib/jwt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.users.findUnique({
    where: { email },
    include: { roles: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = generateToken(user);

  return NextResponse.json({ token });
}