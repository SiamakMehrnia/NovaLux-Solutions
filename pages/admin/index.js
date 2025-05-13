import { AuthProvider } from "@/context/AuthContext";
import AdminPanel from "@/components/Admin/AdminPanel";

export default function AdminPage() {
  return (
    <AuthProvider>
      <AdminPanel />
    </AuthProvider>
  );
}