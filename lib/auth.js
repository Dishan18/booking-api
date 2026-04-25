import jwt from "jsonwebtoken";
const SECRET = "secret123";
export function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, SECRET);
}
export function verifyToken(req) {
  const header = req.headers.authorization;
  if (!header) return null;
  const token = header.split(" ")[1];
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}
