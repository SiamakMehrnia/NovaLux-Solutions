import { createToken, setTokenCookie } from "@/lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username, password } = req.body;

  // برای تست، اطلاعات ثابت در نظر گرفته شده
  const DEMO_USER = { id: "12345", username: "admin", password: "admin123" };

  if (username === DEMO_USER.username && password === DEMO_USER.password) {
    const token = createToken(DEMO_USER.id);
    setTokenCookie(res, token);

    return res.status(200).json({ success: true, message: "Login successful" });
  }

  return res.status(401).json({ success: false, message: "Invalid credentials" });
}