import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { AssistManagerScreen } from '@/components/wireframe/screens/AssistManagerScreen';

const AssistManagerDashboard = () => {
  return (
    <DashboardLayout>
      <AssistManagerScreen />
    </DashboardLayout>
  );
};

export default AssistManagerDashboard;
