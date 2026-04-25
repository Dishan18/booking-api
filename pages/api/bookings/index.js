import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import crypto from "crypto";
export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }
  const user = verifyToken(req);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const { activityId } = req.body;
  if (!activityId) {
    return res.status(400).json({ error: "activityId required" });
  }
  const activity = db.activities.find((a) => a.id === activityId);
  if (!activity) {
    return res.status(404).json({ error: "No activity" });
  }
  const already = db.bookings.find((b) => b.userId === user.id && b.activityId === activityId);
  if (already) {
    return res.status(400).json({ error: "Already booked" });
  }
  const count = db.bookings.filter((b) => b.activityId === activityId).length;
  if (count >= activity.capacity) {
    return res.status(400).json({ error: "Full" });
  }
  const booking = {
    id: crypto.randomUUID(),
    userId: user.id,
    activityId,
    createdAt: new Date(),
  };
  db.bookings.push(booking);
  res.status(201).json(booking);
}
