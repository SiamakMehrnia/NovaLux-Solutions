import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Swal from "sweetalert2";

const Login = () => {
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleLogin = () => {
    const success = login(password);
    if (success) {
      Swal.fire({
        icon: "success",
        title: "Welcome!",
        text: "You are successfully logged in.",
        background: "#333333",
        color: "#ffffff",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Invalid password.",
        background: "#333333",
        color: "#ffffff",
      });
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-black">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-white text-xl mb-4">Admin Login</h2>
        <input
          type="password"
          placeholder="Enter Password"
          className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="bg-[#FF7E00] w-full py-2 text-white rounded hover:bg-[#FF9100]"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;