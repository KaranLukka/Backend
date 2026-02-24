import prisma from "./../../../../../app/lib/prisma";
import { getUserFromRequest } from "./../../../../lib/auth";
import { NextResponse } from "next/server";
import { ticket_status_log_old_status } from "./../../../../../app/generated/prisma/enums";

const transitions: any = {
  OPEN: "IN_PROGRESS",
  IN_PROGRESS: "RESOLVED",
  RESOLVED: "CLOSED",
};

export async function PATCH(req: any, { params }: any) {
  const user: any = getUserFromRequest(req);

  if (!["MANAGER", "SUPPORT"].includes(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { status } = await req.json();

  const ticket = await prisma.tickets.findUnique({
    where: { id: Number(params.id) },
  });

  if (!ticket) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (transitions[ticket.status as keyof typeof transitions] !== status) {
    return NextResponse.json({ error: "Invalid status transition" }, { status: 400 });
  }

  await prisma.tickets.update({
    where: { id: ticket.id },
    data: { status },
  });

  await prisma.ticket_status_log.create({
    data: {
      ticket_id: ticket.id,
      old_status: ticket_status_log_old_status[ticket.status as keyof typeof ticket_status_log_old_status],
      new_status: status,
      changed_by: user.id,
    },
  });

  return NextResponse.json({ message: "Status updated" });
}