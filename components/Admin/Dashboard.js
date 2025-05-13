import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const { logout, loading } = useAuth();

  console.log("📦 Rendering Dashboard...");

  if (loading) {
    console.log("⏳ Waiting for logout...");
    return (
      <div className="h-screen flex justify-center items-center bg-black text-white">
        <p>Logging out...</p>
      </div>
    );
  }

  return (
    <div className="bg-black p-10 text-white">
      <h1 className="text-2xl mb-6">Admin Dashboard</h1>
      <button
        onClick={() => {
          console.log("🚪 Logout button clicked");
          logout();
        }}
        className="bg-[#FF7E00] py-2 px-4 rounded hover:bg-[#FF9100]"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;