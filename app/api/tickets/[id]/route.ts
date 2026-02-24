import prisma from "./../../../../app/lib/prisma";
import { getUserFromRequest } from "./../../../lib/auth";
import { NextResponse } from "next/server";

export async function DELETE(req: any, { params }: any) {
  const user: any = getUserFromRequest(req);

  if (user.role !== "MANAGER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.tickets.delete({
    where: { id: Number(params.id) },
  });

  return NextResponse.json({ message: "Deleted" });
}