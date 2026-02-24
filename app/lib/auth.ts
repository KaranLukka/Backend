import jwt from "jsonwebtoken";

export function getUserFromRequest(req: any) {
  const authHeader = req.headers?.get?.("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.split(" ")[1];

  return jwt.verify(token, process.env.JWT_SECRET!);
}