import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, User, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface OnboardingItem {
  id: string;
  label: string;
  completed: boolean;
}

interface OnboardingEmployee {
  valaId: string;
  name: string;
  position: string;
  startDate: string;
  checklist: OnboardingItem[];
}

const mockOnboarding: OnboardingEmployee[] = [
  {
    valaId: 'EMP-1004',
    name: 'Employee D',
    position: 'Analyst',
    startDate: '2024-12-28',
    checklist: [
      { id: '1', label: 'Contract Signed', completed: true },
      { id: '2', label: 'ID Verification', completed: true },
      { id: '3', label: 'System Access Setup', completed: false },
      { id: '4', label: 'Training Assigned', completed: false },
      { id: '5', label: 'Equipment Issued', completed: false },
    ]
  },
  {
    valaId: 'EMP-1006',
    name: 'Employee F',
    position: 'Developer',
    startDate: '2025-01-02',
    checklist: [
      { id: '1', label: 'Contract Signed', completed: true },
      { id: '2', label: 'ID Verification', completed: false },
      { id: '3', label: 'System Access Setup', completed: false },
      { id: '4', label: 'Training Assigned', completed: false },
      { id: '5', label: 'Equipment Issued', completed: false },
    ]
  },
];

export default function HROnboardingStatus() {
  const { toast } = useToast();
  const [employees, setEmployees] = useState(mockOnboarding);

  const handleToggleItem = (empId: string, itemId: string) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.valaId === empId) {
        const updatedChecklist = emp.checklist.map(item =>
          item.id === itemId ? { ...item, completed: !item.completed } : item
        );
        return { ...emp, checklist: updatedChecklist };
      }
      return emp;
    }));

    console.log(`[AUDIT] Onboarding item ${itemId} toggled for ${empId}`);
  };

  const handleMarkComplete = (emp: OnboardingEmployee) => {
    console.log(`[AUDIT] Onboarding marked complete for ${emp.valaId}. Admin notified.`);
    
    toast({
      title: "Onboarding Complete",
      description: `${emp.name}'s onboarding marked complete. Admin notified for activation.`,
    });
  };

  const getProgress = (checklist: OnboardingItem[]) => {
    const completed = checklist.filter(i => i.completed).length;
    return Math.round((completed / checklist.length) * 100);
  };

  return (
    <div className="space-y-4">
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-mono tracking-wider text-zinc-400">
              ONBOARDING IN PROGRESS
            </CardTitle>
            <Badge variant="outline" className="font-mono">
              {employees.length} Pending
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {employees.map((emp, idx) => {
            const progress = getProgress(emp.checklist);
            const allComplete = progress === 100;

            return (
              <motion.div
                key={emp.valaId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{emp.name}</span>
                        <span className="font-mono text-xs text-zinc-500">{emp.valaId}</span>
                      </div>
                      <p className="text-sm text-zinc-400">{emp.position}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-500">Start Date</p>
                    <p className="text-sm font-mono">{new Date(emp.startDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-zinc-500">Progress</span>
                    <span className={`text-xs font-mono ${progress === 100 ? 'text-emerald-400' : 'text-zinc-400'}`}>
                      {progress}%
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {/* Checklist */}
                <div className="space-y-2 mb-4">
                  {emp.checklist.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleToggleItem(emp.valaId, item.id)}
                      className="w-full flex items-center gap-3 p-2 rounded hover:bg-zinc-700/30 transition-colors text-left"
                    >
                      {item.completed ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-zinc-600" />
                      )}
                      <span className={`text-sm ${item.completed ? 'text-zinc-400 line-through' : 'text-zinc-200'}`}>
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Complete Button */}
                {allComplete ? (
                  <Button
                    onClick={() => handleMarkComplete(emp)}
                    className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Bell className="w-4 h-4" />
                    Mark Complete & Notify Admin
                  </Button>
                ) : (
                  <div className="text-center text-xs text-zinc-500 py-2">
                    Complete all items to finalize onboarding
                  </div>
                )}
              </motion.div>
            );
          })}

          {employees.length === 0 && (
            <div className="text-center py-8 text-zinc-500">
              <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No employees currently onboarding</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
