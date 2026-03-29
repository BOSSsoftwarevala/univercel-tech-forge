import SuperAdminLayout from '@/components/layouts/SuperAdminLayout';
import RoleAccessControl from '@/components/admin/RoleAccessControl';
import { Shield } from 'lucide-react';

const PermissionMatrix = () => {
  return (
    <SuperAdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="w-8 h-8" />
            Permission Matrix
          </h1>
          <p className="text-muted-foreground">Configure role-based access control</p>
        </div>
        <RoleAccessControl />
      </div>
    </SuperAdminLayout>
  );
};

export default PermissionMatrix;
