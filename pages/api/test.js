// pages/api/test.js
import cloudinary from "@/lib/cloudinary";

export default async function handler(req, res) {
  try {
    console.log("✅ Testing Cloudinary connection...");

    const response = await cloudinary.api.resources({
      max_results: 1,
    });

    console.log("✅ Cloudinary response:", response);

    return res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.log("❌ Error connecting to Cloudinary:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
}
