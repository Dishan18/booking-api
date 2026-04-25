import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
export default function handler(req, res) {
  const { id } = req.query;
  const activity = db.activities.find((a) => a.id === id);
  if (!activity) {
    return res.status(404).json({ error: "Not found" });
  }
  if (req.method === "GET") {
    return res.json(activity);
  }
  if (req.method === "PUT" || req.method === "DELETE") {
    const user = verifyToken(req);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (user.email !== "admin@test.com") {
      return res.status(403).json({ error: "Forbidden" });
    } //simulating admin user with email
  }
  if (req.method === "PUT") {
    const { title, description, date, capacity } = req.body;
    if (title !== undefined) activity.title = title;
    if (description !== undefined) activity.description = description;
    if (date !== undefined) activity.date = date;
    if (capacity !== undefined && typeof capacity === "number") {
      activity.capacity = capacity;
    }
    return res.json(activity);
  }
  if (req.method === "DELETE") {
    db.activities = db.activities.filter((a) => a.id !== id);
    return res.json({ message: "Deleted" });
  }
  res.status(405).end();
}
