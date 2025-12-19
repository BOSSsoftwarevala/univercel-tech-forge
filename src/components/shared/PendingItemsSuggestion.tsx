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
  ExternalLink
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
  const [hasShown, setHasShown] = useState(false);

  const pendingItems: PendingItem[] = [
    {
      id: 'domain-protection',
      title: 'Domain Protection',
      description: 'softwarewala.net & softwarevala.net configured',
      status: 'completed',
      category: 'domain',
      icon: <Globe className="w-4 h-4" />,
    },
    {
      id: 'footer-update',
      title: 'Footer Information',
      description: 'Contact details & social links updated',
      status: 'completed',
      category: 'integration',
      icon: <CheckCircle className="w-4 h-4" />,
    },
    {
      id: 'email-notifications',
      title: 'Email Notifications',
      description: 'Activity approval emails to hellosoftwarevala@gmail.com',
      status: 'pending',
      category: 'email',
      icon: <Mail className="w-4 h-4" />,
      action: 'Setup Required',
    },
    {
      id: 'buzzer-system',
      title: 'Buzzer Alert System',
      description: 'Real-time priority alerts configured',
      status: 'completed',
      category: 'integration',
      icon: <Zap className="w-4 h-4" />,
    },
    {
      id: 'rls-policies',
      title: 'Database Security (RLS)',
      description: 'Row-level security policies active',
      status: 'completed',
      category: 'security',
      icon: <Shield className="w-4 h-4" />,
    },
    {
      id: 'database-tables',
      title: 'Database Tables',
      description: 'All required tables configured',
      status: 'completed',
      category: 'database',
      icon: <Database className="w-4 h-4" />,
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

  const statusColors = {
    completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    optional: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  };

  const statusIcons = {
    completed: <CheckCircle className="w-4 h-4 text-emerald-400" />,
    pending: <Clock className="w-4 h-4 text-amber-400" />,
    optional: <AlertTriangle className="w-4 h-4 text-slate-400" />,
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={() => setIsVisible(false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-[101]"
          >
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-primary/20 shadow-2xl shadow-primary/10 overflow-hidden">
              {/* Header */}
              <div className="relative p-6 border-b border-primary/20">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-emerald-500 to-cyan-500" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Setup Progress</h3>
                      <p className="text-xs text-slate-400">SOFTWARE VALA™ Configuration</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsVisible(false)}
                    className="text-slate-400 hover:text-white hover:bg-slate-700/50"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Progress */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-400">
                      {completedCount} of {pendingItems.length} completed
                    </span>
                    <span className="text-primary font-semibold">{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              </div>

              {/* Items List */}
              <div className="p-4 max-h-80 overflow-y-auto space-y-2">
                {pendingItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-xl border transition-all ${
                      item.status === 'pending' 
                        ? 'bg-amber-500/5 border-amber-500/30 hover:border-amber-500/50' 
                        : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        item.status === 'completed' ? 'bg-emerald-500/20' : 
                        item.status === 'pending' ? 'bg-amber-500/20' : 'bg-slate-500/20'
                      }`}>
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-white truncate">{item.title}</p>
                          <Badge className={`text-[10px] ${statusColors[item.status]}`}>
                            {item.status === 'completed' ? 'Done' : item.status === 'pending' ? 'Pending' : 'Optional'}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400">{item.description}</p>
                        {item.action && item.status === 'pending' && (
                          <Button
                            variant="link"
                            size="sm"
                            className="text-amber-400 hover:text-amber-300 p-0 h-auto mt-2 text-xs"
                          >
                            {item.action}
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        {statusIcons[item.status]}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-primary/20 bg-slate-800/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    {pendingCount > 0 ? (
                      <>
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <span>{pendingCount} item{pendingCount > 1 ? 's' : ''} need attention</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span>All configurations complete!</span>
                      </>
                    )}
                  </div>
                  <Button
                    onClick={() => setIsVisible(false)}
                    className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30"
                  >
                    Got it
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PendingItemsSuggestion;
