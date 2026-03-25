import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { AMFullLayout } from '@/components/assist-manager/AMFullLayout';

const AssistManagerDashboard = () => {
  return (
    <DashboardLayout>
      <AMFullLayout />
    </DashboardLayout>
  );
};

export default AssistManagerDashboard;
