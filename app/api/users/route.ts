import prisma from "./../../lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "./../../lib/auth";

export async function POST(req: Request) {
  const { name, email, password, roleId } = await req.json();

  const role = await prisma.roles.findUnique({
    where: { id: roleId },
  });

  if (!role) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  let existingManager = null;

  if (role.name === "MANAGER") {
    existingManager = await prisma.users.findFirst({
      where: {
        role_id: role.id,
      },
    });
  }

const existingEmail = await prisma.users.findUnique({
  where: { email },
});

if (existingEmail) {
  return NextResponse.json(
    { error: "Email already exists" },
    { status: 400 }
  );
}

  if (!existingManager && role.name === "MANAGER") {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role_id: roleId,
      },
    });

    return NextResponse.json({
      message: "First manager created successfully",
      user,
    });
  }

  try {
    const currentUser: any = getUserFromRequest(req);

    if (currentUser.role !== "MANAGER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role_id: roleId,
      },
    });

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}