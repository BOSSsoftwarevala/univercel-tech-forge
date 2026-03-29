import SuperAdminLayout from '@/components/layouts/SuperAdminLayout';
import UnifiedSecurityCenter from '@/components/security/UnifiedSecurityCenter';

const SecurityCenter = () => {
  return (
    <SuperAdminLayout>
      <UnifiedSecurityCenter />
    </SuperAdminLayout>
  );
};

export default SecurityCenter;
