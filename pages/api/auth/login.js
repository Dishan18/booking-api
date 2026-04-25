import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }
  const user = db.users.find((u) => u.email === email);
  if (!user) {
    return res.status(400).json({ error: "Invalid creds" });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).json({ error: "Invalid creds" });
  }
  const token = signToken(user);
  res.json({ token });
}
