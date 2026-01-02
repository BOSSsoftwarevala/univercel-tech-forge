import React, { useState } from 'react';
import SaasHRMLayout from '@/components/saas-hrm/SaasHRMLayout';
import SaasDashboard from '@/components/saas-hrm/SaasDashboard';
import SaasWorkspace from '@/components/saas-hrm/SaasWorkspace';
import SaasAttendance from '@/components/saas-hrm/SaasAttendance';
import SaasPayroll from '@/components/saas-hrm/SaasPayroll';
import SaasSelfService from '@/components/saas-hrm/SaasSelfService';
import SaasSecurity from '@/components/saas-hrm/SaasSecurity';
import SaasSettings from '@/components/saas-hrm/SaasSettings';

const SaasHRMDemo: React.FC = () => {
  const [activeModule, setActiveModule] = useState('dashboard');

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <SaasDashboard />;
      case 'workspace':
        return <SaasWorkspace />;
      case 'attendance':
        return <SaasAttendance />;
      case 'payroll':
        return <SaasPayroll />;
      case 'self-service':
        return <SaasSelfService />;
      case 'security':
        return <SaasSecurity />;
      case 'settings':
        return <SaasSettings />;
      default:
        return <SaasDashboard />;
    }
  };

  return (
    <SaasHRMLayout
      activeModule={activeModule}
      onModuleChange={setActiveModule}
    >
      {renderModule()}
    </SaasHRMLayout>
  );
};

export default SaasHRMDemo;
