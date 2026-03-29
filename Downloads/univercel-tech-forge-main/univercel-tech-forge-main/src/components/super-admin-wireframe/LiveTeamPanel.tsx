import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Activity, 
  Circle,
  Zap,
  Clock,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: 'online' | 'busy' | 'away';
  action: string;
  time: string;
}

interface LiveTeamPanelProps {
  collapsed?: boolean;
}

const mockTeamData: TeamMember[] = [
  { id: '1', name: 'Rahul S.', role: 'Dev', status: 'online', action: 'Fixing API bug', time: '2m' },
  { id: '2', name: 'Priya M.', role: 'Support', status: 'busy', action: 'On call', time: '5m' },
  { id: '3', name: 'Amit K.', role: 'Sales', status: 'online', action: 'Lead follow-up', time: '1m' },
  { id: '4', name: 'Neha P.', role: 'HR', status: 'away', action: 'Meeting', time: '15m' },
  { id: '5', name: 'Vikram J.', role: 'Dev', status: 'online', action: 'Code review', time: '3m' },
];

const statusColors = {
  online: 'bg-emerald-500',
  busy: 'bg-red-500',
  away: 'bg-amber-500',
};

const LiveTeamPanel = ({ collapsed = false }: LiveTeamPanelProps) => {
  const [teamData, setTeamData] = useState<TeamMember[]>(mockTeamData);
  const [pulseIndex, setPulseIndex] = useState(0);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIndex(prev => (prev + 1) % teamData.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [teamData.length]);

  const onlineCount = teamData.filter(m => m.status === 'online').length;
  const busyCount = teamData.filter(m => m.status === 'busy').length;

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <div className="p-2 border-t border-sidebar-border/50">
            <div className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg bg-sidebar-accent/30">
              <div className="relative">
                <Users className="w-5 h-5 text-cyan-400" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full text-[8px] flex items-center justify-center text-white font-bold">
                  {onlineCount}
                </span>
              </div>
              <div className="flex gap-0.5">
                <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500" />
                <Circle className="w-2 h-2 fill-red-500 text-red-500" />
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={10}>
          <div className="text-xs">
            <p className="font-medium">Team Status</p>
            <p className="text-emerald-400">{onlineCount} Online</p>
            <p className="text-red-400">{busyCount} Busy</p>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div className="border-t border-sidebar-border/50 bg-sidebar-accent/20">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-sidebar-border/30">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-sidebar-foreground">Live Team</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[10px] text-emerald-400">
            <Circle className="w-2 h-2 fill-current" />
            {onlineCount}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-red-400">
            <Circle className="w-2 h-2 fill-current" />
            {busyCount}
          </span>
        </div>
      </div>

      {/* Team List */}
      <ScrollArea className="h-[120px]">
        <div className="p-2 space-y-1">
          <AnimatePresence>
            {teamData.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  scale: pulseIndex === index ? 1.02 : 1,
                }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors",
                  pulseIndex === index 
                    ? "bg-cyan-500/10 border border-cyan-500/20" 
                    : "hover:bg-sidebar-accent/40"
                )}
              >
                {/* Status dot */}
                <div className="relative flex-shrink-0">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    statusColors[member.status]
                  )} />
                  {member.status === 'online' && pulseIndex === index && (
                    <motion.div
                      className={cn("absolute inset-0 rounded-full", statusColors[member.status])}
                      animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-medium text-sidebar-foreground truncate">
                      {member.name}
                    </span>
                    <span className="text-[9px] px-1 py-0.5 rounded bg-sidebar-accent text-muted-foreground">
                      {member.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Zap className="w-2.5 h-2.5 text-amber-400" />
                    <span className="truncate">{member.action}</span>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-center gap-0.5 text-[9px] text-muted-foreground flex-shrink-0">
                  <Clock className="w-2.5 h-2.5" />
                  {member.time}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="px-3 py-1.5 border-t border-sidebar-border/30 flex items-center justify-between">
        <span className="text-[9px] text-muted-foreground flex items-center gap-1">
          <Eye className="w-3 h-3" />
          Real-time updates
        </span>
        <motion.div
          className="w-2 h-2 rounded-full bg-cyan-500"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
    </div>
  );
};

export default LiveTeamPanel;
