import { useState } from 'react';
import { motion } from 'framer-motion';
import ValaIsolatedLayout from '@/components/vala-control/ValaIsolatedLayout';
import ValaFlowControl, { FlowStep } from '@/components/vala-control/ValaFlowControl';
import ValaAdminSummary from '@/components/vala-control/ValaAdminSummary';
import { ValaSecurityProvider, useValaSecurity } from '@/contexts/ValaSecurityContext';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Shield, Database, Eye } from 'lucide-react';

type RoleView = 'operations' | 'regional' | 'ai_head' | 'master';

interface ValaControlCenterProps {
  roleView?: RoleView;
}

const ROLE_LABELS: Record<RoleView, string> = {
  operations: 'Front / Operations',
  regional: 'Area / Regional Control',
  ai_head: 'AI Head',
  master: 'Master Admin',
};

const ValaControlCenterContent = ({ roleView = 'operations' }: ValaControlCenterProps) => {
  const { valaId, maskData } = useValaSecurity();
  const { userRole } = useAuth();
  const [currentStep, setCurrentStep] = useState<FlowStep>('debug');
  const [status, setStatus] = useState<'pending' | 'locked' | 'forwarded' | 'blocked'>('pending');

  // Mock action data (would come from actual role-specific module)
  const actionData = {
    module: 'task_submission',
    entryId: 'ENT-' + Date.now().toString(36).toUpperCase(),
    maskedData: maskData('sensitive-data-here', 3),
    timestamp: new Date().toISOString(),
  };

  const handleStepComplete = (step: FlowStep, checksum: string) => {
    const steps: FlowStep[] = ['debug', 'check', 'lock', 'forward'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
    if (step === 'lock') {
      setStatus('locked');
    }
  };

  const handleForward = (checksum: string) => {
    setStatus('forwarded');
    // In real implementation, this would submit to next role
  };

  // AI Head view - observation only
  if (roleView === 'ai_head') {
    return (
      <ValaIsolatedLayout roleLabel={ROLE_LABELS[roleView]} status="pending">
        <div className="max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-slate-900/50 border border-violet-500/30"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-violet-500/20">
                <Eye className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">AI Observation Console</h1>
                <p className="text-sm text-slate-400">Silent monitoring • No execution authority</p>
              </div>
              <Badge className="ml-auto bg-violet-500/20 text-violet-400 border border-violet-500/50">
                Read Only
              </Badge>
            </div>

            {/* AI can only view reports */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                <h3 className="text-sm font-medium text-slate-300 mb-3">Behavior Score Distribution</h3>
                <div className="space-y-2">
                  {['Normal', 'Low Risk', 'Medium Risk', 'High Risk'].map((label, i) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">{label}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              i === 0 ? 'bg-emerald-500 w-4/5' :
                              i === 1 ? 'bg-blue-500 w-1/2' :
                              i === 2 ? 'bg-amber-500 w-1/4' :
                              'bg-red-500 w-1/12'
                            }`}
                          />
                        </div>
                        <span className="text-xs text-slate-500">{[82, 12, 5, 1][i]}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                <h3 className="text-sm font-medium text-slate-300 mb-3">Risk Flags Today</h3>
                <div className="text-4xl font-bold text-amber-400 mb-2">7</div>
                <p className="text-xs text-slate-400">Reports submitted upward</p>
              </div>
            </div>
          </motion.div>

          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <p className="text-xs text-amber-400 text-center">
              AI cannot execute, approve, or edit. All observations are automatically submitted to Master Admin.
            </p>
          </div>
        </div>
      </ValaIsolatedLayout>
    );
  }

  // Master Admin view
  if (roleView === 'master') {
    return (
      <ValaIsolatedLayout roleLabel={ROLE_LABELS[roleView]} status="pending">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/20">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Master Control</h1>
                <p className="text-sm text-slate-400">Final authority • Summary view only</p>
              </div>
            </div>
          </motion.div>

          <ValaAdminSummary
            onUnlock={(id) => console.log('Unlock:', id)}
            onOverride={(id, action) => console.log('Override:', id, action)}
          />
        </div>
      </ValaIsolatedLayout>
    );
  }

  // Operations / Regional view - standard flow
  return (
    <ValaIsolatedLayout 
      roleLabel={ROLE_LABELS[roleView]} 
      currentStep={currentStep}
      status={status}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Role Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl bg-slate-900/50 border border-slate-800"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-slate-800">
              <Database className="w-6 h-6 text-slate-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Workspace</h1>
              <p className="text-sm text-slate-400">Isolated module • Single action only</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xs text-slate-500">Entry ID</p>
              <p className="font-mono text-sm text-slate-300">{actionData.entryId}</p>
            </div>
          </div>
        </motion.div>

        {/* Mock Data Display (Masked) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-xl bg-slate-900/50 border border-slate-800"
        >
          <h3 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
            <Database className="w-4 h-4" />
            Data View (Masked)
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-slate-800/50">
              <span className="text-xs text-slate-500">Data Reference</span>
              <p className="font-mono text-slate-300">{actionData.maskedData}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/50">
              <span className="text-xs text-slate-500">Timestamp</span>
              <p className="font-mono text-slate-300">{new Date(actionData.timestamp).toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

        {/* Flow Control */}
        <ValaFlowControl
          currentStep={currentStep}
          actionData={actionData}
          onStepComplete={handleStepComplete}
          onForward={handleForward}
          disabled={status === 'forwarded'}
        />
      </div>
    </ValaIsolatedLayout>
  );
};

// Wrap with security provider
const ValaControlCenter = (props: ValaControlCenterProps) => (
  <ValaSecurityProvider>
    <ValaControlCenterContent {...props} />
  </ValaSecurityProvider>
);

export default ValaControlCenter;
