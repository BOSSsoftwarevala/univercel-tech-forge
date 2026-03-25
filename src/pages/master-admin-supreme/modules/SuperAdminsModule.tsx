import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, Shield, CheckCircle, XCircle, Clock, 
  Activity, TrendingUp, Star, Award, Box
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BlackboxPanel } from '../engines/BlackboxEngine';
import { LiveActivityFeed } from '../engines/LiveActivityEngine';

interface SuperAdmin {
  id: string;
  name: string;
  code: string;
  region: string;
  status: 'active' | 'inactive' | 'suspended';
  approvals: number;
  rejections: number;
  lastActive: string;
  level: number;
  isRented?: boolean;
}

const superAdmins: SuperAdmin[] = [
  { id: '1', name: 'Rajesh Kumar', code: 'SA-0012', region: 'Mumbai', status: 'active', approvals: 234, rejections: 12, lastActive: '2 min ago', level: 3 },
  { id: '2', name: 'Priya Sharma', code: 'SA-0023', region: 'Delhi', status: 'active', approvals: 189, rejections: 8, lastActive: '15 min ago', level: 2 },
  { id: '3', name: 'Amit Patel', code: 'SA-0034', region: 'Bangalore', status: 'active', approvals: 156, rejections: 15, lastActive: '1 hr ago', level: 2, isRented: true },
  { id: '4', name: 'Sneha Reddy', code: 'SA-0045', region: 'Chennai', status: 'inactive', approvals: 98, rejections: 5, lastActive: '3 hrs ago', level: 1 },
  { id: '5', name: 'Vikram Singh', code: 'SA-0056', region: 'Pune', status: 'active', approvals: 312, rejections: 22, lastActive: '5 min ago', level: 4 },
  { id: '6', name: 'Ananya Gupta', code: 'SA-0067', region: 'Kolkata', status: 'suspended', approvals: 45, rejections: 28, lastActive: '2 days ago', level: 1 },
];

export function SuperAdminsModule() {
  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Super Admins', value: '24', icon: Shield, color: 'from-indigo-500 to-blue-600' },
          { label: 'Active Now', value: '18', icon: Activity, color: 'from-green-500 to-emerald-600' },
          { label: 'Approvals Today', value: '847', icon: CheckCircle, color: 'from-amber-500 to-orange-600' },
          { label: 'Avg Response', value: '4.2m', icon: Clock, color: 'from-purple-500 to-violet-600' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4 bg-gradient-to-br from-white/10 to-white/5 border-white/10 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-white/50">{stat.label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Super Admin Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {superAdmins.map((admin, index) => (
          <motion.div
            key={admin.id}
            initial={{ opacity: 0, y: 30, rotateX: -10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ y: -6, scale: 1.02 }}
            className="group"
          >
            <Card className="relative p-5 bg-gradient-to-br from-indigo-950/50 to-blue-950/50 border-amber-500/20 backdrop-blur-xl overflow-hidden shadow-xl hover:shadow-amber-500/10 transition-all">
              {/* Embossed effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

              {/* Rental badge */}
              {admin.isRented && (
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20 border border-amber-500/30">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span className="text-[10px] text-amber-300">Rented</span>
                </div>
              )}

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <Avatar className="w-14 h-14 border-2 border-amber-500/30">
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white text-lg font-bold">
                        {admin.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-indigo-950 ${
                      admin.status === 'active' ? 'bg-green-400' :
                      admin.status === 'inactive' ? 'bg-gray-400' : 'bg-red-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white">{admin.name}</h3>
                      {admin.level >= 3 && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-[10px] font-mono">
                        {admin.code}
                      </Badge>
                      <span className="text-xs text-white/40">{admin.region}</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-white/50">Approved</span>
                    </div>
                    <p className="text-xl font-bold text-green-400 mt-1">{admin.approvals}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-400" />
                      <span className="text-xs text-white/50">Rejected</span>
                    </div>
                    <p className="text-xl font-bold text-red-400 mt-1">{admin.rejections}</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div className="flex items-center gap-1 text-xs text-white/40">
                    <Clock className="w-3 h-3" />
                    <span>{admin.lastActive}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Award
                        key={i}
                        className={`w-4 h-4 ${i < admin.level ? 'text-amber-400' : 'text-white/20'}`}
                        fill={i < admin.level ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Blackbox Activity History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="relative">
            <div className="absolute -top-2 left-4 px-3 py-1 bg-amber-500/20 rounded-full border border-amber-500/30">
              <div className="flex items-center gap-2">
                <Box className="w-3 h-3 text-amber-400" />
                <span className="text-[10px] text-amber-300 uppercase tracking-wider font-bold">Super Admin Activity Log</span>
              </div>
            </div>
            <BlackboxPanel maxEvents={8} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-4 bg-gradient-to-br from-indigo-950/50 to-blue-950/50 border-amber-500/20 backdrop-blur-xl h-full">
            <LiveActivityFeed maxEvents={8} />
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
