/**
 * FOLLOW-UP MANAGEMENT
 */

import React from 'react';
import { motion } from 'framer-motion';
import { PhoneCall, Clock, AlertTriangle, Calendar, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const followUps = [
  { id: '1', lead: 'Rahul Sharma', product: 'School ERP Pro', dueDate: 'Today, 3:00 PM', status: 'due', notes: 'Discuss pricing options' },
  { id: '2', lead: 'John Smith', product: 'Hospital Management', dueDate: 'Today, 5:30 PM', status: 'due', notes: 'Demo follow-up call' },
  { id: '3', lead: 'Priya Patel', product: 'Franchise Opportunity', dueDate: 'Yesterday', status: 'overdue', notes: 'Investment discussion' },
  { id: '4', lead: 'Ahmed Khan', product: 'Restaurant POS', dueDate: '2 days ago', status: 'overdue', notes: 'Send proposal' },
  { id: '5', lead: 'Maria Garcia', product: 'Real Estate CRM', dueDate: 'Tomorrow, 11:00 AM', status: 'upcoming', notes: 'Initial contact' },
  { id: '6', lead: 'Chen Wei', product: 'Gym Management', dueDate: 'Jan 20, 2:00 PM', status: 'upcoming', notes: 'Product demo scheduled' },
];

const statusConfig: Record<string, { color: string; icon: React.ElementType }> = {
  overdue: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: AlertTriangle },
  due: { color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: Clock },
  upcoming: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: Calendar },
};

export const FollowUps: React.FC = () => {
  const overdueCount = followUps.filter(f => f.status === 'overdue').length;
  const dueCount = followUps.filter(f => f.status === 'due').length;

  const handleComplete = (id: string) => {
    toast.success('Follow-up marked as complete');
  };

  const handleReschedule = (id: string) => {
    toast.info('Follow-up rescheduled');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-emerald-400" />
            Follow-up Management
          </h1>
          <p className="text-sm text-muted-foreground">Track and manage lead follow-ups</p>
        </div>
        <div className="flex gap-2">
          {overdueCount > 0 && (
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
              {overdueCount} Overdue
            </Badge>
          )}
          {dueCount > 0 && (
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
              {dueCount} Due Today
            </Badge>
          )}
        </div>
      </div>

      {/* Follow-up List */}
      <div className="space-y-3">
        {followUps.map((followUp, idx) => {
          const config = statusConfig[followUp.status];
          const StatusIcon = config.icon;
          
          return (
            <motion.div
              key={followUp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="bg-card/80 border-border/50 hover:border-emerald-500/30 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg ${config.color.split(' ')[0]} flex items-center justify-center`}>
                        <StatusIcon className={`w-5 h-5 ${config.color.split(' ')[1]}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{followUp.lead}</h3>
                        <p className="text-sm text-muted-foreground">{followUp.product}</p>
                        <p className="text-xs text-muted-foreground mt-1">{followUp.notes}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={config.color}>{followUp.status}</Badge>
                      <p className="text-xs text-muted-foreground mt-1">{followUp.dueDate}</p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline" onClick={() => handleComplete(followUp.id)}>
                          <CheckCircle className="w-3.5 h-3.5 mr-1" /> Done
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleReschedule(followUp.id)}>
                          <Calendar className="w-3.5 h-3.5 mr-1" /> Reschedule
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
