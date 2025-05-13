import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Dashboard from "./Dashboard";
import ProjectForm from "./ProjectForm";
import ProjectsList from "./ProjectsList";

const AdminPanel = () => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // فقط زمانی که لودینگ تمام شد و کاربر لاگین نشده بود، هدایت به لاگین
    if (!loading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center bg-black text-white">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // در حال هدایت به لاگین
  }

  return (
    <div className="min-h-screen bg-black p-10 space-y-10">
      <Dashboard />
      <ProjectForm />
      <ProjectsList />
    </div>
  );
};

export default AdminPanel;
