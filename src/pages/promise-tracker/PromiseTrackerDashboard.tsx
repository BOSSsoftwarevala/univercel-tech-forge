import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { PromiseTrackerScreen } from '@/components/wireframe/screens/PromiseTrackerScreen';

const PromiseTrackerDashboard = () => {
  return (
    <DashboardLayout>
      <PromiseTrackerScreen />
    </DashboardLayout>
  );
};

export default PromiseTrackerDashboard;
