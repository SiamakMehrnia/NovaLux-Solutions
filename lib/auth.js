import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey123"; // از .env برای امنیت بیشتر

/** ایجاد JWT */
export const createToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "3h" });
};

/** ذخیره JWT در کوکی */
export const setTokenCookie = (res, token) => {
  const cookie = serialize("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 3 * 60 * 60, // 3 ساعت
  });

  res.setHeader("Set-Cookie", cookie);
};

/** حذف کوکی */
export const clearTokenCookie = (res) => {
  const cookie = serialize("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  res.setHeader("Set-Cookie", cookie);
};

/** اعتبارسنجی JWT */
export const verifyToken = (req) => {
  const token = req.cookies.token;

  if (!token) {
    throw new Error("No token provided");
  }

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Error("Invalid token");
  }
};