import React, { useState } from 'react';
import SimpleHRMLayout from '@/components/simple-hrm/SimpleHRMLayout';
import HRMDashboard from '@/components/simple-hrm/HRMDashboard';
import HRMEmployees from '@/components/simple-hrm/HRMEmployees';
import HRMAttendance from '@/components/simple-hrm/HRMAttendance';
import HRMPayroll from '@/components/simple-hrm/HRMPayroll';
import HRMLeave from '@/components/simple-hrm/HRMLeave';
import HRMReports from '@/components/simple-hrm/HRMReports';
import HRMSettings from '@/components/simple-hrm/HRMSettings';

export default function SimpleHRMDemo() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <HRMDashboard />;
      case 'employees':
        return <HRMEmployees />;
      case 'attendance':
        return <HRMAttendance />;
      case 'payroll':
        return <HRMPayroll />;
      case 'leave':
        return <HRMLeave />;
      case 'reports':
        return <HRMReports />;
      case 'settings':
        return <HRMSettings />;
      default:
        return <HRMDashboard />;
    }
  };

  return (
    <SimpleHRMLayout 
      activeSection={activeSection} 
      onSectionChange={setActiveSection}
    >
      {renderContent()}
    </SimpleHRMLayout>
  );
}
