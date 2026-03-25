import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { SafeAssistScreen } from '@/components/wireframe/screens/SafeAssistScreen';

const SafeAssistDashboard = () => {
  return (
    <DashboardLayout>
      <SafeAssistScreen />
    </DashboardLayout>
  );
};

export default SafeAssistDashboard;
