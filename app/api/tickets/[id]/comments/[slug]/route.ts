import prisma from "./../../../../../../app/lib/prisma";
import { getUserFromRequest } from "../../../../../lib/auth";
import { NextResponse } from "next/server";

export async function PATCH(req: any, { params }: any) {
  const user: any = getUserFromRequest(req);
  const { comment } = await req.json();

  const existing = await prisma.ticket_comments.findUnique({
    where: { id: Number(params.id) },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (user.role !== "MANAGER" && existing.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.ticket_comments.update({
    where: { id: existing.id },
    data: { comment },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: any, { params }: any) {
  const user: any = getUserFromRequest(req);

  const existing = await prisma.ticket_comments.findUnique({
    where: { id: Number(params.id) },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (user.role !== "MANAGER" && existing.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.ticket_comments.delete({
    where: { id: existing.id },
  });

  return NextResponse.json({ message: "Deleted" });
}