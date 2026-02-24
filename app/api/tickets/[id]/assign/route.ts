import prisma from "./../../../../../app/lib/prisma";
import { getUserFromRequest } from "./../../../../lib/auth";
import { NextResponse } from "next/server";

export async function PATCH(req: any, { params }: any) {
  const currentUser: any = getUserFromRequest(req);

  if (!["MANAGER", "SUPPORT"].includes(currentUser.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { assignedTo } = await req.json();

  const supportUser = await prisma.users.findUnique({
    where: { id: assignedTo },
    include: { roles: true },
  });

  if (!supportUser || supportUser.roles.name === "USER") {
    return NextResponse.json(
      { error: "Cannot assign to USER role" },
      { status: 400 }
    );
  }

  const ticket = await prisma.tickets.update({
    where: { id: Number(params.id) },
    data: { assigned_to: assignedTo },
  });

  return NextResponse.json(ticket);
}