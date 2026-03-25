import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Eye, 
  AlertTriangle,
  Clock,
  MapPin,
  Activity,
  Ban
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useAdminActions } from '@/hooks/useAdminActions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface SuperAdmin {
  id: string;
  name: string;
  region: string;
  status: 'active' | 'inactive' | 'suspended';
  lastActivity: string;
  riskScore: number;
  scope: string[];
}

const superAdmins: SuperAdmin[] = [
  { id: '1', name: 'Alexander Thompson', region: 'North America', status: 'active', lastActivity: '2 min ago', riskScore: 12, scope: ['USA', 'Canada', 'Mexico'] },
  { id: '2', name: 'Maria Garcia', region: 'Europe', status: 'active', lastActivity: '15 min ago', riskScore: 8, scope: ['Spain', 'France', 'Germany'] },
  { id: '3', name: 'Wei Chen', region: 'Asia Pacific', status: 'active', lastActivity: '1 hour ago', riskScore: 15, scope: ['China', 'Japan', 'Korea'] },
  { id: '4', name: 'James Wilson', region: 'Middle East', status: 'inactive', lastActivity: '3 days ago', riskScore: 45, scope: ['UAE', 'Saudi Arabia'] },
  { id: '5', name: 'Sarah Johnson', region: 'Africa', status: 'active', lastActivity: '30 min ago', riskScore: 22, scope: ['Nigeria', 'Kenya', 'South Africa'] },
  { id: '6', name: 'Robert Brown', region: 'South America', status: 'suspended', lastActivity: '7 days ago', riskScore: 78, scope: ['Brazil', 'Argentina'] },
];

const statusColors = {
  active: 'bg-green-500/20 text-green-400 border-green-500/30',
  inactive: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  suspended: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const getRiskColor = (score: number) => {
  if (score < 20) return 'text-green-400';
  if (score < 50) return 'text-amber-400';
  return 'text-red-400';
};

export function SuperAdminsView() {
  const navigate = useNavigate();
  const { suspendAdmin, viewAdminDetails } = useAdminActions();
  const [searchQuery, setSearchQuery] = useState('');
  const [suspendReason, setSuspendReason] = useState('');

  const filteredAdmins = superAdmins.filter(admin =>
    admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Super Admins</h1>
          <p className="text-white/50 text-sm">Monitor and manage system administrators</p>
        </div>
        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
          {superAdmins.filter(a => a.status === 'active').length} Active
        </Badge>
      </div>

      {/* Search */}
      <div className="relative">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or region..."
          className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
        />
      </div>

      {/* Admin List */}
      <div className="grid gap-4">
        {filteredAdmins.map((admin, index) => (
          <motion.div
            key={admin.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-[#12121a] border-white/10 hover:border-white/20 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Avatar & Name */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
                    <Shield className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{admin.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-white/50">
                      <MapPin className="w-3 h-3" />
                      {admin.region}
                    </div>
                  </div>

                  {/* Status */}
                  <Badge className={`${statusColors[admin.status]} border`}>
                    {admin.status.toUpperCase()}
                  </Badge>

                  {/* Last Activity */}
                  <div className="text-right min-w-[100px]">
                    <div className="flex items-center gap-1 text-xs text-white/40">
                      <Clock className="w-3 h-3" />
                      {admin.lastActivity}
                    </div>
                  </div>

                  {/* Risk Score */}
                  <div className="text-right min-w-[80px]">
                    <div className={`text-lg font-bold ${getRiskColor(admin.riskScore)}`}>
                      {admin.riskScore}
                    </div>
                    <div className="text-[10px] text-white/40 uppercase">Risk</div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-white/50 hover:text-white hover:bg-white/10"
                        onClick={async () => {
                          const details = await viewAdminDetails(admin.id);
                          if (details) {
                            navigate(`/super-admin/${admin.id}`, { state: { adminDetails: details } });
                          }
                        }}
                      title="View admin details"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    {admin.status !== 'suspended' && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-red-400/50 hover:text-red-400 hover:bg-red-500/10"
                          >
                            <Ban className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-[#1a1a2e] border-red-500/30">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-red-400 flex items-center gap-2">
                              <AlertTriangle className="w-5 h-5" />
                              Suspend Super Admin
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-white/70">
                              You are about to suspend <strong className="text-white">{admin.name}</strong>.
                              This action requires 2FA verification.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="py-4">
                            <label className="text-sm text-white/70 mb-2 block">Reason for suspension</label>
                            <Input
                              value={suspendReason}
                              onChange={(e) => setSuspendReason(e.target.value)}
                              placeholder="Enter reason..."
                              className="bg-white/5 border-white/10 text-white"
                            />
                          </div>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-red-600 hover:bg-red-700 text-white"
                              onClick={() => {
                                  suspendAdmin(admin.id, admin.name, suspendReason).then(success => {
                                    if (success) {
                                      setSuspendReason('');
                                    }
                                  });
                                setSuspendReason('');
                              }}
                            >
                              Verify & Suspend
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>

                {/* Scope */}
                <div className="mt-3 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-white/40 uppercase">Scope:</span>
                    <div className="flex gap-1 flex-wrap">
                      {admin.scope.map((country) => (
                        <Badge 
                          key={country} 
                          variant="outline" 
                          className="text-[10px] border-white/10 text-white/60"
                        >
                          {country}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
