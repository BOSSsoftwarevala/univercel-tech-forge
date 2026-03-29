import React, { useState } from 'react';
import CorporateHRMLayout from '@/components/corporate-hrm/CorporateHRMLayout';
import CorporateDashboard from '@/components/corporate-hrm/CorporateDashboard';
import CorporateDepartments from '@/components/corporate-hrm/CorporateDepartments';
import CorporateAttendance from '@/components/corporate-hrm/CorporateAttendance';
import CorporateLeave from '@/components/corporate-hrm/CorporateLeave';
import CorporatePayroll from '@/components/corporate-hrm/CorporatePayroll';
import CorporatePerformance from '@/components/corporate-hrm/CorporatePerformance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, Settings } from 'lucide-react';

export default function CorporateHRMDemo() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [userRole, setUserRole] = useState<'hr_admin' | 'manager' | 'employee'>('hr_admin');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <CorporateDashboard />;
      case 'departments':
        return <CorporateDepartments />;
      case 'employees':
        return (
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-violet-500" />
                Employee Directory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-500">Full employee directory with search, filters, and detailed profiles.</p>
            </CardContent>
          </Card>
        );
      case 'attendance':
        return <CorporateAttendance />;
      case 'leave':
        return <CorporateLeave />;
      case 'payroll':
        return <CorporatePayroll />;
      case 'performance':
        return <CorporatePerformance />;
      case 'access':
        return (
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-violet-500" />
                Access Control
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-500">Role-based access control with granular permissions management.</p>
            </CardContent>
          </Card>
        );
      case 'settings':
        return (
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-violet-500" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-500">Configure organization settings, integrations, and preferences.</p>
            </CardContent>
          </Card>
        );
      default:
        return <CorporateDashboard />;
    }
  };

  return (
    <CorporateHRMLayout 
      activeSection={activeSection} 
      onSectionChange={setActiveSection}
      userRole={userRole}
      onRoleChange={setUserRole}
    >
      {renderContent()}
    </CorporateHRMLayout>
  );
}
