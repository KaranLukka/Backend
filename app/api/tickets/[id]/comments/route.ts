import prisma from "./../../../../../app/lib/prisma";
import { getUserFromRequest } from "./../../../../lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: any, { params }: any) {
  const user: any = getUserFromRequest(req);
  const { comment } = await req.json();

  const ticket = await prisma.tickets.findUnique({
    where: { id: Number(params.id) },
  });

  if (!ticket) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const allowed =
    user.role === "MANAGER" ||
    (user.role === "SUPPORT" && ticket.assigned_to === user.id) ||
    (user.role === "USER" && ticket.created_by === user.id);

  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const newComment = await prisma.ticket_comments.create({
    data: {
      ticket_id: ticket.id,
      user_id: user.id,
      comment,
    },
  });

  return NextResponse.json(newComment);
}

export async function GET(req: any, { params }: any) {
  const user: any = getUserFromRequest(req);

  const ticket = await prisma.tickets.findUnique({
    where: { id: Number(params.id) },
  });

  const allowed =
    user.role === "MANAGER" ||
    ticket?.assigned_to === user.id ||
    ticket?.created_by === user.id;

  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const comments = await prisma.ticket_comments.findMany({
    where: { ticket_id: Number(params.id) },
  });

  return NextResponse.json(comments);
}