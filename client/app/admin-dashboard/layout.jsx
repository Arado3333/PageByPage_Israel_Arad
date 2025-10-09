import AdminLayout from "./AdminLayout";
import AdminRoute from "../components/AdminRoute";

export default function AdminDashboardLayout({ children }) {
  return (
    <AdminRoute>
      <AdminLayout>{children}</AdminLayout>
    </AdminRoute>
  );
}
