import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, Users, MapPin, Brain, Crown, 
  ArrowRight, Lock, AlertTriangle, Eye, EyeOff,
  Fingerprint, Clock, Server, Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const roles = [
  {
    id: 'operation',
    title: 'FRONT / OPERATION',
    description: 'Process requests and data entry',
    icon: Users,
    path: '/vala/operation',
    color: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/30',
    iconColor: 'text-blue-400',
    accessLevel: 1
  },
  {
    id: 'regional',
    title: 'AREA / REGIONAL',
    description: 'Regional review and compliance',
    icon: MapPin,
    path: '/vala/regional',
    color: 'from-emerald-500/20 to-teal-500/20',
    borderColor: 'border-emerald-500/30',
    iconColor: 'text-emerald-400',
    accessLevel: 2
  },
  {
    id: 'ai_head',
    title: 'AI HEAD',
    description: 'Behavior analysis and risk reports',
    icon: Brain,
    path: '/vala/ai-head',
    color: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'border-purple-500/30',
    iconColor: 'text-purple-400',
    accessLevel: 3
  },
  {
    id: 'master',
    title: 'MASTER ADMIN',
    description: 'Final authority and override',
    icon: Crown,
    path: '/vala/master',
    color: 'from-amber-500/20 to-orange-500/20',
    borderColor: 'border-amber-500/30',
    iconColor: 'text-amber-400',
    accessLevel: 4
  }
];

const securityFeatures = [
  { icon: Lock, label: 'Clipboard Disabled' },
  { icon: Eye, label: 'Screenshot Blocked' },
  { icon: Fingerprint, label: 'Biometric Ready' },
  { icon: Database, label: 'Encrypted Storage' },
];

export default function ValaControlHub() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [valaIdInput, setValaIdInput] = useState('');
  const [showValaId, setShowValaId] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [systemTime, setSystemTime] = useState(new Date());

  // Update system time
  useEffect(() => {
    const timer = setInterval(() => setSystemTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRoleAccess = async (role: typeof roles[0]) => {
    if (!valaIdInput.trim()) {
      toast({
        title: "Vala ID Required",
        description: "Enter your Vala ID to proceed",
        variant: "destructive"
      });
      return;
    }

    setSelectedRole(role.id);
    setIsAuthenticating(true);

    // Simulate authentication
    await new Promise(r => setTimeout(r, 1500));

    console.log(`[AUDIT] Role access: ${role.id} by VALA-${valaIdInput} at ${new Date().toISOString()}`);

    setIsAuthenticating(false);
    navigate(role.path);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-900 bg-zinc-950">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Shield className="w-7 h-7 text-zinc-400" />
            <div>
              <h1 className="text-xl font-mono font-bold tracking-widest">
                VALA CONTROL SYSTEM
              </h1>
              <p className="text-xs font-mono text-zinc-600 tracking-wider">
                ENTERPRISE-GRADE ISOLATED ACCESS
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 rounded border border-zinc-800">
            <Server className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-xs font-mono text-zinc-400">SECURE</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 rounded border border-zinc-800">
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-xs font-mono text-zinc-400">
              {systemTime.toLocaleTimeString('en-US', { hour12: false })}
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-4xl w-full">
          {/* Vala ID Input */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg"
          >
            <label className="block text-xs font-mono text-zinc-500 mb-2 tracking-wider">
              ENTER VALA ID TO PROCEED
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <Input
                  type={showValaId ? 'text' : 'password'}
                  value={valaIdInput}
                  onChange={(e) => setValaIdInput(e.target.value.toUpperCase())}
                  placeholder="VALA-XXXXXXXX"
                  className="pl-10 pr-10 bg-black border-zinc-700 font-mono tracking-widest"
                />
                <button
                  onClick={() => setShowValaId(!showValaId)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400"
                >
                  {showValaId ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Security Features */}
          <div className="flex items-center justify-center gap-6 mb-8">
            {securityFeatures.map((feature, idx) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-2 text-xs text-zinc-600"
              >
                <feature.icon className="w-3.5 h-3.5" />
                <span className="font-mono">{feature.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Role Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roles.map((role, idx) => (
              <motion.button
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => handleRoleAccess(role)}
                disabled={isAuthenticating}
                className={`
                  p-6 rounded-lg bg-gradient-to-br ${role.color} 
                  border ${role.borderColor} text-left
                  hover:scale-[1.02] transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  relative overflow-hidden
                `}
              >
                {/* Processing Overlay */}
                <AnimatePresence>
                  {isAuthenticating && selectedRole === role.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/80 flex items-center justify-center"
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <Lock className="w-5 h-5 text-white" />
                        </motion.div>
                        <span className="font-mono text-sm">AUTHENTICATING...</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-black/30`}>
                    <role.icon className={`w-6 h-6 ${role.iconColor}`} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-zinc-500">LVL {role.accessLevel}</span>
                    <ArrowRight className="w-5 h-5 text-zinc-600" />
                  </div>
                </div>
                <h3 className="text-lg font-mono font-semibold tracking-wider mb-1">
                  {role.title}
                </h3>
                <p className="text-sm text-zinc-500">{role.description}</p>
              </motion.button>
            ))}
          </div>

          {/* System Rules */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-4 bg-zinc-900/30 border border-zinc-800 rounded-lg"
          >
            <h3 className="text-xs font-mono text-zinc-500 mb-3 tracking-wider">
              SYSTEM RULES
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono text-zinc-600">
              <div className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> No copy/export
              </div>
              <div className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> No screenshot
              </div>
              <div className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> No edit after submit
              </div>
              <div className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Append-only logs
              </div>
            </div>
          </motion.div>

          {/* Workflow Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-4 p-4 bg-zinc-900/30 border border-zinc-800 rounded-lg"
          >
            <h3 className="text-xs font-mono text-zinc-500 mb-3 tracking-wider">
              VERTICAL FLOW
            </h3>
            <div className="flex items-center justify-center gap-2 text-xs font-mono">
              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">Action</span>
              <ArrowRight className="w-3 h-3 text-zinc-600" />
              <span className="px-2 py-1 bg-zinc-800 text-zinc-400 rounded">Debug</span>
              <ArrowRight className="w-3 h-3 text-zinc-600" />
              <span className="px-2 py-1 bg-zinc-800 text-zinc-400 rounded">Check</span>
              <ArrowRight className="w-3 h-3 text-zinc-600" />
              <span className="px-2 py-1 bg-zinc-800 text-zinc-400 rounded">Lock</span>
              <ArrowRight className="w-3 h-3 text-zinc-600" />
              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded">Forward</span>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-zinc-900 bg-zinc-950">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-700">
            <span>VALA ID ONLY • NO PERSONAL IDENTITY</span>
            <span>CNS CHECKSUM ACTIVE</span>
            <span>VERTICAL FLOW ONLY</span>
          </div>
        </div>
      </footer>
    </div>
  );
}