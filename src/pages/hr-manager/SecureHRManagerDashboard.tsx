import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Briefcase, ClipboardCheck, BarChart3, 
  FileText, Calendar, MessageSquare, LogOut, Shield, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useHRManagerGuard } from '@/hooks/useHRManagerGuard';

import HREmployeeOverview from '@/components/hr-manager/HREmployeeOverview';
import HRHiringPipeline from '@/components/hr-manager/HRHiringPipeline';
import HROnboardingStatus from '@/components/hr-manager/HROnboardingStatus';
import HRPerformanceRecords from '@/components/hr-manager/HRPerformanceRecords';
import HRComplianceDocuments from '@/components/hr-manager/HRComplianceDocuments';
import HRAttendanceSummary from '@/components/hr-manager/HRAttendanceSummary';
import HRInternalNotes from '@/components/hr-manager/HRInternalNotes';

export default function SecureHRManagerDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut } = useAuth();
  const { isBlocked } = useHRManagerGuard();
  const [activeTab, setActiveTab] = useState('employees');
  const [sessionTime, setSessionTime] = useState(0);

  // Session timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Session timeout warning
  useEffect(() => {
    if (sessionTime >= 1800) {
      toast({
        title: "Session Warning",
        description: "Session will expire in 5 minutes",
        variant: "destructive"
      });
    }
  }, [sessionTime, toast]);

  const handleLogout = async () => {
    console.log(`[AUDIT] HR Manager logout at ${new Date().toISOString()}`);
    await signOut();
    navigate('/auth');
  };

  const formatSessionTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-900 bg-zinc-950/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" />
                <h1 className="text-lg font-mono font-bold tracking-wider">
                  HR MANAGER
                </h1>
              </div>
              <Badge variant="outline" className="font-mono text-xs text-purple-400 border-purple-500/30">
                INTERNAL TRUST KEEPER
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Clock className="w-3.5 h-3.5" />
                <span className="font-mono">{formatSessionTime(sessionTime)}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="gap-2 text-zinc-400 hover:text-white"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-zinc-900/50 border border-zinc-800 p-1 flex-wrap h-auto">
            <TabsTrigger value="employees" className="gap-2 data-[state=active]:bg-zinc-800">
              <Users className="w-4 h-4" />
              Employees
            </TabsTrigger>
            <TabsTrigger value="hiring" className="gap-2 data-[state=active]:bg-zinc-800">
              <Briefcase className="w-4 h-4" />
              Hiring
            </TabsTrigger>
            <TabsTrigger value="onboarding" className="gap-2 data-[state=active]:bg-zinc-800">
              <ClipboardCheck className="w-4 h-4" />
              Onboarding
            </TabsTrigger>
            <TabsTrigger value="performance" className="gap-2 data-[state=active]:bg-zinc-800">
              <BarChart3 className="w-4 h-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-2 data-[state=active]:bg-zinc-800">
              <FileText className="w-4 h-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="attendance" className="gap-2 data-[state=active]:bg-zinc-800">
              <Calendar className="w-4 h-4" />
              Attendance
            </TabsTrigger>
            <TabsTrigger value="notes" className="gap-2 data-[state=active]:bg-zinc-800">
              <MessageSquare className="w-4 h-4" />
              Notes
            </TabsTrigger>
          </TabsList>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="employees" className="mt-0">
              <HREmployeeOverview />
            </TabsContent>

            <TabsContent value="hiring" className="mt-0">
              <HRHiringPipeline />
            </TabsContent>

            <TabsContent value="onboarding" className="mt-0">
              <HROnboardingStatus />
            </TabsContent>

            <TabsContent value="performance" className="mt-0">
              <HRPerformanceRecords />
            </TabsContent>

            <TabsContent value="documents" className="mt-0">
              <HRComplianceDocuments />
            </TabsContent>

            <TabsContent value="attendance" className="mt-0">
              <HRAttendanceSummary />
            </TabsContent>

            <TabsContent value="notes" className="mt-0">
              <HRInternalNotes />
            </TabsContent>
          </motion.div>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-3 mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-xs font-mono text-zinc-600 text-center">
            PEOPLE OPS ONLY • HR DATA CONFIDENTIAL • ALL ACTIONS LOGGED
          </p>
        </div>
      </footer>
    </div>
  );
}
