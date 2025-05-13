import connectDB from "../../lib/connect";

export default async function handler(req, res) {
  try {
    await connectDB();
    res.status(200).json({ message: "Connected to MongoDB successfully" });
  } catch (err) {
    console.error("Database connection error:", err.message);
    res.status(500).json({ error: "Connection failed", details: err.message });
  }
}
