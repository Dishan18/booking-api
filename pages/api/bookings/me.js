import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export default function handler(req, res) {
  const user = verifyToken(req);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const myBookings = db.bookings.filter((b) => b.userId === user.id);

  res.json(myBookings);
}
