import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

const Login = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, loading, router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password);
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center bg-black text-white">
        <p>Checking Authentication...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex justify-center items-center bg-black text-white">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg">
        <h2 className="text-2xl mb-4">Admin Login</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4 p-2 w-full bg-gray-700"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 p-2 w-full bg-gray-700"
        />

        <button type="submit" className="bg-[#FF7E00] py-2 px-4 rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
