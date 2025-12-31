import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Clock, Lock, AlertTriangle, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

interface SecureWorkspaceHeaderProps {
  valaId: string;
  roleLevel: string;
  sessionTime: string;
  isFrozen: boolean;
  onLogout: () => void;
}

export function SecureWorkspaceHeader({
  valaId,
  roleLevel,
  sessionTime,
  isFrozen,
  onLogout
}: SecureWorkspaceHeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-14 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between px-6 select-none">
      <div className="flex items-center gap-6">
        {/* System Identifier */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-neutral-800 flex items-center justify-center">
            <Shield className="h-4 w-4 text-neutral-400" />
          </div>
          <div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider">Secure Control System</div>
            <div className="text-sm font-mono text-neutral-300">{roleLevel}</div>
          </div>
        </div>

        {/* Status Indicator */}
        {isFrozen ? (
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="flex items-center gap-2 px-3 py-1 rounded bg-red-950 border border-red-800"
          >
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <span className="text-xs text-red-400 font-medium">SYSTEM FROZEN</span>
          </motion.div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-green-950/50 border border-green-900/50">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-green-400 font-medium">SECURE</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        {/* Vala ID */}
        <div className="text-right">
          <div className="text-xs text-neutral-500 uppercase tracking-wider">Vala ID</div>
          <div className="text-sm font-mono text-neutral-300">{valaId}</div>
        </div>

        {/* Session Timer */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-neutral-900 border border-neutral-800">
          <Clock className="h-4 w-4 text-neutral-500" />
          <span className="text-sm font-mono text-neutral-400">{sessionTime}</span>
        </div>

        {/* System Time */}
        <div className="text-sm font-mono text-neutral-500">
          {currentTime.toLocaleTimeString('en-US', { hour12: false })}
        </div>

        {/* Logout */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800"
        >
          <LogOut className="h-4 w-4 mr-2" />
          End Session
        </Button>
      </div>
    </header>
  );
}
