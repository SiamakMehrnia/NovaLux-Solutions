import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log("✅ Checking authentication status...");
    const token = localStorage.getItem("authToken");
    if (token) {
      console.log("✅ User is authenticated.");
      setIsAuthenticated(true);
    } else {
      console.log("❌ User is not authenticated.");
    }
    setLoading(false);
  }, []);

  /** متد لاگین */
  const login = (username, password) => {
    setLoading(true);
    console.log("🔑 Attempting login...");

    const DEMO_USER = { username: "admin", password: "admin123" };

    if (username === DEMO_USER.username && password === DEMO_USER.password) {
      console.log("✅ Login successful.");
      localStorage.setItem("authToken", "loggedin");
      setIsAuthenticated(true);
      router.push("/admin");
    } else {
      console.log("❌ Invalid credentials.");
      alert("Invalid credentials");
    }

    setLoading(false);
  };

  /** متد لاگ اوت */
  const logout = async () => {
    console.log("🚪 Logging out...");
    setLoading(true);

    localStorage.removeItem("authToken");
    setIsAuthenticated(false);

    console.log("✅ Logged out successfully. Redirecting to /admin/login...");
    
    // ایجاد تأخیر کوتاه برای اطمینان از بروزرسانی وضعیت
    setTimeout(() => {
      setLoading(false);
      router.push("/admin/login");
    }, 100);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);