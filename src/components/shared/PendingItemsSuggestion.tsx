import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  X, 
  Globe, 
  Mail, 
  Shield, 
  Database,
  Zap,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface PendingItem {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'pending' | 'optional';
  category: 'domain' | 'email' | 'security' | 'database' | 'integration';
  icon: React.ReactNode;
  action?: string;
  actionUrl?: string;
}

const PendingItemsSuggestion = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  const pendingItems: PendingItem[] = [
    {
      id: 'domain-protection',
      title: 'Domain Protection',
      description: 'softwarewala.net & softwarevala.net configured',
      status: 'completed',
      category: 'domain',
      icon: <Globe className="w-3 h-3" />,
    },
    {
      id: 'footer-update',
      title: 'Footer Information',
      description: 'Contact details & social links updated',
      status: 'completed',
      category: 'integration',
      icon: <CheckCircle className="w-3 h-3" />,
    },
    {
      id: 'email-notifications',
      title: 'Email Notifications',
      description: 'Activity approval emails to hellosoftwarevala@gmail.com',
      status: 'pending',
      category: 'email',
      icon: <Mail className="w-3 h-3" />,
      action: 'Setup Required',
    },
    {
      id: 'buzzer-system',
      title: 'Buzzer Alert System',
      description: 'Real-time priority alerts configured',
      status: 'completed',
      category: 'integration',
      icon: <Zap className="w-3 h-3" />,
    },
    {
      id: 'rls-policies',
      title: 'Database Security (RLS)',
      description: 'Row-level security policies active',
      status: 'completed',
      category: 'security',
      icon: <Shield className="w-3 h-3" />,
    },
    {
      id: 'database-tables',
      title: 'Database Tables',
      description: 'All required tables configured',
      status: 'completed',
      category: 'database',
      icon: <Database className="w-3 h-3" />,
    },
  ];

  const completedCount = pendingItems.filter(item => item.status === 'completed').length;
  const pendingCount = pendingItems.filter(item => item.status === 'pending').length;
  const progressPercentage = (completedCount / pendingItems.length) * 100;

  // Auto-show after 2 seconds if there are pending items
  useEffect(() => {
    if (pendingCount > 0 && !hasShown) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setHasShown(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [pendingCount, hasShown]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-1 left-1/2 -translate-x-1/2 z-[100]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative"
      >
        {/* Compact Header Bar */}
        <div 
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/95 backdrop-blur-lg border border-primary/30 shadow-lg shadow-primary/10 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="relative">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            )}
          </div>
          
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-medium text-slate-300">Setup</span>
            <span className="text-[10px] font-bold text-primary">{Math.round(progressPercentage)}%</span>
          </div>
          
          <div className="w-12 h-1 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-cyan-400 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {isExpanded ? (
            <ChevronUp className="w-3 h-3 text-slate-400" />
          ) : (
            <ChevronDown className="w-3 h-3 text-slate-400" />
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsVisible(false);
            }}
            className="p-0.5 hover:bg-slate-700 rounded-full transition-colors"
          >
            <X className="w-3 h-3 text-slate-400" />
          </button>
        </div>

        {/* Expanded Dropdown */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-slate-900/98 backdrop-blur-xl rounded-xl border border-primary/20 shadow-xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-3 border-b border-primary/20 bg-slate-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold text-white">Setup Progress</span>
                  </div>
                  <Badge className="text-[9px] bg-primary/20 text-primary border-primary/30">
                    {completedCount}/{pendingItems.length}
                  </Badge>
                </div>
              </div>

              {/* Items */}
              <div className="max-h-48 overflow-y-auto p-2 space-y-1">
                {pendingItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-2 p-2 rounded-lg text-[10px] ${
                      item.status === 'pending' 
                        ? 'bg-amber-500/10 border border-amber-500/20' 
                        : 'bg-slate-800/30'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center ${
                      item.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 
                      item.status === 'pending' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/20 text-slate-400'
                    }`}>
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">{item.title}</p>
                    </div>
                    {item.status === 'completed' ? (
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Clock className="w-3 h-3 text-amber-400" />
                    )}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-2 border-t border-primary/20 bg-slate-800/30">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">
                    {pendingCount > 0 ? `${pendingCount} pending` : 'All complete!'}
                  </span>
                  <button 
                    onClick={() => setIsVisible(false)}
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PendingItemsSuggestion;
