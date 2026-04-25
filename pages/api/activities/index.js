import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import crypto from "crypto";
export default function handler(req, res) {
  if (req.method === "GET") {
    return res.json(db.activities);
  }
  if (req.method === "POST") {
    const user = verifyToken(req);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { title, description, date, capacity } = req.body;
    if (!title || !capacity) {
      return res.status(400).json({ error: "Title and capacity required" });
    }
    const activity = {
      id: crypto.randomUUID(),
      title,
      description,
      date,
      capacity,
    };
    db.activities.push(activity);
    return res.status(201).json(activity);
  }
  res.status(405).end();
}
