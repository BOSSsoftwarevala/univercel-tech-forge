import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Lock, CheckCircle, Clock, Play, Ban, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const TMStatusFlow: React.FC = () => {
  const statusSteps = [
    { id: 'pending', label: 'Pending', icon: Clock, color: 'text-muted-foreground', bgColor: 'bg-muted/50' },
    { id: 'assigned', label: 'Assigned', icon: CheckCircle, color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
    { id: 'in_progress', label: 'In Progress', icon: Play, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
    { id: 'completed', label: 'Completed', icon: Lock, color: 'text-green-400', bgColor: 'bg-green-500/20' },
  ];

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          Locked Status Flow
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Main flow */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
            {statusSteps.map((step, index) => (
              <React.Fragment key={step.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg ${step.bgColor} min-w-[100px]`}
                >
                  <step.icon className={`h-6 w-6 ${step.color}`} />
                  <span className={`text-sm font-medium ${step.color}`}>{step.label}</span>
                </motion.div>
                {index < statusSteps.length - 1 && (
                  <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Blocked branch */}
          <div className="flex items-center gap-4 pl-[calc(50%-60px)]">
            <div className="flex items-center gap-2">
              <div className="w-px h-6 bg-border" />
              <ArrowRight className="h-4 w-4 text-red-400 rotate-90" />
            </div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 p-3 rounded-lg bg-red-500/20"
            >
              <Ban className="h-5 w-5 text-red-400" />
              <span className="text-sm font-medium text-red-400">Blocked</span>
            </motion.div>
          </div>

          {/* Rules */}
          <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border/50">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Flow Rules (Immutable)
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Lock className="h-3 w-3" />
                Status skip is FORBIDDEN
              </li>
              <li className="flex items-center gap-2">
                <Lock className="h-3 w-3" />
                Manual close is DISABLED
              </li>
              <li className="flex items-center gap-2">
                <Lock className="h-3 w-3" />
                Reopen closed task requires Admin approval
              </li>
              <li className="flex items-center gap-2">
                <Lock className="h-3 w-3" />
                Blocked status requires mandatory reason
              </li>
              <li className="flex items-center gap-2">
                <Lock className="h-3 w-3" />
                All transitions are logged with timestamp
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TMStatusFlow;
