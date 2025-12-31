import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, Users, MapPin, Brain, Crown, 
  ArrowRight, Lock, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const roles = [
  {
    id: 'operation',
    title: 'FRONT / OPERATION',
    description: 'Process requests and data entry',
    icon: Users,
    path: '/vala/operation',
    color: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/30',
    iconColor: 'text-blue-400'
  },
  {
    id: 'regional',
    title: 'AREA / REGIONAL',
    description: 'Regional review and compliance',
    icon: MapPin,
    path: '/vala/regional',
    color: 'from-emerald-500/20 to-teal-500/20',
    borderColor: 'border-emerald-500/30',
    iconColor: 'text-emerald-400'
  },
  {
    id: 'ai_head',
    title: 'AI HEAD',
    description: 'Behavior analysis and risk reports',
    icon: Brain,
    path: '/vala/ai-head',
    color: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'border-purple-500/30',
    iconColor: 'text-purple-400'
  },
  {
    id: 'master',
    title: 'MASTER ADMIN',
    description: 'Final authority and override',
    icon: Crown,
    path: '/vala/master',
    color: 'from-amber-500/20 to-orange-500/20',
    borderColor: 'border-amber-500/30',
    iconColor: 'text-amber-400'
  }
];

export default function ValaControlHub() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-center py-8 border-b border-zinc-900">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-zinc-500" />
            <h1 className="text-2xl font-mono font-bold tracking-widest">
              VALA CONTROL SYSTEM
            </h1>
          </div>
          <p className="text-xs font-mono text-zinc-600 tracking-wider">
            ENTERPRISE-GRADE ISOLATED ACCESS
          </p>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-4xl w-full">
          {/* Notice */}
          <div className="flex items-center justify-center gap-2 mb-8 p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg">
            <Lock className="w-4 h-4 text-zinc-500" />
            <p className="text-xs font-mono text-zinc-500">
              Each role is fully isolated. No cross-role visibility. All actions logged.
            </p>
          </div>

          {/* Role Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roles.map((role, idx) => (
              <motion.button
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => navigate(role.path)}
                className={`
                  p-6 rounded-lg bg-gradient-to-br ${role.color} 
                  border ${role.borderColor} text-left
                  hover:scale-[1.02] transition-transform
                `}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-black/30`}>
                    <role.icon className={`w-6 h-6 ${role.iconColor}`} />
                  </div>
                  <ArrowRight className="w-5 h-5 text-zinc-600" />
                </div>
                <h3 className="text-lg font-mono font-semibold tracking-wider mb-1">
                  {role.title}
                </h3>
                <p className="text-sm text-zinc-500">{role.description}</p>
              </motion.button>
            ))}
          </div>

          {/* System Rules */}
          <div className="mt-8 p-4 bg-zinc-900/30 border border-zinc-800 rounded-lg">
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
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-zinc-900 text-center">
        <p className="text-xs font-mono text-zinc-700">
          VALA ID ONLY • NO PERSONAL IDENTITY • VERTICAL FLOW ONLY
        </p>
      </footer>
    </div>
  );
}
