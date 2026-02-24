import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export function generateToken(user: any) {
  return jwt.sign(
    { id: user.id, role: user.role.name },
    SECRET,
    { expiresIn: "1d" }
  );
}

export function verifyToken(token: string) {
  return jwt.verify(token, SECRET);
}