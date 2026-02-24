import { getUserFromRequest } from "./../../lib/auth";
import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";

export async function POST(req: any) {
  const user: any = getUserFromRequest(req);

  if (!["USER", "MANAGER"].includes(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { title, description, priority } = await req.json();

  if (title.length < 5 || description.length < 10) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const ticket = await prisma.tickets.create({
    data: {
      title,
      description,
      priority,
      created_by: user.id,
    },
  });

  return NextResponse.json(ticket);
}
export async function GET(req: any) {
  const user: any = getUserFromRequest(req);

  let tickets;

  if (user.role === "MANAGER") {
    tickets = await prisma.tickets.findMany({
      include: { users_tickets_created_byTousers: true, users_tickets_assigned_toTousers: true },
    });
  } else if (user.role === "SUPPORT") {
    tickets = await prisma.tickets.findMany({
      where: { assigned_to: user.id },
      include: { users_tickets_created_byTousers: true, users_tickets_assigned_toTousers: true },
    });
  } else {
    tickets = await prisma.tickets.findMany({
      where: { created_by: user.id },
      include: { users_tickets_created_byTousers: true, users_tickets_assigned_toTousers: true },
    });
  }

  return NextResponse.json(tickets);
}
