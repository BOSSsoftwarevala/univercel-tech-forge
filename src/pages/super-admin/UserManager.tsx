import SuperAdminLayout from "@/components/layouts/SuperAdminLayout";
import UserManagement from "@/components/admin/UserManagement";

const UserManager = () => {
  return (
    <SuperAdminLayout>
      <main className="p-6">
        <UserManagement />
      </main>
    </SuperAdminLayout>
  );
};

export default UserManager;
