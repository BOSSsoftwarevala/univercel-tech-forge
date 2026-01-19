/**
 * DEMO COMPLETION CENTER SCREEN
 * Compare with Master Template, Highlight Missing Screens/Actions
 * Actions: Complete with Vala AI, Approve AI Changes, Re-test Entire Software
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Bot,
  Check,
  RefreshCw,
  FileText,
  Layers,
  Monitor,
  MousePointer2
} from 'lucide-react';
import { toast } from 'sonner';

interface CompletionItem {
  id: string;
  name: string;
  type: 'screen' | 'action' | 'module';
  status: 'complete' | 'missing' | 'broken';
  aiFixable: boolean;
}

interface SoftwareCompletion {
  id: string;
  name: string;
  completionPercentage: number;
  totalItems: number;
  completedItems: number;
  missingItems: number;
  brokenItems: number;
  items: CompletionItem[];
}

const completionData: SoftwareCompletion[] = [
  {
    id: '1',
    name: 'SchoolERP Pro',
    completionPercentage: 95,
    totalItems: 120,
    completedItems: 114,
    missingItems: 4,
    brokenItems: 2,
    items: [
      { id: '1', name: 'Dashboard Screen', type: 'screen', status: 'complete', aiFixable: false },
      { id: '2', name: 'Student List Screen', type: 'screen', status: 'complete', aiFixable: false },
      { id: '3', name: 'Fee Report Screen', type: 'screen', status: 'missing', aiFixable: true },
      { id: '4', name: 'Export PDF Button', type: 'action', status: 'broken', aiFixable: true },
      { id: '5', name: 'Notification Module', type: 'module', status: 'missing', aiFixable: true },
    ]
  },
  {
    id: '2',
    name: 'HospitalCRM',
    completionPercentage: 78,
    totalItems: 95,
    completedItems: 74,
    missingItems: 15,
    brokenItems: 6,
    items: [
      { id: '1', name: 'Patient Dashboard', type: 'screen', status: 'complete', aiFixable: false },
      { id: '2', name: 'Appointment Booking', type: 'screen', status: 'missing', aiFixable: true },
      { id: '3', name: 'Doctor Schedule', type: 'screen', status: 'broken', aiFixable: true },
      { id: '4', name: 'Prescription Print', type: 'action', status: 'missing', aiFixable: true },
      { id: '5', name: 'Lab Reports Module', type: 'module', status: 'missing', aiFixable: true },
    ]
  },
  {
    id: '3',
    name: 'RetailPOS Master',
    completionPercentage: 45,
    totalItems: 80,
    completedItems: 36,
    missingItems: 32,
    brokenItems: 12,
    items: [
      { id: '1', name: 'POS Screen', type: 'screen', status: 'broken', aiFixable: true },
      { id: '2', name: 'Inventory List', type: 'screen', status: 'missing', aiFixable: true },
      { id: '3', name: 'Barcode Scanner', type: 'action', status: 'broken', aiFixable: true },
      { id: '4', name: 'Receipt Print', type: 'action', status: 'missing', aiFixable: true },
      { id: '5', name: 'Stock Alert Module', type: 'module', status: 'missing', aiFixable: true },
    ]
  },
];

export const DMECompletionScreen: React.FC = () => {
  const [selectedSoftware, setSelectedSoftware] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle2 className="w-4 h-4 text-neon-green" />;
      case 'missing': return <XCircle className="w-4 h-4 text-neon-orange" />;
      case 'broken': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default: return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'screen': return <Monitor className="w-3 h-3" />;
      case 'action': return <MousePointer2 className="w-3 h-3" />;
      case 'module': return <Layers className="w-3 h-3" />;
      default: return <FileText className="w-3 h-3" />;
    }
  };

  const handleAction = (softwareId: string, action: string) => {
    toast.success(`${action} triggered for software ID: ${softwareId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Demo Completion Center</h1>
          <p className="text-muted-foreground text-sm">Compare demos with master templates</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{completionData.length}</p>
            <p className="text-xs text-muted-foreground">Demos Checked</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-neon-green">1</p>
            <p className="text-xs text-muted-foreground">Near Complete</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-neon-orange">51</p>
            <p className="text-xs text-muted-foreground">Missing Items</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-400">20</p>
            <p className="text-xs text-muted-foreground">Broken Items</p>
          </CardContent>
        </Card>
      </div>

      {/* Completion List */}
      <div className="space-y-4">
        {completionData.map((software, index) => (
          <motion.div
            key={software.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-card border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-base font-medium">{software.name}</CardTitle>
                    <Badge variant="outline" className={
                      software.completionPercentage >= 90 ? 'border-neon-green text-neon-green' :
                      software.completionPercentage >= 70 ? 'border-neon-orange text-neon-orange' :
                      'border-red-400 text-red-400'
                    }>
                      {software.completionPercentage}% Complete
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-1 h-7" onClick={() => handleAction(software.id, 'Complete with AI')}>
                      <Bot className="w-3 h-3 text-primary" />
                      Complete with AI
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1 h-7" onClick={() => handleAction(software.id, 'Approve')}>
                      <Check className="w-3 h-3 text-neon-green" />
                      Approve
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1 h-7" onClick={() => handleAction(software.id, 'Re-test')}>
                      <RefreshCw className="w-3 h-3" />
                      Re-test
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>{software.completedItems} / {software.totalItems} items completed</span>
                    <span>{software.missingItems} missing • {software.brokenItems} broken</span>
                  </div>
                  <Progress value={software.completionPercentage} className="h-2" />
                </div>

                {/* Items List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {software.items.map((item) => (
                    <div 
                      key={item.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        item.status === 'complete' ? 'bg-neon-green/5' :
                        item.status === 'missing' ? 'bg-neon-orange/5' :
                        'bg-red-400/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.name}</p>
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            {getTypeIcon(item.type)}
                            <span className="capitalize">{item.type}</span>
                          </div>
                        </div>
                      </div>
                      {item.aiFixable && item.status !== 'complete' && (
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs gap-1">
                          <Bot className="w-3 h-3 text-primary" />
                          Fix
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
