import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  if (db.users.find((u) => u.email === email)) {
    return res.status(400).json({ error: "User exists" });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = {
    id: Date.now().toString(),
    name,
    email,
    password: hashed,
  };

  db.users.push(user);

  res.status(201).json({ message: "Registered" });
}
